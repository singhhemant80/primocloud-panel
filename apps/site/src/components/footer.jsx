import React, { useState } from "react";
import logo from "../assets/logo.png";

// Icon helper: applies text-[Npx] inline because the Google icon stylesheet forces 24px.
const I = ({ n, c = "" }) => {
  const m = /text-\[(\d+)px\]/.exec(c);
  return (
    <span
      className={`material-symbols-outlined ${c}`}
      style={m ? { fontSize: `${m[1]}px` } : undefined}
    >
      {n}
    </span>
  );
};

const cols = {
  Hosting: [
    ["Shared Hosting", "/hosting/shared-hosting"],
    ["Reseller Hosting", "/hosting/reseller-hosting"],
    ["Windows VPS", "/vps/windows-vps"],
    ["Linux VPS", "/vps/linux-vps"],
    ["Forex VPS", "/vps/forex-vps"],
    ["Dedicated Server", "/server/dedicated-servers"],
    ["GPU Server", "/server/gpu-servers"],
  ],
  "Cloud Solutions": [
    ["Tally on Cloud", "/cloud-solution/tally-on-cloud"],
    ["Cloud Hosting", "/cloud-hosting"],
    ["Business Cloud", "/business-cloud"],
    ["Storage Solutions", "/storage-solutions"],
    ["Managed Kubernetes", "/managed-kubernetes"],
  ],
  Company: [
    ["About Us", "/about-us"],
    ["Contact", "/contact"],
    ["24/7 Support", "/support"],
    ["Careers", "/careers"],
    ["Datacenter Locations", "/datacenters"],
    ["Partner Program", "/partner-program"],
  ],
  Resources: [
    ["Blog", "/blog"],
    ["Knowledge Base", "/knowledge-base"],
    ["Server Status", "/server-status"],
    ["Tutorials", "/tutorials"],
    ["API Documentation", "/api-docs"],
  ],
};
const legal = [
  ["Terms & Conditions", "/terms-conditions"],
  ["Privacy Policy", "/privacy-policy"],
  ["Refund Policy", "/refund-policy"],
  ["SLA (99.99%)", "/sla"],
  ["Acceptable Use", "/acceptable-use"],
];
const trust = [
  ["verified", "99.99%", "Uptime SLA"],
  ["support_agent", "24/7", "Expert support"],
  ["public", "18+", "Datacenters"],
  ["verified_user", "30-Day", "Money-back guarantee"],
];
// Swap these letter badges for real brand icons (e.g. react-icons) and real URLs.
const socials = [
  ["in", "LinkedIn"],
  ["X", "X"],
  ["f", "Facebook"],
  ["▶", "YouTube"],
];
const pay = ["Visa", "MC", "PayPal", "Wire", "Crypto"];

const Footer = () => {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    // TODO: send `email` to your newsletter API here
    setDone(true);
    setEmail("");
  };

  return (
    <footer className="relative pt-0">
      <div className="relative overflow-hidden bg-gradient-to-b from-[#00210d] to-[#001a0a] text-white pt-64 sm:pt-60 lg:pt-56">
        {/* decoration */}
        <div className="pointer-events-none absolute inset-0 opacity-100 bg-[linear-gradient(rgba(255,255,255,.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.035)_1px,transparent_1px)] bg-[size:48px_48px]" />

        <div className="pointer-events-none absolute -top-24 -left-24 h-80 w-80 rounded-full bg-primary-container/25 blur-3xl" />

        <div className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 rounded-full bg-secondary/30 blur-3xl" />

        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary-fixed-dim to-transparent" />

        {/* NEWSLETTER */}
        <div className="absolute left-1/2 top-0 w-[calc(100%-2rem)] max-w-5xl -translate-x-1/2  mt-5 sm:mt-5 lg:mt-5">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary-container to-secondary p-space-lg sm:p-space-xl shadow-2xl shadow-primary-container/30 flex flex-col lg:flex-row lg:items-center gap-space-lg">
            <span className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full bg-white/10" />
            <span className="pointer-events-none absolute right-24 -bottom-16 h-40 w-40 rounded-full bg-white/10" />
            <div className="relative lg:flex-1">
              <div className="flex items-center gap-2 font-label-sm text-label-sm uppercase tracking-wider text-white/80">
                <I n="mail" c="text-[16px]" />
                Newsletter
              </div>
              <h3 className="font-headline-md text-headline-md font-bold mt-1">
                Cloud tips, offers and launch news
              </h3>
              <p className="font-body-md text-body-md text-white/85 mt-1">
                One short email a month. No spam, unsubscribe anytime.
              </p>
            </div>
            {done ? (
              <div className="relative lg:w-[26rem] flex items-center gap-2 rounded-xl bg-white/15 px-4 py-3 font-label-lg text-label-lg">
                <I n="check_circle" c="text-[22px]" />
                Thanks! You're on the list.
              </div>
            ) : (
              <form
                onSubmit={submit}
                className="relative lg:w-[26rem] flex flex-col sm:flex-row gap-2"
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  aria-label="Email address"
                  className="flex-1 h-12 rounded-xl px-4 bg-white text-on-surface placeholder:text-on-surface-variant/70 font-body-md text-body-md outline-none focus:ring-4 focus:ring-white/30"
                />
                <button
                  type="submit"
                  className="h-12 px-6 rounded-xl bg-[#00210d] hover:bg-black text-white font-label-lg text-label-lg inline-flex items-center justify-center gap-1.5 transition-colors group"
                >
                  Subscribe{" "}
                  <I
                    n="arrow_forward"
                    c="text-[18px] transition-transform group-hover:translate-x-1"
                  />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* FOOTER CONTENT */}
        <div className="relative max-w-7xl mx-auto px-margin-mobile lg:px-margin">
          {/* TRUST STRIP */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-space-md pb-space-xl border-b border-white/10">
            {trust.map(([n, a, b]) => (
              <div
                key={b}
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-space-md transition-colors hover:bg-white/10"
              >
                <span className="w-11 h-11 shrink-0 rounded-xl bg-primary-container/20 text-primary-fixed-dim flex items-center justify-center">
                  <I n={n} c="text-[24px]" />
                </span>

                <div>
                  <div className="font-headline-sm text-headline-sm font-bold leading-tight">
                    {a}
                  </div>

                  <div className="font-body-sm text-body-sm text-white/65">
                    {b}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* main grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-[1.7fr_repeat(4,1fr)] gap-x-gutter gap-y-space-xl py-space-xl">
            <div className="col-span-2 md:col-span-4 lg:col-span-1 flex flex-col gap-space-md">
              <a href="/" className="w-fit rounded-xl bg-white px-3 py-2">
                <img src={logo} alt="PRIMO CLOUD" className="h-9 w-auto" />
              </a>
              <p className="font-body-md text-body-md text-white/65 max-w-xs">
                Enterprise-grade cloud infrastructure and high-performance VPS
                solutions built for mission-critical businesses and developers
                worldwide.
              </p>
              <div className="inline-flex items-center gap-2 w-fit px-3 py-1.5 rounded-full bg-primary-container/15 border border-primary-container/30">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-fixed-dim opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-fixed-dim" />
                </span>
                <span className="font-label-sm text-label-sm text-primary-fixed-dim">
                  All systems operational
                </span>
              </div>
              <div className="flex gap-2">
                {socials.map(([t, name]) => (
                  <a
                    key={name}
                    href="#"
                    aria-label={name}
                    className="w-10 h-10 rounded-full border border-white/15 bg-white/5 flex items-center justify-center font-label-lg text-label-lg text-white/80 transition-all duration-300 hover:bg-primary-container hover:border-primary-container hover:text-white hover:-translate-y-1"
                  >
                    {t}
                  </a>
                ))}
              </div>
            </div>

            {Object.entries(cols).map(([title, items]) => (
              <div key={title}>
                <h4 className="font-label-lg text-label-lg uppercase tracking-wider text-white mb-space-md flex items-center gap-2">
                  <span className="h-3 w-1 rounded-full bg-primary-container" />
                  {title}
                </h4>
                <ul className="space-y-2.5">
                  {items.map(([label, href]) => (
                    <li key={label}>
                      <a
                        href={href}
                        className="group inline-flex items-center gap-0 font-body-md text-body-md text-white/65 transition-all duration-200 hover:text-white hover:translate-x-1"
                      >
                        <span className="w-0 overflow-hidden opacity-0 transition-all duration-200 group-hover:w-4 group-hover:opacity-100 text-primary-fixed-dim">
                          <I n="chevron_right" c="text-[16px]" />
                        </span>
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* support chips */}
          <div className="flex flex-wrap items-center gap-space-sm pb-space-lg">
            {[
              ["call", "24/7 Phone Support", "/contact"],
              ["chat", "Live Chat", "/contact"],
              ["confirmation_number", "Open a Ticket", "/support"],
            ].map(([n, t, h]) => (
              <a
                key={t}
                href={h}
                onClick={
                  t === "Live Chat"
                    ? (e) => {
                        e.preventDefault();
                        window.dispatchEvent(new Event("primo:chat-open"));
                      }
                    : undefined
                }
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/15 bg-white/5 font-label-md text-label-md text-white/85 transition-all hover:bg-primary-container hover:border-primary-container hover:text-white"
              >
                <I n={n} c="text-[18px]" />
                {t}
              </a>
            ))}
          </div>

          {/* bottom bar */}
          <div className="border-t border-white/10 py-space-lg flex flex-col lg:flex-row items-center justify-between gap-space-md">
            <p className="font-body-sm text-body-sm text-white/55 text-center lg:text-left">
              © {new Date().getFullYear()} PRIMO CLOUD. All rights reserved.
            </p>
            <nav className="flex flex-wrap justify-center gap-x-5 gap-y-1">
              {legal.map(([l, h]) => (
                <a
                  key={l}
                  href={h}
                  className="font-body-sm text-body-sm text-white/55 hover:text-primary-fixed-dim transition-colors"
                >
                  {l}
                </a>
              ))}
            </nav>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 font-mono-code text-label-sm uppercase">
                {pay.map((p) => (
                  <span
                    key={p}
                    className="px-2 py-1 rounded-md bg-white/10 text-white/70"
                  >
                    {p}
                  </span>
                ))}
              </div>
              <button
                type="button"
                aria-label="Back to top"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-container to-secondary flex items-center justify-center shadow-lg shadow-primary-container/30 transition-transform hover:-translate-y-1"
              >
                <I n="keyboard_arrow_up" c="text-[22px]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
