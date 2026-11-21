import { orderUrl } from "../../lib/panel";
import React, { useState, useEffect, useRef } from "react";
import Layout from "../../components/layout";
import { useMotion } from "../../components/motion";
import { useCurrency } from "../../context/CurrencyContext";
import { I, Pill, Sec, Head, cardHover, IconBox } from "../../components/ui";

// ---------- content (taken from the HTML design) ----------
const heroStats = [
  ["99.999%", "SLA Uptime"],
  ["0% Steal", "100% Pinned"],
  ["<0.5ms", "Global Core"],
  ["15-Min", "VIP Human SLA"],
];
const consoleRows = [
  [
    "memory",
    "CPU Pinned:",
    "AMD EPYC 9654 (3.75GHz Boost, 0% Steal, 12 Cores)",
    "text-primary-fixed font-bold",
  ],
  [
    "developer_board",
    "RAM Alloc:",
    "64 GB DDR5 4800MHz ECC Registered (Dual-Ch)",
    "text-inverse-on-surface font-medium",
  ],
  [
    "hard_drive",
    "NVMe RAID-10:",
    "13,800 MB/s Read • 9,200 MB/s Write • 950K IOPS",
    "text-inverse-primary font-bold",
  ],
  [
    "speed",
    "VIP Uplink:",
    "10 Gbps Unthrottled Private Pipe (0 Drops)",
    "text-secondary-fixed font-bold",
  ],
];
const pillars = [
  [
    "hardware",
    "100% Guaranteed Pinned Cores",
    "No fractional shared vCPUs. Every vCPU is locked directly to an execution thread on AMD EPYC 9654 Genoa with zero CPU steal and constant 3.75GHz sustained turbo boost.",
    "Zero Neighbor Steal Guarantee",
  ],
  [
    "speed",
    "Blazing PCIe Gen5 NVMe Storage",
    "Experience staggering I/O: sequential speeds exceeding 13,800 MB/s and 950K random IOPS over hardware-backed RAID-10 with power-loss protected write caches.",
    "13,800 MB/s Sequential Read",
  ],
  [
    "hub",
    "Dedicated 10 Gbps VIP Uplink",
    "Direct Tier-1 carrier cross-connects (Telia, NTT, Lumen) providing jitter-free sub-millisecond routing, clean DDoS packet filtering, and massive throughput burst capability.",
    "LACP Dual 25GbE Hardware Backing",
  ],
  [
    "support_agent",
    "VIP Concierge & 15-Min SLA",
    "Direct access to dedicated Level-3 Systems Architects via shared Slack/Telegram channels. Enjoy white-glove migrations, custom kernel tuning, and proactive telemetry tracking.",
    "Dedicated Slack Channel Access",
  ],
];
// "**x**" = bold, ">" prefix = green highlight line
const plans = [
  {
    n: "Gold-1", slug: "gold-1",
    tag: "Entry Elite",
    d: "Perfect for API gateways, microservices, and dedicated trading bots.",
    p: [39.99, 31.99],
    cta: "Deploy Gold-1",
    s: [
      "**4 Dedicated AMD EPYC Cores**",
      "16 GB DDR5 ECC Registered",
      "200 GB PCIe Gen5 NVMe RAID-10",
      "10 TB Bandwidth @ 2.5 Gbps",
      "2 Dedicated Clean IPv4 + /64 IPv6",
      "Automated Daily Snapshots",
    ],
  },
  {
    n: "Gold-2", slug: "gold-2",
    tag: "Flagship Balance",
    feat: true,
    d: "The sweet spot for mission-critical SaaS, PostgreSQL clusters & low-latency execution.",
    p: [79.99, 63.99],
    cta: "Deploy Gold-2",
    s: [
      "**8 Dedicated AMD EPYC Cores**",
      "**32 GB DDR5 ECC Registered**",
      "450 GB PCIe Gen5 NVMe RAID-10",
      "20 TB Bandwidth @ 5 Gbps Port",
      "3 Dedicated Clean IPv4 + /64 IPv6",
      "Daily Snapshots + 1-Click Rollback",
      ">**VIP Queue & Direct Slack Support**",
    ],
  },
  {
    n: "Gold-3", slug: "gold-3",
    tag: "High Compute & DBs",
    d: "Massive memory footprint for Redis datasets, ClickHouse, and high-load CI/CD builders.",
    p: [149.99, 119.99],
    cta: "Deploy Gold-3",
    s: [
      "**16 Dedicated AMD EPYC Cores**",
      "64 GB DDR5 ECC Registered",
      "900 GB PCIe Gen5 NVMe RAID-10",
      "40 TB Bandwidth @ 10 Gbps Port",
      "4 Dedicated Clean IPv4 + /64 IPv6",
      "Custom rDNS & BGP Announced IPs",
    ],
  },
  {
    n: "Gold-Extreme", slug: "gold-extreme",
    tag: "Flagship Workstation",
    d: "Complete socket partition. Replaces dedicated metal with dynamic cloud snapshotting.",
    p: [279.99, 223.99],
    cta: "Deploy Gold-Extreme",
    s: [
      "**32 Dedicated AMD Cores (Full Socket)**",
      "**128 GB DDR5 ECC Registered**",
      "1.8 TB PCIe Gen5 NVMe RAID-10",
      "**Unmetered Bandwidth @ 10 Gbps**",
      "6 Dedicated Clean IPv4 + Subnet",
      ">**Dedicated Lead Architect Assigned**",
    ],
  },
];
const planTrust = [
  ["verified", "30-Day Unconditional Money-Back Guarantee"],
  ["swap_horizontal_circle", "Free White-Glove Concierge Migration"],
  ["bolt", "Instant 60-Second Cloud-Init Delivery"],
];
const hardware = [
  [
    "memory",
    "Server Processor",
    'AMD EPYC™ 9654 "Genoa"',
    "96 Cores, 192 Threads per socket, full AVX-512 vector support, 384MB L3 cache, guaranteed locked core frequency.",
  ],
  [
    "developer_board",
    "DDR5 ECC Memory",
    "Micron & Samsung Registered",
    "DDR5 4800MHz ECC registered channels with active hardware parity error scrubbing to protect against single-bit flips.",
  ],
  [
    "storage",
    "Enterprise NVMe Array",
    "Solidigm / Kioxia PCIe 5.0 U.2",
    "Hardware Tri-Mode Broadcom RAID-10 arrays delivering up to 13,800 MB/s sustained throughput and write-endurance safeguards.",
  ],
  [
    "lan",
    "Fabric Interconnect",
    "Dual 25GbE Mellanox ConnectX-6",
    "Hardware LACP bonding with SR-IOV direct virtualization bypass and hardware packet acceleration for minimal latency.",
  ],
];
const useCases = [
  [
    "query_stats",
    "High-Frequency Trading & Prop Desks",
    "Execute order books in microseconds. Sustained turbo clocks guarantee zero CPU contention during extreme volatility spikes across Binance, Interactive Brokers, and FX cross-connects.",
    "Deterministic Tick Processing",
    "trending_up",
  ],
  [
    "database",
    "Heavy PostgreSQL & In-Memory Redis",
    "Unleash PCIe Gen5 NVMe RAID arrays with 950K IOPS. Keep million-row cache indices pinned in dedicated DDR5 memory without swapping delays or latency spikes.",
    "<0.1ms Cache Hit Latencies",
    "bolt",
  ],
  [
    "cloud_queue",
    "High-Traffic SaaS Microservice Cores",
    "Prevent downstream cascading timeouts. Provide consistent p99 HTTP latency for mission-critical core microservices serving millions of connected API consumers.",
    "Rock-Solid p99 Response Limits",
    "sync_saved_locally",
  ],
  [
    "integration_instructions",
    "CI/CD Build Runners & Kubernetes Nodes",
    "Slash Docker compilation, Rust builds, and Jest test runs by up to 70%. Hardware pinned cores eliminate CI build queue throttling and context switching overhead.",
    "Rapid Parallel Compilation",
    "precision_manufacturing",
  ],
  [
    "insights",
    "Big Data & Real-Time Telemetry",
    "Process petabyte-scale Elasticsearch, ClickHouse, and Kafka message ingestion with massive memory bandwidth and unthrottled 10 Gbps ingress pipe.",
    "Line-Rate Kafka Ingestion",
    "dataset",
  ],
  [
    "live_tv",
    "Media Transcoding & WebRTC Streams",
    "Deliver flawless interactive video feeds and real-time audio rooms. Zero CPU contention ensures smooth AV1/HEVC software encoding and packet pacing.",
    "Zero-Jitter WebRTC Fabric",
    "podcasts",
  ],
];
const osList = [
  ["terminal", "Ubuntu 24.04", "LTS Kernel"],
  ["dns", "Debian 12", "Bookworm"],
  ["shield", "Rocky Linux 9", "RHEL Binary"],
  ["security", "AlmaLinux 9", "Enterprise"],
  ["window", "Windows Server", "2025 / 2022"],
  ["code", "Arch Linux", "Rolling Edge"],
  ["filter_drama", "Alpine Linux", "Minimal Footprint"],
  ["album", "Custom ISO", "VNC / IPMI"],
];
const compare = [
  [
    "CPU Architecture",
    "AMD EPYC™ 9654 Genoa @ 3.75GHz",
    "Older AMD/Intel (Overprovisioned)",
    "Custom ARM / Intel Xeon Platinum",
  ],
  [
    "Resource Contention",
    "0% CPU Steal (Guaranteed Pinned)",
    "15% - 40% CPU Steal under peak",
    "Variable bursting tiers (Credit limits)",
    1,
  ],
  [
    "Disk Sequential Read",
    "13,800 MB/s (PCIe Gen5 NVMe)",
    "600 - 1,200 MB/s (Network Block)",
    "EBS Capped (Extra IOPS fees)",
  ],
  [
    "Random 4K IOPS",
    "Up to 950,000 IOPS Included",
    "10,000 - 35,000 IOPS",
    "Tiered pricing up to $0.065 / IOPS",
  ],
  [
    "Network Port Speed",
    "Up to 10 Gbps Unthrottled",
    "1 Gbps Shared",
    "12.5 Gbps (Burstable ENA)",
  ],
  [
    "VIP Support SLA",
    "15-Minute Dedicated Slack Channel",
    "12 - 24hr Standard Ticket",
    "Enterprise Support ($15,000/mo min)",
  ],
  [
    "Monthly Cost (8 vCPU / 32GB)",
    "$79.99 / mo flat rate",
    "$144.00 / mo",
    "$280.00+ / mo (Compute + EBS + Egress)",
  ],
];
const subLinks = ["Reverse DNS Config", "Firewall Rules (0/100)", "API Tokens"];
const reviews = [
  [
    "MR",
    "Marcus R.",
    "Lead Quant Architect, Apex Capital FX",
    '"We migrated our automated FIX order execution gateways from AWS EC2 c6i instances to PRIMO Gold-3. Our tick-to-trade latency jitter dropped from 4.2ms variance down to a deterministic 0.35ms. The CPU core pinning is genuine bare-metal grade."',
  ],
  [
    "SL",
    "Siddharth L.",
    "CTO, PayFlow NeoBank Global",
    '"The 15-minute VIP Slack SLA is not marketing fluff. When we performed a midnight database schema migration, PRIMO\'s senior Linux sysadmin was live in our channel tuning PCIe queue depths. The Gen5 NVMe read speeds blow anything else away."',
  ],
  [
    "EW",
    "Elena W.",
    "VP of Platform Engineering, DataStream SaaS",
    '"We run high-concurrency Node.js and Rust microservices serving 45,000 requests/sec. We had persistent CPU steal issues on our previous host during traffic bursts. With Gold-Extreme, our CPU steal graph has been a continuous flatline of 0.00%."',
  ],
];
const faqs = [
  [
    "How does Gold VPS differ from standard Linux or Windows VPS?",
    "Standard VPS plans utilize shared virtualization pools where vCPUs and NVMe bandwidth are dynamically divided among multiple tenants. Gold VPS features 100% dedicated hardware core pinning (via KVM vcpu-pinning) directly into AMD EPYC 9654 Genoa sockets, enterprise PCIe Gen5 storage with hardware RAID-10 arrays, and a VIP concierge SLA with direct Slack/Telegram channels.",
  ],
  [
    "Are CPU cores truly 100% dedicated with zero virtualization steal?",
    "Yes, absolutely. We enforce a strict 1:1 physical thread-to-vCPU binding inside the host hypervisor. Your instance is completely isolated from other server workloads. You can monitor your steal percentage anytime via standard tools like top, htop, or vmstat — it will continuously read 0.0% steal.",
  ],
  [
    "Can I choose either Linux or Windows Server OS?",
    "Yes. You can install all primary enterprise distributions including Ubuntu 24.04/22.04 LTS, Debian 12, Rocky Linux 9, AlmaLinux 9, and Windows Server 2025/2022 Datacenter editions. You can also upload custom ISOs directly through our web management panel.",
  ],
  [
    "What is the VIP Concierge Support SLA?",
    "Every Gold VPS customer receives direct priority access to our Tier-3 Senior Linux/Windows Infrastructure Architects with a guaranteed 15-minute response SLA. For Gold-2, Gold-3, and Gold-Extreme tiers, we establish a private Slack or Telegram channel directly with our operations room.",
  ],
  [
    "Do you provide free white-glove server migration?",
    "Yes, 100% free of charge. Upon deploying your Gold VPS instance, our technical migration team will audit your existing infrastructure (cPanel, Plesk, Docker stacks, raw MySQL/PostgreSQL databases, or bare Linux systems) and execute the transfer during your designated maintenance window with zero data loss.",
  ],
  [
    "Can I attach additional NVMe storage or private IPs anytime?",
    "Yes. You can instantly expand hot-pluggable PCIe Gen5 NVMe storage volumes without restarting your instance. Clean, verified IPv4 addresses and dedicated IPv6 subnets can be provisioned in real time directly from the control dashboard.",
  ],
  [
    "What DDoS mitigation is included with Gold VPS?",
    "All Gold VPS instances are protected by our multi-terabit inline hardware scrubbing fabric powered by Corero and Arbor Networks. We automatically filter Layer 3/4 SYN floods, UDP amplification, and Layer 7 HTTP application attacks in under 1 second without routing your clean traffic through high-latency third-party proxies.",
  ],
  [
    "Where are Gold VPS datacenters located?",
    "Gold VPS hardware nodes are deployed in Tier-3+ and Tier-4 carrier-neutral enterprise facilities including Equinix FR5 (Frankfurt), Telehouse North Two (London), Equinix NY4 (Secaucus / New York), CoreSite Silicon Valley, and Equinix SG1 (Singapore).",
  ],
  [
    "Do you support nested virtualization (Hyper-V, KVM, Docker)?",
    "Yes. Nested virtualization (AMD SVM) is enabled by default across all Gold VPS instances. You can effortlessly run Docker containers, Kubernetes clusters, or launch nested KVM / Proxmox / Hyper-V test environments without CPU instruction limitations.",
  ],
  [
    "What is your uptime guarantee and refund policy?",
    "We provide a legally binding 99.999% network and hardware SLA backed by 10x hourly billing credit multipliers. Furthermore, all first-time Gold VPS orders include an unconditional 30-day money-back guarantee. If you are not thoroughly satisfied with the performance benchmarks, we issue a prompt, no-questions-asked refund.",
  ],
];

const rich = (s) =>
  s.split("**").map((t, i) => (i % 2 ? <strong key={i}>{t}</strong> : t));
const reduced = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const useTick = (base, spread, dec = 0, ms = 2200) => {
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

// live sparkline: values are 0..1, new sample pushed every 1.4s
const Spark = ({ seed, cls }) => {
  const [pts, setPts] = useState(seed);
  useEffect(() => {
    if (reduced()) return;
    const t = setInterval(
      () =>
        setPts((p) => [
          ...p.slice(1),
          Math.min(
            0.95,
            Math.max(0.1, p[p.length - 1] + (Math.random() - 0.5) * 0.35),
          ),
        ]),
      1400,
    );
    return () => clearInterval(t);
  }, []);
  const d = pts
    .map(
      (v, i) =>
        `${i ? "L" : "M"}${((i / (pts.length - 1)) * 100).toFixed(1)},${(25 - v * 22).toFixed(1)}`,
    )
    .join(" ");
  return (
    <svg
      className={`w-full h-12 ${cls}`}
      preserveAspectRatio="none"
      viewBox="0 0 100 25"
    >
      <path
        d={d}
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        style={{ transition: "d .8s ease" }}
      />
    </svg>
  );
};

const GoldVps = () => {
  const rootRef = useRef(null);
  useMotion(rootRef);
  const { fmt } = useCurrency();
  const [yearly, setYearly] = useState(false);
  const [open, setOpen] = useState([]);
  const [status, setStatus] = useState("");
  const [rebooting, setRebooting] = useState(false);
  const tm = useRef(null);
  const temp = useTick(39, 1.5);
  const iops = useTick(842, 18);
  const lat = useTick(0.32, 0.03, 2);
  const cpu = useTick(24.2, 3, 1);
  const toggleFaq = (i) =>
    setOpen((o) => (o.includes(i) ? o.filter((x) => x !== i) : [...o, i]));
  const toast = (m) => {
    setStatus(m);
    clearTimeout(tm.current);
    tm.current = setTimeout(() => setStatus(""), 2600);
  };
  const reboot = () => {
    if (rebooting) return;
    setRebooting(true);
    toast("Reboot signal sent — instance restarting…");
    setTimeout(() => {
      setRebooting(false);
      toast("Instance is back online in 4.2s.");
    }, 2200);
  };
  const seg = "px-5 py-2 font-label-md text-label-md rounded-lg transition-all";
  const act =
    "px-3 py-1.5 bg-surface-container hover:bg-surface-container-high text-on-surface rounded-lg font-label-sm text-label-sm font-semibold flex items-center gap-1 shadow-sm transition-all hover:-translate-y-0.5";

  return (
    <Layout>
      <div ref={rootRef} className="flex flex-col w-full">
        {/* 1 HERO */}
        <section className="relative w-full bg-surface py-space-lg lg:py-12 overflow-hidden">
          <div className="pointer-events-none absolute -top-32 right-10 w-96 h-96 bg-primary-container/10 rounded-full blur-3xl" />
          <div className="pointer-events-none absolute top-1/2 left-0 w-80 h-80 bg-secondary-container/20 rounded-full blur-3xl" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,rgba(11,175,96,0.18)_1px,transparent_1px)] bg-[size:28px_28px] [mask-image:radial-gradient(ellipse_at_top_left,black_20%,transparent_70%)]" />
          <div className="max-w-7xl mx-auto px-margin-mobile lg:px-margin relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-gutter-lg items-center">
            <div className="lg:col-span-6 flex flex-col gap-space-md">
              <div className="inline-flex items-center gap-space-xs px-3 py-1 bg-surface-container-low border border-primary-container/20 rounded-full w-fit shadow-sm">
                <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse shrink-0" />
                <span className="font-label-sm text-label-sm text-primary uppercase tracking-wider font-semibold">
                  ★ Flagship VIP Tier • Guaranteed Dedicated CPU Cores • 1-Click
                  Provisioning
                </span>
              </div>
              <h1 className="font-headline-xl text-headline-xl text-on-surface font-extrabold tracking-tight">
                Elite Performance, Zero Contention:{" "}
                <span className="bg-gradient-to-r from-primary-container via-secondary to-primary-container bg-[length:200%_auto] bg-clip-text text-transparent animate-[shimmer_4s_linear_infinite]">
                  High-Frequency Gold VPS
                </span>
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
                Experience bare-metal power with cloud agility. Pinned AMD EPYC™
                Genoa cores, blazingly fast PCIe Gen5 NVMe in RAID-10, dedicated
                DDR5 ECC RAM, and concierge VIP support with an institutional
                99.999% SLA.
              </p>
              <div className="flex flex-wrap items-center gap-space-md pt-space-xs">
                <a
                  href="#plans"
                  className="group relative overflow-hidden inline-flex items-center justify-center gap-space-xs font-label-lg text-label-lg bg-gradient-to-r from-primary-container to-secondary text-on-primary px-6 py-3.5 rounded-xl shadow-md shadow-primary-container/30 transition-all hover:shadow-lg hover:-translate-y-0.5 before:absolute before:inset-y-0 before:-left-full before:w-1/2 before:skew-x-[-20deg] before:bg-white/30 hover:before:left-[150%] before:transition-all before:duration-700"
                >
                  <span>Deploy Gold VPS Now</span>
                  <I n="arrow_forward" c="text-[18px]" />
                </a>
                <a
                  href="#benchmarks"
                  className="inline-flex items-center justify-center gap-space-xs font-label-lg text-label-lg bg-surface-container-lowest border border-outline-variant hover:bg-secondary-container/20 hover:border-primary-container/50 text-on-surface px-6 py-3.5 rounded-xl shadow-sm transition-all"
                >
                  <span>Compare VPS Tiers</span>
                  <I n="tune" c="text-[18px]" />
                </a>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-sm pt-space-md">
                {heroStats.map(([v, l]) => (
                  <div
                    key={l}
                    className="bg-surface-container-lowest border border-outline-variant p-3 rounded-xl shadow-sm flex flex-col transition-all hover:-translate-y-1 hover:shadow-md"
                  >
                    <span className="font-headline-sm text-headline-sm text-primary font-bold">
                      {v}
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      {l}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="bg-inverse-surface text-inverse-on-surface rounded-xl shadow-2xl shadow-primary/15 overflow-hidden p-space-md font-mono-code text-mono-code relative animate-float">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-space-sm mb-space-sm">
                  <div className="flex items-center gap-space-xs min-w-0">
                    <span className="w-3 h-3 rounded-full bg-error shrink-0" />
                    <span className="w-3 h-3 rounded-full bg-amber-400 shrink-0" />
                    <span className="w-3 h-3 rounded-full bg-primary-container shrink-0" />
                    <span className="text-inverse-on-surface/70 text-body-sm ml-2 truncate">
                      node-gold-eu01.primocloud [ACTIVE / PINNED HARDWARE]
                    </span>
                  </div>
                  <span className="bg-primary-container/20 text-inverse-primary px-2 py-0.5 rounded-full text-label-sm font-label-sm uppercase whitespace-nowrap">
                    KVM Pinning Active
                  </span>
                </div>
                <div className="flex flex-col gap-space-sm text-body-sm">
                  {consoleRows.map(([n, l, v, c]) => (
                    <div
                      key={l}
                      className="flex flex-wrap justify-between items-center gap-1 bg-white/5 p-2.5 rounded-lg"
                    >
                      <div className="flex items-center gap-space-xs text-inverse-on-surface">
                        <I n={n} c="text-primary-fixed-dim text-[18px]" />
                        <span>{l}</span>
                      </div>
                      <span className={c}>{v}</span>
                    </div>
                  ))}
                  <div className="grid grid-cols-3 gap-space-sm pt-space-xs">
                    {[
                      ["CPU Core Temp", `${temp}°C`, 38],
                      ["IOPS Load", `${iops}K / 950K`, 88],
                      ["Core Latency", `${lat.toFixed(2)} ms`, 12],
                    ].map(([l, v, w]) => (
                      <div
                        key={l}
                        className="bg-white/5 p-3 rounded-lg text-center shadow-sm"
                      >
                        <div className="font-body-sm text-body-sm text-inverse-on-surface/70">
                          {l}
                        </div>
                        <div className="font-headline-sm text-headline-sm text-primary-fixed font-bold">
                          {v}
                        </div>
                        <div className="w-full bg-white/20 h-1.5 rounded-full mt-2 overflow-hidden">
                          <div
                            className="bg-primary-container h-full rounded-full"
                            style={{ width: `${w}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-space-sm pt-space-xs text-body-sm text-inverse-on-surface/80 flex flex-wrap items-center gap-space-xs">
                  <span className="text-primary-fixed-dim">
                    primo-admin@gold-fra:~$
                  </span>
                  <span>virsh vcpuinfo --domain instance-gold-prod</span>
                  <span className="w-2 h-4 bg-primary-container inline-block animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2 PILLARS */}
        <Sec bg="bg-surface-container-low">
          <Head
            pill="Uncompromising Architecture"
            title="Built to Outperform Standard Cloud VPS"
            sub="Gold VPS eliminates virtualization overhead and multi-tenant resource fighting through dedicated KVM thread pinning and bare-metal bus paths."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
            {pillars.map(([n, t, d, f]) => (
              <div
                key={t}
                className={`p-space-lg flex flex-col justify-between ${cardHover}`}
              >
                <div>
                  <IconBox n={n} />
                  <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold mb-2">
                    {t}
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    {d}
                  </p>
                </div>
                <div className="mt-space-md bg-secondary-container/20 p-2 rounded-lg">
                  <span className="font-label-sm text-label-sm text-primary font-bold uppercase">
                    {f}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Sec>

        {/* 3 PRICING */}
        <Sec id="plans">
          <div className="flex flex-col items-center text-center mb-space-lg">
            <Pill>Predictable Investment</Pill>
            <h2 className="font-headline-xl text-headline-xl text-on-surface font-bold mt-space-sm">
              High-Frequency Gold VPS Deployments
            </h2>
            <div className="mx-auto mt-space-sm h-1 w-16 rounded-full bg-gradient-to-r from-primary-container to-secondary" />
            <p className="font-body-md text-body-md text-on-surface-variant max-w-xl mt-3">
              Transparent flat-rate billing with zero hidden egress charges.
              Provision in under 60 seconds with instant KVM orchestration.
            </p>
            <div className="mt-space-md flex items-center gap-space-sm bg-surface-container p-1 rounded-xl shadow-sm">
              <button
                type="button"
                onClick={() => setYearly(false)}
                className={`${seg} ${!yearly ? "bg-surface-container-lowest text-on-surface font-bold shadow-sm" : "text-on-surface-variant hover:text-on-surface font-semibold"}`}
              >
                Monthly Billing
              </button>
              <button
                type="button"
                onClick={() => setYearly(true)}
                className={`${seg} flex items-center gap-1.5 ${yearly ? "bg-surface-container-lowest text-on-surface font-bold shadow-sm" : "text-on-surface-variant hover:text-on-surface font-semibold"}`}
              >
                <span>Annual Billing</span>
                <span className="px-2 py-0.5 rounded-full bg-primary-container text-on-primary font-label-sm text-label-sm">
                  Save 20%
                </span>
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter items-stretch">
            {plans.map((p) => (
              <div
                key={p.n}
                className={`rounded-xl p-space-lg flex flex-col justify-between relative ${p.feat ? "bg-gradient-to-b from-secondary-container/20 to-surface-container-lowest ring-2 ring-primary-container shadow-2xl shadow-primary-container/25 md:-translate-y-2" : "bg-surface-container-lowest border border-outline-variant shadow-sm hover:shadow-xl hover:border-primary-container/40 transition-all duration-300"}`}
              >
                {p.feat && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-primary-container text-on-primary px-3 py-1 rounded-full font-label-sm text-label-sm font-bold tracking-wide uppercase shadow-sm whitespace-nowrap">
                    Most Popular for Apps & Trading
                  </div>
                )}
                <div>
                  <div
                    className={`flex items-center justify-between gap-2 ${p.feat ? "pt-1" : ""}`}
                  >
                    <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
                      {p.n}
                    </span>
                    <span
                      className={`font-label-sm text-label-sm px-2.5 py-1 rounded-md font-semibold text-right ${p.feat ? "bg-secondary-container/50 text-secondary font-bold" : "bg-surface-container text-on-surface-variant"}`}
                    >
                      {p.tag}
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-2">
                    {p.d}
                  </p>
                  <div className="mt-space-md mb-space-md">
                    <div className="flex items-baseline">
                      <span
                        className={`font-headline-xl text-headline-xl font-extrabold ${p.feat ? "text-primary" : "text-on-surface"}`}
                      >
                        {fmt(p.p[yearly ? 1 : 0])}
                      </span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant ml-1">
                        /month
                      </span>
                    </div>
                    <span className="font-label-sm text-label-sm text-primary font-medium">
                      {yearly ? "Billed annually (20% off)" : "Billed monthly"}
                    </span>
                  </div>
                  <div className="flex flex-col gap-space-sm pt-space-sm">
                    {p.s.map((x) => {
                      const hl = x.startsWith(">");
                      return (
                        <div
                          key={x}
                          className="flex items-center gap-space-xs text-body-sm"
                        >
                          <I
                            n="check_circle"
                            c="text-primary-container text-[18px] shrink-0"
                          />
                          <span
                            className={
                              hl ? "text-primary font-bold" : "text-on-surface"
                            }
                          >
                            {rich(hl ? x.slice(1) : x)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="pt-space-lg">
                  <a
                    href={/^Contact/.test(p.cta ?? "") ? "/contact" : orderUrl(p.slug, yearly)}
                    className={`w-full inline-flex items-center justify-center font-label-md text-label-md py-3 rounded-xl transition-all ${p.feat ? "bg-gradient-to-r from-primary-container to-secondary text-on-primary shadow-md shadow-primary-container/30 hover:-translate-y-0.5" : "bg-surface-container hover:bg-primary-container hover:text-on-primary text-on-surface shadow-sm"}`}
                  >
                    {p.cta}
                  </a>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-space-lg bg-surface-container-low border border-outline-variant p-space-md rounded-xl flex flex-wrap items-center justify-center gap-gutter text-on-surface-variant text-body-sm">
            {planTrust.map(([n, t]) => (
              <div key={t} className="flex items-center gap-space-xs">
                <I n={n} c="text-primary text-[20px]" />
                <span>{t}</span>
              </div>
            ))}
          </div>
        </Sec>

        {/* 4 HARDWARE */}
        <Sec bg="bg-surface-container-low">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-lg items-center">
            <div className="lg:col-span-5 flex flex-col gap-space-sm">
              <Pill c="w-fit">Silicon & Datacenter Standards</Pill>
              <h2 className="font-headline-xl text-headline-xl text-on-surface font-bold">
                Unadulterated Bare-Metal Hardware Stack
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                Unlike hyper-condensed cloud providers running 50+ virtual
                machines per CPU, PRIMO Gold VPS enforces strict socket quotas.
                Every hardware component is institutional grade, selected for
                continuous sustained turbo execution.
              </p>
              <div className="bg-surface-container-lowest border border-outline-variant p-space-md rounded-xl shadow-sm mt-space-sm">
                <div className="flex items-center gap-space-sm mb-2">
                  <I n="terminal" c="text-primary-container text-[24px]" />
                  <span className="font-label-lg text-label-lg text-on-surface font-bold">
                    Hardware Verification Command
                  </span>
                </div>
                <div className="bg-inverse-surface text-inverse-on-surface p-3 rounded-lg font-mono-code text-body-sm overflow-x-auto">
                  <span className="text-primary-fixed-dim whitespace-nowrap">
                    # lscpu | grep "Model name\|CPU max MHz"
                  </span>
                  <br />
                  <span className="text-inverse-on-surface/80 whitespace-nowrap">
                    Model name: AMD EPYC 9654 96-Core Processor
                  </span>
                  <br />
                  <span className="text-primary-fixed whitespace-nowrap">
                    CPU max MHz: 3750.0000 [PINNED 0% STEAL]
                  </span>
                </div>
              </div>
            </div>
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-space-md">
              {hardware.map(([n, t, s, d]) => (
                <div key={t} className={`p-space-md ${cardHover}`}>
                  <I
                    n={n}
                    c="text-primary text-[28px] mb-2 transition-transform duration-300 group-hover:scale-110"
                  />
                  <h4 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                    {t}
                  </h4>
                  <div className="text-primary font-semibold text-body-sm mt-1">
                    {s}
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-2">
                    {d}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Sec>

        {/* 5 USE CASES */}
        <Sec>
          <Head
            pill="Engineered For Workloads"
            title="Where Every Millisecond Dictates Outcomes"
            sub="Gold VPS is the definitive environment when standard virtualization jitter or CPU throttling threatens revenue or user experience."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
            {useCases.map(([n, t, d, f, fi]) => (
              <div
                key={t}
                className={`p-space-lg flex flex-col justify-between ${cardHover}`}
              >
                <div>
                  <I
                    n={n}
                    c="text-primary text-[32px] mb-3 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6"
                  />
                  <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold mb-2">
                    {t}
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    {d}
                  </p>
                </div>
                <div className="mt-space-md pt-space-xs text-primary font-label-sm font-semibold flex items-center gap-1">
                  <span>{f}</span>
                  <I n={fi} c="text-[16px]" />
                </div>
              </div>
            ))}
          </div>
        </Sec>

        {/* 6 OS */}
        <Sec bg="bg-surface-container-low">
          <div className="text-center">
            <Pill>Enterprise OS & Hypervisors</Pill>
            <h2 className="font-headline-xl text-headline-xl text-on-surface font-bold mt-space-sm">
              1-Click Automated OS Images or Custom ISO
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl mx-auto mt-2 mb-space-lg">
              Deploy fully licensed enterprise distributions in seconds, or
              mount your own customized golden ISO via our low-latency
              Out-of-Band IPMI/VNC console.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-space-sm">
              {osList.map(([n, t, s]) => (
                <div
                  key={t}
                  className="group bg-surface-container-lowest border border-outline-variant p-4 rounded-xl shadow-sm flex flex-col items-center gap-2 transition-all hover:-translate-y-1 hover:shadow-lg hover:border-primary-container/40"
                >
                  <I
                    n={n}
                    c="text-primary text-[32px] transition-transform duration-300 group-hover:scale-110"
                  />
                  <span className="font-label-md text-label-md text-on-surface font-bold">
                    {t}
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    {s}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Sec>

        {/* 7 BENCHMARKS */}
        <Sec id="benchmarks">
          <Head
            pill="Independent Benchmarks"
            title="Architectural Comparison"
            sub="See why performance-critical organizations migrate off shared hypervisor clouds and onto PRIMO Gold VPS."
          />
          <div className="overflow-x-auto shadow-xl rounded-xl bg-surface-container-lowest border border-outline-variant">
            <table className="w-full min-w-[820px] text-left font-body-md text-body-md">
              <thead>
                <tr className="bg-surface-container text-on-surface font-headline-sm text-headline-sm">
                  <th className="py-4 px-6 font-bold">Architectural Metric</th>
                  <th className="py-4 px-6 bg-gradient-to-r from-primary-container to-secondary text-on-primary font-bold">
                    <div className="flex items-center gap-2">
                      <span>PRIMO Gold VPS</span>
                      <span className="text-label-sm font-label-sm px-2 py-0.5 bg-on-primary text-primary-container rounded-full whitespace-nowrap">
                        VIP FLAGSHIP
                      </span>
                    </div>
                  </th>
                  <th className="py-4 px-6 font-semibold text-on-surface-variant">
                    Standard Cloud VPS (Linode/DO)
                  </th>
                  <th className="py-4 px-6 font-semibold text-on-surface-variant">
                    Hyperscaler VM (AWS c7g/m7i)
                  </th>
                </tr>
              </thead>
              <tbody>
                {compare.map(([a, b, c, d, bad], i) => (
                  <tr
                    key={a}
                    className={`${i % 2 ? "bg-surface-container-low" : "bg-surface-container-lowest"} hover:bg-secondary-container/10 transition-colors`}
                  >
                    <td className="py-4 px-6 font-semibold text-on-surface">
                      {a}
                    </td>
                    <td className="py-4 px-6 bg-secondary-container/20 font-bold text-primary">
                      <span className="flex items-center gap-2">
                        <I
                          n="check_circle"
                          c="text-[18px] text-primary-container shrink-0"
                        />
                        {b}
                      </span>
                    </td>
                    <td
                      className={`py-4 px-6 ${bad ? "text-error font-medium" : "text-on-surface-variant"}`}
                    >
                      {c}
                    </td>
                    <td className="py-4 px-6 text-on-surface-variant">{d}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Sec>

        {/* 8 DASHBOARD */}
        <Sec bg="bg-surface-container-low">
          <Head
            pill="Mission Control"
            title="Unified Hypervisor Management"
            sub="Every Gold VPS instance includes granular, second-by-second kernel metrics and instant programmatic control."
          />
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-2xl overflow-hidden p-space-md lg:p-space-lg">
            <div className="flex flex-wrap items-center justify-between gap-space-sm pb-space-md">
              <div className="flex items-center gap-space-sm">
                <div
                  className={`w-3 h-3 rounded-full ${rebooting ? "bg-tertiary-fixed-dim animate-ping" : "bg-primary-container animate-pulse"}`}
                />
                <div>
                  <div className="font-headline-sm text-headline-sm text-on-surface font-bold">
                    gold-node-fra-01.primocloud
                  </div>
                  <div className="font-body-sm text-body-sm text-on-surface-variant">
                    IP: 185.192.44.12 • Frankfurt Equinix FR5 • Ubuntu 24.04 LTS
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => toast("Opening secure VNC console session…")}
                  className={act}
                >
                  <I n="terminal" c="text-[16px]" />
                  <span>Web Console (VNC)</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    toast("Live snapshot queued — ready in ~8 seconds.")
                  }
                  className={act}
                >
                  <I n="camera" c="text-[16px]" />
                  <span>Snapshot</span>
                </button>
                <button
                  type="button"
                  onClick={reboot}
                  disabled={rebooting}
                  className={`${act} disabled:opacity-50`}
                >
                  <I n="restart_alt" c="text-[16px]" />
                  <span>{rebooting ? "Rebooting…" : "Reboot"}</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    toast(
                      "Scale request opened: choose Gold-2 → Gold-3 (hot resize).",
                    )
                  }
                  className="px-3 py-1.5 bg-primary-container text-on-primary hover:bg-secondary rounded-lg font-label-sm text-label-sm font-semibold flex items-center gap-1 shadow-sm transition-all hover:-translate-y-0.5"
                >
                  <I n="tune" c="text-[16px]" />
                  <span>Scale Cores</span>
                </button>
              </div>
            </div>
            <div
              className={`mb-space-sm px-3 py-2 rounded-lg bg-primary/10 text-primary font-label-md text-label-md transition-all duration-300 overflow-hidden ${status ? "opacity-100 max-h-12" : "opacity-0 max-h-0 py-0 mb-0"}`}
            >
              {status}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-md my-space-md">
              <div className="bg-surface-container-low border border-outline-variant p-4 rounded-xl">
                <div className="flex items-center justify-between text-body-sm font-medium text-on-surface-variant mb-1">
                  <span>CPU Pinned (8 Cores)</span>
                  <span className="text-primary font-bold">{cpu}%</span>
                </div>
                <Spark
                  cls="text-primary"
                  seed={[
                    0.45, 0.55, 0.4, 0.5, 0.35, 0.6, 0.5, 0.65, 0.55, 0.7, 0.6,
                    0.55,
                  ]}
                />
                <div className="flex justify-between text-body-sm text-on-surface-variant mt-2 font-mono-code">
                  <span>Steal: 0.00%</span>
                  <span>Clock: 3.75GHz</span>
                </div>
              </div>
              <div className="bg-surface-container-low border border-outline-variant p-4 rounded-xl">
                <div className="flex items-center justify-between text-body-sm font-medium text-on-surface-variant mb-1">
                  <span>DDR5 ECC RAM</span>
                  <span className="text-primary font-bold">14.2 / 32 GB</span>
                </div>
                <div className="w-full bg-surface-container h-3 rounded-full overflow-hidden my-3">
                  <div className="bg-gradient-to-r from-primary-container to-secondary h-full w-[44%] rounded-full" />
                </div>
                <div className="flex justify-between text-body-sm text-on-surface-variant font-mono-code">
                  <span>Cached: 8.4 GB</span>
                  <span>Swap: 0 MB</span>
                </div>
              </div>
              <div className="bg-surface-container-low border border-outline-variant p-4 rounded-xl">
                <div className="flex items-center justify-between text-body-sm font-medium text-on-surface-variant mb-1">
                  <span>NVMe Gen5 I/O</span>
                  <span className="text-primary font-bold">612K IOPS</span>
                </div>
                <Spark
                  cls="text-tertiary-container"
                  seed={[
                    0.2, 0.35, 0.25, 0.6, 0.5, 0.75, 0.55, 0.7, 0.45, 0.8, 0.6,
                    0.7,
                  ]}
                />
                <div className="flex justify-between text-body-sm text-on-surface-variant mt-2 font-mono-code">
                  <span>R: 8.2 GB/s</span>
                  <span>W: 5.1 GB/s</span>
                </div>
              </div>
              <div className="bg-surface-container-low border border-outline-variant p-4 rounded-xl">
                <div className="flex items-center justify-between text-body-sm font-medium text-on-surface-variant mb-1">
                  <span>Network Throughput</span>
                  <span className="text-primary font-bold">3.8 Gbps</span>
                </div>
                <Spark
                  cls="text-primary"
                  seed={[
                    0.3, 0.55, 0.7, 0.5, 0.4, 0.6, 0.65, 0.5, 0.55, 0.6, 0.5,
                    0.45,
                  ]}
                />
                <div className="flex justify-between text-body-sm text-on-surface-variant mt-2 font-mono-code">
                  <span>DDoS: 0 Drops</span>
                  <span>RTT: 0.28ms</span>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-space-sm pt-space-sm text-body-sm text-on-surface-variant bg-surface-container-low p-3 rounded-lg">
              <div className="flex flex-wrap items-center gap-space-md">
                <span className="flex items-center gap-1">
                  <I n="security" c="text-[16px] text-primary" /> Enterprise
                  DDoS Shield Active
                </span>
                <span className="flex items-center gap-1">
                  <I n="public" c="text-[16px] text-primary" /> BGP Anycast
                  Available
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-space-sm font-label-sm font-semibold">
                {subLinks.map((t, i) => (
                  <React.Fragment key={t}>
                    {i > 0 && <span>•</span>}
                    <a className="text-primary hover:underline" href="#">
                      {t}
                    </a>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </Sec>

        {/* 9 TESTIMONIALS */}
        <Sec>
          <Head
            pill="Trusted by Engineers"
            title="Verified VIP Client Reviews"
            sub="From algorithmic trading institutions to fintech unicorns, see why technical leaders deploy on Gold VPS."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            {reviews.map(([i, n, r, t]) => (
              <div
                key={n}
                className="bg-surface-container-lowest border border-outline-variant p-space-lg rounded-xl shadow-sm relative hover:shadow-xl hover:-translate-y-1 hover:border-primary-container/40 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 text-primary-container mb-3">
                    {[...Array(5)].map((_, k) => (
                      <I key={k} n="star" c="text-[20px]" />
                    ))}
                  </div>
                  <I
                    n="format_quote"
                    c="absolute top-4 right-5 text-[56px] text-primary-container/15"
                  />
                  <p className="relative font-body-md text-body-md text-on-surface leading-relaxed italic">
                    {t}
                  </p>
                </div>
                <div className="flex items-center gap-3 mt-space-md pt-space-sm">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-container to-secondary flex items-center justify-center font-bold text-on-primary">
                    {i}
                  </div>
                  <div>
                    <div className="flex items-center gap-1 font-label-md text-label-md text-on-surface font-bold">
                      {n}
                      <I n="verified" c="text-[16px] text-primary-container" />
                    </div>
                    <div className="font-body-sm text-body-sm text-on-surface-variant">
                      {r}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Sec>

        {/* 10 FAQ */}
        <Sec bg="bg-surface-container-low">
          <Head
            pill="Detailed Specifications"
            title="Frequently Asked Questions"
            sub="Everything you need to know about Gold VPS virtualization, hardware pinning, SLAs, and migration."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter items-start">
            {[faqs.slice(0, 5), faqs.slice(5)].map((col, c) => (
              <div key={c} className="flex flex-col gap-space-sm">
                {col.map(([q, a], j) => {
                  const i = c * 5 + j;
                  const isOpen = open.includes(i);
                  return (
                    <div
                      key={q}
                      className={`bg-surface-container-lowest rounded-xl border shadow-sm p-4 transition-all duration-300 ${isOpen ? "border-primary-container shadow-md shadow-primary-container/10" : "border-outline-variant"}`}
                    >
                      <button
                        type="button"
                        onClick={() => toggleFaq(i)}
                        className="w-full flex items-center justify-between gap-3 text-left font-headline-sm text-headline-sm text-on-surface font-bold"
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
                          <div className="pt-3 font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
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

        {/* 11 CTA */}
        <section className="w-full py-space-xl bg-gradient-to-br from-primary via-primary-container to-secondary bg-[length:200%_200%] animate-[shimmer_10s_linear_infinite] text-on-primary relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
          <span className="pointer-events-none absolute -left-10 top-6 h-40 w-40 rounded-full bg-white/10 animate-float" />
          <span className="pointer-events-none absolute -right-8 bottom-4 h-52 w-52 rounded-full bg-white/10 animate-float [animation-delay:1.5s]" />
          <div className="max-w-5xl mx-auto px-margin-mobile lg:px-margin text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-on-primary/10 rounded-full mb-space-md">
              <span className="w-2 h-2 rounded-full bg-primary-fixed animate-ping" />
              <span className="font-label-sm text-label-sm uppercase tracking-wider font-semibold text-primary-fixed">
                Instant Provisioning Active
              </span>
            </div>
            <h2 className="font-display-lg text-display-lg font-extrabold tracking-tight">
              Ready to Upgrade to Unrivaled Bare-Metal Speed?
            </h2>
            <p className="font-body-lg text-body-lg text-on-primary/90 max-w-2xl mx-auto mt-space-sm mb-space-lg leading-relaxed">
              Deploy your dedicated AMD EPYC™ Gold VPS instance in under 60
              seconds with our unconditional 30-day money-back guarantee.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-space-md">
              <a
                href="#plans"
                className="inline-flex items-center justify-center gap-space-xs font-label-lg text-label-lg bg-surface-container-lowest text-on-surface hover:bg-surface-bright px-8 py-4 rounded-xl shadow-lg transition-all font-bold hover:-translate-y-0.5"
              >
                <span>Deploy Gold VPS Now</span>
                <I n="rocket_launch" c="text-[20px] text-primary" />
              </a>
              <a
                href="/contact"
                className="inline-flex items-center justify-center gap-space-xs font-label-lg text-label-lg bg-on-primary/10 hover:bg-on-primary/20 border border-white/30 text-on-primary px-8 py-4 rounded-xl shadow-sm transition-all font-semibold"
              >
                <span>Talk to a Cloud Specialist</span>
                <I n="headset_mic" c="text-[20px]" />
              </a>
            </div>
            <div className="mt-space-lg pt-space-md flex flex-wrap items-center justify-center gap-space-lg text-on-primary/90 font-label-md text-label-md">
              {[
                ["verified_user", "99.999% SLA Uptime"],
                ["bolt", "Instant 60s Provisioning"],
                ["forum", "24/7 VIP Concierge"],
              ].map(([n, t]) => (
                <div key={t} className="flex items-center gap-1.5">
                  <I n={n} c="text-[20px] text-primary-fixed" />
                  <span>{t}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default GoldVps;
