import { orderUrl } from "../lib/panel";
import React, { useState, useRef } from "react";
import Layout from "../components/layout";
import HeroGlobe from "../components/heroglobe";
import { useMotion, CountUp } from "../components/motion";
import { useCurrency } from "../context/CurrencyContext";
import hero1 from "../assets/Hero1.png";
import hero2 from "../assets/Hero2.png";
import hero3 from "../assets/Hero3.jpg";
import hero4 from "../assets/Hero4.png";
import hero5 from "../assets/Hero5.png";

// Applies text-[Npx] inline: the Google icon stylesheet forces 24px and would override Tailwind's size class.
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
const Pill = ({ children, c = "" }) => (
  <span
    className={`inline-flex items-center gap-1.5 font-mono-code text-label-sm text-primary font-semibold uppercase tracking-wider bg-secondary-container/40 border border-primary-container/20 px-3 py-1 rounded-full ${c}`}
  >
    <span className="h-1.5 w-1.5 rounded-full bg-primary-container" />
    {children}
  </span>
);
const Sec = ({ bg = "bg-surface", id, children }) => (
  <section
    id={id}
    className={`relative overflow-hidden w-full ${bg} py-space-xl`}
  >
    <div className="pointer-events-none absolute -right-32 top-10 h-72 w-72 rounded-full bg-primary-container/5 blur-3xl" />
    <div className="relative max-w-7xl mx-auto px-margin-mobile lg:px-margin">
      {children}
    </div>
  </section>
);
const Head = ({ pill, title, sub }) => (
  <div className="text-center max-w-3xl mx-auto mb-space-xl">
    <Pill>{pill}</Pill>
    <h2 className="font-headline-xl text-headline-xl text-on-surface font-bold mt-space-sm">
      {title}
    </h2>
    <div className="mx-auto mt-space-sm h-1 w-16 rounded-full bg-gradient-to-r from-primary-container to-secondary" />
    {sub && (
      <p className="font-body-lg text-body-lg text-on-surface-variant mt-space-sm">
        {sub}
      </p>
    )}
  </div>
);
const Btn = ({ href = "#", children }) => (
  <a
    href={href}
    className="group relative overflow-hidden inline-flex items-center justify-center font-label-lg text-label-lg bg-gradient-to-r from-primary-container to-secondary text-on-primary px-8 py-3.5 rounded-xl transition-all shadow-md shadow-primary-container/30 font-bold hover:shadow-lg hover:-translate-y-0.5 before:absolute before:inset-y-0 before:-left-full before:w-1/2 before:skew-x-[-20deg] before:bg-white/30 hover:before:left-[150%] before:transition-all before:duration-700"
  >
    <span>{children}</span>
    <I
      n="arrow_forward"
      c="ml-1.5 text-[20px] transition-transform group-hover:translate-x-1"
    />
  </a>
);
const IconBox = ({
  n,
  size = "w-12 h-12 rounded-full",
  fs = "text-[26px]",
  mb = "mb-space-md",
  col = "text-primary-container",
}) => (
  <div
    className={`${size} bg-secondary-container/40 flex items-center justify-center ${col} ${mb} transition-all duration-300 group-hover:bg-primary-container group-hover:text-on-primary group-hover:scale-110 group-hover:-rotate-6`}
  >
    <I n={n} c={fs} />
  </div>
);
const cardHover =
  "group relative overflow-hidden bg-surface-container-lowest rounded-2xl border border-outline-variant hover:border-primary-container/40 transition-all before:absolute before:inset-x-0 before:top-0 before:h-0.5 before:bg-gradient-to-r before:from-primary-container before:to-secondary before:scale-x-0 before:origin-left before:transition-transform before:duration-500 hover:before:scale-x-100";

const heroStats = [
  ["verified", "99.99% Uptime"],
  ["support_agent", "24/7 Support"],
  ["bolt", "Instant Setup"],
  ["dns", "Tier-4 Clusters"],
];
const stats = [
  ["99.99%", "Uptime SLA Guaranteed", "Tier-4 Redundancy"],
  ["10K+", "Active Customers", "Globally Deployed"],
  ["24/7", "Live Expert Support", "Avg. 2m Response"],
  ["18+", "Datacenter Locations", "Sub-15ms Coverage"],
  ["<60s", "Automated Provisioning", "Instant OS Deployment"],
];
const plans = [
  {
    n: "Starter VPS", slug: "vps-starter",
    d: "Light apps & staging",
    p: ["$6.99", "$5.59"],
    s: [
      ["1 vCPU", " (High Clock)"],
      ["2 GB", " DDR4 RAM"],
      ["40 GB", " NVMe SSD Storage"],
      ["2 TB", " Bandwidth @ 1 Gbps"],
      ["", "1 Dedicated IPv4 Address"],
      ["", "Linux OS (Ubuntu, Alma, Debian)"],
    ],
  },
  {
    n: "Business VPS", slug: "vps-business",
    d: "Optimized for production",
    feat: true,
    p: ["$14.99", "$11.99"],
    s: [
      ["2 vCPU", " Dedicated Core Share"],
      ["4 GB", " DDR4 RAM"],
      ["80 GB", " NVMe SSD (Gen4)"],
      ["5 TB", " Bandwidth @ 10 Gbps"],
      ["", "1 Dedicated IPv4 + /64 IPv6"],
      ["", "Linux or Windows Server OS"],
    ],
  },
  {
    n: "Professional VPS", slug: "vps-professional",
    d: "Databases & ERP systems",
    p: ["$29.99", "$23.99"],
    s: [
      ["4 vCPU", " High-Frequency"],
      ["8 GB", " DDR4 RAM"],
      ["160 GB", " NVMe SSD Storage"],
      ["10 TB", " Bandwidth @ 10 Gbps"],
      ["2 Dedicated IPv4", " Addresses"],
      ["", "Automated Daily Snapshot"],
    ],
  },
  {
    n: "Enterprise VPS", slug: "vps-enterprise",
    d: "Heavy compute & fintech",
    p: ["$59.99", "$47.99"],
    s: [
      ["8 vCPU", " Dedicated Compute"],
      ["16 GB", " DDR4 RAM"],
      ["320 GB", " Pure NVMe Storage"],
      ["Unmetered Bandwidth", ""],
      ["3 Dedicated IPv4", " + /64 IPv6"],
      ["", "Priority 24/7 SLA SysAdmin"],
    ],
  },
];
const stack = [
  ["terminal", "Ubuntu"],
  ["dns", "Debian"],
  ["storage", "AlmaLinux"],
  ["desktop_windows", "Windows Server"],
  ["deployed_code", "Docker"],
  ["hub", "Kubernetes (K3s)"],
  ["candlestick_chart", "MetaTrader 4/5"],
  ["language", "WordPress"],
  ["database", "PostgreSQL"],
  ["memory", "Redis"],
  ["sports_esports", "Minecraft"],
  ["account_tree", "n8n"],
  ["settings", "cPanel / Plesk"],
];
const guarantees = [
  ["verified_user", "30-Day Money Back Guarantee"],
  ["speed", "Instant Zero-Lag Activation"],
  ["move_to_inbox", "Free Seamless Migration Service"],
];
const why = [
  [
    "memory",
    "High Performance CPUs",
    "Equipped with state-of-the-art AMD EPYC™ and Intel® Xeon® Gold scalable processors ensuring superior single-thread and multi-core computational speeds.",
  ],
  [
    "hard_drive_2",
    "NVMe SSD Storage",
    "Enterprise NVMe RAID-10 storage pools capable of sustained read and write speeds up to 7,000 MB/s, slashing database query execution time.",
  ],
  [
    "cloud_done",
    "99.99% Uptime SLA",
    "Dual independent power feeds, redundant N+1 cooling systems, and automated network rerouting guarantee non-stop business operations.",
  ],
  [
    "security",
    "1.2+ Tbps DDoS Mitigation",
    "Always-on automated inline scrubbing centers shield your applications from complex volumetric L3/L4 floods and sophisticated L7 web exploits.",
  ],
  [
    "admin_panel_settings",
    "Root & Admin Access",
    "Complete administrative sovereignty. Configure custom kernels, install private software, manage IPTables firewalls, and tweak your environment.",
  ],
  [
    "engineering",
    "24/7 Tier-3 Support",
    "Direct access to experienced Linux and Windows systems engineers 24 hours a day, 365 days a year via live chat and priority ticket dispatch.",
  ],
];
const nodes = [
  [220, 130, "New York (9ms)", 12, 5, "3s"],
  [480, 110, "Frankfurt (11ms)", 12, 5, "2.5s"],
  [780, 130, "Tokyo (18ms)", -80, 5, "3.2s"],
  [710, 230, "Singapore (15ms)", 12, 5, "2.8s"],
  [260, 310, "São Paulo (28ms)", 10, 4],
  [790, 330, "Sydney (24ms)", 10, 4],
];
const continents = [
  "M140,80 Q220,70 260,110 Q280,160 250,220 Q200,240 180,210 Q140,200 120,150 Z",
  "M220,250 Q280,260 270,330 Q240,400 210,380 Q180,310 220,250 Z",
  "M460,70 Q540,60 560,120 Q520,180 470,160 Q430,120 460,70 Z",
  "M480,180 Q560,190 550,290 Q510,360 470,320 Q440,240 480,180 Z",
  "M580,70 Q780,60 840,160 Q790,260 670,220 Q610,150 580,70 Z",
  "M720,280 Q840,270 820,360 Q740,390 710,330 Z",
];
const arcs = [
  ["M 220 130 Q 350 70 480 110", 0.7, 2, "6 6"],
  ["M 480 110 Q 600 80 720 140", 0.7, 2, "6 6"],
  ["M 220 130 Q 230 220 240 310", 0.5, 2, "6 6"],
  ["M 720 140 Q 750 230 760 320", 0.5, 2, "6 6"],
  ["M 480 110 Q 600 240 760 320", 0.4, 1.5, "4 4"],
];
const regions = [
  ["North America", "NYC, Dallas, Silicon Valley", "14ms"],
  ["Europe", "Frankfurt, London, Amsterdam", "11ms"],
  ["Asia Pacific", "Singapore, Tokyo, Mumbai", "18ms"],
  ["Australia & LatAm", "Sydney, São Paulo", "26ms"],
];
const useCases = [
  [
    "language",
    "Website Hosting",
    "Supercharge WordPress, WooCommerce, Magento, and web apps with instant NVMe caching and high bandwidth pipelines.",
  ],
  [
    "business_center",
    "Business Applications",
    "Host ERP systems, corporate CRM suites, internal billing software, and custom enterprise accounting workloads safely.",
  ],
  [
    "code",
    "Development & CI/CD",
    "Deploy staging servers, GitLab runners, Jenkins pipelines, and Docker containers with seamless root control and API hooks.",
  ],
  [
    "candlestick_chart",
    "Forex Trading (EA)",
    "Ultra-low latency proximity to major financial exchange centers (Equinix NY4/LD4) ensuring zero slippage for algorithms.",
  ],
  [
    "desktop_windows",
    "Remote Desktop (RDP)",
    "Fast, lag-free Windows remote desktop access from any laptop or tablet with high-throughput graphics acceleration.",
  ],
  [
    "sports_esports",
    "Game Servers",
    "Host high-tickrate Minecraft, Rust, CS2, and Ark servers with customized DDoS packet filters and zero frame drops.",
  ],
  [
    "vpn_lock",
    "VPN & WireGuard Proxy",
    "Establish high-speed encrypted point-to-point tunnels with full privacy, unshared dedicated IP, and zero activity logs.",
  ],
  [
    "database",
    "Database Hosting",
    "Optimal environment for PostgreSQL, MySQL, Redis, and MongoDB clusters with IOPS-optimized PCIe Gen4 NVMe arrays.",
  ],
];
const winFeatures = [
  "Windows Server 2019 / 2022 / 2025",
  "Low-Latency RDP (Zero Lag)",
  "Full Administrator Rights",
  "Pre-activated Genuine License",
  "High-Frequency NVMe SSD",
  "24/7 Dedicated SysAdmin Support",
];
const linuxFeatures = [
  "Ubuntu, Debian, AlmaLinux, Rocky",
  "Full Root & Sudo SSH Access",
  "Docker & K3s Ready Out-of-the-Box",
  "Developer-Friendly RESTful API",
  "Zero-Overhead KVM Virtualization",
  "Custom ISO & Cloud-Init Boot Support",
];
const forexFeatures = [
  ["speed", "<1ms Broker Latency"],
  ["candlestick_chart", "MT4 & MT5 Optimized"],
  ["autorenew", "24/7 Zero Reboot SLA"],
  ["flash_on", "Fast Order Execution"],
  ["smart_toy", "Automated Bot Support"],
  ["lock", "Dedicated Non-Shared Cores"],
];
// [x, wickTop, wickBottom, bodyY, bodyH, up]
const candles = [
  [40, 50, 130, 70, 40, 1],
  [80, 40, 110, 60, 35, 1],
  [120, 60, 140, 75, 25, 0],
  [160, 30, 100, 45, 45, 1],
  [200, 40, 120, 55, 40, 1],
  [240, 50, 130, 65, 30, 0],
  [280, 20, 90, 30, 50, 1],
  [320, 15, 80, 25, 45, 1],
  [360, 10, 70, 20, 35, 1],
];
const managed = [
  [
    "terminal",
    "Server Setup & OS Installation",
    "Custom partition schemes, LAMP/LEMP stacks, control panels (cPanel, Plesk, CyberPanel), and environment hardening handled on demand.",
  ],
  [
    "published_with_changes",
    "Free Zero-Downtime Migration",
    "Our expert sysadmins migrate your files, databases, SSL certificates, and configurations from your existing provider with zero disruption.",
  ],
  [
    "shield",
    "Proactive Firewall & Security",
    "Configuration of CSF/IPTables, SSH key authentication, brute-force jailkit policies, and real-time malware scanners.",
  ],
  [
    "tune",
    "Database & Kernel Optimization",
    "Tuning MySQL/PostgreSQL buffer pools, Nginx worker threads, PHP-FPM processes, and OS sysctl parameters for extreme load handling.",
  ],
  [
    "monitoring",
    "24/7 Automated Health Checks",
    "Automated sensor probes monitor HTTP, ping, CPU, memory, and disk capacity around the clock. Proactive recovery triggers immediately.",
  ],
  [
    "contact_support",
    "Rapid SysAdmin Troubleshooting",
    "Get instant solutions for crash analyses, broken dependencies, corrupted packages, or network glitches from Tier-3 specialists.",
  ],
];
const secItems = [
  [
    "Enterprise DDoS Shield",
    "Real-time packet filtering absorbing L3/L4 volumetric floods.",
  ],
  [
    "Next-Gen Firewalls",
    "Custom ingress/egress rules enforceable directly via cloud dashboard.",
  ],
  [
    "Automated Snapshots",
    "Scheduled block-level immutable backups with instant 1-click restore.",
  ],
  [
    "End-to-End Encryption",
    "AES-256 encrypted storage volumes and encrypted NVMe interconnects.",
  ],
];
const gauges = [
  ["CPU Usage", "memory", "28%", "4 vCPU @ 3.4GHz", "28%"],
  ["RAM Memory", "developer_board", "4.2 GB", "of 8.0 GB", "52%"],
  ["NVMe Storage", "hard_drive_2", "42 GB", "of 160 GB", "26%"],
  ["Bandwidth Transfer", "sync_alt", "840 GB", "of 10 TB", "8%"],
];
const actions = [
  ["play_arrow", "Start", "hover:text-primary", "text-primary-container"],
  ["stop", "Stop", "hover:text-error", ""],
  ["restart_alt", "Restart", "hover:text-primary", ""],
  ["terminal", "VNC Console", "hover:text-primary", ""],
  ["camera", "Create Snapshot", "hover:text-primary", ""],
  ["settings_backup_restore", "Rebuild OS", "hover:text-primary", ""],
];
const fw = [
  ["TCP / SSH", "22"],
  ["TCP / HTTP", "80"],
  ["TCP / HTTPS", "443"],
];
const reviews = [
  [
    "DM",
    "David Miller",
    "CTO, Fintech Solutions",
    "PRIMO CLOUD's low latency and rock-solid uptime have been game changers for our real-time trading engines. The support team responds in minutes whenever we need specialized firewall configurations.",
  ],
  [
    "ER",
    "Elena Rostova",
    "Lead DevOps, AppVenture Inc.",
    "Migrating 40+ production microservices to PRIMO CLOUD VPS was completely seamless. The NVMe speeds are unmatched and pricing is 100% transparent without hidden bandwidth surprises.",
  ],
  [
    "MC",
    "Marcus Chen",
    "Founder, WebScale Agency",
    "We host over 120 client ecommerce stores on PRIMO VPS. Zero unexpected downtime in 2 consecutive years. Absolutely phenomenal stability and management convenience.",
  ],
];
const faqs = [
  [
    "What is VPS hosting?",
    "A Virtual Private Server (VPS) is an isolated virtual environment created on high-performance physical server hardware. Unlike shared hosting, your VPS has 100% dedicated vCPU cores, dedicated RAM, and private NVMe disk space that no other tenant can impact.",
  ],
  [
    "What is the difference between Windows and Linux VPS?",
    "Linux VPS uses open-source operating systems (such as Ubuntu, Debian, AlmaLinux) managed primarily via SSH terminal and is popular for web stacks and Docker. Windows VPS comes pre-licensed with Windows Server and is managed via Remote Desktop Connection (RDP), ideal for .NET apps, Forex MT4/MT5, and Office workflows.",
  ],
  [
    "How quickly is my VPS activated?",
    "Every server deployment is completely automated. As soon as your order and payment are verified, our hypervisors spin up the OS image, allocate your dedicated IPv4 address, and deliver your root/admin credentials in under 60 seconds.",
  ],
  [
    "Do I get root or administrator access?",
    "Yes, you receive 100% root shell access on Linux servers and full Administrator rights on Windows VPS instances. You have ultimate control to install software, modify kernels, and configure firewalls without restrictions.",
  ],
  [
    "Can I upgrade my VPS later?",
    "Yes. You can scale CPU cores, RAM, and NVMe disk capacity directly from the PRIMO Cloud dashboard with zero data loss and minimal downtime. Resources are dynamically adjusted seamlessly.",
  ],
  [
    "Do you provide DDoS protection?",
    "Yes, all VPS plans include complimentary enterprise-grade DDoS protection up to 1.2+ Tbps. Our automated inline scrubbing system filters malicious volumetric floods at the edge before they can reach your server.",
  ],
  [
    "Can I host websites and applications?",
    "Absolutely. You can host an unlimited number of websites, e-commerce stores, custom APIs, databases, game servers, or SaaS backends. You can also deploy cPanel, Plesk, CyberPanel, or free Docker stacks.",
  ],
  [
    "Do you support MT4 and MT5?",
    "Yes, our Forex VPS plans are specifically calibrated to run multiple instances of MetaTrader 4 and MetaTrader 5 simultaneously with continuous 24/7 uptime and sub-millisecond connection to major financial brokers.",
  ],
  [
    "Do you provide technical support?",
    "Yes, we provide 24/7/365 live chat and ticket support staffed by experienced Tier-3 Linux and Windows sysadmins. Our average initial response time is under 2 minutes.",
  ],
  [
    "What payment methods do you accept?",
    "We accept all major Credit and Debit Cards (Visa, MasterCard, American Express), PayPal, Bank Wire Transfers, and popular Cryptocurrencies (Bitcoin, USDT, Ethereum).",
  ],
];

const Check = ({ c = "text-[18px]" }) => (
  <I n="check_circle" c={`text-primary-container ${c}`} />
);
const Feat = ({ t }) => (
  <div className="flex items-center gap-2">
    <Check c="text-[20px]" />
    <span>{t}</span>
  </div>
);

const Homepage = () => {
  const rootRef = useRef(null);
  useMotion(rootRef);
  const { fmt } = useCurrency();
  const [yearly, setYearly] = useState(false);
  const [open, setOpen] = useState([0, 5]);
  const toggle = (i) =>
    setOpen((o) => (o.includes(i) ? o.filter((x) => x !== i) : [...o, i]));
  const tab =
    "px-4 py-1.5 rounded-lg text-label-md font-label-md transition-all";
  const on =
    "bg-surface-container-lowest text-on-surface shadow-sm font-semibold";
  const off = "text-on-surface-variant hover:text-on-surface";
  const heroImages = [hero1, hero2, hero3, hero4, hero5];
  return (
    <Layout>
      <div ref={rootRef} className="flex flex-col w-full">
        {/* 1 HERO */}
        <section className="relative isolate w-full min-h-[650px] lg:min-h-[720px] overflow-hidden bg-white">
          {/* Background Carousel */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            {heroImages.map((image, index) => (
              <div
                key={image}
                className="hero-slide absolute inset-0"
                style={{
                  backgroundImage: `url("${image}")`,
                  animationDelay: `${index * 6}s`,                
                }}
              />
            ))}
          </div>

          {/* White Overlay */}
          <div className="absolute inset-0 z-[1]" />

          {/* Optional soft green brand tint */}
          <div className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-r from-white/85 via-white/55 to-white/10" />

          {/* Keep your existing hero content below */}
          <div className="relative z-10 max-w-7xl mx-auto px-margin-mobile lg:px-margin py-20 lg:py-28 ">
            <div className="lg:col-span-7 flex flex-col  gap-space-lg">
              <div className="inline-flex items-center gap-space-xs px-3.5 py-1.5 rounded-full bg-secondary-container/30 border border-primary-container/30 w-fit">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-container opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-container" />
                </span>
                <span className="font-mono-code text-label-sm text-secondary font-semibold tracking-wide">
                  Enterprise Cloud Infrastructure • Instant Provisioning in 60s
                </span>
              </div>
              <div className="flex flex-col gap-space-sm">
                <h1 className="font-display-lg text-display-lg lg:text-[38px] lg:leading-[52px] text-on-surface font-extrabold tracking-tight">
                  Power Your Business with{" "}
                  <span className="bg-gradient-to-r from-primary-container via-secondary to-primary-container bg-[length:200%_auto] bg-clip-text text-transparent animate-[shimmer_4s_linear_infinite]">
                    <br />
                    Reliable Cloud
                  </span>{" "}
                  Infrastructure
                </h1>
                <p className="font-headline-md text-headline-md text-secondary font-medium">
                  Fast, Secure & High-Performance VPS Hosting
                </p>
              </div>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl leading-relaxed">
                Deploy ultra-low latency, scalable VPS solutions designed for
                enterprise workloads, financial trading algorithms, production
                applications, and high-traffic multi-tier stacks.
              </p>
              <div className="flex flex-wrap items-center gap-space-md pt-space-xs">
                <Btn href="#vps-plans">Get Started</Btn>
                <a
                  href="#vps-plans"
                  className="inline-flex items-center justify-center font-label-lg text-label-lg bg-surface-container-lowest hover:bg-secondary-container/20 text-primary-container border-2 border-primary-container px-7 py-3.5 rounded-xl transition-all font-semibold"
                >
                  View VPS Plans
                </a>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-md pb-space-md pt-space-md border-t border-outline-variant/60 bg-white/40 rounded-xl px-space-md py-space-sm">
                {heroStats.map(([n, t]) => (
                  <div key={t} className="flex items-center gap-2 justify-center">
                    <I n={n} c="text-primary-container text-[20px]" />
                    <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
                      {t}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 2 STATS */}
        <section className="w-full bg-surface-container-low py-space-lg border-y border-outline-variant">
          <div className="max-w-7xl mx-auto px-margin-mobile lg:px-margin">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-space-md text-center">
              {stats.map(([a, b, c], i) => (
                <div
                  key={b}
                  className={`${i === 4 ? "col-span-2 md:col-span-1 " : ""}flex flex-col items-center p-space-sm bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm hover:border-primary-container/50 hover:-translate-y-1 hover:shadow-lg transition-all duration-300`}
                >
                  <span className="font-headline-xl text-headline-xl text-primary font-extrabold">
                    <CountUp value={a} />
                  </span>
                  <span className="font-label-md text-label-md text-on-surface font-semibold mt-0.5">
                    {b}
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    {c}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* STACK MARQUEE */}
        <section className="w-full bg-surface py-space-lg overflow-hidden">
          <div className="max-w-7xl mx-auto px-margin-mobile lg:px-margin">
            <p className="text-center font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-space-md">
              Deploy anything you run
            </p>
            <div className="relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
              <div className="flex w-max gap-space-md animate-marquee hover:[animation-play-state:paused]">
                {[...stack, ...stack].map(([n, t], i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-surface-container-lowest border border-outline-variant font-label-md text-label-md text-on-surface whitespace-nowrap shadow-sm"
                  >
                    <I n={n} c="text-[18px] text-primary-container" />
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 3 PLANS */}
        <Sec id="vps-plans">
          <div className="text-center max-w-3xl mx-auto mb-space-xl">
            <Pill>Transparent Scalable Pricing</Pill>
            <h2 className="font-headline-xl text-headline-xl text-on-surface font-bold mt-space-sm">
              High-Performance Cloud VPS Plans
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant mt-space-xs">
              Built on pure enterprise NVMe SSD storage arrays, AMD EPYC
              high-frequency processors, and redundant 10 Gbps uplinks.
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
                <span>Yearly Billing</span>
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
                className={`flex flex-col justify-between bg-surface-container-lowest rounded-2xl p-space-lg ${p.feat ? "relative border-2 border-primary-container shadow-2xl shadow-primary-container/25 transform lg:-translate-y-2 bg-gradient-to-b from-secondary-container/20 to-surface-container-lowest" : "border border-outline-variant hover:shadow-xl hover:border-primary-container/40 transition-all duration-300"}`}
              >
                {p.feat && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-primary-container text-on-primary font-mono-code text-[11px] font-bold px-3.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
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
                      {fmt(p.p[yearly ? 1 : 0])}
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      / month
                    </span>
                  </div>
                  <ul className="mt-space-md space-y-space-sm font-body-sm text-body-sm text-on-surface">
                    {p.s.map(([b, r]) => (
                      <li key={b + r} className="flex items-center gap-2">
                        <Check />
                        <span>
                          {b && <strong>{b}</strong>}
                          {r}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-space-lg pt-space-md">
                  <a
                    href={/^Contact/.test(p.cta ?? "") ? "/contact" : orderUrl(p.slug, yearly)}
                    className={`w-full inline-flex items-center justify-center font-label-md text-label-md py-3 rounded-xl transition-all ${p.feat ? "bg-primary-container hover:bg-secondary text-on-primary font-bold shadow-md shadow-primary-container/20" : "bg-surface-container-high hover:bg-primary-container hover:text-on-primary text-on-surface font-semibold"}`}
                  >
                    Order Now
                  </a>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-space-xl p-space-md rounded-2xl bg-surface-container-low border border-outline-variant flex flex-wrap items-center justify-around gap-space-md text-center">
            {guarantees.map(([n, t]) => (
              <div key={t} className="flex items-center gap-2">
                <I n={n} c="text-primary-container" />
                <span className="font-label-md text-label-md font-semibold text-on-surface">
                  {t}
                </span>
              </div>
            ))}
          </div>
        </Sec>

        {/* 4 WHY */}
        <Sec bg="bg-surface-container-low">
          <Head
            pill="Hardware & Infrastructure"
            title="Why Enterprise Architects Choose PRIMO CLOUD"
            sub="Built without compromises. Every server node operates on Tier-4 redundant architecture engineered for pure low-latency performance."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
            {why.map(([n, t, d]) => (
              <div
                key={t}
                className={`p-space-lg hover:shadow-md ${cardHover}`}
              >
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

        {/* 5 NETWORK */}
        <Sec>
          <Head
            pill="Worldwide Edge Backbone"
            title="Global Infrastructure. Local Performance."
            sub="Deploy your virtual private servers in strategic datacenters close to your end-users for ultra-low latency and peak throughput."
          />
          <div className="relative w-full rounded-2xl bg-surface-container-low border border-outline-variant p-space-md lg:p-space-lg overflow-hidden">
            <div className="relative w-full flex justify-center py-4">
              <svg
                className="w-full h-auto max-h-[420px]"
                fill="none"
                viewBox="0 0 960 440"
                xmlns="http://www.w3.org/2000/svg"
              >
                {continents.map((d) => (
                  <path key={d} d={d} fill="#E2E8E5" opacity="0.6" />
                ))}
                {arcs.map(([d, o, w, da]) => (
                  <path
                    key={d}
                    d={d}
                    fill="none"
                    opacity={o}
                    stroke="#0BAF60"
                    strokeDasharray={da}
                    strokeWidth={w}
                  />
                ))}
                {nodes.map(([x, y, l, tx, r, dur]) => (
                  <g key={l} transform={`translate(${x}, ${y})`}>
                    <circle fill="#0BAF60" opacity="0.2" r={r * 2 + 2}>
                      {dur && (
                        <animate
                          attributeName="r"
                          dur={dur}
                          repeatCount="indefinite"
                          values="6;16;6"
                        />
                      )}
                    </circle>
                    <circle fill="#0BAF60" r={r} />
                    <text
                      fill="#1C1B1B"
                      fontFamily="Inter"
                      fontSize="11"
                      fontWeight="bold"
                      x={tx}
                      y="4"
                    >
                      {l}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md mt-space-md">
              {regions.map(([t, c, ms]) => (
                <div
                  key={t}
                  className="p-space-md bg-surface-container-lowest rounded-xl border border-outline-variant flex items-center justify-between"
                >
                  <div>
                    <h4 className="font-headline-sm text-label-lg font-bold text-on-surface">
                      {t}
                    </h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      {c}
                    </p>
                    <div className="font-mono-code text-[11px] text-primary-container font-semibold mt-1">
                      {ms} Avg. Latency
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 font-mono-code text-[11px] text-secondary bg-secondary-container/40 px-2 py-0.5 rounded-full font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-container" />{" "}
                    Online
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Sec>

        {/* 6 USE CASES */}
        <Sec bg="bg-surface-container-low">
          <Head
            pill="Versatile Compute Workloads"
            title="Built for Every High-Demand VPS Use Case"
            sub="Whether you run mission-critical e-commerce platforms, automated financial bots, or high-throughput databases, PRIMO CLOUD delivers sustained power."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
            {useCases.map(([n, t, d]) => (
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
                </div>
                <a
                  href="#"
                  className="mt-space-md inline-flex items-center text-label-md font-label-md text-primary font-bold hover:text-primary-container transition-colors"
                >
                  Learn More <I n="arrow_forward" c="text-[16px] ml-1" />
                </a>
              </div>
            ))}
          </div>
        </Sec>

        {/* 7 WINDOWS */}
        <Sec>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-lg items-center">
            <div className="lg:col-span-6 bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-xl overflow-hidden">
              <div className="bg-surface-container-high px-4 py-3 flex items-center justify-between border-b border-outline-variant">
                <div className="flex items-center gap-2">
                  <I n="window" c="text-primary text-[20px]" />
                  <span className="font-mono-code text-label-sm font-semibold text-on-surface">
                    Remote Desktop — WIN-SERVER-2025-EDITION
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-surface-variant border border-outline" />
                  <span className="w-3 h-3 rounded-sm bg-surface-variant border border-outline" />
                  <span className="w-3 h-3 rounded-sm bg-error/70" />
                </div>
              </div>
              <div className="p-space-lg bg-[#FAFCFA]">
                <div className="flex items-center justify-between mb-space-md p-3 bg-surface-container-lowest rounded-xl border border-outline-variant">
                  <div>
                    <span className="font-label-md text-label-md font-bold text-on-surface block">
                      Server Manager Dashboard
                    </span>
                    <span className="font-mono-code text-[11px] text-on-surface-variant">
                      OS: Windows Server 2025 Datacenter Edition
                    </span>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-secondary-container/40 text-secondary font-mono-code text-[11px] font-bold">
                    100% HEALTHY
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-space-sm mb-space-md font-mono-code text-body-sm">
                  <div className="p-3 bg-surface-container-lowest rounded-lg border border-outline-variant">
                    <span className="text-on-surface-variant text-[11px] block">
                      RDP Protocol Status
                    </span>
                    <span className="text-primary font-bold text-headline-sm">
                      Connected (TLS 1.3)
                    </span>
                    <span className="text-[10px] text-on-surface-variant mt-1 block">
                      Latency: 8.4 ms
                    </span>
                  </div>
                  <div className="p-3 bg-surface-container-lowest rounded-lg border border-outline-variant">
                    <span className="text-on-surface-variant text-[11px] block">
                      Dedicated Memory
                    </span>
                    <span className="text-on-surface font-bold text-headline-sm">
                      16.0 GB DDR4
                    </span>
                    <span className="text-[10px] text-primary-container font-semibold mt-1 block">
                      ECC Protected
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-surface-container-lowest rounded-lg border border-outline-variant">
                  <div className="flex justify-between text-body-sm font-mono-code mb-1">
                    <span>Processor Allocation (8 vCPU)</span>
                    <span className="text-primary-container font-bold">
                      14% Load
                    </span>
                  </div>
                  <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                    <div className="bg-primary-container h-full w-[14%]" />
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-6 flex flex-col gap-space-md">
              <Pill c="w-fit">Licensed Enterprise Platform</Pill>
              <h2 className="font-headline-xl text-headline-xl text-on-surface font-bold">
                Powerful Windows VPS for Your Business
              </h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
                Gain immediate access to clean, licensed Windows Server
                environments with crisp RDP streaming. Optimized for Office
                automation, trading software, and enterprise .NET suites.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm pt-space-xs font-body-md text-body-md text-on-surface">
                {winFeatures.map((f) => (
                  <Feat key={f} t={f} />
                ))}
              </div>
              <div className="pt-space-sm">
                <Btn>Explore Windows VPS</Btn>
              </div>
            </div>
          </div>
        </Sec>

        {/* 8 LINUX */}
        <Sec bg="bg-surface-container-low">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-lg items-center">
            <div className="lg:col-span-6 flex flex-col gap-space-md order-2 lg:order-1">
              <Pill c="w-fit">DevOps & Engineering Stack</Pill>
              <h2 className="font-headline-xl text-headline-xl text-on-surface font-bold">
                Flexible Linux VPS for Developers
              </h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
                Unleash full root terminal control with zero restrictions.
                Deploy native containers, custom microservices, and manage
                infrastructure dynamically using our REST API or CLI.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm pt-space-xs font-body-md text-body-md text-on-surface">
                {linuxFeatures.map((f) => (
                  <Feat key={f} t={f} />
                ))}
              </div>
              <div className="pt-space-sm">
                <Btn>Explore Linux VPS</Btn>
              </div>
            </div>
            <div className="lg:col-span-6 bg-[#171717] rounded-2xl p-space-md shadow-2xl border border-outline/30 order-1 lg:order-2">
              <div className="flex items-center justify-between pb-3 border-b border-outline/30 mb-space-sm">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-error/80" />
                  <span className="w-3 h-3 rounded-full bg-tertiary-fixed-dim" />
                  <span className="w-3 h-3 rounded-full bg-primary-container" />
                  <span className="font-mono-code text-[12px] text-surface-variant ml-2">
                    bash — root@primo-vps-fra:~
                  </span>
                </div>
                <span className="font-mono-code text-[11px] text-primary-container">
                  [ACTIVE 24/7]
                </span>
              </div>
              <div className="font-mono-code text-[13px] leading-relaxed text-surface-bright space-y-2">
                <div>
                  <span className="text-primary-container font-bold">
                    root@primo:~#
                  </span>
                  <span className="text-on-primary ml-1">
                    primo deploy vps-instance --cores=4 --ram=8G --dc=frankfurt
                  </span>
                </div>
                <div className="text-on-surface-variant text-[12px]">
                  [INFO] Allocating isolated KVM hypervisor thread...{" "}
                  <span className="text-primary-container">OK (0.3s)</span>
                  <br />
                  [INFO] Mounting 160GB NVMe Gen4 Block Device (/dev/nvme0n1)...{" "}
                  <span className="text-primary-container">DONE</span>
                  <br />
                  [INFO] Binding Dedicated IPv4: 194.26.229.84 [Anti-DDoS
                  Enabled]
                </div>
                <div>
                  <span className="text-primary-container font-bold">
                    root@primo:~#
                  </span>
                  <span className="text-on-primary ml-1">
                    docker compose up -d
                  </span>
                </div>
                <div className="text-primary-fixed-dim text-[12px]">
                  ✔ Container redis-prod Started [0.2s]
                  <br />✔ Container postgres-db Started [0.4s]
                  <br />✔ Container api-cluster Started [0.1s]
                </div>
                <div className="pt-2 flex items-center gap-2 text-primary-container font-bold">
                  <span>root@primo:~#</span>
                  <span className="w-2 h-4 bg-primary-container animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </Sec>

        {/* 9 FOREX */}
        <Sec>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-lg items-center">
            <div className="lg:col-span-6 flex flex-col gap-space-md">
              <Pill c="w-fit">Ultra-Low Latency Execution</Pill>
              <h2 className="font-headline-xl text-headline-xl text-on-surface font-bold">
                Trade Without Interruption
              </h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
                Engineered specifically for algorithmic traders, MT4/MT5
                auto-traders, and high-frequency Expert Advisor (EA) execution
                with sub-millisecond direct broker cross-connects.
              </p>
              <div className="grid grid-cols-2 gap-space-sm pt-space-xs font-body-sm text-body-sm">
                {forexFeatures.map(([n, t]) => (
                  <div
                    key={t}
                    className="p-3 rounded-xl bg-surface-container-low border border-outline-variant flex items-center gap-2"
                  >
                    <I n={n} c="text-primary-container" />
                    <span className="font-semibold text-on-surface">{t}</span>
                  </div>
                ))}
              </div>
              <div className="pt-space-sm">
                <Btn>Get Forex VPS</Btn>
              </div>
            </div>
            <div className="lg:col-span-6 bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-xl p-space-lg">
              <div className="flex items-center justify-between pb-space-sm border-b border-outline-variant mb-space-md">
                <div>
                  <span className="font-headline-sm text-headline-sm font-bold text-on-surface">
                    EUR / USD (H1)
                  </span>
                  <span className="font-mono-code text-[12px] text-primary-container block font-semibold">
                    1.08420 ▲ +0.42%
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-mono-code text-[11px] text-on-surface-variant block">
                    Broker Route
                  </span>
                  <span className="font-mono-code text-label-sm font-bold text-secondary">
                    Equinix LD4 (London)
                  </span>
                </div>
              </div>
              <div className="w-full py-2">
                <svg
                  className="w-full h-auto"
                  fill="none"
                  viewBox="0 0 400 160"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {[40, 80, 120].map((y) => (
                    <line
                      key={y}
                      x1="0"
                      x2="400"
                      y1={y}
                      y2={y}
                      stroke="#E2E8E5"
                      strokeDasharray="3 3"
                    />
                  ))}
                  {candles.map(([x, t, b, y, h, up]) => (
                    <g key={x}>
                      <line
                        x1={x}
                        x2={x}
                        y1={t}
                        y2={b}
                        stroke={up ? "#0BAF60" : "#6D7B6E"}
                        strokeWidth="1.5"
                      />
                      <rect
                        x={x - 6}
                        y={y}
                        width="12"
                        height={h}
                        rx="1"
                        fill={up ? "#0BAF60" : "#E2E8E5"}
                        stroke={up ? undefined : "#6D7B6E"}
                      />
                    </g>
                  ))}
                </svg>
              </div>
              <div className="mt-space-md p-space-sm rounded-xl bg-surface-container-low border border-outline-variant flex items-center justify-between font-mono-code text-body-sm">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary-container animate-pulse" />
                  <span className="text-on-surface font-semibold">
                    Latency to London Brokers
                  </span>
                </div>
                <span className="text-primary-container font-extrabold text-headline-sm">
                  0.82 ms
                </span>
              </div>
            </div>
          </div>
        </Sec>

        {/* 10 MANAGED */}
        <Sec bg="bg-surface-container-low">
          <Head
            pill="Hands-Off Operations"
            title="We Manage the Infrastructure. You Focus on Your Business."
            sub="Take advantage of end-to-end server orchestration, automated security patching, performance tuning, and 24/7 sysadmin oversight."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
            {managed.map(([n, t, d]) => (
              <div key={t} className={`p-space-lg ${cardHover}`}>
                <IconBox
                  n={n}
                  size="w-10 h-10 rounded-xl"
                  fs="text-[24px]"
                  mb="mb-space-sm"
                  col="text-primary"
                />
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

        {/* 11 SECURITY */}
        <Sec>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-lg items-center">
            <div className="lg:col-span-5 relative flex items-center justify-center">
              <div className="w-full max-w-md p-space-lg bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-xl text-center relative overflow-hidden">
                <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-primary-container/10 blur-2xl" />
                <div className="w-28 h-28 mx-auto rounded-full bg-secondary-container/30 border border-primary-container/30 flex items-center justify-center text-primary-container mb-space-md">
                  <I n="verified_user" c="text-[56px]" />
                </div>
                <h3 className="font-headline-md text-headline-md font-bold text-on-surface">
                  Zero-Trust Isolation
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                  Multi-layer physical & virtual perimeter protection
                </p>
                <div className="mt-space-md p-space-sm rounded-xl bg-surface-container-low border border-outline-variant font-mono-code text-body-sm space-y-2 text-left">
                  {[
                    [
                      "DDoS Scrubbing",
                      "1.2+ Tbps Active",
                      "text-primary-container",
                    ],
                    [
                      "Hardware Isolation",
                      "KVM Hypervisor",
                      "text-primary-container",
                    ],
                    ["Certifications", "ISO 27001 / SOC 2", "text-primary"],
                  ].map(([a, b, c]) => (
                    <div key={a} className="flex items-center justify-between">
                      <span className="text-on-surface">{a}</span>
                      <span className={`${c} font-bold`}>{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="lg:col-span-7 flex flex-col gap-space-md">
              <Pill c="w-fit">Bank-Grade Defense</Pill>
              <h2 className="font-headline-xl text-headline-xl text-on-surface font-bold">
                Built for Security. Designed for Reliability.
              </h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
                Every layer of PRIMO CLOUD infrastructure is audited and
                hardened against unauthorized intrusions, network degradation,
                and data vulnerability.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md pt-space-xs font-body-md text-body-md text-on-surface">
                {secItems.map(([t, d]) => (
                  <div key={t} className="flex items-start gap-2.5">
                    <I
                      n="verified"
                      c="text-primary-container text-[22px] shrink-0 mt-0.5"
                    />
                    <div>
                      <strong className="block text-on-surface">{t}</strong>
                      <span className="text-body-sm text-on-surface-variant">
                        {d}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Sec>

        {/* 12 CONSOLE */}
        <Sec bg="bg-surface-container-low">
          <Head
            pill="Cloud Console"
            title="Intuitive Management. Full Infrastructure Control."
            sub="Manage instances, monitor live telemetry, configure network policies, and spin up storage snapshots in seconds from our streamlined panel."
          />
          <div className="w-full bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-2xl overflow-hidden">
            <div className="px-space-lg py-space-md border-b border-outline-variant flex flex-wrap items-center justify-between gap-space-sm bg-surface-container-lowest">
              <div className="flex items-center gap-space-md">
                <span className="font-mono-code text-headline-sm font-bold text-on-surface">
                  srv-core-01.primo.net
                </span>
                <span className="inline-flex items-center gap-1.5 font-mono-code text-[12px] text-secondary bg-secondary-container/40 px-2.5 py-1 rounded-full font-bold">
                  <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse" />{" "}
                  Running
                </span>
              </div>
              <div className="flex items-center gap-space-lg font-mono-code text-body-sm text-on-surface-variant">
                <span>
                  Region:{" "}
                  <strong className="text-on-surface">Frankfurt DE</strong>
                </span>
                <span>
                  Uptime:{" "}
                  <strong className="text-on-surface">99.99% (84 days)</strong>
                </span>
                <span>
                  IP: <strong className="text-on-surface">194.26.229.84</strong>
                </span>
              </div>
            </div>
            <div className="px-space-lg py-space-sm bg-surface-container-low border-b border-outline-variant flex flex-wrap items-center gap-space-xs">
              {actions.map(([n, t, h, ic]) => (
                <button
                  key={t}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-lowest border border-outline-variant text-body-sm font-label-md text-on-surface ${h} transition-colors`}
                >
                  <I n={n} c={`text-[16px] ${ic}`} /> {t}
                </button>
              ))}
            </div>
            <div className="p-space-lg grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter border-b border-outline-variant">
              {gauges.map(([t, n, v, s, w]) => (
                <div
                  key={t}
                  className="p-space-md bg-surface-container-low rounded-xl border border-outline-variant flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-label-md text-label-md font-semibold text-on-surface-variant">
                      {t}
                    </span>
                    <I n={n} c="text-primary-container text-[20px]" />
                  </div>
                  <div className="my-space-sm flex items-baseline justify-between">
                    <span className="font-headline-lg text-headline-lg font-bold text-on-surface">
                      {v}
                    </span>
                    <span className="font-mono-code text-[12px] text-on-surface-variant">
                      {s}
                    </span>
                  </div>
                  <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-primary-container h-full"
                      style={{ width: w }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="p-space-lg">
              <h4 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-space-sm">
                Active Inbound Firewall Rules
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono-code text-body-sm">
                  <thead className="bg-surface-container-low text-on-surface-variant uppercase text-[11px] border-b border-outline-variant">
                    <tr>
                      {["Protocol", "Port", "Source", "Action", "Status"].map(
                        (h) => (
                          <th key={h} className="py-2.5 px-3">
                            {h}
                          </th>
                        ),
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant">
                    {fw.map(([p, port]) => (
                      <tr key={port}>
                        <td className="py-2.5 px-3 font-semibold">{p}</td>
                        <td className="py-2.5 px-3">{port}</td>
                        <td className="py-2.5 px-3">Anywhere (0.0.0.0/0)</td>
                        <td className="py-2.5 px-3 text-secondary font-bold">
                          ACCEPT
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="px-2 py-0.5 rounded bg-secondary-container/40 text-secondary text-[11px] font-bold">
                            ACTIVE
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </Sec>

        {/* 13 REVIEWS */}
        <Sec>
          <Head
            pill="Verified Reviews"
            title="Trusted by Businesses That Depend on Their Infrastructure"
            sub="Discover how enterprises, fintech developers, and digital agencies run their mission-critical apps with PRIMO CLOUD."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            {reviews.map(([i, n, r, t]) => (
              <div
                key={n}
                className="p-space-lg bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-sm relative flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 hover:border-primary-container/40 transition-all duration-300"
              >
                <div>
                  <div className="flex items-center gap-1 text-primary-container mb-space-sm">
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

        {/* 14 CTA */}
        <section className="w-full bg-gradient-to-r from-primary-container via-secondary to-primary-container bg-[length:200%_auto] animate-[shimmer_8s_linear_infinite] py-space-xl text-on-primary relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none flex items-center justify-center">
            <svg
              fill="none"
              height="400"
              stroke="currentColor"
              viewBox="0 0 800 400"
              width="800"
            >
              <path
                d="M0 100 H300 L350 150 H550 L600 100 H800"
                strokeWidth="2"
              />
              <path
                d="M0 300 H250 L300 250 H500 L550 300 H800"
                strokeWidth="2"
              />
              {[
                [350, 150],
                [550, 150],
                [300, 250],
                [500, 250],
              ].map(([x, y]) => (
                <circle key={x} cx={x} cy={y} r="6" fill="currentColor" />
              ))}
            </svg>
          </div>
          <span className="pointer-events-none absolute -left-10 top-6 h-40 w-40 rounded-full bg-white/10 animate-float" />
          <span className="pointer-events-none absolute -right-8 bottom-4 h-52 w-52 rounded-full bg-white/10 animate-float [animation-delay:1.5s]" />
          <div className="max-w-5xl mx-auto px-margin-mobile lg:px-margin text-center relative z-10">
            <h2 className="font-display-lg text-display-lg font-extrabold tracking-tight">
              Ready to Power Your Business?
            </h2>
            <p className="font-body-lg text-body-lg mt-space-sm max-w-2xl mx-auto opacity-95">
              Deploy your high-performance VPS with PRIMO CLOUD today. Instant
              provisioning in under 60 seconds with 24/7 dedicated support.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-space-md mt-space-lg">
              <a
                href="#vps-plans"
                className="font-label-lg text-label-lg bg-surface-container-lowest hover:bg-surface-bright text-secondary px-8 py-3.5 rounded-xl shadow-lg font-bold transition-all"
              >
                Get Started Now
              </a>
              <a
                href="#"
                className="font-label-lg text-label-lg border-2 border-surface-container-lowest text-on-primary hover:bg-surface-container-lowest/15 px-8 py-3.5 rounded-xl font-bold transition-all"
              >
                Contact Sales
              </a>
            </div>
            <p className="font-mono-code text-[12px] tracking-wide mt-space-md opacity-85">
              30-Day Money-Back Guarantee • Instant Activation • No Setup Fees
            </p>
          </div>
        </section>

        {/* 15 FAQ */}
        <Sec>
          <Head
            pill="Got Questions?"
            title="Frequently Asked Questions"
            sub="Everything you need to know about our virtual private servers, instant setup, security, and migration."
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
                        className="w-full p-space-md text-left flex items-center justify-between font-headline-sm text-label-lg font-bold text-on-surface"
                      >
                        <span>{q}</span>
                        <I
                          n="expand_more"
                          c={`text-primary-container transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
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
      </div>
      {/* <a
        href="/contact"
        aria-label="Live chat"
        className="fixed bottom-6 right-6 z-40 group flex items-center gap-2 rounded-full bg-gradient-to-r from-primary-container to-secondary text-on-primary px-4 py-3 shadow-xl shadow-primary-container/40 transition-all hover:-translate-y-1"
      >
        <span className="relative flex">
          <I n="chat" c="text-[22px]" />
          <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-white animate-ping" />
        </span>
        <span className="max-w-0 overflow-hidden whitespace-nowrap font-label-md text-label-md transition-all duration-300 group-hover:max-w-[120px]">
          Live chat
        </span>
      </a> */}
    </Layout>
  );
};

export default Homepage;
