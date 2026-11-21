/**
 * Brings the panel's catalogue in line with the website (prisma/catalog.ts):
 *  - creates OS templates, plan groups and plans that don't exist yet (by slug)
 *  - hides plans the website no longer shows (RETIRED), so existing services keep working
 * Never changes a plan that already exists — prices and settings edited in Admin → Products stay.
 * Runs from seed.ts on first install and from deploy/install.sh on every update.
 *
 *   npx tsx prisma/sync-catalog.ts
 */
import "dotenv/config";
import { prisma, type BillingCycle } from "../src/db";
import { CATALOG } from "./catalog";

/** Website prices are USD; INR = USD × this rate (same as INR_RATE in apps/site/src/context/CurrencyContext.jsx). */
export const USD_TO_INR = 88;
const paise = (usd: number) => Math.round(usd * USD_TO_INR) * 100; // whole rupees, as the website shows them
const cents = (usd: number) => Math.round(usd * 100);

const VPS_FEATURES = ["Full root / admin access", "KVM virtualization", "NVMe storage", "DDoS protection", "Choose your IPv4 address", "99.99% uptime SLA"];

/** Plans earlier versions of the website sold. Hidden from the order pages; existing services are untouched. */
const RETIRED = ["lin-starter", "lin-dev", "lin-pro", "lin-scale", "win-basic", "win-pro", "win-elite", "win-extreme"];

const OS = [
  { name: "Ubuntu 24.04 LTS", family: "linux", vmid: 9000, lxc: "local:vztmpl/ubuntu-24.04-standard_24.04-2_amd64.tar.zst" },
  { name: "Ubuntu 22.04 LTS", family: "linux", vmid: 9001, lxc: "local:vztmpl/ubuntu-22.04-standard_22.04-1_amd64.tar.zst" },
  { name: "Debian 12", family: "linux", vmid: 9002, lxc: "local:vztmpl/debian-12-standard_12.7-1_amd64.tar.zst" },
  { name: "AlmaLinux 9", family: "linux", vmid: 9003, lxc: "local:vztmpl/almalinux-9-default_20240911_amd64.tar.xz" },
  { name: "Rocky Linux 9", family: "linux", vmid: 9004, lxc: "local:vztmpl/rockylinux-9-default_20240912_amd64.tar.xz" },
  { name: "Windows Server 2022", family: "windows", vmid: 9010, lxc: null },
  { name: "Windows Server 2019", family: "windows", vmid: 9011, lxc: null },
];

export async function syncCatalog() {
  const added: string[] = [];
  // OS templates (Proxmox VMIDs are the conventional 9000+ template IDs — edit them in Admin → OS Templates)
  const osRows = [];
  for (const [i, o] of OS.entries()) {
    const existing = await prisma.osTemplate.findFirst({ where: { name: o.name } });
    osRows.push(
      existing ??
        (await prisma.osTemplate.create({ data: { name: o.name, family: o.family, proxmoxKvmVmid: o.vmid, proxmoxLxcVolid: o.lxc, defaultUser: o.family === "windows" ? "Administrator" : "root", sortOrder: i } })),
    );
  }

  // catalogue (prices: website USD exactly, INR at USD_TO_INR; monthly + annual like the website)
  for (const [gi, g] of CATALOG.entries()) {
    const group = await prisma.productGroup.upsert({ where: { slug: g.slug }, update: {}, create: { name: g.name, slug: g.slug, headline: g.headline, sortOrder: gi } });
    for (const [pi, p] of g.plans.entries()) {
      if (await prisma.product.findUnique({ where: { slug: p.slug } })) continue; // never overwrite staff edits
      added.push(p.slug);
      const isVps = g.provisioner === "PROXMOX";
      const cycles: { cycle: BillingCycle; usd: number; setupUsd: number }[] = [{ cycle: "MONTHLY", usd: p.usd, setupUsd: p.setupUsd ?? 0 }];
      if (p.usdAnnual) cycles.push({ cycle: "ANNUAL", usd: p.usdAnnual * 12, setupUsd: 0 });
      // rupee-priced plans: exact ₹ monthly, annual = the website's 20% off (whole rupees per month)
      const inr = (usd: number, cycle: BillingCycle) =>
        p.inr ? (cycle === "ANNUAL" ? Math.round(p.inr * 0.8) * 12 * 100 : p.inr * 100) : cycle === "ANNUAL" ? paise(usd / 12) * 12 : paise(usd);
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


  const retired = await prisma.product.updateMany({ where: { slug: { in: RETIRED }, hidden: false }, data: { hidden: true } });
  return { added, hidden: retired.count };
}

// run directly: npx tsx prisma/sync-catalog.ts
if (process.argv[1] && /sync-catalog\.[jt]s$/.test(process.argv[1])) {
  syncCatalog()
    .then((r) => console.log(`  Catalogue: ${r.added.length} plan(s) added${r.added.length ? ` (${r.added.join(", ")})` : ""}, ${r.hidden} retired plan(s) hidden.`))
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(() => prisma.$disconnect());
}
