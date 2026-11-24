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
import { VirtualizorClient } from "../src/modules/provisioning/virtualizor";

process.env.VIRTUALIZOR_MAX_RPS = "1000"; // connection tests below; pacing has its own test

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
