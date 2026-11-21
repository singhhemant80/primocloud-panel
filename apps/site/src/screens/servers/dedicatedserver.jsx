import { orderUrl } from "../../lib/panel";
import React, { useState, useEffect, useRef } from "react";
import Layout from "../../components/layout";
import { useMotion } from "../../components/motion";
import { useCurrency } from "../../context/CurrencyContext";
import { I, Pill, Sec, Head, cardHover, IconBox } from "../../components/ui";

// ---------- content (taken from the HTML design) ----------
const badges = [
  ["memory", "100% Dedicated Hardware"],
  ["verified", "99.999% SLA Uptime"],
  ["terminal", "Automated IPMI / iLO KVM"],
  ["speed", "10–40 Gbps Uplinks"],
];
const nodeSpecs = [
  ["Processor", "Dual AMD EPYC 9654", "192C / 384T @ 3.7GHz"],
  ["Memory", "768 GB DDR5 ECC", "4800MHz Reg Octa-Ch"],
  ["Storage RAID-10", "4x 7.68TB PCIe Gen5", "15.3TB Usable • U.2 NVMe"],
];
const advantages = [
  [
    "shield",
    "100% Unshared Isolation",
    'Single-tenant physical chassis with zero "noisy neighbors". Direct access to hardware CPU instructions including AVX-512, Intel AMX, and AMD SEV-SNP virtualization registers.',
    "0% Hypervisor CPU Jitter",
  ],
  [
    "memory",
    "PCIe Gen5 NVMe Storage",
    "Up to 14,000 MB/s sequential throughput and over 1,500,000 sustained 4K random IOPS. Native hardware MegaRAID controllers with flash-backed CacheVault protection.",
    "Sub-20µs Direct Latency",
  ],
  [
    "cable",
    "Dedicated 10–40G Uplinks",
    "Redundant multi-homed BGP network fabric with direct Tier-1 carrier transit (Lumen, Telia, NTT, GTT) and guaranteed unmetered enterprise throughput with zero shaping.",
    "Dual-Homed Mellanox NICs",
  ],
  [
    "terminal",
    "Out-of-Band IPMI / iLO KVM",
    "Automated lights-out management. Complete remote console control, power cycling, virtual ISO drive mounting, and raw hardware BIOS/UEFI provisioning via secure HTML5 KVM.",
    "100% Independent Network",
  ],
];
const plans = [
  {
    n: "DS-Silver", slug: "ds-silver",
    tag: "Entry High-Load",
    d: "Optimized for high-traffic websites, microservices, and dedicated CI/CD build nodes.",
    p: [169, 135],
    cta: "Deploy DS-Silver",
    s: [
      ["developer_board", "AMD EPYC 7443P (24C / 48T @ 3.2GHz)"],
      ["memory", "128 GB DDR4 ECC Registered RAM"],
      ["storage", "2x 1.92 TB PCIe Gen4 NVMe (Soft RAID-1)"],
      ["router", "1 Gbps Unmetered (30 TB Guaranteed)"],
      ["hub", "/29 IPv4 Subnet (5 Usable IPs) + /64 IPv6"],
      ["terminal", "Dedicated Out-of-band IPMI / KVM"],
    ],
  },
  {
    n: "DS-Gold", slug: "ds-gold",
    tag: "Dual Xeon Scalable",
    feat: true,
    d: "Engineered for enterprise databases, production ERPs, and heavy multi-tenant backends.",
    p: [299, 239],
    cta: "Deploy DS-Gold",
    s: [
      ["developer_board", "Dual Intel Xeon 4410Y (24C / 48T)"],
      ["memory", "256 GB DDR5 ECC 4800MHz RAM"],
      ["storage", "4x 3.84 TB Gen4 NVMe (HW RAID-10)"],
      ["speed", "10 Gbps Redundant Uplink (50 TB Bandwidth)"],
      ["security", "1.2+ Tbps Layer 3/4/7 DDoS Protection"],
      ["timer", "15-Minute Hardware Swap Guarantee"],
    ],
  },
  {
    n: "DS-Platinum", slug: "ds-platinum",
    tag: "Big Data & Analytics",
    d: "Built for mission-critical PostgreSQL/Oracle clusters, Apache Spark, and Elasticsearch.",
    p: [499, 399],
    cta: "Deploy DS-Platinum",
    s: [
      ["developer_board", "AMD EPYC 9354 (32C / 64T @ 3.8GHz)"],
      ["memory", "512 GB DDR5 ECC High-Density RAM"],
      ["storage", "6x 3.84 TB Gen5 NVMe (HW RAID-6 + BBU)"],
      ["speed", "10 Gbps Dedicated Unmetered Port"],
      ["lan", "Dedicated Private VLAN + Dual 10G SFP+"],
      ["support_agent", "Assigned Account Solutions Architect"],
    ],
  },
  {
    n: "DS-Ultra", slug: "ds-ultra",
    tag: "Virtualization Farm",
    d: "Flagship compute monster for Proxmox/VMware clusters, private cloud, and AI inference.",
    p: [999, 799],
    cta: "Contact Solutions Team",
    s: [
      ["developer_board", "Dual AMD EPYC 9654 (192C / 384T @ 3.7GHz)"],
      ["memory", "1.5 TB (1536 GB) DDR5 ECC Reg RAM"],
      ["storage", "8x 7.68 TB NVMe U.2 (60TB usable RAID-10)"],
      ["speed", "2x 25 Gbps LACP Uplink (Unmetered)"],
      ["bolt", "Dual Redundant 1600W Titanium PSUs"],
      ["tune", "Full Custom Private Rack Options"],
    ],
  },
];
const planTrust = [
  ["timer", "15-Minute Hardware Replacement Guarantee"],
  ["settings_system_daydream", "Free Custom OS & ISO Automated Provisioning"],
  ["money_off", "Zero Setup Fees on Annual Commitments"],
];
const matrix = [
  [
    "memory",
    "Processors",
    [
      "AMD EPYC™ 9004 Genoa",
      "AMD EPYC™ Bergamo 128C",
      "Intel® 5th Gen Xeon® Scalable",
      "Intel® Xeon® E-2388G High-Freq",
    ],
  ],
  [
    "developer_board",
    "ECC Memory",
    [
      "DDR5 4800 / 5600 MHz Reg",
      "DDR4 3200 MHz ECC Reg",
      "Expandable up to 2.0 TB / node",
      "12-Channel Octa-Rank Modules",
    ],
  ],
  [
    "grid_view",
    "RAID / HBA",
    [
      "Broadcom MegaRAID 9560-8i",
      "8GB Flash-Backed CacheVault",
      "Hardware RAID 0, 1, 5, 6, 10, 50, 60",
      "Pass-Through IT-Mode HBA",
    ],
  ],
  [
    "storage",
    "NVMe & SSDs",
    [
      "Samsung PM9A3 PCIe Gen4",
      "Micron 7450 Pro U.2 NVMe",
      "Kioxia CM6 Enterprise Gen4/5",
      "Up to 24x Hot-Swap Bays",
    ],
  ],
  [
    "settings_ethernet",
    "Networking",
    [
      "1 Gbps / 10 Gbps SFP+ Ports",
      "25 Gbps / 40 Gbps QSFP28",
      "Mellanox ConnectX-6 Dx NICs",
      "LACP / 802.3ad Bonding",
    ],
  ],
];
const useCases = [
  [
    "cloud_queue",
    "Private Cloud & Hypervisors",
    "Run Proxmox VE, VMware ESXi, or OpenStack with complete nested hardware acceleration, raw physical PCI passthrough, and zero per-vCPU license fees.",
  ],
  [
    "database",
    "Low-Latency Database Clusters",
    "PostgreSQL, MySQL, CockroachDB, and in-memory Redis clusters demanding sustained multi-million IOPS with deterministic microsecond write confirmations.",
  ],
  [
    "layers",
    "Multi-Tenant SaaS Backends",
    "Scale enterprise microservice fleets with strict compliance isolation, stable latency profiles during peak global traffic bursts, and predictable OPEX billing.",
  ],
  [
    "analytics",
    "Big Data & Elasticsearch",
    "Process massive telemetry streams, logs, and Apache Kafka queues on massive NVMe arrays without the costly cloud egress or shared-storage bottlenecks.",
  ],
  [
    "precision_manufacturing",
    "HPC & Financial Simulations",
    "Execute high-frequency trading algorithms, complex mathematical modeling, and distributed Monte Carlo simulations without CPU scheduler jitter.",
  ],
  [
    "video_library",
    "Video Transcoding & Streaming",
    "Multi-stream FFmpeg 4K/8K media rendering clusters coupled with unmetered 10G/40G carrier pipes for unthrottled live media distribution.",
  ],
];
const osTiles = [
  ["LINUX SERVER", "Ubuntu Server", "24.04 LTS / 22.04 LTS"],
  ["ENTERPRISE RHEL", "AlmaLinux / Rocky", "Release 9.x / 8.x Binary"],
  ["STABLE UNIX", "Debian GNU", 'Debian 12 "Bookworm"'],
  ["OPEN HYPERVISOR", "Proxmox VE", "Version 8.2 with ZFS & KVM"],
  ["ENTERPRISE VM", "VMware ESXi", "vSphere ESXi 8.0 Update 2"],
  ["WINDOWS SERVER", "Windows Server", "2025 Datacenter / 2022 Std"],
];
const osPoints = [
  "Automated PXE OS installations in under 12 minutes",
  "Full BIOS/UEFI custom RAID boot configuration",
  "Unrestricted out-of-band virtual ISO mounting",
];
const compare = [
  [
    "Hypervisor Penalty & Tax",
    "0% (Zero hypervisor overhead)",
    "5% - 15% Xen/KVM hypervisor tax",
    "10% - 25% CPU context-switch delay",
  ],
  [
    "Storage IOPS Consistency",
    "1,500,000+ Raw Direct NVMe IOPS",
    "Throttled EBS bursts (Cost per IOPS)",
    "Unpredictable shared drive pool",
  ],
  [
    "Hardware Resource Isolation",
    "100% Dedicated Physical Silicon",
    "Shared physical socket (unless costly metal)",
    "Highly shared multi-tenant cores",
  ],
  [
    "Memory Bandwidth & Latency",
    "Raw Octa-Channel DDR5 Direct Bus",
    "Virtualized NUMA abstraction",
    "Memory ballooning & swap contention",
  ],
  [
    "Network Bandwidth Billing",
    "Flat Unmetered 10G–40G Ports",
    "Punitive Egress Fees ($0.05–$0.09/GB)",
    "Shared 1Gbps pipe with traffic limits",
  ],
  [
    "Hardware Failure SLA",
    "15-Minute Guaranteed Component Swap",
    "Auto-reboot to new hypervisor instance",
    "Best effort ticket response",
  ],
];
const bootLines = [
  ["PRIMO CLOUD ENTERPRISE BIOS v3.2.14", "text-primary font-bold"],
  ["Processor: Dual AMD EPYC 9654 96-Core Processor", ""],
  ["Speed: 3.70 GHz | L3 Cache: 768 MB total", ""],
  ["Memory Test: 786432 MB DDR5-4800 ECC OK", "text-surface-bright"],
  [
    "PCIe Slot 1: Broadcom MegaRAID SAS/SATA/NVMe 9560-8i (FW: 52.26.0-5020)",
    "",
  ],
  ["PCIe Slot 3: Mellanox ConnectX-6 Dx Dual Port 25GbE Adapter", ""],
  [
    "> Booting Primary Drive: NVMe-ARRAY0 (Ubuntu 24.04.1 LTS Kernel 6.8.0-45-generic)...",
    "text-primary",
  ],
  ["[ OK ] Mounted root filesystem (ext4) on /dev/nvme0n1p2", "pt-2"],
  ["[ OK ] Reached target System Initialization.", ""],
  ["[ OK ] Started OpenSSH Server Daemon.", ""],
];
const sensors = [
  ["+12V Rail:", "12.08 V (Normal)"],
  ["+5V Rail:", "5.02 V (Normal)"],
  ["+3.3V Rail:", "3.31 V (Normal)"],
  ["Ambient Inlet:", "19.4°C / 66.9°F", "text-primary"],
  ["Power Draw:", "412 Watts"],
];
const facilities = [
  [
    "electric_bolt",
    "2N+1 Power Redundancy",
    "Independent dual-feed electrical distribution paths with on-site diesel generators, static transfer switches (STS), and 72-hour autonomous fuel contracts.",
  ],
  [
    "ac_unit",
    "N+2 Precision Cooling",
    "In-row chilled water CRAC units, hot-aisle containment, and evaporative cooling guaranteeing uniform thermal consistency with ultra-low PUE < 1.18.",
  ],
  [
    "badge",
    "Military-Grade Physical Security",
    "Biometric iris verification, anti-tailgating mantraps, 24/7/365 armed on-site security patrols, and full SSAE 18 SOC 1/2 Type II & ISO 27001 certifications.",
  ],
  [
    "hub",
    "Carrier-Neutral Peering",
    "Direct high-speed cross-connects into DE-CIX, AMS-IX, LINX, and Equinix Fabric with multi-terabit direct Tier-1 BGP transit from Lumen and Telia.",
  ],
];
const reviews = [
  [
    "MS",
    "Marcus Sterling",
    "Head of Core Infrastructure, FinTech Unicorn",
    '"We migrated 60 core database nodes from AWS EC2 to Primo Cloud\'s DS-Platinum dual EPYC servers. Our p99 query latency plummeted from 18ms down to 1.2ms, while cutting our monthly cloud bill by over 58%."',
  ],
  [
    "EL",
    "Elena Lindqvist",
    "VP of Systems Engineering, CloudData SaaS",
    '"When one of our high-write NVMe caching drives logged SMART errors at 3 AM on Sunday, Primo\'s datacenter engineers completed the physical hot-swap in 11 minutes without taking down our primary cluster."',
  ],
  [
    "DR",
    "David Rivera",
    "Chief Systems Architect, StreamPulse Media",
    '"We push multi-terabit live broadcast video through Primo\'s unmetered 25G pipes. Zero packet jitter, zero bandwidth caps, and instantaneous IPMI recovery makes Primo our standard bare-metal partner."',
  ],
];
const faqs = [
  [
    "How long does dedicated server provisioning take?",
    "Standard pre-racked configurations (DS-Silver and DS-Gold) are automatically racked and provisioned via automated PXE within 2 to 4 hours. Custom multi-drive hardware configurations and 40G setups are delivered within 24 business hours.",
  ],
  [
    "Do I get dedicated out-of-band IPMI / KVM access?",
    "Yes, 100%. Every dedicated server includes dedicated lights-out management (Supermicro IPMI, Dell iDRAC, or HP iLO) on an isolated management network with HTML5 virtual console, virtual media mounting, and power cycling controls.",
  ],
  [
    "What is your hardware replacement SLA if a component fails?",
    "We contractually guarantee a 15-minute hardware replacement SLA for mission-critical failures. Our certified on-site engineers maintain identical spare components, chassis, CPUs, and enterprise NVMe drives directly in our datacenter cold-rooms.",
  ],
  [
    "Can I configure custom hardware specifications (RAM/Disks)?",
    "Absolutely. You can customize RAM up to 2.0 TB per node, add hardware MegaRAID controllers with CacheVault, insert up to 24 U.2 NVMe drives, or request dual 25G/40G Mellanox network interface cards.",
  ],
  [
    "Do you offer unmetered bandwidth on 10 Gbps and 40 Gbps ports?",
    "Yes, we provide true 100% committed unmetered uplink pipes on 1 Gbps, 10 Gbps, and 40 Gbps ports with zero transfer overage fees, backed by our Tier-1 carrier transit agreements.",
  ],
  [
    "Can I install my own hypervisor like Proxmox or VMware ESXi?",
    "Yes. You have bare-metal control. You can install Proxmox VE 8, VMware vSphere ESXi 8.0, Citrix XCP-ng, or run native container hosts like CoreOS and Talos Linux via our automated panel or via ISO.",
  ],
  [
    "Is DDoS mitigation included with all dedicated servers?",
    "Yes. Every Primo dedicated server includes automated inline 1.2+ Tbps Layer 3, Layer 4, and Layer 7 DDoS scrubbing that filters volumetric UDP/TCP floods and zero-day attacks with sub-second mitigation engagement.",
  ],
  [
    "What IP addresses and subnets are allocated with each server?",
    "Servers include a standard /29 IPv4 allocation (5 usable IPv4 addresses) and a /64 IPv6 block. Larger subnets (/28, /27, up to /24) and custom BGP ASN announcements are readily supported.",
  ],
  [
    "Are there setup fees or long-term contracts required?",
    "We offer month-to-month contracts with zero cancellation penalties. Setup fees are completely waived on all annual commitments, which also include an upfront 20% discount.",
  ],
  [
    "Where are your dedicated server datacenters located?",
    "Primo operates Tier-4 datacenter suites in Frankfurt (Germany), London (UK), Ashburn VA (USA), Dallas TX (USA), Singapore, and Tokyo (Japan) for localized global low latency.",
  ],
];

const reduced = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const useTick = (base, spread, dec = 0, ms = 3000) => {
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

const DedicatedServer = () => {
  const rootRef = useRef(null);
  const kvmRef = useRef(null);
  useMotion(rootRef);
  const { fmt } = useCurrency();
  const money = (n) => fmt(n).replace(/\.00$/, "");
  const [yearly, setYearly] = useState(false);
  const [open, setOpen] = useState([]);
  const [boot, setBoot] = useState(bootLines.length + 1);
  const [feedback, setFeedback] = useState("");
  const [led, setLed] = useState(false);
  const temp = useTick(41, 1.2);
  const rpm = useTick(5840, 45);
  const bw = useTick(18.4, 0.5, 1);
  const power = useTick(412, 8);
  const timer = useRef(null);

  // boot sequence (runs on mount and after "Power Cycle")
  const runBoot = () => {
    if (reduced()) return setBoot(bootLines.length + 1);
    setBoot(0);
    const t = setInterval(
      () =>
        setBoot((s) => {
          if (s >= bootLines.length + 1) {
            clearInterval(t);
            return s;
          }
          return s + 1;
        }),
      380,
    );
  };
  useEffect(() => {
    runBoot();
  }, []);

  const notify = (msg) => {
    setFeedback(msg);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setFeedback(""), 3000);
  };
  const powerCycle = () => {
    notify("Signal ACPI Graceful Reset dispatched to BMC.");
    runBoot();
  };
  const chassis = () => {
    setLed((l) => {
      notify(`Chassis UID Blue LED beacon toggled ${l ? "OFF" : "ON"}.`);
      return !l;
    });
  };
  const toggleFaq = (i) =>
    setOpen((o) => (o.includes(i) ? o.filter((x) => x !== i) : [...o, i]));
  const seg =
    "px-5 py-2 rounded-full font-label-md text-label-md transition-all";
  const line = (n) =>
    `transition-all duration-300 ${boot >= n ? "opacity-100" : "opacity-0"}`;

  return (
    <Layout>
      <div ref={rootRef} className="flex flex-col w-full">
        {/* 1 HERO */}
        <section className="relative w-full overflow-hidden bg-surface py-space-lg lg:py-12">
          <div className="pointer-events-none absolute -top-40 -left-20 h-96 w-96 rounded-full bg-primary-container/10 blur-3xl" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,rgba(11,175,96,0.18)_1px,transparent_1px)] bg-[size:28px_28px] [mask-image:radial-gradient(ellipse_at_top_right,black_20%,transparent_70%)]" />
          <div className="relative max-w-7xl mx-auto px-margin-mobile lg:px-margin grid grid-cols-1 lg:grid-cols-12 gap-gutter-lg items-center">
            <div className="lg:col-span-6 flex flex-col gap-space-md">
              <div className="inline-flex items-center gap-space-xs px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-full w-fit">
                <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse shrink-0" />
                <span className="font-label-sm text-label-sm text-primary tracking-wide uppercase">
                  Enterprise Bare-Metal Infrastructure • 100% Hardware Isolation
                  • Provisioned in &lt;4 Hours
                </span>
              </div>
              <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight leading-tight">
                Raw Enterprise Performance: Dedicated Bare-Metal Servers with{" "}
                <span className="bg-gradient-to-r from-primary-container via-secondary to-primary-container bg-[length:200%_auto] bg-clip-text text-transparent animate-[shimmer_4s_linear_infinite]">
                  Zero Virtualization Overhead
                </span>
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
                Deploy dedicated single-tenant AMD EPYC™ and Intel® Xeon®
                processors with up to 128 cores, unshared DDR5 ECC memory,
                redundant PCIe Gen5 NVMe arrays, and dedicated 10–40 Gbps
                unmetered network pipes.
              </p>
              <div className="flex flex-wrap items-center gap-space-md pt-space-xs">
                <a
                  href="#pricing-grid"
                  className="group relative overflow-hidden inline-flex items-center justify-center font-label-lg text-label-lg bg-gradient-to-r from-primary-container to-secondary text-on-primary px-6 py-3.5 rounded-xl shadow-md shadow-primary-container/30 transition-all hover:shadow-lg hover:-translate-y-0.5 before:absolute before:inset-y-0 before:-left-full before:w-1/2 before:skew-x-[-20deg] before:bg-white/30 hover:before:left-[150%] before:transition-all before:duration-700"
                >
                  <I n="dns" c="text-[18px] mr-2" />
                  Deploy Dedicated Server
                </a>
                <a
                  href="#custom-matrix"
                  className="inline-flex items-center justify-center font-label-lg text-label-lg bg-surface-container-lowest border border-outline-variant hover:bg-secondary-container/20 hover:border-primary-container/50 text-on-surface px-6 py-3.5 rounded-xl shadow-sm transition-all"
                >
                  <I n="tune" c="text-[18px] mr-2" />
                  Custom Enterprise Spec
                </a>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-sm pt-space-md">
                {badges.map(([n, t]) => (
                  <div key={t} className="flex items-center gap-space-xs">
                    <I n={n} c="text-primary text-[20px] shrink-0" />
                    <span className="font-label-sm text-label-sm text-on-surface">
                      {t}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-6 relative">
              <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-space-md shadow-2xl shadow-primary/10 flex flex-col gap-space-md animate-float">
                <div className="flex flex-wrap items-center justify-between gap-2 bg-surface-container-low p-space-sm rounded-lg">
                  <div className="flex items-center gap-space-sm">
                    <span className="w-3 h-3 rounded-full bg-primary-container animate-ping" />
                    <div>
                      <div className="font-mono-code text-label-sm text-on-surface font-bold">
                        primo-node-fra01.dedicated
                      </div>
                      <div className="font-mono-code text-[10px] text-on-surface-variant">
                        NODE_UUID: 49fa7e-fra1-ds-9654
                      </div>
                    </div>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 text-primary font-label-sm text-label-sm rounded-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-container" />{" "}
                    CHASSIS HEALTHY
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-space-sm">
                  {nodeSpecs.map(([a, b, c]) => (
                    <div
                      key={a}
                      className="p-space-sm bg-surface-container-low border border-outline-variant rounded-lg"
                    >
                      <div className="font-label-sm text-label-sm text-on-surface-variant">
                        {a}
                      </div>
                      <div className="font-label-md text-label-md text-on-surface font-semibold">
                        {b}
                      </div>
                      <div className="font-mono-code text-[11px] text-primary">
                        {c}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-space-sm pt-space-xs">
                  {[
                    ["CPU Thermal", "device_thermostat", temp, "°C", 38],
                    [
                      "Fan Array RPM",
                      "mode_fan",
                      rpm.toLocaleString(),
                      "RPM",
                      45,
                    ],
                    ["Dual 25G NIC", "swap_vert", bw, "Gbps", 37],
                  ].map(([l, n, v, u, w]) => (
                    <div
                      key={l}
                      className="bg-surface-container border border-outline-variant p-space-sm rounded-lg flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between text-on-surface-variant">
                        <span className="font-label-sm text-[11px]">{l}</span>
                        <I n={n} c="text-[16px] text-primary" />
                      </div>
                      <div className="mt-2 flex items-baseline gap-1">
                        <span className="font-headline-md text-headline-md text-on-surface font-bold">
                          {v}
                        </span>
                        <span className="font-mono-code text-body-sm text-on-surface-variant">
                          {u}
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-surface-dim rounded-full mt-2 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary-container to-secondary rounded-full"
                          style={{ width: `${w}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-on-background text-surface-bright rounded-lg p-space-sm font-mono-code text-[11px] flex flex-col gap-1">
                  <div className="text-primary-fixed flex flex-wrap items-center justify-between gap-1">
                    <span>[IPMI-BMC] Redfish v1.14 Telemetry Active</span>
                    <span className="text-surface-dim">
                      PSU1: 1600W (OK) | PSU2: 1600W (OK)
                    </span>
                  </div>
                  <div className="text-surface-dim truncate">
                    &gt; Mellanox ConnectX-6 Dx: LACP Bond0 Link Up at 50,000
                    Mbps Full Duplex
                  </div>
                  <div className="text-surface-dim truncate">
                    &gt; MegaRAID 9560-8i BBU status: Optimal • PCIe Gen5 Link
                    16GT/s x16
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2 ADVANTAGES */}
        <Sec bg="bg-surface-container-low">
          <Head
            pill="Uncompromising Architecture"
            title="Engineered for Compute Dominance"
            sub="Eradicate the hypervisor tax. Dedicated bare metal guarantees complete deterministic hardware execution, guaranteed memory bandwidth, and raw direct-attached storage speed."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
            {advantages.map(([n, t, d, f]) => (
              <div
                key={t}
                className={`p-space-lg flex flex-col gap-space-sm ${cardHover}`}
              >
                <IconBox
                  n={n}
                  size="w-12 h-12 rounded-xl"
                  fs="text-[28px]"
                  mb=""
                />
                <h3 className="font-headline-sm text-headline-sm text-on-surface">
                  {t}
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  {d}
                </p>
                <div className="mt-auto pt-space-xs font-mono-code text-[11px] text-primary">
                  {f}
                </div>
              </div>
            ))}
          </div>
        </Sec>

        {/* 3 PRICING */}
        <Sec id="pricing-grid">
          <div className="flex flex-col items-center text-center gap-space-xs mb-space-lg">
            <Pill>Enterprise Compute Fleet</Pill>
            <h2 className="font-headline-xl text-headline-xl text-on-surface tracking-tight mt-space-xs">
              Production-Ready Bare-Metal Configurations
            </h2>
            <div className="mx-auto h-1 w-16 rounded-full bg-gradient-to-r from-primary-container to-secondary" />
            <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
              Instantly deploy pre-racked enterprise server hardware or
              customize tailored bare-metal clusters with zero setup fees on
              annual terms.
            </p>
            <div className="mt-space-md inline-flex items-center bg-surface-container-high p-1 rounded-full">
              <button
                type="button"
                onClick={() => setYearly(false)}
                className={`${seg} ${!yearly ? "bg-surface-container-lowest text-on-surface shadow-sm font-semibold" : "text-on-surface-variant hover:text-on-surface"}`}
              >
                Monthly Billing
              </button>
              <button
                type="button"
                onClick={() => setYearly(true)}
                className={`${seg} ${yearly ? "bg-surface-container-lowest text-on-surface shadow-sm font-semibold" : "text-on-surface-variant hover:text-on-surface"}`}
              >
                Annual Commitment{" "}
                <span className="bg-primary/20 text-primary px-2 py-0.5 rounded-full text-label-sm ml-1">
                  Save 20%
                </span>
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-gutter">
            {plans.map((p) => (
              <div
                key={p.n}
                className={`relative rounded-xl p-space-lg flex flex-col justify-between ${p.feat ? "bg-gradient-to-b from-secondary-container/20 to-surface-container-lowest ring-2 ring-primary-container shadow-2xl shadow-primary-container/25 xl:-translate-y-2" : "bg-surface-container-lowest border border-outline-variant shadow-sm hover:shadow-xl hover:border-primary-container/40 transition-all duration-300"}`}
              >
                {p.feat && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-container text-on-primary font-label-sm text-label-sm px-3.5 py-0.5 rounded-full font-bold shadow-sm whitespace-nowrap">
                    MOST POPULAR CONFIG
                  </div>
                )}
                <div
                  className={`flex flex-col gap-space-sm ${p.feat ? "pt-space-xs" : ""}`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
                      {p.n}
                    </span>
                    <span
                      className={`px-2.5 py-1 font-label-sm text-label-sm rounded-md text-right ${p.feat ? "bg-primary/10 text-primary font-semibold" : "bg-surface-container text-on-surface"}`}
                    >
                      {p.tag}
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    {p.d}
                  </p>
                  <div className="flex items-baseline gap-1 py-space-xs">
                    <span
                      className={`font-display-lg text-display-lg font-bold ${p.feat ? "text-primary" : "text-on-surface"}`}
                    >
                      {money(p.p[yearly ? 1 : 0])}
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      / month
                    </span>
                  </div>
                  <div className="flex flex-col gap-2.5 pt-space-xs text-on-surface">
                    {p.s.map(([ic, t]) => (
                      <div
                        key={t}
                        className="flex items-center gap-space-xs font-body-sm text-body-sm"
                      >
                        <I n={ic} c="text-primary text-[18px] shrink-0" />
                        <span>{t}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="pt-space-lg">
                  <a
                    href={/^Contact/.test(p.cta ?? "") ? "/contact" : orderUrl(p.slug, yearly)}
                    className={`block text-center w-full py-3 font-label-md text-label-md rounded-xl transition-all ${p.feat ? "bg-gradient-to-r from-primary-container to-secondary text-on-primary shadow-md shadow-primary-container/30 hover:-translate-y-0.5" : "bg-surface-container-high hover:bg-primary-container hover:text-on-primary text-on-surface"}`}
                  >
                    {p.cta}
                  </a>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-space-lg p-space-md bg-surface-container-low border border-outline-variant rounded-xl flex flex-wrap items-center justify-around gap-space-md text-center">
            {planTrust.map(([n, t]) => (
              <div
                key={t}
                className="flex items-center gap-space-xs font-label-md text-label-md text-on-surface"
              >
                <I n={n} c="text-primary text-[20px]" />
                <span>{t}</span>
              </div>
            ))}
          </div>
        </Sec>

        {/* 4 CUSTOM MATRIX */}
        <Sec bg="bg-surface-container-low" id="custom-matrix">
          <Head
            pill="Granular Customization"
            title="Tailor Hardware to Exact Workload Parameters"
            sub="Primo Cloud servers are architected modularly. Choose from certified enterprise hardware tiers, certified low-latency storage controllers, and carrier transit speeds."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-space-md">
            {matrix.map(([n, t, items]) => (
              <div
                key={t}
                className="bg-surface-container-lowest border border-outline-variant p-space-md rounded-xl shadow-sm flex flex-col gap-space-sm transition-all hover:-translate-y-1 hover:shadow-lg hover:border-primary-container/40"
              >
                <div className="flex items-center gap-space-xs text-primary pb-space-xs border-b border-surface-container">
                  <I n={n} c="text-[20px]" />
                  <span className="font-label-lg text-label-lg font-bold">
                    {t}
                  </span>
                </div>
                <div className="flex flex-col gap-2 font-body-sm text-body-sm text-on-surface">
                  {items.map((x) => (
                    <div
                      key={x}
                      className="p-2 bg-surface-container-low rounded"
                    >
                      {x}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Sec>

        {/* 5 USE CASES */}
        <Sec>
          <Head
            pill="Mission-Critical Deployments"
            title="Built for Heavyweight Enterprise Demands"
            sub="When cloud instances choke on I/O thrashing or unpredictable CPU throttling, dedicated bare metal delivers predictable, unshared throughput."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
            {useCases.map(([n, t, d]) => (
              <div
                key={t}
                className={`p-space-lg flex flex-col gap-space-sm ${cardHover}`}
              >
                <IconBox
                  n={n}
                  size="w-10 h-10 rounded-lg"
                  fs="text-[22px]"
                  mb=""
                />
                <h3 className="font-headline-sm text-headline-sm text-on-surface">
                  {t}
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  {d}
                </p>
              </div>
            ))}
          </div>
        </Sec>

        {/* 6 OS */}
        <Sec bg="bg-surface-container-low">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-lg items-center">
            <div className="lg:col-span-5 flex flex-col gap-space-sm">
              <Pill c="w-fit">Total OS Freedom</Pill>
              <h2 className="font-headline-xl text-headline-xl text-on-surface tracking-tight">
                Deploy Any OS or Mount Your Own Custom ISO
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                From 1-click enterprise Linux distributions to custom hypervisor
                images and proprietary kernels. Your dedicated IPMI virtual
                drive lets you boot and install any operating system directly
                from your local disk or remote URL.
              </p>
              <div className="pt-space-xs flex flex-col gap-2">
                {osPoints.map((t) => (
                  <div
                    key={t}
                    className="flex items-center gap-space-xs font-body-sm text-body-sm text-on-surface"
                  >
                    <I n="check_circle" c="text-primary text-[18px]" />
                    <span>{t}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-space-md">
              {osTiles.map(([a, b, c]) => (
                <div
                  key={b}
                  className="bg-surface-container-lowest border border-outline-variant p-space-md rounded-xl shadow-sm flex flex-col gap-space-xs transition-all hover:-translate-y-1 hover:shadow-lg hover:border-primary-container/40"
                >
                  <span className="font-label-sm text-label-sm text-primary font-bold">
                    {a}
                  </span>
                  <div className="font-headline-sm text-headline-sm text-on-surface">
                    {b}
                  </div>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    {c}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Sec>

        {/* 7 COMPARISON */}
        <Sec>
          <Head
            pill="Architectural Superiority"
            title="Primo Dedicated Bare-Metal vs. Shared Hyperscalers"
            sub="See why performance-critical organizations migrate sustained database and computational workloads from AWS EC2 / Azure to raw dedicated iron."
          />
          <div className="overflow-x-auto rounded-xl border border-outline-variant shadow-xl">
            <table className="w-full min-w-[820px] text-left bg-surface-container-lowest">
              <thead className="bg-surface-container-high text-on-surface font-label-md text-label-md uppercase">
                <tr>
                  <th className="p-space-md">Performance Vector</th>
                  <th className="p-space-md bg-gradient-to-r from-primary-container to-secondary text-on-primary">
                    PRIMO CLOUD Dedicated
                  </th>
                  <th className="p-space-md">
                    Public Hyperscaler (AWS / Azure)
                  </th>
                  <th className="p-space-md">Standard Shared VPS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container text-on-surface font-body-sm text-body-sm">
                {compare.map(([a, b, c, d]) => (
                  <tr
                    key={a}
                    className="hover:bg-secondary-container/10 transition-colors"
                  >
                    <td className="p-space-md font-semibold">{a}</td>
                    <td className="p-space-md bg-primary/5 text-primary font-bold">
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Sec>

        {/* 8 IPMI CONSOLE */}
        <Sec bg="bg-surface-container-low">
          <Head
            pill="Out-Of-Band Infrastructure Command"
            title="Primo HTML5 IPMI & Lights-Out Remote Console"
            sub="Complete physical control over your dedicated machine even if the operating system crashes or firewall rules block network access."
          />
          <div
            ref={kvmRef}
            className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-2xl overflow-hidden"
          >
            <div className="bg-on-background text-surface-bright px-space-md py-space-sm flex flex-wrap items-center justify-between gap-space-sm">
              <div className="flex items-center gap-space-sm">
                <span className="w-3 h-3 rounded-full bg-primary-container animate-pulse" />
                <span className="font-mono-code text-label-md text-surface-bright font-bold">
                  BMC KVM: primo-node-fra01.dedicated [Connected @ 60 FPS]
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-space-xs">
                <button
                  type="button"
                  onClick={powerCycle}
                  className="px-3 py-1 bg-surface-container-high/20 hover:bg-surface-container-high/40 text-surface-bright rounded text-label-sm font-mono-code transition-colors flex items-center gap-1"
                >
                  <I n="restart_alt" c="text-[14px]" /> Power Cycle
                </button>
                <button
                  type="button"
                  onClick={chassis}
                  className={`px-3 py-1 rounded text-label-sm font-mono-code transition-colors flex items-center gap-1 ${led ? "bg-blue-500/60 text-white" : "bg-surface-container-high/20 hover:bg-surface-container-high/40 text-surface-bright"}`}
                >
                  <I n="lightbulb" c="text-[14px]" /> Chassis LED
                </button>
                <button
                  type="button"
                  onClick={() => kvmRef.current?.requestFullscreen?.()}
                  className="px-3 py-1 bg-primary hover:bg-primary-container text-on-primary rounded text-label-sm font-mono-code transition-colors flex items-center gap-1"
                >
                  <I n="open_in_new" c="text-[14px]" /> Fullscreen KVM
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12">
              <div className="lg:col-span-8 bg-black p-space-md font-mono-code text-surface-dim min-h-[360px] flex flex-col justify-between overflow-x-auto">
                <div className="flex flex-col gap-1 text-[12px]">
                  {bootLines.map(([t, c], i) => (
                    <div
                      key={t}
                      className={`${c} ${line(i + 1)} whitespace-nowrap`}
                    >
                      {t}
                    </div>
                  ))}
                  <div
                    className={`text-primary-fixed pt-2 ${line(bootLines.length + 1)}`}
                  >
                    primo-node-fra01 login:{" "}
                    <span className="animate-pulse">_</span>
                  </div>
                </div>
                <div className="text-[11px] text-surface-dim flex flex-wrap justify-between gap-2 pt-4 border-t border-surface-container-highest/20">
                  <span>
                    Virtual Media: ISO Mounted [ubuntu-24.04-live-server.iso]
                  </span>
                  <span>Encrypted Session (TLS 1.3 / AES-256)</span>
                </div>
              </div>
              <div className="lg:col-span-4 bg-surface-container-low p-space-md flex flex-col justify-between gap-space-sm">
                <div className="flex flex-col gap-space-xs">
                  <div className="font-label-md text-label-md font-bold text-on-surface">
                    Chassis BMC Telemetry
                  </div>
                  <div className="text-body-sm text-on-surface-variant font-mono-code">
                    Motherboard: Supermicro H13DSH
                  </div>
                </div>
                <div className="flex flex-col gap-2 font-mono-code text-body-sm">
                  {sensors.map(([k, v, c]) => (
                    <div
                      key={k}
                      className="flex justify-between items-center p-2 bg-surface-container-lowest border border-outline-variant rounded"
                    >
                      <span className="text-on-surface-variant">{k}</span>
                      <span
                        className={`${c || "text-on-surface"} font-semibold`}
                      >
                        {k === "Power Draw:" ? `${power} Watts` : v}
                      </span>
                    </div>
                  ))}
                </div>
                <div
                  className={`p-2 bg-primary/10 text-primary font-mono-code text-[11px] rounded text-center transition-all duration-300 ${feedback ? "opacity-100" : "opacity-0"}`}
                >
                  {feedback || "Command executed successfully."}
                </div>
              </div>
            </div>
          </div>
        </Sec>

        {/* 9 FACILITIES */}
        <Sec>
          <Head
            pill="Facility Architecture"
            title="Tier-4 Certified Datacenter Foundations"
            sub="Your dedicated hardware resides in world-class facilities in Frankfurt, London, Ashburn, Singapore, and Tokyo, engineered for 99.999% continuous availability."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
            {facilities.map(([n, t, d]) => (
              <div
                key={t}
                className={`p-space-lg flex flex-col gap-space-sm ${cardHover}`}
              >
                <IconBox
                  n={n}
                  size="w-12 h-12 rounded-xl"
                  fs="text-[28px]"
                  mb=""
                />
                <h3 className="font-headline-sm text-headline-sm text-on-surface">
                  {t}
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  {d}
                </p>
              </div>
            ))}
          </div>
        </Sec>

        {/* 10 TESTIMONIALS */}
        <Sec bg="bg-surface-container-low">
          <Head
            pill="Enterprise Reliability"
            title="Validated by Scale Leaders"
            sub="Engineers and infrastructure directors rely on Primo Dedicated Bare Metal to drive sub-millisecond execution and reliable cost controls."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            {reviews.map(([i, n, r, t]) => (
              <div
                key={n}
                className="bg-surface-container-lowest border border-outline-variant p-space-lg rounded-xl shadow-sm relative flex flex-col justify-between gap-space-sm hover:shadow-xl hover:-translate-y-1 hover:border-primary-container/40 transition-all duration-300"
              >
                <div className="flex flex-col gap-space-sm">
                  <div className="flex text-primary">
                    {[...Array(5)].map((_, k) => (
                      <I key={k} n="star" c="text-[20px]" />
                    ))}
                  </div>
                  <I
                    n="format_quote"
                    c="absolute top-4 right-5 text-[56px] text-primary-container/15"
                  />
                  <p className="relative font-body-md text-body-md text-on-surface italic leading-relaxed">
                    {t}
                  </p>
                </div>
                <div className="pt-space-md border-t border-surface-container flex items-center gap-space-sm">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-container to-secondary flex items-center justify-center font-bold text-on-primary font-headline-sm">
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

        {/* 11 FAQ */}
        <Sec>
          <Head
            pill="Expert Guidance"
            title="Dedicated Bare-Metal FAQ"
            sub="Answers to technical, operational, and deployment inquiries regarding Primo Cloud physical server infrastructure."
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter items-start">
            {[faqs.slice(0, 5), faqs.slice(5)].map((col, c) => (
              <div key={c} className="flex flex-col gap-space-sm">
                {col.map(([q, a], j) => {
                  const i = c * 5 + j;
                  const isOpen = open.includes(i);
                  return (
                    <div
                      key={q}
                      className={`bg-surface-container-lowest rounded-xl border p-space-md shadow-sm transition-all duration-300 ${isOpen ? "border-primary-container shadow-md shadow-primary-container/10" : "border-outline-variant"}`}
                    >
                      <button
                        type="button"
                        onClick={() => toggleFaq(i)}
                        className="w-full flex items-center justify-between gap-3 text-left font-headline-sm text-headline-sm text-on-surface font-semibold"
                      >
                        <span>
                          {i + 1}. {q}
                        </span>
                        <I
                          n="expand_more"
                          c={`text-primary text-[20px] shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                        />
                      </button>
                      <div
                        className={`grid transition-all duration-300 ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
                      >
                        <div className="overflow-hidden">
                          <div className="mt-space-sm font-body-md text-body-md text-on-surface-variant">
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
        <section className="relative overflow-hidden w-full bg-gradient-to-br from-primary via-secondary to-primary-container bg-[length:200%_200%] animate-[shimmer_10s_linear_infinite] text-on-primary py-space-xl lg:py-margin-desktop">
          <span className="pointer-events-none absolute -left-10 top-6 h-40 w-40 rounded-full bg-white/10 animate-float" />
          <span className="pointer-events-none absolute -right-8 bottom-4 h-52 w-52 rounded-full bg-white/10 animate-float [animation-delay:1.5s]" />
          <div className="relative max-w-7xl mx-auto px-margin-mobile lg:px-margin text-center flex flex-col items-center gap-space-md">
            <div className="inline-flex items-center gap-space-xs px-3 py-1 bg-surface-container-lowest/20 rounded-full font-label-sm text-label-sm uppercase tracking-wide">
              <span className="w-2 h-2 rounded-full bg-surface-bright animate-ping" />{" "}
              High-Availability Provisioning Live
            </div>
            <h2 className="font-headline-xl text-headline-xl font-bold tracking-tight max-w-3xl">
              Ready to Deploy High-Performance Bare-Metal Dedicated
              Infrastructure?
            </h2>
            <p className="font-body-lg text-body-lg max-w-2xl text-surface-container-lowest/90">
              Deploy production bare-metal servers within 4 hours. Backed by our
              15-minute hardware replacement SLA and 24/7/365 certified sysadmin
              support.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-space-md pt-space-xs">
              <a
                href="#pricing-grid"
                className="inline-flex items-center justify-center font-label-lg text-label-lg bg-surface-container-lowest hover:bg-surface-bright text-primary px-8 py-4 rounded-xl shadow-lg transition-all font-bold hover:-translate-y-0.5"
              >
                Deploy Dedicated Server Now
              </a>
              <a
                href="#custom-matrix"
                className="inline-flex items-center justify-center font-label-lg text-label-lg bg-primary-container/40 hover:bg-primary-container/60 border border-white/30 text-surface-bright px-8 py-4 rounded-xl transition-all font-semibold"
              >
                Talk to an Infrastructure Architect
              </a>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-md pt-space-lg text-surface-container-lowest/80 font-label-sm text-label-sm w-full max-w-3xl">
              {[
                ["verified", "99.999% Network SLA"],
                ["timer", "15-Min Hardware Swap"],
                ["headset_mic", "24/7/365 On-Site Datacenter Engineers"],
              ].map(([n, t]) => (
                <div
                  key={t}
                  className="flex items-center justify-center gap-space-xs"
                >
                  <I n={n} c="text-[18px]" />
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

export default DedicatedServer;
