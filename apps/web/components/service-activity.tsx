"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "@/lib/api";
import { Icon, cx } from "./ui";

type Item = {
  id: string;
  action: string;
  label: string;
  state: "queued" | "running" | "retrying" | "done" | "failed";
  progress: { step: string; pct?: number; detail?: string; at: string } | null;
  queuedAt: string;
  startedAt: string | null;
  finishedAt: string | null;
  error: string | null;
  attempt: number;
  maxAttempts: number;
  result: { before?: string[]; after?: string[] } | null;
};

const ICON: Record<string, string> = {
  start: "play_arrow",
  stop: "power_off",
  shutdown: "power_settings_new",
  reboot: "restart_alt",
  hard_reset: "bolt",
  reinstall: "install_desktop",
  reset_password: "password",
  change_ip: "swap_horiz",
  suspend: "pause",
  unsuspend: "play_circle",
  terminate: "delete_forever",
  change_package: "inventory_2",
  change_plan: "upgrade",
};
const RUNNING_TITLE: Record<string, string> = {
  start: "Starting the VPS",
  stop: "Powering off the VPS",
  shutdown: "Shutting down the VPS",
  reboot: "Rebooting the VPS",
  hard_reset: "Hard-resetting the VPS",
  reinstall: "Reinstalling the operating system",
  reset_password: "Resetting the password",
  change_ip: "Changing the IP address",
  suspend: "Suspending the service",
  unsuspend: "Unsuspending the service",
  terminate: "Terminating the service",
  change_package: "Changing the hosting package",
  change_plan: "Applying the new plan",
};

let skew = 0; // server clock − this device's clock
function dur(from?: string | null, to?: string | null) {
  if (!from) return "";
  const s = Math.max(0, Math.round(((to ? new Date(to).getTime() : Date.now() + skew) - new Date(from).getTime()) / 1000));
  return s < 60 ? `${s}s` : `${Math.floor(s / 60)}m ${s % 60}s`;
}
/** Call after queuing an action anywhere on the page: the progress card shows it at once. */
export function kickServiceActivity() {
  if (typeof window !== "undefined") window.dispatchEvent(new Event("primo:service-activity"));
}

const live = (i: Item) => i.state === "queued" || i.state === "running" || i.state === "retrying";

/**
 * Live progress of actions on one service (reinstall, change IP, power, password…). Polls every few
 * seconds while something is running; calls onFinished when an action completes so the page reloads.
 * Bump `refreshKey` right after queuing an action to show it at once.
 */
export function ServiceActivity({ base, refreshKey = 0, onFinished }: { base: string; refreshKey?: number; onFinished?: (item: Item) => void }) {
  const [items, setItems] = useState<Item[]>([]);
  const [hidden, setHidden] = useState<string[]>([]);
  const [, tick] = useState(0);
  const [kick, setKick] = useState(0);
  useEffect(() => {
    const on = () => setKick((k) => k + 1);
    window.addEventListener("primo:service-activity", on);
    return () => window.removeEventListener("primo:service-activity", on);
  }, []);
  const prev = useRef<Record<string, Item["state"]>>({});
  const finished = useRef(onFinished);
  finished.current = onFinished;

  const load = useCallback(async () => {
    try {
      const r = await api(`${base}/activity`);
      skew = new Date(r.now).getTime() - Date.now();
      const next: Item[] = r.items ?? [];
      for (const it of next) {
        const was = prev.current[it.id];
        if (was && was !== it.state && (it.state === "done" || it.state === "failed")) finished.current?.(it);
        prev.current[it.id] = it.state;
      }
      setItems(next);
      return next.some(live);
    } catch {
      return false;
    }
  }, [base]);

  // poll fast while anything runs, then stop; a new action (refreshKey) starts it again
  useEffect(() => {
    let stop = false;
    let t: ReturnType<typeof setTimeout>;
    let quietRounds = 0;
    const run = async () => {
      const busy = await load();
      if (stop) return;
      // right after queuing, the job can take a moment to appear: keep checking briefly
      quietRounds = busy ? 0 : quietRounds + 1;
      if (busy || quietRounds < 3) t = setTimeout(run, busy ? 2500 : 2000);
    };
    run();
    return () => {
      stop = true;
      clearTimeout(t);
    };
  }, [load, refreshKey, kick]);

  // keep the elapsed timers moving
  useEffect(() => {
    if (!items.some(live)) return;
    const i = setInterval(() => tick((n) => n + 1), 1000);
    return () => clearInterval(i);
  }, [items]);

  const shown = items.filter((i) => !hidden.includes(i.id));
  if (!shown.length) return null;
  return (
    <div className="mb-6 space-y-3">
      {shown.map((i) => {
        const pct = i.state === "done" ? 100 : i.progress?.pct;
        const running = live(i);
        const tone = i.state === "failed" ? "rose" : i.state === "done" ? "emerald" : i.state === "retrying" ? "amber" : "primary";
        return (
          <div
            key={i.id}
            className={cx(
              "overflow-hidden rounded-2xl border bg-white shadow-card",
              tone === "rose" ? "border-rose-200" : tone === "emerald" ? "border-emerald-200" : tone === "amber" ? "border-amber-200" : "border-primary/30",
            )}
            role="status"
            aria-live="polite"
          >
            <div className="flex items-start gap-3 px-4 py-3.5 sm:px-5">
              <span
                className={cx(
                  "grid h-10 w-10 shrink-0 place-items-center rounded-xl",
                  tone === "rose" ? "bg-rose-50 text-rose-600" : tone === "emerald" ? "bg-emerald-50 text-emerald-600" : tone === "amber" ? "bg-amber-50 text-amber-600" : "bg-primary-soft text-primary-dark",
                )}
              >
                <Icon name={i.state === "done" ? "check_circle" : i.state === "failed" ? "error" : ICON[i.action] ?? "settings"} className={cx("text-[22px]", running && i.state !== "retrying" && "animate-pulse")} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
                  <div className="font-extrabold text-ink">
                    {i.state === "done" ? `${i.label} — done` : i.state === "failed" ? `${i.label} — failed` : i.state === "queued" ? `${i.label} — waiting to start` : RUNNING_TITLE[i.action] ?? i.label}
                  </div>
                  <div className="text-xs font-semibold text-mute">
                    {i.state === "done" || i.state === "failed" ? `took ${dur(i.startedAt ?? i.queuedAt, i.finishedAt)}` : i.startedAt ? `running ${dur(i.startedAt)}` : `queued ${dur(i.queuedAt)} ago`}
                  </div>
                </div>
                {running && (
                  <>
                    <div className="mt-1 text-sm text-ink/80">{i.state === "queued" ? "Waiting for the previous action on this service to finish…" : i.progress?.step ?? "Starting…"}</div>
                    {i.progress?.detail && <div className="mt-0.5 text-xs text-mute">{i.progress.detail}</div>}
                    <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-line/70">
                      {pct != null && i.state === "running" ? (
                        <div className="h-full rounded-full bg-primary transition-all duration-700" style={{ width: `${Math.max(4, pct)}%` }} />
                      ) : (
                        <div className="h-full w-1/3 animate-[progress-slide_1.4s_ease-in-out_infinite] rounded-full bg-primary/70" />
                      )}
                    </div>
                    {pct != null && i.state === "running" && <div className="mt-1 text-right text-[11px] font-bold text-mute">{pct}%</div>}
                    {i.state === "retrying" && <div className="mt-1 text-xs font-semibold text-amber-700">Didn't work the first time — trying again automatically (attempt {i.attempt + 1} of {i.maxAttempts}).{i.error ? ` ${i.error}` : ""}</div>}
                  </>
                )}
                {i.state === "done" && (
                  <div className="mt-1 text-sm text-ink/80">
                    {i.action === "change_ip" && i.result?.after?.length ? (
                      <>
                        New IP: <span className="font-mono font-bold text-ink">{i.result.after.join(", ")}</span>
                        {i.result.before?.length ? <span className="text-mute"> (was {i.result.before.join(", ")})</span> : null}
                      </>
                    ) : i.action === "reinstall" ? (
                      "The new OS is installed. The login details have been emailed and are shown below."
                    ) : (
                      "Completed successfully."
                    )}
                  </div>
                )}
                {i.state === "failed" && i.error && <div className="mt-1 break-words text-sm text-rose-700">{i.error}</div>}
              </div>
              {!running && (
                <button type="button" aria-label="Dismiss" onClick={() => setHidden((h) => [...h, i.id])} className="-mr-1 grid h-8 w-8 shrink-0 place-items-center rounded-lg text-mute hover:bg-line/50 hover:text-ink">
                  <Icon name="close" className="text-[18px]" />
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
