/**
 * Service actions in flight or just finished (reinstall, change IP, power, password…) with their live
 * progress, read from the provisioning queue. New-VPS setup ("create") has its own tracker and is left out.
 */
import { provisioningQueue, type ProvisionJob } from "../../jobs/queues";
import type { ActionProgress } from "./action-progress";

export const ACTION_LABEL: Record<string, string> = {
  start: "Start",
  stop: "Power off",
  shutdown: "Shutdown",
  reboot: "Reboot",
  hard_reset: "Hard reset",
  reinstall: "Reinstall OS",
  reset_password: "Reset password",
  change_ip: "Change IP",
  suspend: "Suspend",
  unsuspend: "Unsuspend",
  terminate: "Terminate",
  change_package: "Change package",
  change_plan: "Change plan",
};

export interface ActivityItem {
  id: string;
  action: string;
  label: string;
  state: "queued" | "running" | "retrying" | "done" | "failed";
  progress: ActionProgress | null;
  queuedAt: string;
  startedAt: string | null;
  finishedAt: string | null;
  error: string | null;
  attempt: number;
  maxAttempts: number;
  /** change_ip: { before, after } */
  result: { before?: string[]; after?: string[] } | null;
}

const RECENT_MS = 20 * 60_000;

export async function serviceActivity(serviceId: string, audience: "admin" | "client"): Promise<{ items: ActivityItem[]; now: string }> {
  const q = provisioningQueue();
  const [open, finished] = await Promise.all([q.getJobs(["active", "waiting", "delayed", "prioritized"], 0, 500), q.getJobs(["completed", "failed"], 0, 300)]);
  const since = Date.now() - RECENT_MS;
  const jobs = [...open, ...finished].filter((j) => j && (j.data as ProvisionJob).serviceId === serviceId && ACTION_LABEL[(j.data as ProvisionJob).action] && (j.finishedOn ?? j.timestamp) >= since);
  const items = await Promise.all(
    jobs.map(async (j): Promise<ActivityItem> => {
      const st = await j.getState();
      const max = j.opts.attempts ?? 1;
      const state: ActivityItem["state"] = st === "active" ? "running" : st === "completed" ? "done" : st === "failed" ? "failed" : st === "delayed" && j.attemptsMade > 0 ? "retrying" : "queued";
      const p = j.progress && typeof j.progress === "object" ? (j.progress as unknown as ActionProgress) : null;
      const rv = (j.returnvalue ?? null) as { before?: string[]; after?: string[] } | null;
      const raw = j.failedReason || null;
      return {
        id: String(j.id),
        action: (j.data as ProvisionJob).action,
        label: ACTION_LABEL[(j.data as ProvisionJob).action],
        state,
        progress: p,
        queuedAt: new Date(j.timestamp).toISOString(),
        startedAt: j.processedOn ? new Date(j.processedOn).toISOString() : null,
        finishedAt: j.finishedOn && (state === "done" || state === "failed") ? new Date(j.finishedOn).toISOString() : null,
        // customers see a plain message; staff see Virtualizor's / Proxmox's own words
        error: raw && (state === "failed" || state === "retrying") ? (audience === "admin" ? raw : "It couldn't be completed. Please try again, or open a support ticket and we'll sort it out.") : null,
        attempt: j.attemptsMade + (state === "running" ? 1 : 0),
        maxAttempts: max,
        result: rv && (rv.before || rv.after) ? { before: rv.before, after: rv.after } : null,
      };
    }),
  );
  items.sort((a, b) => b.queuedAt.localeCompare(a.queuedAt));
  return { items: items.slice(0, 6), now: new Date().toISOString() };
}
