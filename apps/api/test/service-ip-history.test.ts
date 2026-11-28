/**
 * Service IP history: kept by a database trigger, so every change is recorded with where it came from.
 *   npx tsx --test test/service-ip-history.test.ts
 */
import { test, after, before } from "node:test";
import assert from "node:assert/strict";
import { prisma } from "../src/db";
import { recordServiceIps } from "../src/modules/provisioning/provisioner";

const RUN = Date.now().toString(36);
const n = Number.parseInt(RUN.slice(-4), 36) % 200;
const ip = (k: number) => `10.${200 + (n % 50)}.${k}.${n}`;
const ids: Record<string, string> = {};
const events = () => prisma.serviceIpEvent.findMany({ where: { serviceId: ids.svc }, orderBy: [{ createdAt: "asc" }, { action: "desc" }] });

before(async () => {
  ids.user = (await prisma.user.create({ data: { email: `iph-${RUN}@t.test`, passwordHash: "x", firstName: "I", type: "CLIENT", status: "ACTIVE" } })).id;
  ids.group = (await prisma.productGroup.create({ data: { name: `QA IPH ${RUN}`, slug: `qa-iph-${RUN}` } })).id;
  ids.product = (await prisma.product.create({ data: { groupId: ids.group, name: `IPH ${RUN}`, slug: `qa-iph-${RUN}`, type: "VPS_LINUX", provisioner: "VIRTUALIZOR" } })).id;
  ids.server = (await prisma.server.create({ data: { name: `iph-${RUN}`, type: "VIRTUALIZOR", hostname: "iph.invalid" } })).id;
  ids.svc = (await prisma.service.create({ data: { userId: ids.user, productId: ids.product, serverId: ids.server, remoteId: "77", status: "ACTIVE", billingCycle: "MONTHLY", firstAmount: 1, recurringAmount: 1, currency: "INR" } })).id;
});
after(async () => {
  await prisma.serviceIpEvent.deleteMany({ where: { serviceId: ids.svc } });
  await prisma.ipAddress.deleteMany({ where: { address: { in: [ip(1), ip(2), ip(3)] } } });
  await prisma.service.deleteMany({ where: { id: ids.svc } });
  await prisma.server.deleteMany({ where: { id: ids.server } });
  await prisma.product.deleteMany({ where: { id: ids.product } });
  await prisma.productGroup.deleteMany({ where: { id: ids.group } });
  await prisma.user.deleteMany({ where: { id: ids.user } });
  await prisma.$disconnect();
});

test("created by the panel, then changed directly in Virtualizor (found by a sync)", async () => {
  await recordServiceIps(ids.svc, ids.server, [ip(1)], { source: "PANEL", note: "VPS 77 created" });
  await recordServiceIps(ids.svc, ids.server, [ip(2)], { source: "VIRTUALIZOR", note: "Changed in Virtualizor: x → y" });
  const e = await events();
  assert.deepEqual(e.map((x) => [x.address, x.action, x.source]), [
    [ip(1), "ASSIGNED", "PANEL"],
    [ip(1), "REMOVED", "VIRTUALIZOR"],
    [ip(2), "ASSIGNED", "VIRTUALIZOR"],
  ]);
  assert.equal(e[2].note, "Changed in Virtualizor: x → y");
  assert.equal(e[2].isPrimary, true);
});

test("a hint is used once: a later untagged change counts as the panel's; unrelated edits record nothing", async () => {
  const before = (await events()).length;
  await prisma.ipAddress.update({ where: { address: ip(2) }, data: { rdns: "host.example.com" } }); // not an assignment change
  assert.equal((await events()).length, before);
  await prisma.ipAddress.update({ where: { address: ip(2) }, data: { serviceId: null, status: "AVAILABLE" } });
  const last = (await events()).at(-1)!;
  assert.deepEqual([last.address, last.action, last.source], [ip(2), "REMOVED", "PANEL"]);
});

test("an IP deleted while assigned is recorded as removed, with the reason given", async () => {
  await prisma.ipAddress.create({ data: { address: ip(3), status: "ALLOCATED", serviceId: ids.svc, changeSource: "PANEL", changeNote: "staff added" } });
  await prisma.ipAddress.update({ where: { address: ip(3) }, data: { changeSource: "VIRTUALIZOR", changeNote: "No longer in Virtualizor (IP sync)" } });
  await prisma.ipAddress.delete({ where: { address: ip(3) } });
  const last = (await events()).at(-1)!;
  assert.deepEqual([last.address, last.action, last.source, last.note], [ip(3), "REMOVED", "VIRTUALIZOR", "No longer in Virtualizor (IP sync)"]);
});

test("deleting a service with IPs still works (its IPs just go back)", async () => {
  const s2 = await prisma.service.create({ data: { userId: ids.user, productId: ids.product, status: "ACTIVE", billingCycle: "MONTHLY", firstAmount: 1, recurringAmount: 1, currency: "INR" } });
  await prisma.ipAddress.update({ where: { address: ip(1) }, data: { serviceId: s2.id, status: "ALLOCATED" } });
  await prisma.service.delete({ where: { id: s2.id } });
  assert.equal((await prisma.ipAddress.findUniqueOrThrow({ where: { address: ip(1) } })).serviceId, null);
  await prisma.serviceIpEvent.deleteMany({ where: { serviceId: s2.id } });
});
