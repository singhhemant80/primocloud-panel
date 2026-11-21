import { orderUrl } from "../../lib/panel";
import React, { useState, useEffect, useRef } from 'react'
import Layout from '../../components/layout'
import { useMotion } from '../../components/motion'
import { useCurrency } from '../../context/CurrencyContext'
import { I, Pill, Sec, Head, cardHover, IconBox } from '../../components/ui'

// ---------- content (taken from the HTML design) ----------
const trustStrip = [['verified', '99.9% SLA Uptime'], ['speed', '20x Faster LiteSpeed'], ['timer', '<180ms TTFB Response'], ['extension', '400+ WP Plugins & 1-Click Staging']]
const nodeBoxes = [['Web Server Engine', 'LiteSpeed v6.3 Ent', 'HTTP/3 & QUIC Active', 'text-primary-fixed'], ['PHP Runtime & Cache', 'PHP 8.3.12 FPM', 'OPcache 99.8% Hit Rate', 'text-primary-fixed'], ['LSCache Dynamic Hit', '98.4% Hit Ratio', 'Sub-15ms Page Render', 'text-primary-fixed'], ['CageFS Resource Isolation', 'Isolated KVM Pod', '0.12ms Redis Latency', 'text-secondary-fixed']]
const arch = [
  ['memory', 'Pure PCIe 4.0 NVMe Storage', 'Enterprise Samsung PM9A3 enterprise arrays delivering up to 7,000 MB/s read/write speeds, completely eliminating database query bottlenecks on large WooCommerce catalogs.', '7,000 MB/s I/O throughput'],
  ['speed', 'LiteSpeed Enterprise + LSCache', 'Native server-level page caching that bypasses PHP overhead completely for cached requests, handling up to 40x more concurrent traffic and high checkout spikes without lag.', 'Sub-15ms cached response'],
  ['shield_person', 'CloudLinux CageFS Isolation', 'Isolated virtualized CPU, RAM, and I/O containers per site. CageFS prevents noisy neighbor interference and prevents malicious scripts from jumping between tenant accounts.', 'Dedicated resource limits'],
  ['history', 'Automated Daily JetBackup', '30 days of automated point-in-time snapshots streamed off-site. 1-click self-serve restore for individual files, database tables, or entire installations in under 60 seconds.', 'Instant 1-click restore'],
]
const plans = [
  { n: 'WP Starter', slug: "wp-starter", tag: 'Single Site', d: 'Ideal for personal blogs, simple portfolios, and early-stage projects.', p: [2.99, 2.39], cta: 'Deploy Starter',
    s: ['**1** WordPress Site', '**15 GB** NVMe Storage', '**Unmetered** Bandwidth', '**10** Business Email Inboxes', 'Free AutoSSL Certificate', '**1 vCPU / 1 GB RAM** CageFS', 'cPanel + WP Toolkit Integration'] },
  { n: 'WP Business', slug: "wp-business", tag: 'Scaling', feat: true, d: 'Engineered for growing businesses, fast content creators & landing pages.', p: [5.99, 4.79], cta: 'Deploy Business',
    s: ['**5** WordPress Sites', '**50 GB** PCIe 4.0 NVMe Storage', '**Unlimited** Business Emails', '**Free Domain** (1st Year)', 'Free Wildcard SSL + HTTP/3', '**2 vCPU / 2 GB RAM** + LSCache', '**Redis Cache (128MB)**', 'JetBackup 30-Day Retention'] },
  { n: 'WooCommerce Pro', slug: "wp-woocommerce-pro", tag: 'E-Commerce', d: 'Dedicated PHP workers designed for transactional carts and heavy catalogs.', p: [9.99, 7.99], cta: 'Deploy Pro',
    s: ['**15** WP / WooCommerce Stores', '**100 GB** Pure NVMe Storage', '**Free Domain** + Dedicated IP', '**3 vCPU / 4 GB Compute**', '**Dedicated PHP Workers** (Parallel)', '**Redis Object Cache (256MB)**', 'Imunify360 WAF & Malware Purge'] },
  { n: 'WP Enterprise', slug: "wp-enterprise", tag: 'High Scale', d: 'Maximum dedicated container allocation for high-traffic agencies & publishers.', p: [24.99, 19.99], cta: 'Deploy Enterprise',
    s: ['**Unlimited** WordPress Sites', '**200 GB** Enterprise NVMe Storage', 'Dedicated IPv4 & IPv6 Subnet', '**4 vCPU / 8 GB RAM** CageFS', 'Git CI/CD, WP-CLI & Staging Matrix', 'Redis 512MB Dedicated Pool', '**Priority 15-min SLA Support**'] },
]
const planTrust = [['verified_user', '30-Day Unconditional Money-Back Guarantee'], ['swap_horiz', 'Free Zero-Downtime Migration from Any Host'], ['bolt', 'Instant 30-Second Provisioning']]
const stack = [
  ['wifi_tethering', 'HTTP/3 & QUIC Protocol Support', 'Zero-round-trip handshakes and multiplexed streams over UDP. Mobile shoppers on fluctuating cellular data load assets instantly with zero connection stalls.'],
  ['shield', 'Imunify360 Proactive Defense', 'Real-time AI malware scanning, automatic zero-day WordPress vulnerability patching, and a machine learning Web Application Firewall (WAF) blocking botnets.'],
  ['tune', 'Multi-PHP Selector & OPcache', 'Switch effortlessly between PHP 7.4 through PHP 8.3 and experimental 8.4 on a per-site basis. Pre-compiled bytecode OPcache ensures minimal execution overhead.'],
  ['call_split', '1-Click Staging & WP-Toolkit', 'Spin up an isolated staging replica in seconds. Test theme changes or plugin updates, and safely merge database tables and media files with zero downtime.'],
  ['database', 'Redis Object Caching & LSCache', 'Persistent in-memory caching stores dynamic query results, preventing redundant MySQL hits for logged-in users, WooCommerce shopping carts, and dynamic filters.'],
  ['mail', 'Enterprise Email & SpamTitan', 'Professional domain-based email with SPF, DKIM, and DMARC enforcement. Filter out 99.9% of incoming spam, viruses, and phishing threats automatically.'],
]
const tools = [['apps', 'WP Toolkit'], ['folder_open', 'File Manager'], ['database', 'phpMyAdmin'], ['mail', 'Email Accounts'], ['cleaning_services', 'LSCache Purge'], ['restore', 'JetBackup 5']]
const compare = [
  ['Web Server Architecture', 'LiteSpeed Enterprise (HTTP/3 + QUIC)', 'Standard Apache 2.4 (No HTTP/3)', 'Basic Nginx (Manual configuration)'],
  ['Storage Technology', 'Pure PCIe 4.0 NVMe (7,000 MB/s)', 'Legacy SATA SSD (500 MB/s)', 'Shared Virtual Disk (Variable IOPS)'],
  ['Tenant Isolation Guard', 'CloudLinux CageFS Container Isolation', 'Shared Pool (Noisy Neighbor Risks)', 'Basic Cgroups', 1],
  ['Caching Engine', 'Server-Level LSCache + Redis Native', 'PHP-Level Plugin or Extra Fee', 'Manual Redis Configuration', 1],
  ['Automated Backups', 'Daily JetBackup Off-Site (30 Days)', 'Weekly / Extra $2.99/mo fee', 'Snapshot Billing (Extra 20%)', 1],
  ['Security & WAF', 'Imunify360 + Realtime Malware Purge', 'Basic ModSecurity', 'Unconfigured / Add-on Required'],
  ['Renewal Price Stability', 'Flat Renewal Guarantee (No Surprises)', '300% – 400% Price Hike on Renewal', 'Flat, but unmanaged labor costs', 1],
]
const ecosystem = [['shopping_cart', 'WooCommerce'], ['dashboard_customize', 'Elementor'], ['palette', 'Divi'], ['grid_view', 'Gutenberg / FSE'], ['code', 'ACF Pro'], ['terminal', 'Roots Sage'], ['rocket', 'WP Rocket'], ['dns', 'Cloudflare Railgun']]
const reviews = [
  ['MR', 'Marcus Reed', 'CTO, Apex Digital Agency', '"We migrated 32 client WooCommerce stores from a bloated VPS provider. Our average mobile Google PageSpeed scores jumped from 68 to 97 instantly with native LSCache and Redis."'],
  ['SL', 'Sarah Lindqvist', 'Operations Lead, Nord Apparel', '"During our Black Friday rush, our store hit 2,800 simultaneous checkouts without a hiccup. The dedicated PHP workers and LiteSpeed setup handled the cart query storm effortlessly."'],
  ['DV', 'Devon Vance', 'Principal Architect, StackPress', '"The staging sync workflow alone saves our engineering team 8 hours every sprint. We merge plugin updates, let the AI regression run, and push to live with absolute peace of mind."'],
]
const faqs = [
  ['Why is LiteSpeed Enterprise significantly faster than Apache?', 'LiteSpeed is an asynchronous, event-driven web server capable of handling tens of thousands of concurrent connections with minuscule memory usage. It features server-level caching (LSCache) that writes directly to memory and serves pages without executing heavy PHP runtimes or executing MySQL database queries for cached content.'],
  ['How does the free white-glove site migration work?', "After placing your order, simply supply your previous host's credentials (cPanel, WP Admin, or SFTP). Our senior migration engineers migrate all files, databases, and cron jobs, optimize your database tables, configure Redis caching, and verify full functionality via staging before you update DNS records—ensuring zero downtime."],
  ['Are dedicated PHP workers allocated to WooCommerce plans?', 'Yes. Dynamic requests like cart additions, coupon validations, and checkout payments cannot be statically cached. Our WooCommerce Pro and Enterprise plans reserve dedicated PHP workers that process concurrent un-cached queries in parallel, preventing queuing and customer drop-offs during high sales volume.'],
  ['Can I switch between PHP versions and extensions freely?', 'Yes. You can switch between PHP 7.4 through PHP 8.3 and experimental 8.4 on a per-site basis right from your control panel. You also have full control over memory limits, upload limits, OPcache settings, and enabling/disabling individual PHP modules (Imagick, Redis, ionCube, SOAP, etc.).'],
  ['How does the 1-Click Staging environment handle database syncs?', 'Our staging tool provides granular synchronization options. You can deploy code-only updates, database-only updates, or full synchronizations. For e-commerce sites, you can sync theme files without overwriting new orders or customer accounts created on production while you were working.'],
  ['Is WordPress Multisite (WPMU) supported out of the box?', "Yes. Both subdirectory and subdomain multisite installations are fully supported. We support wildcard SSL generation via Let's Encrypt and LiteSpeed's native multisite cache optimization rules for unified multi-tenant operations."],
  ['Where are backups stored and how fast is recovery?', 'All backups are created via JetBackup and streamed off-cluster to geographically redundant S3-compatible encrypted storage vaults. Point-in-time restores take under 60 seconds and can restore individual files, selected MySQL tables, mailboxes, or entire site filesystems.'],
  ['What is your SLA and refund policy?', 'We provide a contractual 99.99% network and infrastructure uptime SLA backed by automated credits. If you are not completely satisfied within your first 30 days of service, we will process a complete, hassle-free 100% refund without questions asked.'],
]

const rich = (s) => s.split('**').map((t, i) => (i % 2 ? <strong key={i}>{t}</strong> : t))
const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
const useTick = (base, spread, dec = 1, ms = 2200) => {
  const [v, setV] = useState(base)
  useEffect(() => {
    if (reduced()) return
    const t = setInterval(() => setV(+(base + (Math.random() - 0.5) * spread * 2).toFixed(dec)), ms)
    return () => clearInterval(t)
  }, [base, spread, dec, ms])
  return v
}
const LeftHead = ({ pill, title, sub }) => (
  <div className="mb-space-xl max-w-3xl">
    <Pill c="w-fit">{pill}</Pill>
    <h2 className="mt-space-sm font-headline-xl text-headline-xl text-on-surface tracking-tight font-bold">{title}</h2>
    <p className="mt-space-xs font-body-lg text-body-lg text-on-surface-variant">{sub}</p>
  </div>
)

const WordpressHosting = () => {
  const rootRef = useRef(null)
  useMotion(rootRef)
  const { fmt } = useCurrency()
  const [yearly, setYearly] = useState(false)
  const [open, setOpen] = useState([])
  const [on, setOn] = useState(false)
  const [msg, setMsg] = useState('')
  const [purging, setPurging] = useState(false)
  const [tool, setTool] = useState(null)
  const tm = useRef(null)
  const hit = useTick(98.4, 0.5)
  const mem = useTick(12.5, 1.5)
  const redis = useTick(0.08, 0.02, 2)
  const ttfb = useTick(142, 12, 0)

  useEffect(() => { const t = setTimeout(() => setOn(true), 300); return () => clearTimeout(t) }, [])
  const toast = (m) => { setMsg(m); clearTimeout(tm.current); tm.current = setTimeout(() => setMsg(''), 2800) }
  const purge = () => { if (purging) return; setPurging(true); toast('Purging LiteSpeed page cache and Redis object cache…'); setTimeout(() => { setPurging(false); toast('Cache purged: 1,248 objects cleared. Warm-up crawler started.') }, 1800) }
  const pickTool = (t) => { setTool(t); toast(`Opening ${t}…`) }
  const toggleFaq = (i) => setOpen((o) => (o.includes(i) ? o.filter((x) => x !== i) : [...o, i]))
  const seg = 'rounded-full px-5 py-2 font-label-md text-label-md transition-all font-semibold'

  return (
    <Layout>
      <div ref={rootRef} className="flex flex-col w-full">
        {/* 1 HERO */}
        <section className="relative w-full overflow-hidden bg-surface pt-12 pb-16 lg:pt-16 lg:pb-24 border-b border-outline-variant/30">
          <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-[450px] w-[800px] rounded-full bg-primary-container/10 blur-3xl" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,rgba(11,175,96,0.18)_1px,transparent_1px)] bg-[size:28px_28px] [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_70%)]" />
          <div className="relative mx-auto max-w-7xl px-margin-mobile lg:px-margin">
            <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary-container/30 bg-surface-container px-4 py-1.5 shadow-sm"><span className="flex h-2 w-2 rounded-full bg-primary-container animate-pulse shrink-0" /><span className="font-label-sm text-[11px] sm:text-label-sm tracking-wide text-on-surface font-semibold uppercase">⚡ Ultra-Fast LiteSpeed Enterprise • Free Domain & SSL • 99.9% Uptime Guarantee</span></div>
              <h1 className="mt-6 font-display-lg text-3xl sm:text-4xl lg:text-display-lg font-bold text-on-surface tracking-tight leading-tight">Enterprise-Speed WordPress Hosting: Powered by <span className="bg-gradient-to-r from-primary-container via-secondary to-primary-container bg-[length:200%_auto] bg-clip-text text-transparent animate-[shimmer_4s_linear_infinite]">LiteSpeed & Pure NVMe</span></h1>
              <p className="mt-5 max-w-2xl font-body-lg text-body-lg text-on-surface-variant leading-relaxed">High-velocity managed hosting engineered for WordPress & WooCommerce. Featuring dedicated LiteSpeed Enterprise Web Servers, pure Samsung PCIe 4.0 NVMe arrays, server-level Redis caching, and automated 1-click staging sandboxes.</p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-space-md">
                <a href="#pricing" className="group relative overflow-hidden inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-primary-container to-secondary px-7 py-3.5 font-label-lg text-label-lg font-semibold text-on-primary shadow-md shadow-primary-container/30 transition-all hover:shadow-lg hover:-translate-y-0.5 before:absolute before:inset-y-0 before:-left-full before:w-1/2 before:skew-x-[-20deg] before:bg-white/30 hover:before:left-[150%] before:transition-all before:duration-700">Deploy WordPress Now<I n="arrow_forward" c="text-[20px]" /></a>
                <a href="#benchmarks" className="inline-flex items-center justify-center gap-2 rounded-lg border border-outline-variant bg-surface-container-lowest px-7 py-3.5 font-label-lg text-label-lg font-semibold text-on-surface shadow-sm transition-all hover:bg-secondary-container/20 hover:border-primary-container/50">Compare Plans & Specs<I n="tune" c="text-[18px]" /></a>
              </div>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-on-surface-variant font-label-md text-label-md">
                {trustStrip.map(([n, t], i) => <React.Fragment key={t}>{i > 0 && <span className="text-outline-variant hidden sm:inline">•</span>}<span className="inline-flex items-center gap-1.5 font-semibold text-on-surface"><I n={n} c="text-primary text-[18px]" />{t}</span></React.Fragment>)}
              </div>
            </div>

            <div className="mt-12 max-w-4xl mx-auto">
              <div className="relative rounded-2xl bg-inverse-surface p-5 sm:p-6 text-inverse-on-surface shadow-2xl shadow-primary/15 border border-inverse-surface/40 animate-float">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-white/10">
                  <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-error" /><span className="h-3 w-3 rounded-full bg-secondary-container" /><span className="h-3 w-3 rounded-full bg-primary-container" /><span className="ml-2 font-mono-code text-[11px] sm:text-xs text-surface-variant tracking-wider uppercase">shared-wp-eu01.primocloud.net</span></div>
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/20 px-3 py-1 font-mono-code text-[10px] text-secondary-fixed"><span className="h-1.5 w-1.5 rounded-full bg-primary-container animate-ping" />LIVE CLUSTER TELEMETRY</div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-4 font-mono-code text-xs">
                  {nodeBoxes.map(([l, v, s, c], i) => <div key={l} className="rounded-lg bg-white/5 p-3 border border-white/10 text-left"><span className="text-[10px] uppercase tracking-wider text-surface-variant block">{l}</span><p className="mt-1 font-bold text-inverse-on-surface text-sm">{i === 2 ? `${hit}% Hit Ratio` : v}</p><p className={`text-[10px] ${c} mt-0.5`}>{i === 3 ? `${redis.toFixed(2)}ms Redis Latency` : s}</p></div>)}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 font-mono-code text-[11px] text-left">
                  {[['LSCache Hit Rate', `${hit}%`, 'text-primary-fixed', 'bg-primary-container', hit], ['WP Memory Pool (512MB)', `${mem}% Utilized`, 'text-secondary-fixed', 'bg-secondary-fixed', mem], ['I/O Wait Overhead', '0.00% (Pure NVMe)', 'text-primary-fixed', 'bg-primary-fixed', 1.2]].map(([l, v, c, b, w]) => (
                    <div key={l}><div className="flex justify-between pb-1"><span className="text-surface-variant">{l}</span><span className={`${c} font-bold`}>{v}</span></div><div className="h-1.5 w-full rounded-full bg-white/15 overflow-hidden"><div className={`h-full ${b} transition-[width] duration-700`} style={{ width: `${w}%` }} /></div></div>
                  ))}
                </div>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-lg bg-white/10 px-3.5 py-2 font-mono-code text-[11px] text-left"><div className="flex items-center gap-2 min-w-0"><span className="text-primary-fixed">$</span><span className="text-inverse-on-surface truncate">wp core check-update && lscache-purge --all && redis-cli ping</span></div><span className="text-primary-fixed font-bold uppercase tracking-wider whitespace-nowrap">STATUS: PONG [OK {redis.toFixed(2)}ms]</span></div>
              </div>
            </div>
          </div>
        </section>

        {/* 2 ARCHITECTURE */}
        <Sec bg="bg-surface-container-lowest">
          <LeftHead pill="Hardware & Architecture Precision" title="Engineered for Unthrottled WordPress Speed and Isolation" sub="Every account is deployed onto tier-1 bare-metal infrastructure optimized specifically for heavy WordPress queries, high concurrent checkouts, and total account protection." />
          <div className="grid grid-cols-1 gap-gutter sm:grid-cols-2 lg:grid-cols-4">
            {arch.map(([n, t, d, f]) => (
              <div key={t} className={`flex flex-col justify-between p-space-lg ${cardHover}`}>
                <div><IconBox n={n} size="h-12 w-12 rounded-lg" fs="text-[26px]" mb="mb-space-md" /><h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">{t}</h3><p className="mt-space-sm font-body-md text-body-md text-on-surface-variant leading-relaxed">{d}</p></div>
                <div className="mt-space-lg flex items-center gap-1.5 font-label-md text-label-md text-primary font-semibold group-hover:gap-2.5 transition-all"><span>{f}</span><I n="arrow_forward" c="text-[16px]" /></div>
              </div>
            ))}
          </div>
        </Sec>

        {/* 3 PRICING */}
        <Sec id="pricing">
          <div className="flex flex-col items-center text-center">
            <Pill>Clear Transparent Pricing</Pill>
            <h2 className="mt-space-sm font-headline-xl text-headline-xl font-bold text-on-surface tracking-tight">High-Velocity WordPress Hosting Plans</h2>
            <div className="mt-space-sm h-1 w-16 rounded-full bg-gradient-to-r from-primary-container to-secondary" />
            <p className="mt-space-sm max-w-2xl font-body-lg text-body-lg text-on-surface-variant">Engineered for rapid growth, agency developers, and demanding WooCommerce stores. Transparent resources with guaranteed renewal rates.</p>
            <div className="mt-space-lg inline-flex items-center gap-1 rounded-full bg-surface-container-high p-1 shadow-inner border border-outline-variant/30">
              <button type="button" onClick={() => setYearly(false)} className={`${seg} ${!yearly ? 'text-on-surface bg-surface-container-lowest shadow-sm' : 'text-on-surface-variant'}`}>Monthly</button>
              <button type="button" onClick={() => setYearly(true)} className={`${seg} flex items-center gap-1.5 ${yearly ? 'text-on-surface bg-surface-container-lowest shadow-sm' : 'text-on-surface-variant'}`}><span>Annual Billing</span><span className="rounded bg-primary-container px-2 py-0.5 font-label-sm text-[10px] text-on-primary font-bold uppercase">Save 20%</span></button>
            </div>
          </div>
          <div className="mt-space-xl grid grid-cols-1 gap-gutter md:grid-cols-2 lg:grid-cols-4 items-stretch">
            {plans.map((p) => (
              <div key={p.n} className={`relative flex flex-col justify-between rounded-2xl p-space-lg ${p.feat ? 'bg-gradient-to-b from-secondary-container/20 to-surface-container-lowest border-2 border-primary-container shadow-2xl shadow-primary-container/25 lg:-translate-y-2' : 'bg-surface-container-lowest border border-outline-variant/60 shadow-sm transition-all duration-300 hover:border-primary-container/40 hover:shadow-xl'}`}>
                {p.feat && <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-primary-container px-3.5 py-1 font-label-sm text-[11px] text-on-primary font-bold uppercase tracking-wider shadow-sm whitespace-nowrap">Most Popular</div>}
                <div>
                  <div className="flex items-center justify-between gap-2"><h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">{p.n}</h3><span className={`rounded px-2 py-0.5 font-mono-code text-[11px] font-semibold whitespace-nowrap ${p.feat ? 'bg-secondary-container text-on-secondary-container' : 'bg-surface-container text-on-surface-variant'}`}>{p.tag}</span></div>
                  <p className="mt-1 font-body-sm text-body-sm text-on-surface-variant">{p.d}</p>
                  <div className="mt-space-lg flex items-baseline gap-1"><span className={`font-headline-xl text-3xl sm:text-headline-xl font-bold ${p.feat ? 'text-primary' : 'text-on-surface'}`}>{fmt(p.p[yearly ? 1 : 0])}</span><span className="font-body-sm text-body-sm text-on-surface-variant">/month</span></div>
                  <p className="mt-0.5 font-mono-code text-[11px] text-on-surface-variant">{yearly ? 'Billed annually (-20% applied)' : 'Billed monthly'}</p>
                  <div className="mt-space-md h-px w-full bg-outline-variant/30" />
                  <ul className="mt-space-md space-y-2.5 font-body-sm text-body-sm text-on-surface">{p.s.map((x) => <li key={x} className="flex items-center gap-2"><I n="check_circle" c="text-primary text-[18px] shrink-0" /><span>{rich(x)}</span></li>)}</ul>
                </div>
                <div className="mt-space-lg pt-space-xs"><a href={/^Contact/.test(p.cta ?? "") ? "/contact" : orderUrl(p.slug, yearly)} className={`flex w-full items-center justify-center rounded-lg py-2.5 font-label-md text-label-md font-semibold transition-all ${p.feat ? 'bg-gradient-to-r from-primary-container to-secondary text-on-primary shadow-md shadow-primary-container/30 hover:-translate-y-0.5' : 'border border-outline-variant bg-surface-container-high text-on-surface hover:bg-primary-container hover:text-on-primary hover:border-primary-container'}`}>{p.cta}</a></div>
              </div>
            ))}
          </div>
          <div className="mt-space-xl flex flex-wrap items-center justify-around gap-4 rounded-xl border border-outline-variant/40 bg-surface-container-low px-6 py-4 shadow-sm">
            {planTrust.map(([n, t]) => <div key={t} className="flex items-center gap-2 font-label-md text-label-md text-on-surface font-semibold"><I n={n} c="text-primary text-[20px]" /><span>{t}</span></div>)}
          </div>
        </Sec>

        {/* 4 STACK */}
        <Sec bg="bg-surface-container-lowest">
          <LeftHead pill="Modern WordPress Architecture" title="The Complete Speed & Security Stack" sub="A finely calibrated infrastructure stack built with leading enterprise software components to handle extreme loads effortlessly." />
          <div className="grid grid-cols-1 gap-gutter sm:grid-cols-2 lg:grid-cols-3">
            {stack.map(([n, t, d]) => <div key={t} className={`bg-surface-container-low p-space-lg ${cardHover}`}><IconBox n={n} size="h-11 w-11 rounded-lg" fs="text-[24px]" mb="mb-4" /><h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">{t}</h3><p className="mt-2 font-body-md text-body-md text-on-surface-variant leading-relaxed">{d}</p></div>)}
          </div>
        </Sec>

        {/* 5 DASHBOARD */}
        <Sec>
          <Head pill="Intuitive Management" title="Modern, Full-Featured WordPress Control Console" sub="Everything you need to run high-performance websites in one clean interface. Easily manage domains, staging environments, backups, and databases." />
          <div className="mx-auto max-w-5xl rounded-2xl bg-surface-container-high p-3 sm:p-5 shadow-2xl border border-outline-variant/40">
            <div className="flex items-center justify-between gap-2 pb-3 sm:pb-4 border-b border-outline-variant/30 px-1">
              <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-error/80" /><span className="h-3 w-3 rounded-full bg-secondary-container" /><span className="h-3 w-3 rounded-full bg-primary-container" /><div className="ml-3 hidden sm:flex items-center gap-1.5 rounded-md bg-surface-container px-3 py-1 text-xs text-on-surface-variant"><I n="lock" c="text-[14px] text-primary" /><span>https://cp.primocloud.net:2083/wp-manager</span></div></div>
              <span className="rounded bg-secondary-container px-2.5 py-0.5 font-mono-code text-[11px] text-on-secondary-container font-semibold">Active Node: wp-lon-02</span>
            </div>
            <div className="mt-4 rounded-xl bg-surface p-4 sm:p-6 shadow-sm border border-outline-variant/20">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-outline-variant/30">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-to-br from-primary-container to-secondary text-on-primary shadow-sm shrink-0"><I n="language" c="text-[24px]" /></div>
                  <div><div className="flex flex-wrap items-center gap-2"><span className="font-headline-sm text-lg font-bold text-on-surface">yourstore.com</span><span className="inline-flex items-center gap-1 rounded bg-secondary-container px-2 py-0.5 font-mono-code text-[11px] text-on-secondary-container font-semibold"><span className="h-1.5 w-1.5 rounded-full bg-primary-container animate-pulse" />PRODUCTION</span></div><p className="font-mono-code text-xs text-on-surface-variant mt-0.5">PHP 8.3.12 • LiteSpeed Enterprise • Let's Encrypt Wildcard SSL Active • TTFB {ttfb}ms</p></div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button type="button" onClick={purge} disabled={purging} className="inline-flex items-center gap-1.5 rounded-lg border border-outline-variant bg-surface-container px-3.5 py-2 font-label-md text-label-md font-semibold text-on-surface hover:bg-surface-variant disabled:opacity-60 transition-all"><I n="cached" c={`text-[18px] ${purging ? 'animate-spin' : ''}`} />{purging ? 'Purging…' : 'Purge Cache'}</button>
                  <button type="button" onClick={() => toast('Generating one-time secure login token for WP Admin…')} className="inline-flex items-center gap-1.5 rounded-lg bg-primary-container px-3.5 py-2 font-label-md text-label-md font-semibold text-on-primary shadow-sm hover:bg-secondary transition-all hover:-translate-y-0.5"><I n="open_in_new" c="text-[18px]" />1-Click WP Admin Login</button>
                </div>
              </div>
              <div className={`mt-3 rounded-lg bg-primary/10 px-3 font-label-md text-label-md text-primary transition-all duration-300 overflow-hidden ${msg ? 'py-2 max-h-12 opacity-100' : 'max-h-0 opacity-0'}`}>{msg}</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-5 pb-5 border-b border-outline-variant/30">
                {[['Disk Space (NVMe)', '12.4 GB / 50 GB', 'text-primary', 'bg-gradient-to-r from-primary-container to-secondary', 24.8], ['Inode Usage', '82,410 / 500,000', 'text-primary', 'bg-gradient-to-r from-primary-container to-secondary', 16.4], ['Bandwidth (Month)', '48.2 GB (Unmetered)', 'text-secondary', 'bg-secondary-fixed-dim', 10]].map(([l, v, c, b, w]) => (
                  <div key={l} className="rounded-lg bg-surface-container-low p-3.5 border border-outline-variant/30"><div className="flex justify-between items-center gap-2 text-xs font-semibold text-on-surface"><span>{l}</span><span className={`font-mono-code ${c}`}>{v}</span></div><div className="mt-2 h-2 w-full rounded-full bg-surface-container overflow-hidden"><div className={`h-full ${b} transition-[width] duration-1000 ease-out`} style={{ width: on ? `${w}%` : '0%' }} /></div></div>
                ))}
              </div>
              <div className="pt-5">
                <span className="font-label-sm text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block mb-3">Quick Management Tools</span>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                  {tools.map(([n, t]) => <button key={t} type="button" onClick={() => (t === 'LSCache Purge' ? purge() : pickTool(t))} className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all text-center hover:-translate-y-0.5 hover:shadow-md ${tool === t ? 'border-primary-container bg-secondary-container/30' : 'border-outline-variant/30 bg-surface-container-lowest hover:border-primary-container'}`}><I n={n} c="text-primary text-[24px]" /><span className="mt-1 font-label-md text-xs font-bold text-on-surface">{t}</span></button>)}
                </div>
              </div>
            </div>
          </div>
        </Sec>

        {/* 6 BENCHMARKS */}
        <Sec bg="bg-surface-container-lowest" id="benchmarks">
          <Head pill="Hard Empirical Data" title="How PRIMO CLOUD Compares Against The Market" sub="See how our dedicated LiteSpeed Enterprise infrastructure outclasses outdated Apache and unoptimized commodity virtual stacks." />
          <div className="overflow-x-auto rounded-2xl border border-outline-variant/40 bg-surface shadow-xl">
            <table className="w-full min-w-[860px] border-collapse text-left font-body-md text-body-md">
              <thead><tr className="bg-surface-container-high border-b border-outline-variant/40">
                <th className="p-space-md font-label-lg text-label-lg font-bold text-on-surface">Specification / Feature</th>
                <th className="p-space-md font-label-lg text-label-lg font-bold text-on-primary bg-gradient-to-r from-primary-container to-secondary"><div className="flex items-center gap-1.5"><I n="bolt" c="text-[20px]" />PRIMO CLOUD</div></th>
                <th className="p-space-md font-label-lg text-label-lg font-bold text-on-surface-variant">Traditional Host (GoDaddy / Bluehost)</th>
                <th className="p-space-md font-label-lg text-label-lg font-bold text-on-surface-variant">Budget Shared / VPS</th>
              </tr></thead>
              <tbody className="divide-y divide-outline-variant/20">
                {compare.map(([a, b, c, d, bad]) => (
                  <tr key={a} className="hover:bg-secondary-container/10 transition-colors"><td className="p-space-md font-semibold text-on-surface">{a}</td><td className="p-space-md font-bold text-primary bg-primary-container/5 border-x border-primary-container/30"><span className="flex items-center gap-2"><I n="check_circle" c="text-[18px] text-primary-container shrink-0" />{b}</span></td><td className={`p-space-md ${bad ? 'text-error font-medium' : 'text-on-surface-variant'}`}>{c}</td><td className="p-space-md text-on-surface-variant">{d}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </Sec>

        {/* 7 ECOSYSTEM */}
        <Sec>
          <div className="flex flex-col items-center text-center">
            <Pill>Ecosystem Compatibility</Pill>
            <h3 className="mt-space-sm font-headline-md text-headline-md font-bold text-on-surface">Deploy Any Theme, Plugin, or Framework Instantly</h3>
            <p className="mt-1 font-body-sm text-body-sm text-on-surface-variant">100% compatible with modern WordPress builders, heavy e-commerce frameworks, and developer workflows.</p>
            <div className="mt-space-lg flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              {ecosystem.map(([n, t]) => <div key={t} className="group flex items-center gap-2 rounded-xl border border-outline-variant/60 bg-surface-container-lowest px-4 py-2.5 shadow-sm transition-all hover:-translate-y-1 hover:border-primary-container/50 hover:shadow-md"><I n={n} c="text-primary text-[20px] transition-transform duration-300 group-hover:scale-110" /><span className="font-label-md text-sm font-bold text-on-surface">{t}</span></div>)}
            </div>
          </div>
        </Sec>

        {/* 8 TESTIMONIALS */}
        <Sec bg="bg-surface-container-lowest">
          <Head pill="Trusted by Performance Architects" title="Over 12,000+ Fast WordPress Sites Hosted" sub="See what digital agencies and high-traffic eCommerce store managers say about transitioning to PRIMO CLOUD." />
          <div className="grid grid-cols-1 gap-gutter md:grid-cols-3">
            {reviews.map(([i, n, r, t]) => (
              <div key={n} className="relative flex flex-col justify-between rounded-xl border border-outline-variant/60 bg-surface-container-low p-space-lg shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-primary-container/40 transition-all duration-300">
                <div><div className="flex items-center gap-1 text-primary">{[...Array(5)].map((_, k) => <I key={k} n="star" c="text-[18px]" />)}</div><I n="format_quote" c="absolute top-4 right-5 text-[56px] text-primary-container/15" /><p className="relative mt-space-md font-body-md text-body-md text-on-surface leading-relaxed">{t}</p></div>
                <div className="mt-space-lg flex items-center gap-3 pt-2"><div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary-container to-secondary flex items-center justify-center text-on-primary font-bold">{i}</div><div><p className="flex items-center gap-1 font-label-md text-label-md font-bold text-on-surface">{n}<I n="verified" c="text-[16px] text-primary-container" /></p><p className="font-body-sm text-body-sm text-on-surface-variant">{r}</p></div></div>
              </div>
            ))}
          </div>
        </Sec>

        {/* 9 FAQ */}
        <Sec>
          <LeftHead pill="In-Depth Architecture Details" title="Frequently Asked Technical Questions" sub="Detailed specs on caching mechanisms, server isolation, migrations, and developer capabilities." />
          <div className="grid grid-cols-1 gap-gutter lg:grid-cols-2 items-start">
            {[faqs.slice(0, 4), faqs.slice(4)].map((col, c) => (
              <div key={c} className="space-y-4">
                {col.map(([q, a], j) => {
                  const i = c * 4 + j
                  const isOpen = open.includes(i)
                  return (
                    <div key={q} className={`rounded-xl border bg-surface-container-low p-space-md transition-all duration-300 ${isOpen ? 'border-primary-container shadow-md shadow-primary-container/10 bg-surface-container-lowest' : 'border-outline-variant/60'}`}>
                      <button type="button" onClick={() => toggleFaq(i)} className="flex w-full items-center justify-between gap-3 text-left font-headline-sm text-[16px] font-semibold text-on-surface"><span>{q}</span><I n="expand_more" c={`shrink-0 text-on-surface-variant transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} /></button>
                      <div className={`grid transition-all duration-300 ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}><div className="overflow-hidden"><p className="mt-3 font-body-md text-body-md text-on-surface-variant leading-relaxed">{a}</p></div></div>
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </Sec>

        {/* 10 CTA */}
        <section className="relative w-full overflow-hidden bg-surface py-space-xl lg:py-24">
          <div className="mx-auto max-w-7xl px-margin-mobile lg:px-margin">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-[#004e28] p-space-xl sm:p-16 text-on-primary shadow-2xl shadow-primary/20">
              <div className="pointer-events-none absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-primary-container/30 blur-3xl" />
              <div className="pointer-events-none absolute -top-20 -left-20 h-80 w-80 rounded-full bg-secondary-container/20 blur-2xl" />
              <span className="pointer-events-none absolute right-10 top-8 h-32 w-32 rounded-full bg-white/10 animate-float" />
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="inline-flex items-center gap-2 rounded-full bg-on-primary/10 px-4 py-1.5 font-mono-code text-[12px] text-secondary-fixed border border-on-primary/15"><span className="h-2 w-2 rounded-full bg-primary-container animate-pulse" />ZERO DOWNTIME GUARANTEED</div>
                <h2 className="mt-space-md max-w-3xl font-display-lg text-3xl sm:text-4xl lg:text-display-lg font-bold tracking-tight text-on-primary leading-tight">Ready to Supercharge Your WordPress & WooCommerce Sites?</h2>
                <p className="mt-space-sm max-w-2xl font-body-lg text-body-lg text-on-primary/90">Get provisioned in 30 seconds on pure enterprise NVMe hardware. Hand off your migration to our 24/7 engineering team at no cost.</p>
                <div className="mt-space-xl flex flex-wrap items-center justify-center gap-space-md">
                  <a href="#pricing" className="inline-flex items-center justify-center gap-2 rounded-lg bg-surface-container-lowest px-8 py-4 font-label-lg text-label-lg font-bold text-primary shadow-lg transition-all hover:bg-surface-container-low hover:scale-[1.02]"><I n="rocket_launch" c="text-[20px]" />Deploy WordPress Hosting Now</a>
                  <a href="/contact" className="inline-flex items-center justify-center gap-2 rounded-lg bg-on-primary/15 px-8 py-4 font-label-lg text-label-lg font-bold text-on-primary backdrop-blur-md border border-on-primary/20 transition-all hover:bg-on-primary/25"><I n="support_agent" c="text-[20px]" />Chat with Migration Specialist</a>
                </div>
                <div className="mt-space-lg flex flex-wrap items-center justify-center gap-6 text-on-primary/80 font-body-sm text-body-sm">
                  {['30-Day Money-Back Policy', '99.99% Uptime SLA Backed', 'Free Unlimited Migrations', 'Dedicated 24/7/365 WordPress Engineers'].map((t) => <span key={t} className="flex items-center gap-1.5"><I n="check_circle" c="text-[16px] text-secondary-fixed" />{t}</span>)}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  )
}

export default WordpressHosting