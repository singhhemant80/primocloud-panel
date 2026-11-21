/**
 * Fixed plans for the tests that need a known catalogue (prices, pids, wholesale), so they don't
 * depend on whatever the live catalogue in prisma/catalog.ts happens to contain.
 * Idempotent — safe to call from several test files.
 */
import { prisma, type BillingCycle } from "../src/db";

const CYCLES: [BillingCycle, number][] = [["MONTHLY", 1], ["QUARTERLY", 3], ["SEMIANNUAL", 6], ["ANNUAL", 12]];
const inr = (monthlyRupees: number) => CYCLES.map(([cycle, m]) => ({ cycle, currency: "INR", price: monthlyRupees * m * 100, enabled: true }));

export async function ensureTestCatalog() {
  const shared = await prisma.productGroup.upsert({ where: { slug: "qa-shared-hosting" }, update: {}, create: { name: "QA Shared Hosting", slug: "qa-shared-hosting", sortOrder: 900 } });
  const vps = await prisma.productGroup.upsert({ where: { slug: "qa-linux-vps" }, update: {}, create: { name: "QA Linux VPS", slug: "qa-linux-vps", sortOrder: 901 } });

  if (!(await prisma.product.findUnique({ where: { slug: "shared-basic" } })))
    await prisma.product.create({
      data: {
        groupId: shared.id, name: "Shared Basic", slug: "shared-basic", type: "SHARED", provisioner: "MANUAL",
        tagline: "Perfect for personal sites & blogs", features: ["Host 1 website", "50 GB NVMe SSD"], hsnSac: "998315", pricing: { create: inr(49) },
      },
    });

  // pid 2 lets the WHMCS import test check "matched to an existing plan by pid"; that test may also have created it
  let g2 = (await prisma.product.findUnique({ where: { slug: "linux-vps-g2" } })) ?? (await prisma.product.findUnique({ where: { legacyPid: 2 } }));
  if (g2 && g2.slug !== "linux-vps-g2") g2 = await prisma.product.update({ where: { id: g2.id }, data: { slug: "linux-vps-g2", name: "Linux VPS G2" } });
  if (!g2) {
    g2 = await prisma.product.create({
      data: {
        groupId: vps.id, legacyPid: 2, name: "Linux VPS G2", slug: "linux-vps-g2", type: "VPS_LINUX", provisioner: "PROXMOX", virtType: "KVM",
        tagline: "Perfect for production workloads", cpuCores: 2, ramMb: 4096, diskGb: 80, ipv4Count: 1, allowIpSelection: true, requireHostname: true,
        featured: true, resellerEnabled: true, hsnSac: "998315", features: ["Full root / admin access"],
        pricing: { create: inr(549) },
        wholesalePricing: { create: CYCLES.map(([cycle, m]) => ({ cycle, price: Math.round(549 * 0.8) * m * 100 })) },
      },
    });
  } else {
    // may have been created earlier by the WHMCS import test (matched by pid) — bring it to the fixture's state
    g2 = await prisma.product.update({ where: { id: g2.id }, data: { type: "VPS_LINUX", provisioner: "PROXMOX", resellerEnabled: true, allowIpSelection: true, requireHostname: true, cpuCores: 2, ramMb: 4096, diskGb: 80, ipv4Count: 1, enabled: true } });
    for (const [cycle, m] of CYCLES) {
      await prisma.productPricing.upsert({ where: { productId_currency_cycle: { productId: g2.id, currency: "INR", cycle } }, update: { price: 549 * m * 100, enabled: true }, create: { productId: g2.id, currency: "INR", cycle, price: 549 * m * 100 } });
      await prisma.wholesalePrice.upsert({ where: { productId_cycle: { productId: g2.id, cycle } }, update: { price: Math.round(549 * 0.8) * m * 100 }, create: { productId: g2.id, cycle, price: Math.round(549 * 0.8) * m * 100 } });
    }
  }
  const linux = await prisma.osTemplate.findMany({ where: { family: "linux" } });
  await prisma.productOs.createMany({ data: linux.map((o) => ({ productId: g2!.id, osTemplateId: o.id })), skipDuplicates: true });

  if (!(await prisma.promoCode.findUnique({ where: { code: "SPECIAL15" } })))
    await prisma.promoCode.create({ data: { code: "SPECIAL15", type: "PERCENT", value: 15, productIds: [g2.id] } });
}
