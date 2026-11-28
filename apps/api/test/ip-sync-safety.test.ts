/**
 * IP sync never strips IPs it shouldn't, and services keep their last known IPs for display and search.
 *   npx tsx --test test/ip-sync-safety.test.ts
 */
import { test, after, before } from "node:test";
import assert from "node:assert/strict";
import { prisma } from "../src/db";
import { VirtualizorClient } from "../src/modules/provisioning/virtualizor";
import { syncVirtualizorIps } from "../src/modules/provisioning/virtualizor-ips";

const RUN = Date.now().toString(36);
const n = Number.parseInt(RUN.slice(-4), 36) % 200;
const ip = (k: number) => `10.${150 + (n % 40)}.${k}.${n + 1}`;
const ids: Record<string, string> = {};
let IPS: Record<string, Record<string, unknown>> = {};
const proto = VirtualizorClient.prototype as any;
const saved = { ipPools: proto.ipPools, ips: proto.ips };

before(async () => {
  proto.ipPools = async () => ({ ippools: { 1: { ippid: 1, ippool_name: "p", gateway: `10.${150 + (n % 40)}.0.1`, netmask: "255.255.0.0" } } });
  proto.ips = async (page: number) => ({ ips: page === 1 ? IPS : {} });
  ids.user = (await prisma.user.create({ data: { email: `ipsafe-${RUN}@t.test`, passwordHash: "x", firstName: "I", type: "CLIENT", status: "ACTIVE" } })).id;
  ids.group = (await prisma.productGroup.create({ data: { name: `QA IPS ${RUN}`, slug: `qa-ips-${RUN}` } })).id;
  ids.product = (await prisma.product.create({ data: { groupId: ids.group, name: `IPS ${RUN}`, slug: `qa-ips-${RUN}`, type: "VPS_LINUX", provisioner: "VIRTUALIZOR" } })).id;
  ids.master = (await prisma.server.create({ data: { name: `master-${RUN}`, type: "VIRTUALIZOR", hostname: "master.invalid" } })).id;
  ids.dup = (await prisma.server.create({ data: { name: `srv9-${RUN} (WHMCS)`, type: "VIRTUALIZOR", hostname: "srv9.invalid" } })).id;
  const svc = (serverId: string, remoteId: string) => prisma.service.create({ data: { userId: ids.user, productId: ids.product, serverId, remoteId, status: "ACTIVE", billingCycle: "MONTHLY", firstAmount: 1, recurringAmount: 1, currency: "INR" } });
  ids.onMaster = (await svc(ids.master, `${9000 + n}`)).id;
  ids.onDup = (await svc(ids.dup, `${9100 + n}`)).id; // imported, linked to the duplicate server entry
  await prisma.ipAddress.create({ data: { address: ip(1), status: "ALLOCATED", serviceId: ids.onMaster, serverId: ids.master, isPrimary: true } });
  await prisma.ipAddress.create({ data: { address: ip(2), status: "ALLOCATED", serviceId: ids.onDup, serverId: ids.dup, isPrimary: true } });
  for (let k = 10; k < 20; k++) await prisma.ipAddress.create({ data: { address: ip(k), status: "AVAILABLE", serverId: ids.master } });
});
after(async () => {
  Object.assign(proto, saved);
  const svcs = [ids.onMaster, ids.onDup];
  await prisma.serviceIpEvent.deleteMany({ where: { serviceId: { in: svcs } } });
  await prisma.ipAddress.deleteMany({ where: { address: { startsWith: `10.${150 + (n % 40)}.` } } });
  await prisma.ipSubnet.deleteMany({ where: { serverId: ids.master } });
  await prisma.service.deleteMany({ where: { id: { in: svcs } } });
  await prisma.server.deleteMany({ where: { id: { in: [ids.master, ids.dup] } } });
  await prisma.product.deleteMany({ where: { id: ids.product } });
  await prisma.productGroup.deleteMany({ where: { id: ids.group } });
  await prisma.user.deleteMany({ where: { id: ids.user } });
  await prisma.$disconnect();
});
const holderOf = async (a: string) => (await prisma.ipAddress.findUnique({ where: { address: a } }))?.serviceId ?? null;
const master = () => prisma.server.findUniqueOrThrow({ where: { id: ids.master } });

test("an IP on a VPS whose service is linked to a duplicate server entry stays with that service", async () => {
  IPS = Object.fromEntries([
    [1, { ipid: 1, ip: ip(1), ippid: 1, vpsid: `${9000 + n}` }],
    [2, { ipid: 2, ip: ip(2), ippid: 1, vpsid: `${9100 + n}` }],
    ...Array.from({ length: 10 }, (_, i) => [10 + i, { ipid: 10 + i, ip: ip(10 + i), ippid: 1, vpsid: "0" }]),
  ]);
  await syncVirtualizorIps(await master());
  assert.equal(await holderOf(ip(1)), ids.onMaster);
  assert.equal(await holderOf(ip(2)), ids.onDup, "not stripped and marked 'in use by another VPS'");
});

test("a short / partial IP list from Virtualizor deletes nothing", async () => {
  IPS = { 1: { ipid: 1, ip: ip(1), ippid: 1, vpsid: `${9000 + n}` } }; // just 1 of 12
  await syncVirtualizorIps(await master());
  assert.ok(await prisma.ipAddress.findUnique({ where: { address: ip(15) } }), "free IPs survive a broken list");
  assert.equal(await holderOf(ip(2)), ids.onDup);
});

test("IPs a live service holds are never deleted, even when missing from a complete list", async () => {
  IPS = Object.fromEntries([[1, { ipid: 1, ip: ip(1), ippid: 1, vpsid: `${9000 + n}` }], ...Array.from({ length: 10 }, (_, i) => [10 + i, { ipid: 10 + i, ip: ip(10 + i), ippid: 1, vpsid: "0" }])]);
  await syncVirtualizorIps(await master());
  assert.equal(await holderOf(ip(2)), ids.onDup);
});

test("last known IPs: kept when the IP is taken off the service, and found by search", async () => {
  assert.deepEqual((await prisma.service.findUniqueOrThrow({ where: { id: ids.onMaster } })).lastKnownIps, [ip(1)]);
  await prisma.ipAddress.update({ where: { address: ip(1) }, data: { serviceId: null, status: "AVAILABLE" } });
  const s = await prisma.service.findUniqueOrThrow({ where: { id: ids.onMaster } });
  assert.deepEqual(s.lastKnownIps, [ip(1)], "still shown after the IP was taken off");
  assert.ok(await prisma.service.findFirst({ where: { id: ids.onMaster, lastKnownIps: { has: ip(1) } } }));
  // a new IP replaces the list
  await prisma.ipAddress.update({ where: { address: ip(12) }, data: { serviceId: ids.onMaster, status: "ALLOCATED", isPrimary: true } });
  assert.deepEqual((await prisma.service.findUniqueOrThrow({ where: { id: ids.onMaster } })).lastKnownIps, [ip(12)]);
});
