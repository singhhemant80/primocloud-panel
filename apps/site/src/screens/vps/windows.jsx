import { orderUrl } from "../../lib/panel";
import React, { useState, useEffect, useRef } from "react";
import Layout from "../../components/layout";
import { useMotion, CountUp } from "../../components/motion";
import { useCurrency } from "../../context/CurrencyContext";
import { I, Pill, Sec, Head, cardHover, IconBox } from "../../components/ui";

// ---------- content (taken from the HTML design) ----------
const telemetry = [
  ["verified", "99.99%", "Uptime SLA Guarantee"],
  ["key", "Pre-Activated", "Genuine MS License"],
  ["network_ping", "< 10ms", "Global Tier-1 Latency"],
  ["lan", "1 - 10 Gbps", "Dedicated Redundant Uplink"],
];
const services = [
  ["Remote Desktop Service", "PORT 3389"],
  ["IIS Web Server 10.0", "HTTP/3"],
  ["Windows Defender Shield", "ACTIVE"],
  ["Hardware Virtualization", "HYPER-V"],
];
const pillars = [
  [
    "shield_person",
    "Full Administrator / Root Access",
    "Complete, unmetered control. Install custom .exe suites, configure IIS, host Docker for Windows, execute PowerShell scripts, and modify system registries without arbitrary hosting restrictions.",
    "Unlimited Software Installs",
  ],
  [
    "desktop_windows",
    "Ultra-Low Latency RDP & RemoteFX",
    "Experience crisp, tear-free 60 FPS remote desktop streaming over native Microsoft RDP or our clientless HTML5 web browser console, engineered for seamless desktop multitasking anywhere.",
    "60 FPS Hardware Acceleration",
  ],
  [
    "verified_user",
    "Pre-Activated Genuine Licenses",
    "Every instance comes pre-installed with legitimate Microsoft Windows Server Datacenter licensing. Zero monthly hidden activation fees, continuous automated security patches, and compliant SLA.",
    "Instant KMS Auto-Activation",
  ],
  [
    "storage",
    "Enterprise NVMe SSD RAID-10",
    "Bypass disk bottlenecks entirely. Enjoy up to 7,500 MB/s sustained sequential read speeds and hundreds of thousands of IOPS to power complex databases, accounting software, and heavy disk I/O.",
    "7,500 MB/s PCIe Gen4 Bus",
  ],
];
const plans = [
  {
    n: "Win-Basic", slug: "win-basic",
    tag: "Entry Node",
    d: "Perfect for basic administrative tools, light bots, and single-user remote workspace.",
    p: [12.99, 10.39],
    cta: "Deploy Win-Basic",
    s: [
      ["memory", "2 vCPU Cores", " @ 3.4GHz+"],
      ["developer_board", "4 GB", " DDR4 ECC RAM"],
      ["hard_drive", "60 GB", " Gen4 NVMe RAID-10"],
      ["sync_alt", "3 TB", " Bandwidth @ 1 Gbps"],
      ["dns", "", "1 Dedicated IPv4 Address"],
      ["lock", "", "Full Administrator Access"],
      ["check", "", "Windows Server 2022 / 2025"],
    ],
  },
  {
    n: "Win-Pro", slug: "win-pro",
    tag: "High Concurrency",
    feat: true,
    d: "Recommended for Forex MT4/MT5, multi-session RDP, and IIS microservices.",
    p: [24.99, 19.99],
    cta: "Deploy Win-Pro Now",
    s: [
      ["memory", "4 vCPU Cores", " @ 3.4GHz+"],
      ["developer_board", "8 GB", " DDR4 ECC RAM"],
      ["hard_drive", "120 GB", " Gen4 NVMe RAID-10"],
      ["sync_alt", "6 TB", " Bandwidth @ 1 Gbps"],
      ["dns", "", "1 Dedicated IPv4 + /64 IPv6"],
      ["backup", "", "Automated Daily Backups"],
      ["bolt", "", "Instant Reboot & 1-Click OS Reset"],
    ],
  },
  {
    n: "Win-Elite", slug: "win-elite",
    tag: "Enterprise Core",
    d: "Tailored for MSSQL servers, enterprise accounting (Tally/QuickBooks), and multi-tenant teams.",
    p: [48.99, 39.19],
    cta: "Deploy Win-Elite",
    s: [
      ["memory", "8 vCPU Cores", " @ 3.7GHz+"],
      ["developer_board", "16 GB", " DDR4/DDR5 ECC RAM"],
      ["hard_drive", "240 GB", " Gen4 NVMe RAID-10"],
      ["sync_alt", "10 TB", " Bandwidth @ 1 Gbps"],
      ["dns", "", "2 Dedicated IPv4 Addresses"],
      ["support_agent", "", "24/7 Priority SysAdmin Support"],
      ["security", "", "Enhanced Layer 7 DDoS Guard"],
    ],
  },
  {
    n: "Win-Extreme", slug: "win-extreme",
    tag: "Bare-Metal Power",
    d: "Heavy compute node for Hyper-V nested virtualization, large trading farms, and corporate ERP.",
    p: [89.99, 71.99],
    cta: "Deploy Win-Extreme",
    s: [
      ["memory", "16 vCPU Cores", " Dedicated Core"],
      ["developer_board", "32 GB", " DDR5 High-Speed RAM"],
      ["hard_drive", "500 GB", " Gen4 NVMe RAID-10"],
      ["all_inclusive", "Unmetered", " Transfer @ 10 Gbps"],
      ["dns", "", "3 Dedicated IPv4 Addresses"],
      ["hub", "", "Dedicated 10Gbps Uplink Port"],
      ["verified", "", "Dedicated TAM (Technical Mgr)"],
    ],
  },
];
const trust = [
  ["verified", "30-Day Money-Back Guarantee"],
  ["timer", "Instant Automated Delivery in < 60 Seconds"],
  ["credit_card_off", "Zero Setup Fees & Cancel Anytime"],
];
const why = [
  [
    "shield",
    "1.2+ Tbps Anti-DDoS Mitigation",
    "Always-on Layer 3, 4, and Layer 7 scrubbing handles UDP floods, SYN packets, and RDP brute-force flood attacks transparently with sub-second deflection.",
  ],
  [
    "speed",
    "Zero-Throttling Dedicated CPU Share",
    "Powered exclusively by top-tier AMD EPYC™ Gen4 high-frequency processors with guaranteed compute cycles. Never suffer from noisy neighbors stealing CPU clock cycles.",
  ],
  [
    "history",
    "1-Click Automated OS Reinstall & Snapshots",
    "Take live point-in-time image snapshots prior to risky Windows updates or software builds. Restore state or roll back cleanly with single-click precision.",
  ],
  [
    "language",
    "Clientless HTML5 Web Browser RDP",
    "Zero software setup required. Securely access your full Windows GUI console directly through Google Chrome, Safari, or Firefox on iPad, Mac, Chromebook, or mobile.",
  ],
  [
    "layers",
    "Hardware-Assisted Nested Virtualization",
    "Hardware virtualization pass-through is active on all nodes. Run Hyper-V sub-virtual machines, Docker Desktop (WSL2), or Android emulators directly within your VPS.",
  ],
  [
    "headset_mic",
    "24/7/365 Certified Windows Engineers",
    "Direct access to senior Windows Server administrators who understand Active Directory, RDS licensing, IIS routing, and complex network firewalls round the clock.",
  ],
];
const useCases = [
  [
    "trending_up",
    "Forex & Algorithmic Trading",
    "Keep MetaTrader 4 (MT4), MetaTrader 5 (MT5), cTrader, and Expert Advisors (EAs) running 24/7/365 without sleep cycles, domestic power outages, or ISP jitter. Cross-connected with London & New York broker liquidity hubs.",
    "timer",
    "0.5ms Execution Latency",
  ],
  [
    "domain",
    "Remote Work & Virtual Office",
    "Provide globally distributed employees and remote contractors with centralized, protected Windows workstations. Safeguard proprietary intellectual property from local hard drives with military-grade network isolation.",
    "lock",
    "Multi-User RDS Ready",
  ],
  [
    "code",
    ".NET & ASP.NET Web/API Hosting",
    "Deploy ASP.NET MVC, .NET 8 / 9 microservices, IIS Web Server 10, and Microsoft SQL Server databases with native Windows hypervisor performance and frictionless Windows PowerShell automation.",
    "dns",
    "Full IIS 10 + MSSQL Support",
  ],
  [
    "receipt_long",
    "Accounting & ERP Systems",
    "Host QuickBooks Enterprise, Tally Prime, Sage 50, SAP Business One, and custom accounting databases. Grant secure, concurrent multi-user access to CPAs and financial teams from anywhere.",
    "groups",
    "Seamless Multi-User Collaboration",
  ],
  [
    "smart_toy",
    "SEO Tools & Automation Bots",
    "Execute resource-heavy web crawlers, ScrapeBox, RankerX, GSA Search Engine Ranker, selenium browser test runners, and social automation without tying up local PC resources or overheating hardware.",
    "bolt",
    "Unmetered High-Bandwidth Uplink",
  ],
  [
    "folder_shared",
    "Corporate File & Backup Server",
    "Create a self-hosted, sovereign corporate storage repository using Windows File Sharing (SMB), FTPS, WebDAV, or Nextcloud for Windows. High NVMe speeds deliver lightning-fast sync speeds.",
    "cloud_sync",
    "BitLocker & AES-256 Storage",
  ],
];
const flavors = [
  [
    "laptop_windows",
    "LATEST 2025",
    true,
    "Windows Server 2025",
    "Datacenter Edition",
    [
      "Hotpatching without reboot",
      "SMB over QUIC acceleration",
      "Next-Gen Active Directory",
    ],
    "Ready in 45 Seconds",
  ],
  [
    "desktop_mac",
    "MOST STABLE",
    false,
    "Windows Server 2022",
    "Datacenter Edition",
    [
      "Secured-core server foundation",
      "Hardware root-of-trust TPM 2.0",
      "TLS 1.3 default encryption",
    ],
    "Ready in 45 Seconds",
  ],
  [
    "storage",
    "LEGACY READY",
    false,
    "Windows Server 2019",
    "Datacenter Edition",
    [
      "Maximum legacy app compatibility",
      "Low memory overhead footprint",
      "Extended enterprise lifecycle",
    ],
    "Ready in 45 Seconds",
  ],
  [
    "window",
    "CUSTOM PRO",
    false,
    "Windows 10 / 11 Pro",
    "Virtual Desktop Workspace",
    [
      "Native consumer UI desktop feel",
      "Optimized for desktop tools & games",
      "Bring-your-own-license support",
    ],
    "Ready in 60 Seconds",
  ],
];
const compare = [
  [
    "Processor Architecture",
    "AMD EPYC™ 9654 (Up to 3.7+ GHz)",
    "Older Intel Xeon E5 (Oversold)",
    "Shared Core Fractions",
  ],
  [
    "Storage Read / Write Speed",
    "Up to 7,500 MB/s (Gen4 NVMe)",
    "~450-550 MB/s (SATA SSD)",
    "Throttled HDD / SATA Array",
  ],
  [
    "Remote Desktop (RDP) Fluidity",
    "Smooth 60 FPS RemoteFX (4K Ready)",
    "Choppy 15-24 FPS Lag",
    "No RDP / Web UI Only",
  ],
  [
    "Windows Licensing Authenticity",
    "100% Genuine Pre-Activated Datacenter",
    "Trial 180-Day Reset Hacks",
    "N/A (Linux Shared Only)",
  ],
  [
    "DDoS Shield Capacity",
    "1.2+ Tbps Layer 3/4/7 Scrubbing",
    "Basic Null-Route (Blackhole)",
    "Zero Protection (Account Suspend)",
  ],
  [
    "Root / Admin Privileges",
    "100% Full Administrator Rights",
    "Restricted Admin Privileges",
    "No Admin Access",
  ],
  [
    "Support Response SLA",
    "< 15 Mins Certified Windows Eng.",
    "24-48 Hour Generic Tickets",
    "Automated Bot Support Only",
  ],
];
const portalActions = [
  ["open_in_browser", "Web RDP", true],
  ["restart_alt", "Reboot"],
  ["camera", "Snapshot"],
  ["security", "Firewall"],
  ["terminal", "VNC Rescue"],
];
const portalConfig = [
  ["dns", "Reverse DNS (rDNS)", "mail.yourdomain.com"],
  [
    "shield_with_heart",
    "Automated Daily Snapshot",
    "Last completed: 03:00 UTC (Healthy)",
  ],
  ["vpn_key", "RDP Security Profile", "NLA Enforced • TLS 1.3 Strict"],
];
const reviews = [
  [
    "DK",
    "David Kowalski",
    "IT Director, Apex Financial Group",
    '"We migrated 18 remote accounting workstations running QuickBooks and MS Access to Primo Cloud Win-Elite instances. RDP responsiveness feels as instantaneous as sitting in front of a local desktop. Zero crashes in 14 months."',
  ],
  [
    "SM",
    "Sergei Markov",
    "Head Quantitative Strategist, Kronos Algorithmic",
    '"For algorithmic trading, latency is everything. With their London datacenter connected straight to our broker liquidity bridge, ping stays at 0.9ms steady. Our MT5 automated strategies have zero slippage."',
  ],
  [
    "AL",
    "Amanda Lin",
    "Lead Cloud Architect, CloudCore Systems",
    '"Genuine Windows Server 2025 pre-activated right out of the box. No messing around with licensing keys, and the browser-based HTML5 RDP tool allowed our team to inspect nodes instantly while traveling."',
  ],
];
const faqs = [
  [
    "How do I connect to my Windows VPS after purchase?",
    'Within 60 seconds of checkout, you will receive your dedicated IPv4 address, default Administrator username, and a cryptographically secured root password. You can instantly connect using the native "Remote Desktop Connection" (mstsc.exe) on Windows, the Microsoft Remote Desktop app on macOS/iOS/Android, or through our one-click HTML5 browser console.',
  ],
  [
    "Are Windows Server licenses included in the monthly price?",
    "Yes. All Windows VPS instances come pre-activated with 100% genuine Microsoft Windows Server Datacenter licensing via our automated KMS keys. There are no additional per-core surcharges or hidden licensing fees on your monthly or annual invoice.",
  ],
  [
    "Can I run MetaTrader (MT4/MT5) and automated trading bots 24/7?",
    "Absolutely. Our Windows nodes are optimized specifically for high-availability Forex trading and algo execution. The server never shuts down, sleep states are disabled at the hypervisor level, and we offer direct cross-connects to financial centers in London (LD4), Frankfurt (FR2), and New York (NY4).",
  ],
  [
    "Do I have complete Administrator privileges to install third-party software?",
    "Yes, you get absolute, unrestricted Administrator rights. You can install custom executable binaries (.exe / .msi), deploy IIS modules, set up custom firewall rules, configure Docker containers, and run automated PowerShell administrative scripts.",
  ],
  [
    "Can I access my Windows VPS from macOS, Linux, iPad, or Android?",
    "Yes. Microsoft provides free native Remote Desktop clients for macOS, Linux, iOS, and Android. Alternatively, our Clientless Web RDP enables you to control your desktop inside any modern web browser without downloading any client software.",
  ],
  [
    "What happens if I lock myself out or misconfigure the Windows firewall?",
    "You will never be locked out. Every Primo Cloud server comes equipped with an out-of-band HTML5 VNC Rescue Console accessible right from the customer portal. This provides direct hardware-level screen access to fix firewall rules or reset passwords.",
  ],
  [
    "Can I upgrade my CPU, RAM, or NVMe storage without losing my data?",
    "Yes. You can scale seamlessly from Win-Basic to Win-Pro, Win-Elite, or Win-Extreme with a simple 1-click resize in your client dashboard. The underlying hypervisor dynamically expands your hardware resources and disk volumes without altering existing installations.",
  ],
  [
    "Do you provide automated backups and disaster recovery snapshots?",
    "Yes, our Win-Pro, Win-Elite, and Win-Extreme plans feature daily snapshot backups stored on physically separate storage clusters. You can also generate immediate manual snapshots before undertaking major software updates.",
  ],
  [
    "Is nested virtualization (Hyper-V, WSL2, Docker) supported?",
    "Yes. All our KVM nodes have hardware virtualization flags (VT-x / AMD-V) passed directly into your virtual machine, allowing you to run Hyper-V roles, WSL2 (Windows Subsystem for Linux), and container engines without friction.",
  ],
  [
    "Where are your Windows VPS datacenters located?",
    "We operate in premier Tier IV enterprise datacenter facilities across Frankfurt (Germany), London (United Kingdom), New York & Dallas (USA), Singapore, and Tokyo (Japan), each linked to Tier-1 transit providers for ultra-low latency worldwide.",
  ],
];

// slightly moving "live" numbers
const useJitter = (base, spread, ms = 1600, dec = 1) => {
  const [v, setV] = useState(base);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(
      () => setV(+(base + (Math.random() - 0.5) * spread * 2).toFixed(dec)),
      ms,
    );
    return () => clearInterval(t);
  }, [base, spread, ms, dec]);
  return v;
};

const Gauge = ({ label, value, pct, note, on }) => (
  <div className="bg-surface-container-lowest p-space-md rounded-xl border border-outline-variant shadow-sm">
    <div className="flex items-center justify-between mb-space-xs">
      <span className="font-label-md text-label-md text-on-surface-variant">
        {label}
      </span>
      <span className="font-mono-code text-label-sm text-primary font-bold">
        {value}
      </span>
    </div>
    <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
      <div
        className="h-full bg-gradient-to-r from-primary-container to-secondary rounded-full transition-[width] duration-1000 ease-out"
        style={{ width: on ? `${pct}%` : "0%" }}
      />
    </div>
    <span className="font-mono-code text-body-sm text-on-surface-variant mt-2 block">
      {note}
    </span>
  </div>
);

const Windows = () => {
  const rootRef = useRef(null);
  useMotion(rootRef);
  const { fmt } = useCurrency();
  const [yearly, setYearly] = useState(false);
  const [on, setOn] = useState(false);
  const cpu = useJitter(14.2, 3);
  const iops = useJitter(14820, 900, 1800, 0);
  useEffect(() => {
    const t = setTimeout(() => setOn(true), 300);
    return () => clearTimeout(t);
  }, []);
  const tab =
    "px-5 py-1.5 rounded-full font-label-md text-label-md transition-all";

  return (
    <Layout>
      <div ref={rootRef} className="flex flex-col w-full">
        {/* 1 HERO */}
        <section className="relative w-full bg-gradient-to-b from-surface-container-lowest via-surface to-surface py-space-lg lg:py-12 overflow-hidden">
          <div className="pointer-events-none absolute -top-40 right-0 h-96 w-96 rounded-full bg-primary-container/10 blur-3xl" />
          <div className="pointer-events-none absolute top-1/3 left-0 h-80 w-80 rounded-full bg-secondary-container/20 blur-3xl" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,rgba(11,175,96,0.18)_1px,transparent_1px)] bg-[size:28px_28px] [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_70%)]" />
          <div className="relative max-w-7xl mx-auto px-margin-mobile lg:px-margin flex flex-col items-center">
            <div className="inline-flex items-center gap-space-xs px-3.5 py-1.5 rounded-full bg-secondary-container/30 border border-primary-container/30 mb-space-lg text-center">
              <I n="bolt" c="text-[16px] text-primary" />
              <span className="font-mono-code text-label-sm uppercase tracking-wide font-semibold text-primary">
                Pure NVMe Gen4 • Licensed Windows Server 2025/2022 • Instant RDP
                Deployment
              </span>
            </div>
            <div className="max-w-4xl text-center flex flex-col gap-space-md">
              <h1 className="font-headline-xl text-headline-xl lg:font-display-lg lg:text-display-lg text-on-surface tracking-tight font-extrabold">
                Ultra-Fast, Dedicated{" "}
                <span className="text-primary underline decoration-primary-container decoration-4 underline-offset-8">
                  Windows VPS
                </span>{" "}
                with Full Administrator Access
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-3xl mx-auto leading-relaxed">
                Deploy enterprise Windows Server environments optimized for
                remote desktop (RDP), Forex trading, .NET microservices,
                accounting apps, and high-performance corporate workloads.
                Instant provisioning in under 60 seconds.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-gutter sm:gap-space-md mt-space-lg">
              <a
                href="#pricing-matrix"
                className="group relative overflow-hidden inline-flex items-center gap-space-xs px-7 py-3.5 rounded-xl bg-gradient-to-r from-primary-container to-secondary text-on-primary font-label-lg text-label-lg shadow-md shadow-primary-container/30 transition-all hover:shadow-lg hover:-translate-y-0.5 before:absolute before:inset-y-0 before:-left-full before:w-1/2 before:skew-x-[-20deg] before:bg-white/30 hover:before:left-[150%] before:transition-all before:duration-700"
              >
                <I n="rocket_launch" c="text-[20px]" />
                Deploy Windows VPS
              </a>
              <a
                href="#comparison-matrix"
                className="inline-flex items-center gap-space-xs px-7 py-3.5 rounded-xl bg-surface-container-lowest border border-outline-variant text-on-surface hover:bg-secondary-container/20 hover:border-primary-container/50 font-label-lg text-label-lg shadow-sm transition-all"
              >
                <I n="speed" c="text-[20px] text-primary" />
                Compare Configurations
              </a>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-space-md w-full max-w-4xl mt-space-xl text-center">
              {telemetry.map(([n, v, l]) => (
                <div
                  key={l}
                  className="bg-surface-container-lowest border border-outline-variant rounded-xl p-space-md shadow-sm flex flex-col items-center justify-center transition-all hover:-translate-y-1 hover:shadow-lg hover:border-primary-container/40"
                >
                  <div className="flex items-center gap-space-xs text-primary mb-0.5">
                    <I n={n} c="text-[20px]" />
                    <span className="font-headline-sm text-headline-sm font-bold text-on-surface">
                      {v}
                    </span>
                  </div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                    {l}
                  </span>
                </div>
              ))}
            </div>

            {/* RDP window */}
            <div className="w-full max-w-5xl mt-space-xl bg-surface-container-lowest rounded-xl border border-outline-variant shadow-2xl shadow-primary/10 overflow-hidden animate-float">
              <div className="bg-inverse-surface px-space-md py-space-sm flex items-center justify-between text-inverse-on-surface">
                <div className="flex items-center gap-space-sm">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-error" />
                    <span className="w-3 h-3 rounded-full bg-secondary-fixed" />
                    <span className="w-3 h-3 rounded-full bg-primary-container" />
                  </div>
                  <span className="font-mono-code text-label-sm text-inverse-on-surface/80 hidden sm:inline">
                    rdp.primo-fra1.node-394.primo.cloud:3389 [Administrator]
                  </span>
                </div>
                <div className="flex items-center gap-space-md">
                  <span className="inline-flex items-center gap-1 font-mono-code text-label-sm bg-primary-container/20 text-tertiary-fixed px-2 py-0.5 rounded">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-container animate-pulse" />{" "}
                    TLS 1.3 • 4K 60FPS
                  </span>
                  <I
                    n="close_fullscreen"
                    c="text-[18px] text-inverse-on-surface/60"
                  />
                </div>
              </div>
              <div className="p-space-lg bg-surface-container-low flex flex-col lg:flex-row gap-space-lg">
                <div className="flex-1 flex flex-col gap-space-md min-w-0">
                  <div className="bg-surface-container-lowest border border-outline-variant p-space-md rounded-xl shadow-sm flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-space-md">
                      <div className="w-10 h-10 rounded-lg bg-primary-container/10 flex items-center justify-center text-primary">
                        <I n="terminal" c="text-[24px]" />
                      </div>
                      <div>
                        <h4 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                          Windows Server 2025 Datacenter
                        </h4>
                        <p className="font-mono-code text-body-sm text-on-surface-variant">
                          Cluster Host: AMD EPYC™ 9654 • 64-bit Architecture
                        </p>
                      </div>
                    </div>
                    <span className="bg-secondary-container/40 text-on-secondary-container font-label-sm text-label-sm px-2.5 py-1 rounded-full uppercase font-bold">
                      Activated & Managed
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-md">
                    <Gauge
                      on={on}
                      label="vCPU Core Utilization"
                      value={`${cpu}%`}
                      pct={cpu}
                      note="3.70 GHz Base Clock"
                    />
                    <Gauge
                      on={on}
                      label="DDR5 ECC Memory"
                      value="2.4 / 16 GB"
                      pct={15}
                      note="4800 MHz Quad-Channel"
                    />
                    <Gauge
                      on={on}
                      label="NVMe RAID-10 I/O"
                      value="7,240 MB/s"
                      pct={92}
                      note="0.02ms Read Latency"
                    />
                  </div>
                  <div className="bg-inverse-surface text-inverse-on-surface p-space-md rounded-xl font-mono-code text-body-sm shadow-inner flex flex-col gap-1 overflow-x-auto">
                    <div className="flex items-center justify-between pb-1 border-b border-outline-variant/30">
                      <span className="text-tertiary-fixed text-label-sm">
                        Windows PowerShell v7.4.5 (Core)
                      </span>
                      <span className="text-label-sm text-inverse-on-surface/50">
                        Elevated Administrator
                      </span>
                    </div>
                    <p className="text-inverse-on-surface/70 mt-1 whitespace-nowrap">
                      PS C:\Users\Administrator&gt; Get-Service -Name W3SVC,
                      MSSQLSERVER | Select Status, Name
                    </p>
                    <p className="text-primary-fixed whitespace-nowrap">
                      Status: Running | Name: W3SVC (World Wide Web Publishing
                      Service)
                    </p>
                    <p className="text-primary-fixed whitespace-nowrap">
                      Status: Running | Name: MSSQLSERVER (SQL Server 2022
                      Instance)
                    </p>
                    <p className="text-inverse-on-surface/70 whitespace-nowrap">
                      PS C:\Users\Administrator&gt; Test-NetConnection
                      -ComputerName fx-broker.ld4.eqx -Port 443 | Select
                      PingSucceeded, RoundTripTimeMillisec
                    </p>
                    <p className="text-secondary-fixed whitespace-nowrap">
                      PingSucceeded: True | RoundTripTimeMillisec: 0.82 ms
                      (Equinix LD4 Ultra-Low Cross-Connect)
                    </p>
                    <p className="text-inverse-on-surface/70 flex items-center gap-1">
                      PS C:\Users\Administrator&gt;
                      <span className="inline-block w-2 h-4 bg-primary-container animate-pulse" />
                    </p>
                  </div>
                </div>
                <div className="lg:w-80 flex flex-col gap-space-md">
                  <div className="bg-surface-container-lowest border border-outline-variant p-space-md rounded-xl shadow-sm">
                    <span className="font-label-md text-label-md text-on-surface-variant mb-space-xs uppercase tracking-wider block">
                      Active Services Status
                    </span>
                    <div className="flex flex-col gap-2 mt-1">
                      {services.map(([s, t], i) => (
                        <div
                          key={s}
                          className={`flex items-center justify-between py-1 ${i < 3 ? "border-b border-outline-variant/20" : ""}`}
                        >
                          <span className="font-body-md text-body-md text-on-surface flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse" />
                            {s}
                          </span>
                          <span className="font-mono-code text-label-sm text-primary">
                            {t}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-primary/5 border border-primary/10 rounded-xl p-space-md flex flex-col gap-1">
                    <span className="font-label-sm text-label-sm text-primary uppercase font-bold">
                      Datacenter Provisioning Matrix
                    </span>
                    <span className="font-headline-sm text-headline-sm font-bold text-on-surface">
                      Frankfurt FRA-1 Tier IV
                    </span>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Connected with ISO 27001 certified physical isolation,
                      dual redundant PDU power feeds, and biometric cage
                      security.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2 PILLARS */}
        <Sec bg="bg-surface-container-lowest">
          <Head
            pill="Engineered For Zero Bottlenecks"
            title="Uncompromised Windows Cloud Architecture"
            sub="Built exclusively on dedicated AMD EPYC server hardware with raw enterprise storage and direct administrator credentials."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
            {pillars.map(([n, t, d, f]) => (
              <div key={t} className={`p-space-lg flex flex-col ${cardHover}`}>
                <IconBox n={n} size="w-12 h-12 rounded-xl" fs="text-[28px]" />
                <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-space-xs">
                  {t}
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed mb-space-md flex-1">
                  {d}
                </p>
                <div className="font-label-sm text-label-sm text-primary font-bold flex items-center gap-1">
                  <I n="check_circle" c="text-[16px]" />
                  {f}
                </div>
              </div>
            ))}
          </div>
        </Sec>

        {/* 3 PRICING */}
        <Sec id="pricing-matrix">
          <div className="flex flex-col items-center text-center mb-space-lg">
            <Pill>Transparent Cloud Pricing</Pill>
            <h2 className="font-headline-xl text-headline-xl text-on-surface font-bold mt-space-sm">
              Flexible Windows Server Compute Plans
            </h2>
            <div className="mx-auto mt-space-sm h-1 w-16 rounded-full bg-gradient-to-r from-primary-container to-secondary" />
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl mt-space-sm">
              Pre-activated licenses included in every package. Instant
              provisioning with zero setup charges.
            </p>
            <div className="mt-space-md inline-flex items-center gap-space-sm bg-surface-container-high p-1.5 rounded-full shadow-inner">
              <button
                type="button"
                onClick={() => setYearly(false)}
                className={`${tab} ${!yearly ? "bg-surface-container-lowest text-on-surface font-bold shadow-sm" : "text-on-surface-variant hover:text-on-surface"}`}
              >
                Monthly Billing
              </button>
              <button
                type="button"
                onClick={() => setYearly(true)}
                className={`${tab} flex items-center gap-1.5 ${yearly ? "bg-surface-container-lowest text-on-surface font-bold shadow-sm" : "text-on-surface-variant hover:text-on-surface"}`}
              >
                Annual Billing{" "}
                <span className="bg-primary-container text-on-primary text-[10px] px-2 py-0.5 rounded-full font-bold">
                  SAVE 20%
                </span>
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter items-stretch">
            {plans.map((p) => (
              <div
                key={p.n}
                className={`flex flex-col justify-between rounded-xl p-space-lg ${p.feat ? "relative ring-2 ring-primary shadow-2xl shadow-primary-container/25 transform lg:-translate-y-2 bg-gradient-to-b from-secondary-container/20 to-surface-container-lowest" : "bg-surface-container-lowest border border-outline-variant shadow-sm hover:shadow-xl hover:border-primary-container/40 transition-all duration-300"}`}
              >
                {p.feat && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-primary text-on-primary font-mono-code text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow whitespace-nowrap">
                    Most Popular • Optimal Value
                  </div>
                )}
                <div>
                  <div
                    className={`flex items-center justify-between gap-2 mb-space-xs ${p.feat ? "mt-1" : ""}`}
                  >
                    <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                      {p.n}
                    </h3>
                    <span
                      className={`font-mono-code text-label-sm px-2 py-0.5 rounded ${p.feat ? "bg-primary/10 text-primary font-bold" : "bg-surface-container text-on-surface-variant"}`}
                    >
                      {p.tag}
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
                    {p.d}
                  </p>
                  <div className="flex items-baseline gap-1 mb-space-lg">
                    <span
                      className={`font-headline-xl text-headline-xl font-extrabold ${p.feat ? "text-primary" : "text-on-surface"}`}
                    >
                      {fmt(p.p[yearly ? 1 : 0])}
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      /month
                    </span>
                  </div>
                  <div className="flex flex-col gap-space-sm border-t border-outline-variant/30 pt-space-md mb-space-lg text-body-sm">
                    {p.s.map(([ic, b, r]) => (
                      <div
                        key={ic + b + r}
                        className="flex items-center gap-2 text-on-surface"
                      >
                        <I n={ic} c="text-[18px] text-primary" />
                        <span>
                          {b && <strong>{b}</strong>}
                          {r}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <a
                  href={/^Contact/.test(p.cta ?? "") ? "/contact" : orderUrl(p.slug, yearly)}
                  className={`w-full py-3 rounded-xl text-center font-label-md text-label-md transition-all ${p.feat ? "bg-gradient-to-r from-primary-container to-secondary text-on-primary font-bold shadow-md shadow-primary-container/30 hover:-translate-y-0.5" : "bg-surface-container hover:bg-primary-container hover:text-on-primary text-on-surface"}`}
                >
                  {p.cta}
                </a>
              </div>
            ))}
          </div>
          <div className="mt-space-lg bg-surface-container-low border border-outline-variant rounded-xl p-space-md flex flex-wrap items-center justify-around gap-space-md text-on-surface-variant text-center">
            {trust.map(([n, t]) => (
              <span
                key={t}
                className="font-body-md text-body-md flex items-center gap-2"
              >
                <I n={n} c="text-primary text-[20px]" />
                {t}
              </span>
            ))}
          </div>
        </Sec>

        {/* 4 WHY */}
        <Sec bg="bg-surface-container-lowest">
          <Head
            pill="Engineering Excellence"
            title="Why Demanding Professionals Choose Primo Cloud"
            sub="Built from the ground up to eradicate latency, throttle, and licensing complications from enterprise Windows hosting."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
            {why.map(([n, t, d]) => (
              <div key={t} className={`p-space-lg ${cardHover}`}>
                <IconBox n={n} size="w-12 h-12 rounded-xl" fs="text-[28px]" />
                <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-space-xs">
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
            pill="Versatile Cloud Deployment"
            title="Engineered for Mission-Critical Workloads"
            sub="Discover how enterprises, developers, and power users rely on Primo Cloud Windows VPS every single day."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
            {useCases.map(([n, t, d, fi, ft]) => (
              <div
                key={t}
                className={`p-space-lg flex flex-col justify-between ${cardHover}`}
              >
                <div>
                  <IconBox n={n} size="w-10 h-10 rounded-lg" fs="text-[24px]" />
                  <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-space-xs">
                    {t}
                  </h3>
                  <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed mb-space-md">
                    {d}
                  </p>
                </div>
                <div className="flex items-center gap-space-xs font-mono-code text-label-sm text-primary font-bold">
                  <I n={fi} c="text-[16px]" />
                  {ft}
                </div>
              </div>
            ))}
          </div>
        </Sec>

        {/* 6 FLAVORS */}
        <Sec bg="bg-surface-container-lowest">
          <Head
            pill="Official Distribution Templates"
            title="Select Your Preferred Windows Flavor"
            sub="Deploy any certified release with 1-click. Switch between editions anytime via your Primo Cloud management console."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
            {flavors.map(([n, badge, hot, t, sub, list, ready]) => (
              <div
                key={t}
                className={`p-space-lg flex flex-col justify-between ${cardHover}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-space-sm">
                    <I n={n} c="text-primary text-[32px]" />
                    <span
                      className={`font-mono-code text-[11px] font-bold px-2 py-0.5 rounded ${hot ? "bg-primary/10 text-primary" : "bg-surface-container-high text-on-surface"}`}
                    >
                      {badge}
                    </span>
                  </div>
                  <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-space-xs">
                    {t}
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
                    {sub}
                  </p>
                  <ul className="flex flex-col gap-2 font-body-sm text-body-sm text-on-surface-variant mb-space-md">
                    {list.map((x) => (
                      <li key={x} className="flex items-center gap-1.5">
                        <I n="check" c="text-[16px] text-primary" />
                        {x}
                      </li>
                    ))}
                  </ul>
                </div>
                <span className="font-mono-code text-label-sm text-primary font-semibold flex items-center gap-1">
                  <I n="timer" c="text-[14px]" />
                  {ready}
                </span>
              </div>
            ))}
          </div>
        </Sec>

        {/* 7 COMPARISON */}
        <Sec id="comparison-matrix">
          <Head
            pill="Objective Benchmark Analysis"
            title="How Primo Cloud Compares to the Competition"
            sub="See why enterprise infrastructure architects prefer our dedicated NVMe fabrics over oversold budget virtualization."
          />
          <div className="overflow-x-auto shadow-xl rounded-xl bg-surface-container-lowest border border-outline-variant">
            <table className="w-full min-w-[760px] text-left border-collapse">
              <thead>
                <tr className="text-on-surface border-b border-outline-variant/30">
                  <th className="py-space-md px-space-lg font-headline-sm text-headline-sm bg-surface-container-low">
                    Performance Vector
                  </th>
                  <th className="py-space-md px-space-lg font-headline-sm text-headline-sm bg-gradient-to-r from-primary-container to-secondary text-on-primary">
                    <span className="flex items-center gap-2">
                      <I n="star" c="text-[20px]" />
                      PRIMO CLOUD Windows VPS
                    </span>
                  </th>
                  <th className="py-space-md px-space-lg font-headline-sm text-headline-sm text-on-surface-variant bg-surface-container-low">
                    Budget Commodity VPS
                  </th>
                  <th className="py-space-md px-space-lg font-headline-sm text-headline-sm text-on-surface-variant bg-surface-container-low">
                    Standard Shared Hosting
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20 font-body-md text-body-md">
                {compare.map(([a, b, c, d]) => (
                  <tr
                    key={a}
                    className="hover:bg-secondary-container/10 transition-colors"
                  >
                    <td className="py-space-md px-space-lg font-bold text-on-surface">
                      {a}
                    </td>
                    <td className="py-space-md px-space-lg bg-primary/5 text-primary font-bold">
                      <span className="flex items-center gap-2">
                        <I
                          n="check_circle"
                          c="text-[18px] text-primary-container shrink-0"
                        />
                        {b}
                      </span>
                    </td>
                    <td className="py-space-md px-space-lg text-on-surface-variant">
                      {c}
                    </td>
                    <td className="py-space-md px-space-lg text-on-surface-variant">
                      {d}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Sec>

        {/* 8 PORTAL */}
        <Sec bg="bg-surface-container-lowest">
          <Head
            pill="Unified Cloud Control Panel"
            title="Enterprise Management at Your Fingertips"
            sub="Take total control of your Windows infrastructure from an intuitive, single-pane web console."
          />
          <div className="bg-surface rounded-xl border border-outline-variant shadow-2xl p-space-lg">
            <div className="flex flex-wrap items-center justify-between gap-space-md pb-space-md border-b border-outline-variant/30">
              <div className="flex items-center gap-space-md">
                <div className="w-3.5 h-3.5 rounded-full bg-primary-container animate-pulse" />
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-headline-sm text-headline-sm font-bold text-on-surface">
                      win-vps-fra04.primo.internal
                    </span>
                    <span className="font-mono-code text-[11px] bg-secondary-container/40 text-on-secondary-container font-bold px-2 py-0.5 rounded">
                      ONLINE
                    </span>
                  </div>
                  <span className="font-mono-code text-body-sm text-on-surface-variant">
                    IP: 185.122.94.210 • Gateway: 185.122.94.1 • Datacenter:
                    Frankfurt FRA-1
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-space-xs">
                {portalActions.map(([n, t, primary]) => (
                  <button
                    key={t}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 font-label-sm text-label-sm rounded-lg transition-colors ${primary ? "bg-primary-container hover:bg-secondary text-on-primary shadow-sm" : "bg-surface-container hover:bg-surface-container-high text-on-surface"}`}
                  >
                    <I n={n} c="text-[16px]" />
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-space-md my-space-lg">
              <div className="bg-surface-container-lowest border border-outline-variant p-space-md rounded-xl shadow-sm">
                <div className="flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm mb-1">
                  <span>CPU LOAD (4 Cores)</span>
                  <span className="font-mono-code text-primary font-bold">
                    18%
                  </span>
                </div>
                <svg
                  className="w-full h-10 text-primary"
                  fill="none"
                  viewBox="0 0 100 30"
                >
                  <path
                    d="M0 25 L15 22 L30 26 L45 15 L60 18 L75 10 L90 14 L100 8"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeWidth="2"
                  />
                </svg>
                <div className="flex justify-between text-on-surface-variant text-[11px] font-mono-code mt-1">
                  <span>Peak: 42%</span>
                  <span>Avg: 18%</span>
                </div>
              </div>
              <div className="bg-surface-container-lowest border border-outline-variant p-space-md rounded-xl shadow-sm">
                <div className="flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm mb-1">
                  <span>RAM USAGE</span>
                  <span className="font-mono-code text-primary font-bold">
                    3.2 / 8.0 GB
                  </span>
                </div>
                <div className="h-2 w-full bg-surface-container-high rounded-full overflow-hidden my-3">
                  <div
                    className="h-full bg-gradient-to-r from-primary-container to-secondary rounded-full"
                    style={{ width: "40%" }}
                  />
                </div>
                <div className="flex justify-between text-on-surface-variant text-[11px] font-mono-code">
                  <span>4.8 GB Free</span>
                  <span>Commit: 40%</span>
                </div>
              </div>
              <div className="bg-surface-container-lowest border border-outline-variant p-space-md rounded-xl shadow-sm">
                <div className="flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm mb-1">
                  <span>DISK IOPS (NVMe)</span>
                  <span className="font-mono-code text-primary font-bold">
                    {iops.toLocaleString()} IOPS
                  </span>
                </div>
                <svg
                  className="w-full h-10 text-primary"
                  fill="none"
                  viewBox="0 0 100 30"
                >
                  <path
                    d="M0 20 L20 18 L40 10 L60 22 L80 14 L100 12"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeWidth="2"
                  />
                </svg>
                <div className="flex justify-between text-on-surface-variant text-[11px] font-mono-code mt-1">
                  <span>Queue: 0.01</span>
                  <span>Latency: 0.1ms</span>
                </div>
              </div>
              <div className="bg-surface-container-lowest border border-outline-variant p-space-md rounded-xl shadow-sm">
                <div className="flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm mb-1">
                  <span>BANDWIDTH IN/OUT</span>
                  <span className="font-mono-code text-primary font-bold">
                    148 Mbps
                  </span>
                </div>
                <div className="h-2 w-full bg-surface-container-high rounded-full overflow-hidden my-3">
                  <div
                    className="h-full bg-gradient-to-r from-primary-container to-secondary rounded-full"
                    style={{ width: "15%" }}
                  />
                </div>
                <div className="flex justify-between text-on-surface-variant text-[11px] font-mono-code">
                  <span>Total: 842 GB / 6 TB</span>
                  <span>Uplink: 1 Gbps</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md pt-space-md border-t border-outline-variant/30 text-body-sm">
              {portalConfig.map(([n, t, s]) => (
                <div key={t} className="flex items-center gap-space-sm">
                  <I n={n} c="text-[20px] text-primary" />
                  <div>
                    <span className="font-bold text-on-surface block">{t}</span>
                    <span className="font-mono-code text-on-surface-variant text-[12px]">
                      {s}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Sec>

        {/* 9 TESTIMONIALS */}
        <Sec>
          <Head
            pill="Real Administrator Experiences"
            title="Trusted by Systems Engineers and Quant Traders"
            sub="Discover why over 14,000+ businesses run their mission-critical Windows workloads on Primo Cloud."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            {reviews.map(([i, n, r, t]) => (
              <div
                key={n}
                className="bg-surface-container-lowest border border-outline-variant rounded-xl p-space-lg shadow-sm relative flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 hover:border-primary-container/40 transition-all duration-300"
              >
                <div>
                  <div className="flex items-center gap-1 text-primary mb-space-sm">
                    {[...Array(5)].map((_, k) => (
                      <I key={k} n="star" c="text-[18px]" />
                    ))}
                  </div>
                  <I
                    n="format_quote"
                    c="absolute top-4 right-5 text-[56px] text-primary-container/15"
                  />
                  <p className="relative font-body-md text-body-md text-on-surface leading-relaxed mb-space-md">
                    {t}
                  </p>
                </div>
                <div className="flex items-center gap-space-sm border-t border-outline-variant/30 pt-space-md">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-container to-secondary flex items-center justify-center font-bold text-on-primary font-headline-sm">
                    {i}
                  </div>
                  <div>
                    <span className="flex items-center gap-1 font-bold text-on-surface font-label-md text-label-md">
                      {n}
                      <I n="verified" c="text-[16px] text-primary-container" />
                    </span>
                    <span className="text-on-surface-variant font-body-sm text-body-sm">
                      {r}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Sec>

        {/* 10 FAQ */}
        <Sec bg="bg-surface-container-lowest">
          <Head
            pill="Answers to Key Questions"
            title="Frequently Asked Questions"
            sub="Everything you need to know about our enterprise Windows VPS architecture."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg">
            {faqs.map(([q, a], i) => (
              <div key={q} className={`p-space-lg ${cardHover}`}>
                <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-space-xs flex items-start gap-2">
                  <span className="text-primary font-mono-code font-bold">
                    {String(i + 1).padStart(2, "0")}.
                  </span>
                  {q}
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed pl-8">
                  {a}
                </p>
              </div>
            ))}
          </div>
        </Sec>

        {/* 11 CTA */}
        <section className="w-full bg-gradient-to-r from-primary via-secondary to-primary-container bg-[length:200%_auto] animate-[shimmer_8s_linear_infinite] py-space-xl text-on-primary relative overflow-hidden">
          <span className="pointer-events-none absolute -left-10 top-6 h-40 w-40 rounded-full bg-white/10 animate-float" />
          <span className="pointer-events-none absolute -right-8 bottom-4 h-52 w-52 rounded-full bg-white/10 animate-float [animation-delay:1.5s]" />
          <div className="relative max-w-5xl mx-auto px-margin-mobile lg:px-margin text-center flex flex-col items-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-on-primary/10 text-on-primary font-mono-code text-label-sm uppercase font-semibold mb-space-md">
              <span className="w-2 h-2 rounded-full bg-tertiary-fixed animate-pulse" />
              Instant Automated Setup Under 60 Seconds
            </span>
            <h2 className="font-headline-xl text-headline-xl lg:font-display-lg lg:text-display-lg font-extrabold tracking-tight mb-space-md">
              Ready to Supercharge Your Windows Workloads?
            </h2>
            <p className="font-body-lg text-body-lg text-on-primary/90 max-w-2xl mb-space-lg leading-relaxed">
              Deploy your high-performance Windows VPS with genuine licensing
              and instant RDP in under 60 seconds. Experience pure NVMe Gen4
              speed backed by our 99.99% uptime SLA.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-gutter sm:gap-space-md mb-space-lg">
              <a
                href="#pricing-matrix"
                className="inline-flex items-center gap-space-xs px-8 py-4 rounded-xl bg-surface-container-lowest hover:bg-surface text-primary font-label-lg text-label-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all font-bold"
              >
                <I n="bolt" c="text-[20px] text-primary" />
                Deploy Windows VPS Now
              </a>
              <a
                href="/contact"
                className="inline-flex items-center gap-space-xs px-8 py-4 rounded-xl bg-on-primary/10 hover:bg-on-primary/20 text-on-primary font-label-lg text-label-lg transition-all font-semibold backdrop-blur-sm border border-white/30"
              >
                <I n="support_agent" c="text-[20px]" />
                Contact Windows Solutions Architect
              </a>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-space-lg font-mono-code text-label-sm text-on-primary/80 pt-space-md border-t border-on-primary/20 w-full">
              {[
                ["verified", "30-Day Money-Back Guarantee"],
                ["timer", "Instant Provisioning"],
                ["headset_mic", "24/7/365 Live Support"],
              ].map(([n, t]) => (
                <span key={t} className="flex items-center gap-1.5">
                  <I n={n} c="text-[16px] text-tertiary-fixed" />
                  {t}
                </span>
              ))}
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Windows;
