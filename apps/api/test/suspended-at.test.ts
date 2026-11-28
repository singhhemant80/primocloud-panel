/**
 * "Suspended on": set by a trigger whenever a service becomes suspended (any code path), cleared on restore.
 *   npx tsx --test test/suspended-at.test.ts
 */
import { test, after, before } from "node:test";
import assert from "node:assert/strict";
import { prisma } from "../src/db";

const RUN = Date.now().toString(36);
const ids: Record<string, string> = {};
const get = () => prisma.service.findUniqueOrThrow({ where: { id: ids.svc } });

before(async () => {
  ids.user = (await prisma.user.create({ data: { email: `susp-${RUN}@t.test`, passwordHash: "x", firstName: "S", type: "CLIENT", status: "ACTIVE" } })).id;
  ids.group = (await prisma.productGroup.create({ data: { name: `QA SUSP ${RUN}`, slug: `qa-susp-${RUN}` } })).id;
  ids.product = (await prisma.product.create({ data: { groupId: ids.group, name: `SUSP ${RUN}`, slug: `qa-susp-${RUN}`, type: "VPS_LINUX", provisioner: "MANUAL" } })).id;
  ids.svc = (await prisma.service.create({ data: { userId: ids.user, productId: ids.product, status: "ACTIVE", billingCycle: "MONTHLY", firstAmount: 1, recurringAmount: 1, currency: "INR" } })).id;
});
after(async () => {
  await prisma.service.deleteMany({ where: { userId: ids.user } });
  await prisma.product.deleteMany({ where: { id: ids.product } });
  await prisma.productGroup.deleteMany({ where: { id: ids.group } });
  await prisma.user.deleteMany({ where: { id: ids.user } });
  await prisma.$disconnect();
});

test("suspending records the moment; staying suspended keeps it; restoring clears it", async () => {
  assert.equal((await get()).suspendedAt, null);
  const t0 = Date.now();
  await prisma.service.update({ where: { id: ids.svc }, data: { status: "SUSPENDED", suspendReason: "Overdue on invoice 1" } });
  const first = (await get()).suspendedAt!;
  assert.ok(first && Math.abs(first.getTime() - t0) < 60_000, `suspendedAt ${first?.toISOString()} should be now`);
  await new Promise((r) => setTimeout(r, 20));
  await prisma.service.update({ where: { id: ids.svc }, data: { status: "SUSPENDED", suspendReason: "Overdue on invoice 2" } });
  assert.equal((await get()).suspendedAt?.toISOString(), first.toISOString(), "still the first date");
  await prisma.service.update({ where: { id: ids.svc }, data: { status: "ACTIVE", suspendReason: null } });
  assert.equal((await get()).suspendedAt, null);
});

test("a date given with the suspension is kept; a service created suspended gets one too", async () => {
  const when = new Date("2026-11-20T06:30:00Z");
  await prisma.service.update({ where: { id: ids.svc }, data: { status: "SUSPENDED", suspendedAt: when } });
  assert.equal((await get()).suspendedAt?.toISOString(), when.toISOString());
  const s2 = await prisma.service.create({ data: { userId: ids.user, productId: ids.product, status: "SUSPENDED", billingCycle: "MONTHLY", firstAmount: 1, recurringAmount: 1, currency: "INR" } });
  assert.ok(s2.suspendedAt);
  // an import that doesn't know the date can clear it
  await prisma.service.update({ where: { id: s2.id }, data: { suspendedAt: null } });
  assert.equal((await prisma.service.findUniqueOrThrow({ where: { id: s2.id } })).suspendedAt, null);
});
