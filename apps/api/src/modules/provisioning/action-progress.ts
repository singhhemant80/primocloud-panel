/**
 * Live progress for queued service actions (reinstall, change IP, power, password…).
 * The worker runs each job inside `withProgress`, and provisioning code anywhere below it calls
 * `reportProgress(step, pct)` — no need to pass a callback through every function. Outside a job
 * (tests, direct calls) reporting is a no-op.
 */
import { AsyncLocalStorage } from "node:async_hooks";

export interface ActionProgress {
  /** what is happening now, in plain words */
  step: string;
  /** 0–100 when known; omitted = indeterminate */
  pct?: number;
  /** extra line, e.g. Virtualizor's own task status */
  detail?: string;
  at: string;
}

type Reporter = (p: ActionProgress) => unknown;
const store = new AsyncLocalStorage<Reporter>();

export function withProgress<T>(reporter: Reporter, fn: () => Promise<T>): Promise<T> {
  return store.run(reporter, fn);
}

export function reportProgress(step: string, pct?: number, detail?: string) {
  const r = store.getStore();
  if (!r) return;
  const p: ActionProgress = { step, at: new Date().toISOString(), ...(pct === undefined ? {} : { pct: Math.max(0, Math.min(100, Math.round(pct))) }), ...(detail ? { detail } : {}) };
  void Promise.resolve()
    .then(() => r(p))
    .catch(() => undefined);
}

/** True inside a queued job — long waits (e.g. for Virtualizor's rebuild task) only make sense there. */
export const inJob = () => !!store.getStore();

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
