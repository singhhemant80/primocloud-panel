/**
 * Plans sold with unlimited bandwidth lose a stray 10 TB / placeholder cap on catalogue sync; real caps stay.
 *   npx tsx --test test/bandwidth-unlimited.test.ts
 */
import { test, after } from "node:test";
import assert from "node:assert/strict";
import { prisma } from "../src/db";
import { syncCatalog } from "../prisma/sync-catalog";

after(() => prisma.$disconnect());

test("V-Primo / VPS W back to unmetered; Gold VPS keeps its 10 TB", async () => {
  await syncCatalog();
  await prisma.product.update({ where: { slug: "v-primo-2gb" }, data: { bandwidthGb: 10_240 } });
  await prisma.product.update({ where: { slug: "vps-w1" }, data: { bandwidthGb: 1_000_000_000 } });
  await prisma.product.update({ where: { slug: "v-primo-4gb" }, data: { bandwidthGb: 3_000 } }); // a cap staff chose
  await syncCatalog();
  const by = Object.fromEntries((await prisma.product.findMany({ where: { slug: { in: ["v-primo-2gb", "vps-w1", "v-primo-4gb", "gold-1"] } } })).map((p) => [p.slug, p.bandwidthGb]));
  assert.equal(by["v-primo-2gb"], null);
  assert.equal(by["vps-w1"], null);
  assert.equal(by["v-primo-4gb"], 3_000);
  assert.equal(by["gold-1"], 10_240);
  await prisma.product.update({ where: { slug: "v-primo-4gb" }, data: { bandwidthGb: null } });
});
