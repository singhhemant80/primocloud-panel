import { orderUrl } from "../../lib/panel";
import React, { useState, useEffect, useRef } from "react";
import Layout from "../../components/layout";
import { useMotion } from "../../components/motion";
import { useCurrency } from "../../context/CurrencyContext";
import { I, Pill, Sec, Head, cardHover, IconBox } from "../../components/ui";

// ---------- content (taken from the HTML design) ----------
const heroStats = [
  ["100%", "Power SLA", "True 2N+1 A+B"],
  ["<0.3ms", "IX Latency", "DE-CIX & AMS-IX"],
  ["15-Min", "Smart Hands", "24/7/365 On-Site"],
  ["SOC 2 / ISO", "Type II Certified", "Physical Hardened"],
];
const pillars = [
  [
    "electric_bolt",
    "True 2N+1 A+B Redundant Power",
    "Dual independent utility feeds backed by autonomous MTU diesel generators with 72-hour fuel storage contracts and static transfer switches (STS) guaranteeing zero-millisecond transfer delay.",
    "shield",
    "100% Continuous SLA",
  ],
  [
    "hub",
    "Carrier-Neutral Meet-Me-Rooms",
    "Cross-connect directly to 300+ Tier-1 carriers, global CDNs, cloud on-ramps (AWS Direct Connect, Azure ExpressRoute), and premier Internet Exchanges including DE-CIX, AMS-IX, and LINX.",
    "cable",
    "Zero-Latency Cross-Connect",
  ],
  [
    "support_agent",
    "24/7/365 On-Site Smart Hands",
    "Qualified Tier-3 technicians physically on datacenter floor ready for hard drive swaps, optical patching, server unboxing, rail mounting, console crash-cart troubleshooting, and cold boots in <15 mins.",
    "timer",
    "Sub-15 Minute Dispatch",
  ],
  [
    "lock",
    "Military-Grade Physical Security",
    "Five concentric layers of physical defense: perimeter anti-ram barriers, armored mantraps, dual-factor biometric iris scans, private locked steel cages, and 90-day retention 4K optical CCTV arrays.",
    "security",
    "ISO 27001 & SOC 2 Type II",
  ],
];
const plans = [
  {
    n: "1U / 2U Shared", slug: "colo-1u-2u",
    tag: "Edge Node",
    d: "Ideal for custom firewalls, edge appliances, and remote backup nodes.",
    p: [79, 63],
    setup: 99,
    cta: "Deploy 1U / 2U Rack",
    s: [
      '**1U or 2U** 19" Rackmount Space',
      "**1.0 Amp @ 230V** (A+B Dual Feeds)",
      "**10 TB Bandwidth** on 1 Gbps Port",
      "**2 Usable IPv4** + /64 IPv6 Subnet",
      "**2 Hours/Mo** Free Smart Hands",
      "Remote Reboot Switched PDU Port",
    ],
  },
  {
    n: "Quarter Rack", slug: "colo-quarter-rack",
    tag: "10U - 11U",
    hl: 1,
    d: "Dedicated lockable compartment for scaling enterprise teams.",
    p: [249, 199],
    setup: 199,
    cta: "Deploy Quarter Rack",
    s: [
      "**10U Lockable** Mesh Compartment",
      "**4.0 Amps @ 230V** (Dedicated Circuits)",
      "**30 TB Bandwidth** on 10 Gbps Uplink",
      "**/29 IPv4 (5 IPs)** + /48 IPv6 Subnet",
      "Free BGP Peering & BYOIP Routing",
      "**4 Hours/Mo** Included Smart Hands",
    ],
  },
  {
    n: "Half Rack", slug: "colo-half-rack",
    tag: "21U - 22U",
    hl: 1,
    feat: true,
    d: "High-density containment for database arrays and virtualization clusters.",
    p: [449, 359],
    setup: 299,
    cta: "Deploy Half Rack",
    s: [
      "**21U Secure Private** Caged Partition",
      "**8.0 Amps @ 230V** (Expandable to 16A)",
      "**100 TB Bandwidth** on Dual 10 Gbps Ports",
      "**/28 IPv4 (13 IPs)** + Custom Reverse DNS",
      "**1 Gbps Cross-Connect** to MMR included",
      "**8 Hours/Mo** Priority Smart Hands",
    ],
  },
  {
    n: "Full Private Rack", slug: "colo-full-rack",
    tag: "42U - 48U",
    d: "Sovereign enterprise cabinet with private biometric front/rear doors.",
    p: [799, 639],
    setup: 499,
    cta: "Deploy Full Rack",
    s: [
      "**42U / 48U APC NetShelter** Cabinet",
      "**16A to 32A @ 230V** (Up to 15 kW Dense)",
      "**Unmetered 10G or 40G** Direct Fiber",
      "**/27 Dedicated IPv4** + Dedicated VLAN / VRF",
      "24/7 Unescorted Biometric Badge Access",
      "Dedicated Technical Account Manager",
    ],
  },
];
const planTrust = [
  ["verified", "100% Continuous Power SLA Guarantee"],
  ["money_off", "Zero Hidden Cross-Connect Setup Fees"],
  ["bolt", "Sub-15 Minute Smart Hands Dispatch"],
  ["swap_horiz", "Free Hardware Migration Logistics Assistance"],
];
const specs = [
  [
    "power",
    "2N+1 Power Grid Topology",
    "Schneider Electric & Vertiv Continuous Feed",
    "Parallel redundant high-efficiency double-conversion UPS systems backed by bank-isolated valve-regulated lead-acid (VRLA) batteries. 3x MTU 2,500 kVA emergency diesel generators synchronized to start and accept critical datacenter load within 8 seconds of utility disruption.",
    [
      ["ATS TRANSFER", "0.0 ms"],
      ["ON-SITE DIESEL", "72 Hours"],
      ["REDUNDANCY", "True 2N+1", 1],
    ],
  ],
  [
    "ac_unit",
    "In-Row Adiabatic Cooling & PUE 1.14",
    "Cold-Aisle Enclosure with EC Fans",
    "Precision in-row CRAC units utilizing closed-loop chilled water distribution and hot-aisle containment. Microprocessor-regulated EC variable fans dynamically modulate airflow matching rack wattage, eliminating thermal hot spots while maintaining industry-leading Power Usage Effectiveness.",
    [
      ["DESIGN PUE", "1.12 - 1.15"],
      ["WATER USAGE", "0 gal/kWh"],
      ["MAX DENSITY", "25 kW / Rack", 1],
    ],
  ],
  [
    "local_fire_department",
    "VESDA & Novec 1230 Suppression",
    "Dual-Interlock Pre-Action System",
    "Continuous air aspirating Very Early Smoke Detection Apparatus (VESDA) detects incipient combustion particles minutes before visible smoke. Environmentally safe, non-conductive Novec 1230 gas extinguishes fire without causing moisture or thermal shock damage to sensitive hardware.",
    [
      ["DETECTION TIME", "< 10 Sec"],
      ["GAS AGENT", "Novec 1230"],
      ["EQUIP RESIDUE", "Zero Residue", 1],
    ],
  ],
  [
    "layers",
    "Seismic Floor & Cable Segregation",
    "1,500 kg/m² Heavy Structural Rating",
    "Anti-static heavy load raised access flooring engineered for seismic Zone-4 resilience. Overhead dedicated basket trays completely segregate multimode/singlemode optical patch cables from 415V 3-phase high-voltage power lines, eliminating electromagnetic induction.",
    [
      ["FLOOR RATING", "1,500 kg/m²"],
      ["SEISMIC ZONE", "Zone 4 Safe"],
      ["CABLING", "Segregated", 1],
    ],
  ],
];
const sites = [
  [
    "Frankfurt am Main (FRA-01)",
    "Equinix Campus Kleyerstraße",
    "Tier-4 Certified",
    "34 Racks Available",
    "Up to 20 kW",
    "DE-CIX Frankfurt",
    "< 0.2 ms",
  ],
  [
    "London Docklands (LON-01)",
    "Telehouse North Coriolis",
    "Tier-4 Certified",
    "18 Racks Available",
    "Up to 16 kW",
    "LINX London",
    "< 0.4 ms",
  ],
  [
    "Amsterdam Science Park (AMS-01)",
    "Nikhef / Equinix AM3",
    "Tier-4 Certified",
    "28 Racks Available",
    "Up to 22 kW",
    "AMS-IX Amsterdam",
    "< 0.3 ms",
  ],
  [
    "New York Metro / Secaucus (NYC-01)",
    "NY4 Financial Exchange Facility",
    "Tier-4 Platinum",
    "42 Racks Available",
    "Up to 20 kW",
    "NYIIX / DE-CIX NY",
    "< 0.5 ms",
  ],
  [
    "Singapore One-North (SIN-01)",
    "Ayer Rajah Crescent Hub",
    "Tier-4 Certified",
    "16 Racks Available",
    "Up to 15 kW",
    "SGIX Singapore",
    "< 0.8 ms",
  ],
  [
    "Tokyo Otemachi (TYO-01)",
    "Financial District Data Center",
    "Tier-4 Certified",
    "22 Racks Available",
    "Up to 18 kW",
    "JPNAP / BBIX",
    "< 0.6 ms",
  ],
];
const byoi = [
  [
    "Compute Servers",
    "Enterprise Nodes",
    "Dell PowerEdge (R660, R760), HPE ProLiant (DL380 Gen11), Supermicro SuperServer, Lenovo ThinkSystem.",
  ],
  [
    "SAN / NAS Storage",
    "Storage Arrays",
    "Pure Storage FlashArray, NetApp FAS/AFF, Synology Enterprise RackStation, QNAP, custom ZFS JBODs.",
  ],
  [
    "Network & Security",
    "Switching & Firewalls",
    "Arista 7050X, Cisco Nexus 9000, Juniper QFX, Fortinet FortiGate appliances, Palo Alto PA-5400 series.",
  ],
  [
    "Dense AI Acceleration",
    "GPU Superclusters",
    "4U / 8U NVIDIA HGX H100 / A100 systems supported with specialized rear-door heat exchangers and dual 32A feeds.",
  ],
];
const byoiPoints = [
  "Pre-racked delivery or ship chassis directly from OEM manufacturers",
  "Compliant with standard EIA-310-D rack mounting rails",
  "Single-phase 230V or high-amp 3-phase 415V power distribution",
];
const hands = [
  [
    "Unboxing & Rack Mounting",
    "Complete mechanical assembly, rail installation, custom cable comb dress routing, and enterprise port labeling according to your schematics.",
  ],
  [
    "Disk & RAM Hot-Swapping",
    "Swift physical swap of defective SAS/NVMe drives, failed memory modules, power supply units (PSU), or cooling fan modules with zero system downtime.",
  ],
  [
    "Fiber Patching & Light Testing",
    "Single-mode and multi-mode optical patch cord installation, optical power meter dB loss testing, and OTDR verification to Meet-Me-Room cages.",
  ],
  [
    "Crash-Cart & IPMI Config",
    "Emergency mobile crash-cart connection, BIOS/UEFI firmware upgrades, iDRAC/iLO static IP provisioning, and direct serial console access.",
  ],
  [
    "PXE Boot & OS Provisioning",
    "Custom ISO image mounting via physical USB media or local network boot server for VMware ESXi, Proxmox VE, Ubuntu, RHEL, or Windows Server.",
  ],
  [
    "RMA Receiving & Shipping",
    "Direct loading dock freight reception, secure holding cage staging, and expedited packaging/return of defective components directly to Dell, HPE, or Supermicro.",
  ],
];
const compare = [
  [
    "Hardware Ownership & CapEx Control",
    "100% Client-Owned Hardware (Amortizable)",
    "Zero Ownership (Endless High OpEx Rental)",
    "Locked Contracts / Heavy Cage Exit Penalties",
  ],
  [
    "Bandwidth & Egress Data Costs",
    "Unmetered Flat-Rate or Direct Cheap Transit",
    "Punitive $0.05 - $0.09 / GB Egress Penalty Tax",
    "Variable Overages & Heavily Oversubscribed Ports",
  ],
  [
    "Power Density per Cabinet",
    "Up to 25 kW / Rack (Ultra-Dense Ready)",
    "Fixed Rigid Shapes (No Custom Hardware)",
    "2 kW - 4 kW Max (Thermal Inability)",
  ],
  [
    "Physical Security & Access",
    "24/7 Biometric Unescorted Access & Keys",
    "Strictly Prohibited Physical Access",
    "Escorted Only (Hourly Surcharge Applies)",
  ],
  [
    "Smart Hands SLA",
    "Guaranteed <15 Min Response (24/7 On-Floor)",
    "Non-Existent for Custom Architecture",
    "24 - 48 Hour Email Support Queue",
  ],
  [
    "Electrical Power SLA Guarantee",
    "100% Continuous (True 2N+1 Feed)",
    "99.99% Availability Zone Shared SLA",
    "99.9% Single Utility Feed",
  ],
];
const portalPoints = [
  [
    "toggle_on",
    "Power cycle frozen hardware via individual switchable PDU ports",
  ],
  [
    "thermostat",
    "Granular temperature and humidity telemetry with custom SNMP alarms",
  ],
  [
    "badge",
    "Instant badge access permission management for your internal IT staff",
  ],
];
const pdu = [
  "Dell-R760-01",
  "Dell-R760-02",
  "Arista-Leaf-A",
  "Arista-Leaf-B",
  "NetApp-SAN",
];
const reviews = [
  [
    "MS",
    "Markus Steiner",
    "CTO, Apex Fintech Solutions (Zurich)",
    '"Moving our 48U compute clusters out of AWS into PRIMO CLOUD\'s Frankfurt Tier-4 facility cut our monthly infrastructure spend by 62%. The 100% continuous power uptime and sub-millisecond DE-CIX peering have been flawless for three straight years."',
  ],
  [
    "DC",
    "David Chen",
    "VP Infrastructure, Quantron Trading (London)",
    '"The 15-minute Smart Hands response SLA is genuine. When an NVMe drive degraded at 2 AM on a Sunday, PRIMO CLOUD technicians dispatched on-floor, hot-swapped the unit, and confirmed RAID rebuild before our automated escalation finished cycling."',
  ],
  [
    "ER",
    "Elena Rostova",
    "Principal Architect, NeuralCore Systems (Amsterdam)",
    '"We run high-density AI inference chassis pulling 18 kW per cabinet. Most budget datacenters couldn\'t even quote us. PRIMO CLOUD provided dual 32-amp feeds, cold aisle containment, and zero water usage adiabatic cooling effortlessly."',
  ],
];
const faqs = [
  [
    "How quickly can I move my servers into the datacenter?",
    "Standard 1U/2U and quarter racks are provisioned same-day. Full enterprise private racks (42U) are fully powered and cabled within 24 to 48 hours of contract execution. You may either hand-deliver servers or ship them directly from your vendor to our loading docks.",
  ],
  [
    "Do you provide redundant A+B power feeds standard with every rack?",
    "Yes. Every single colocation tier—from 1U shared colocation up to 48U private cages—includes dual independent A+B power feeds connected to isolated UPS banks and autonomous diesel generator sets.",
  ],
  [
    "Can I visit the datacenter to work on my servers directly?",
    "Clients with Half Rack and Full Rack deployments receive unescorted 24/7/365 biometric facility access badges after completing standard security identity clearance. Shared 1U/2U clients can schedule escorted facility visits or utilize on-site Smart Hands.",
  ],
  [
    "What is Smart Hands and how fast do your technicians respond?",
    "Smart Hands covers physical maintenance performed by our certified datacenter technicians: drive swaps, cable patching, power-cycling, and crash-cart debugging. We guarantee an emergency response SLA under 15 minutes 24 hours a day.",
  ],
  [
    "Can I bring my own IP addresses (BYOIP) and BGP ASN?",
    "Absolutely. We support full BGP multihoming and Bring Your Own IP (BYOIP) routing across all facilities. We announce your subnets via our aggregate Tier-1 transits or peer directly via your assigned ASN over our Meet-Me-Room fabric.",
  ],
  [
    "What cross-connect cabling options are available in Meet-Me-Rooms?",
    "We offer single-mode fiber (OS2 LC/APC), multi-mode fiber (OM4 LC), Category 6A copper ethernet, and coax cross-connects directly to carriers, cloud direct connect on-ramps, or other tenant suites with zero recurring hidden carrier cross-connect fees.",
  ],
  [
    "What physical security certifications do your facilities maintain?",
    "All PRIMO CLOUD facilities are audited annually and certified under ISO/IEC 27001, SOC 1 Type II, SOC 2 Type II, PCI-DSS 4.0, HIPAA, and ANSI/TIA-942 Rated 4 datacenter standards.",
  ],
  [
    "Can you handle high-density power requirements for GPU AI clusters?",
    "Yes. Our facilities feature dedicated high-density computing aisles capable of sustaining continuous power draws up to 25 kW per rack, supported by targeted in-row chilling and rear-door heat exchanger (RDHx) units.",
  ],
  [
    "How are bandwidth and network cross-connects billed?",
    "You may select from unmetered burstable ports (1G, 10G, 40G, 100G) with flat predictable billing, 95th percentile billing, or purely bring your own dark fiber and transit providers directly to your cabinet.",
  ],
  [
    "What happens if there is an extended municipal blackout?",
    "Our battery UPS systems immediately sustain full load for up to 30 minutes while on-site MTU diesel generators start and synchronize within 8 seconds. Our guaranteed 72-hour fuel contracts feature priority refueling logistics to run indefinitely.",
  ],
];

const rich = (s) =>
  s.split("**").map((t, i) => (i % 2 ? <strong key={i}>{t}</strong> : t));
const reduced = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const useTick = (base, spread, dec = 1, ms = 2200) => {
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

const Colocation = () => {
  const rootRef = useRef(null);
  useMotion(rootRef);
  const { fmt } = useCurrency();
  const money = (n) => fmt(n).replace(/\.00$/, "");
  const [yearly, setYearly] = useState(false);
  const [open, setOpen] = useState([]);
  const [u, setU] = useState(10);
  const [kw, setKw] = useState(2);
  const [pduOn, setPduOn] = useState(pdu.map(() => true));
  const [cycling, setCycling] = useState(pdu.map(() => false));
  const [note, setNote] = useState("");
  const nt = useRef(null);
  const va = useTick(230.4, 0.5),
    vb = useTick(230.1, 0.5);
  const aa = useTick(16.2, 0.6),
    ab = useTick(15.9, 0.6);
  const cold = useTick(20.4, 0.4),
    hum = useTick(46.2, 1);
  const ca = useTick(8.4, 0.4),
    cb = useTick(8.2, 0.4);

  // estimator: pick the smallest package that fits both rack units and power draw
  const fit = (() => {
    if (kw > 15 || u > 48) return { custom: true };
    const tiers = [
      [2, 0.25, 0],
      [11, 1, 1],
      [22, 3.7, 2],
      [48, 15, 3],
    ];
    const i = tiers.findIndex(([mu, mk]) => u <= mu && kw <= mk);
    return { plan: plans[i < 0 ? 3 : tiers[i][2]], i };
  })();

  const toast = (m) => {
    setNote(m);
    clearTimeout(nt.current);
    nt.current = setTimeout(() => setNote(""), 2800);
  };
  const togglePdu = (i) => {
    if (cycling[i]) return;
    setCycling((c) => c.map((x, k) => (k === i ? true : x)));
    toast(`PDU outlet P0${i + 1} (${pdu[i]}) power-cycling…`);
    setTimeout(
      () => setCycling((c) => c.map((x, k) => (k === i ? false : x))),
      2000,
    );
  };
  const toggleFaq = (i) =>
    setOpen((o) => (o.includes(i) ? o.filter((x) => x !== i) : [...o, i]));
  const seg =
    "px-4 py-2 font-label-md text-label-md rounded transition-all font-semibold";
  const tag =
    "text-primary font-mono-code text-[12px] font-bold uppercase tracking-widest bg-secondary-container/40 px-3 py-1 rounded-full";
  const kwA = ((va * aa) / 1000).toFixed(2),
    kwB = ((vb * ab) / 1000).toFixed(2);

  return (
    <Layout>
      <div ref={rootRef} className="flex flex-col w-full">
        {/* 1 HERO */}
        <section className="relative w-full bg-surface-container-low overflow-hidden pb-space-xl">
          <div className="pointer-events-none absolute -top-32 right-10 w-[580px] h-[580px] rounded-full bg-primary-container/10 blur-[130px]" />
          <div className="pointer-events-none absolute top-1/2 -left-20 w-[420px] h-[420px] rounded-full bg-secondary-container/15 blur-[100px]" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,rgba(11,175,96,0.18)_1px,transparent_1px)] bg-[size:28px_28px] [mask-image:radial-gradient(ellipse_at_top_left,black_20%,transparent_70%)]" />
          <div className="relative max-w-7xl mx-auto px-margin-mobile lg:px-margin">
            <div className="flex items-center gap-space-xs mb-space-md">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-lowest border border-primary-container/20 text-primary text-label-sm font-label-sm uppercase tracking-wider shadow-sm">
                <I
                  n="verified"
                  c="text-[14px] text-primary-container shrink-0"
                />
                Tier-4 Certified Datacenters • 100% Power SLA • Carrier Neutral
                • 24/7 Biometric Access
              </span>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-lg items-start">
              <div className="lg:col-span-7 flex flex-col gap-space-md">
                <h1 className="font-headline-xl text-headline-xl text-on-surface font-bold tracking-tight leading-tight">
                  Enterprise Colocation Services:{" "}
                  <br className="hidden sm:inline" />
                  <span className="bg-gradient-to-r from-primary-container via-secondary to-primary-container bg-[length:200%_auto] bg-clip-text text-transparent animate-[shimmer_4s_linear_infinite]">
                    Secure Your Hardware
                  </span>{" "}
                  in World-Class Tier-4 Datacenters
                </h1>
                <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl leading-relaxed">
                  Host your custom servers, high-density AI clusters, storage
                  SANs, and network appliances in carrier-neutral facilities
                  with redundant 2N+1 power grids, multi-homed 100G uplinks, and
                  sub-15 minute smart hands on-site.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-sm pt-space-xs">
                  {heroStats.map(([a, b, c]) => (
                    <div
                      key={a}
                      className="bg-surface-container-lowest border border-outline-variant p-space-sm rounded-lg shadow-sm flex flex-col transition-all hover:-translate-y-1 hover:shadow-md"
                    >
                      <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
                        {a}
                      </span>
                      <span className="font-label-sm text-label-sm text-primary font-semibold">
                        {b}
                      </span>
                      <span className="font-mono-code text-[11px] text-outline mt-0.5">
                        {c}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap items-center gap-space-md pt-space-sm">
                  <a
                    href="#quote-calculator"
                    className="group relative overflow-hidden inline-flex items-center gap-space-xs font-label-lg text-label-lg text-on-primary bg-gradient-to-r from-primary-container to-secondary transition-all px-6 py-3 rounded-lg shadow-[0_4px_16px_rgba(11,175,96,0.3)] hover:-translate-y-0.5 before:absolute before:inset-y-0 before:-left-full before:w-1/2 before:skew-x-[-20deg] before:bg-white/30 hover:before:left-[150%] before:transition-all before:duration-700"
                  >
                    <span>Request Colocation Quote</span>
                    <I n="arrow_forward" c="text-[18px]" />
                  </a>
                  <a
                    href="/contact"
                    className="inline-flex items-center gap-space-xs font-label-lg text-label-lg text-on-surface bg-surface-container-lowest border border-outline-variant hover:bg-secondary-container/20 hover:border-primary-container/50 transition-all px-5 py-3 rounded-lg shadow-sm"
                  >
                    <I n="calendar_month" c="text-[20px] text-primary" />
                    <span>Schedule Datacenter Tour</span>
                  </a>
                </div>
                <div className="flex flex-wrap items-center gap-space-md pt-space-xs text-on-surface-variant font-mono-code text-[12px]">
                  {["PCI-DSS 4.0", "HIPAA Compliant", "TIA-942 Rated 4"].map(
                    (t) => (
                      <span key={t} className="flex items-center gap-1">
                        <I n="check_circle" c="text-[16px] text-primary" />
                        {t}
                      </span>
                    ),
                  )}
                </div>
              </div>

              <div className="lg:col-span-5 w-full">
                <div className="bg-inverse-surface rounded-xl shadow-2xl shadow-primary/15 p-space-md text-inverse-on-surface relative overflow-hidden animate-float">
                  <div className="pointer-events-none absolute -top-16 -right-16 w-48 h-48 bg-primary-container/20 rounded-full blur-2xl" />
                  <div className="flex items-center justify-between gap-2 pb-space-sm">
                    <div className="flex items-center gap-space-xs min-w-0">
                      <div className="w-3 h-3 rounded-full bg-error shrink-0" />
                      <div className="w-3 h-3 rounded-full bg-[#f59e0b] shrink-0" />
                      <div className="w-3 h-3 rounded-full bg-primary-container shrink-0" />
                      <span className="font-mono-code text-[12px] text-outline-variant ml-2 font-medium truncate">
                        datacenter-eu-fra01.rack-vault
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1 font-mono-code text-[11px] text-primary-fixed bg-on-tertiary-container/80 px-2 py-0.5 rounded whitespace-nowrap">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-container animate-pulse" />{" "}
                      LIVE NOC TELEMETRY
                    </span>
                  </div>
                  <div className="bg-on-surface/40 p-3 rounded-lg mb-space-sm">
                    <div className="flex justify-between items-center text-xs gap-2">
                      <span className="text-outline-variant font-mono-code">
                        FACILITY NODE
                      </span>
                      <span className="font-mono-code text-on-primary font-semibold">
                        Frankfurt am Main (FRA-01)
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs mt-1 gap-2">
                      <span className="text-outline-variant font-mono-code">
                        RATING & TIER
                      </span>
                      <span className="font-mono-code text-tertiary-fixed font-medium">
                        ANSI/TIA-942 Tier-4 Platinum
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-space-xs mb-space-sm">
                    {[
                      ["FEED A (GRID 1)", "ACTIVE", va, aa, kwA, 64],
                      ["FEED B (GRID 2)", "SYNCHRONIZED", vb, ab, kwB, 62],
                    ].map(([l, s, v, a, k, w]) => (
                      <div
                        key={l}
                        className="bg-on-surface/50 p-2.5 rounded-lg flex flex-col gap-1"
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-mono-code text-[11px] text-outline-variant font-semibold">
                            {l}
                          </span>
                          <span className="text-[10px] font-mono-code text-primary-fixed">
                            {s}
                          </span>
                        </div>
                        <div className="font-mono-code text-headline-sm text-on-primary font-bold">
                          {v}{" "}
                          <span className="text-[12px] font-normal text-outline-variant">
                            V
                          </span>
                        </div>
                        <div className="font-mono-code text-[12px] text-secondary-fixed">
                          {a} A • {k} kW
                        </div>
                        <div className="w-full bg-white/15 h-1 rounded-full overflow-hidden mt-1">
                          <div
                            className="bg-primary-container h-full"
                            style={{ width: `${w}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-3 gap-space-xs mb-space-sm text-center">
                    {[
                      [
                        "Cold Aisle",
                        `${cold}°C`,
                        "ASHRAE A1",
                        "text-primary-fixed",
                      ],
                      [
                        "PUE Metric",
                        "1.14",
                        "Adiabatic Low",
                        "text-on-primary",
                      ],
                      [
                        "Rel Humidity",
                        `${hum}%`,
                        "Non-Condensing",
                        "text-on-primary",
                      ],
                    ].map(([l, v, s, c]) => (
                      <div key={l} className="bg-on-surface/40 p-2 rounded-lg">
                        <div className="font-mono-code text-[10px] text-outline-variant uppercase">
                          {l}
                        </div>
                        <div
                          className={`font-mono-code text-body-lg font-bold ${c}`}
                        >
                          {v}
                        </div>
                        <div className="font-mono-code text-[10px] text-outline">
                          {s}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-1.5 font-mono-code text-[11px] bg-on-surface/30 p-2.5 rounded-lg">
                    {[
                      [
                        "Mantrap Interlock:",
                        "ARMED & SECURED",
                        "bg-primary-container",
                        "text-on-primary",
                      ],
                      [
                        "Biometric Iris Scanners:",
                        "100% OPERATIONAL",
                        "bg-primary-container",
                        "text-on-primary",
                      ],
                      [
                        "Aggregate Peering Fabric:",
                        "48.0 Tbps Multi-Homed",
                        "bg-secondary-fixed",
                        "text-primary-fixed",
                      ],
                    ].map(([k, v, d, c]) => (
                      <div
                        key={k}
                        className="flex items-center justify-between gap-2 text-outline-variant"
                      >
                        <span className="flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${d}`} /> {k}
                        </span>
                        <span className={`${c} font-semibold`}>{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2 PILLARS */}
        <Sec>
          <Head
            pill="Engineered For Mission-Critical Reliability"
            title="Four Pillars of Tier-4 Colocation Infrastructure"
            sub="Zero single point of failure (2N+1) from sub-station transformer feeds to dual server rack PDUs and ultra-dense optical distribution frames."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
            {pillars.map(([n, t, d, fi, f]) => (
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
                <div className="pt-space-md mt-space-md">
                  <span className="font-mono-code text-[11px] text-primary font-semibold uppercase tracking-wider flex items-center gap-1">
                    <I n={fi} c="text-[14px]" /> {f}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Sec>

        {/* 3 PRICING */}
        <Sec bg="bg-surface-container-low" id="pricing">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-space-lg">
            <span className={`${tag} mb-2`}>
              Predictable Infrastructure Pricing
            </span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">
              Enterprise Colocation Packages
            </h2>
            <div className="mt-space-sm h-1 w-16 rounded-full bg-gradient-to-r from-primary-container to-secondary" />
            <p className="font-body-md text-body-md text-on-surface-variant mt-3">
              Transparent pricing with zero hidden cross-connect setup fees,
              fully metered power feeds, and included monthly Smart Hands
              credits.
            </p>
            <div className="inline-flex items-center bg-surface-container-lowest border border-outline-variant p-1 rounded-lg shadow-sm mt-space-md">
              <button
                type="button"
                onClick={() => setYearly(false)}
                className={`${seg} ${!yearly ? "bg-primary-container text-on-primary shadow-sm" : "text-on-surface-variant hover:text-on-surface"}`}
              >
                Monthly Billing
              </button>
              <button
                type="button"
                onClick={() => setYearly(true)}
                className={`${seg} flex items-center gap-1.5 ${yearly ? "bg-primary-container text-on-primary shadow-sm" : "text-on-surface-variant hover:text-on-surface"}`}
              >
                <span>Annual Commitment</span>
                <span className="bg-secondary-fixed text-on-secondary-fixed font-mono-code text-[10px] px-1.5 py-0.5 rounded whitespace-nowrap">
                  SAVE 20% + FREE SETUP
                </span>
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-gutter items-stretch">
            {plans.map((p) => (
              <div
                key={p.n}
                className={`relative p-space-lg rounded-xl flex flex-col justify-between ${p.feat ? "bg-gradient-to-b from-secondary-container/20 to-surface-container-lowest ring-2 ring-primary-container shadow-2xl shadow-primary-container/25 xl:-translate-y-2" : "bg-surface-container-lowest border border-outline-variant shadow-sm hover:shadow-xl hover:border-primary-container/40 transition-all duration-300"}`}
              >
                {p.feat && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-container text-on-primary font-mono-code text-[11px] font-bold py-0.5 px-3 rounded-full shadow-sm uppercase tracking-wider whitespace-nowrap">
                    Most Popular for Enterprise
                  </div>
                )}
                <div>
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                      {p.n}
                    </h3>
                    <span
                      className={`font-mono-code text-[11px] px-2 py-0.5 rounded whitespace-nowrap ${p.hl ? "text-primary bg-secondary-container/40 font-semibold" : "text-outline bg-surface-container"}`}
                    >
                      {p.tag}
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
                    {p.d}
                  </p>
                  <div className="mb-space-md">
                    <div className="flex items-baseline gap-1">
                      <span className="font-headline-xl text-headline-xl font-bold text-on-surface">
                        {money(p.p[yearly ? 1 : 0])}
                      </span>
                      <span className="font-body-sm text-body-sm text-outline">
                        / month
                      </span>
                    </div>
                    <div className="font-mono-code text-[11px] text-secondary mt-1">
                      {yearly
                        ? `Setup Fee: ${money(0)} (Waived with Annual)`
                        : `Standard Setup: ${money(p.setup)}`}
                    </div>
                  </div>
                  <div className="space-y-2.5 font-body-sm text-body-sm text-on-surface-variant pt-space-sm">
                    {p.s.map((x) => (
                      <div key={x} className="flex items-center gap-2">
                        <I n="check" c="text-[18px] text-primary shrink-0" />
                        <span>{rich(x)}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="pt-space-lg mt-space-md">
                  <a
                    href={/^Contact/.test(p.cta ?? "") ? "/contact" : orderUrl(p.slug, yearly)}
                    className={`w-full inline-flex justify-center items-center py-2.5 px-4 font-label-lg text-label-lg rounded-lg transition-all ${p.feat ? "bg-gradient-to-r from-primary-container to-secondary text-on-primary font-semibold shadow-md shadow-primary-container/30 hover:-translate-y-0.5" : "bg-surface-container hover:bg-primary-container hover:text-on-primary text-on-surface"}`}
                  >
                    {p.cta}
                  </a>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-space-lg bg-surface-container-lowest border border-outline-variant p-space-md rounded-xl shadow-sm flex flex-wrap items-center justify-between gap-space-md text-on-surface font-label-sm text-label-sm">
            {planTrust.map(([n, t]) => (
              <div key={t} className="flex items-center gap-2">
                <I n={n} c="text-primary text-[20px]" />
                <span>{t}</span>
              </div>
            ))}
          </div>
        </Sec>

        {/* 4 QUOTE ESTIMATOR (anchor target for the hero CTA) */}
        <Sec id="quote-calculator">
          <Head
            pill="Quick Sizing"
            title="Find the Right Colocation Package"
            sub="Tell us how much space and power you need. We'll match the smallest package that fits, then our architects will confirm the exact quote."
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter-lg items-stretch">
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-space-lg shadow-sm flex flex-col gap-space-lg">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="font-label-lg text-label-lg text-on-surface">
                    Rack space needed
                  </label>
                  <span className="font-mono-code text-body-md font-bold text-primary">
                    {u}U
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="48"
                  value={u}
                  onChange={(e) => setU(+e.target.value)}
                  className="w-full accent-primary-container"
                />
                <div className="flex justify-between font-mono-code text-[11px] text-outline mt-1">
                  <span>1U</span>
                  <span>48U (full rack)</span>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="font-label-lg text-label-lg text-on-surface">
                    Power draw (continuous)
                  </label>
                  <span className="font-mono-code text-body-md font-bold text-primary">
                    {kw.toFixed(1)} kW
                  </span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="25"
                  step="0.1"
                  value={kw}
                  onChange={(e) => setKw(+e.target.value)}
                  className="w-full accent-primary-container"
                />
                <div className="flex justify-between font-mono-code text-[11px] text-outline mt-1">
                  <span>0.2 kW</span>
                  <span>25 kW (ultra-dense)</span>
                </div>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Estimate based on each package's listed rack space and power
                allotment. Larger deployments, custom cages, and BYOIP routing
                are quoted individually.
              </p>
            </div>
            <div className="rounded-xl p-space-lg bg-gradient-to-br from-primary via-secondary to-primary-container text-on-primary shadow-xl shadow-primary/20 flex flex-col justify-between gap-space-md">
              {fit.custom ? (
                <>
                  <div>
                    <span className="font-mono-code text-label-sm uppercase tracking-widest text-white/80">
                      Recommended
                    </span>
                    <h3 className="font-headline-md text-headline-md font-bold mt-1">
                      Custom High-Density Cage
                    </h3>
                    <p className="font-body-md text-body-md text-white/90 mt-2">
                      Your requirements exceed a single standard cabinet. We'll
                      design a multi-rack suite with rear-door heat exchangers
                      and dedicated 32A feeds.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <span className="font-mono-code text-label-sm uppercase tracking-widest text-white/80">
                      Best match
                    </span>
                    <h3 className="font-headline-md text-headline-md font-bold mt-1">
                      {fit.plan.n}
                    </h3>
                    <p className="font-body-md text-body-md text-white/90 mt-2">
                      {fit.plan.d}
                    </p>
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="font-display-lg text-display-lg font-extrabold leading-none">
                      {money(fit.plan.p[0])}
                    </span>
                    <span className="font-body-md text-body-md text-white/80 pb-1">
                      / month
                    </span>
                  </div>
                  <span className="font-mono-code text-[12px] text-white/85">
                    {money(fit.plan.p[1])}/mo on annual commitment • setup{" "}
                    {money(fit.plan.setup)} (waived on annual)
                  </span>
                </>
              )}
              <a
                href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-surface-container-lowest text-primary font-label-lg text-label-lg font-bold px-6 py-3 rounded-lg shadow-lg hover:-translate-y-0.5 transition-all"
              >
                Request This Quote
                <I n="arrow_forward" c="text-[18px]" />
              </a>
            </div>
          </div>
        </Sec>

        {/* 5 ENGINEERING */}
        <Sec bg="bg-surface-container-low">
          <Head
            pill="Datacenter Engineering"
            title="Thermal, Electrical & Structural Architecture"
            sub="Built to rigid Tier-4 continuous operation standards with autonomous failover across every subsystem."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
            {specs.map(([n, t, s, d, stats]) => (
              <div
                key={t}
                className={`p-space-lg flex flex-col justify-between ${cardHover}`}
              >
                <div>
                  <div className="flex items-center gap-space-sm mb-space-sm">
                    <IconBox
                      n={n}
                      size="w-10 h-10 rounded-lg"
                      fs="text-[24px]"
                      mb=""
                    />
                    <div>
                      <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                        {t}
                      </h3>
                      <span className="font-mono-code text-[11px] text-outline">
                        {s}
                      </span>
                    </div>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed mb-space-md">
                    {d}
                  </p>
                </div>
                <div className="bg-surface-container-low border border-outline-variant/50 p-space-sm rounded-lg grid grid-cols-3 gap-space-xs text-center font-mono-code text-[12px]">
                  {stats.map(([k, v, g]) => (
                    <div key={k}>
                      <span className="text-outline text-[10px] block">
                        {k}
                      </span>
                      <span
                        className={`font-bold ${g ? "text-primary" : "text-on-surface"}`}
                      >
                        {v}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Sec>

        {/* 6 LOCATIONS */}
        <Sec>
          <Head
            pill="Global Footprint"
            title="Tier-4 Facilities Across Global Financial Hubs"
            sub="Strategically situated directly adjacent to the world's most liquid carrier Meet-Me-Rooms and primary internet exchange nodes."
          />
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-xl overflow-x-auto">
            <table className="w-full min-w-[980px] text-left font-body-sm text-body-sm">
              <thead className="bg-surface-container text-on-surface-variant font-mono-code text-[11px] uppercase tracking-wider">
                <tr>
                  {[
                    "Facility & Metro",
                    "Tier Rating",
                    "Available Space",
                    "Power Density / Rack",
                    "Direct Exchange Peering",
                    "Sub-ms IX Latency",
                  ].map((h) => (
                    <th key={h} className="py-3 px-4">
                      {h}
                    </th>
                  ))}
                  <th className="py-3 px-4 text-right">Facility Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container">
                {sites.map(([n, s, tier, sp, pw, ix, lat]) => (
                  <tr
                    key={n}
                    className="hover:bg-secondary-container/10 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-primary-container animate-pulse" />
                        <div>
                          <span className="font-bold text-on-surface block">
                            {n}
                          </span>
                          <span className="text-[11px] text-outline font-mono-code">
                            {s}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-mono-code text-[12px] text-secondary font-semibold">
                      {tier}
                    </td>
                    <td className="py-4 px-4 font-mono-code text-[12px]">
                      {sp}
                    </td>
                    <td className="py-4 px-4 font-mono-code text-[12px]">
                      {pw}
                    </td>
                    <td className="py-4 px-4">
                      <span className="bg-surface-container px-2 py-0.5 rounded font-mono-code text-[11px]">
                        {ix}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-mono-code text-[12px] text-primary font-bold">
                      {lat}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <a
                        href="/contact"
                        className="text-label-sm font-label-sm text-primary hover:underline whitespace-nowrap"
                      >
                        Reserve Space →
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Sec>

        {/* 7 BYOI */}
        <Sec bg="bg-surface-container-low">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-lg items-center">
            <div className="lg:col-span-5 flex flex-col gap-space-sm">
              <span className={`${tag} w-fit`}>Complete Freedom</span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">
                Bring Your Own Infrastructure (BYOI)
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                Zero vendor lock-in. Our cabinets accommodate all standard
                19-inch rack-mounted computing gear, proprietary SAN
                controllers, and high-density GPU acceleration rigs up to 1000mm
                depth.
              </p>
              <div className="pt-space-xs space-y-2 font-body-sm text-body-sm text-on-surface-variant">
                {byoiPoints.map((t) => (
                  <div key={t} className="flex items-center gap-2">
                    <I n="verified" c="text-primary text-[18px] shrink-0" />
                    <span>{t}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-space-md">
              {byoi.map(([a, b, c]) => (
                <div key={b} className={`p-space-md ${cardHover}`}>
                  <div className="font-label-sm text-label-sm text-primary uppercase font-bold tracking-wider mb-1">
                    {a}
                  </div>
                  <h4 className="font-headline-sm text-headline-sm text-on-surface font-bold mb-2">
                    {b}
                  </h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    {c}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Sec>

        {/* 8 SMART HANDS */}
        <Sec>
          <Head
            pill="24/7/365 Expert Support"
            title="On-Site Smart Hands Capabilities"
            sub="Never wait for physical hardware remediation. Our full-time certified datacenter technicians act as your local eyes, ears, and hands 24 hours a day."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
            {hands.map(([t, d], i) => (
              <div
                key={t}
                className={`p-space-md flex items-start gap-space-sm ${cardHover}`}
              >
                <div className="w-10 h-10 rounded-lg bg-secondary-container/30 flex items-center justify-center text-primary shrink-0 transition-colors duration-300 group-hover:bg-primary-container group-hover:text-on-primary">
                  <span className="font-mono-code font-bold text-body-md">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <div>
                  <h4 className="font-headline-sm text-headline-sm text-on-surface font-bold mb-1">
                    {t}
                  </h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    {d}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Sec>

        {/* 9 COMPARISON */}
        <Sec bg="bg-surface-container-low">
          <Head
            pill="Cost & Control Analysis"
            title="Colocation vs. Hyperscale Clouds & Budget Hosts"
            sub="See why enterprise architectures achieve up to 68% total cost of ownership (TCO) savings by repatriating compute workloads into dedicated colocation."
          />
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-xl overflow-x-auto">
            <table className="w-full min-w-[860px] text-left font-body-sm text-body-sm">
              <thead className="bg-surface-container text-on-surface-variant font-mono-code text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Evaluation Criteria</th>
                  <th className="py-3 px-4 bg-gradient-to-r from-primary-container to-secondary text-on-primary font-bold">
                    PRIMO CLOUD Colocation
                  </th>
                  <th className="py-3 px-4">Hyperscalers (AWS / GCP)</th>
                  <th className="py-3 px-4">Generic Budget Colocation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container">
                {compare.map(([a, b, c, d]) => (
                  <tr
                    key={a}
                    className="hover:bg-secondary-container/10 transition-colors"
                  >
                    <td className="py-4 px-4 font-semibold text-on-surface">
                      {a}
                    </td>
                    <td className="py-4 px-4 font-semibold text-primary bg-secondary-container/10">
                      <span className="flex items-center gap-2">
                        <I
                          n="check_circle"
                          c="text-[16px] text-primary-container shrink-0"
                        />
                        {b}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-outline">{c}</td>
                    <td className="py-4 px-4 text-outline">{d}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Sec>

        {/* 10 PORTAL */}
        <Sec>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-lg items-center">
            <div className="lg:col-span-5 flex flex-col gap-space-sm">
              <span className={`${tag} w-fit`}>Full Remote Control</span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">
                Next-Generation Client Cabinet Telemetry Portal
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                Monitor real-time kilowatt draw, individual PDU outlet switches,
                thermal sensors at top/mid/bottom rack elevations, and audit
                access logs from any web browser or through our REST API.
              </p>
              <div className="space-y-2 pt-space-xs font-body-sm text-body-sm text-on-surface-variant">
                {portalPoints.map(([n, t]) => (
                  <div key={t} className="flex items-center gap-2">
                    <I n={n} c="text-primary text-[18px] shrink-0" />
                    <span>{t}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:col-span-7 w-full bg-surface-container-lowest border border-outline-variant p-space-lg rounded-xl shadow-2xl">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-space-sm">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-primary-container animate-pulse" />
                  <span className="font-mono-code text-on-surface font-bold text-[13px]">
                    Cabinet: FRA01-RACK-42B (Full 42U)
                  </span>
                </div>
                <span className="font-mono-code text-[11px] bg-secondary-container/40 text-primary px-2 py-0.5 rounded font-semibold">
                  ALL SENSORS NORMAL
                </span>
              </div>
              <div className="grid grid-cols-2 gap-space-sm my-space-sm">
                {[
                  ["CIRCUIT A (ACTIVE)", ca, 231.4, 52],
                  ["CIRCUIT B (ACTIVE)", cb, 230.9, 51],
                ].map(([l, a, v, w]) => (
                  <div
                    key={l}
                    className="bg-surface-container-low border border-outline-variant/50 p-space-sm rounded-lg"
                  >
                    <div className="flex justify-between items-center text-xs mb-1 gap-1">
                      <span className="font-mono-code text-outline">{l}</span>
                      <span className="font-mono-code text-primary font-bold">
                        {((a * v) / 1000).toFixed(2)} kW
                      </span>
                    </div>
                    <div className="font-mono-code text-body-lg text-on-surface font-bold">
                      {v}V • {a}A
                    </div>
                    <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden mt-2">
                      <div
                        className="bg-gradient-to-r from-primary-container to-secondary h-full"
                        style={{ width: `${w}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-space-xs text-center my-space-sm font-mono-code text-[12px]">
                {[
                  ["TOP EXHAUST", "23.1°C"],
                  ["MID INTAKE", "20.8°C"],
                  ["BOTTOM COLD", "19.4°C"],
                ].map(([k, v]) => (
                  <div
                    key={k}
                    className="bg-surface-container-low border border-outline-variant/50 p-2 rounded"
                  >
                    <span className="text-outline text-[10px] block">{k}</span>
                    <span className="font-bold text-on-surface">{v}</span>
                  </div>
                ))}
              </div>
              <div className="bg-surface-container-low border border-outline-variant/50 p-space-sm rounded-lg my-space-sm font-mono-code text-[12px]">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-outline font-semibold">
                    MANAGED PDU REBOOT PORTS
                  </span>
                  <span className="text-primary text-[11px]">
                    24 Outlets Online
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {pdu.map((n, i) => (
                    <button
                      key={n}
                      type="button"
                      disabled={cycling[i]}
                      onClick={() => togglePdu(i)}
                      className={`px-2 py-1 rounded shadow-sm transition-colors text-[11px] ${cycling[i] ? "bg-tertiary-fixed-dim/40 text-on-surface" : "bg-surface-container-lowest text-on-surface hover:bg-primary hover:text-on-primary"}`}
                    >
                      P0{i + 1}: {n} [
                      {cycling[i] ? "CYCLING…" : pduOn[i] ? "ON" : "OFF"}]
                    </button>
                  ))}
                </div>
                <div
                  className={`mt-2 text-primary text-[11px] transition-all duration-300 overflow-hidden ${note ? "max-h-6 opacity-100" : "max-h-0 opacity-0"}`}
                >
                  {note}
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-1 text-outline font-mono-code text-[11px] pt-1">
                <span>
                  Cabinet Door:{" "}
                  <strong className="text-secondary">
                    Closed & Magnetically Locked
                  </strong>
                </span>
                <span>Last Access: Badge #8492 (2h 14m ago)</span>
              </div>
            </div>
          </div>
        </Sec>

        {/* 11 TESTIMONIALS */}
        <Sec bg="bg-surface-container-low">
          <Head
            pill="Verified Client Outcomes"
            title="Trusted by Leading CTOs & Systems Architects"
            sub="See how global enterprises and financial operations rely on PRIMO CLOUD colocation facilities."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            {reviews.map(([i, n, r, t]) => (
              <div
                key={n}
                className="bg-surface-container-lowest border border-outline-variant p-space-lg rounded-xl shadow-sm relative flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 hover:border-primary-container/40 transition-all duration-300"
              >
                <div>
                  <div className="flex items-center gap-1 text-primary-container mb-space-sm">
                    {[...Array(5)].map((_, k) => (
                      <I key={k} n="star" c="text-[20px]" />
                    ))}
                  </div>
                  <I
                    n="format_quote"
                    c="absolute top-4 right-5 text-[56px] text-primary-container/15"
                  />
                  <p className="relative font-body-sm text-body-sm text-on-surface leading-relaxed mb-space-md">
                    {t}
                  </p>
                </div>
                <div className="flex items-center gap-3 pt-space-sm">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-container to-secondary flex items-center justify-center font-bold text-on-primary">
                    {i}
                  </div>
                  <div>
                    <div className="flex items-center gap-1 font-headline-sm text-body-md font-bold text-on-surface">
                      {n}
                      <I n="verified" c="text-[16px] text-primary-container" />
                    </div>
                    <div className="font-mono-code text-[11px] text-outline">
                      {r}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Sec>

        {/* 12 FAQ */}
        <Sec>
          <Head
            pill="Frequently Asked Questions"
            title="Colocation Deployment & SLA Details"
            sub="Everything you need to know about shipping hardware, power provisioning, and on-premises security protocols."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter items-start">
            {[faqs.slice(0, 5), faqs.slice(5)].map((col, c) => (
              <div key={c} className="space-y-space-sm">
                {col.map(([q, a], j) => {
                  const i = c * 5 + j;
                  const isOpen = open.includes(i);
                  return (
                    <div
                      key={q}
                      className={`bg-surface-container-lowest p-space-md rounded-xl border shadow-sm transition-all duration-300 ${isOpen ? "border-primary-container shadow-md shadow-primary-container/10" : "border-outline-variant"}`}
                    >
                      <button
                        type="button"
                        onClick={() => toggleFaq(i)}
                        className="w-full text-left font-headline-sm text-body-lg font-bold text-on-surface flex items-center justify-between gap-3"
                      >
                        <span>{q}</span>
                        <I
                          n="add"
                          c={`text-primary text-[20px] shrink-0 transition-transform duration-300 ${isOpen ? "rotate-[135deg]" : ""}`}
                        />
                      </button>
                      <div
                        className={`grid transition-all duration-300 ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
                      >
                        <div className="overflow-hidden">
                          <p className="font-body-sm text-body-sm text-on-surface-variant pt-3 leading-relaxed">
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

        {/* 13 CTA */}
        <section className="w-full max-w-7xl mx-auto px-margin-mobile lg:px-margin py-space-xl">
          <div className="bg-gradient-to-br from-primary via-primary-container to-secondary bg-[length:200%_200%] animate-[shimmer_10s_linear_infinite] rounded-2xl shadow-2xl shadow-primary/20 p-space-lg lg:p-space-xl text-on-primary relative overflow-hidden">
            <div className="pointer-events-none absolute -right-24 -bottom-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
            <span className="pointer-events-none absolute -left-10 top-6 h-40 w-40 rounded-full bg-white/10 animate-float" />
            <div className="relative z-10 max-w-3xl flex flex-col gap-space-md">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white font-mono-code text-[11px] uppercase tracking-wider backdrop-blur-sm w-fit">
                <span className="w-2 h-2 rounded-full bg-tertiary-fixed animate-ping" />{" "}
                Enterprise Colocation Deployment
              </span>
              <h2 className="font-headline-xl text-headline-xl font-bold tracking-tight text-white leading-tight">
                Ready to Deploy Your Mission-Critical Hardware in Our Tier-4
                Facilities?
              </h2>
              <p className="font-body-lg text-body-lg text-white/90 leading-relaxed">
                Speak directly with an enterprise infrastructure solutions
                architect today to calculate exact kilowatt density, reserve
                custom caged suites, and establish private optical
                cross-connects.
              </p>
              <div className="flex flex-wrap items-center gap-space-md pt-space-xs">
                <a
                  href="/contact"
                  className="inline-flex items-center gap-space-xs font-label-lg text-label-lg text-primary bg-white hover:bg-surface-container-low transition-all px-6 py-3 rounded-lg shadow-lg font-bold hover:-translate-y-0.5"
                >
                  <span>Request Custom Colocation Quote</span>
                  <I n="arrow_forward" c="text-[18px]" />
                </a>
                <a
                  href="/contact"
                  className="inline-flex items-center gap-space-xs font-label-lg text-label-lg text-white bg-white/15 hover:bg-white/25 border border-white/30 transition-all px-5 py-3 rounded-lg backdrop-blur-sm font-semibold"
                >
                  <I n="visibility" c="text-[18px]" />
                  <span>Schedule Facility Inspection Tour</span>
                </a>
              </div>
              <div className="pt-space-md flex flex-wrap items-center gap-space-lg text-white/80 font-mono-code text-[12px]">
                {[
                  "100% Continuous Power SLA",
                  "<15-Min Smart Hands",
                  "Carrier-Neutral Meet-Me-Rooms",
                ].map((t) => (
                  <span key={t} className="flex items-center gap-1">
                    <I n="verified" c="text-[16px] text-tertiary-fixed" /> {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Colocation;
