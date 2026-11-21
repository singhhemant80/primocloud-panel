import { orderUrl } from "../../lib/panel";
import React, { useState, useEffect, useRef } from "react";
import Layout from "../../components/layout";
import { useMotion } from "../../components/motion";
import { useCurrency } from "../../context/CurrencyContext";
import { I, Pill, Sec, Head, cardHover, IconBox } from "../../components/ui";

// ---------- content (taken from the HTML design) ----------
const valueStrip = [
  ["verified", "99.99% Uptime SLA"],
  ["receipt_long", "Free WHMCS Billing"],
  ["bolt", "LiteSpeed + LSCache"],
  ["schedule", "Instant 60s Setup"],
];
const hostBadges = [
  ["HTTP/3 QUIC ON", "text-primary-fixed", "bg-surface-variant/20"],
  ["CageFS: Enforced", "text-inverse-on-surface", "bg-surface-variant/20"],
  ["JetBackup: Synced", "text-primary-fixed", "bg-primary/40"],
];
const hostAccounts = [
  ["agencyclient1.com", "Agency_Standard_v2", "ea-php83", "1024 MB", 12],
  ["shopfast.io", "Agency_WooCommerce_Pro", "ea-php83", "2048 MB", 24],
  ["studio-alpha.de", "Agency_Corporate_SSD", "ea-php82", "1024 MB", 8],
];
const pillars = [
  [
    "branding_watermark",
    "100% Unbranded White-Label",
    "Custom private nameservers (ns1.youragency.com), custom agency branding, tailored cPanel visual themes, and an invisible PRIMO hosting footprint.",
    "Client Transparency Locked",
    "check_circle",
  ],
  [
    "speed",
    "LiteSpeed Web Server + LSCache",
    "Up to 40x faster dynamic page response than traditional Apache setups, built-in WordPress caching integration, and sub-100ms Time-To-First-Byte for high user conversions.",
    "40x Dynamic Request Boost",
    "trending_up",
  ],
  [
    "security",
    "CloudLinux OS Account Isolation",
    "CageFS virtualized per-tenant environment ensures that traffic spikes, heavy MySQL queries, or code defects on one client account never degrade another client on your node.",
    "Zero Cross-Account Leakage",
    "shield",
  ],
  [
    "autorenew",
    "Automated WHMCS Billing",
    "Automatic provisioning of client accounts upon invoice payment, immediate automated suspension for delinquent accounts, and turnkey recurring subscription management.",
    "Zero Touch Automation",
    "sync",
  ],
];
const plans = [
  {
    tier: "Freelancer Tier",
    n: "Reseller Start", slug: "reseller-start",
    d: "Perfect for freelance web designers launching their first 10-15 client sites.",
    p: [19.99, 15.99],
    cta: "Deploy Reseller Start",
    s: [
      ["dns", "25", " cPanel Accounts"],
      ["hard_drive", "50 GB", " NVMe Gen4 Storage"],
      ["network_check", "1 TB", " Unmetered Bandwidth"],
      ["lock", "", "Free SSL & Daily JetBackup"],
      ["bolt", "", "LiteSpeed Web Server Included"],
    ],
  },
  {
    tier: "Agency Growth",
    n: "Reseller Pro", slug: "reseller-pro",
    feat: true,
    d: "Ideal for growing digital agencies managing recurring client retainers.",
    p: [34.99, 27.99],
    cta: "Deploy Reseller Pro",
    s: [
      ["dns", "60", " cPanel Accounts"],
      ["hard_drive", "120 GB", " NVMe Gen4 Storage"],
      ["network_check", "3 TB", " Unmetered Bandwidth"],
      ["receipt_long", "", "Free WHMCS Starter License", true],
      ["router", "", "Free Dedicated Clean Static IP"],
      ["history", "", "JetBackup 30-Day Retention"],
      ["terminal", "", "1-Click Staging & WP-CLI"],
    ],
  },
  {
    tier: "Studio Power",
    n: "Reseller Elite", slug: "reseller-elite",
    d: "Built for established design studios with high-traffic e-commerce stores.",
    p: [64.99, 51.99],
    cta: "Deploy Reseller Elite",
    s: [
      ["dns", "120", " cPanel Accounts"],
      ["hard_drive", "250 GB", " NVMe Gen4 Storage"],
      ["network_check", "6 TB", " Unmetered Bandwidth"],
      ["receipt_long", "", "Free WHMCS Pro License", true],
      ["router", "", "2 Dedicated Clean IPs"],
      ["support_agent", "", "Priority Tier-3 SysAdmin Support"],
      ["memory", "", "Redis Object Cache Support"],
    ],
  },
  {
    tier: "Enterprise Fleet",
    n: "Reseller Scale", slug: "reseller-scale",
    d: "Maximum horsepower with dedicated core allocations and white-glove migration.",
    p: [119.99, 95.99],
    cta: "Deploy Reseller Scale",
    s: [
      ["dns", "250", " cPanel Accounts"],
      ["hard_drive", "500 GB", " NVMe Gen4 Storage"],
      ["network_check", "12 TB", " Unmetered Bandwidth"],
      ["receipt_long", "", "Free WHMCS Business License", true],
      ["router", "", "4 Dedicated Clean IPs"],
      ["forum", "", "Direct Slack Engineering Channel"],
      ["timer", "", "15-Minute Guaranteed SLA"],
    ],
  },
];
const planTrust = [
  ["verified_user", "30-Day Unconditional Money-Back Guarantee"],
  ["move_to_inbox", "Free White-Glove Migration from Other Hosts"],
  ["bolt", "Instant 60-Second Account Provisioning"],
];
const engine = [
  [
    "network_ping",
    "LiteSpeed Enterprise & HTTP/3 QUIC",
    "Next-gen web protocols deliver lightning-fast asset loading, seamless multiplexing, and instant mobile page rendering under concurrent traffic.",
  ],
  [
    "cloud_sync",
    "Automated JetBackup with S3 Offsite",
    "Point-in-time snapshot restores directly accessible inside client cPanel dashboards with automated multi-datacenter geographic replication.",
  ],
  [
    "security_update_good",
    "Imunify360 AI Malware & WAF Defense",
    "Proactive bot filtering, zero-day exploit defense, and automated real-time malware cleanup without breaking legitimate client scripts.",
  ],
  [
    "lock_reset",
    "Free Wildcard Let's Encrypt SSL",
    "Fully automated certificate issuance and auto-renewal for every single domain, subdomain, and staging environment your clients spin up.",
  ],
  [
    "widgets",
    "Softaculous 1-Click App Installer",
    "Over 400 applications ready for 1-click client deployment, including WordPress, WooCommerce, Joomla, Laravel, and Ghost.",
  ],
  [
    "domain_verification",
    "Private Custom Nameservers & rDNS",
    "Your agency identity is preserved end-to-end with matching PTR records, custom reverse DNS, and branded WHOIS footprints.",
  ],
];
const compare = [
  [
    "Storage Technology",
    "NVMe Gen4 (7,000 MB/s)",
    "SATA / Shared Standard SSD",
    "Standard NVMe / Block Storage",
  ],
  [
    "Web Server Architecture",
    "LiteSpeed Enterprise + LSCache",
    "Outdated Apache Multi-Processing",
    "Self-Configured Nginx / OpenLiteSpeed",
  ],
  [
    "Account Isolation Engine",
    "CloudLinux LVE + CageFS",
    "Shared Pool (Vulnerable to noisy neighbors)",
    "Single OS instance (Manual Docker setup)",
  ],
  [
    "WHMCS License Included",
    "Free Included (Pro & Up)",
    "Expensive Add-On ($18.95+/month)",
    "None (External Full License Fee)",
  ],
  [
    "File / Inode Limits",
    "Unmetered / Fair Use (No throttling)",
    "Harsh Inode Caps (100k - 250k limit)",
    "Uncapped (Manual File System)",
  ],
  [
    "Migration Assistance",
    "Free 100% Hands-Off White-Glove",
    "Paid / Self-Serve cPanel Export",
    "None (Manual rsync & SQL dumps)",
  ],
  [
    "Support Response SLA",
    "15-Minute Guaranteed SLA",
    "24 to 48-Hour General Ticket Queue",
    "Community Forum Only (Unless Enterprise)",
  ],
];
const whmNav = [
  [
    "Account Functions",
    [
      ["person_add", "Create New Account"],
      ["format_list_bulleted", "List Accounts (48)"],
      ["edit_note", "Modify an Account"],
    ],
  ],
  [
    "Packages & DNS",
    [
      ["inventory_2", "Feature Manager"],
      ["dns", "Edit DNS Zone"],
      ["backup", "JetBackup 5 Engine"],
    ],
  ],
];
const whmActions = [
  ["login", "1-Click cPanel Login"],
  ["upgrade", "Upgrade / Downgrade Plan"],
  ["password", "Reset Client Password"],
  ["pause_circle", "Suspend Account", true],
];
const reviews = [
  [
    "AT",
    "Alex Turner",
    "Founder at Horizon Digital Agency",
    '"We moved 78 client WordPress sites from SiteGround to PRIMO CLOUD Reseller. Our hosting costs dropped by 65%, and client loading speeds improved by 2.4x thanks to LiteSpeed."',
  ],
  [
    "SJ",
    "Sarah Jenkins",
    "Creative Director, PixelCraft Studios",
    '"The free WHMCS integration made billing completely autonomous. We charge $49/mo for managed maintenance and hosting; PRIMO handles the servers flawlessly."',
  ],
  [
    "DC",
    "David Chen",
    "Lead Dev, CloudFlow Solutions",
    '"CageFS is a lifesaver. One client accidentally ran an infinite PHP loop, and not a single other client noticed even a millisecond of slowdown. Outstanding stability."',
  ],
];
const faqs = [
  [
    "What is Reseller Hosting and how do I make money?",
    "Reseller hosting allows you to divide bulk server resources (disk, bandwidth, accounts) into custom hosting packages that you sell to your clients under your own agency brand, generating lucrative monthly recurring revenue.",
  ],
  [
    "Can clients tell that PRIMO CLOUD is the provider?",
    "No. Our reseller nodes are 100% white-label. Your clients see only your custom nameservers (e.g., ns1.youragency.com), your logo in cPanel, and your billing invoices. PRIMO is completely invisible.",
  ],
  [
    "Do you assist with migrating existing cPanel accounts?",
    "Yes. Our dedicated technical migration team handles full cPanel account transfers with zero downtime, moving databases, mailboxes, SSL certificates, and DNS records free of charge.",
  ],
  [
    "Is the WHMCS billing license really included for free?",
    "Yes, a complimentary WHMCS license is provided with our Reseller Pro, Elite, and Scale plans, saving your agency hundreds of dollars annually in client billing software expenses.",
  ],
  [
    "What happens if a single client consumes too much CPU?",
    "Our CloudLinux LVE technology isolates every tenant inside CageFS. If one site spikes or experiences a DDoS attack, only that specific account is throttled—the rest of your clients continue running at peak speed.",
  ],
  [
    "Can I oversell disk space and bandwidth?",
    "Yes! Overselling is fully enabled in WHM. You can allocate more disk space and traffic than your total quota as long as actual real-time collective usage does not exceed your package boundaries.",
  ],
  [
    "Are automated offsite daily backups included?",
    "Yes. JetBackup 5 automatically takes daily snapshots that are replicated to secondary offsite Amazon S3 storage vaults, allowing 1-click full restores or single-file recovery directly in cPanel.",
  ],
  [
    "Which PHP versions and databases are supported?",
    "We support multiple simultaneous PHP versions from 7.4 through PHP 8.1, 8.2, and 8.3, alongside MariaDB 10.6+ and Redis object caching for optimal WordPress and Laravel performance.",
  ],
  [
    "Do you provide white-label support to my clients?",
    "We provide 24/7/365 priority tier-3 support directly to you as the reseller. You maintain the direct relationship with your clients, and we back you with our 15-minute guaranteed technical SLA.",
  ],
  [
    "What is your uptime guarantee and refund policy?",
    "All plans are backed by our legally binding 99.99% network uptime SLA. Additionally, every new reseller account includes an unconditional 30-day money-back guarantee with zero hassle.",
  ],
];

const useJitter = (base, spread, ms = 1700) => {
  const [v, setV] = useState(base);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(
      () =>
        setV(
          Math.max(1, Math.round(base + (Math.random() - 0.5) * spread * 2)),
        ),
      ms,
    );
    return () => clearInterval(t);
  }, [base, spread, ms]);
  return v;
};

const Meter = ({ pct, on, c = "" }) => (
  <div
    className={`w-full bg-surface-variant/30 h-1.5 rounded-full overflow-hidden mt-1 ${c}`}
  >
    <div
      className="bg-gradient-to-r from-primary-container to-primary-fixed h-full rounded-full transition-[width] duration-1000 ease-out"
      style={{ width: on ? `${pct}%` : "0%" }}
    />
  </div>
);

const ResellerHosting = () => {
  const rootRef = useRef(null);
  useMotion(rootRef);
  const { fmt } = useCurrency();
  const [yearly, setYearly] = useState(false);
  const [sites, setSites] = useState(40);
  const [fee, setFee] = useState(35);
  const [navActive, setNavActive] = useState("Create New Account");
  const [on, setOn] = useState(false);
  const l1 = useJitter(12, 4);
  const l2 = useJitter(24, 5);
  const l3 = useJitter(8, 3);
  const loads = [l1, l2, l3];
  useEffect(() => {
    const t = setTimeout(() => setOn(true), 300);
    return () => clearTimeout(t);
  }, []);

  // profit calculator
  const gross = sites * fee;
  const [cost, planName] =
    sites > 120
      ? [119.99, "Reseller Scale"]
      : sites > 60
        ? [64.99, "Reseller Elite"]
        : sites > 25
          ? [34.99, "Reseller Pro"]
          : [19.99, "Reseller Start"];
  const net = Math.max(0, gross - cost);
  const margin = gross > 0 ? ((net / gross) * 100).toFixed(1) : "0.0";
  const tab =
    "px-space-md py-space-xs rounded-lg font-label-md text-label-md transition-all";
  const range =
    "w-full accent-primary-container cursor-pointer h-2 bg-surface-variant rounded-lg";

  return (
    <Layout>
      <div ref={rootRef} className="flex flex-col w-full">
        {/* 1 HERO */}
        <section className="relative w-full overflow-hidden bg-surface py-space-lg md:py-16">
          <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-primary-container/10 rounded-full blur-[140px]" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,rgba(11,175,96,0.18)_1px,transparent_1px)] bg-[size:28px_28px] [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_70%)]" />
          <div className="relative max-w-7xl mx-auto px-margin-mobile lg:px-margin flex flex-col items-center">
            <div className="inline-flex items-center gap-space-xs px-space-md py-space-xs rounded-full bg-surface-container border border-primary-container/20 shadow-sm mb-space-md text-center">
              <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse shrink-0" />
              <span className="font-mono-code text-[11px] font-semibold text-on-surface uppercase tracking-wider">
                100% Unbranded White-Label • Free WHMCS License • NVMe Gen4 •
                1-Click cPanel/WHM
              </span>
            </div>
            <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg font-bold text-center text-on-surface max-w-4xl tracking-tight leading-tight">
              High-Performance White-Label Reseller Hosting:{" "}
              <span className="bg-gradient-to-r from-primary-container via-secondary to-primary-container bg-[length:200%_auto] bg-clip-text text-transparent animate-[shimmer_4s_linear_infinite]">
                Launch Your Own Web Hosting Agency Today
              </span>
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant text-center max-w-3xl mt-space-md mb-space-lg leading-relaxed">
              Empower your web design agency or dev shop with high-frequency AMD
              EPYC™ hardware, LiteSpeed web server, and isolated CloudLinux
              accounts. Keep 100% of your client margins with zero
              infrastructure overhead.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-gutter-sm w-full max-w-4xl mb-space-xl">
              {valueStrip.map(([n, t]) => (
                <div
                  key={t}
                  className="flex items-center justify-center gap-space-xs py-space-xs px-space-sm rounded-lg bg-surface-container-lowest border border-outline-variant shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
                >
                  <I n={n} c="text-primary text-[20px]" />
                  <span className="font-label-md text-label-md text-on-surface font-semibold">
                    {t}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-space-md mb-space-xl w-full sm:w-auto">
              <a
                href="#pricing"
                className="group relative overflow-hidden w-full sm:w-auto inline-flex items-center justify-center gap-space-xs px-space-xl py-space-md rounded-lg bg-gradient-to-r from-primary-container to-secondary text-on-primary font-label-lg text-label-lg shadow-md shadow-primary-container/30 transition-all hover:shadow-lg hover:-translate-y-0.5 before:absolute before:inset-y-0 before:-left-full before:w-1/2 before:skew-x-[-20deg] before:bg-white/30 hover:before:left-[150%] before:transition-all before:duration-700"
              >
                <span>Explore Reseller Plans</span>
                <I n="arrow_forward" c="text-[18px]" />
              </a>
              <a
                href="#whm-demo"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-space-xs px-space-xl py-space-md rounded-lg bg-surface-container-lowest border border-outline-variant text-on-surface font-label-lg text-label-lg shadow-sm hover:bg-secondary-container/20 hover:border-primary-container/50 transition-all"
              >
                <I n="speed" c="text-[18px] text-primary" />
                <span>Test WHM Demo & Speed</span>
              </a>
            </div>

            {/* WHM dashboard */}
            <div className="w-full max-w-5xl rounded-xl bg-inverse-surface shadow-2xl shadow-primary/10 p-space-md md:p-space-lg text-inverse-on-surface relative overflow-hidden animate-float">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-space-sm pb-space-md mb-space-md border-b border-surface-variant/20">
                <div className="flex items-center gap-space-sm">
                  <span className="flex h-3 w-3 rounded-full bg-primary-container animate-ping" />
                  <div className="flex flex-col">
                    <span className="font-mono-code text-[12px] font-semibold text-primary-fixed tracking-wide">
                      whm.primocloud.net:2087 • CLUSTER-NODE-US04
                    </span>
                    <span className="font-body-sm text-[11px] text-surface-variant/70">
                      Active CloudLinux LVE Kernel 6.18 | LiteSpeed Enterprise
                      8-Core Active
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-space-xs">
                  {hostBadges.map(([t, c, b]) => (
                    <span
                      key={t}
                      className={`px-space-xs py-0.5 rounded font-mono-code text-[11px] ${c} ${b}`}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-space-md mb-space-lg">
                {[
                  ["Active cPanel Accounts", "48 / 50", 96, ""],
                  ["Disk Consumption (NVMe)", "340 / 500 GB", 68, ""],
                  ["Monthly Traffic", "4.2 / 10 TB", 42, ""],
                  [
                    "JetBackup 5 Offsite",
                    "Completed 04:00 AM",
                    100,
                    "text-primary-fixed",
                  ],
                ].map(([l, v, w, c]) => (
                  <div
                    key={l}
                    className="bg-surface-variant/10 border border-white/10 p-space-sm rounded-lg flex flex-col gap-1"
                  >
                    <span className="font-label-sm text-label-sm text-surface-variant">
                      {l}
                    </span>
                    <span
                      className={`font-headline-sm text-headline-sm font-bold ${c || "text-inverse-on-surface"}`}
                    >
                      {v}
                    </span>
                    <Meter on={on} pct={w} />
                  </div>
                ))}
              </div>
              <div className="overflow-x-auto rounded-lg bg-surface-variant/5 p-space-xs">
                <table className="w-full min-w-[640px] text-left font-mono-code text-[12px]">
                  <thead>
                    <tr className="text-surface-variant border-b border-surface-variant/20">
                      {[
                        "Domain / Account",
                        "Package",
                        "PHP Version",
                        "Memory Limit",
                        "LVE CPU Load",
                      ].map((h) => (
                        <th key={h} className="py-space-xs px-space-sm">
                          {h}
                        </th>
                      ))}
                      <th className="py-space-xs px-space-sm text-right">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-variant/10 text-inverse-on-surface">
                    {hostAccounts.map(([d, p, php, mem], i) => (
                      <tr key={d}>
                        <td className="py-space-xs px-space-sm font-semibold">
                          <span className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary-container" />
                            {d}
                          </span>
                        </td>
                        <td className="py-space-xs px-space-sm">{p}</td>
                        <td className="py-space-xs px-space-sm">{php}</td>
                        <td className="py-space-xs px-space-sm">{mem}</td>
                        <td className="py-space-xs px-space-sm text-primary-fixed">
                          {String(loads[i]).padStart(2, "0")}%
                        </td>
                        <td className="py-space-xs px-space-sm text-right">
                          <span className="px-space-xs py-0.5 rounded bg-primary/20 text-primary-fixed font-label-sm text-[11px] whitespace-nowrap">
                            Normal / Isolated
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* 2 PILLARS */}
        <Sec bg="bg-surface-container-low">
          <Head
            pill="Core Infrastructure Architecture"
            title="Engineered from the Silicon Up for Scalable Reseller Agencies"
            sub="Built on Tier-IV datacenter nodes with isolated containerization and white-label controls."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
            {pillars.map(([n, t, d, f, fi]) => (
              <div
                key={t}
                className={`p-space-lg flex flex-col justify-between ${cardHover}`}
              >
                <div>
                  <IconBox n={n} size="w-12 h-12 rounded-xl" fs="text-[28px]" />
                  <h3 className="font-headline-sm text-headline-sm font-semibold text-on-surface mb-space-xs">
                    {t}
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    {d}
                  </p>
                </div>
                <div className="mt-space-md pt-space-sm flex items-center text-primary font-label-sm text-label-sm gap-1">
                  <span>{f}</span>
                  <I n={fi} c="text-[16px]" />
                </div>
              </div>
            ))}
          </div>
        </Sec>

        {/* 3 PRICING */}
        <Sec id="pricing">
          <div className="flex flex-col items-center mb-space-xl text-center">
            <Pill>Transparent Investment</Pill>
            <h2 className="font-headline-xl text-headline-xl font-bold text-on-surface mt-space-sm">
              Predictable Pricing with Uncapped Margins
            </h2>
            <div className="mx-auto mt-space-sm h-1 w-16 rounded-full bg-gradient-to-r from-primary-container to-secondary" />
            <p className="font-body-md text-body-md text-on-surface-variant max-w-xl mt-space-sm mb-space-md">
              Keep 100% of whatever retainer or recurring hosting fee you charge
              your clients.
            </p>
            <div className="flex items-center gap-space-sm bg-surface-container p-1 rounded-xl shadow-inner">
              <button
                type="button"
                onClick={() => setYearly(false)}
                className={`${tab} ${!yearly ? "bg-surface-container-lowest text-on-surface shadow-sm" : "text-on-surface-variant hover:text-on-surface"}`}
              >
                Monthly Billing
              </button>
              <button
                type="button"
                onClick={() => setYearly(true)}
                className={`${tab} flex items-center gap-1 ${yearly ? "bg-surface-container-lowest text-on-surface shadow-sm" : "text-on-surface-variant hover:text-on-surface"}`}
              >
                <span>Annual Billing</span>
                <span className="px-space-xs py-0.5 rounded-full bg-primary text-on-primary font-mono-code text-[10px] font-bold">
                  SAVE 20%
                </span>
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-gutter items-stretch">
            {plans.map((p) => (
              <div
                key={p.n}
                className={`rounded-xl p-space-lg flex flex-col justify-between relative ${p.feat ? "bg-gradient-to-b from-secondary-container/20 to-surface-container-lowest ring-2 ring-primary-container shadow-2xl shadow-primary-container/25 xl:-translate-y-2" : "bg-surface-container-lowest border border-outline-variant shadow-sm hover:shadow-xl hover:border-primary-container/40 transition-all duration-300"}`}
              >
                {p.feat && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-space-sm py-0.5 rounded-full bg-primary-container text-on-primary font-label-sm text-label-sm font-bold uppercase tracking-wider shadow whitespace-nowrap">
                    Most Popular • Recommended
                  </div>
                )}
                <div>
                  <span
                    className={`font-label-md text-label-md font-semibold uppercase tracking-wider ${p.feat ? "text-primary" : "text-on-surface-variant"}`}
                  >
                    {p.tier}
                  </span>
                  <h3 className="font-headline-md text-headline-md font-bold text-on-surface mt-1">
                    {p.n}
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-2 mb-space-md">
                    {p.d}
                  </p>
                  <div className="flex items-baseline gap-1 mb-space-md">
                    <span className="font-display-lg text-[36px] font-bold text-on-surface">
                      {fmt(p.p[yearly ? 1 : 0])}
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      / month
                    </span>
                  </div>
                  <ul className="flex flex-col gap-space-sm text-body-sm font-body-sm text-on-surface">
                    {p.s.map(([ic, b, r, hl]) => (
                      <li
                        key={ic + b + r}
                        className={`flex items-center gap-space-xs ${hl ? "text-primary font-semibold" : ""}`}
                      >
                        <I n={ic} c="text-primary text-[18px]" />
                        <span>
                          {b && <strong>{b}</strong>}
                          {r}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-space-lg">
                  <a
                    href={/^Contact/.test(p.cta ?? "") ? "/contact" : orderUrl(p.slug, yearly)}
                    className={`block text-center w-full py-space-sm px-space-md rounded-lg font-label-md text-label-md font-semibold transition-all ${p.feat ? "bg-gradient-to-r from-primary-container to-secondary text-on-primary shadow-md shadow-primary-container/30 hover:-translate-y-0.5" : "bg-surface-container text-on-surface hover:bg-primary-container hover:text-on-primary"}`}
                  >
                    {p.cta}
                  </a>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-space-xl p-space-md rounded-xl bg-surface-container-low border border-outline-variant flex flex-col md:flex-row items-center justify-around gap-space-md text-center">
            {planTrust.map(([n, t]) => (
              <div key={t} className="flex items-center gap-space-xs">
                <I n={n} c="text-primary text-[22px]" />
                <span className="font-label-md text-label-md text-on-surface font-semibold">
                  {t}
                </span>
              </div>
            ))}
          </div>
        </Sec>

        {/* 4 ENGINE */}
        <Sec bg="bg-surface-container-low">
          <Head
            pill="Turnkey Engineering"
            title="The Complete Reseller Technology Engine"
            sub="Pre-integrated enterprise tools so you can run an ISP-grade operation without a dedicated sysadmin staff."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
            {engine.map(([n, t, d]) => (
              <div
                key={t}
                className={`p-space-lg flex flex-col gap-space-xs ${cardHover}`}
              >
                <IconBox
                  n={n}
                  size="w-10 h-10 rounded-lg"
                  fs="text-[24px]"
                  mb="mb-space-xs"
                />
                <h3 className="font-headline-sm text-headline-sm font-semibold text-on-surface">
                  {t}
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  {d}
                </p>
              </div>
            ))}
          </div>
        </Sec>

        {/* 5 CALCULATOR */}
        <Sec>
          <Head
            pill="Agency Unit Economics"
            title="How Much You Can Earn as a PRIMO Reseller"
            sub="Turn one-time web design handoffs into high-margin recurring monthly cash flow."
          />
          <div className="max-w-4xl mx-auto rounded-xl bg-surface-container-low border border-outline-variant p-space-lg md:p-space-xl shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-xl items-center">
              <div className="flex flex-col gap-space-lg">
                <div className="flex flex-col gap-space-xs">
                  <div className="flex justify-between items-center">
                    <label
                      htmlFor="sites-slider"
                      className="font-label-md text-label-md text-on-surface font-semibold"
                    >
                      Number of Client Sites
                    </label>
                    <span className="font-mono-code text-[16px] font-bold text-primary">
                      {sites} Sites
                    </span>
                  </div>
                  <input
                    id="sites-slider"
                    type="range"
                    min="5"
                    max="150"
                    value={sites}
                    onChange={(e) => setSites(+e.target.value)}
                    className={range}
                  />
                  <div className="flex justify-between font-mono-code text-[11px] text-on-surface-variant">
                    <span>5</span>
                    <span>75</span>
                    <span>150</span>
                  </div>
                </div>
                <div className="flex flex-col gap-space-xs">
                  <div className="flex justify-between items-center">
                    <label
                      htmlFor="price-slider"
                      className="font-label-md text-label-md text-on-surface font-semibold"
                    >
                      Monthly Retainer Charged per Site
                    </label>
                    <span className="font-mono-code text-[16px] font-bold text-primary">
                      {fmt(fee)} / mo
                    </span>
                  </div>
                  <input
                    id="price-slider"
                    type="range"
                    min="15"
                    max="150"
                    step="5"
                    value={fee}
                    onChange={(e) => setFee(+e.target.value)}
                    className={range}
                  />
                  <div className="flex justify-between font-mono-code text-[11px] text-on-surface-variant">
                    <span>{fmt(15)}</span>
                    <span>{fmt(75)}</span>
                    <span>{fmt(150)}</span>
                  </div>
                </div>
                <div className="p-space-sm rounded-lg bg-surface-container text-body-sm font-body-sm text-on-surface-variant flex items-start gap-space-xs">
                  <I n="info" c="text-primary text-[18px] shrink-0 mt-0.5" />
                  <span>
                    Based on typical agency client retainers bundle (Managed
                    LiteSpeed Hosting + Security + Core Updates).
                  </span>
                </div>
              </div>
              <div className="rounded-xl bg-surface-container-lowest border border-outline-variant p-space-lg shadow-sm flex flex-col gap-space-md">
                <div className="flex justify-between items-center pb-space-sm border-b border-surface-variant/30">
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    Gross Agency Revenue:
                  </span>
                  <span className="font-headline-sm text-headline-sm font-bold text-on-surface">
                    {fmt(gross)} /mo
                  </span>
                </div>
                <div className="flex justify-between items-center pb-space-sm border-b border-surface-variant/30">
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    PRIMO Cost ({planName}):
                  </span>
                  <span className="font-mono-code text-mono-code text-on-surface font-semibold">
                    {fmt(cost)} /mo
                  </span>
                </div>
                <div className="bg-secondary-container/20 border border-primary-container/20 p-space-md rounded-lg flex flex-col gap-1">
                  <span className="font-label-md text-label-md text-primary font-semibold uppercase tracking-wider">
                    Net Monthly Agency Profit
                  </span>
                  <span className="font-display-lg text-[32px] font-bold text-primary">
                    {fmt(net)}
                  </span>
                  <div className="flex items-center gap-1 mt-1 text-primary">
                    <I n="verified" c="text-[18px]" />
                    <span className="font-label-md text-label-md font-bold">
                      {margin}% Gross Margin
                    </span>
                  </div>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant text-center">
                  Turn web design handoffs into recurring passive monthly cash
                  flow.
                </p>
              </div>
            </div>
          </div>
        </Sec>

        {/* 6 COMPARISON */}
        <Sec bg="bg-surface-container-low">
          <Head
            pill="Infrastructure Showdown"
            title="Head-to-Head Architecture Comparison"
            sub="See why modern agencies migrate away from outdated legacy hosting resellers and bare generic cloud droplets."
          />
          <div className="overflow-x-auto rounded-xl bg-surface-container-lowest border border-outline-variant shadow-xl">
            <table className="w-full min-w-[820px] text-left font-body-sm text-body-sm border-collapse">
              <thead>
                <tr className="text-on-surface font-label-md text-label-md">
                  <th className="py-space-md px-space-lg w-1/4 bg-surface-container">
                    Specification / Feature
                  </th>
                  <th className="py-space-md px-space-lg w-1/4 bg-gradient-to-r from-primary-container to-secondary text-on-primary font-bold">
                    <span className="flex items-center gap-2">
                      <I n="star" c="text-[18px]" />
                      PRIMO CLOUD Reseller
                    </span>
                  </th>
                  <th className="py-space-md px-space-lg w-1/4 bg-surface-container text-on-surface-variant">
                    Legacy Reseller (GoDaddy/HostGator)
                  </th>
                  <th className="py-space-md px-space-lg w-1/4 bg-surface-container text-on-surface-variant">
                    Generic Cloud VPS (DO/Linode)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-variant/40">
                {compare.map(([a, b, c, d]) => (
                  <tr
                    key={a}
                    className="hover:bg-secondary-container/10 transition-colors"
                  >
                    <td className="py-space-md px-space-lg font-semibold text-on-surface">
                      {a}
                    </td>
                    <td className="py-space-md px-space-lg font-bold text-primary bg-primary-container/5">
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

        {/* 7 WHM CONSOLE */}
        <Sec id="whm-demo">
          <Head
            pill="Granular Agency Control"
            title="Purpose-Built WHM Administration Console"
            sub="Manage 5 or 500 client hosting accounts seamlessly through a unified interface."
          />
          <div className="w-full rounded-xl bg-surface-container-lowest border border-outline-variant shadow-2xl overflow-hidden flex flex-col md:flex-row">
            <div className="w-full md:w-64 bg-surface-container-low p-space-md flex flex-col gap-space-md">
              <div className="flex items-center gap-space-xs pb-space-sm border-b border-surface-variant/40">
                <I n="tune" c="text-primary text-[24px]" />
                <span className="font-headline-sm text-[16px] font-bold text-on-surface">
                  WebHost Manager
                </span>
              </div>
              {whmNav.map(([group, items]) => (
                <div key={group} className="flex flex-col gap-1">
                  <span className="font-label-sm text-[11px] uppercase tracking-wider text-on-surface-variant font-bold mb-1">
                    {group}
                  </span>
                  {items.map(([n, t]) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setNavActive(t)}
                      className={`flex items-center gap-space-xs px-space-sm py-1.5 rounded-lg font-label-sm text-left transition-colors ${navActive === t ? "bg-secondary-container/50 text-on-surface font-semibold" : "text-on-surface-variant hover:bg-surface-container"}`}
                    >
                      <I
                        n={n}
                        c={`text-[18px] ${navActive === t ? "text-primary" : ""}`}
                      />
                      <span>{t}</span>
                    </button>
                  ))}
                </div>
              ))}
              <div className="mt-auto p-space-sm rounded-lg bg-surface-container text-[11px] font-mono-code text-on-surface-variant">
                <span>WHM v118.0.12</span>
                <br />
                <span className="text-primary font-bold">
                  Node Health: 100%
                </span>
              </div>
            </div>
            <div className="flex-1 p-space-lg flex flex-col gap-space-lg">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-space-sm">
                <div>
                  <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                    Server Cluster Health & Quick Controls
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Immediate operational telemetry for cluster:{" "}
                    <span className="font-mono-code text-primary">
                      us-east-whm01
                    </span>
                  </p>
                </div>
                <span className="px-space-sm py-1 rounded-full bg-surface-container font-mono-code text-mono-code text-on-surface font-semibold">
                  Load: 0.42, 0.38, 0.31
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-md">
                {[
                  ["Apache / LiteSpeed Worker Load", "6.8%", 6.8],
                  ["Node Memory Consumption", "4.2 GB / 64 GB", 12],
                  ["NVMe Storage Utilized", "68% allocated", 68],
                ].map(([l, v, w]) => (
                  <div
                    key={l}
                    className="p-space-md rounded-lg bg-surface-container-low border border-outline-variant flex flex-col gap-1"
                  >
                    <span className="font-label-sm text-label-sm text-on-surface-variant">
                      {l}
                    </span>
                    <span className="font-headline-sm text-headline-sm font-bold text-on-surface">
                      {v}
                    </span>
                    <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden mt-1">
                      <div
                        className="bg-gradient-to-r from-primary-container to-secondary h-full transition-[width] duration-1000 ease-out"
                        style={{ width: on ? `${w}%` : "0%" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div>
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold mb-space-xs block">
                  1-Click Client Management Operations
                </span>
                <div className="flex flex-wrap gap-space-xs">
                  {whmActions.map(([n, t, danger]) => (
                    <button
                      key={t}
                      className="px-space-md py-space-xs rounded-lg bg-surface-container text-on-surface font-label-sm hover:bg-surface-container-high hover:-translate-y-0.5 transition-all flex items-center gap-1"
                    >
                      <I
                        n={n}
                        c={`text-[16px] ${danger ? "text-error" : "text-primary"}`}
                      />
                      <span>{t}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Sec>

        {/* 8 TESTIMONIALS */}
        <Sec bg="bg-surface-container-low">
          <Head
            pill="Agency Proof"
            title="Trusted by Over 2,400+ Web Agencies Globally"
            sub="Read verified experiences from founders and technical directors who switched to PRIMO CLOUD."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            {reviews.map(([i, n, r, t]) => (
              <div
                key={n}
                className="p-space-lg rounded-xl bg-surface-container-lowest border border-outline-variant shadow-sm relative flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 hover:border-primary-container/40 transition-all duration-300"
              >
                <div>
                  <div className="flex items-center gap-1 text-primary mb-space-sm">
                    {[...Array(5)].map((_, k) => (
                      <I key={k} n="star" c="text-[20px]" />
                    ))}
                  </div>
                  <I
                    n="format_quote"
                    c="absolute top-4 right-5 text-[56px] text-primary-container/15"
                  />
                  <p className="relative font-body-md text-body-md text-on-surface leading-relaxed mb-space-md italic">
                    {t}
                  </p>
                </div>
                <div className="flex items-center gap-space-sm pt-space-sm border-t border-surface-variant/30">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-container to-secondary flex items-center justify-center font-bold text-on-primary font-headline-sm">
                    {i}
                  </div>
                  <div>
                    <span className="flex items-center gap-1 font-label-md text-label-md font-bold text-on-surface">
                      {n}
                      <I n="verified" c="text-[16px] text-primary-container" />
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      {r}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Sec>

        {/* 9 FAQ */}
        <Sec>
          <Head
            pill="Technical Queries"
            title="Frequently Asked Questions"
            sub="Clear, concise engineering answers for agency founders and dev leads."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
            {faqs.map(([q, a], i) => (
              <div key={q} className={`p-space-md ${cardHover}`}>
                <h4 className="font-headline-sm text-[16px] font-bold text-on-surface flex items-center justify-between gap-3">
                  <span>
                    {i + 1}. {q}
                  </span>
                  <I
                    n="help_outline"
                    c="text-primary text-[20px] shrink-0 transition-transform duration-300 group-hover:rotate-12"
                  />
                </h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-space-xs leading-relaxed">
                  {a}
                </p>
              </div>
            ))}
          </div>
        </Sec>

        {/* 10 CTA */}
        <section className="w-full bg-surface py-space-xl">
          <div className="max-w-7xl mx-auto px-margin-mobile lg:px-margin">
            <div className="rounded-xl bg-gradient-to-br from-primary-container via-secondary to-primary-container bg-[length:200%_200%] animate-[shimmer_10s_linear_infinite] p-space-xl md:p-20 text-on-primary shadow-2xl shadow-primary/20 relative overflow-hidden flex flex-col items-center text-center">
              <div className="absolute inset-0 opacity-10 pointer-events-none bg-[linear-gradient(#fff_1.5px,transparent_1.5px),linear-gradient(90deg,#fff_1.5px,transparent_1.5px)] bg-[size:60px_60px]" />
              <span className="pointer-events-none absolute -left-10 top-6 h-40 w-40 rounded-full bg-white/10 animate-float" />
              <span className="pointer-events-none absolute -right-8 bottom-4 h-52 w-52 rounded-full bg-white/10 animate-float [animation-delay:1.5s]" />
              <div className="relative max-w-3xl flex flex-col items-center">
                <div className="inline-flex items-center gap-space-xs px-space-md py-space-xs rounded-full bg-on-primary/10 backdrop-blur-md mb-space-md text-[12px] font-mono-code font-semibold tracking-wider uppercase">
                  <I n="verified" c="text-[16px]" />
                  <span>Enterprise White-Label Infrastructure</span>
                </div>
                <h2 className="font-display-lg text-display-lg-mobile md:text-display-lg font-bold tracking-tight text-on-primary mb-space-md">
                  Ready to Scale Your Agency's Recurring Hosting Revenue?
                </h2>
                <p className="font-body-lg text-body-lg text-on-primary/90 max-w-2xl mb-space-xl leading-relaxed">
                  Deploy your high-speed white-label reseller node in under 60
                  seconds with our unconditional 30-day money-back guarantee.
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-space-md w-full sm:w-auto mb-space-lg">
                  <a
                    href="#pricing"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-space-xs px-space-xl py-space-md rounded-lg bg-surface-container-lowest text-on-surface font-label-lg text-label-lg shadow-xl hover:bg-surface-container hover:-translate-y-0.5 transition-all font-bold"
                  >
                    <span>Deploy Reseller Account Now</span>
                    <I n="arrow_forward" c="text-[18px] text-primary" />
                  </a>
                  <a
                    href="tel:+917000250584"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-space-xs px-space-xl py-space-md rounded-lg bg-on-primary/10 text-on-primary hover:bg-on-primary/20 transition-all font-label-lg text-label-lg font-semibold border border-on-primary/30"
                  >
                    <I n="headset_mic" c="text-[18px]" />
                    <span>Talk to an Agency Specialist</span>
                  </a>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-space-md text-[13px] font-mono-code text-on-primary/80">
                  {[
                    "99.99% Uptime SLA",
                    "Instant 60s Activation",
                    "Free White-Glove Migration",
                  ].map((t) => (
                    <span key={t} className="flex items-center gap-1">
                      <I n="check_circle" c="text-[16px]" />
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

export default ResellerHosting;
