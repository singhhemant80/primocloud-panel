import React, { useState, useEffect, useRef } from 'react'
import Layout from '../components/layout'
import { useMotion } from '../components/motion'
import { I, Pill, Sec, cardHover, IconBox } from '../components/ui'

// ---------- content (taken from the HTML design) ----------
const trending = ['Reverse DNS / rDNS', 'NVIDIA MIG Partition', 'cPanel Migration', 'SSH Key Hardening', 'BGP Peering Session', 'Wire Transfer SLA']
const metrics = [
  ['Response SLA', 'timer', '11m 42s', '', 'Average First Response Time (Last 30 Days)', 94],
  ['Resolution Rate', 'task_alt', '99.98%', '', 'First-Contact Resolution on Production Outages', 99],
  ['Direct Engineering', 'terminal', '100%', '', 'In-House Certified Tier-3 SysAdmins (Zero Outsourcing)', 100],
  ['CSAT Performance', 'hotel_class', '4.98', ' / 5.0', 'Audited CSAT score across 12,400+ enterprise tickets', 98],
]
const dcs = [['FRA-01', 'Frankfurt, DE', '99.999%'], ['LON-01', 'London, UK', '100.00%'], ['NYC-01', 'New York, US', '100.00%'], ['SIN-01', 'Singapore, SG', '99.998%'], ['TYO-01', 'Tokyo, JP', '100.00%']]
const services = [['Compute Hypervisors:', 'Nominal'], ['Anycast BGP Fabric:', '1.2 Tbps Peering Ok'], ['Pure NVMe SAN Latency:', '0.14ms'], ['DNS & API Gateways:', '100%'], ['Billing & WHMCS:', 'Normal']]
const kb = [
  ['terminal', 'Compute & VPS', 84, 'Linux & Windows KVM instances, instant OS reinstall, root password recovery, VNC serial console, and snapshot workflows.', ['Reset root/administrator password via VNC', 'Expanding LVM partition after disk resize', 'Configuring cloud-init automated bootstrapping']],
  ['dns', 'Bare-Metal & Dedicated', 62, 'Out-of-band IPMI & Dell iDRAC setups, custom ISO mounting, hardware RAID-10 initialization, and automated RMA procedures.', ['Accessing Supermicro IPMI behind VPN gateway', 'Megaraid CLI hardware drive status audit', 'Requesting hot-swap NVMe drive RMA replacement']],
  ['memory', 'GPU & AI Clusters', 51, 'NVIDIA H100/H200 CUDA driver compilation, NVLink interconnect checks, InfiniBand RoCE tuning, and vLLM container runtime.', ['Verifying 3.2 Tbps InfiniBand link speeds', 'Setting up persistent MIG 1g.10gb slices', 'Deploying DeepSeek-R1 with vLLM & Docker']],
  ['public', 'Web & Reseller Hosting', 95, 'cPanel/WHM control center, LiteSpeed Enterprise caching, PHP selector versioning, automated JetBackup, and nameserver delegating.', ['Free full automated cPanel to cPanel migration', 'LiteSpeed Cache .htaccess rule configuration', 'Creating white-label private nameservers in WHM']],
  ['domain', 'Colocation & Facilities', 38, 'Requesting Smart Hands dispatch, scheduling biometric access visits, structured cabling, and dark-fiber cross-connect orders.', ['SLA guidelines for datacenter Smart Hands', 'Registering datacenter visitor access badges', 'Submitting LOA/CFA for carrier cross-connect']],
  ['receipt_long', 'Billing & Account', 42, 'Invoice generation, SEPA/ACH wire setups, SLA reimbursement calculations, sub-account RBAC, and YubiKey 2FA hardware keys.', ['How SLA credits are calculated and applied', 'Managing organization team members and RBAC', 'Setting up automated corporate invoicing via Stripe']],
]
const playbooks = [
  ['How to configure persistent NVIDIA MIG partitions on SXM5 bare-metal nodes', 'GPU Computing • Updated 2 days ago • 6 min read'],
  ['Setting up custom rDNS and PTR records via the PRIMO Cloud Portal', 'Networking & Anycast • Updated 5 days ago • 3 min read'],
  ['Zero-downtime database migration from cPanel MySQL to isolated VPS', 'Data Systems • Updated 1 week ago • 8 min read'],
  ['Configuring BGP sessions and announcing BYOIP /24 subnets in Frankfurt', 'Enterprise Colocation • Updated 2 weeks ago • 12 min read'],
]
const diagCmd = 'curl -sSL https://telemetry.primocloud.com/diag.sh | bash'
const sev = [['low', 'Low', 'General guidance'], ['medium', 'Medium', 'Degraded service'], ['high', 'High', 'Production impacted'], ['critical', 'Critical', 'System Down / NOC']]
const categories = [['bare-metal', 'Dedicated / Bare-Metal Server'], ['gpu-cluster', 'GPU & AI Compute Array'], ['vps', 'Linux / Windows VPS Instance'], ['colocation', 'Colocation & Facility Smart Hands'], ['shared', 'Web & Reseller Hosting (cPanel)'], ['n8n', 'Managed n8n / Workflow Cloud'], ['billing', 'Billing, Wire & Accounting']]
const guarantees = [['verified', '15-Minute Guaranteed First Response', 'SLA backed financial guarantee. Real systems engineer handling your case.'], ['lock', 'Encrypted Root Credential Vault', 'Passphrases and SSH keys are stored in an ephemeral, SOC 2 audited vault.'], ['perm_phone_msg', 'Emergency SMS / Phone Escalate', 'Critical Severity tickets trigger automated NOC on-call pager alerts.']]
const tiers = [
  ['Guaranteed First Response SLA', '< 1 Hour', '< 30 Minutes', '< 15 Minutes (100% Backed)'],
  ['Communication Channels', 'Web Ticket & Live Chat', 'Priority Ticket, Chat & Phone', 'Direct Slack/Teams Bridge + Pager Hotline'],
  ['Proactive Infrastructure Monitoring', 'Self-Service Telemetry', 'Ping & Port Monitoring (5 min ping)', 'Full Kernel / Process / RAM Auto-Heal (1m)'],
  ['Hardware Replacement Guarantee', '< 4 Hours', '< 2 Hours', '< 30 Minutes (Hot Standby Spares)'],
  ['Datacenter Smart Hands Included', '$120 / hour billing', '2 Hours Included / mo', 'Unlimited Emergency Smart Hands'],
  ['Dedicated Technical Account Manager', '—', '—', 'Named Senior Solutions Architect'],
  ['Migration & Kernel Audits', 'Standard automated tool', '1 Managed Migration / quarter', 'Continuous Custom Cluster Tuning'],
]
const faqs = [
  ['timer', 'How strictly does the 15-minute response SLA operate?', 'Our SLA is measured from the millisecond a ticket enters the queue until a certified systems architect analyzes your configuration and issues a substantive, technical reply. If we ever breach this window on eligible tiers, your account automatically receives service credits per our public SLA policy.'],
  ['settings_suggest', 'Will PRIMO engineers assist with third-party software?', 'Yes. While unmanaged servers natively cover OS kernel, networking, and hardware integrity, our Tier-3 team routinely assists with LiteSpeed tuning, cPanel restores, MySQL optimization, Docker container networking, and NVIDIA CUDA driver compilation under best-effort and Managed Care tiers.'],
  ['shield', 'What happens if my server experiences a multi-gigabit DDoS attack?', 'Our automated Anycast scrubbers filter layer-3 and layer-4 volumetric attacks (SYN floods, UDP amplification) inline across our global transit fabric without server rerouting or blackholing. The NOC is notified in real time, and legitimate clean traffic passes unimpeded.'],
  ['hardware', 'How quickly is faulty bare-metal hardware swapped?', 'All PRIMO tier-4 datacenters maintain cold and warm on-site hardware spares for every deployed SKU (NVMe drives, ECC DDR5 RAM, Intel/AMD CPUs, redundant PSUs). Hardware replacement is guaranteed within 2 hours on Business Care and 30 minutes on Mission-Critical plans.'],
  ['key', 'How do I safely grant temporary root credentials to technicians?', 'Never send passwords via email. Use the built-in Ephemeral Vault field in the Ticket Composer. The credentials are encrypted with AES-256-GCM, visible only to the dispatched sysadmin for the duration of the ticket, and purged automatically upon ticket closure.'],
  ['currency_exchange', 'How do I submit an SLA downtime credit claim?', 'Submit a ticket under the "Billing & Accounting" category within 14 days of an incident. Our telemetry auditing system cross-references our external Anycast probes and hypervisor logs. Verified downtime is credited directly against your upcoming billing cycle.'],
]
const slots = ['Today 16:00 UTC', 'Today 18:30 UTC', 'Tomorrow 09:00 UTC', 'Tomorrow 14:00 UTC']
// search index: every KB article + playbook
const index = [...kb.flatMap(([, cat, , , items]) => items.map((t) => ({ t, cat }))), ...playbooks.map(([t, m]) => ({ t, cat: m.split(' • ')[0] }))]

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
const Eyebrow = ({ children }) => <span className="font-mono-code text-label-sm uppercase tracking-widest text-primary font-bold">{children}</span>

const Support = () => {
  const rootRef = useRef(null)
  const searchRef = useRef(null)
  useMotion(rootRef)
  const [q, setQ] = useState('')
  const [focus, setFocus] = useState(false)
  const [engineers, setEngineers] = useState(14)
  const [age, setAge] = useState(0)
  const [on, setOn] = useState(false)
  const [book, setBook] = useState(false)
  const [slot, setSlot] = useState('')
  const [copied, setCopied] = useState(false)
  const [done, setDone] = useState(null)
  const [form, setForm] = useState({ severity: 'medium', cat: 'bare-metal', host: '', subject: '', desc: '', root: false })

  useEffect(() => { const t = setTimeout(() => setOn(true), 300); return () => clearTimeout(t) }, [])
  useEffect(() => {
    const onKey = (e) => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); searchRef.current?.focus(); searchRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }) } }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])
  useEffect(() => {
    if (reduced()) return
    const a = setInterval(() => setEngineers(13 + Math.floor(Math.random() * 4)), 4000)
    const b = setInterval(() => setAge((x) => (x >= 9 ? 0 : x + 1)), 1000)
    return () => { clearInterval(a); clearInterval(b) }
  }, [])

  const results = q.trim() ? index.filter((x) => (x.t + x.cat).toLowerCase().includes(q.toLowerCase())).slice(0, 6) : []
  const copy = async () => { try { await navigator.clipboard.writeText(diagCmd) } catch (e) { /* blocked */ } setCopied(true); setTimeout(() => setCopied(false), 2000) }
  const submit = (e) => { e.preventDefault(); setDone('PRM-' + Math.floor(100000 + Math.random() * 900000)) }
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))
  const field = 'w-full bg-surface-container-low border border-outline-variant/60 text-on-surface rounded-lg px-3 py-2.5 transition-all focus:outline-none focus:bg-surface-container-lowest focus:border-primary-container focus:ring-4 focus:ring-primary-container/15'

  return (
    <Layout>
      <div ref={rootRef} className="flex flex-col w-full">
        {/* top telemetry strip */}
        <div className="w-full bg-surface-container-high py-2 px-margin-mobile lg:px-margin">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-space-sm font-mono-code text-label-sm text-on-surface-variant">
            <div className="flex items-center gap-space-sm flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-semibold"><span className="w-2 h-2 rounded-full bg-primary-container animate-pulse" />ACTIVE NOC DISPATCH</span>
              <span className="hidden sm:inline text-outline-variant">•</span>
              <span>GLOBAL TIER-3 COVERAGE: <strong className="text-on-surface">FRANKFURT • LONDON • NEW YORK • TOKYO</strong></span>
            </div>
            <div className="flex items-center gap-space-md ml-auto"><span className="hidden md:inline">LIVE SLA PERFORMANCE:</span><span className="inline-flex items-center gap-1 font-bold text-primary"><I n="verified" c="text-[15px]" />99.999% SLA ACTIVE</span></div>
          </div>
        </div>

        {/* 1 HERO */}
        <section className="relative w-full bg-gradient-to-b from-surface-container-low via-surface to-surface pb-space-xl pt-space-lg px-margin-mobile lg:px-margin overflow-hidden">
          <div className="pointer-events-none absolute -top-40 right-0 h-96 w-96 rounded-full bg-primary-container/10 blur-3xl" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,rgba(11,175,96,0.18)_1px,transparent_1px)] bg-[size:28px_28px] [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_70%)]" />
          <div className="relative max-w-7xl mx-auto flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-container-highest border border-primary-container/20 shadow-sm mb-space-md"><span className="w-2.5 h-2.5 rounded-full bg-primary-container animate-ping shrink-0" /><span className="font-mono-code text-label-sm tracking-wider uppercase text-on-surface font-semibold">24/7/365 Global NOC • &lt;15 Min First Response SLA • 100% In-House SysAdmins</span></div>
            <h1 className="font-headline-xl lg:font-display-lg text-headline-xl lg:text-display-lg text-on-surface tracking-tight max-w-4xl font-bold">Enterprise Infrastructure Support: <span className="bg-gradient-to-r from-primary-container via-secondary to-primary-container bg-[length:200%_auto] bg-clip-text text-transparent animate-[shimmer_4s_linear_infinite]">Rapid Resolution</span> by Certified Systems Architects</h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-3xl mt-space-sm mb-space-lg leading-relaxed">Direct zero-friction access to Tier-3 Linux/Windows hypervisor engineers, live network telemetry, hardware diagnostics, and deep technical architecture playbooks.</p>

            {/* search */}
            <div className="w-full max-w-3xl relative">
              <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-xl p-2 flex flex-col sm:flex-row items-center gap-2 focus-within:border-primary-container focus-within:ring-4 focus-within:ring-primary-container/15 transition-all">
                <div className="flex items-center w-full px-3 gap-space-sm">
                  <I n="search" c="text-primary-container text-[24px]" />
                  <input ref={searchRef} value={q} onChange={(e) => setQ(e.target.value)} onFocus={() => setFocus(true)} onBlur={() => setTimeout(() => setFocus(false), 150)} className="w-full bg-transparent py-3 text-on-surface placeholder:text-outline focus:outline-none font-body-md text-body-md" placeholder="Search documentation, error codes, IPMI reset, BGP sessions, API endpoints..." type="text" />
                  <div className="hidden sm:flex items-center gap-1 px-2 py-1 bg-surface-container rounded font-mono-code text-[11px] text-on-surface-variant shrink-0"><span>Ctrl</span><span>K</span></div>
                </div>
                <button type="button" onClick={() => searchRef.current?.focus()} className="w-full sm:w-auto px-space-lg py-3 rounded-lg bg-gradient-to-r from-primary-container to-secondary text-on-primary font-label-md text-label-md font-semibold shadow-md whitespace-nowrap flex items-center justify-center gap-2 hover:-translate-y-0.5 transition-all"><span>Search KB</span><I n="arrow_forward" c="text-[18px]" /></button>
              </div>
              <div className={`absolute left-0 right-0 top-full pt-2 z-30 text-left transition-all duration-200 ${focus && q.trim() ? 'visible opacity-100 translate-y-0' : 'invisible opacity-0 translate-y-2'}`}>
                <div className="rounded-xl border border-outline-variant bg-surface-container-lowest shadow-2xl p-space-sm">
                  {results.length ? results.map((r) => (
                    <a key={r.t} href="#" className="group flex items-center gap-3 rounded-lg p-2.5 hover:bg-secondary-container/20 transition-colors"><span className="w-8 h-8 shrink-0 rounded-lg bg-secondary-container/40 flex items-center justify-center text-primary-container"><I n="article" c="text-[18px]" /></span><span className="flex-1 min-w-0"><span className="block font-label-md text-label-md text-on-surface">{r.t}</span><span className="block font-body-sm text-body-sm text-on-surface-variant">{r.cat}</span></span><I n="north_east" c="text-[16px] text-primary opacity-0 group-hover:opacity-100 transition-opacity" /></a>
                  )) : <div className="px-3 py-4 font-body-md text-body-md text-on-surface-variant">No guides match “{q}”. <a href="#ticket-composer" className="text-primary font-semibold hover:underline">Open a ticket instead →</a></div>}
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2 mt-space-md max-w-3xl">
              <span className="font-mono-code text-label-sm text-on-surface-variant mr-1">Trending:</span>
              {trending.map((t) => <button key={t} type="button" onClick={() => { setQ(t); searchRef.current?.focus() }} className="px-2.5 py-1 rounded-full bg-surface-container-high hover:bg-secondary-container hover:text-on-secondary-container text-on-surface-variant font-mono-code text-[11px] transition-colors">{t}</button>)}
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-gutter w-full mt-space-xl">
              {metrics.map(([l, ic, v, suf, d, w]) => (
                <div key={l} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-space-md shadow-sm text-left flex flex-col justify-between transition-all hover:-translate-y-1 hover:shadow-lg hover:border-primary-container/40">
                  <div className="flex items-center justify-between mb-2"><span className="font-mono-code text-label-sm text-on-surface-variant uppercase">{l}</span><I n={ic} c="text-primary-container text-[20px]" /></div>
                  <div className="font-headline-lg text-headline-lg font-bold text-on-surface tracking-tight">{v}{suf && <span className="text-headline-sm text-on-surface-variant font-normal">{suf}</span>}</div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">{d}</p>
                  <div className="w-full bg-surface-container-high h-1.5 rounded-full mt-3 overflow-hidden"><div className="bg-gradient-to-r from-primary-container to-secondary h-full transition-[width] duration-1000 ease-out" style={{ width: on ? `${w}%` : '0%' }} /></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 2 CHANNELS */}
        <Sec>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-space-lg gap-space-sm">
            <div><Eyebrow>Fast-Track Escalation</Eyebrow><h2 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight mt-1">Primary Support Channels</h2></div>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-md">Select the high-speed gateway matching your technical urgency. All channels connect to authentic server administrators.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
            {[
              ['confirmation_number', 'SLA: <15 MIN', false, 'Open Support Ticket', 'Log complex architectural queries, migration files, kernel traces, and hardware reconfiguration requests. Supports 50MB file attachments.', 'Submit New Ticket', 'link', '#ticket-composer'],
              ['forum', `${engineers} ENGINEERS ONLINE`, true, 'Live SysAdmin Chat', 'Direct text bridge to NOC specialists for fast triage, OS diagnostics, billing inquiries, and live server status questions in under 45 seconds.', 'Start Live Chat', 'chat'],
              ['phone_in_talk', 'PRIORITY HOTLINE', false, 'Emergency Phone', 'Dedicated enterprise voice circuit for Bare-Metal clusters, GPU arrays, Colocation cage security, and production outage escalation.', '+91 70002 50584', 'tel', 'tel:+917000250584'],
              ['psychology', 'SOLUTIONS ARCHITECTURE', false, 'Architect Consult', 'Schedule a dedicated 1-on-1 architecture screen share to plan large migrations, multi-homed BGP routing, or Slurm/vLLM AI deployment.', 'Book 30m Session', 'book'],
            ].map(([ic, badge, live, t, d, cta, kind, href], i) => (
              <div key={t} className={`p-space-lg flex flex-col justify-between ${cardHover}`}>
                <div>
                  <IconBox n={ic} />
                  <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded font-mono-code text-[11px] font-semibold mb-2 ${live ? 'bg-secondary-container text-on-secondary-container' : 'bg-surface-container text-on-surface'}`}>{(live || i === 0) && <span className={`w-1.5 h-1.5 rounded-full bg-primary-container ${live ? 'animate-pulse' : ''}`} />}{badge}</div>
                  <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-2">{t}</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md leading-relaxed">{d}</p>
                </div>
                {kind === 'link' || kind === 'tel'
                  ? <a href={href} className={`w-full py-2.5 rounded-lg font-label-md text-label-md font-semibold text-center block transition-all ${kind === 'link' ? 'bg-gradient-to-r from-primary-container to-secondary text-on-primary shadow-sm hover:-translate-y-0.5' : 'bg-surface-container-high text-on-surface hover:bg-primary-container hover:text-on-primary font-mono-code'}`}>{cta}</a>
                  : <button type="button" onClick={() => (kind === 'chat' ? window.dispatchEvent(new Event('primo:chat-open')) : setBook(true))} className="w-full py-2.5 rounded-lg bg-surface-container-high text-on-surface font-label-md text-label-md font-semibold text-center hover:bg-primary-container hover:text-on-primary transition-colors block">{cta}</button>}
              </div>
            ))}
          </div>
        </Sec>

        {/* 3 HEALTH */}
        <Sec bg="bg-surface-container-low">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-xl p-space-lg">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-space-md mb-space-md gap-4 border-b border-outline-variant/40">
              <div className="flex items-center gap-space-sm">
                <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container shrink-0"><I n="cloud_done" c="text-[24px]" /></div>
                <div><div className="flex flex-wrap items-center gap-2"><h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">Global Datacenter Operations</h3><span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-mono-code text-[11px] font-bold"><span className="w-1.5 h-1.5 rounded-full bg-primary-container animate-pulse" />ALL SYSTEMS OPERATIONAL</span></div><p className="font-body-sm text-body-sm text-on-surface-variant">Live telemetry ping across compute fabrics, Anycast routing nodes, and SAN arrays.</p></div>
              </div>
              <div className="flex items-center gap-space-sm"><span className="font-mono-code text-[12px] text-on-surface-variant hidden sm:inline">Telemetry Refreshed: {age === 0 ? 'Just Now' : `${age}s ago`}</span><a href="/server-status" className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-sm text-label-sm font-semibold transition-colors flex items-center gap-1"><span>Incident Log & Metrics</span><I n="arrow_forward" c="text-[16px]" /></a></div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-space-sm mb-space-md">
              {dcs.map(([c, n, u]) => <div key={c} className="p-3 rounded-lg bg-surface-container-low border border-outline-variant/50 flex flex-col justify-between transition-all hover:-translate-y-1 hover:shadow-md"><div className="flex items-center justify-between"><span className="font-mono-code text-label-sm font-bold text-on-surface">{c}</span><span className="w-2 h-2 rounded-full bg-primary-container animate-pulse" /></div><span className="font-body-sm text-[12px] text-on-surface-variant">{n}</span><div className="flex items-center justify-between mt-2 pt-2 border-t border-outline-variant/40"><span className="font-mono-code text-[10px] text-on-surface-variant">UPTIME</span><span className="font-mono-code text-[11px] font-semibold text-primary">{u}</span></div></div>)}
            </div>
            <div className="bg-surface-container p-3 rounded-lg flex flex-wrap items-center justify-between gap-3 font-mono-code text-[11px]">
              {services.map(([k, v]) => <div key={k} className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-primary-container" /><span className="text-on-surface">{k} <strong>{v}</strong></span></div>)}
            </div>
          </div>
        </Sec>

        {/* 4 KB CATEGORIES */}
        <Sec>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-space-lg gap-space-sm">
            <div><Eyebrow>Self-Service Documentation</Eyebrow><h2 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight mt-1">Browse by Product Architecture</h2></div>
            <a href="/knowledge-base" className="font-label-md text-label-md text-primary font-semibold hover:underline flex items-center gap-1"><span>Explore All 420+ Documentation Guides</span><I n="east" c="text-[18px]" /></a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
            {kb.map(([ic, t, n, d, items]) => (
              <div key={t} className={`p-space-lg ${cardHover}`}>
                <div className="flex items-center justify-between mb-space-sm"><IconBox n={ic} size="w-10 h-10 rounded-lg" fs="text-[24px]" mb="" /><span className="font-mono-code text-[11px] px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-medium">{n} Articles</span></div>
                <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-2">{t}</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">{d}</p>
                <ul className="flex flex-col gap-2 font-body-sm text-[13px] text-on-surface-variant">{items.map((x) => <li key={x}><a href="#" className="hover:text-primary hover:translate-x-1 transition-all flex items-center gap-2"><span className="text-primary-container">›</span>{x}</a></li>)}</ul>
              </div>
            ))}
          </div>
        </Sec>

        {/* 5 PLAYBOOKS */}
        <Sec bg="bg-surface-container-low">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-lg items-start">
            <div className="lg:col-span-6 flex flex-col justify-center">
              <Eyebrow>Frequently Consulted</Eyebrow>
              <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight mt-1 mb-space-md">Top Trending Technical Playbooks & Diagnostics</h2>
              <p className="font-body-md text-body-md text-on-surface-variant mb-space-lg leading-relaxed">Engineered by PRIMO Systems Architects. Step-by-step verified procedures to resolve server, cluster, and routing challenges without waiting for a ticket turnaround.</p>
              <div className="flex flex-col gap-space-sm">
                {playbooks.map(([t, m], i) => (
                  <a key={t} href="#" className="p-space-md bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm hover:shadow-lg hover:border-primary-container/40 hover:-translate-y-0.5 transition-all flex items-start gap-space-md group">
                    <span className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center font-mono-code text-label-sm font-bold text-primary group-hover:bg-primary-container group-hover:text-on-primary transition-colors shrink-0">{String(i + 1).padStart(2, '0')}</span>
                    <div className="flex flex-col"><span className="font-headline-sm text-[16px] font-bold text-on-surface group-hover:text-primary transition-colors">{t}</span><span className="font-body-sm text-[12px] text-on-surface-variant mt-1">{m}</span></div>
                  </a>
                ))}
              </div>
            </div>
            <div className="lg:col-span-6 bg-inverse-surface rounded-xl shadow-2xl shadow-primary/10 p-space-lg text-inverse-on-surface flex flex-col justify-between">
              <div className="flex items-center justify-between gap-2 pb-3 border-b border-surface-container-highest/20 mb-4">
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-error" /><span className="w-3 h-3 rounded-full bg-[#f59e0b]" /><span className="w-3 h-3 rounded-full bg-primary-container" /><span className="font-mono-code text-[12px] text-surface-variant ml-2">primo-diagnostics-cli.sh</span></div>
                <button type="button" onClick={copy} className="flex items-center gap-1 text-[11px] font-mono-code px-2 py-1 rounded bg-surface-variant/20 hover:bg-surface-variant/40 transition-colors"><I n={copied ? 'check' : 'content_copy'} c="text-[14px]" /><span>{copied ? 'Copied!' : 'Copy Tool'}</span></button>
              </div>
              <div className="font-mono-code text-[12px] leading-relaxed text-surface-container-highest space-y-2 overflow-x-auto">
                <div className="text-outline-variant whitespace-nowrap"># PRIMO Cloud One-Touch Node Health & Latency Probe</div>
                <div className="whitespace-nowrap"><span className="text-primary-fixed-dim">$</span> {diagCmd}</div>
                <div className="text-secondary-fixed pt-1 whitespace-nowrap">[OK] Hypervisor KVM Ring 0: Clean</div>
                <div className="text-secondary-fixed whitespace-nowrap">[OK] NVMe IOPS Latency: 0.12ms (Target &lt; 0.50ms)</div>
                <div className="text-secondary-fixed whitespace-nowrap">[OK] Anycast MTU Peering: 9000 Jumbo Frames Active</div>
                <div className="text-secondary-fixed whitespace-nowrap">[OK] Direct Hardware Memory Check: ECC 0 Single-Bit Errors</div>
                <div className="text-surface-variant pt-1 whitespace-nowrap">[STATUS] Diagnostic hash generated: <span className="text-primary-fixed">#PRIMO-8842-FRA</span></div>
                <div className="text-outline-variant whitespace-nowrap"># Paste the hash directly into your support ticket for 1-click sysadmin resolution</div>
              </div>
              <div className="mt-6 pt-4 border-t border-surface-container-highest/20 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2"><I n="verified_user" c="text-primary-fixed text-[20px]" /><span className="font-body-sm text-[12px] text-surface-container-high">Automated diagnostic parsing supported across all PRIMO tickets</span></div>
                <a href="#ticket-composer" className="px-3 py-1.5 rounded bg-primary-container text-on-primary font-mono-code text-[11px] font-semibold hover:bg-primary transition-colors shrink-0">Submit Ticket with Hash</a>
              </div>
            </div>
          </div>
        </Sec>

        {/* 6 TICKET COMPOSER */}
        <Sec id="ticket-composer">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
            <div className="lg:col-span-4 bg-gradient-to-br from-surface-container-low to-surface-container p-space-xl flex flex-col justify-between">
              <div>
                <Eyebrow>Priority Pipeline</Eyebrow>
                <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface mt-1 mb-space-md">Create an Enterprise Support Ticket</h2>
                <p className="font-body-md text-body-md text-on-surface-variant mb-space-lg leading-relaxed">Every submission is routed straight to a certified sysadmin specializing in your service tier. No tier-1 gatekeepers or canned responses.</p>
                <div className="space-y-4">{guarantees.map(([n, t, d]) => <div key={t} className="flex items-start gap-3"><I n={n} c="text-primary-container text-[20px] shrink-0 mt-0.5" /><div><h4 className="font-headline-sm text-[14px] font-bold text-on-surface">{t}</h4><p className="font-body-sm text-[12px] text-on-surface-variant">{d}</p></div></div>)}</div>
              </div>
              <div className="mt-space-xl p-3 bg-surface-container-lowest border border-outline-variant rounded-lg shadow-sm">
                <span className="font-mono-code text-[11px] text-on-surface-variant block uppercase font-bold mb-1">Authenticated Account</span>
                <div className="flex items-center justify-between gap-2"><div className="flex items-center gap-2 min-w-0"><div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-[10px] text-on-primary font-bold shrink-0">EC</div><span className="font-label-sm text-label-sm font-semibold text-on-surface truncate">enterprise-core@primocloud.com</span></div><span className="text-primary font-mono-code text-[11px] font-bold">VERIFIED</span></div>
              </div>
            </div>

            <div className="lg:col-span-8 p-space-lg lg:p-space-xl">
              {done ? (
                <div className="h-full flex flex-col items-center justify-center text-center gap-space-md py-space-xl">
                  <div className="w-16 h-16 rounded-full bg-secondary-container flex items-center justify-center text-primary"><I n="task_alt" c="text-[36px]" /></div>
                  <h3 className="font-headline-md text-headline-md font-bold text-on-surface">Ticket #{done} has been prioritized</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant max-w-md">A Tier-3 engineer has been dispatched. Expect a first technical response within 15 minutes{form.severity === 'critical' ? ' — the NOC on-call pager has also been triggered.' : '.'}</p>
                  <button type="button" onClick={() => { setDone(null); setForm({ severity: 'medium', cat: 'bare-metal', host: '', subject: '', desc: '', root: false }) }} className="px-space-lg py-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md font-semibold transition-colors">Submit Another Ticket</button>
                </div>
              ) : (
                <form onSubmit={submit} className="space-y-space-md">
                  <div>
                    <label className="block font-label-md text-label-md text-on-surface font-semibold mb-2">Issue Severity Level *</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {sev.map(([v, t, s]) => {
                        const crit = v === 'critical'
                        const sel = form.severity === v
                        return (
                          <label key={v} className={`flex flex-col items-center justify-center p-3 rounded-lg cursor-pointer transition-all border ${crit ? 'bg-error-container text-on-error-container' : 'bg-surface-container-low hover:bg-surface-container'} ${sel ? (crit ? 'border-error font-bold ring-2 ring-error/30' : 'border-primary-container bg-secondary-container/30 font-bold ring-2 ring-primary-container/20') : 'border-transparent'}`}>
                            <input className="sr-only" name="severity" type="radio" value={v} checked={sel} onChange={set('severity')} />
                            <span className="font-mono-code text-label-sm flex items-center gap-1">{crit && <span className="w-2 h-2 rounded-full bg-error animate-pulse" />}{t}</span>
                            <span className={`text-[11px] ${crit ? '' : 'text-on-surface-variant'}`}>{s}</span>
                          </label>
                        )
                      })}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                    <div><label className="block font-label-md text-label-md text-on-surface font-semibold mb-1.5">Affected Service Category *</label><select value={form.cat} onChange={set('cat')} className={`${field} font-body-md text-body-md`}>{categories.map(([v, t]) => <option key={v} value={v}>{t}</option>)}</select></div>
                    <div><label className="block font-label-md text-label-md text-on-surface font-semibold mb-1.5">Server Hostname or IP Address *</label><input required value={form.host} onChange={set('host')} className={`${field} font-mono-code text-[13px]`} placeholder="e.g. node-04.lon.primocloud.net or 185.120.44.18" type="text" /></div>
                  </div>
                  <div><label className="block font-label-md text-label-md text-on-surface font-semibold mb-1.5">Ticket Subject *</label><input required value={form.subject} onChange={set('subject')} className={`${field} font-body-md text-body-md`} placeholder="Brief summary of the issue (e.g. NVMe drive degraded in RAID array / Kernel panic)" type="text" /></div>
                  <div><label className="block font-label-md text-label-md text-on-surface font-semibold mb-1.5">Detailed Technical Description & Error Logs *</label><textarea required rows={4} value={form.desc} onChange={set('desc')} className={`${field} font-mono-code text-[12px]`} placeholder="Paste relevant terminal output, kernel logs (dmesg), IPMI screenshots link, or troubleshooting steps already performed..." /></div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm pt-2">
                    <label className="inline-flex items-center gap-2 cursor-pointer text-on-surface-variant hover:text-on-surface"><I n="attach_file" c="text-[20px] text-primary" /><span className="font-label-md text-label-md">Attach files or logs (up to 50MB)</span><input className="sr-only" multiple type="file" /></label>
                    <label className="inline-flex items-center gap-2 cursor-pointer"><input checked={form.root} onChange={set('root')} className="w-4 h-4 rounded accent-primary-container" type="checkbox" /><span className="font-body-sm text-[12px] text-on-surface-variant">Authorize temporary emergency sysadmin root access</span></label>
                  </div>
                  <div className="pt-space-sm flex flex-col sm:flex-row items-center justify-between gap-space-md">
                    <div className="flex items-center gap-2 text-on-surface-variant font-mono-code text-[11px]"><span className="w-2 h-2 rounded-full bg-primary-container animate-pulse" /><span>NOC On-Call Engineer: Ready for Dispatch</span></div>
                    <button type="submit" className="group relative overflow-hidden w-full sm:w-auto px-space-xl py-3 rounded-lg bg-gradient-to-r from-primary-container to-secondary text-on-primary font-label-md text-label-md font-semibold shadow-md shadow-primary-container/30 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 before:absolute before:inset-y-0 before:-left-full before:w-1/2 before:skew-x-[-20deg] before:bg-white/30 hover:before:left-[150%] before:transition-all before:duration-700"><span>Submit Priority Request</span><I n="send" c="text-[18px]" /></button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </Sec>

        {/* 7 TIERS */}
        <Sec bg="bg-surface-container-low">
          <div className="text-center max-w-3xl mx-auto mb-space-xl">
            <Eyebrow>SLA Guarantee Matrix</Eyebrow>
            <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface tracking-tight mt-1 mb-space-sm">Enterprise Support Tiers & Service Level Agreements</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">Transparent response commitments, proactive node health monitors, and dedicated technical account managers scaled for high concurrency workloads.</p>
          </div>
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-xl overflow-x-auto">
            <table className="w-full min-w-[860px] text-left border-collapse">
              <thead><tr className="bg-surface-container">
                <th className="p-space-md font-headline-sm text-label-lg font-bold text-on-surface w-1/4">Feature / SLA Matrix</th>
                <th className="p-space-md w-1/4"><span className="font-headline-sm text-headline-sm font-bold text-on-surface block">Standard Support</span><span className="font-mono-code text-label-sm text-primary font-semibold">Included with all servers</span></th>
                <th className="p-space-md w-1/4 bg-surface-container-high/60"><span className="font-headline-sm text-headline-sm font-bold text-on-surface block">Business Care</span><span className="font-mono-code text-label-sm text-on-surface-variant font-semibold">$99 / month</span></th>
                <th className="p-space-md w-1/4 bg-gradient-to-r from-primary to-secondary text-on-primary"><div className="flex items-center justify-between gap-2"><span className="font-headline-sm text-headline-sm font-bold block">Mission-Critical</span><span className="px-2 py-0.5 rounded bg-primary-container text-on-primary font-mono-code text-[10px] uppercase font-bold whitespace-nowrap">Included w/ GPU & Colo</span></div><span className="font-mono-code text-label-sm text-secondary-fixed block">$499 / mo standalone</span></th>
              </tr></thead>
              <tbody className="divide-y divide-surface-container font-body-sm text-[13px]">
                {tiers.map(([a, b, c, d]) => (
                  <tr key={a} className="hover:bg-secondary-container/10 transition-colors">
                    <td className="p-space-md font-semibold text-on-surface">{a}</td>
                    <td className={`p-space-md ${b === '—' ? 'text-outline-variant' : 'text-on-surface-variant'}`}>{b}</td>
                    <td className={`p-space-md bg-surface-container-high/30 ${c === '—' ? 'text-outline-variant' : 'text-on-surface'}`}>{c}</td>
                    <td className="p-space-md text-primary font-bold bg-secondary-container/20"><span className="flex items-center gap-1.5">{d !== '—' && <I n="check_circle" c="text-[16px] text-primary-container shrink-0" />}{d}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Sec>

        {/* 8 FAQ */}
        <Sec>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-space-lg gap-space-sm">
            <div><Eyebrow>Transparent Policies</Eyebrow><h2 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight mt-1">Frequently Asked Support Questions</h2></div>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-md">Learn how our NOC escalations, hardware warranties, and SLA reimbursement claims operate in real time.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
            {faqs.map(([n, t, d]) => <div key={t} className={`p-space-lg ${cardHover}`}><div className="flex items-start gap-space-sm mb-2"><I n={n} c="text-primary-container text-[22px] shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6" /><h3 className="font-headline-sm text-[16px] font-bold text-on-surface">{t}</h3></div><p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">{d}</p></div>)}
          </div>
        </Sec>

        {/* 9 OUTAGE BANNER */}
        <section className="w-full py-space-xl px-margin-mobile lg:px-margin bg-surface-container-low">
          <div className="max-w-7xl mx-auto relative overflow-hidden bg-gradient-to-r from-primary via-secondary to-primary-container bg-[length:200%_100%] animate-[shimmer_10s_linear_infinite] rounded-xl shadow-2xl shadow-primary/20 p-space-lg lg:p-space-xl text-on-primary flex flex-col lg:flex-row items-center justify-between gap-space-lg">
            <span className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10 animate-float" />
            <div className="relative flex items-start gap-space-md max-w-2xl">
              <div className="w-12 h-12 rounded-lg bg-surface-container-lowest/15 flex items-center justify-center shrink-0"><I n="crisis_alert" c="text-on-primary text-[32px] animate-pulse" /></div>
              <div><div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-surface-container-lowest/20 font-mono-code text-[11px] font-bold uppercase mb-2">Mission-Critical Production Down</div><h3 className="font-headline-lg text-headline-lg font-bold tracking-tight mb-2">Experiencing a Severe Outage?</h3><p className="font-body-md text-body-md text-on-primary/90 leading-relaxed">Bypass ticket tiers and activate the 24/7 Enterprise NOC Escalation hotline. Direct automated bridge to the Senior Shift Commander with a 60-second emergency dispatch.</p></div>
            </div>
            <div className="relative flex flex-col sm:flex-row items-center gap-space-md shrink-0 w-full lg:w-auto">
              <a href="tel:+917000250584" className="w-full sm:w-auto px-space-lg py-3.5 rounded-lg bg-surface-container-lowest text-on-surface font-label-md text-label-md font-bold hover:bg-surface transition-all shadow-lg flex items-center justify-center gap-2 hover:-translate-y-0.5"><I n="call" c="text-primary text-[20px]" /><span>+91 70002 50584</span></a>
              <a href="#ticket-composer" onClick={() => setForm((f) => ({ ...f, severity: 'critical' }))} className="w-full sm:w-auto px-space-lg py-3.5 rounded-lg bg-primary-fixed text-on-primary-fixed font-label-md text-label-md font-bold hover:bg-primary-fixed-dim transition-all shadow-lg flex items-center justify-center gap-2 hover:-translate-y-0.5"><I n="bolt" c="text-[20px]" /><span>Open P1 Critical Ticket</span></a>
            </div>
          </div>
        </section>

        {/* BOOKING MODAL */}
        <div className={`fixed inset-0 z-[80] flex items-center justify-center p-4 transition-all duration-300 ${book ? 'visible opacity-100' : 'invisible opacity-0'}`}>
          <div className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm" onClick={() => setBook(false)} />
          <div className="relative w-full max-w-md rounded-xl bg-surface-container-lowest shadow-2xl p-space-lg">
            <div className="flex items-start justify-between mb-space-sm"><div><h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">Book a 30-minute Architect Session</h3><p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Pick a slot for a 1-on-1 screen share with a Solutions Architect.</p></div><button type="button" aria-label="Close" onClick={() => setBook(false)} className="w-8 h-8 rounded-lg hover:bg-surface-container flex items-center justify-center"><I n="close" c="text-[20px]" /></button></div>
            <div className="grid grid-cols-2 gap-2 my-space-md">{slots.map((s) => <button key={s} type="button" onClick={() => setSlot(s)} className={`px-3 py-2.5 rounded-lg border font-label-md text-label-md transition-all ${slot === s ? 'border-primary-container bg-secondary-container/40 text-primary font-bold' : 'border-outline-variant text-on-surface hover:bg-surface-container'}`}>{s}</button>)}</div>
            <button type="button" disabled={!slot} onClick={() => { setBook(false) }} className="w-full py-2.5 rounded-lg bg-gradient-to-r from-primary-container to-secondary text-on-primary font-label-md text-label-md font-semibold disabled:opacity-40 transition-all">{slot ? `Confirm ${slot}` : 'Select a time slot'}</button>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Support