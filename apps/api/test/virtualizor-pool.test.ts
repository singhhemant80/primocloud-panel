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
    const results = await Promise.all(Array.from({ length: 40 }, () => new VirtualizorClient(creds).call("serverloads")));
    assert.equal(results.length, 40);
    assert.equal(requests, 40);
    assert.ok(connections <= 4, `40 calls used ${connections} connections`);
    // later calls keep using the same connections
    await Promise.all(Array.from({ length: 10 }, () => new VirtualizorClient(creds).call("serverloads")));
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
    for (let i = 0; i < 8; i++) new VirtualizorClient(creds).call("vs").catch(() => undefined);
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
