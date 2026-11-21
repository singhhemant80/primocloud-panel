import { orderUrl } from "../../lib/panel";
import React, { useState, useEffect, useRef } from "react";
import Layout from "../../components/layout";
import { useMotion } from "../../components/motion";
import { useCurrency } from "../../context/CurrencyContext";
import { I, Pill, Sec, Head, cardHover, IconBox } from "../../components/ui";

// ---------- content (taken from the HTML design) ----------
const proof = [
  ["99.999%", "Trading Uptime SLA", 1],
  ["<0.8ms", "LD4 & NY4 Latency", 1],
  ["Zero", "Slippage Guarantee"],
  ["Instant", "MT4/MT5 Autostart"],
];
const pillars = [
  [
    "electric_bolt",
    "Sub-Millisecond Cross-Connects",
    "Direct physical dark fiber connections inside Equinix LD4 (London Slough), NY4 (Secaucus NJ), and TY3 (Tokyo) right next to major broker liquidity matching pools.",
    "PING TO LD4: <0.5ms",
  ],
  [
    "memory",
    "AMD EPYC™ 3.7GHz+ High-Clock",
    "Dedicated high-frequency cores deliver maximum single-thread execution speed without CPU core-stealing or throttle spikes during high-volatility events like NFP and CPI.",
    "ZERO CPU STEAL",
  ],
  [
    "published_with_changes",
    "24/7/365 Unbroken Bot Uptime",
    "Tier-4 datacenter architecture with dual power rails, redundant multi-carrier routing, and automated terminal crash guards that relaunch your MT4/MT5 automatically.",
    "100% POWER SLA",
  ],
  [
    "devices",
    "Clientless 60 FPS HTML5 Web RDP",
    "Seamlessly monitor and adjust your Expert Advisors from any Mac, PC, iPad, or mobile phone browser. Zero local software installation required with silky responsive rendering.",
    "ANY BROWSER ACCESS",
  ],
];
const plans = [
  {
    n: "Trader Basic", slug: "forex-trader-basic",
    tag: "Entry Level",
    d: "Designed for solo retail traders operating 1-2 standard automated terminals.",
    p: [9.99, 7.99],
    cta: "Deploy Basic",
    s: [
      "**1 vCPU** @ 3.4GHz+ AMD EPYC",
      "**2 GB** DDR5 ECC RAM",
      "**50 GB** NVMe Gen4 Storage",
      "1–2 MT4 / MT5 Terminals",
      "Equinix LD4 (London) or NY4 (NY)",
      "99.99% Trading SLA",
    ],
  },
  {
    n: "Trader Pro", slug: "forex-trader-pro",
    tag: "Recommended",
    feat: true,
    d: "Optimized for active algorithmic traders managing multiple asset pairs.",
    p: [19.99, 15.99],
    cta: "Deploy Trader Pro",
    s: [
      "**2 vCPU** @ 3.7GHz+ Dedicated",
      "**4 GB** DDR5 ECC RAM",
      "**90 GB** NVMe Gen4 Storage",
      "3–6 MT4 / MT5 Terminals",
      "Automated Crash-Guardian Daemon",
      "Unmetered 1Gbps Direct Fiber",
    ],
  },
  {
    n: "Algo Master", slug: "forex-algo-master",
    tag: "Power Bot",
    d: "Heavy-duty compute for tick scalpers, cTrader, and multi-broker setups.",
    p: [34.99, 27.99],
    cta: "Deploy Algo Master",
    s: [
      "**4 vCPU** @ 3.8GHz+ Dedicated",
      "**8 GB** DDR5 ECC RAM",
      "**160 GB** NVMe Gen4 Storage",
      "8–15 MT4 / MT5 / cTrader Bots",
      "Dedicated Clean Static IPv4",
      "24/7 Priority Quant Support",
    ],
  },
  {
    n: "High-Frequency Quant", slug: "forex-hf-quant",
    tag: "Bare Metal",
    d: "Enterprise cluster for fund managers, Python FIX API & prop firm trading pools.",
    p: [64.99, 51.99],
    cta: "Deploy Quant",
    s: [
      "**8 vCPU** Bare-Metal Pinning",
      "**16 GB** DDR5 ECC RAM",
      "**320 GB** NVMe Gen4 Storage",
      "Unlimited Trading Bots & FIX Engines",
      "Dual Broker Cross-Connect Peering",
      "99.999% Financial SLA",
    ],
  },
];
const planTrust = [
  ["verified_user", "30-Day Money-Back Guarantee"],
  ["bolt", "Instant 45-Second Node Activation"],
  ["support_agent", "Free EA & Template Migration Assistance"],
];
const brokers = [
  [
    "IC",
    "IC Markets (Raw Spread)",
    "Equinix NY4 (Secaucus) / LD4",
    "Direct 10G Optical Fiber",
    0.35,
    "Ultra-Low",
  ],
  [
    "PS",
    "Pepperstone Markets",
    "Equinix LD4 (London Slough)",
    "Dark Fiber Peering",
    0.48,
    "Ultra-Low",
  ],
  [
    "FT",
    "FTMO & Top Prop Firms",
    "Equinix LD4 (London)",
    "Tier-1 Direct BGP Transit",
    0.72,
    "Institutional Grade",
  ],
  [
    "TM",
    "Tickmill ECN",
    "Equinix LD4 (London)",
    "Direct In-Rack Cross-Connect",
    0.41,
    "Ultra-Low",
  ],
  [
    "XM",
    "XM Group Ultra-Low",
    "Equinix LD4 (London)",
    "10G Peering Link",
    0.65,
    "Ultra-Low",
  ],
  [
    "EX",
    "Exness Pro Accounts",
    "Equinix LD4 / NY4 Interconnect",
    "Dedicated Optical Path",
    0.58,
    "Ultra-Low",
  ],
];
const why = [
  [
    "trending_up",
    "Zero Slippage Execution",
    "Market orders execute in sub-millisecond intervals, locking in quote prices before spreads widen or liquidity pools adjust in volatile trading sessions.",
  ],
  [
    "install_desktop",
    "Pre-Configured Trading Stacks",
    "One-click deployment script bundles MT4, MT5, cTrader, TradingView Webhook listeners, and NinjaTrader 8 right out of the box with zero setup hurdles.",
  ],
  [
    "security",
    "Auto-Start & Watchdog Daemon",
    "Proprietary background daemon constantly verifies terminal health. If an EA crashes or hangs, the watchdog relaunches the terminal and restores live trades automatically.",
  ],
  [
    "shield",
    "1.2+ Tbps Anti-DDoS Trading Shield",
    "Specialized financial BGP traffic scrubbing tuned to block volumetric UDP floods without adding jitter or packet latency to your active broker socket links.",
  ],
  [
    "lan",
    "Dedicated Clean Static IPv4",
    "Never risk broker security lockouts or temporary IP blacklisting caused by shared address pools. Each VPS includes a clean, dedicated enterprise IPv4 address.",
  ],
  [
    "support",
    "Tier-3 Certified Financial SysAdmins",
    "Direct access to technical support engineers who understand DLL imports, MQL4/MQL5 scripting, FIX API sockets, and complex high-frequency terminal optimization.",
  ],
];
const platforms = [
  ["MT4", "MetaTrader 4"],
  ["MT5", "MetaTrader 5"],
  ["cT", "cTrader Algo"],
  [null, "TradingView"],
  ["Py", "Python Quant"],
  ["NT8", "NinjaTrader 8"],
  ["FIX", "FIX 4.4 / 5.0"],
];
const osList = [
  "Windows Server 2025 Trading Edition",
  "Windows Server 2022 Datacenter",
  "Windows 11 Pro",
  "Ubuntu 24.04 LTS (Headless Wine / Docker)",
];
const compare = [
  [
    "Broker Proximity Latency",
    "<0.5 ms (Direct LD4 / NY4 Cross-Connect)",
    "40 ms – 180 ms (ISP route dependent)",
    "15 ms – 50 ms (General IP routing)",
  ],
  [
    "Power & Network SLA",
    "100% Uptime SLA • Dual Redundant Feeds",
    "Subject to home ISP drops & power cuts",
    "99.9% SLA (Unplanned maintenance common)",
  ],
  [
    "Hardware Throttling & Steal",
    "0% Steal • Dedicated AMD EPYC 3.7GHz+",
    "Thermal throttling & Windows updates reboot",
    "Shared vCPU with noisy neighbor spikes",
  ],
  [
    "High-Impact News Slippage",
    "Virtually Zero Slippage on execution",
    "Severe slippage due to network queueing",
    "Moderate slippage during burst volatility",
  ],
  [
    "Terminal Auto-Recovery Watchdog",
    "Built-in Proprietary Daemon Included",
    "None (Requires manual user intervention)",
    "Manual custom bash/python scripting required",
  ],
  [
    "Forex-Specialized Tech Support",
    "24/7/365 Live Financial Systems Engineers",
    "Self-managed",
    "Ticket-based general Linux support",
  ],
];
const consolePoints = [
  "1-Click Live Hypervisor Snapshots",
  "Automated Health Restarts for Hung Terminals",
  "Live BGP Peering Reroute On Demand",
];
const procs = [
  ["terminal64.exe (MT5)", "#882103 • Gold Scalper Pro"],
  ["terminal.exe (MT4)", "#419082 • Grid EURUSD EA"],
];
const reviews = [
  [
    "MK",
    "Marcus Keller",
    "Lead Quant, Apex Liquid Capital",
    '"We run high-frequency news trading bots on EUR/USD. On AWS we were suffering 2.3 pips of execution slippage during NFP releases. Moving to PRIMO CLOUD\'s LD4 dedicated instance brought our broker ping to 0.4ms and virtually eliminated execution delay."',
  ],
  [
    "DL",
    "David Laurent",
    "FTMO $400k Funded Trader",
    '"Managing 4 funded prop accounts simultaneously requires absolute stability. The built-in MT5 watchdog daemon has saved me multiple times by instantly restarting terminals without me having to panic on my phone. 100% recommended for prop traders."',
  ],
  [
    "SC",
    "Sarah Chen",
    "Automated EA Developer",
    '"The browser-based HTML5 RDP is ridiculously fast. I can check and adjust my cTrader bot parameters on my iPad Pro while traveling, with crystal clear resolution and zero lag. Support even helped migrate my custom DLL indicators."',
  ],
];
const faqs = [
  [
    "What is a Forex VPS and why do I need one for algorithmic trading?",
    "A Forex VPS (Virtual Private Server) is a high-availability server located directly inside premier financial datacenters like Equinix London (LD4) or New York (NY4). It runs your trading platform (MT4, MT5, cTrader) 24/7 without being affected by your local home internet disconnections, laptop sleep mode, or power outages, guaranteeing constant execution of your automated trading bots.",
  ],
  [
    "How do you achieve sub-millisecond execution latency with brokers?",
    "We locate our hardware inside the exact same Equinix campus facilities (LD4 Slough and NY4 Secaucus) where primary Forex brokers (IC Markets, Pepperstone, Tickmill, etc.) host their order matching engines. We link to them via direct optical fiber cross-connects, keeping physical travel time under 1 millisecond.",
  ],
  [
    "Can I run multiple MetaTrader 4 or 5 terminals simultaneously?",
    "Yes! You can install and operate multiple portable MT4 and MT5 instances on the same VPS. Our Trader Pro tier smoothly supports 3–6 terminals, while the Algo Master and Quant tiers are built to handle 10 to unlimited algorithmic terminals simultaneously.",
  ],
  [
    "Will my Expert Advisors (EAs) keep running if I close my computer?",
    'Absolutely. Once you start your Expert Advisors inside the VPS and enable "AutoTrading", you can disconnect from Remote Desktop, turn off your personal laptop, and your bots will continue computing ticks and sending orders 24 hours a day, 7 days a week.',
  ],
  [
    "How do I access my Forex VPS from my Mac, iPhone, or iPad?",
    "You can connect using the free Microsoft Remote Desktop app on macOS, iOS, and Android. Additionally, PRIMO CLOUD provides an exclusive HTML5 clientless Web RDP portal, enabling you to manage your VPS directly from Safari, Chrome, or Firefox without installing any third-party apps.",
  ],
  [
    "Do you offer pre-installed MT4/MT5 software and auto-startup on reboot?",
    "Yes, every Windows Server template comes with our 1-Click Platform Installer for MetaTrader 4, MetaTrader 5, and cTrader. Furthermore, our proprietary Watchdog Daemon is pre-configured to automatically relaunch your terminals and verify account connections whenever the server boots.",
  ],
  [
    "Where are your Forex VPS datacenters located?",
    "Our primary trading nodes reside in Equinix LD4 (London Slough, UK) and Equinix NY4 (Secaucus, New Jersey, USA). We also maintain secondary financial peering zones in Equinix TY3 (Tokyo) and Frankfurt (FR2) for Asian and European continental brokers.",
  ],
  [
    "What happens during major news events like NFP or rate hikes?",
    "High-impact news creates enormous tick bursts that often overwhelm standard virtual private servers. PRIMO CLOUD utilizes dedicated AMD EPYC high-clock cores and unmetered 10Gbps uplinks to ensure zero CPU throttling and zero network packet drops during peak market volatility.",
  ],
  [
    "Can I easily migrate my existing trading setups and indicators?",
    "Yes! You can easily copy and paste your MQL4/MQL5 folders, Expert Advisors (.ex4/.ex5), indicators, profiles, and templates straight into your VPS via Remote Desktop clipboard or shared folders. Our 24/7 financial support team is also available to migrate your setups for free.",
  ],
  [
    "Is my trading data, strategy, and broker credentials private?",
    "100% private and enterprise-isolated. Each VPS is fully sandboxed on dedicated hypervisor instances with isolated encrypted NVMe storage. No staff member has access to your passwords, trading strategies, or EA files.",
  ],
];
// [x, wickTop, wickBottom, bodyY, bodyH, up]
const baseCandles = [
  [30, 35, 70, 45, 20, 1],
  [70, 40, 65, 48, 12, 0],
  [110, 25, 55, 32, 18, 1],
  [150, 15, 40, 22, 14, 1],
  [190, 10, 45, 16, 22, 1],
  [230, 20, 35, 24, 8, 0],
  [270, 10, 30, 15, 12, 1],
  [310, 8, 25, 10, 12, 1],
  [350, 5, 20, 6, 10, 1],
];

const rich = (s) =>
  s.split("**").map((t, i) => (i % 2 ? <strong key={i}>{t}</strong> : t));
const rnd = (a, b) => a + Math.random() * (b - a);
const reduced = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// slowly "ticking" numbers
const useTick = (base, spread, dec = 2, ms = 1600) => {
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

const Forex = () => {
  const rootRef = useRef(null);
  useMotion(rootRef);
  const { fmt } = useCurrency();
  const [yearly, setYearly] = useState(false);
  const [open, setOpen] = useState([]);
  const [candles, setCandles] = useState(baseCandles);
  const [restarting, setRestarting] = useState([false, false]);
  const [lat, setLat] = useState(brokers.map((b) => b[4]));
  const tps = useTick(12410, 600, 0, 1200);
  const ping = useTick(0.42, 0.03);
  const cpu = useTick(18.4, 2.5, 1);

  // live candle + broker latency
  useEffect(() => {
    if (reduced()) return;
    const t = setInterval(() => {
      setCandles((cs) => {
        const last = cs[cs.length - 1];
        const y = Math.round(rnd(3, 12));
        const h = Math.round(rnd(6, 16));
        return [
          ...cs.slice(0, -1),
          [
            last[0],
            Math.max(2, y - 3),
            y + h + 4,
            y,
            h,
            Math.random() > 0.3 ? 1 : 0,
          ],
        ];
      });
      setLat(
        brokers.map((b) => +(b[4] + (Math.random() - 0.5) * 0.06).toFixed(2)),
      );
    }, 1400);
    return () => clearInterval(t);
  }, []);

  const restart = (i) => {
    setRestarting((r) => r.map((x, k) => (k === i ? true : x)));
    setTimeout(
      () => setRestarting((r) => r.map((x, k) => (k === i ? false : x))),
      2200,
    );
  };
  const toggleFaq = (i) =>
    setOpen((o) => (o.includes(i) ? o.filter((x) => x !== i) : [...o, i]));
  const seg =
    "px-5 py-2 rounded-lg font-label-md text-label-md font-semibold transition-all";

  return (
    <Layout>
      <div ref={rootRef} className="flex flex-col w-full">
        {/* 1 HERO */}
        <section className="relative w-full overflow-hidden bg-surface py-space-lg lg:py-16">
          <div className="pointer-events-none absolute -top-40 right-0 h-96 w-96 rounded-full bg-primary-container/10 blur-3xl" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,rgba(11,175,96,0.18)_1px,transparent_1px)] bg-[size:28px_28px] [mask-image:radial-gradient(ellipse_at_top_left,black_20%,transparent_70%)]" />
          <div className="relative max-w-7xl mx-auto px-margin-mobile lg:px-margin">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-lg items-center">
              <div className="lg:col-span-7 flex flex-col items-start space-y-6">
                <div className="inline-flex items-center gap-space-xs px-3 py-1.5 rounded-full bg-surface-container border border-outline-variant shadow-sm">
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-container opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                  </span>
                  <span className="font-label-sm text-label-sm text-on-surface tracking-wide uppercase">
                    ⚡ Equinix NY4 & LD4 Cross-Connects • 100% Trading Uptime
                    SLA
                  </span>
                </div>
                <h1 className="font-display-lg text-display-lg text-on-surface font-extrabold tracking-tight leading-tight">
                  Institutional-Grade Forex VPS:
                  <span className="block mt-1 bg-gradient-to-r from-primary-container via-secondary to-primary-container bg-[length:200%_auto] bg-clip-text text-transparent animate-[shimmer_4s_linear_infinite]">
                    Sub-Millisecond Execution
                  </span>
                  for Serious Traders
                </h1>
                <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl leading-relaxed">
                  Purpose-built Windows & Linux trading infrastructure optimized
                  for MetaTrader 4, MetaTrader 5, cTrader, and algorithmic
                  trading bots with direct fiber cross-connects to global
                  liquidity hubs.
                </p>
                <div className="flex flex-wrap items-center gap-space-md pt-2">
                  <a
                    href="#pricing"
                    className="group relative overflow-hidden inline-flex items-center justify-center gap-space-xs bg-gradient-to-r from-primary-container to-secondary text-on-primary font-label-lg text-label-lg px-6 py-3.5 rounded-xl transition-all shadow-md shadow-primary-container/30 hover:shadow-lg hover:-translate-y-0.5 before:absolute before:inset-y-0 before:-left-full before:w-1/2 before:skew-x-[-20deg] before:bg-white/30 hover:before:left-[150%] before:transition-all before:duration-700"
                  >
                    <span className="h-2 w-2 rounded-full bg-surface-container-lowest animate-pulse" />
                    Deploy Forex VPS Now
                    <I
                      n="arrow_forward"
                      c="text-[18px] transition-transform group-hover:translate-x-1"
                    />
                  </a>
                  <a
                    href="#latency-matrix"
                    className="inline-flex items-center justify-center gap-space-xs bg-surface-container-lowest hover:bg-secondary-container/20 hover:border-primary-container/50 text-on-surface font-label-lg text-label-lg px-6 py-3.5 rounded-xl border border-outline-variant transition-all shadow-sm"
                  >
                    <I n="speed" c="text-primary text-[18px]" />
                    View Broker Latency Test
                  </a>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-gutter-sm pt-4 w-full border-t border-outline-variant">
                  {proof.map(([v, l, g]) => (
                    <div key={l} className="flex flex-col">
                      <span
                        className={`font-headline-sm text-headline-sm font-bold ${g ? "text-primary" : "text-on-surface"}`}
                      >
                        {v}
                      </span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">
                        {l}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* terminal */}
              <div className="lg:col-span-5 w-full">
                <div className="bg-inverse-surface rounded-xl p-5 shadow-2xl shadow-primary/15 border border-outline/30 text-inverse-on-surface relative overflow-hidden animate-float">
                  <div className="flex items-center justify-between gap-2 pb-4 border-b border-outline/40">
                    <div className="flex items-center space-x-2 min-w-0">
                      <span className="w-3 h-3 rounded-full bg-error shrink-0" />
                      <span className="w-3 h-3 rounded-full bg-tertiary-fixed-dim shrink-0" />
                      <span className="w-3 h-3 rounded-full bg-primary-container shrink-0" />
                      <span className="font-mono-code text-mono-code font-semibold tracking-wider ml-2 text-surface-bright truncate">
                        PRIMO-TRADER-LD4-ALPHA
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-primary/20 text-inverse-primary border border-primary/40 font-mono-code text-label-sm shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-container animate-ping" />
                      LIVE EXECUTION
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-surface-variant font-mono-code text-body-sm bg-surface-container-highest/10 px-3 py-1.5 rounded">
                    <span className="flex items-center gap-1.5">
                      <I n="hub" c="text-[14px] text-inverse-primary" />
                      Equinix LD4 (London) 10G Peering
                    </span>
                    <span className="text-inverse-primary font-bold">
                      {ping.toFixed(2)} ms
                    </span>
                  </div>
                  <div className="mt-4 p-3 bg-surface-container-highest/20 rounded-lg">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="font-mono-code text-mono-code text-surface-bright font-bold">
                        EUR/USD M1 • Real-Time Direct Feed
                      </span>
                      <span className="font-mono-code text-label-sm text-inverse-primary bg-secondary/30 px-1.5 py-0.5 rounded whitespace-nowrap">
                        Spread: 0.0 Pip
                      </span>
                    </div>
                    <div className="w-full h-28 relative">
                      <svg
                        className="w-full h-full"
                        preserveAspectRatio="none"
                        viewBox="0 0 400 100"
                      >
                        {[25, 50, 75].map((y) => (
                          <line
                            key={y}
                            x1="0"
                            x2="400"
                            y1={y}
                            y2={y}
                            stroke="#6d7b6e"
                            strokeDasharray="3,3"
                            strokeOpacity="0.2"
                          />
                        ))}
                        {candles.map(([x, t, b, y, h, up], i) => {
                          const live = i === candles.length - 1;
                          const col = live
                            ? "#56df8a"
                            : up
                              ? "#0baf60"
                              : "#ba1a1a";
                          return (
                            <g key={x} style={{ transition: "all .5s ease" }}>
                              <line
                                x1={x}
                                x2={x}
                                y1={t}
                                y2={b}
                                stroke={col}
                                strokeWidth={live ? 2 : 1.5}
                                style={{ transition: "all .5s ease" }}
                              />
                              <rect
                                x={x - 5}
                                y={y}
                                width="10"
                                height={h}
                                rx="1"
                                fill={col}
                                style={{ transition: "all .5s ease" }}
                              />
                            </g>
                          );
                        })}
                        <path
                          d="M 0,80 Q 100,55 200,30 T 350,11"
                          fill="none"
                          stroke="#56df8a"
                          strokeDasharray="4,2"
                          strokeWidth="2"
                        />
                      </svg>
                      <div className="absolute bottom-1 right-2 flex items-center gap-1 font-mono-code text-label-sm text-surface-variant">
                        <span>Tick Engine:</span>
                        <span className="text-inverse-primary font-bold">
                          {tps.toLocaleString()} tps
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-2 text-body-sm font-mono-code">
                    {[
                      ["Active Bot Fleet", "4x MT5 + 1x cTrader", "w-3/4"],
                      ["RAM / NVMe Usage", "3.4 GB / 8.0 GB DDR5", "w-2/5"],
                    ].map(([l, v, w]) => (
                      <div
                        key={l}
                        className="bg-surface-container-highest/20 p-2.5 rounded flex flex-col justify-between"
                      >
                        <span className="text-surface-variant text-label-sm">
                          {l}
                        </span>
                        <span className="text-surface-bright font-bold mt-1">
                          {v}
                        </span>
                        <div className="w-full bg-outline/30 h-1.5 rounded-full mt-2 overflow-hidden">
                          <div className={`bg-primary-container h-full ${w}`} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-3 border-t border-outline/30 flex flex-wrap items-center justify-between text-label-sm font-mono-code gap-2">
                    {[
                      ["IC Markets", "0.38ms"],
                      ["Pepperstone", "0.45ms"],
                      ["FTMO", "0.72ms"],
                      ["Packet Loss", "0.000%"],
                    ].map(([k, v]) => (
                      <div key={k} className="flex items-center gap-1">
                        <span className="text-surface-variant">{k}:</span>
                        <span className="text-inverse-primary">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2 PILLARS */}
        <Sec bg="bg-surface-container-low">
          <Head
            pill="Engineered for Automated Execution"
            title="Architecture Optimized for 24/7 Algorithmic Trading"
            sub="Every microsecond lost between your trade calculation and the liquidity provider reduces your algorithmic alpha. PRIMO CLOUD eliminates processing bottlenecks at the hardware, hypervisor, and network cross-connect layers."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
            {pillars.map(([n, t, d, f]) => (
              <div
                key={t}
                className={`p-6 flex flex-col justify-between ${cardHover}`}
              >
                <div>
                  <IconBox n={n} mb="mb-5" />
                  <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                    {t}
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-3 leading-relaxed">
                    {d}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-outline-variant/60 flex items-center text-primary font-label-sm text-label-sm font-bold">
                  <span>{f}</span>
                  <I n="check_circle" c="text-[14px] ml-1" />
                </div>
              </div>
            ))}
          </div>
        </Sec>

        {/* 3 PRICING */}
        <Sec id="pricing">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-12">
            <Pill>Transparent Low-Latency Plans</Pill>
            <h2 className="font-headline-xl text-headline-xl text-on-surface font-extrabold mt-space-sm">
              High-Performance Forex VPS Pricing
            </h2>
            <div className="mx-auto mt-space-sm h-1 w-16 rounded-full bg-gradient-to-r from-primary-container to-secondary" />
            <p className="font-body-md text-body-md text-on-surface-variant mt-3">
              Deploy your trading rig in under 45 seconds with pre-activated
              Windows Server Trading Edition and instant MT4/MT5 provisioning.
            </p>
            <div className="mt-8 inline-flex items-center p-1 rounded-xl bg-surface-container border border-outline-variant">
              <button
                type="button"
                onClick={() => setYearly(false)}
                className={`${seg} ${!yearly ? "bg-surface-container-lowest text-on-surface shadow-sm" : "text-on-surface-variant hover:text-on-surface"}`}
              >
                Monthly Billing
              </button>
              <button
                type="button"
                onClick={() => setYearly(true)}
                className={`${seg} flex items-center gap-1.5 ${yearly ? "bg-surface-container-lowest text-on-surface shadow-sm" : "text-on-surface-variant hover:text-on-surface"}`}
              >
                Annual Billing
                <span className="px-2 py-0.5 rounded-full text-label-sm bg-primary-container text-on-primary">
                  Save 20%
                </span>
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter items-stretch">
            {plans.map((p) => (
              <div
                key={p.n}
                className={`rounded-xl p-6 flex flex-col justify-between relative ${p.feat ? "bg-gradient-to-b from-secondary-container/20 to-surface-container-lowest border-2 border-primary shadow-2xl shadow-primary-container/25 lg:-translate-y-2" : "bg-surface-container-lowest border border-outline-variant hover:border-primary hover:shadow-xl transition-all duration-300"}`}
              >
                {p.feat && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-on-primary rounded-full font-label-sm text-label-sm font-bold uppercase tracking-wider shadow whitespace-nowrap">
                    ★ Most Popular Choice
                  </div>
                )}
                <div>
                  <div
                    className={`flex justify-between items-center gap-2 mb-4 ${p.feat ? "mt-2" : ""}`}
                  >
                    <span
                      className={`font-label-lg text-label-lg font-bold ${p.feat ? "text-primary" : "text-on-surface"}`}
                    >
                      {p.n}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded font-label-sm text-label-sm whitespace-nowrap ${p.feat ? "bg-secondary-container/50 text-secondary font-semibold" : "bg-surface-container text-on-surface-variant"}`}
                    >
                      {p.tag}
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-6">
                    {p.d}
                  </p>
                  <div className="mb-6">
                    <span className="font-display-lg text-display-lg font-extrabold text-on-surface">
                      {fmt(p.p[yearly ? 1 : 0])}
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      {" "}
                      / month
                    </span>
                  </div>
                  <ul className="space-y-3 font-body-sm text-body-sm text-on-surface pb-6 border-b border-outline-variant">
                    {p.s.map((x) => (
                      <li key={x} className="flex items-center gap-2">
                        <I
                          n={p.feat ? "check_circle" : "check"}
                          c="text-primary text-[16px] shrink-0"
                        />
                        <span>{rich(x)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="pt-6">
                  <a
                    href={/^Contact/.test(p.cta ?? "") ? "/contact" : orderUrl(p.slug, yearly)}
                    className={`block text-center w-full px-4 rounded-xl font-label-md text-label-md transition-all ${p.feat ? "py-3 bg-gradient-to-r from-primary-container to-secondary text-on-primary font-bold shadow-md shadow-primary-container/30 hover:-translate-y-0.5" : "py-2.5 border border-outline font-semibold text-on-surface hover:border-primary hover:bg-secondary-container/20"}`}
                  >
                    {p.cta}
                  </a>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12 py-4 px-6 rounded-xl bg-surface-container border border-outline-variant flex flex-wrap items-center justify-around gap-4 text-center">
            {planTrust.map(([n, t]) => (
              <div
                key={t}
                className="flex items-center gap-2 font-label-md text-label-md text-on-surface"
              >
                <I n={n} c="text-primary text-[18px]" />
                {t}
              </div>
            ))}
          </div>
        </Sec>

        {/* 4 LATENCY MATRIX */}
        <Sec bg="bg-surface-container-low" id="latency-matrix">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <Pill>Zero Routing Detours</Pill>
              <h2 className="font-headline-xl text-headline-xl text-on-surface font-extrabold mt-space-sm">
                Sub-Millisecond Direct Broker Cross-Connects
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant mt-2 max-w-2xl">
                Live ping latencies measured directly from PRIMO CLOUD LD4 & NY4
                financial hypervisors to institutional broker matching engines.
              </p>
            </div>
            <div className="flex items-center gap-2 bg-surface-container-lowest px-4 py-2 rounded-lg border border-outline-variant shrink-0">
              <span className="w-2.5 h-2.5 rounded-full bg-primary-container animate-pulse" />
              <span className="font-mono-code text-label-sm text-on-surface">
                Updated: Continuous Tick (Equinix Peering)
              </span>
            </div>
          </div>
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[820px] text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container/60 border-b border-outline-variant text-on-surface font-label-md text-label-md">
                    {[
                      "Broker / Liquidity Entity",
                      "Primary Datacenter",
                      "Cross-Connect Type",
                      "Live Execution Ping",
                    ].map((h) => (
                      <th key={h} className="py-4 px-6">
                        {h}
                      </th>
                    ))}
                    <th className="py-4 px-6 text-right">Performance Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant font-body-sm text-body-sm text-on-surface">
                  {brokers.map(([ab, name, dc, cc, , status], i) => (
                    <tr
                      key={ab}
                      className="hover:bg-secondary-container/10 transition-colors"
                    >
                      <td className="py-4 px-6 font-semibold">
                        <span className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded bg-secondary-container/40 flex items-center justify-center font-bold text-primary font-mono-code">
                            {ab}
                          </span>
                          {name}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-on-surface-variant font-mono-code">
                        {dc}
                      </td>
                      <td className="py-4 px-6 text-on-surface-variant">
                        {cc}
                      </td>
                      <td className="py-4 px-6">
                        <span className="flex items-center gap-2 font-mono-code font-bold text-primary">
                          <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse" />
                          {lat[i].toFixed(2)} ms
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <span className="inline-block px-2.5 py-1 rounded bg-secondary-container/50 text-secondary font-label-sm text-label-sm font-semibold">
                          {status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Sec>

        {/* 5 WHY */}
        <Sec>
          <Head
            pill="Unfair Algorithmic Edge"
            title="Engineered to Protect Your Capital & Maximize Alpha"
            sub="Standard cloud providers run on noisy multi-tenant virtualization. PRIMO Forex VPS gives your bots clean hardware resources and specialized trading watchdogs."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
            {why.map(([n, t, d]) => (
              <div key={t} className={`p-6 ${cardHover}`}>
                <IconBox
                  n={n}
                  size="w-10 h-10 rounded-lg"
                  fs="text-[24px]"
                  mb="mb-4"
                />
                <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                  {t}
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-2 leading-relaxed">
                  {d}
                </p>
              </div>
            ))}
          </div>
        </Sec>

        {/* 6 PLATFORMS */}
        <Sec bg="bg-surface-container-low">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <Pill>Compatible with Your Stack</Pill>
            <h2 className="font-headline-lg text-headline-lg text-on-surface font-extrabold mt-space-sm">
              Supports Every Major Trading Platform & OS
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-gutter-sm">
            {platforms.map(([a, t]) => (
              <div
                key={t}
                className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant flex flex-col items-center text-center justify-center transition-all hover:border-primary hover:-translate-y-1 hover:shadow-lg"
              >
                {a ? (
                  <span className="font-mono-code text-headline-sm font-bold text-primary">
                    {a}
                  </span>
                ) : (
                  <I n="webhook" c="text-primary text-[24px]" />
                )}
                <span className="font-label-md text-label-md text-on-surface mt-1">
                  {t}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-on-surface-variant font-body-sm text-body-sm">
            <span className="font-semibold text-on-surface">
              Available Operating Systems:
            </span>
            {osList.map((o) => (
              <span
                key={o}
                className="px-3 py-1 bg-surface-container-lowest rounded-lg border border-outline-variant"
              >
                {o}
              </span>
            ))}
          </div>
        </Sec>

        {/* 7 COMPARISON */}
        <Sec>
          <Head
            pill="Execution Comparison"
            title="Why Standard Hosting Fails for Forex Bots"
            sub="Compare PRIMO CLOUD's purpose-built financial nodes directly against residential laptops and generic public clouds."
          />
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[820px] text-left border-collapse">
                <thead>
                  <tr className="border-b border-outline-variant font-label-md text-label-md">
                    <th className="py-4 px-6 text-on-surface bg-surface-container/60">
                      Architectural Benchmark
                    </th>
                    <th className="py-4 px-6 font-bold bg-gradient-to-r from-primary-container to-secondary text-on-primary">
                      PRIMO CLOUD Forex VPS
                    </th>
                    <th className="py-4 px-6 text-on-surface bg-surface-container/60">
                      Home PC / Laptop
                    </th>
                    <th className="py-4 px-6 text-on-surface bg-surface-container/60">
                      Generic Cloud (AWS / DigitalOcean)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant font-body-sm text-body-sm text-on-surface">
                  {compare.map(([a, b, c, d]) => (
                    <tr
                      key={a}
                      className="hover:bg-secondary-container/10 transition-colors"
                    >
                      <td className="py-4 px-6 font-semibold">{a}</td>
                      <td className="py-4 px-6 font-bold text-primary bg-primary/5">
                        <span className="flex items-center gap-2">
                          <I
                            n="check_circle"
                            c="text-[16px] text-primary-container shrink-0"
                          />
                          {b}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-on-surface-variant">{c}</td>
                      <td className="py-4 px-6 text-on-surface-variant">{d}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Sec>

        {/* 8 CONSOLE */}
        <Sec bg="bg-surface-container-low">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-lg items-center">
            <div className="lg:col-span-5 space-y-6">
              <Pill c="w-fit">Intuitive Control Panel</Pill>
              <h2 className="font-headline-xl text-headline-xl text-on-surface font-extrabold">
                Purpose-Built Trading Server Management Portal
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                Monitor terminal load, latency spikes, and bot health in
                real-time. Instantly reboot individual MT4/MT5 services, trigger
                one-click snapshots before EA updates, or launch our
                zero-latency HTML5 Web RDP directly inside your browser.
              </p>
              <div className="space-y-3 pt-2">
                {consolePoints.map((t) => (
                  <div key={t} className="flex items-center gap-3">
                    <I n="check_circle" c="text-primary" />
                    <span className="font-body-md text-body-md text-on-surface">
                      {t}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:col-span-7">
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-2xl overflow-hidden">
                <div className="bg-surface-container p-4 border-b border-outline-variant flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="w-3 h-3 rounded-full bg-primary-container animate-pulse" />
                    <span className="font-headline-sm text-headline-sm font-bold text-on-surface">
                      Node: LD4-PRO-FX-09
                    </span>
                    <span className="px-2 py-0.5 rounded bg-surface-container-lowest text-on-surface-variant font-mono-code text-label-sm border border-outline-variant">
                      185.122.94.14
                    </span>
                  </div>
                  <button className="px-3 py-1.5 bg-primary-container hover:bg-secondary text-on-primary rounded font-label-sm text-label-sm font-bold flex items-center gap-1 transition-colors">
                    <I n="open_in_new" c="text-[14px]" /> Launch Web RDP
                  </button>
                </div>
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      [
                        "Broker Socket Ping",
                        `${ping.toFixed(2)} ms`,
                        "Jitter: ±0.01ms",
                        "text-primary",
                      ],
                      [
                        "CPU Load (3.7GHz)",
                        `${cpu}%`,
                        "Optimal Execution",
                        "text-on-surface",
                      ],
                      [
                        "RAM Utilization",
                        "2.8 / 8 GB",
                        "DDR5 ECC Cleared",
                        "text-on-surface",
                      ],
                    ].map(([l, v, s, c], i) => (
                      <div
                        key={l}
                        className="p-3 bg-surface-container-low rounded-lg border border-outline-variant"
                      >
                        <span className="text-on-surface-variant font-body-sm text-body-sm">
                          {l}
                        </span>
                        <div
                          className={`font-headline-sm text-headline-sm font-bold mt-1 font-mono-code ${c}`}
                        >
                          {v}
                        </div>
                        <span
                          className={`text-[11px] ${i === 1 ? "text-primary" : "text-on-surface-variant"}`}
                        >
                          {s}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div>
                    <span className="font-label-md text-label-md font-bold text-on-surface block mb-3">
                      Managed Trading Processes
                    </span>
                    <div className="border border-outline-variant rounded-lg overflow-hidden font-body-sm text-body-sm overflow-x-auto">
                      <div className="grid grid-cols-[1.3fr_1.6fr_.8fr_.6fr] gap-2 min-w-[520px] items-center p-3 bg-surface-container/40 border-b border-outline-variant font-semibold">
                        <span>Process</span>
                        <span>Account / Strategy</span>
                        <span>Status</span>
                        <span>Action</span>
                      </div>
                      {procs.map(([p, s], i) => (
                        <div
                          key={p}
                          className={`grid grid-cols-[1.3fr_1.6fr_.8fr_.6fr] gap-2 min-w-[520px] items-center p-3 hover:bg-secondary-container/10 ${i === 0 ? "border-b border-outline-variant" : ""}`}
                        >
                          <span className="font-mono-code font-bold text-on-surface">
                            {p}
                          </span>
                          <span className="text-on-surface-variant">{s}</span>
                          <span
                            className={`flex items-center gap-1 font-bold ${restarting[i] ? "text-on-surface-variant" : "text-primary"}`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${restarting[i] ? "bg-tertiary-fixed-dim animate-ping" : "bg-primary-container"}`}
                            />
                            {restarting[i] ? "Restarting…" : "Running"}
                          </span>
                          <button
                            type="button"
                            disabled={restarting[i]}
                            onClick={() => restart(i)}
                            className="text-left text-on-surface-variant hover:text-error disabled:opacity-40 text-label-sm"
                          >
                            Restart
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Sec>

        {/* 9 TESTIMONIALS */}
        <Sec>
          <Head
            pill="Trusted by Systematic Traders"
            title="Backed by High-Frequency Algorithmic Traders"
            sub="Read how quant funds and retail prop firm traders leverage our sub-millisecond Equinix infrastructure."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            {reviews.map(([i, n, r, t]) => (
              <div
                key={n}
                className="p-6 rounded-xl bg-surface-container-lowest border border-outline-variant relative flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 hover:border-primary-container/40 transition-all duration-300"
              >
                <div>
                  <div className="flex text-primary mb-4">
                    {[...Array(5)].map((_, k) => (
                      <I key={k} n="star" c="text-[18px]" />
                    ))}
                  </div>
                  <I
                    n="format_quote"
                    c="absolute top-4 right-5 text-[56px] text-primary-container/15"
                  />
                  <p className="relative font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    {t}
                  </p>
                </div>
                <div className="pt-6 border-t border-outline-variant mt-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-container to-secondary flex items-center justify-center font-bold text-on-primary font-headline-sm">
                    {i}
                  </div>
                  <div>
                    <span className="flex items-center gap-1 font-label-lg text-label-lg font-bold text-on-surface">
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

        {/* 10 FAQ */}
        <Sec bg="bg-surface-container-low">
          <Head
            pill="Trading Infrastructure FAQ"
            title="Frequently Asked Questions"
            sub="Everything you need to know about setting up, executing, and scaling your Forex trading bots on PRIMO CLOUD."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter items-start">
            {[faqs.slice(0, 5), faqs.slice(5)].map((col, c) => (
              <div key={c} className="space-y-4">
                {col.map(([q, a], j) => {
                  const i = c * 5 + j;
                  const isOpen = open.includes(i);
                  return (
                    <div
                      key={q}
                      className={`bg-surface-container-lowest rounded-xl border p-5 transition-all duration-300 ${isOpen ? "border-primary-container shadow-md shadow-primary-container/10" : "border-outline-variant"}`}
                    >
                      <button
                        type="button"
                        onClick={() => toggleFaq(i)}
                        className="w-full text-left flex justify-between items-center gap-4 font-headline-sm text-headline-sm font-bold text-on-surface"
                      >
                        <span>
                          {i + 1}. {q}
                        </span>
                        <I
                          n="expand_more"
                          c={`text-primary shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                        />
                      </button>
                      <div
                        className={`grid transition-all duration-300 ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
                      >
                        <div className="overflow-hidden">
                          <div className="mt-3 font-body-sm text-body-sm text-on-surface-variant leading-relaxed border-t border-outline-variant/50 pt-3">
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
        <section className="w-full py-space-xl bg-surface">
          <div className="max-w-7xl mx-auto px-margin-mobile lg:px-margin">
            <div className="relative rounded-2xl bg-gradient-to-br from-primary via-secondary to-primary-container bg-[length:200%_200%] animate-[shimmer_10s_linear_infinite] p-8 md:p-14 text-on-primary overflow-hidden shadow-2xl shadow-primary/20">
              <div className="absolute inset-0 opacity-10 pointer-events-none">
                <svg
                  className="w-full h-full"
                  preserveAspectRatio="none"
                  viewBox="0 0 800 400"
                >
                  <path
                    d="M 0,100 L 200,100 L 250,150 L 500,150 L 550,200 L 800,200"
                    fill="none"
                    stroke="#FFFFFF"
                    strokeWidth="2"
                  />
                  <path
                    d="M 0,300 L 300,300 L 350,250 L 600,250 L 650,200 L 800,200"
                    fill="none"
                    stroke="#FFFFFF"
                    strokeWidth="2"
                  />
                  <circle cx="200" cy="100" fill="#FFFFFF" r="4" />
                  <circle cx="500" cy="150" fill="#FFFFFF" r="4" />
                  <circle cx="300" cy="300" fill="#FFFFFF" r="4" />
                </svg>
              </div>
              <span className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10 animate-float" />
              <div className="relative z-10 max-w-3xl flex flex-col items-start space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-lowest/20 backdrop-blur-md text-surface-bright font-mono-code text-label-sm">
                  <span className="w-2 h-2 rounded-full bg-surface-bright animate-ping" />
                  INSTANT 45-SECOND AUTOMATED PROVISIONING
                </div>
                <h2 className="font-display-lg text-display-lg font-extrabold tracking-tight leading-tight">
                  Ready to Eliminate Slippage & Trade with Microsecond Speed?
                </h2>
                <p className="font-body-lg text-body-lg text-surface-bright/90 max-w-2xl leading-relaxed">
                  Deploy your institutional Forex VPS today. Backed by
                  guaranteed 100% trading uptime SLA, zero-latency risk, and our
                  unconditional 30-day money-back guarantee.
                </p>
                <div className="flex flex-wrap items-center gap-space-md pt-2">
                  <a
                    href="#pricing"
                    className="inline-flex items-center justify-center gap-space-xs bg-surface-container-lowest hover:bg-surface-container-low text-primary font-label-lg text-label-lg px-8 py-4 rounded-xl transition-all shadow-lg font-bold hover:-translate-y-0.5"
                  >
                    Deploy Forex VPS Now
                    <I n="arrow_forward" c="text-[18px]" />
                  </a>
                  <a
                    href="/contact"
                    className="inline-flex items-center justify-center gap-space-xs bg-surface-container-lowest/10 hover:bg-surface-container-lowest/20 text-on-primary font-label-lg text-label-lg px-6 py-4 rounded-xl border border-surface-container-lowest/30 transition-colors"
                  >
                    <I n="headset_mic" c="text-[18px]" />
                    Speak to Infrastructure Specialist
                  </a>
                </div>
                <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-surface-container-lowest/20 text-surface-bright font-label-sm text-label-sm w-full">
                  {[
                    ["verified", "30-Day Money-Back Guarantee"],
                    ["speed", "Zero Latency Risk"],
                    ["support", "24/7/365 Live Quant Support"],
                  ].map(([n, t]) => (
                    <span key={t} className="flex items-center gap-1.5">
                      <I n={n} c="text-[16px]" />
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

export default Forex;
