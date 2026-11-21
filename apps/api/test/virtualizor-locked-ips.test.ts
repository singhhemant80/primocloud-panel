/**
 * Locked IPs in Virtualizor are never handed out by the panel ("Change IP", create).
 * Virtualizor's edit/create forms list locked IPs as free, so the panel checks its live IP list.
 *   npx tsx --test test/virtualizor-locked-ips.test.ts
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { VirtualizorClient } from "../src/modules/provisioning/virtualizor";

function fakeClient() {
  const posted: Record<string, unknown>[] = [];
  const c = new VirtualizorClient({ host: "vz.test", port: 4085, apiKey: "k", apiPass: "p", verifyTls: false });
  (c as unknown as { call: unknown }).call = async (act: string, _q: unknown, post?: Record<string, unknown>) => {
    if (act === "editvs" && post) {
      posted.push(post);
      return { done: 1 };
    }
    if (act === "editvs")
      return {
        vps: { vpsid: "293", hostname: "dinesh1.com", ips: { 1: "163.52.253.152" } },
        // the form offers a locked IP first
        ips: { 10: { ip: "163.52.253.10" }, 11: { ip: "163.5.191.50" }, 12: { ip: "163.5.191.51" } },
      };
    if (act === "ips")
      return {
        ips: {
          10: { ip: "163.52.253.10", vpsid: "0", locked: "1" },
          11: { ip: "163.5.191.50", vpsid: "0", locked: "0" },
          12: { ip: "163.5.191.51", vpsid: "77", locked: "0" },
          1: { ip: "163.52.253.152", vpsid: "293", locked: "1" },
        },
      };
    throw new Error(`unexpected ${act}`);
  };
  return { c, posted };
}

test("Change IP picks a free, unlocked IP — not the locked one Virtualizor's form lists first", async () => {
  const { c, posted } = fakeClient();
  const got = await c.replaceIps("293");
  assert.deepEqual(got, ["163.5.191.50"]);
  assert.deepEqual(posted[0].ips, ["163.5.191.50"]);
});

test("choosing a locked or used IP by hand is refused with the reason", async () => {
  const { c, posted } = fakeClient();
  await assert.rejects(c.replaceIps("293", ["163.52.253.10"]), /163\.52\.253\.10 \(locked in Virtualizor\)/);
  await assert.rejects(c.replaceIps("293", ["163.5.191.51"]), /in use by VPS 77/);
  assert.equal(posted.length, 0);
  // keeping the VPS's own current IP is fine even if it's locked
  assert.deepEqual(await c.replaceIps("293", ["163.52.253.152"]), ["163.52.253.152"]);
});

test("no free unlocked IP → clear error instead of assigning a locked one", async () => {
  const { c } = fakeClient();
  const orig = (c as unknown as { call: (a: string, q: unknown, p?: unknown) => Promise<unknown> }).call;
  (c as unknown as { call: unknown }).call = async (act: string, q: unknown, post?: unknown) =>
    act === "editvs" && !post ? { vps: { vpsid: "293", hostname: "h", ips: { 1: "163.52.253.152" } }, ips: { 10: { ip: "163.52.253.10" } } } : orig(act, q, post);
  await assert.rejects(c.replaceIps("293"), /no free, unlocked IPs/);
});
