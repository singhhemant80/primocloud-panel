import React from "react";
import { Page, Hero, Sec, Cta, I, Eyebrow } from "../../components/kit";

/*
  STATUS DATA - edit this block (or replace it with a fetch to your monitoring tool, e.g. Uptime Kuma
  or Better Stack). Allowed states: "up" | "degraded" | "down". `incidents` is shown newest first.
*/
const services = [
  ["Shared & WordPress Hosting", "cloud", "up"],
  ["Reseller Hosting", "storefront", "up"],
  ["VPS (Linux & Windows)", "dns", "up"],
  ["Dedicated & GPU Servers", "memory", "up"],
  ["Cloud Solutions", "cloud_sync", "up"],
  ["Network & DDoS protection", "lan", "up"],
  ["Client Area & Billing", "receipt_long", "up"],
  ["Support & Live Chat", "support_agent", "up"],
];
const regions = [
  ["FRA-01", "Frankfurt", "up"],
  ["LON-01", "London", "up"],
  ["NYC-01", "New York", "up"],
  ["SIN-01", "Singapore", "up"],
  ["TYO-01", "Tokyo", "up"],
];
const incidents = []; // e.g. { date: "12 Oct 2026", title: "Packet loss in FRA-01", status: "Resolved", note: "…" }

const look = {
  up: ["Operational", "bg-primary-container", "text-primary"],
  degraded: ["Degraded", "bg-[#f59e0b]", "text-[#b45309]"],
  down: ["Outage", "bg-error", "text-error"],
};
const Dot = ({ s }) => <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${look[s][1]} ${s === "up" ? "animate-pulse" : ""}`} />;

const ServerStatus = () => {
  const all = [...services, ...regions].map((x) => x[2]);
  const overall = all.includes("down") ? "down" : all.includes("degraded") ? "degraded" : "up";
  const headline = { up: "All systems operational", degraded: "Some systems are degraded", down: "We are experiencing an outage" }[overall];

  return (
    <Page>
      <Hero pill="Server status" title="Live platform" accent="status" sub="The current state of our hosting, servers, network and support.">
        <div className={`mt-space-lg inline-flex items-center gap-3 rounded-xl border px-5 py-3 ${overall === "up" ? "border-primary-container/40 bg-secondary-container/40" : "border-outline-variant bg-surface-container-lowest"}`}>
          <Dot s={overall} />
          <span className={`font-headline-sm text-headline-sm font-bold ${look[overall][2]}`}>{headline}</span>
        </div>
      </Hero>

      <Sec>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-lg items-start">
          <div className="lg:col-span-7 bg-surface-container-lowest border border-outline-variant rounded-xl p-space-lg">
            <Eyebrow>Services</Eyebrow>
            <ul className="mt-space-sm divide-y divide-outline-variant/50">
              {services.map(([n, ic, s]) => (
                <li key={n} className="flex items-center gap-3 py-3">
                  <I n={ic} c="text-[22px] text-primary-container" />
                  <span className="flex-1 font-body-md text-body-md font-semibold text-on-surface">{n}</span>
                  <span className={`inline-flex items-center gap-2 font-mono-code text-[12px] font-semibold ${look[s][2]}`}><Dot s={s} />{look[s][0]}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-gutter">
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-space-lg">
              <Eyebrow>Datacenters</Eyebrow>
              <ul className="mt-space-sm divide-y divide-outline-variant/50">
                {regions.map(([c, n, s]) => (
                  <li key={c} className="flex items-center gap-3 py-2.5">
                    <span className="font-mono-code text-label-md font-bold text-on-surface w-16">{c}</span>
                    <span className="flex-1 font-body-sm text-body-sm text-on-surface-variant">{n}</span>
                    <Dot s={s} />
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-space-lg">
              <Eyebrow>Incident history</Eyebrow>
              {incidents.length ? (
                <ul className="mt-space-sm flex flex-col gap-3">
                  {incidents.map((i) => (
                    <li key={i.title}>
                      <div className="font-mono-code text-[11px] text-on-surface-variant">{i.date} · {i.status}</div>
                      <div className="font-body-md text-body-md font-semibold text-on-surface">{i.title}</div>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">{i.note}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-space-sm font-body-md text-body-md text-on-surface-variant">No incidents to report.</p>
              )}
            </div>
          </div>
        </div>
      </Sec>

      <Cta title="Seeing a problem we haven't reported?" text="Open a ticket or call us. Critical tickets page the engineer on call." primary={["Open a ticket", "/support"]} secondary={["Contact us", "/contact"]} />
    </Page>
  );
};

export default ServerStatus;
