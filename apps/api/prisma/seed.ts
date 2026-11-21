/**
 * Seeds PrimoCloud with the catalogue from the primocloud.in website (prisma/catalog.ts — the slugs
 * the website's order buttons link to), roles, departments, templates and an admin account.
 *
 *   SEED_ADMIN_EMAIL=admin@primocloud.in SEED_ADMIN_PASSWORD='…' npm run db:seed
 *   SEED_DEMO=true …   also adds a dry-run Proxmox server, a test subnet, domain pricing and a demo client
 */
import "dotenv/config";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { prisma, BillingCycle, ProductType, Provisioner } from "../src/db";
import { encrypt, encryptJson } from "../src/lib/crypto";
import { importCidr } from "../src/modules/ipam/service";
import { CATALOG } from "./catalog";

/** Website prices are USD; INR = USD × this rate (same as INR_RATE in apps/site/src/context/CurrencyContext.jsx). */
const USD_TO_INR = 88;
const paise = (usd: number) => Math.round(usd * USD_TO_INR) * 100; // whole rupees, as the website shows them
const cents = (usd: number) => Math.round(usd * 100);
const R = (rupees: number) => Math.round(rupees * 100);

const VPS_FEATURES = ["Full root / admin access", "KVM virtualization", "NVMe storage", "DDoS protection", "Choose your IPv4 address", "99.99% uptime SLA"];

const OS = [
  { name: "Ubuntu 24.04 LTS", family: "linux", vmid: 9000, lxc: "local:vztmpl/ubuntu-24.04-standard_24.04-2_amd64.tar.zst" },
  { name: "Ubuntu 22.04 LTS", family: "linux", vmid: 9001, lxc: "local:vztmpl/ubuntu-22.04-standard_22.04-1_amd64.tar.zst" },
  { name: "Debian 12", family: "linux", vmid: 9002, lxc: "local:vztmpl/debian-12-standard_12.7-1_amd64.tar.zst" },
  { name: "AlmaLinux 9", family: "linux", vmid: 9003, lxc: "local:vztmpl/almalinux-9-default_20240911_amd64.tar.xz" },
  { name: "Rocky Linux 9", family: "linux", vmid: 9004, lxc: "local:vztmpl/rockylinux-9-default_20240912_amd64.tar.xz" },
  { name: "Windows Server 2022", family: "windows", vmid: 9010, lxc: null },
  { name: "Windows Server 2019", family: "windows", vmid: 9011, lxc: null },
];

async function main() {
  const demo = process.env.SEED_DEMO === "true";

  // roles
  const roles = [
    { name: "Administrator", description: "Full access", permissions: ["*"] },
    { name: "Support Agent", description: "Tickets, read-only clients & services", permissions: ["tickets.manage", "clients.view", "services.view", "ips.view", "billing.view", "orders.view"] },
    { name: "Billing", description: "Invoices, payments and orders", permissions: ["billing.manage", "payments.manage", "clients.view", "orders.manage", "reports.view", "tickets.view"] },
    { name: "Sales", description: "Orders and pre-sales tickets", permissions: ["orders.view", "clients.view", "tickets.manage", "products.manage"] },
    { name: "Network Engineer", description: "Servers, IPs and VPS operations", permissions: ["servers.manage", "ips.manage", "services.manage", "clients.view", "tickets.manage"] },
  ];
  for (const r of roles) await prisma.role.upsert({ where: { name: r.name }, update: { permissions: r.permissions, description: r.description }, create: r });
  const adminRole = await prisma.role.findUniqueOrThrow({ where: { name: "Administrator" } });

  const adminEmail = (process.env.SEED_ADMIN_EMAIL ?? "admin@primocloud.in").toLowerCase();
  if (!(await prisma.user.findUnique({ where: { email: adminEmail } }))) {
    const pw = process.env.SEED_ADMIN_PASSWORD ?? crypto.randomBytes(12).toString("base64url");
    await prisma.user.create({ data: { type: "STAFF", email: adminEmail, firstName: "PrimoCloud", lastName: "Admin", passwordHash: await bcrypt.hash(pw, 12), roleId: adminRole.id, emailVerifiedAt: new Date() } });
    console.log(`\n  Admin login: ${adminEmail}\n  Password:    ${process.env.SEED_ADMIN_PASSWORD ? "(from SEED_ADMIN_PASSWORD)" : pw}\n`);
  }

  // currencies
  await prisma.currency.upsert({ where: { code: "INR" }, update: {}, create: { code: "INR", prefix: "₹", rate: 1, isDefault: true } });
  await prisma.currency.upsert({ where: { code: "USD" }, update: {}, create: { code: "USD", prefix: "$", rate: +(1 / USD_TO_INR).toFixed(6) } });

  // departments
  const depts = ["Technical Support", "Billing Support", "Network Support", "Abuse Department", "Sales Department"];
  for (const [i, name] of depts.entries())
    await prisma.ticketDepartment.upsert({ where: { name }, update: {}, create: { name, sortOrder: i, slaHours: name === "Abuse Department" ? 2 : name === "Sales Department" ? 8 : 4 } });

  // OS templates (Proxmox VMIDs are the conventional 9000+ template IDs — edit them in Admin → OS Templates)
  const osRows = [];
  for (const [i, o] of OS.entries()) {
    const existing = await prisma.osTemplate.findFirst({ where: { name: o.name } });
    osRows.push(
      existing ??
        (await prisma.osTemplate.create({ data: { name: o.name, family: o.family, proxmoxKvmVmid: o.vmid, proxmoxLxcVolid: o.lxc, defaultUser: o.family === "windows" ? "Administrator" : "root", sortOrder: i } })),
    );
  }

  // location
  const gwl = await prisma.location.upsert({ where: { code: "NOI" }, update: {}, create: { name: "Noida, India", code: "NOI", country: "IN" } });

  // catalogue (prices: website USD exactly, INR at USD_TO_INR; monthly + annual like the website)
  for (const [gi, g] of CATALOG.entries()) {
    const group = await prisma.productGroup.upsert({ where: { slug: g.slug }, update: { name: g.name, headline: g.headline }, create: { name: g.name, slug: g.slug, headline: g.headline, sortOrder: gi } });
    for (const [pi, p] of g.plans.entries()) {
      if (await prisma.product.findUnique({ where: { slug: p.slug } })) continue;
      const isVps = g.provisioner === "PROXMOX";
      const cycles: { cycle: BillingCycle; usd: number; setupUsd: number }[] = [{ cycle: "MONTHLY", usd: p.usd, setupUsd: p.setupUsd ?? 0 }];
      if (p.usdAnnual) cycles.push({ cycle: "ANNUAL", usd: p.usdAnnual * 12, setupUsd: 0 });
      const inr = (usd: number, cycle: BillingCycle) => (cycle === "ANNUAL" ? paise(usd / 12) * 12 : paise(usd));
      const prod = await prisma.product.create({
        data: {
          groupId: group.id,
          name: p.name,
          slug: p.slug,
          type: g.type,
          tagline: p.tagline,
          features: p.features.length ? p.features : isVps ? VPS_FEATURES : [],
          provisioner: g.provisioner,
          virtType: "KVM",
          cpuCores: p.cpu ?? null,
          ramMb: p.ram ? p.ram * 1024 : null,
          diskGb: p.disk ?? null,
          bandwidthGb: p.bw === undefined ? null : p.bw,
          ipv4Count: isVps ? (p.ipv4 ?? 1) : 0,
          allowIpSelection: isVps,
          requireHostname: isVps,
          featured: !!p.featured,
          sortOrder: pi,
          resellerEnabled: g.resellerEnabled,
          hsnSac: "998315",
          pricing: {
            create: cycles.flatMap(({ cycle, usd, setupUsd }) => [
              { cycle, currency: "INR", price: inr(usd, cycle), setupFee: setupUsd ? paise(setupUsd) : 0, enabled: true },
              { cycle, currency: "USD", price: cents(usd), setupFee: cents(setupUsd), enabled: true },
            ]),
          },
          wholesalePricing: g.resellerEnabled ? { create: cycles.map(({ cycle, usd }) => ({ cycle, price: Math.round(inr(usd, cycle) * 0.8) })) } : undefined,
        },
      });
      if (isVps && g.os !== "none") {
        await prisma.productOs.createMany({ data: osRows.filter((o) => g.os === "any" || o.family === g.os).map((o) => ({ productId: prod.id, osTemplateId: o.id })) });
      }
    }
  }

  // payment gateways (disabled until configured in Admin → Payment Gateways)
  const gw = [
    ["razorpay", "Razorpay — UPI, Cards, Netbanking, Wallets"],
    ["cashfree", "Cashfree — UPI, Cards, Netbanking"],
    ["payu", "PayU"],
    ["stripe", "Stripe — International cards"],
    ["upi", "UPI (Scan & Pay)"],
    ["bank", "Bank Transfer (NEFT / RTGS / IMPS)"],
    ["manual", "Manual / Cash / Cheque"],
    ["custom", "Custom gateway"],
  ];
  for (const [i, [code, name]] of gw.entries()) await prisma.paymentGateway.upsert({ where: { code }, update: {}, create: { code, name, sortOrder: i, enabled: false, configEnc: encryptJson({}) } });

  if (demo) {
    console.log("  Adding demo data (dry-run Proxmox server, test subnet, demo client)…");
    let server = await prisma.server.findFirst({ where: { name: { in: ["PVE Noida 1 (demo)", "PVE Gwalior 1 (demo)"] } } });
    if (!server)
      server = await prisma.server.create({
        data: { name: "PVE Noida 1 (demo)", type: "PROXMOX", locationId: gwl.id, hostname: "pve1.example.invalid", port: 8006, apiUser: "billing@pve!primocloud", apiSecretEnc: encrypt("00000000-0000-0000-0000-000000000000"), verifyTls: false, storage: "local-lvm", bridge: "vmbr0" },
      });
    const vpsProducts = await prisma.product.findMany({ where: { provisioner: "PROXMOX" } });
    await prisma.productServer.createMany({ data: vpsProducts.map((p) => ({ productId: p.id, serverId: server!.id })), skipDuplicates: true });
    await importCidr({ cidr: "203.0.113.0/26", serverId: server.id, locationId: gwl.id, gateway: "203.0.113.1", notes: "Demo range (RFC 5737 TEST-NET-3)" });
    const tlds: [string, number, number][] = [[".in", 599, 799], [".co.in", 499, 699], [".com", 899, 1099], [".net", 1099, 1299], [".org", 999, 1199]];
    for (const [tld, reg, renew] of tlds) await prisma.domainPricing.upsert({ where: { tld }, update: {}, create: { tld, register: R(reg), transfer: R(renew), renew: R(renew) } });
    await prisma.paymentGateway.update({ where: { code: "upi" }, data: { enabled: true, publicConfig: { vpa: "primocloud@upi", payeeName: "Crapplet Infotech Pvt Ltd" } } });
    await prisma.paymentGateway.update({ where: { code: "bank" }, data: { enabled: true, publicConfig: { instructions: "Bank: <your bank>\nA/C name: Crapplet Infotech Private Limited\nA/C no: <account>\nIFSC: <ifsc>\nUse your invoice number as the payment reference." } } });
    if (!(await prisma.user.findUnique({ where: { email: "demo@primocloud.test" } }))) {
      await prisma.user.create({
        data: {
          email: "demo@primocloud.test",
          firstName: "Asha",
          lastName: "Verma",
          phone: "+91 98260 00000",
          passwordHash: await bcrypt.hash("Demo@12345", 12),
          emailVerifiedAt: new Date(),
          profile: { create: { companyName: "Verma Traders", address1: "12 MG Road", city: "Indore", state: "Madhya Pradesh", stateCode: "23", country: "IN", postcode: "452001" } },
        },
      });
      console.log("  Demo client: demo@primocloud.test / Demo@12345");
    }
    if (!(await prisma.announcement.count())) await prisma.announcement.create({ data: { title: "Welcome to the new PrimoCloud client area", body: "Choose your own IPv4 address when ordering a VPS, manage your servers and pay invoices with UPI — all in one place." } });
    if (!(await prisma.kbCategory.count())) {
      const cat = await prisma.kbCategory.create({ data: { name: "VPS", slug: "vps" } });
      await prisma.kbArticle.create({ data: { categoryId: cat.id, title: "Connecting to your Linux VPS with SSH", slug: "connect-linux-vps-ssh", body: "Open a terminal and run:\n\n    ssh root@YOUR_SERVER_IP\n\nYour root password is in the VPS activation email and under My Services → your VPS → Show password." } });
    }
  }
  console.log("  Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
