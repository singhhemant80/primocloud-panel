/**
 * Live progress of service actions: reportProgress reaches the job through any number of awaits,
 * the activity endpoint shows queued/running/failed actions for one service only (never "create"),
 * and Virtualizor's task list is read correctly for following a reinstall.
 *   npx tsx --test test/action-progress.test.ts
 */
import { test, after } from "node:test";
import assert from "node:assert/strict";
import { reportProgress, withProgress, inJob } from "../src/modules/provisioning/action-progress";
import { serviceActivity } from "../src/modules/provisioning/activity";
import { provisioningQueue, closeQueues } from "../src/jobs/queues";
import { VirtualizorClient } from "../src/modules/provisioning/virtualizor";

after(() => closeQueues());

test("reportProgress reaches the running job through nested awaits, and is a no-op outside one", async () => {
  const seen: { step: string; pct?: number }[] = [];
  assert.equal(inJob(), false);
  reportProgress("ignored", 10); // no job: nothing happens, nothing throws
  await withProgress((p) => seen.push(p), async () => {
    assert.equal(inJob(), true);
    reportProgress("Sending the reinstall", 10);
    await new Promise((r) => setTimeout(r, 5));
    await (async () => {
      await Promise.resolve();
      reportProgress("Reinstalling Ubuntu 24.04", 140, "Rebuilding VPS · In progress");
    })();
  });
  await new Promise((r) => setTimeout(r, 5));
  assert.deepEqual(seen.map((s) => [s.step, s.pct]), [["Sending the reinstall", 10], ["Reinstalling Ubuntu 24.04", 100]]);
});

test("activity lists this service's actions with their progress — not other services, not create", async () => {
  const sid = `svc-progress-${Date.now()}`;
  const q = provisioningQueue();
  // delayed so no worker picks them up during the test
  const reinstall = await q.add("reinstall", { serviceId: sid, action: "reinstall", params: {} }, { delay: 600_000, attempts: 1 });
  await reinstall.updateProgress({ step: "Reinstalling Ubuntu 24.04", pct: 42, at: new Date().toISOString() });
  const create = await q.add("create", { serviceId: sid, action: "create", params: {} }, { delay: 600_000 });
  const other = await q.add("reboot", { serviceId: `${sid}-other`, action: "reboot", params: {} }, { delay: 600_000 });
  try {
    const { items } = await serviceActivity(sid, "admin");
    assert.equal(items.length, 1);
    assert.equal(items[0].action, "reinstall");
    assert.equal(items[0].label, "Reinstall OS");
    assert.equal(items[0].state, "queued");
    assert.equal(items[0].progress?.pct, 42);
    assert.equal(items[0].progress?.step, "Reinstalling Ubuntu 24.04");
  } finally {
    await Promise.all([reinstall.remove(), create.remove(), other.remove()]);
  }
});

test("customers get a plain failure message; staff get the real error", async () => {
  const sid = `svc-fail-${Date.now()}`;
  const q = provisioningQueue();
  const j = await q.add("reinstall", { serviceId: sid, action: "reinstall", params: {} }, { delay: 600_000, attempts: 2 });
  // what a failed first attempt looks like: waiting for a retry with the reason recorded
  const client = await q.client;
  await client.hset((q as unknown as { toKey: (k: string) => string }).toKey(String(j.id)), "failedReason", "Virtualizor reported the task failed: Disk full", "attemptsMade", "1");
  try {
    const admin = (await serviceActivity(sid, "admin")).items[0];
    const client = (await serviceActivity(sid, "client")).items[0];
    assert.equal(admin.state, "retrying");
    assert.match(admin.error ?? "", /Disk full/);
    assert.doesNotMatch(client.error ?? "", /Disk full/);
    assert.match(client.error ?? "", /couldn't be completed/);
  } finally {
    await j.remove();
  }
});

test("latestTask reads Virtualizor's newest task for the VPS (status, progress, text)", async () => {
  const c = new VirtualizorClient({ host: "vz.test", port: 4085, apiKey: "k", apiPass: "p", verifyTls: false });
  (c as unknown as { call: unknown }).call = async (act: string, q: Record<string, unknown>) => {
    assert.equal(act, "tasks");
    assert.equal(q.vpsid, "293");
    return {
      tasks: {
        "900": { actid: "900", vpsid: "293", action: "rebuildvs", status: "2", status_txt: "Task Completed", action_txt: "Rebuilding VPS" },
        "912": { actid: "912", vpsid: "293", action: "rebuildvs", status: "1", status_txt: "In progress", action_txt: "Rebuilding VPS", progress: "37" },
        "913": { actid: "913", vpsid: "41", action: "rebuildvs", status: "1" },
      },
    };
  };
  const t = await c.latestTask("293", "rebuildvs");
  assert.deepEqual(t, { actid: 912, status: 1, statusText: "In progress", actionText: "Rebuilding VPS", progress: 37 });
});
