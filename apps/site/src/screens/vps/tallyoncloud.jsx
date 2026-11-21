import { orderUrl } from "../../lib/panel";
import React, { useState, useRef } from "react";
import Layout from "../../components/layout";
import { useMotion, CountUp } from "../../components/motion";
import { useCurrency } from "../../context/CurrencyContext";
import {
  I,
  Pill,
  Sec,
  Head,
  Btn,
  OutlineBtn,
  IconBox,
  cardHover,
  Check,
} from "../../components/ui";

// ---------- content (edit freely) ----------
const trustChips = [
  ["verified", "99.99% Uptime SLA"],
  ["lock", "256-bit AES Encryption"],
  ["move_to_inbox", "Free Data Migration"],
];
const suite = [
  [
    "groups",
    "Multi-User Concurrent Access",
    "Let your whole accounts team work in the same company file at the same time, with no locking and no version clashes.",
  ],
  [
    "devices",
    "Any Device, Anywhere",
    "Open Tally from a laptop, tablet or phone through a secure remote session. Your desk is wherever you are.",
  ],
  [
    "account_tree",
    "Real-Time Multi-Branch Consolidation",
    "Every branch posts to one live ledger, so head office sees consolidated books instantly instead of at month end.",
  ],
  [
    "build_circle",
    "Zero Hardware Maintenance",
    "No servers, UPS or antivirus to manage. We patch, monitor and scale the infrastructure for you.",
  ],
];
const plans = [
  {
    n: "Single User", slug: "tally-single-user",
    d: "Freelancers & small shops",
    usd: 9.99,
    s: [
      "1 Concurrent User",
      "2 vCPU · 4 GB RAM",
      "50 GB NVMe Storage",
      "Tally Prime & ERP 9 Ready",
      "Daily Automated Backup",
      "Remote Printing",
    ],
    cta: "Deploy Single User",
  },
  {
    n: "Business Team", slug: "tally-business-team",
    d: "Growing finance teams",
    usd: 24.99,
    feat: true,
    s: [
      "Up to 5 Concurrent Users",
      "4 vCPU · 8 GB RAM",
      "120 GB NVMe Storage",
      "Multi-Company Support",
      "Hourly Automated Backup",
      "Role-Based Data Rights",
    ],
    cta: "Deploy Business Team",
  },
  {
    n: "Enterprise Team", slug: "tally-enterprise-team",
    d: "Multi-branch companies",
    usd: 49.99,
    s: [
      "Up to 15 Concurrent Users",
      "8 vCPU · 16 GB RAM",
      "250 GB NVMe Storage",
      "Custom TDL & ODBC Support",
      "Geo-Redundant Backup",
      "Priority 24/7 Support",
    ],
    cta: "Deploy Enterprise",
  },
  {
    n: "CA & Agency Hub", slug: "tally-ca-agency-hub",
    d: "Firms managing many clients",
    usd: 99.99,
    s: [
      "Up to 40 Concurrent Users",
      "16 vCPU · 32 GB RAM",
      "500 GB NVMe Storage",
      "Unlimited Client Companies",
      "Dedicated Account Manager",
      "White-Glove Migration",
    ],
    cta: "Contact Specialist",
  },
];
const planNotes = [
  ["verified_user", "7-Day Free Trial"],
  ["move_to_inbox", "Free Data Migration"],
  ["credit_card_off", "No Setup Fees"],
  ["undo", "30-Day Money-Back Guarantee"],
];
const arch = [
  [
    "print",
    "Universal Remote Printing & Export",
    "Print invoices and export to Excel, PDF or XML straight to your local printer and desktop with no extra drivers.",
  ],
  [
    "enhanced_encryption",
    "TLS Encryption & Ransomware Shield",
    "End-to-end TLS in transit, AES-256 at rest, and behaviour-based ransomware protection on every session.",
  ],
  [
    "bolt",
    "Blazing Fast NVMe Core Storage",
    "Gen4 NVMe arrays cut report generation and voucher posting time on even the heaviest company files.",
  ],
  [
    "backup",
    "Automated 5-Tier Geo-Redundant Backup",
    "Hourly, daily, weekly and monthly snapshots replicated across regions, restorable in a click.",
  ],
  [
    "manage_accounts",
    "Granular User Role & Data Rights",
    "Decide who can view, post, alter or export. Lock sensitive ledgers from specific users.",
  ],
  [
    "extension",
    "Full TDL & Custom ODBC Add-on Support",
    "Run your existing TDL customisations, ODBC connections and third-party add-ons unchanged.",
  ],
];
const specs = [
  ["memory", "Processor", "AMD EPYC™ 3.4 GHz"],
  ["developer_board", "Memory", "DDR4 ECC RAM"],
  ["hard_drive_2", "Storage", "NVMe Gen4 · 7,000 MB/s"],
  ["desktop_windows", "Platform", "Windows Server 2019 / 2022"],
];
const useCases = [
  [
    "balance",
    "Chartered Accountants & Auditors",
    "Handle dozens of client companies from one login, with controlled access for articled staff and auditors.",
    ["Unlimited client companies", "Audit-trail friendly"],
  ],
  [
    "storefront",
    "Multi-Location Retail & Distribution",
    "Billing counters and warehouses post to the same live ledger, with stock and sales visible at head office.",
    ["Branch-wise stock", "Live consolidation"],
  ],
  [
    "precision_manufacturing",
    "Manufacturing & Supply Chain",
    "Bills of material, job work and inventory movement stay synced across plant, stores and accounts.",
    ["BOM & job work", "Multi-godown"],
  ],
  [
    "rocket_launch",
    "E-Commerce & High-Growth Startups",
    "Scale users and storage on demand as order volumes grow, without buying hardware.",
    ["Scale in minutes", "API & ODBC ready"],
  ],
];
const compare = [
  [
    "Data Crash Risk",
    "Replicated storage with instant restore",
    "Single disk failure can lose books",
  ],
  [
    "Remote Accessibility",
    "Secure access from any device, 24/7",
    "Only at the office, or risky remote tools",
  ],
  [
    "Multi-User Speed",
    "Dedicated cores, NVMe, no LAN bottleneck",
    "Slows down as users and data grow",
  ],
  [
    "Backup Reliability",
    "Automated, off-site, 5-tier retention",
    "Manual pen-drive or occasional copy",
  ],
  [
    "Maintenance & Virus Defense",
    "Managed patching and ransomware shield",
    "Your staff, your antivirus, your risk",
  ],
];
const sovereignty = [
  ["Encryption at rest", "AES-256"],
  ["Encryption in transit", "TLS 1.3"],
  ["Data residency", "Choose your region"],
  ["Tamper detection", "Immutable snapshots"],
];
const badges = ["ISO 27001", "SOC 2 Type II", "GDPR Ready"];
const sessions = [
  [
    "Aarti Rao",
    "aarti@apexlogistics.com",
    "Auditor",
    "Mumbai HQ",
    "Active",
    "2 min ago",
  ],
  [
    "Rohan Mehta",
    "rohan@apexlogistics.com",
    "Accountant",
    "Delhi Branch",
    "Active",
    "Just now",
  ],
  [
    "Kavita Nair",
    "kavita@apexlogistics.com",
    "Viewer",
    "Pune Branch",
    "Idle",
    "18 min ago",
  ],
];
const adminPoints = [
  ["person_add", "Add or remove users in seconds"],
  ["key", "Reset passwords and enforce 2FA"],
  ["logout", "End any session remotely"],
  ["download", "Download backups on demand"],
];
const reviews = [
  [
    "AS",
    "CA Anil Sharma",
    "Partner, Sharma & Associates",
    "We moved 60+ client companies to PRIMO in a weekend. Articled staff work from home and nothing has ever slowed down.",
  ],
  [
    "PN",
    "Priya Nair",
    "CFO, Nair Retail Group",
    "Branch books used to reach us on pen drives. Now consolidation is live and month-end closes in a day, not a week.",
  ],
  [
    "VD",
    "Vikram Desai",
    "Director, Desai Manufacturing",
    "Our TDL customisations worked on day one. Support fixed a printing issue within minutes at 11 pm.",
  ],
];
const faqs = [
  [
    "Can multiple users work on the same Tally company simultaneously?",
    "Yes. Plans include concurrent user licences, so your team can post vouchers and run reports on the same company file at the same time.",
  ],
  [
    "How is my data backed up, and can I download a local copy?",
    "Backups run on an automated multi-tier schedule and are stored in separate locations. You can download a copy from the console whenever you like.",
  ],
  [
    "Does it work with Tally Prime and ERP 9?",
    "Both are supported. You can bring your existing licence, or ask us about licence options.",
  ],
  [
    "What support is available for TDL and add-ons?",
    "Custom TDL files, ODBC connections and most third-party add-ons run as they do on your local machine. Our team helps you install them.",
  ],
  [
    "How do I print or export to my local printer?",
    "Universal remote printing sends output to your local printer, and exports save straight to your own computer.",
  ],
  [
    "Is my accounting data secure and private?",
    "Data is encrypted in transit and at rest, access is role-based, and sessions are monitored. Your data is never shared or used for any other purpose.",
  ],
  [
    "How long does migration take?",
    "Most migrations finish within a few hours. Our engineers move your company data and verify it with you before you go live.",
  ],
  [
    "Can I add more users or storage later?",
    "Yes. Upgrade your plan or add users from the dashboard at any time, with no downtime.",
  ],
  [
    "What internet speed do I need?",
    "A stable 2 Mbps connection per user is enough for smooth daily work. Remote sessions use very little bandwidth.",
  ],
  [
    "Can I cancel or get a refund?",
    "Start with a 7-day free trial, and every paid plan has a 30-day money-back guarantee.",
  ],
];
const bars = [38, 52, 44, 68, 59, 82, 74, 91];

const TallyOnCloud = () => {
  const rootRef = useRef(null);
  useMotion(rootRef);
  const { fmt } = useCurrency();
  const [yearly, setYearly] = useState(false);
  const [open, setOpen] = useState([0]);
  const toggle = (i) =>
    setOpen((o) => (o.includes(i) ? o.filter((x) => x !== i) : [...o, i]));
  const tab =
    "px-4 py-1.5 rounded-lg text-label-md font-label-md transition-all";
  const on =
    "bg-surface-container-lowest text-on-surface shadow-sm font-semibold";
  const off = "text-on-surface-variant hover:text-on-surface";

  return (
    <Layout>
      <div ref={rootRef} className="flex flex-col w-full">
        {/* 1 HERO */}
        <section className="relative w-full overflow-hidden bg-surface py-space-lg lg:py-12">
          <div className="pointer-events-none absolute -top-40 right-0 h-96 w-96 rounded-full bg-primary-container/10 blur-3xl" />
          <div className="pointer-events-none absolute top-1/2 left-0 h-80 w-80 rounded-full bg-secondary-container/20 blur-3xl" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,rgba(11,175,96,0.18)_1px,transparent_1px)] bg-[size:28px_28px] [mask-image:radial-gradient(ellipse_at_center,black_25%,transparent_75%)]" />
          <div className="relative max-w-7xl mx-auto px-margin-mobile lg:px-margin grid grid-cols-1 lg:grid-cols-12 gap-gutter-lg items-center">
            <div className="lg:col-span-7 flex flex-col gap-space-lg">
              <Pill c="w-fit">Enterprise Cloud Accounting</Pill>
              <h1 className="font-display-lg text-display-lg lg:text-[52px] lg:leading-[60px] text-on-surface font-extrabold tracking-tight">
                Run Tally Prime & ERP 9 Anywhere, Anytime on{" "}
                <span className="bg-gradient-to-r from-primary-container via-secondary to-primary-container bg-[length:200%_auto] bg-clip-text text-transparent animate-[shimmer_4s_linear_infinite]">
                  PRIMO High-Speed Cloud
                </span>
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl leading-relaxed">
                Empower your chartered accountants, finance teams and
                multi-branch operations with always-on Tally access,
                uninterrupted multi-user sync and bank-grade data security.
              </p>
              <div className="flex flex-wrap items-center gap-space-md">
                <Btn href="#tally-plans">Start 7-Day Free Trial</Btn>
                <OutlineBtn href="/contact">Schedule Live Demo</OutlineBtn>
              </div>
              <div className="flex flex-wrap gap-space-md pt-space-md border-t border-outline-variant/60">
                {trustChips.map(([n, t]) => (
                  <div key={t} className="flex items-center gap-2">
                    <I n={n} c="text-primary-container text-[20px]" />
                    <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
                      {t}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tally dashboard mock */}
            <div className="lg:col-span-5">
              <div className="animate-float rounded-2xl border border-outline-variant bg-surface-container-lowest/90 backdrop-blur-md shadow-xl shadow-secondary/10 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 bg-surface-container-high border-b border-outline-variant">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-error/70" />
                    <span className="w-3 h-3 rounded-full bg-tertiary-fixed-dim" />
                    <span className="w-3 h-3 rounded-full bg-primary-container" />
                    <span className="font-mono-code text-label-sm text-on-surface-variant ml-2">
                      PRIMO CLOUD · Tally Prime
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1 font-mono-code text-label-sm text-primary-container bg-secondary-container/30 px-2 py-0.5 rounded">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-container animate-pulse" />
                    LIVE
                  </span>
                </div>
                <div className="p-space-md space-y-space-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-headline-sm text-headline-sm font-bold text-on-surface">
                        Apex Global Logistics Pvt Ltd
                      </div>
                      <div className="font-body-sm text-body-sm text-on-surface-variant">
                        FY 2025-26 · 3 branches synced
                      </div>
                    </div>
                    <span className="px-2 py-1 rounded bg-secondary-container/40 text-secondary font-mono-code text-[11px] font-bold">
                      SYNCED
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 font-mono-code">
                    {[
                      ["Vouchers today", "1248"],
                      ["Users online", "12"],
                      ["Sync latency", "38ms"],
                    ].map(([k, v]) => (
                      <div
                        key={k}
                        className="p-2.5 rounded-lg bg-surface-container-low border border-outline-variant text-center"
                      >
                        <div className="text-[10px] text-on-surface-variant">
                          {k}
                        </div>
                        <div className="text-headline-sm font-bold text-primary">
                          <CountUp value={v} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 rounded-lg bg-surface-container-low border border-outline-variant">
                    <div className="flex justify-between font-mono-code text-[11px] text-on-surface-variant mb-2">
                      <span>Monthly sales</span>
                      <span className="text-primary-container font-bold">
                        ▲ 18.4%
                      </span>
                    </div>
                    <div className="flex items-end gap-1.5 h-20">
                      {bars.map((h, i) => (
                        <div
                          key={i}
                          className="flex-1 rounded-sm bg-gradient-to-t from-primary-container to-secondary-container"
                          style={{ height: `${h}%` }}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="space-y-1.5 font-body-sm text-body-sm">
                    {sessions.slice(0, 2).map(([n, , r, b]) => (
                      <div
                        key={n}
                        className="flex items-center justify-between rounded-lg border border-outline-variant px-3 py-2"
                      >
                        <span className="flex items-center gap-2 text-on-surface font-semibold">
                          <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse" />
                          {n}
                          <span className="text-on-surface-variant font-normal">
                            · {r}
                          </span>
                        </span>
                        <span className="text-on-surface-variant">{b}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2 SUITE */}
        <Sec bg="bg-surface-container-low">
          <Head
            pill="Enterprise Cloud Accounting"
            title="Transform Your Tally Architecture into a Boundless Cloud Suite"
            sub="Free your finance team, partners and branch workflows from single-desktop limits and cut the hardware headaches."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
            {suite.map(([n, t, d]) => (
              <div key={t} className={`p-space-lg ${cardHover}`}>
                <IconBox n={n} />
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  {t}
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant mt-space-xs leading-relaxed">
                  {d}
                </p>
              </div>
            ))}
          </div>
        </Sec>

        {/* 3 PLANS */}
        <Sec id="tally-plans">
          <div className="text-center max-w-3xl mx-auto mb-space-xl">
            <Pill>Predictable Accounting Economics</Pill>
            <h2 className="font-headline-xl text-headline-xl text-on-surface font-bold mt-space-sm">
              Transparent Tally on Cloud Plans Built for Any Scale
            </h2>
            <div className="mx-auto mt-space-sm h-1 w-16 rounded-full bg-gradient-to-r from-primary-container to-secondary" />
            <p className="font-body-lg text-body-lg text-on-surface-variant mt-space-sm">
              Switch between monthly and yearly billing. Every plan includes
              migration and a 7-day free trial.
            </p>
            <div className="mt-space-md inline-flex items-center gap-space-sm p-1.5 bg-surface-container rounded-xl border border-outline-variant">
              <button
                type="button"
                onClick={() => setYearly(false)}
                className={`${tab} ${!yearly ? on : off}`}
              >
                Monthly Billing
              </button>
              <button
                type="button"
                onClick={() => setYearly(true)}
                className={`${tab} flex items-center gap-1.5 ${yearly ? on : off}`}
              >
                Yearly Billing
                <span className="bg-primary-container text-on-primary text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  SAVE 20%
                </span>
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter items-stretch">
            {plans.map((p) => (
              <div
                key={p.n}
                className={`flex flex-col justify-between rounded-2xl p-space-lg ${p.feat ? "relative border-2 border-primary-container shadow-2xl shadow-primary-container/25 transform lg:-translate-y-2 bg-gradient-to-b from-secondary-container/20 to-surface-container-lowest" : "bg-surface-container-lowest border border-outline-variant hover:shadow-xl hover:border-primary-container/40 transition-all duration-300"}`}
              >
                {p.feat && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-primary-container text-on-primary font-mono-code text-[11px] font-bold px-3.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm whitespace-nowrap">
                    Most Popular
                  </div>
                )}
                <div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                    {p.n}
                  </h3>
                  <p
                    className={`font-body-sm text-body-sm mt-0.5 ${p.feat ? "text-primary font-medium" : "text-on-surface-variant"}`}
                  >
                    {p.d}
                  </p>
                  <div className="mt-space-md pb-space-md border-b border-outline-variant flex items-baseline gap-1">
                    <span
                      className={`font-display-lg text-display-lg font-extrabold ${p.feat ? "text-primary" : "text-on-surface"}`}
                    >
                      {fmt(yearly ? p.usd * 0.8 : p.usd)}
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      / month
                    </span>
                  </div>
                  <ul className="mt-space-md space-y-space-sm font-body-sm text-body-sm text-on-surface">
                    {p.s.map((x) => (
                      <li key={x} className="flex items-center gap-2">
                        <Check />
                        {x}
                      </li>
                    ))}
                  </ul>
                </div>
                <a
                  href={/^Contact/.test(p.cta ?? "") ? "/contact" : orderUrl(p.slug, yearly)}
                  className={`mt-space-lg w-full inline-flex items-center justify-center font-label-md text-label-md py-3 rounded-xl transition-all ${p.feat ? "bg-primary-container hover:bg-secondary text-on-primary font-bold shadow-md shadow-primary-container/20" : "bg-surface-container-high hover:bg-primary-container hover:text-on-primary text-on-surface font-semibold"}`}
                >
                  {p.cta}
                </a>
              </div>
            ))}
          </div>
          <div className="mt-space-xl p-space-md rounded-2xl bg-surface-container-low border border-outline-variant flex flex-wrap items-center justify-around gap-space-md text-center">
            {planNotes.map(([n, t]) => (
              <div key={t} className="flex items-center gap-2">
                <I n={n} c="text-primary-container" />
                <span className="font-label-md text-label-md font-semibold text-on-surface">
                  {t}
                </span>
              </div>
            ))}
          </div>
        </Sec>

        {/* 4 ARCHITECTURE */}
        <Sec bg="bg-surface-container-low">
          <Head
            pill="Enterprise Capabilities"
            title="Purpose-Built Cloud Architecture for Financial Integrity"
            sub="Engineered with military-grade privacy, high-frequency compute and effortless access for accountants."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
            {arch.map(([n, t, d]) => (
              <div key={t} className={`p-space-lg ${cardHover}`}>
                <IconBox n={n} />
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  {t}
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant mt-space-xs leading-relaxed">
                  {d}
                </p>
              </div>
            ))}
          </div>
        </Sec>

        {/* 5 PERFORMANCE */}
        <Sec>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-lg items-center">
            <div className="lg:col-span-6 flex flex-col gap-space-md">
              <Pill c="w-fit">Enterprise Tally Stack</Pill>
              <h2 className="font-headline-xl text-headline-xl text-on-surface font-bold">
                Calibrated For Instant Query Resolution
              </h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
                Large company files, heavy reports and dozens of vouchers per
                minute need real horsepower. PRIMO runs Tally on dedicated
                high-frequency cores and NVMe storage so reports open in
                seconds.
              </p>
              <div className="space-y-space-sm font-body-md text-body-md text-on-surface">
                {[
                  "Reports on 1M+ vouchers open in seconds",
                  "No lag during month-end and GST filing peaks",
                  "Performance tuned by Tally-certified engineers",
                ].map((t) => (
                  <div key={t} className="flex items-center gap-2">
                    <Check c="text-[20px]" />
                    {t}
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:col-span-6 grid grid-cols-2 gap-gutter-sm">
              {specs.map(([n, k, v]) => (
                <div key={k} className={`p-space-md ${cardHover}`}>
                  <IconBox
                    n={n}
                    size="w-10 h-10 rounded-xl"
                    fs="text-[22px]"
                    mb="mb-space-sm"
                  />
                  <div className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
                    {k}
                  </div>
                  <div className="font-headline-sm text-headline-sm font-bold text-on-surface mt-0.5">
                    {v}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Sec>

        {/* 6 USE CASES */}
        <Sec bg="bg-surface-container-low">
          <Head
            pill="Tailored Operational Scenarios"
            title="How Leading Finance Teams Leverage PRIMO Tally Cloud"
            sub="Built to fit the way CA firms, retailers, manufacturers and startups really work."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
            {useCases.map(([n, t, d, tags]) => (
              <div
                key={t}
                className={`p-space-lg flex flex-col justify-between ${cardHover}`}
              >
                <div>
                  <IconBox
                    n={n}
                    size="w-10 h-10 rounded-xl"
                    fs="text-[22px]"
                    mb="mb-space-sm"
                  />
                  <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                    {t}
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-space-xs leading-relaxed">
                    {d}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-space-sm">
                    {tags.map((x) => (
                      <span
                        key={x}
                        className="px-2 py-0.5 rounded-full bg-secondary-container/40 text-secondary font-label-sm text-[10px]"
                      >
                        {x}
                      </span>
                    ))}
                  </div>
                </div>
                <a
                  href="/contact"
                  className="mt-space-md inline-flex items-center text-label-md font-label-md text-primary font-bold hover:text-primary-container transition-colors"
                >
                  Learn More <I n="arrow_forward" c="text-[16px] ml-1" />
                </a>
              </div>
            ))}
          </div>
        </Sec>

        {/* 7 COMPARISON */}
        <Sec>
          <Head
            pill="Architectural Superiority"
            title="PRIMO Cloud Infrastructure vs Local Office Desktop"
            sub="Discover why finance teams are leaving the office server behind."
          />
          <div className="rounded-2xl border border-outline-variant bg-surface-container-lowest shadow-xl overflow-hidden overflow-x-auto">
            <table className="w-full min-w-[640px] text-left">
              <thead>
                <tr className="font-label-md text-label-md">
                  <th className="p-space-md bg-surface-container-low text-on-surface-variant">
                    Feature
                  </th>
                  <th className="p-space-md bg-gradient-to-r from-primary-container to-secondary text-on-primary">
                    <span className="inline-flex items-center gap-1.5">
                      <I n="cloud_done" c="text-[18px]" />
                      PRIMO Cloud Tally Platform
                    </span>
                  </th>
                  <th className="p-space-md bg-surface-container-low text-on-surface-variant">
                    Traditional Local Office PC
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant font-body-md text-body-md">
                {compare.map(([f, a, b]) => (
                  <tr
                    key={f}
                    className="hover:bg-secondary-container/10 transition-colors"
                  >
                    <td className="p-space-md font-semibold text-on-surface">
                      {f}
                    </td>
                    <td className="p-space-md bg-secondary-container/10 text-on-surface">
                      <span className="flex items-center gap-2">
                        <I
                          n="check_circle"
                          c="text-[20px] text-primary-container shrink-0"
                        />
                        {a}
                      </span>
                    </td>
                    <td className="p-space-md text-on-surface-variant">
                      <span className="flex items-center gap-2">
                        <I n="cancel" c="text-[20px] text-error/70 shrink-0" />
                        {b}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Sec>

        {/* 8 SECURITY */}
        <Sec bg="bg-surface-container-low">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-lg items-center">
            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-outline-variant bg-surface-container-lowest shadow-xl p-space-lg relative overflow-hidden">
                <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-primary-container/10 blur-2xl" />
                <div className="flex items-center justify-between mb-space-md">
                  <div className="flex items-center gap-2">
                    <span className="w-10 h-10 rounded-xl bg-secondary-container/40 flex items-center justify-center text-primary-container">
                      <I n="shield_lock" c="text-[22px]" />
                    </span>
                    <span className="font-headline-sm text-headline-sm font-bold text-on-surface">
                      Data Sovereignty Engine
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-secondary-container/40 text-secondary font-mono-code text-[11px] font-bold">
                    100% ACTIVE
                  </span>
                </div>
                <div className="space-y-2 font-mono-code text-body-sm">
                  {sovereignty.map(([k, v]) => (
                    <div
                      key={k}
                      className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low border border-outline-variant"
                    >
                      <span className="text-on-surface">{k}</span>
                      <span className="text-primary-container font-bold">
                        {v}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="lg:col-span-7 flex flex-col gap-space-md">
              <Pill c="w-fit">Institutional Trust Hub</Pill>
              <h2 className="font-headline-xl text-headline-xl text-on-surface font-bold">
                Your Accounting Data Stays 100% Confidential and Tamper-Proof
              </h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
                Financial records are the crown jewels of any business. PRIMO
                secures every company file with layered protection, strict
                access control and continuous monitoring.
              </p>
              <div className="flex flex-wrap gap-2">
                {badges.map((b) => (
                  <span
                    key={b}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-lowest border border-outline-variant font-label-md text-label-md text-on-surface shadow-sm"
                  >
                    <I n="verified" c="text-[16px] text-primary-container" />
                    {b}
                  </span>
                ))}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm font-body-md text-body-md text-on-surface">
                {[
                  "Isolated container per customer",
                  "Two-factor authentication",
                  "Full audit log of every session",
                  "Private, never-shared data",
                ].map((t) => (
                  <div key={t} className="flex items-center gap-2">
                    <Check c="text-[20px]" />
                    {t}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Sec>

        {/* 9 ADMIN PORTAL */}
        <Sec>
          <Head
            pill="Complete Administrative Control"
            title="Granular Admin Portal for Business Owners & IT Heads"
            sub="Review every user, session and permission from one clean console."
          />
          <div className="rounded-2xl border border-outline-variant bg-surface-container-lowest shadow-2xl overflow-hidden">
            <div className="px-space-lg py-space-md border-b border-outline-variant flex flex-wrap items-center justify-between gap-space-sm">
              <div className="flex items-center gap-space-md">
                <span className="font-mono-code text-headline-sm font-bold text-on-surface">
                  Tally Management Console
                </span>
                <span className="inline-flex items-center gap-1.5 font-mono-code text-[12px] text-secondary bg-secondary-container/40 px-2.5 py-1 rounded-full font-bold">
                  <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse" />
                  3 of 5 users online
                </span>
              </div>
              <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-lowest border border-outline-variant text-body-sm font-label-md text-on-surface hover:text-primary transition-colors">
                <I n="person_add" c="text-[16px]" />
                Add User
              </button>
            </div>
            <div className="grid lg:grid-cols-12">
              <div className="lg:col-span-9 overflow-x-auto">
                <table className="w-full min-w-[640px] text-left font-mono-code text-body-sm">
                  <thead className="bg-surface-container-low text-on-surface-variant uppercase text-[11px] border-b border-outline-variant">
                    <tr>
                      {["User", "Role", "Branch", "Status", "Last Active"].map(
                        (h) => (
                          <th key={h} className="py-2.5 px-3">
                            {h}
                          </th>
                        ),
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant">
                    {sessions.map(([n, e, r, b, st, t]) => (
                      <tr
                        key={e}
                        className="hover:bg-secondary-container/10 transition-colors"
                      >
                        <td className="py-3 px-3">
                          <div className="font-semibold text-on-surface">
                            {n}
                          </div>
                          <div className="text-[11px] text-on-surface-variant">
                            {e}
                          </div>
                        </td>
                        <td className="py-3 px-3">{r}</td>
                        <td className="py-3 px-3">{b}</td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-bold ${st === "Active" ? "bg-secondary-container/40 text-secondary" : "bg-surface-container-high text-on-surface-variant"}`}
                          >
                            {st.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-on-surface-variant">
                          {t}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="lg:col-span-3 border-t lg:border-t-0 lg:border-l border-outline-variant p-space-md space-y-space-sm bg-surface-container-low">
                <div className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
                  Admin tools
                </div>
                {adminPoints.map(([n, t]) => (
                  <div
                    key={t}
                    className="flex items-center gap-2 font-body-sm text-body-sm text-on-surface"
                  >
                    <I n={n} c="text-[18px] text-primary-container" />
                    {t}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Sec>

        {/* 10 REVIEWS */}
        <Sec bg="bg-surface-container-low">
          <Head
            pill="Seven Years Of Excellence"
            title="Trusted by Over 4,200+ Chartered Accountants & CFOs"
            sub="Hear from the finance leaders who run their books on PRIMO Cloud."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            {reviews.map(([i, n, r, t]) => (
              <div
                key={n}
                className="p-space-lg bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-sm relative flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 hover:border-primary-container/40 transition-all duration-300"
              >
                <div>
                  <div className="flex gap-1 text-primary-container mb-space-sm">
                    {[...Array(5)].map((_, k) => (
                      <I key={k} n="star" c="text-[18px]" />
                    ))}
                  </div>
                  <I
                    n="format_quote"
                    c="absolute top-4 right-5 text-[56px] text-primary-container/15"
                  />
                  <p className="relative font-body-md text-body-md text-on-surface italic leading-relaxed">
                    "{t}"
                  </p>
                </div>
                <div className="mt-space-lg pt-space-md border-t border-outline-variant flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-container to-secondary flex items-center justify-center font-bold text-on-primary">
                    {i}
                  </div>
                  <div>
                    <h4 className="flex items-center gap-1 font-label-lg text-label-lg font-bold text-on-surface">
                      {n}
                      <I n="verified" c="text-[16px] text-primary-container" />
                    </h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      {r}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Sec>

        {/* 11 FAQ */}
        <Sec>
          <Head
            pill="Technical Clarifications"
            title="Frequently Asked Questions About Tally on Cloud"
            sub="Everything you need to know before you move your books to the cloud."
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter items-start">
            {[faqs.slice(0, 5), faqs.slice(5)].map((col, c) => (
              <div key={c} className="space-y-space-sm">
                {col.map(([q, a], j) => {
                  const i = c * 5 + j;
                  const isOpen = open.includes(i);
                  return (
                    <div
                      key={q}
                      className={`rounded-xl border bg-surface-container-lowest overflow-hidden transition-all duration-300 ${isOpen ? "border-primary-container shadow-md shadow-primary-container/10" : "border-outline-variant"}`}
                    >
                      <button
                        type="button"
                        onClick={() => toggle(i)}
                        className="w-full p-space-md text-left flex items-center justify-between gap-3 font-headline-sm text-label-lg font-bold text-on-surface"
                      >
                        <span>{q}</span>
                        <I
                          n="expand_more"
                          c={`text-primary-container shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                        />
                      </button>
                      <div
                        className={`grid transition-all duration-300 ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
                      >
                        <div className="overflow-hidden">
                          <div className="px-space-md pb-space-md text-body-md text-on-surface-variant leading-relaxed">
                            {a}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </Sec>

        {/* 12 CTA */}
        <section className="w-full bg-gradient-to-r from-primary-container via-secondary to-primary-container bg-[length:200%_auto] animate-[shimmer_8s_linear_infinite] py-space-xl text-on-primary relative overflow-hidden">
          <span className="pointer-events-none absolute -left-10 top-6 h-40 w-40 rounded-full bg-white/10 animate-float" />
          <span className="pointer-events-none absolute -right-8 bottom-4 h-52 w-52 rounded-full bg-white/10 animate-float [animation-delay:1.5s]" />
          <div className="max-w-5xl mx-auto px-margin-mobile lg:px-margin text-center relative z-10">
            <h2 className="font-display-lg text-display-lg font-extrabold tracking-tight">
              Ready to Supercharge Your Tally Accounting?
            </h2>
            <p className="font-body-lg text-body-lg mt-space-sm max-w-2xl mx-auto opacity-95">
              Join thousands of accountants and finance teams running Tally on
              PRIMO Cloud. Free migration and a 7-day free trial included.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-space-md mt-space-lg">
              <a
                href="#tally-plans"
                className="font-label-lg text-label-lg bg-surface-container-lowest hover:bg-surface-bright text-secondary px-8 py-3.5 rounded-xl shadow-lg font-bold transition-all hover:-translate-y-0.5"
              >
                Start 7-Day Free Trial
              </a>
              <OutlineBtn href="/contact" light>
                Talk to a Cloud Specialist
              </OutlineBtn>
            </div>
            <p className="font-mono-code text-[12px] tracking-wide mt-space-md opacity-85">
              No Setup Fees • Free Data Migration • 30-Day Money-Back Guarantee
            </p>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default TallyOnCloud;
