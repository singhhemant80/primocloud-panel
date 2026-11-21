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
import { prisma } from "../src/db";
import { encrypt, encryptJson } from "../src/lib/crypto";
import { importCidr } from "../src/modules/ipam/service";

import { syncCatalog, USD_TO_INR } from "./sync-catalog";

const R = (rupees: number) => Math.round(rupees * 100);



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

  // location
  const gwl = await prisma.location.upsert({ where: { code: "NOI" }, update: {}, create: { name: "Noida, India", code: "NOI", country: "IN" } });

  // OS templates + the website's plans (also run on every update by deploy/install.sh)
  await syncCatalog();

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
