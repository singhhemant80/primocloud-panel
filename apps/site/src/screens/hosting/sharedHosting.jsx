import { orderUrl } from "../../lib/panel";
import React, { useState, useEffect, useRef } from "react";
import Layout from "../../components/layout";
import { useMotion } from "../../components/motion";
import { useCurrency } from "../../context/CurrencyContext";
import { I, Pill, Sec, Head, cardHover, IconBox } from "../../components/ui";

// ---------- content (taken from the HTML design) ----------
const metrics = [
  ["verified_user", "99.9%", "SLA Uptime"],
  ["bolt", "20x Faster", "LiteSpeed Engine"],
  ["speed", "<200ms", "TTFB Response"],
  ["layers", "400+ Apps", "1-Click Auto Install"],
];
const pillars = [
  [
    "hard_drive",
    "Pure PCIe 4.0 NVMe Storage",
    "Up to 7,000 MB/s read/write speeds, delivering instantaneous database queries, instant image uploads, and lightning-fast WordPress load times.",
    "Gen4 NVMe RAID 10",
  ],
  [
    "speed",
    "LiteSpeed Enterprise + LSCache",
    "Built-in server-level caching plugin integration for WordPress, WooCommerce, Joomla, and Magento that outperforms Apache and Nginx by up to 20x.",
    "HTTP/3 & QUIC Enabled",
  ],
  [
    "lock",
    "CloudLinux CageFS Isolation",
    "Each tenant is locked in a virtualized container with dedicated CPU, RAM, and I/O limits so neighboring sites can never slow you down or compromise security.",
    "Zero Noisy-Neighbor Effect",
  ],
  [
    "history",
    "Automated Daily JetBackup",
    "30 days of point-in-time automated snapshots with 1-click single file, database, or full cPanel account restoration directly from your dashboard.",
    "30-Day Point Recovery",
  ],
];
// **bold** markers; a leading ">" highlights the line in green
const plans = [
  {
    tier: "Tier 1",
    n: "Starter", slug: "shared-starter",
    d: "Ideal for personal blogs, portfolios, and single websites.",
    p: [2.99, 3.75],
    cta: "Deploy Starter",
    s: [
      "**1 Website**",
      "**15 GB** Pure NVMe Storage",
      "Unmetered Bandwidth",
      "10 Business Email Accounts",
      "Free Let's Encrypt Wildcard SSL",
      "1 vCPU • 1 GB RAM CageFS Cap",
      "cPanel + Softaculous 1-Click",
    ],
  },
  {
    tier: "Tier 2",
    n: "Business", slug: "shared-business",
    feat: true,
    d: "Engineered for growing businesses, clients & e-commerce.",
    p: [5.99, 7.49],
    cta: "Deploy Business",
    s: [
      ">**Unlimited Websites**",
      "**50 GB** Pure NVMe Storage",
      "Unmetered Bandwidth",
      "Unlimited Business Emails",
      "**Free Domain Name** (1st Year)",
      "2 vCPU • 2 GB RAM + LiteSpeed Cache",
      "JetBackup 30-Day Snapshot Retention",
    ],
  },
  {
    tier: "Tier 3",
    n: "Turbo Pro", slug: "shared-turbo-pro",
    d: "High-traffic WooCommerce, busy blogs & power users.",
    p: [9.99, 12.49],
    cta: "Deploy Turbo Pro",
    s: [
      "**Unlimited Websites**",
      "**100 GB** Pure NVMe Storage",
      "Unthrottled 600,000 Inodes",
      "Free Domain + **Dedicated IP**",
      "3 vCPU • 4 GB RAM Turbo Compute",
      "Redis & Memcached Object Caching",
      "VIP Priority 24/7/365 Support SLA",
    ],
  },
  {
    tier: "Tier 4",
    n: "Enterprise Cloud", slug: "shared-enterprise-cloud",
    d: "Mission-critical corporate sites with highest isolated limits.",
    p: [17.99, 22.5],
    cta: "Deploy Enterprise",
    s: [
      "**Unlimited Websites**",
      "**Unlimited** NVMe Enterprise Disk",
      "Dedicated IPv4 & IPv6 Subnet",
      "4 vCPU • 8 GB RAM CageFS Cap",
      "Imunify360 Proactive Defense WAF",
      "Staging Envs & Git Version Control",
      "Dedicated Account Mgr + Migration",
    ],
  },
];
const planTrust = [
  ["verified", "30-Day Unconditional Money-Back Guarantee"],
  ["move_up", "Free Zero-Downtime Migration from cPanel/Plesk"],
  ["electric_bolt", "Instant Automated Provisioning in <30 Seconds"],
];
const stack = [
  [
    "wifi_tethering",
    "Next-Gen Web",
    "HTTP/3 & QUIC Protocol Support",
    "Future-proof protocol delivering multiplexed packet streams over UDP with zero head-of-line blocking on modern browsers for faster mobile render times.",
  ],
  [
    "security",
    "AI Protection",
    "Imunify360 Proactive Defense",
    "Real-time automated malware scanning, auto-cleanup scripts, aggressive brute-force shielding, and an integrated AI-driven Web Application Firewall.",
  ],
  [
    "code",
    "Flexible Runtime",
    "Multi-PHP Selector (7.4 to 8.3)",
    "Switch PHP versions per directory, modify memory limits, tweak execution time, upload max filesizes, and enable custom PECL extensions in one click.",
  ],
  [
    "install_desktop",
    "Instant Deploy",
    "Softaculous 1-Click Installer",
    "Instant deployment of 400+ scripts including WordPress, WooCommerce, Drupal, Joomla, PrestaShop, Laravel, and phpBB with automated upgrade workflows.",
  ],
  [
    "public",
    "Low Latency",
    "Free Anycast DNS & Global CDN",
    "Ultra-fast DNS resolution powered by globally distributed Anycast edge nameservers, plus 1-click Cloudflare CDN routing for worldwide cached delivery.",
  ],
  [
    "mail",
    "Deliverability",
    "Enterprise Email & SpamAssassin",
    "High-reputation IP delivery clusters with automated SPF, DKIM, and DMARC record signing, complemented by responsive modern webmail access.",
  ],
];
const tools = [
  ["dashboard_customize", "WP Toolkit", "1-Click Staging & Scan"],
  ["folder_open", "File Manager", "Web FTP & Unzip"],
  ["database", "phpMyAdmin", "Direct SQL Ops"],
  ["alternate_email", "Email Accounts", "DKIM / Webmail"],
  ["flash_on", "LiteSpeed Cache", "Crawler & Purge"],
  ["settings_backup_restore", "JetBackup 5", "Point Restores"],
];
const compare = [
  [
    "Web Server Architecture",
    "LiteSpeed Enterprise (HTTP/3 + QUIC)",
    "Apache / Nginx Reverse Proxy",
    "Legacy Apache 2.4 (Slow worker threads)",
  ],
  [
    "Storage Technology",
    "Pure PCIe 4.0 NVMe (7,000 MB/s)",
    "SATA SSD (500 MB/s cap)",
    "Mechanical HDD / Hybrid SAS",
  ],
  [
    "Tenant Isolation Guard",
    "CloudLinux CageFS (Guaranteed RAM/CPU)",
    "Shared Pool (Noisy neighbors affect you)",
    "Zero Isolation (Heavy throttling)",
  ],
  [
    "Caching Mechanism",
    "Native LSCache + Redis / Memcached",
    "Standard PHP OPCache / Plugin Cache",
    "None (Heavy SQL bottlenecks)",
  ],
  [
    "Automated Backups",
    "Free Daily JetBackup (30-Day Snapshots)",
    "Paid Add-on ($3.99 – $5.99/mo)",
    "Manual backup downloads only",
  ],
  [
    "Security & WAF Defense",
    "Imunify360 AI + Real-time Auto Cleanup",
    "Basic ModSecurity (Paid SiteLock upcharge)",
    "No proactive scanner (Account suspended if hacked)",
  ],
  [
    "Renewal Billing Policy",
    "Transparent Flat Renewals (No Price Shocks)",
    "300% – 500% renewal price hike",
    "Forced upsells to avoid CPU suspensions",
    true,
  ],
];
const cms = [
  ["view_in_ar", "WordPress"],
  ["shopping_cart", "WooCommerce"],
  ["terminal", "Laravel (PHP 8.3)"],
  ["memory", "Node.js Selector"],
  ["code_blocks", "Python / Django"],
  ["storefront", "PrestaShop"],
  ["dataset", "Drupal 10"],
  ["shopping_bag", "OpenCart"],
  ["article", "Ghost CMS"],
];
const reviews = [
  [
    "AK",
    "Alexandre Keller",
    "Managing Partner, StudioNordic",
    "bg-primary text-on-primary",
    '"We moved 28 client WordPress sites from Bluehost to PRIMO CLOUD Turbo Pro. Our average Time-to-First-Byte dropped from 840ms down to 180ms without changing any plugins. The LiteSpeed cache module is simply magic."',
  ],
  [
    "ML",
    "Marcus Lindqvist",
    "Operations Director, PureActive Apparel",
    "bg-secondary text-on-secondary",
    '"During Black Friday, our WooCommerce store handled 3,400 concurrent checkouts without a single 504 error. On standard shared hosting, we were getting throttled constantly. CloudLinux CageFS guarantees are genuine."',
  ],
  [
    "SR",
    "Samantha Reyes",
    "Freelance Full-Stack Developer",
    "bg-tertiary text-on-tertiary",
    '"Their zero-downtime migration team completed our cPanel-to-cPanel transfer at 11 PM on a Sunday within 40 minutes. No broken SSL certificates, no DNS propagation issues, and live chat answered in 2 minutes."',
  ],
];
const faqs = [
  [
    "How does LiteSpeed Shared Hosting compare to standard shared hosting?",
    "Standard shared hosting relies on Apache or Nginx reverse proxies with multi-process bottlenecks. LiteSpeed Enterprise uses an asynchronous event-driven architecture that natively handles thousands of concurrent connections with minimal memory and integrates with LSCache to serve dynamic pages as static files instantly.",
  ],
  [
    "Do you offer free website migration from my current hosting provider?",
    "Yes, 100% free white-glove migration is included with all plans. Our migration engineers safely transfer all files, MySQL databases, email mailboxes, and DNS settings from any cPanel, Plesk, DirectAdmin, or custom Linux host with zero downtime.",
  ],
  [
    "Are my resources isolated from other websites on the same server?",
    "Yes. We enforce CloudLinux OS CageFS kernel virtualization. Each tenant has a dedicated virtual environment with dedicated memory, CPU cores, I/O bandwidth, and process allocations. A traffic spike on another site will never impact your page speed or availability.",
  ],
  [
    "Is a free domain name and SSL certificate included?",
    "Business, Turbo Pro, and Enterprise Cloud annual plans include a free domain registration or transfer (.com, .net, .org, .co) for the first year. In addition, automatic Wildcard Let's Encrypt SSL certificates are issued and renewed automatically for all domains and subdomains.",
  ],
  [
    "Can I upgrade to a VPS or Dedicated Server later as my site grows?",
    "Seamless 1-click upgrades are supported. When your traffic requires dedicated kernel control or higher compute resources, we migrate your shared account directly to a PRIMO CLOUD Managed Cloud VPS or Dedicated Server with identical configuration and zero data loss.",
  ],
  [
    "What is the difference between NVMe SSD and traditional SATA SSD?",
    "Traditional SATA SSDs are limited by legacy controller buses to ~550 MB/s transfer speeds and high queue latencies. Our PCIe 4.0 NVMe drives interface directly with CPU lanes, achieving sustained reads/writes of up to 7,000 MB/s and 1,000,000 IOPS for instantaneous MySQL operations.",
  ],
  [
    "How often are backups taken and how do I restore them?",
    "JetBackup runs automatically every 24 hours to create encrypted snapshots of your entire account, retained off-site for 30 consecutive days. You can restore individual files, directories, databases, cron jobs, or complete accounts with 1 click from your cPanel interface.",
  ],
  [
    "Which PHP versions and extensions are supported?",
    "We support PHP 7.4 through PHP 8.3 with hardened security backports for legacy code. All modern extensions including OPcache, Redis, Memcached, Imagick, IonCube Loader, BCMath, and Sodium are fully configurable via the cPanel MultiPHP Selector.",
  ],
  [
    "Do you provide business email accounts with webmail access?",
    "Yes. Every plan includes professional domain-based email addresses (e.g., info@yourcompany.com). Access mail via secure IMAP/POP3/SMTP on Outlook, Apple Mail, or mobile devices, or use the integrated Roundcube webmail portal with SpamAssassin filtering.",
  ],
  [
    "What is your refund policy and uptime SLA?",
    "All shared hosting plans are backed by an unconditional 30-day money-back guarantee. If you are not satisfied for any reason, request a full refund with no questions asked. Our hardware and network are guaranteed under a 99.9% uptime SLA with real-time public telemetry.",
  ],
];

// "**bold** text" -> JSX
const rich = (s) =>
  s.split("**").map((t, i) => (i % 2 ? <strong key={i}>{t}</strong> : t));

const useJitter = (base, spread, ms = 1800) => {
  const [v, setV] = useState(base);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(
      () => setV(Math.round(base + (Math.random() - 0.5) * spread * 2)),
      ms,
    );
    return () => clearInterval(t);
  }, [base, spread, ms]);
  return v;
};

const Row = ({ icon, label, children }) => (
  <div className="flex justify-between items-center gap-2 text-surface-dim">
    <span className="flex items-center gap-1.5 text-on-primary">
      <I n={icon} c="text-[16px] text-primary-fixed-dim" />
      {label}
    </span>
    {children}
  </div>
);

const SharedHosting = () => {
  const rootRef = useRef(null);
  useMotion(rootRef);
  const { fmt } = useCurrency();
  const [annual, setAnnual] = useState(true);
  const [tool, setTool] = useState(0);
  const [on, setOn] = useState(false);
  const ttfb = useJitter(112, 6);
  const ping = useJitter(12, 2);
  useEffect(() => {
    const t = setTimeout(() => setOn(true), 300);
    return () => clearTimeout(t);
  }, []);
  const seg =
    "px-5 py-2 rounded-full font-label-md text-label-md transition-all";

  return (
    <Layout>
      <div ref={rootRef} className="flex flex-col w-full">
        {/* 1 HERO */}
        <section className="relative overflow-hidden bg-gradient-to-b from-surface-container-low via-background to-surface pt-12 pb-20 px-margin-mobile lg:px-margin">
          <div className="pointer-events-none absolute -top-40 right-0 h-96 w-96 rounded-full bg-primary-container/10 blur-3xl" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,rgba(11,175,96,0.18)_1px,transparent_1px)] bg-[size:28px_28px] [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_70%)]" />
          <div className="relative max-w-7xl mx-auto flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary-container/60 border border-secondary-container shadow-sm mb-6">
              <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse" />
              <span className="font-label-md text-label-md text-on-secondary-container tracking-wide uppercase font-semibold">
                ⚡ Ultra-Fast NVMe LiteSpeed • Free Domain & SSL • 99.9% Uptime
                Guarantee
              </span>
            </div>
            <h1 className="font-display-lg text-display-lg text-on-surface max-w-4xl tracking-tight leading-tight mb-6">
              Enterprise-Speed Shared Web Hosting: Powered by{" "}
              <span className="bg-gradient-to-r from-primary-container via-secondary to-primary-container bg-[length:200%_auto] bg-clip-text text-transparent font-extrabold animate-[shimmer_4s_linear_infinite]">
                LiteSpeed
              </span>{" "}
              & Pure NVMe
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-3xl mb-8 leading-relaxed">
              Host your websites on calibrated enterprise hardware with
              LiteSpeed Enterprise Web Server, LSCache acceleration, isolated
              CloudLinux OS environments, and automated daily backups. 20x
              faster page loads with zero noisy neighbor friction.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
              <a
                href="#pricing-matrix"
                className="group relative overflow-hidden inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-primary-container to-secondary text-on-primary font-label-lg text-label-lg transition-all shadow-md shadow-primary-container/30 hover:shadow-lg hover:-translate-y-0.5 before:absolute before:inset-y-0 before:-left-full before:w-1/2 before:skew-x-[-20deg] before:bg-white/30 hover:before:left-[150%] before:transition-all before:duration-700"
              >
                <span>Deploy Hosting Now</span>
                <I n="arrow_forward" c="text-[18px]" />
              </a>
              <a
                href="#benchmark-table"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-surface-container-lowest border border-outline-variant hover:bg-secondary-container/20 hover:border-primary-container/50 text-on-surface font-label-lg text-label-lg transition-all shadow-sm"
              >
                <span>Compare Plans & Specs</span>
                <I n="tune" c="text-[18px]" />
              </a>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl mb-12">
              {metrics.map(([n, a, b]) => (
                <div
                  key={a}
                  className="flex items-center justify-center gap-3 py-3 px-4 rounded-lg bg-surface-container-lowest border border-outline-variant shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
                >
                  <I n={n} c="text-primary-container text-[22px]" />
                  <span className="font-headline-sm text-headline-sm text-on-surface text-left">
                    {a}{" "}
                    <span className="font-body-sm text-body-sm text-on-surface-variant block font-normal">
                      {b}
                    </span>
                  </span>
                </div>
              ))}
            </div>

            <div className="w-full max-w-4xl rounded-xl bg-inverse-surface text-inverse-on-surface shadow-2xl shadow-primary/10 p-5 text-left font-mono-code text-mono-code relative overflow-hidden animate-float">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-4 bg-surface-container-highest/10 px-3 py-2 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                  <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                  <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
                  <span className="ml-2 font-mono-code text-label-sm text-surface-dim font-bold tracking-wider">
                    CLUSTER NODE: shared-cpanel-eu01.primocloud
                  </span>
                </div>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-label-sm bg-primary/40 text-primary-fixed font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-fixed-dim mr-1.5 animate-ping" />
                  HTTP/3 QUIC ACTIVE
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-body-sm">
                <div className="space-y-2 bg-surface-container-highest/5 border border-white/10 p-3 rounded-lg">
                  <Row icon="dns" label="Web Server Core:">
                    <span className="text-primary-fixed font-semibold">
                      LiteSpeed Ent v6.2.2
                    </span>
                  </Row>
                  <Row icon="memory" label="PHP 8.3 OPcache Hit:">
                    <span className="text-primary-fixed font-semibold">
                      99.4% HIT RATE
                    </span>
                  </Row>
                  <Row icon="speed" label="LSCache Dynamic TTFB:">
                    <span className="text-primary-fixed font-semibold">
                      {ttfb} ms (Sub-120ms)
                    </span>
                  </Row>
                </div>
                <div className="space-y-2 bg-surface-container-highest/5 border border-white/10 p-3 rounded-lg">
                  <Row icon="shield" label="CloudLinux CageFS:">
                    <span className="text-primary-fixed font-semibold">
                      100% Isolated LVE
                    </span>
                  </Row>
                  <Row icon="hub" label="Tenant Resource Cap:">
                    <span className="text-surface-bright">
                      2 Cores / 2GB RAM / 0% Impact
                    </span>
                  </Row>
                  <Row icon="security" label="DDoS Mitigation Line:">
                    <span className="text-primary-fixed font-semibold">
                      Arbor Clean (1.2 Tbps Filter)
                    </span>
                  </Row>
                </div>
              </div>
              <div className="mt-3 pt-3 flex flex-wrap items-center justify-between gap-2 text-label-sm text-surface-dim">
                <div className="flex items-center gap-2">
                  <span className="text-primary-fixed-dim">sys_stat:</span> All
                  storage drives operating via Gen4 PCIe NVMe arrays with RAID
                  10 parity.
                </div>
                <div className="font-mono-code text-surface-dim">
                  Last Ping: {ping}ms (EU-Central)
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2 PILLARS */}
        <Sec bg="bg-surface-container-lowest">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <Pill>Hardware & Virtualization Foundation</Pill>
              <h2 className="font-headline-xl text-headline-xl text-on-surface mt-space-sm">
                Engineered for Unthrottled Speed and Isolation
              </h2>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-md">
              Unlike commodity legacy hosts, every shared account operates
              within dedicated containerized limits over pure enterprise
              infrastructure.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map(([n, t, d, f]) => (
              <div key={t} className={`flex flex-col p-6 ${cardHover}`}>
                <IconBox
                  n={n}
                  size="w-12 h-12 rounded-lg"
                  fs="text-[28px]"
                  mb="mb-5"
                />
                <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2 font-bold">
                  {t}
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed mb-4">
                  {d}
                </p>
                <div className="mt-auto pt-4 flex items-center text-label-sm font-label-sm text-primary font-bold">
                  <span>{f}</span>
                  <I
                    n="trending_flat"
                    c="text-[16px] ml-1 transition-transform duration-300 group-hover:translate-x-1"
                  />
                </div>
              </div>
            ))}
          </div>
        </Sec>

        {/* 3 PRICING */}
        <Sec bg="bg-surface-container-low" id="pricing-matrix">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <Pill>Clear Transparent Pricing</Pill>
            <h2 className="font-headline-xl text-headline-xl text-on-surface mt-space-sm mb-2">
              High-Velocity Shared Web Hosting Plans
            </h2>
            <div className="mx-auto mb-4 h-1 w-16 rounded-full bg-gradient-to-r from-primary-container to-secondary" />
            <p className="font-body-lg text-body-lg text-on-surface-variant">
              Select an enterprise plan with NVMe storage, CloudLinux isolation,
              and LiteSpeed caching. No lock-in, flat renewals, and zero hidden
              upsells.
            </p>
            <div className="mt-8 inline-flex items-center p-1.5 rounded-full bg-surface-container-highest shadow-inner">
              <button
                type="button"
                onClick={() => setAnnual(false)}
                className={`${seg} ${!annual ? "bg-surface-container-lowest text-primary shadow-sm font-bold" : "text-on-surface"}`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setAnnual(true)}
                className={`${seg} flex items-center gap-1.5 ${annual ? "bg-surface-container-lowest text-primary shadow-sm font-bold" : "text-on-surface"}`}
              >
                <span>Annual Billing</span>
                <span className="px-2 py-0.5 rounded-full bg-primary-container text-on-primary font-label-sm text-label-sm">
                  Save 20%
                </span>
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {plans.map((p) => {
              const price = p.p[annual ? 0 : 1];
              return (
                <div
                  key={p.n}
                  className={`flex flex-col rounded-xl p-6 relative ${p.feat ? "bg-gradient-to-b from-secondary-container/20 to-surface-container-lowest ring-2 ring-primary-container shadow-2xl shadow-primary-container/25 lg:scale-105 z-10" : "bg-surface-container-lowest border border-outline-variant shadow-sm hover:shadow-xl hover:border-primary-container/40 transition-all duration-300"}`}
                >
                  {p.feat && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-primary-container text-on-primary px-3 py-1 rounded-full font-label-sm text-label-sm uppercase font-bold tracking-wider shadow-sm whitespace-nowrap">
                      ★ Most Popular
                    </div>
                  )}
                  <div className={`mb-4 ${p.feat ? "mt-2" : ""}`}>
                    <span
                      className={`font-label-sm text-label-sm uppercase font-semibold ${p.feat ? "text-primary font-bold" : "text-on-surface-variant"}`}
                    >
                      {p.tier}
                    </span>
                    <h3 className="font-headline-md text-headline-md text-on-surface font-bold">
                      {p.n}
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                      {p.d}
                    </p>
                  </div>
                  <div
                    className={`mb-6 py-4 rounded-lg px-4 ${p.feat ? "bg-secondary-container/30" : "bg-surface-container-low"}`}
                  >
                    <div className="flex items-baseline">
                      <span
                        className={`font-display-lg text-display-lg font-bold tracking-tight ${p.feat ? "text-primary" : "text-on-surface"}`}
                      >
                        {fmt(price)}
                      </span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant ml-1.5">
                        /month
                      </span>
                    </div>
                    <span className="font-body-sm text-body-sm text-primary font-semibold">
                      {annual
                        ? `Billed annually (${fmt(p.p[0] * 12)}/yr)`
                        : "Billed monthly"}
                    </span>
                  </div>
                  <ul className="space-y-3 font-body-sm text-body-sm text-on-surface mb-8 flex-1">
                    {p.s.map((x) => {
                      const hl = x.startsWith(">");
                      return (
                        <li
                          key={x}
                          className={`flex items-center gap-2 ${hl ? "text-primary font-bold" : ""}`}
                        >
                          <I
                            n="check_circle"
                            c="text-primary-container text-[18px] shrink-0"
                          />
                          <span>{rich(hl ? x.slice(1) : x)}</span>
                        </li>
                      );
                    })}
                  </ul>
                  <a
                    href={/^Contact/.test(p.cta ?? "") ? "/contact" : orderUrl(p.slug, annual)}
                    className={`w-full px-4 rounded-lg font-label-md text-label-md text-center transition-all ${p.feat ? "py-3 bg-gradient-to-r from-primary-container to-secondary text-on-primary shadow-md shadow-primary-container/30 hover:-translate-y-0.5" : "py-2.5 bg-surface-container-high hover:bg-primary-container hover:text-on-primary text-on-surface"}`}
                  >
                    {p.cta}
                  </a>
                </div>
              );
            })}
          </div>
          <div className="mt-12 p-4 rounded-xl bg-surface-container-lowest border border-outline-variant shadow-sm flex flex-wrap items-center justify-around gap-4 text-center">
            {planTrust.map(([n, t]) => (
              <div key={t} className="flex items-center gap-2">
                <I n={n} c="text-primary-container text-[20px]" />
                <span className="font-label-md text-label-md text-on-surface">
                  {t}
                </span>
              </div>
            ))}
          </div>
        </Sec>

        {/* 4 STACK */}
        <Sec bg="bg-surface-container-lowest">
          <Head
            pill="Modern Cloud Architecture"
            title="The Complete Speed & Security Stack"
            sub="Built into every single shared plan without premium add-on fees. Enterprise performance standards as defaults."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {stack.map(([n, tag, t, d]) => (
              <div key={t} className={`p-6 ${cardHover}`}>
                <div className="flex items-center justify-between mb-4">
                  <IconBox
                    n={n}
                    size="w-10 h-10 rounded-lg"
                    fs="text-[24px]"
                    mb=""
                  />
                  <span className="px-2 py-0.5 rounded text-label-sm bg-secondary-container/40 text-on-secondary-container font-semibold">
                    {tag}
                  </span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2 font-bold">
                  {t}
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  {d}
                </p>
              </div>
            ))}
          </div>
        </Sec>

        {/* 5 CPANEL MOCK */}
        <Sec bg="bg-surface-container-low">
          <Head
            pill="Intuitive Management"
            title="Modern, Full-Featured cPanel Dashboard"
            sub="Complete graphical control over your databases, subdomains, file managers, LiteSpeed cache hooks, and security keys."
          />
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-2xl overflow-hidden max-w-5xl mx-auto">
            <div className="bg-surface-container-highest px-6 py-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-error" />
                  <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                  <div className="w-3 h-3 rounded-full bg-primary-container" />
                </div>
                <span className="font-mono-code text-label-sm text-on-surface-variant ml-2">
                  cPanel Control Panel v118.0 • yourdomain.com
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono-code text-label-sm bg-surface-container-lowest px-2.5 py-1 rounded text-on-surface shadow-sm">
                  Server IP: 185.190.44.20
                </span>
                <a
                  href="#"
                  className="px-3 py-1 rounded bg-primary-container hover:bg-primary text-on-primary font-label-sm text-label-sm transition-colors"
                >
                  Enter Live Demo
                </a>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 p-6 gap-6">
              <div className="lg:col-span-4 bg-surface-container-low border border-outline-variant p-5 rounded-xl space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-surface-container">
                  <span className="font-label-md text-label-md text-on-surface font-bold">
                    General Information
                  </span>
                  <span className="px-2 py-0.5 rounded text-label-sm bg-secondary-container text-on-secondary-container font-semibold">
                    Active
                  </span>
                </div>
                {[
                  ["Disk Usage (NVMe)", "12.4 GB / 50 GB", 25],
                  ["Bandwidth Consumption", "145 GB / Unmetered", 14],
                  ["File Count (Inodes)", "42,000 / 600,000", 7],
                ].map(([l, v, w]) => (
                  <div key={l} className="space-y-1.5">
                    <div className="flex justify-between font-label-sm text-label-sm text-on-surface">
                      <span>{l}</span>
                      <span className="font-bold">{v}</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-surface-container-highest overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-primary-container to-secondary h-full rounded-full transition-[width] duration-1000 ease-out"
                        style={{ width: on ? `${w}%` : "0%" }}
                      />
                    </div>
                  </div>
                ))}
                <div className="pt-3 border-t border-surface-container space-y-2 font-mono-code text-label-sm text-on-surface-variant">
                  <div className="flex justify-between">
                    <span>PHP Version:</span>
                    <span className="font-semibold text-primary">
                      8.3.4 (LiteSpeed SAPI)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>MySQL Databases:</span>
                    <span className="font-semibold text-on-surface">
                      6 / Unlimited
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>SSL Auto-Renew:</span>
                    <span className="font-semibold text-primary">
                      Active (Let's Encrypt)
                    </span>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
                      Frequently Used Tools
                    </span>
                    <span className="font-label-sm text-label-sm text-primary font-semibold flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse" />{" "}
                      CloudLinux LVE OK
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
                    {tools.map(([n, t, s], i) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setTool(i)}
                        className={`p-3.5 rounded-lg border flex flex-col items-center text-center transition-all hover:-translate-y-0.5 ${tool === i ? "bg-secondary-container/30 border-primary-container shadow-md" : "bg-surface-container-low border-outline-variant hover:bg-secondary-container/20"}`}
                      >
                        <I n={n} c="text-primary-container text-[28px] mb-1" />
                        <span className="font-label-md text-label-md text-on-surface font-bold">
                          {t}
                        </span>
                        <span className="font-body-sm text-body-sm text-on-surface-variant">
                          {s}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-surface-container flex flex-wrap items-center justify-between gap-3">
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    Logged in as <strong>cloudu_demo</strong> • CageFS v7.8
                    Active
                  </span>
                  <div className="flex items-center gap-2">
                    <a
                      href="#"
                      className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-sm text-label-sm transition-colors"
                    >
                      Reset Password
                    </a>
                    <a
                      href="#"
                      className="px-3 py-1.5 rounded-lg bg-primary-container text-on-primary font-label-sm text-label-sm transition-all shadow-sm hover:-translate-y-0.5"
                    >
                      1-Click WordPress Login
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Sec>

        {/* 6 BENCHMARK */}
        <Sec bg="bg-surface-container-lowest" id="benchmark-table">
          <Head
            pill="Infrastructure Benchmark"
            title="Architectural Comparison"
            sub="See the decisive difference between true enterprise NVMe LiteSpeed hosting and commoditized budget shared servers."
          />
          <div className="overflow-x-auto rounded-xl border border-outline-variant shadow-xl">
            <table className="w-full min-w-[860px] text-left bg-surface-container-low">
              <thead>
                <tr className="bg-surface-container-high text-on-surface font-headline-sm text-headline-sm">
                  <th className="p-5 font-bold">Performance Criteria</th>
                  <th className="p-5 font-bold bg-gradient-to-r from-primary-container to-secondary text-on-primary">
                    <span className="flex items-center gap-2">
                      <I n="cloud_done" c="text-[20px]" />
                      PRIMO CLOUD
                    </span>
                  </th>
                  <th className="p-5 font-semibold text-on-surface-variant">
                    Traditional Host (GoDaddy / Bluehost)
                  </th>
                  <th className="p-5 font-semibold text-on-surface-variant">
                    Budget Shared Host
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container font-body-md text-body-md">
                {compare.map(([a, b, c, d, bad]) => (
                  <tr
                    key={a}
                    className="hover:bg-surface-container-lowest/60 transition-colors"
                  >
                    <td className="p-5 font-semibold text-on-surface">{a}</td>
                    <td className="p-5 bg-secondary-container/20 font-bold text-primary">
                      <span className="flex items-center gap-1.5">
                        <I
                          n="check_circle"
                          c="text-primary-container text-[18px] shrink-0"
                        />
                        {b}
                      </span>
                    </td>
                    <td
                      className={`p-5 ${bad ? "text-error font-medium" : "text-on-surface-variant"}`}
                    >
                      {c}
                    </td>
                    <td
                      className={`p-5 ${bad ? "text-error font-medium" : "text-on-surface-variant"}`}
                    >
                      {d}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Sec>

        {/* 7 CMS */}
        <Sec bg="bg-surface-container-low">
          <div className="text-center">
            <Pill>Platform Compatibility</Pill>
            <h2 className="font-headline-lg text-headline-lg text-on-surface mt-space-sm mb-8">
              Deploy Any CMS or Modern Web Framework Instantly
            </h2>
            <div className="flex flex-wrap items-center justify-center gap-4">
              {cms.map(([n, t]) => (
                <div
                  key={t}
                  className="group flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg hover:border-primary-container/50"
                >
                  <I
                    n={n}
                    c="text-primary text-[24px] transition-transform duration-300 group-hover:scale-125"
                  />
                  <span className="font-label-lg text-label-lg font-bold text-on-surface">
                    {t}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Sec>

        {/* 8 TESTIMONIALS */}
        <Sec bg="bg-surface-container-lowest">
          <Head
            pill="Client Experiences"
            title="Trusted by Agencies, Developers & Stores"
            sub="Real results from teams running high-load production websites on our shared NVMe infrastructure."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map(([i, n, r, av, t]) => (
              <div
                key={n}
                className="p-6 rounded-xl bg-surface-container-low border border-outline-variant shadow-sm relative flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 hover:border-primary-container/40 transition-all duration-300"
              >
                <div>
                  <div className="flex items-center text-primary-container mb-3">
                    {[...Array(5)].map((_, k) => (
                      <I key={k} n="star" c="text-[20px]" />
                    ))}
                  </div>
                  <I
                    n="format_quote"
                    c="absolute top-4 right-5 text-[56px] text-primary-container/15"
                  />
                  <p className="relative font-body-md text-body-md text-on-surface mb-6 leading-relaxed italic">
                    {t}
                  </p>
                </div>
                <div className="flex items-center gap-3 pt-4 border-t border-surface-container">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${av}`}
                  >
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
        <Sec bg="bg-surface-container-low">
          <Head
            pill="Technical Specifications"
            title="Frequently Asked Questions"
            sub="Clear, definitive answers on architecture, resource isolation, migrations, and our 99.9% uptime SLA."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqs.map(([q, a]) => (
              <div key={q} className={`p-6 ${cardHover}`}>
                <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-2 flex items-start gap-2">
                  <I
                    n="help"
                    c="text-primary-container text-[20px] shrink-0 mt-0.5 transition-transform duration-300 group-hover:rotate-12"
                  />
                  {q}
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  {a}
                </p>
              </div>
            ))}
          </div>
        </Sec>

        {/* 10 CTA */}
        <section className="py-20 px-margin-mobile lg:px-margin bg-gradient-to-br from-primary via-[#00522b] to-[#00210e] text-on-primary relative overflow-hidden">
          <span className="pointer-events-none absolute -left-10 top-6 h-40 w-40 rounded-full bg-white/10 animate-float" />
          <span className="pointer-events-none absolute -right-8 bottom-4 h-52 w-52 rounded-full bg-white/10 animate-float [animation-delay:1.5s]" />
          <div className="max-w-7xl mx-auto text-center relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container/30 border border-secondary-container/40 text-on-primary font-label-sm text-label-sm uppercase font-bold tracking-widest mb-6">
              <span className="w-2 h-2 rounded-full bg-primary-fixed animate-ping" />
              Zero-Risk Guarantee
            </span>
            <h2 className="font-headline-xl text-headline-xl text-on-primary max-w-3xl mx-auto mb-4 tracking-tight leading-tight">
              Ready to Experience 20x Faster Website Performance?
            </h2>
            <p className="font-body-lg text-body-lg text-surface-container max-w-2xl mx-auto mb-8 leading-relaxed">
              Migrate to PRIMO CLOUD Shared Web Hosting today with zero
              downtime, instant automated activation, and an unconditional
              30-day money-back guarantee.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
              <a
                href="#pricing-matrix"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg bg-surface-container-lowest hover:bg-surface-container text-primary font-label-lg text-label-lg transition-all shadow-xl font-bold hover:-translate-y-0.5"
              >
                <span>Deploy Shared Hosting Now</span>
                <I n="arrow_forward" c="text-[20px]" />
              </a>
              <a
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-primary-container hover:bg-primary text-on-primary font-label-lg text-label-lg transition-all shadow-md border border-white/20"
              >
                <I n="chat" c="text-[20px]" />
                <span>Chat with Migration Specialist</span>
              </a>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6 font-mono-code text-label-sm text-surface-container">
              {[
                ["verified", "99.9% Uptime SLA"],
                ["bolt", "Instant 30s Provisioning"],
                ["published_with_changes", "Free White-Glove Migration"],
              ].map(([n, t]) => (
                <div key={t} className="flex items-center gap-1.5">
                  <I n={n} c="text-[18px] text-primary-fixed" />
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

export default SharedHosting;
