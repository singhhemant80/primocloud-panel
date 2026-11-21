import { orderUrl } from "../../lib/panel";
import React, { useState, useEffect, useRef } from "react";
import Layout from "../../components/layout";
import { useMotion } from "../../components/motion";
import { useCurrency } from "../../context/CurrencyContext";
import { I, Pill, Sec, Head, cardHover, IconBox } from "../../components/ui";

// ---------- content (taken from the HTML design) ----------
const heroStats = [
  ["99.99%", "Execution Uptime SLA", 1],
  ["Unlimited", "Zero Execution Limits"],
  ["<15ms", "Webhook Response", 1],
  ["1-Click", "AI & Webhook Stacks"],
];
const nodes = [
  [
    "01. Webhook",
    "bolt",
    "text-inverse-primary",
    "Incoming Support",
    "POST /v1/webhook",
    "ms",
  ],
  [
    "02. AI Agent",
    "smart_toy",
    "text-tertiary-fixed",
    "Claude 3.5 Sonnet",
    "RAG Context Chain",
    "Token Stream OK",
  ],
  [
    "03. Vector Index",
    "database",
    "text-secondary-fixed",
    "Qdrant Vector DB",
    "Cosine Top-5 Search",
    "q",
  ],
  [
    "04. Dedicated DB",
    "storage",
    "text-inverse-primary",
    "PostgreSQL 16",
    "Upsert Ticket Payload",
    "Zero Locking",
  ],
  [
    "05. Notification",
    "send",
    "text-tertiary-fixed",
    "Slack Alert & CRM",
    "Broadcast Event",
    "200 OK Sent",
  ],
];
const pillars = [
  [
    "all_inclusive",
    "Unlimited Executions & Zero Seat Tax",
    "Unlike official n8n Cloud or Zapier that penalize your business growth with tiered execution quotas and steep seat fees, PRIMO gives you raw, dedicated compute with completely unmetered workflow runs.",
  ],
  [
    "layers",
    "Isolated Redis & PostgreSQL Backend",
    "Standard setups fail under concurrent load due to SQLite locks. We orchestrate a high-performance Redis worker queue paired with a dedicated PostgreSQL database engine for instant webhook processing.",
  ],
  [
    "verified_user",
    "100% GDPR & Private Data Sovereignty",
    "Keep critical customer records, API credentials, and financial payloads inside your isolated, single-tenant virtual machine. Zero telemetry, zero analytics piggybacking, and full compliance guarantee.",
  ],
  [
    "neurology",
    "Native AI & Vector DB Integrations",
    "Pre-loaded with modern AI stacks: LangChain nodes, OpenAI, Anthropic, local Ollama endpoints, Qdrant vector databases, and full root support for custom npm and Python packages in code nodes.",
  ],
];
const plans = [
  {
    eyebrow: "Solo & MVP",
    n: "n8n-Starter", slug: "n8n-starter",
    d: "Ideal for solo founders, developers, and pilot automation projects.",
    p: [19.99, 15.99],
    cta: "Deploy Starter",
    s: [
      "**2 vCPU** AMD EPYC™ Gen4",
      "**4 GB** High-Speed DDR5 RAM",
      "**60 GB** NVMe PCIe 4.0 Storage",
      "**Unmetered** Executions & Webhooks",
      "Pre-configured SSL & Custom Domain",
      "Automated Daily Snapshots",
    ],
  },
  {
    eyebrow: "Scaling Teams",
    n: "n8n-Pro", slug: "n8n-pro",
    feat: true,
    d: "Engineered for high-volume SaaS operations & RevOps pipelines.",
    p: [39.99, 31.99],
    cta: "Deploy Pro Instance",
    s: [
      "**4 Dedicated** AMD EPYC™ Cores",
      "**8 GB** DDR5 RAM",
      "**120 GB** Enterprise NVMe Gen4",
      "**Dedicated Redis** & 8 Parallel Workers",
      "Unlimited Webhooks & Data Transfers",
      "Priority Slack & Discord Support",
      "1-Click Backup & Instant Rollback",
    ],
  },
  {
    eyebrow: "Enterprise Workloads",
    n: "n8n-Business", slug: "n8n-business",
    d: "Multi-team workflows with concurrent AI model chaining.",
    p: [79.99, 63.99],
    cta: "Deploy Business",
    s: [
      "**8 Dedicated** AMD EPYC™ Cores",
      "**16 GB** DDR5 ECC Memory",
      "**250 GB** NVMe Gen4 Storage",
      "**32 Concurrency** Redis Worker Queue",
      "Custom NPM & Python Packages Allowed",
      "SSO / SAML Authentication Ready",
      "99.99% Financial Uptime SLA",
    ],
  },
  {
    eyebrow: "HA Distributed",
    n: "n8n-Enterprise", slug: "n8n-enterprise",
    d: "Mission-critical high-availability cluster with managed failover.",
    p: [149.99, 119.99],
    cta: "Deploy Enterprise",
    s: [
      "**16 Dedicated** AMD EPYC™ Cores",
      "**32 GB** DDR5 ECC Memory",
      "**500 GB** PCIe Gen5 NVMe RAID-10",
      "Dedicated PostgreSQL HA Cluster",
      "Dual Redis Broker with Auto-Failover",
      "VIP 15-Minute Human Response SLA",
      "Dedicated IPv4 + IPv6 /48 BGP",
    ],
  },
];
const planTrust = [
  ["verified", "30-Day Unconditional Money-Back Guarantee"],
  [
    "published_with_changes",
    "Free Zero-Downtime Migration from Zapier / Make / n8n Cloud",
  ],
  ["timer", "Instant 60-Second Provisioning"],
];
const stack = [
  [
    "sync_alt",
    "QUEUE_SYS_01",
    "Autonomous Redis Queue Scaling",
    "Never drop a payment webhook. Redis queue dynamically allocates background worker threads during volume spikes, guaranteeing zero task starvation.",
  ],
  [
    "terminal",
    "RUNTIME_SYS_02",
    "Custom npm & Python Packages",
    "Need pandas, numpy, or custom npm SDKs in your Code nodes? Install any proprietary Python or JavaScript module directly into execution container without restrictions.",
  ],
  [
    "lock",
    "NETWORK_SYS_03",
    "Pre-configured Reverse Proxy & Auto SSL",
    "Instant TLS with automatic Let's Encrypt renewal through dedicated high-concurrency Caddy reverse proxies. Point your custom DNS record and go live in seconds.",
  ],
  [
    "source_environment",
    "DEVOPS_SYS_04",
    "Git Integration & CI/CD Workflow Sync",
    "Version-control your workflow JSON templates with GitHub or GitLab. Roll out automated staging-to-production deployment cycles with native CLI hooks.",
  ],
  [
    "speed",
    "TRANSIT_SYS_05",
    "Webhook Instant Ingestion (sub-15ms)",
    "Our multi-gigabit Tier-1 transit routing ensures third-party event emitters (Stripe, Shopify, GitHub) experience ultra-low latency response windows with zero timeouts.",
  ],
  [
    "security_update_good",
    "MAINT_SYS_06",
    "Zero Maintenance & Auto Security Patches",
    "We handle Host OS kernel patching, Docker container engine updates, and PostgreSQL vacuuming seamlessly in the background with zero scheduled downtime.",
  ],
];
const useCases = [
  [
    "psychology",
    "AI Agent & LLM Automation Pipelines",
    "Orchestrate autonomous agent swarms combining Claude 3.5 Sonnet, GPT-4o, and self-hosted Ollama models. Index unstructured documents into Qdrant vector databases in real-time.",
    ["LangChain", "Vector Embeddings", "OpenAI API"],
  ],
  [
    "hub",
    "Enterprise CRM & RevOps Sync",
    "Execute high-volume, bi-directional syncs across Salesforce, HubSpot, Stripe billing events, and backend ERP systems without paying exorbitant per-task pricing tiers.",
    ["Salesforce", "HubSpot", "Stripe Webhooks"],
  ],
  [
    "sensors",
    "High-Frequency Webhook Ingestion & IoT",
    "Process tens of thousands of continuous IoT telemetry pulses, payment webhooks, or sensor telemetry per minute with zero buffer overflow or worker starvation.",
    ["MQTT", "Redis Worker", "JSON Buffering"],
  ],
  [
    "emergency_home",
    "DevOps Incident Response & ChatOps",
    "Trigger automated triage protocols directly from PagerDuty or Datadog alerts. Inspect crashing Kubernetes pods, run health checks, and notify on-call engineers via Slack.",
    ["Kubectl", "PagerDuty", "Slack Interactive"],
  ],
  [
    "receipt_long",
    "Financial Reconciliation & Invoicing",
    "Cross-match automated banking feeds with internal accounts receivable. Automatically generate compliant PDF invoices and update accounting ledgers without manual input.",
    ["PDF Rendering", "Xero / QuickBooks", "Open Banking API"],
  ],
  [
    "shopping_cart",
    "E-Commerce Multi-Channel Fulfillment",
    "Synchronize dynamic inventory balances across Shopify, Amazon Seller Central, and 3PL fulfillment warehouses with zero out-of-stock reconciliation discrepancies.",
    ["Shopify Plus", "Amazon SP-API", "WMS Sync"],
  ],
];
const integrations = [
  [
    "smart_toy",
    "AI & Vector",
    [
      "OpenAI",
      "Anthropic Claude",
      "Qdrant",
      "Pinecone",
      "HuggingFace",
      "Ollama",
      "LangChain Agents",
    ],
  ],
  [
    "database",
    "Databases",
    [
      "PostgreSQL",
      "MongoDB",
      "Redis Cache",
      "MySQL",
      "Supabase",
      "Snowflake",
      "ClickHouse",
    ],
  ],
  [
    "forum",
    "Messaging & CRM",
    [
      "Slack",
      "Discord",
      "Telegram Bot",
      "Salesforce",
      "HubSpot",
      "Zendesk",
      "WhatsApp API",
    ],
  ],
  [
    "cloud_sync",
    "Cloud & DevOps",
    [
      "AWS S3 / Lambda",
      "Google Cloud Platform",
      "Docker Engine",
      "GitHub Actions",
      "GitLab CI",
      "Jira Software",
      "Cloudflare",
    ],
  ],
  [
    "lan",
    "Raw Protocols",
    [
      "REST API",
      "GraphQL",
      "Webhooks (HMAC)",
      "gRPC",
      "MQTT",
      "IMAP / SMTP",
      "SFTP / SSH",
    ],
  ],
];
const compare = [
  [
    "Monthly Cost for 500k Executions",
    "$39.99 / mo flat",
    "$240.00+ / mo (Capped)",
    "$700.00+ / mo (Tiered Zap tax)",
    "~$35 / mo + 15 hrs devops labor",
  ],
  [
    "Execution Limits & Quotas",
    "Truly Unlimited (Compute-Bound)",
    "Hard Quota Caps",
    "Hard Task Caps & Throttling",
    "Unlimited (Hardware limits)",
  ],
  [
    "Data Sovereignty & PII Privacy",
    "100% Dedicated & Private (EU/US)",
    "Multi-tenant Shared Cloud",
    "Third-Party Shared Infrastructure",
    "Fully Private (DIY Hardened)",
  ],
  [
    "Custom NPM & Python Packages",
    "Full Support (Direct Install)",
    "Restricted / Blocked",
    "No Custom Package Support",
    "Manual Dockerfile builds",
  ],
  [
    "Queue Orchestration",
    "Pre-Tuned Redis + PostgreSQL HA",
    "Managed Blackbox Queue",
    "Proprietary Internal Queue",
    "Defaults to SQLite (Deadlocks!)",
  ],
  [
    "Automated Upgrades & Backups",
    "Zero-Downtime 1-Click Rollback",
    "Automatic",
    "Automatic",
    "Manual (Risk of corruption)",
  ],
  [
    "Support SLA",
    "15-Min VIP Slack & Live Chat",
    "Email Tickets (24-48 hrs)",
    "Tier-based Email Support",
    "None (Community forums only)",
  ],
];
const services = [
  ["n8n-server", "Version 1.65.1 Stable", "UPTIME 49d"],
  ["redis-queue", "16 Parallel Workers", "HEALTHY"],
  ["postgres-db", "PostgreSQL v16.2", "INDEXED"],
  ["caddy-ssl", "Let's Encrypt Active", "TLS 1.3"],
];
const reviews = [
  [
    "MK",
    "Marcus Keller",
    "CTO, SynthFlow AI Automation",
    '"We were paying over $1,200 every month on Make & Zapier for customer AI onboarding workflows. Switching to PRIMO Managed n8n dropped our bill to $39/mo with zero execution caps. The sub-15ms webhook speeds are unbelievable."',
  ],
  [
    "EL",
    "Elena Lindqvist",
    "Head of RevOps, Valora Pay",
    '"Because we handle strict financial transaction data, shared multi-tenant automation clouds were a strict GDPR violation. PRIMO gave us a dedicated, single-tenant AMD EPYC VM with custom npm and Python support right out of the box."',
  ],
  [
    "DR",
    "Devon Ramirez",
    "Lead DevOps Architect, CloudGrid",
    '"Self-hosting n8n ourselves became a full-time babysitting job once SQLite locked up on our 3rd webhook spike. PRIMO\'s pre-configured Redis worker pool solved our concurrency headaches overnight. Zero downtime since day one."',
  ],
];
const faqs = [
  [
    "How does PRIMO n8n differ from official n8n Cloud?",
    "Official n8n Cloud charges you based on strict execution quotas (e.g. 10k or 50k runs per month) and restricts custom binary packages. PRIMO deploys a completely dedicated, single-tenant virtual machine where you have unmetered executions, root access, and can install any Python or npm packages you need.",
  ],
  [
    "Are workflow executions truly unlimited?",
    "Yes. We do not inspect, count, meter, or bill based on your execution runs. Your only ceiling is the physical hardware power (CPU, RAM, NVMe throughput) of your selected dedicated node.",
  ],
  [
    "How do I migrate my existing workflows from Zapier or n8n?",
    "Export your existing workflows from n8n as a single JSON file and import them directly into your PRIMO n8n dashboard in seconds. For migrations from Zapier or Make, our automated conversion assistant and dedicated 24/7 support engineers will assist you completely free of charge.",
  ],
  [
    "Can I install custom npm and Python packages?",
    "Yes. You have full root container access. You can specify any npm dependencies or pip packages (e.g. pandas, scikit-learn, custom internal SDKs) directly via the web control panel or your node's environment variables.",
  ],
  [
    "How are data privacy and GDPR compliance handled?",
    "Your server is single-tenant and isolated. We sign Data Processing Agreements (DPAs) for enterprise clients. All datacenter locations in Frankfurt and Amsterdam are ISO 27001, SOC 2, and 100% GDPR compliant.",
  ],
  [
    "What happens if an unexpected webhook spike occurs?",
    "Because our architecture uses a decoupled Redis message broker rather than standard SQLite storage, webhook payloads are immediately queued in memory. As workers clear tasks, they pull from the queue with zero dropped webhooks.",
  ],
  [
    "Can I connect internal corporate databases via private VPC?",
    "Yes. All PRIMO Cloud instances can be connected via isolated WireGuard VPN tunnels or private cross-connect VPC networks to securely access your internal PostgreSQL, MySQL, or SAP endpoints.",
  ],
  [
    "Is Community or Enterprise n8n edition installed?",
    "Every instance comes with the latest production n8n edition pre-installed. If your organization holds an official n8n enterprise license key (for SAML/SSO or advanced team roles), you can paste it directly into the control panel.",
  ],
  [
    "How do automated backups and disaster recovery work?",
    "We perform automated nightly block-level snapshots of your instance and PostgreSQL database. Backups are replicated off-site to a secondary geographically separated cluster. You can trigger manual instant rollbacks anytime.",
  ],
  [
    "What is your uptime guarantee?",
    "We provide an ironclad 99.99% hardware, network, and execution uptime SLA backed by financial service credits. If our systems fail to deliver, you receive automatic SLA rebates.",
  ],
];

const rich = (s) =>
  s.split("**").map((t, i) => (i % 2 ? <strong key={i}>{t}</strong> : t));
const reduced = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const useTick = (base, spread, dec = 0, ms = 2400) => {
  const [v, setV] = useState(base);
  useEffect(() => {
    if (reduced()) return;
    const t = setInterval(
      () => setV(+(base + (Math.random() - 0.5) * spread * 2).toFixed(dec)),
      ms,
    );
    return () => clearInterval(t);
  }, [base, spread, dec, ms]);
  return v;
};

const N8n = () => {
  const rootRef = useRef(null);
  useMotion(rootRef);
  const { fmt } = useCurrency();
  const [yearly, setYearly] = useState(false);
  const [open, setOpen] = useState([]);
  const [active, setActive] = useState(0);
  const [execs, setExecs] = useState(1420890);
  const [on, setOn] = useState(false);
  const [msg, setMsg] = useState("");
  const [restarting, setRestarting] = useState(false);
  const tm = useRef(null);
  const wh = useTick(11, 2);
  const qq = useTick(18, 3);
  const queued = useTick(1, 1.4);
  const cpu = useTick(28, 4);

  useEffect(() => {
    const t = setTimeout(() => setOn(true), 300);
    return () => clearTimeout(t);
  }, []);
  useEffect(() => {
    if (reduced()) return;
    const a = setInterval(() => setActive((x) => (x + 1) % nodes.length), 1100);
    const b = setInterval(
      () => setExecs((e) => e + Math.floor(3 + Math.random() * 7)),
      700,
    );
    return () => {
      clearInterval(a);
      clearInterval(b);
    };
  }, []);

  const toast = (m) => {
    setMsg(m);
    clearTimeout(tm.current);
    tm.current = setTimeout(() => setMsg(""), 2600);
  };
  const restartQueue = () => {
    if (restarting) return;
    setRestarting(true);
    toast("Draining Redis queue and restarting 16 workers…");
    setTimeout(() => {
      setRestarting(false);
      toast("Queue restarted: 0 jobs lost, 16 workers healthy.");
    }, 2200);
  };
  const toggleFaq = (i) =>
    setOpen((o) => (o.includes(i) ? o.filter((x) => x !== i) : [...o, i]));
  const seg = "px-5 py-2 rounded-lg font-label-md text-label-md transition-all";
  const chip =
    "px-3 py-1 rounded-full bg-surface-container border border-outline-variant/60 text-body-sm font-label-md text-on-surface transition-colors hover:bg-secondary-container/40 hover:border-primary-container/50";
  const tele = [
    [
      "Queued Jobs:",
      queued === 0 ? "0 in queue (Idle)" : `${queued} in queue`,
      "text-primary-fixed",
    ],
    ["Worker Concurrency:", "16 Workers (Redis)", "text-inverse-on-surface"],
    ["Avg. Execution Time:", "84ms median", "text-primary-fixed"],
    [
      "Daily Executions:",
      `${execs.toLocaleString()} (No Cap)`,
      "text-inverse-on-surface",
    ],
    ["Memory Consumption:", "3.2 / 8 GB DDR5", "text-secondary-fixed"],
  ];

  return (
    <Layout>
      <div ref={rootRef} className="flex flex-col w-full">
        {/* 1 HERO */}
        <section className="relative w-full bg-surface overflow-hidden py-12 md:py-20">
          <div className="pointer-events-none absolute inset-0 opacity-40 bg-[radial-gradient(#0baf60_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
          <div className="pointer-events-none absolute -top-40 right-10 w-96 h-96 bg-primary-container/10 rounded-full blur-3xl" />
          <div className="pointer-events-none absolute top-1/2 -left-20 w-80 h-80 bg-secondary-container/20 rounded-full blur-3xl" />
          <div className="relative max-w-7xl mx-auto px-margin-mobile lg:px-margin flex flex-col gap-space-xl">
            <div className="flex flex-col items-center text-center max-w-4xl mx-auto gap-space-md">
              <div className="inline-flex items-center gap-space-xs px-3.5 py-1 rounded-full bg-secondary-container/30 border border-primary-container/20 text-on-secondary-container text-label-sm font-label-sm shadow-sm">
                <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse shrink-0" />
                <span>
                  UNLIMITED EXECUTIONS • 100% PRIVATE DATA SOVEREIGNTY • INSTANT
                  1-CLICK DEPLOY
                </span>
              </div>
              <h1 className="text-display-lg-mobile md:text-display-lg font-display-lg text-on-surface tracking-tight">
                Enterprise Managed n8n Cloud:{" "}
                <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-primary-container via-secondary to-primary-container bg-[length:200%_auto] bg-clip-text text-transparent animate-[shimmer_4s_linear_infinite]">
                  Unlimited Workflow Executions
                </span>{" "}
                with Zero Platform Tax
              </h1>
              <p className="text-body-lg font-body-lg text-on-surface-variant max-w-3xl">
                Deploy dedicated, self-hosted n8n nodes on high-frequency AMD
                EPYC™ hardware with NVMe Gen4 storage. Run millions of AI, CRM,
                and webhook automation workflows without arbitrary execution
                tier limits, surge pricing, or third-party data snooping.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-space-md pt-space-xs">
                <a
                  href="#pricing-tiers"
                  className="group relative overflow-hidden inline-flex items-center justify-center font-label-lg text-label-lg bg-gradient-to-r from-primary-container to-secondary text-on-primary px-7 py-3.5 rounded-xl shadow-md shadow-primary-container/30 transition-all hover:shadow-lg hover:-translate-y-0.5 before:absolute before:inset-y-0 before:-left-full before:w-1/2 before:skew-x-[-20deg] before:bg-white/30 hover:before:left-[150%] before:transition-all before:duration-700"
                >
                  Deploy n8n Instance Now
                  <I n="arrow_forward" c="ml-2 text-[18px]" />
                </a>
                <a
                  href="#architecture-pillars"
                  className="inline-flex items-center justify-center font-label-lg text-label-lg bg-surface-container-lowest border border-outline-variant hover:bg-secondary-container/20 hover:border-primary-container/50 text-on-surface px-6 py-3.5 rounded-xl shadow-sm transition-all"
                >
                  View Architecture & Live Demo
                  <I n="north_east" c="ml-2 text-[18px]" />
                </a>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-gutter w-full pt-space-md max-w-3xl">
                {heroStats.map(([v, l, g]) => (
                  <div
                    key={l}
                    className="flex flex-col items-center p-space-sm rounded-lg bg-surface-container-lowest border border-outline-variant shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
                  >
                    <span
                      className={`text-headline-md font-headline-md font-bold ${g ? "text-primary" : "text-on-surface"}`}
                    >
                      {v}
                    </span>
                    <span className="text-body-sm font-body-sm text-on-surface-variant">
                      {l}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* workflow canvas */}
            <div className="w-full max-w-6xl mx-auto rounded-xl bg-inverse-surface text-inverse-on-surface shadow-2xl shadow-primary/10 overflow-hidden animate-float">
              <div className="flex flex-wrap items-center justify-between px-space-md py-space-sm bg-white/5 gap-space-sm">
                <div className="flex items-center gap-space-sm">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-error" />
                    <span className="w-3 h-3 rounded-full bg-amber-400" />
                    <span className="w-3 h-3 rounded-full bg-primary-container" />
                  </div>
                  <span className="font-mono-code text-body-sm text-surface-dim pl-2">
                    workflow-node-fra01.primocloud
                  </span>
                </div>
                <div className="flex items-center gap-space-xs font-mono-code text-body-sm bg-primary/20 text-inverse-primary px-2.5 py-1 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-inverse-primary animate-pulse" />
                  <span>ACTIVE / DEDICATED QUEUE</span>
                </div>
              </div>
              <div className="p-space-lg flex flex-col gap-space-lg">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-space-sm">
                    <I
                      n="account_tree"
                      c="text-primary-container text-[24px]"
                    />
                    <span className="font-headline-sm text-headline-sm font-bold text-inverse-on-surface">
                      Production Pipeline: Enterprise RAG Customer Support & CRM
                      Sync
                    </span>
                  </div>
                  <span className="font-label-sm text-label-sm px-2.5 py-1 rounded bg-secondary-container/20 text-primary-fixed">
                    Execution Mode: Redis Worker Pool
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-space-md relative items-stretch">
                  {nodes.map(([t, ic, col, h, sub, st], i) => (
                    <div
                      key={t}
                      className={`relative flex flex-col p-space-sm rounded-lg shadow-sm transition-all duration-500 ${active === i ? "bg-primary-container/15 ring-1 ring-primary-container scale-[1.03]" : "bg-white/5"}`}
                    >
                      <div
                        className={`flex items-center justify-between text-body-sm ${col} mb-1`}
                      >
                        <span className="font-label-md">{t}</span>
                        <I
                          n={ic}
                          c={`text-[16px] ${active === i ? "animate-pulse" : ""}`}
                        />
                      </div>
                      <p className="font-headline-sm text-body-md font-semibold text-inverse-on-surface">
                        {h}
                      </p>
                      <p className="font-mono-code text-body-sm text-surface-dim mt-1">
                        {sub}
                      </p>
                      <span className="mt-2 text-label-sm text-primary-fixed flex items-center gap-1">
                        <span
                          className={`w-1.5 h-1.5 rounded-full bg-primary-container ${active === i ? "animate-ping" : ""}`}
                        />
                        {st === "ms"
                          ? `${wh}ms latency`
                          : st === "q"
                            ? `${qq}ms Query`
                            : st}
                      </span>
                      {i < nodes.length - 1 && (
                        <I
                          n="chevron_right"
                          c={`hidden md:block absolute -right-[18px] top-1/2 -translate-y-1/2 z-10 text-[20px] transition-colors duration-500 ${active === i ? "text-primary-fixed" : "text-surface-dim/50"}`}
                        />
                      )}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-space-sm p-space-md rounded-lg bg-white/5 font-mono-code text-body-sm">
                  {tele.map(([k, v, c]) => (
                    <div key={k}>
                      <span className="text-surface-dim block">{k}</span>
                      <span className={`${c} font-semibold`}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2 PILLARS */}
        <Sec bg="bg-surface-container-low" id="architecture-pillars">
          <Head
            pill="Engineered for Scale"
            title="Architectural Pillars of Primo n8n Hosting"
            sub="Built from bare metal up for high-throughput teams tired of cloud execution limits."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
            {pillars.map(([n, t, d]) => (
              <div
                key={t}
                className={`flex flex-col p-space-lg gap-space-md ${cardHover}`}
              >
                <IconBox
                  n={n}
                  size="w-12 h-12 rounded-lg"
                  fs="text-[28px]"
                  mb=""
                />
                <div className="flex flex-col gap-space-xs">
                  <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                    {t}
                  </h3>
                  <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                    {d}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Sec>

        {/* 3 PRICING */}
        <Sec id="pricing-tiers">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto gap-space-md mb-space-xl">
            <Pill>Predictable Pricing</Pill>
            <h2 className="font-headline-xl text-headline-xl font-bold text-on-surface">
              Simple, Fixed Monthly Pricing. Run Millions of Workflows.
            </h2>
            <div className="h-1 w-16 rounded-full bg-gradient-to-r from-primary-container to-secondary" />
            <p className="font-body-md text-body-md text-on-surface-variant">
              No surprises. No overage bills. Pick a dedicated hardware tier
              that matches your concurrency needs.
            </p>
            <div className="inline-flex items-center gap-space-sm p-1 rounded-xl bg-surface-container shadow-inner mt-2">
              <button
                type="button"
                onClick={() => setYearly(false)}
                className={`${seg} ${!yearly ? "font-bold bg-surface-container-lowest text-on-surface shadow-sm" : "text-on-surface-variant hover:text-on-surface"}`}
              >
                Monthly Billing
              </button>
              <button
                type="button"
                onClick={() => setYearly(true)}
                className={`${seg} flex items-center gap-1.5 ${yearly ? "font-bold bg-surface-container-lowest text-on-surface shadow-sm" : "text-on-surface-variant hover:text-on-surface"}`}
              >
                <span>Annual Billing</span>
                <span className="px-2 py-0.5 rounded-full text-label-sm font-label-sm bg-primary-container text-on-primary">
                  Save 20%
                </span>
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter items-stretch">
            {plans.map((p) => (
              <div
                key={p.n}
                className={`relative flex flex-col justify-between p-space-lg rounded-xl ${p.feat ? "bg-gradient-to-b from-secondary-container/20 to-surface-container-lowest ring-2 ring-primary-container shadow-2xl shadow-primary-container/25 lg:scale-[1.03] z-10" : "bg-surface-container-lowest border border-outline-variant shadow-sm hover:shadow-xl hover:border-primary-container/40 transition-all duration-300"}`}
              >
                {p.feat && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-primary-container text-on-primary font-label-sm text-label-sm uppercase tracking-wider font-bold shadow-sm whitespace-nowrap">
                    Most Popular / Recommended
                  </div>
                )}
                <div
                  className={`flex flex-col gap-space-md ${p.feat ? "pt-2" : ""}`}
                >
                  <div>
                    <span className="font-label-sm text-label-sm text-primary uppercase font-bold">
                      {p.eyebrow}
                    </span>
                    <h3 className="font-headline-md text-headline-md font-bold text-on-surface mt-1">
                      {p.n}
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                      {p.d}
                    </p>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span
                      className={`font-headline-xl text-headline-xl font-bold ${p.feat ? "text-primary" : "text-on-surface"}`}
                    >
                      {fmt(p.p[yearly ? 1 : 0])}
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      / month
                    </span>
                  </div>
                  <div className="flex flex-col gap-space-xs pt-space-xs font-body-sm text-body-sm text-on-surface">
                    {p.s.map((x) => (
                      <div key={x} className="flex items-center gap-2">
                        <I
                          n="check_circle"
                          c="text-primary text-[18px] shrink-0"
                        />
                        <span>{rich(x)}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <a
                  href={/^Contact/.test(p.cta ?? "") ? "/contact" : orderUrl(p.slug, yearly)}
                  className={`mt-space-lg w-full text-center py-3 rounded-lg font-label-md text-label-md transition-all ${p.feat ? "bg-gradient-to-r from-primary-container to-secondary text-on-primary shadow-md shadow-primary-container/30 font-bold hover:-translate-y-0.5" : "bg-surface-container text-on-surface hover:bg-primary-container hover:text-on-primary"}`}
                >
                  {p.cta}
                </a>
              </div>
            ))}
          </div>
          <div className="mt-space-xl flex flex-wrap items-center justify-center gap-space-lg p-space-md rounded-xl bg-surface-container-low border border-outline-variant text-on-surface-variant font-body-md text-body-md">
            {planTrust.map(([n, t]) => (
              <div key={t} className="flex items-center gap-2">
                <I n={n} c="text-primary text-[20px]" />
                <span>{t}</span>
              </div>
            ))}
          </div>
        </Sec>

        {/* 4 STACK */}
        <Sec bg="bg-surface-container-low">
          <Head
            pill="Deep Systems Engineering"
            title="The Complete Enterprise Automation Stack"
            sub="We eliminate the operational nightmare of scaling self-hosted n8n infrastructure manually."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
            {stack.map(([n, code, t, d]) => (
              <div
                key={t}
                className={`p-space-lg flex flex-col gap-space-sm ${cardHover}`}
              >
                <div className="flex items-center justify-between">
                  <I
                    n={n}
                    c="text-primary text-[32px] transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6"
                  />
                  <span className="font-mono-code text-label-sm text-on-surface-variant/70 uppercase">
                    {code}
                  </span>
                </div>
                <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                  {t}
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  {d}
                </p>
              </div>
            ))}
          </div>
        </Sec>

        {/* 5 USE CASES */}
        <Sec>
          <Head
            pill="Mission-Critical Scenarios"
            title="Built for High-Impact Production Workloads"
            sub="Here is how high-growth organizations leverage PRIMO n8n to automate complex architectures."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
            {useCases.map(([n, t, d, tags]) => (
              <div
                key={t}
                className={`flex flex-col p-space-lg gap-space-sm ${cardHover}`}
              >
                <div className="flex items-center gap-space-xs text-primary font-headline-sm font-bold">
                  <I
                    n={n}
                    c="transition-transform duration-300 group-hover:scale-125"
                  />
                  <span>{t}</span>
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  {d}
                </p>
                <div className="flex flex-wrap gap-1.5 mt-auto pt-space-xs">
                  {tags.map((x) => (
                    <span
                      key={x}
                      className="px-2 py-0.5 rounded bg-surface-container text-label-sm font-mono-code text-on-surface"
                    >
                      {x}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Sec>

        {/* 6 INTEGRATIONS */}
        <Sec bg="bg-surface-container-low">
          <Head
            pill="Universal Interoperability"
            title="Connect to 400+ Native Integrations & Custom APIs"
            sub="Full support for the entire open-source and proprietary software landscape."
          />
          <div className="flex flex-col gap-space-md">
            {integrations.map(([n, t, list]) => (
              <div
                key={t}
                className="p-space-md rounded-xl bg-surface-container-lowest border border-outline-variant shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm transition-all hover:shadow-md hover:border-primary-container/40"
              >
                <div className="flex items-center gap-space-sm shrink-0 sm:w-48">
                  <I n={n} c="text-primary text-[22px]" />
                  <span className="font-label-lg text-label-lg font-bold text-on-surface">
                    {t}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {list.map((x) => (
                    <span key={x} className={chip}>
                      {x}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Sec>

        {/* 7 COMPARISON */}
        <Sec>
          <Head
            pill="Unfiltered Comparison"
            title="How PRIMO Managed n8n Compares"
            sub="See why high-volume automation teams migrate away from SaaS limits and painful DIY setups."
          />
          <div className="w-full overflow-x-auto rounded-xl shadow-xl bg-surface-container-lowest border border-outline-variant">
            <table className="w-full min-w-[960px] text-left font-body-sm text-body-sm">
              <thead>
                <tr className="bg-surface-container text-on-surface font-label-md text-label-md">
                  <th className="p-space-md">Architectural Feature</th>
                  <th className="p-space-md bg-gradient-to-r from-primary-container to-secondary text-on-primary font-bold">
                    PRIMO CLOUD Managed n8n
                  </th>
                  <th className="p-space-md">
                    n8n Official Cloud (Starter/Pro)
                  </th>
                  <th className="p-space-md">Zapier (Professional/Team)</th>
                  <th className="p-space-md">Self-Hosted on Generic VPS</th>
                </tr>
              </thead>
              <tbody>
                {compare.map(([a, b, c, d, e], i) => (
                  <tr
                    key={a}
                    className={`${i % 2 ? "bg-surface-container-lowest" : ""} hover:bg-secondary-container/10 transition-colors`}
                  >
                    <td className="p-space-md font-semibold text-on-surface">
                      {a}
                    </td>
                    <td className="p-space-md bg-secondary-container/10 font-bold text-primary">
                      <span className="flex items-center gap-2">
                        <I
                          n="check_circle"
                          c="text-[16px] text-primary-container shrink-0"
                        />
                        {b}
                      </span>
                    </td>
                    <td className="p-space-md text-on-surface-variant">{c}</td>
                    <td className="p-space-md text-on-surface-variant">{d}</td>
                    <td className="p-space-md text-on-surface-variant">{e}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Sec>

        {/* 8 CONTROL PANEL */}
        <Sec bg="bg-surface-container-low">
          <Head
            pill="Mission Control"
            title="Unified Automation Cloud Control Panel"
            sub="Total visibility into node health, worker concurrency, and container telemetry."
          />
          <div className="w-full rounded-xl bg-surface-container-lowest border border-outline-variant shadow-2xl overflow-hidden flex flex-col">
            <div className="p-space-md bg-surface-container flex flex-wrap items-center justify-between gap-space-md">
              <div className="flex flex-wrap items-center gap-space-sm">
                <span
                  className={`w-3.5 h-3.5 rounded-full ${restarting ? "bg-tertiary-fixed-dim animate-ping" : "bg-primary-container animate-pulse"}`}
                />
                <span className="font-mono-code text-body-md font-bold text-on-surface">
                  instance: n8n-fra01.primocloud.net
                </span>
                <span className="px-2 py-0.5 rounded bg-surface-container-highest font-mono-code text-label-sm text-on-surface-variant">
                  Frankfurt, EU-Central
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => toast("Opening n8n editor in a new tab…")}
                  className="px-3.5 py-1.5 rounded-lg bg-primary-container text-on-primary font-label-md text-label-md flex items-center gap-1 shadow-sm hover:bg-secondary transition-colors"
                >
                  <span>Open n8n Web UI</span>
                  <I n="north_east" c="text-[16px]" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    toast("Live snapshot created: snap-2025-0612-1 (4.1 GB).")
                  }
                  className="px-3.5 py-1.5 rounded-lg bg-surface-container-highest text-on-surface font-label-md text-label-md hover:bg-surface-container-high transition-colors"
                >
                  1-Click Snapshot
                </button>
                <button
                  type="button"
                  onClick={restartQueue}
                  disabled={restarting}
                  className="px-3.5 py-1.5 rounded-lg bg-surface-container-highest text-on-surface font-label-md text-label-md hover:bg-surface-container-high transition-colors disabled:opacity-50"
                >
                  {restarting ? "Restarting…" : "Restart Queue"}
                </button>
              </div>
            </div>
            <div
              className={`px-space-md bg-primary/10 text-primary font-label-md text-label-md transition-all duration-300 overflow-hidden ${msg ? "py-2 max-h-12 opacity-100" : "max-h-0 opacity-0"}`}
            >
              {msg}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter p-space-lg">
              {[
                [
                  "vCPU Load (AMD EPYC)",
                  `${cpu}%`,
                  cpu,
                  "4 Cores @ 3.7 GHz Allocated",
                  "text-primary",
                ],
                [
                  "DDR5 RAM Utilization",
                  "42% (3.36 GB)",
                  42,
                  "8.00 GB DDR5 Dedicated Pool",
                  "text-primary",
                ],
                [
                  "NVMe Gen4 Storage",
                  "19% (22.8 GB)",
                  19,
                  "120 GB NVMe (Postgres + Logs)",
                  "text-on-surface",
                ],
                [
                  "Transit Throughput",
                  "1.2 Gbps Burstable",
                  12,
                  "Unmetered 10 Gbps Uplink",
                  "text-primary",
                ],
              ].map(([l, v, w, s, c]) => (
                <div
                  key={l}
                  className="flex flex-col gap-space-xs p-space-md rounded-lg bg-surface-container-low border border-outline-variant shadow-sm"
                >
                  <div className="flex items-center justify-between text-body-sm font-label-md text-on-surface-variant">
                    <span>{l}</span>
                    <span className={`font-mono-code font-bold ${c}`}>{v}</span>
                  </div>
                  <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-primary-container to-secondary h-full rounded-full transition-[width] duration-1000 ease-out"
                      style={{ width: on ? `${w}%` : "0%" }}
                    />
                  </div>
                  <span className="font-mono-code text-label-sm text-on-surface-variant/80">
                    {s}
                  </span>
                </div>
              ))}
            </div>
            <div className="p-space-lg flex flex-col gap-space-md">
              <div className="flex items-center justify-between">
                <h4 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                  Containerized Service Daemon Status
                </h4>
                <span className="font-mono-code text-label-sm text-primary">
                  All Daemons Normal
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-md">
                {services.map(([a, b, c]) => (
                  <div
                    key={a}
                    className="p-space-sm rounded-lg bg-surface-container border border-outline-variant flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-space-xs">
                      <span className="w-2.5 h-2.5 rounded-full bg-primary-container animate-pulse" />
                      <div>
                        <div className="font-mono-code text-body-sm font-bold text-on-surface">
                          {a}
                        </div>
                        <div className="font-mono-code text-label-sm text-on-surface-variant">
                          {b}
                        </div>
                      </div>
                    </div>
                    <span className="font-mono-code text-label-sm text-primary whitespace-nowrap">
                      {c}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Sec>

        {/* 9 TESTIMONIALS */}
        <Sec>
          <Head
            pill="Battle-Tested Success"
            title="Trusted by Engineers, CTOs, and RevOps Leaders"
            sub="Read how fast-growing engineering teams cut automation expenses while boosting reliability."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            {reviews.map(([i, n, r, t]) => (
              <div
                key={n}
                className="p-space-lg rounded-xl bg-surface-container-lowest border border-outline-variant shadow-sm relative flex flex-col justify-between gap-space-md hover:shadow-xl hover:-translate-y-1 hover:border-primary-container/40 transition-all duration-300"
              >
                <div className="flex flex-col gap-space-sm">
                  <div className="flex items-center gap-1 text-primary">
                    {[...Array(5)].map((_, k) => (
                      <I key={k} n="star" c="text-[20px]" />
                    ))}
                  </div>
                  <I
                    n="format_quote"
                    c="absolute top-4 right-5 text-[56px] text-primary-container/15"
                  />
                  <p className="relative font-body-md text-body-md text-on-surface-variant italic leading-relaxed">
                    {t}
                  </p>
                </div>
                <div className="flex items-center gap-space-sm pt-space-xs">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-container to-secondary flex items-center justify-center font-bold text-on-primary">
                    {i}
                  </div>
                  <div>
                    <p className="flex items-center gap-1 font-headline-sm text-body-md font-bold text-on-surface">
                      {n}
                      <I n="verified" c="text-[16px] text-primary-container" />
                    </p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      {r}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Sec>

        {/* 10 FAQ */}
        <Sec bg="bg-surface-container-low">
          <Head
            pill="Engineering Specs & Clarity"
            title="Frequently Asked Questions"
            sub="Everything you need to know about PRIMO Managed n8n infrastructure."
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-md items-start">
            {[faqs.slice(0, 5), faqs.slice(5)].map((col, c) => (
              <div key={c} className="flex flex-col gap-space-sm">
                {col.map(([q, a], j) => {
                  const i = c * 5 + j;
                  const isOpen = open.includes(i);
                  return (
                    <div
                      key={q}
                      className={`p-space-md rounded-xl bg-surface-container-lowest border shadow-sm transition-all duration-300 ${isOpen ? "border-primary-container shadow-md shadow-primary-container/10" : "border-outline-variant"}`}
                    >
                      <button
                        type="button"
                        onClick={() => toggleFaq(i)}
                        className="w-full flex items-center justify-between gap-3 text-left font-headline-sm text-body-md font-bold text-on-surface"
                      >
                        <span>{q}</span>
                        <I
                          n="expand_more"
                          c={`text-primary shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                        />
                      </button>
                      <div
                        className={`grid transition-all duration-300 ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
                      >
                        <div className="overflow-hidden">
                          <p className="mt-space-sm font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                            {a}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </Sec>

        {/* 11 CTA */}
        <section className="w-full bg-surface py-16">
          <div className="max-w-7xl mx-auto px-margin-mobile lg:px-margin">
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary to-secondary p-space-xl md:p-16 text-on-primary shadow-2xl shadow-primary/20">
              <div className="pointer-events-none absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1.5px,transparent_1.5px)] [background-size:20px_20px]" />
              <div className="pointer-events-none absolute -bottom-24 -right-24 w-96 h-96 bg-primary-container/30 rounded-full blur-3xl" />
              <span className="pointer-events-none absolute -left-10 top-6 h-40 w-40 rounded-full bg-white/10 animate-float" />
              <div className="relative flex flex-col items-center text-center max-w-3xl mx-auto gap-space-md">
                <span className="px-3.5 py-1 rounded-full bg-on-primary/10 text-on-primary font-mono-code text-label-sm uppercase tracking-wider backdrop-blur-sm">
                  Instant 60-Second Setup Available Now
                </span>
                <h2 className="font-headline-xl text-headline-xl md:text-display-lg font-bold text-on-primary tracking-tight">
                  Ready to Supercharge Your Automation Without Platform Tax?
                </h2>
                <p className="font-body-lg text-body-lg text-on-primary/90 max-w-2xl">
                  Deploy your dedicated n8n instance in under 60 seconds with
                  unlimited workflow executions, backed by our unconditional
                  30-day money-back guarantee.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-space-md pt-space-xs">
                  <a
                    href="#pricing-tiers"
                    className="inline-flex items-center justify-center font-label-lg text-label-lg bg-surface-container-lowest text-primary hover:bg-surface-container px-8 py-4 rounded-xl shadow-lg transition-all font-bold hover:-translate-y-0.5"
                  >
                    Deploy Managed n8n Now
                    <I n="arrow_forward" c="ml-2 text-[18px]" />
                  </a>
                  <a
                    href="/contact"
                    className="inline-flex items-center justify-center font-label-lg text-label-lg bg-on-primary/10 hover:bg-on-primary/20 border border-white/30 text-on-primary px-7 py-4 rounded-xl transition-all backdrop-blur-sm"
                  >
                    Talk to an Automation Specialist
                    <I n="chat" c="ml-2 text-[18px]" />
                  </a>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-space-lg pt-space-sm font-label-sm text-label-sm text-on-primary/80">
                  {[
                    ["verified", "99.99% Execution SLA"],
                    ["bolt", "Instant 60-Second Setup"],
                    ["handshake", "Free Migration Assistance"],
                  ].map(([n, t]) => (
                    <span key={t} className="flex items-center gap-1.5">
                      <I n={n} c="text-[18px]" />
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default N8n;
