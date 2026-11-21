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
/**
 * A job's memory: values saved on the queued job itself, so a run that a restart interrupted (and the
 * queue picks up again) can carry on — e.g. follow the reinstall already running in Virtualizor with the
 * same password — instead of repeating a destructive step.
 */
export interface JobMemo {
  values: Record<string, unknown>;
  save: (values: Record<string, unknown>) => Promise<unknown>;
  /** this run is a re-pick of a run that was interrupted part-way */
  resumed: boolean;
}
const store = new AsyncLocalStorage<{ report: Reporter; memo?: JobMemo }>();

export function withProgress<T>(reporter: Reporter, fn: () => Promise<T>, memo?: JobMemo): Promise<T> {
  return store.run({ report: reporter, memo }, fn);
}

/** Save a value on the running job before a step that must not be repeated (no-op outside a job). */
export async function remember(key: string, value: unknown) {
  const m = store.getStore()?.memo;
  if (!m) return;
  m.values = { ...m.values, [key]: value };
  await m.save(m.values);
}
export const recall = <T = unknown>(key: string): T | undefined => store.getStore()?.memo?.values[key] as T | undefined;
/** True when this run re-picks a job that was interrupted (worker restart / crash) part-way. */
export const isResumedRun = () => !!store.getStore()?.memo?.resumed;

export function reportProgress(step: string, pct?: number, detail?: string) {
  const r = store.getStore()?.report;
  if (!r) return;
  const p: ActionProgress = { step, at: new Date().toISOString(), ...(pct === undefined ? {} : { pct: Math.max(0, Math.min(100, Math.round(pct))) }), ...(detail ? { detail } : {}) };
  void Promise.resolve()
    .then(() => r(p))
    .catch(() => undefined);
}

/** True inside a queued job — long waits (e.g. for Virtualizor's rebuild task) only make sense there. */
export const inJob = () => !!store.getStore();

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
