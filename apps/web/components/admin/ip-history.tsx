"use client";
import { useState } from "react";
import { date } from "@/lib/api";
import { Icon, cx, useApi } from "@/components/ui";

const SOURCE: Record<string, { label: string; cls: string }> = {
  VIRTUALIZOR: { label: "Virtualizor", cls: "bg-amber-50 text-amber-800 ring-amber-200" },
  PANEL: { label: "Panel", cls: "bg-primary-soft text-primary-dark ring-[#c9f5da]" },
  IMPORT: { label: "Import", cls: "bg-slate-100 text-slate-700 ring-slate-200" },
};

/** Every IP this service was given or lost — by the panel, staff, an import, or directly in Virtualizor. */
export function IpHistory({ serviceId }: { serviceId: string }) {
  const [open, setOpen] = useState(false);
  const { data, loading } = useApi<{ events: any[] }>(open ? `/admin/services/${serviceId}/ip-history` : null, [open]);
  const events = data?.events ?? [];
  return (
    <div className="mt-3">
      <button type="button" onClick={() => setOpen(!open)} className="flex items-center gap-1 text-xs font-bold text-primary-dark hover:underline">
        <Icon name="history" className="text-[16px]" />
        {open ? "Hide IP history" : "IP history"}
        <Icon name={open ? "expand_less" : "expand_more"} className="text-[16px]" />
      </button>
      {open && (
        <div className="mt-2 overflow-x-auto rounded-xl border border-line">
          {loading ? (
            <p className="px-3 py-3 text-sm text-mute">Loading…</p>
          ) : !events.length ? (
            <p className="px-3 py-3 text-sm text-mute">No IP changes recorded yet.</p>
          ) : (
            <table className="w-full min-w-[620px] text-[13px]">
              <thead className="bg-[#f7fffb] text-left text-[11px] font-bold uppercase tracking-wider text-mute">
                <tr><th className="px-3 py-2">When</th><th className="px-3 py-2">IP</th><th className="px-3 py-2">Change</th><th className="px-3 py-2">By</th><th className="px-3 py-2">Details</th></tr>
              </thead>
              <tbody className="divide-y divide-line">
                {events.map((e) => {
                  const src = SOURCE[e.source] ?? SOURCE.PANEL;
                  return (
                    <tr key={e.id}>
                      <td className="whitespace-nowrap px-3 py-2 text-slate-600">{date(e.createdAt, true)}</td>
                      <td className="px-3 py-2 font-mono font-semibold text-ink">{e.address}{e.isPrimary && <span className="ml-1 rounded bg-primary-soft px-1 text-[10px] font-bold uppercase text-primary-dark">Primary</span>}</td>
                      <td className="px-3 py-2">
                        <span className={cx("inline-flex items-center gap-1 font-bold", e.action === "ASSIGNED" ? "text-emerald-700" : "text-rose-700")}>
                          <Icon name={e.action === "ASSIGNED" ? "add_circle" : "remove_circle"} className="text-[15px]" />
                          {e.action === "ASSIGNED" ? "Added" : "Removed"}
                        </span>
                      </td>
                      <td className="px-3 py-2">
                        <span className={cx("rounded-full px-2 py-0.5 text-[11px] font-bold ring-1", src.cls)}>{src.label}</span>
                        {e.actorName && <span className="ml-1.5 text-xs text-mute">{e.actorName}</span>}
                      </td>
                      <td className="px-3 py-2 text-slate-600">{e.note || "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
