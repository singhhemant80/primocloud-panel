/**
 * Virtualizor connection pool: many parallel API calls share a few kept-alive connections,
 * instead of opening one connection per call (which flood protection in front of a master blocks).
 *   npx tsx --test test/virtualizor-pool.test.ts
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import https from "node:https";
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import type { AddressInfo } from "node:net";
import { VirtualizorClient, VirtualizorBusyError, virtualizorPausedFor } from "../src/modules/provisioning/virtualizor";
import { closeQueues, redis } from "../src/jobs/queues";
import { after } from "node:test";

process.env.VIRTUALIZOR_MAX_RPS = "1000"; // connection tests below; pacing has its own test
process.env.VIRTUALIZOR_SHARED_LIMIT = "0"; // the panel-wide (Redis) limit has its own tests at the end

test("parallel Virtualizor calls reuse at most 4 connections per master", async () => {
  const dir = mkdtempSync(path.join(tmpdir(), "vz-pool-"));
  execFileSync("openssl", ["req", "-x509", "-newkey", "rsa:2048", "-nodes", "-days", "1", "-subj", "/CN=localhost", "-keyout", `${dir}/k.pem`, "-out", `${dir}/c.pem`], { stdio: "ignore" });
  let connections = 0;
  let requests = 0;
  const server = https.createServer({ key: readFileSync(`${dir}/k.pem`), cert: readFileSync(`${dir}/c.pem`) }, (_req, res) => {
    requests++;
    setTimeout(() => {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ ok: 1 }));
    }, 20);
  });
  server.on("secureConnection", () => connections++);
  await new Promise<void>((r) => server.listen(0, "127.0.0.1", r));
  const port = (server.address() as AddressInfo).port;
  try {
    const creds = { host: "127.0.0.1", port, apiKey: "k", apiPass: "p", verifyTls: false };
    // a new client object per call, as the panel's code does
    const results = await Promise.all(Array.from({ length: 40 }, (_, i) => new VirtualizorClient(creds).call("serverloads", { n: i })));
    assert.equal(results.length, 40);
    assert.equal(requests, 40);
    assert.ok(connections <= 4, `40 calls used ${connections} connections`);
    // later calls keep using the same connections
    await Promise.all(Array.from({ length: 10 }, (_, i) => new VirtualizorClient(creds).call("serverloads", { n: 100 + i })));
    assert.ok(connections <= 4, `50 calls used ${connections} connections`);
  } finally {
    server.closeAllConnections();
    server.close();
  }
});

test("plan list loads while every background connection is busy (own quick pool)", async () => {
  const dir = mkdtempSync(path.join(tmpdir(), "vz-quick-"));
  execFileSync("openssl", ["req", "-x509", "-newkey", "rsa:2048", "-nodes", "-days", "1", "-subj", "/CN=localhost", "-keyout", `${dir}/k.pem`, "-out", `${dir}/c.pem`], { stdio: "ignore" });
  const held: import("node:http").ServerResponse[] = [];
  const server = https.createServer({ key: readFileSync(`${dir}/k.pem`), cert: readFileSync(`${dir}/c.pem`) }, (req, res) => {
    if (String(req.url).includes("act=plans")) {
      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ plans: { 1: { plid: 1, plan_name: "V-Primo 2GB" } } }));
    }
    held.push(res); // a slow background call: never answered while the test runs
  });
  await new Promise<void>((r) => server.listen(0, "127.0.0.1", r));
  const port = (server.address() as AddressInfo).port;
  try {
    const creds = { host: "127.0.0.1", port, apiKey: "k", apiPass: "p", verifyTls: false };
    // fill the shared pool with calls that hang
    for (let i = 0; i < 8; i++) new VirtualizorClient(creds).call("vs", { n: i }).catch(() => undefined);
    await new Promise((r) => setTimeout(r, 200));
    const t0 = Date.now();
    const r = await new VirtualizorClient(creds).plans({ quick: true });
    assert.equal((r.plans as any)[1].plan_name, "V-Primo 2GB");
    assert.ok(Date.now() - t0 < 3000, "not queued behind the busy pool");
  } finally {
    for (const res of held) res.destroy();
    server.closeAllConnections();
    server.close();
  }
});

async function fakeMaster(handler: (url: string, res: import("node:http").ServerResponse) => void) {
  const dir = mkdtempSync(path.join(tmpdir(), "vz-fake-"));
  execFileSync("openssl", ["req", "-x509", "-newkey", "rsa:2048", "-nodes", "-days", "1", "-subj", "/CN=localhost", "-keyout", `${dir}/k.pem`, "-out", `${dir}/c.pem`], { stdio: "ignore" });
  const server = https.createServer({ key: readFileSync(`${dir}/k.pem`), cert: readFileSync(`${dir}/c.pem`) }, (req, res) => handler(String(req.url), res));
  await new Promise<void>((r) => server.listen(0, "127.0.0.1", r));
  const port = (server.address() as AddressInfo).port;
  return { creds: { host: "127.0.0.1", port, apiKey: "k", apiPass: "p", verifyTls: false }, close: () => (server.closeAllConnections(), server.close()) };
}
const json = (res: import("node:http").ServerResponse, body: unknown) => (res.writeHead(200, { "Content-Type": "application/json" }), res.end(JSON.stringify(body)));

test("calls to one master are paced (a burst, then the set rate) — no more floods", async () => {
  let hits = 0;
  const m = await fakeMaster((_u, res) => (hits++, json(res, { ok: 1 })));
  process.env.VIRTUALIZOR_MAX_RPS = "20";
  try {
    const t0 = Date.now();
    await Promise.all(Array.from({ length: 20 }, (_, i) => new VirtualizorClient(m.creds).call("vs", { vpsid: i })));
    const took = Date.now() - t0;
    assert.equal(hits, 20);
    assert.ok(took >= 450, `20 calls at 20/s after a burst of 8 took only ${took} ms`);
  } finally {
    process.env.VIRTUALIZOR_MAX_RPS = "1000";
    m.close();
  }
});

test("the same question asked at once by many is sent once", async () => {
  let hits = 0;
  const m = await fakeMaster((_u, res) => {
    hits++;
    setTimeout(() => json(res, { status: { 5: 1 } }), 50);
  });
  try {
    const r = await Promise.all(Array.from({ length: 12 }, () => new VirtualizorClient(m.creds).vpsStatus([5])));
    assert.equal(hits, 1);
    for (const x of r) assert.equal(x["5"], 1);
  } finally {
    m.close();
  }
});

test("listing all VPSes stops when the master ignores 'page' (used to loop 500 times)", async () => {
  let hits = 0;
  const rows = Object.fromEntries(Array.from({ length: 250 }, (_, i) => [String(i + 1), { vpsid: String(i + 1), hostname: `h${i + 1}` }]));
  const m = await fakeMaster((u, res) => (u.includes("act=vs") ? (hits++, json(res, { vs: rows })) : json(res, {})));
  try {
    const all = await new VirtualizorClient(m.creds).allVps(0);
    assert.equal(all.size, 250);
    assert.ok(hits <= 2, `read the list ${hits} times`);
    // remembered: a second caller within 2 minutes doesn't ask again
    await new VirtualizorClient(m.creds).allVps();
    assert.ok(hits <= 2);
  } finally {
    m.close();
  }
});

after(() => closeQueues().catch(() => undefined));

test("panel-wide limit: all clients together send about 1 call a second to a master", async () => {
  let hits = 0;
  const at: number[] = [];
  const m = await fakeMaster((_u, res) => (hits++, at.push(Date.now()), json(res, { ok: 1 })));
  process.env.VIRTUALIZOR_SHARED_LIMIT = "1";
  process.env.VIRTUALIZOR_TOTAL_RPS = "4";
  try {
    const t0 = Date.now();
    // two "processes" worth of clients asking at once
    await Promise.all(Array.from({ length: 12 }, (_, i) => new VirtualizorClient(m.creds).call("vs", { vpsid: 1000 + i })));
    const took = Date.now() - t0;
    assert.equal(hits, 12);
    assert.ok(took >= 900, `12 calls at 4/s can't all go at once (took ${took} ms)`);
    // evenly spaced: no two calls closer than ~a quarter second (4/s), so no burst at window edges
    const gaps = at.slice(1).map((t, i) => t - at[i]);
    assert.ok(Math.min(...gaps) >= 200, `gaps ${JSON.stringify(gaps)}`);
  } finally {
    process.env.VIRTUALIZOR_SHARED_LIMIT = "0";
    delete process.env.VIRTUALIZOR_TOTAL_RPS;
    m.close();
  }
});

test("back-off: a master that keeps failing gets a pause for background calls; staff actions still go", async () => {
  let fail = true;
  let posts = 0;
  const m = await fakeMaster((u, res) => {
    if (fail && !u.includes("act=addvs")) return res.socket?.destroy();
    if (u.includes("act=addvs")) posts++;
    json(res, { ok: 1 });
  });
  process.env.VIRTUALIZOR_SHARED_LIMIT = "1";
  process.env.VIRTUALIZOR_TOTAL_RPS = "50";
  const key = `127.0.0.1:${m.creds.port}`;
  try {
    for (let i = 0; i < 4; i++) await new VirtualizorClient(m.creds).call("vs", { vpsid: 2000 + i }).catch(() => undefined);
    await new Promise((r) => setTimeout(r, 100));
    assert.ok((await virtualizorPausedFor(key)) > 0, "paused after 4 failures in a minute");
    fail = false;
    const t0 = Date.now();
    await assert.rejects(new VirtualizorClient(m.creds).call("vs", { vpsid: 3000 }), (e) => e instanceof VirtualizorBusyError);
    assert.ok(Date.now() - t0 < 500, "refused at once, without touching the master");
    // a staff action (form post) and an on-screen list still reach it
    await new VirtualizorClient(m.creds).call("addvs", {}, { hostname: "x" });
    assert.equal(posts, 1);
    await new VirtualizorClient(m.creds).plans({ quick: true });
  } finally {
    process.env.VIRTUALIZOR_SHARED_LIMIT = "0";
    delete process.env.VIRTUALIZOR_TOTAL_RPS;
    await redis().del(`vz:pause:${key}`, `vz:fail:${key}`);
    m.close();
  }
});

test("IP list paging stops when the master ignores 'page' (used to read it up to 99 times)", async () => {
  let hits = 0;
  const rows = Object.fromEntries(Array.from({ length: 1000 }, (_, i) => [String(i + 1), { ipid: String(i + 1), ip: `10.9.${Math.floor(i / 250)}.${i % 250}` }]));
  const m = await fakeMaster((u, res) => (u.includes("act=ips") ? (hits++, json(res, { ips: rows })) : json(res, {})));
  try {
    const c = new VirtualizorClient(m.creds);
    const seen = new Set<string>();
    for (let page = 1; page < 100; page++) {
      const entries = Object.entries((await c.ips(page, 1000)).ips ?? {});
      let fresh = 0;
      for (const [k] of entries) if (!seen.has(k)) (seen.add(k), fresh++);
      if (entries.length < 1000 || fresh === 0) break;
    }
    assert.equal(seen.size, 1000);
    assert.equal(hits, 2);
  } finally {
    m.close();
  }
});
