import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";
import { useCurrency } from "../context/CurrencyContext";

// Icon helper. Reads text-[Npx] from the class and applies it inline, because the Google
// Material Symbols stylesheet forces 24px and would otherwise override Tailwind's size class.
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

const offers = [
  ["redeem", "Save 20% on every yearly plan"],
  ["move_to_inbox", "Free zero-downtime migration with every plan"],
  ["verified_user", "30-day money-back guarantee, no questions asked"],
];

// Edit this array to add/remove menus. Items with `children` become mega dropdowns.
// `feature` = highlighted card on the left of the dropdown (`price` is USD and follows the currency switch).
const menu = [
  { label: "Home", icon: "home", href: "/" },
  {
    label: "Hosting",
    icon: "cloud",
    feature: {
      icon: "rocket_launch",
      title: "Launch your site fast",
      text: "Free migration and SSL on every hosting plan.",
      chips: ["Free SSL", "Daily backups"],
      href: "/hosting/shared-hosting",
    },
    children: [
      {
        label: "Shared Hosting",
        desc: "Affordable hosting for websites",
        icon: "cloud",
        href: "/hosting/shared-hosting",
      },
      {
        label: "Reseller Hosting",
        desc: "Start your own hosting business",
        icon: "storefront",
        href: "/hosting/reseller-hosting",
      },
       {
    label: "WordPress Hosting",
    desc: "Fast, secure hosting optimized for WordPress",
    icon: "language",
    href: "/hosting/wordpress-hosting",
    badge: "Popular",
  },
    ],
  },
  {
    label: "VPS",
    icon: "dns",
    feature: {
      icon: "stars",
      title: "Business VPS",
      text: "Our most popular plan for production workloads.",
      chips: ["2 vCPU", "4 GB RAM", "80 GB NVMe"],
      price: 14.99,
      href: "#vps-plans",
    },
    children: [
      {
        label: "Windows VPS",
        desc: "Licensed Windows Server with RDP",
        icon: "desktop_windows",
        href: "/vps/windows-vps",
      },
      {
        label: "Linux VPS",
        desc: "Full root access, KVM virtualization",
        icon: "terminal",
        href: "/vps/linux-vps",
      },
      {
        label: "Forex VPS",
        desc: "Low-latency servers for MT4/MT5",
        icon: "candlestick_chart",
        href: "/vps/forex-vps",
        badge: "Hot",
      },
      {
        label: "n8n VPS",
        desc: "Automation workflows, always on",
        icon: "account_tree",
        href: "/vps/n8n-vps",
        badge: "New",
      },
      {
        label: "Gold VPS",
        desc: "Optimized for gold trading bots",
        icon: "workspace_premium",
        href: "/vps/gold-vps",
        badge: "New",
      },
    ],
  },
  {
    label: "Servers",
    icon: "storage",
    feature: {
      icon: "bolt",
      title: "Bare-metal power",
      text: "Dedicated hardware with 10 Gbps ports and Anti-DDoS.",
      chips: ["No sharing", "10 Gbps"],
      href: "/server/dedicated-servers",
    },
    children: [
      {
        label: "Dedicated Server",
        desc: "Bare-metal power, no sharing",
        icon: "dns",
        href: "/server/dedicated-servers",
      },
      {
        label: "GPU Server",
        desc: "AI, rendering and compute",
        icon: "memory",
        href: "/server/gpu-servers",
        badge: "New",
      },
      {
        label: "Colocation",
        desc: "Secure rack space for your own servers",
        icon: "corporate_fare",
        href: "/server/colocation",
      },
    ],
  },
  {
    label: "Cloud Solutions",
    icon: "cloud_sync",
    badge: "New",
    feature: {
      icon: "devices",
      title: "Work from anywhere",
      text: "Tally and business apps on secure cloud desktops.",
      chips: ["24/7 access", "Auto backups"],
      href: "/cloud-solution/tally-on-cloud",
    },
    children: [
      {
        label: "Tally on Cloud",
        desc: "Access Tally from anywhere",
        icon: "receipt_long",
        href: "/cloud-solution/tally-on-cloud",
        badge: "Popular",
      },
      {
        label: "Business Cloud",
        desc: "Cloud desktops for teams",
        icon: "business_center",
        href: "/business-cloud",
      },
      // {
      //   label: "Cloud Hosting",
      //   desc: "Scalable hosting on cloud infrastructure",
      //   icon: "cloud_queue",
      //   href: "/cloud-hosting",
      // },
      // {
      //   label: "Storage Solutions",
      //   desc: "Backup and archive storage",
      //   icon: "hard_drive",
      //   href: "/storage-solutions",
      // },
      // {
      //   label: "Managed Kubernetes",
      //   desc: "Container clusters we help you run",
      //   icon: "deployed_code",
      //   href: "/managed-kubernetes",
      // },
    ],
  },
  // { label: "Pricing", icon: "sell", href: "#vps-plans" },
];

const allItems = menu.flatMap((m) =>
  m.children ? m.children.map((c) => ({ ...c, group: m.label })) : [],
);

const badgeCls = {
  Hot: "bg-error/10 text-error",
  New: "bg-primary-container/15 text-primary",
  Popular: "bg-tertiary-fixed-dim/30 text-secondary",
};

const Badge = ({ t }) => (
  <span
    className={`ml-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide ${badgeCls[t]}`}
  >
    {t}
  </span>
);

const Topbar = () => {
  const { currency, setCurrency, rate, live, fmt } = useCurrency();
  const { pathname: path } = useLocation();

  const [mobile, setMobile] = useState(false);
  const [active, setActive] = useState(null);
  const [mobSub, setMobSub] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [offer, setOffer] = useState(0);
  const [q, setQ] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  const ref = useRef(null);
  const searchRef = useRef(null);

  const isActive = (m) =>
    m.href === path || m.children?.some((c) => c.href === path);

  const results = q.trim()
    ? allItems.filter((i) =>
        (i.label + i.desc + i.group).toLowerCase().includes(q.toLowerCase()),
      )
    : allItems.slice(0, 5);

  useEffect(() => {
    const onDown = (e) => {
      // composedPath also sees through a shadow root (the panel embeds this header in one)
      if (ref.current && !e.composedPath().includes(ref.current)) {
        setActive(null);
        setSearchOpen(false);
      }
    };

    const onKey = (e) => {
      if (e.key === "Escape") {
        setActive(null);
        setMobile(false);
        setSearchOpen(false);
        searchRef.current?.blur();
      }

      if (
        (e.key === "/" &&
          !/input|textarea/i.test(e.composedPath()[0]?.tagName ?? "")) ||
        ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k")
      ) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };

    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => {
    let raf;

    const onScroll = () => {
      cancelAnimationFrame(raf);

      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        const max = document.documentElement.scrollHeight - window.innerHeight;

        setScrolled(y > 8);
        setProgress(max > 0 ? (y / max) * 100 : 0);
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    const t = setInterval(() => setOffer((o) => (o + 1) % offers.length), 4000);

    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobile ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobile]);

  const CurrencySwitch = ({ small }) => (
    <div
      className="relative inline-flex p-1 bg-surface-container rounded-xl border border-outline-variant"
      title={`1 USD = ${rate.toFixed(2)} INR${live ? " (live rate)" : ""}`}
    >
      <span
        className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-lg bg-gradient-to-r from-primary-container to-secondary shadow-sm transition-transform duration-300 ease-out ${
          currency === "INR" ? "translate-x-full" : "translate-x-0"
        }`}
      />

      {[
        ["USD", "$ USD"],
        ["INR", "₹ INR"],
      ].map(([c, t]) => (
        <button
          key={c}
          type="button"
          onClick={() => setCurrency(c)}
          aria-pressed={currency === c}
          className={`relative z-10 ${
            small ? "w-20" : "w-[4.25rem]"
          } py-1 text-center rounded-lg text-label-md font-label-md transition-colors duration-200 ${
            currency === c
              ? "text-on-primary"
              : "text-on-surface-variant hover:text-on-surface"
          }`}
        >
          {t}
        </button>
      ))}
    </div>
  );

  const pill = (on) =>
    `relative inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-label-md text-label-md transition-all duration-200 ${
      on
        ? "bg-secondary-container/50 text-primary shadow-sm"
        : "text-on-surface-variant hover:text-primary hover:bg-secondary-container/30"
    }`;

  return (
    <>
      <header
        ref={ref}
        className={`pc-glass-bar fixed top-0 left-0 right-0 z-50 backdrop-blur-2xl backdrop-saturate-150 border-b border-white/60 transition-all duration-300 ${
          scrolled
            ? "bg-white/75 shadow-[0_14px_40px_-16px_rgba(0,109,57,0.45)]"
            : "bg-white/55"
        }`}
      >
        {/* TIER 1: offer + utility strip (desktop) */}
        <div
          className={`hidden xl:block overflow-hidden transition-all duration-300 bg-gradient-to-r from-[#00391b] via-secondary to-[#00391b] text-on-primary ${
            scrolled ? "max-h-0" : "max-h-9"
          }`}
        >
          <div className="h-9 max-w-7xl mx-auto px-margin flex items-center justify-between font-label-sm text-label-sm">
            <div className="flex items-center gap-2 min-w-0">
              <span className="px-2 py-0.5 rounded-full bg-white/15 font-bold uppercase tracking-wider text-[10px]">
                Offer
              </span>

              <span
                key={offer}
                className="flex items-center gap-1.5"
                style={{ animation: "fade-up .5s both" }}
              >
                <I
                  n={offers[offer][0]}
                  c="text-[16px] text-primary-fixed-dim"
                />
                {offers[offer][1]}
              </span>
            </div>

            <div className="flex items-center gap-5 opacity-95">
              <span className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-fixed-dim opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-fixed-dim" />
                </span>
                All systems operational
              </span>

              <Link
                to="/support"
                className="flex items-center gap-1 hover:text-primary-fixed-dim transition-colors"
              >
                <I n="support_agent" c="text-[16px]" />
                24/7 Support
              </Link>

              <button
                type="button"
                onClick={() => window.dispatchEvent(new Event("primo:chat-open"))}
                className="flex items-center gap-1 hover:text-primary-fixed-dim transition-colors"
              >
                <I n="chat" c="text-[16px]" />
                Live Chat
              </button>

              <Link
                to="/server-status"
                className="flex items-center gap-1 hover:text-primary-fixed-dim transition-colors"
              >
                <I n="monitoring" c="text-[16px]" />
                Status
              </Link>
            </div>
          </div>
        </div>

        {/* TIER 2: logo, search, currency, actions */}
        <div className="relative z-20 h-16 max-w-7xl mx-auto px-margin-mobile lg:px-margin flex items-center justify-between gap-gutter border-b border-primary-container/15">
          <Link
            to="/"
            className="flex items-center shrink-0 transition-transform duration-300 hover:scale-[1.03]"
          >
            <img
              src={logo}
              alt="PRIMO CLOUD"
              className="h-10 w-auto object-contain"
            />
          </Link>

          {/* search */}
          <div className="hidden xl:block relative flex-1 max-w-md">
            <I
              n="search"
              c="absolute left-3.5 top-1/2 -translate-y-1/2 text-[20px] text-on-surface-variant pointer-events-none"
            />

            <input
              ref={searchRef}
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setSearchOpen(true);
              }}
              onFocus={() => setSearchOpen(true)}
              placeholder="Search VPS, hosting, servers…"
              className="w-full h-10 pl-10 pr-14 rounded-full bg-surface-container border border-outline-variant font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/70 outline-none transition-all focus:bg-surface-container-lowest focus:border-primary-container focus:ring-4 focus:ring-primary-container/15"
            />

            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded border border-outline-variant bg-surface-container-lowest font-mono-code text-[10px] text-on-surface-variant">
              Ctrl K
            </kbd>

            <div
              className={`absolute left-0 right-0 top-full z-50 pt-2 transition-all duration-200 ${
                searchOpen
                  ? "visible opacity-100 translate-y-0"
                  : "invisible opacity-0 translate-y-2"
              }`}
            >
              <div className="rounded-2xl border border-outline-variant bg-surface-container-lowest shadow-2xl shadow-primary/10 p-space-sm">
                <div className="px-3 py-1 font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
                  {q.trim() ? "Results" : "Popular"}
                </div>

                {results.length ? (
                  results.map((r) => (
                    <Link
                      key={r.label}
                      to={r.href}
                      onClick={() => {
                        setSearchOpen(false);
                        setQ("");
                      }}
                      className="group flex items-center gap-3 rounded-xl p-2.5 hover:bg-secondary-container/20 transition-colors"
                    >
                      <span className="w-8 h-8 rounded-lg bg-secondary-container/40 flex items-center justify-center text-primary-container">
                        <I n={r.icon} c="text-[18px]" />
                      </span>

                      <span className="flex-1">
                        <span className="block font-label-md text-label-md text-on-surface">
                          {r.label}
                        </span>
                        <span className="block font-body-sm text-body-sm text-on-surface-variant">
                          {r.group}
                        </span>
                      </span>

                      <I
                        n="north_east"
                        c="text-[16px] text-primary opacity-0 group-hover:opacity-100 transition-opacity"
                      />
                    </Link>
                  ))
                ) : (
                  <div className="px-3 py-4 font-body-md text-body-md text-on-surface-variant">
                    No matches for “{q}”.
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-space-md shrink-0">
            <CurrencySwitch />

            <Link
              to="/support"
              className="hidden sm:inline-flex items-center gap-1.5 font-label-md text-label-md text-on-surface hover:text-primary transition-colors px-space-sm py-space-xs"
            >
              <I n="support" c="text-[18px]" />
              Support
            </Link>

            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event("primo:login-open"))}
              className="hidden sm:inline-flex relative overflow-hidden items-center justify-center gap-1.5 font-label-md text-label-md bg-gradient-to-r from-primary-container to-secondary text-on-primary px-5 py-2.5 rounded-xl shadow-md shadow-primary-container/30 transition-all hover:shadow-lg hover:-translate-y-0.5 before:absolute before:inset-y-0 before:-left-full before:w-1/2 before:skew-x-[-20deg] before:bg-white/30 hover:before:left-[150%] before:transition-all before:duration-700"
            >
              Get Started
              <I n="arrow_forward" c="text-[16px]" />
            </button>

            <button
              type="button"
              aria-label="Open menu"
              className="xl:hidden w-10 h-10 rounded-xl border border-outline-variant flex items-center justify-center text-on-surface hover:text-primary hover:border-primary-container/50 transition-colors"
              onClick={() => setMobile(true)}
            >
              <I n="menu" c="text-[24px]" />
            </button>
          </div>
        </div>

        {/* TIER 3: nav with mega dropdowns */}
        <div className="relative z-10 hidden xl:block bg-gradient-to-r from-transparent via-secondary-container/15 to-transparent">
          <div className="h-12 max-w-7xl mx-auto px-margin grid grid-cols-[1fr_auto_1fr] items-center">
            <div className="flex items-center gap-1.5 font-label-sm text-label-sm text-on-surface-variant">
              <I n="verified" c="text-[16px] text-primary-container" />
              99.99% Uptime SLA
            </div>

            <nav className="flex items-center gap-8">
              {menu.map((m) => {
                const open = active === m.label;

                if (!m.children) {
                  return (
                    <Link
                      key={m.label}
                      to={m.href}
                      className={pill(isActive(m))}
                    >
                      <I n={m.icon} c="text-[18px]" />
                      {m.label}
                    </Link>
                  );
                }

                const wide = m.children.length > 3;

                return (
                  <div
                    key={m.label}
                    className="relative"
                    onMouseEnter={() => setActive(m.label)}
                    onMouseLeave={() => setActive(null)}
                  >
                    <button
                      type="button"
                      aria-haspopup="true"
                      aria-expanded={open}
                      onClick={() => setActive(open ? null : m.label)}
                      className={pill(open || isActive(m))}
                    >
                      <I n={m.icon} c="text-[18px]" />
                      {m.label}
                      {m.badge && <Badge t={m.badge} />}
                      <I
                        n="expand_more"
                        c={`text-[18px] -mr-1 transition-transform duration-300 ${
                          open ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    <div
                      className={`absolute left-1/2 top-full -translate-x-1/2 pt-2 transition-all duration-200 ${
                        open
                          ? "visible opacity-100 translate-y-0"
                          : "invisible opacity-0 translate-y-2"
                      }`}
                    >
                      <div className="flex rounded-2xl border border-outline-variant bg-surface-container-lowest shadow-2xl shadow-primary/15 overflow-hidden">
                        {/* feature card */}
                        <Link
                          to={
                            m.feature.href === "#vps-plans"
                              ? "/#vps-plans"
                              : m.feature.href
                          }
                          onClick={() => setActive(null)}
                          className="relative w-60 shrink-0 p-space-lg flex flex-col justify-between overflow-hidden bg-gradient-to-br from-primary-container via-secondary to-[#00391b] text-on-primary group"
                        >
                          <span className="absolute -top-10 -right-10 w-36 h-36 rounded-full bg-white/10 transition-transform duration-500 group-hover:scale-125" />
                          <span className="absolute -bottom-12 -left-8 w-32 h-32 rounded-full bg-white/10 transition-transform duration-500 group-hover:scale-125" />

                          <div className="relative">
                            <span className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center mb-3">
                              <I n={m.feature.icon} c="text-[24px]" />
                            </span>

                            <div className="font-headline-sm text-headline-sm font-bold">
                              {m.feature.title}
                            </div>

                            <p className="font-body-sm text-body-sm opacity-90 mt-1">
                              {m.feature.text}
                            </p>

                            <div className="flex flex-wrap gap-1.5 mt-3">
                              {m.feature.chips.map((c) => (
                                <span
                                  key={c}
                                  className="px-2 py-0.5 rounded-full bg-white/15 font-label-sm text-[10px]"
                                >
                                  {c}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="relative mt-5 flex items-center justify-between font-label-md text-label-md font-bold">
                            <span>
                              {m.feature.price
                                ? `From ${fmt(m.feature.price)}/mo`
                                : "Explore"}
                            </span>

                            <I
                              n="arrow_forward"
                              c="text-[18px] transition-transform duration-300 group-hover:translate-x-1"
                            />
                          </div>
                        </Link>

                        {/* items */}
                        <div
                          className={`grid ${
                            wide ? "grid-cols-2 w-[30rem]" : "grid-cols-1 w-72"
                          } content-start gap-1 p-space-sm`}
                        >
                          {m.children.map((c) => (
                            <Link
                              key={c.label}
                              to={c.href}
                              onClick={() => setActive(null)}
                              className="group flex items-start gap-3 rounded-xl p-3 hover:bg-secondary-container/20 transition-colors"
                            >
                              <span className="w-10 h-10 shrink-0 rounded-xl bg-secondary-container/40 flex items-center justify-center text-primary-container transition-all duration-300 group-hover:bg-primary-container group-hover:text-on-primary group-hover:scale-110 group-hover:-rotate-3">
                                <I n={c.icon} c="text-[22px]" />
                              </span>

                              <span className="min-w-0">
                                <span className="flex items-center font-label-lg text-label-lg text-on-surface">
                                  {c.label}
                                  {c.badge && <Badge t={c.badge} />}
                                </span>

                                <span className="block font-body-sm text-body-sm text-on-surface-variant">
                                  {c.desc}
                                </span>
                              </span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </nav>

            <div className="flex items-center justify-end gap-1.5 font-label-sm text-label-sm text-on-surface-variant">
              <I n="public" c="text-[16px] text-primary-container" />
              18+ datacenter locations
            </div>
          </div>
        </div>

        {/* scroll progress */}
        <div
          className="absolute left-0 bottom-0 h-0.5 bg-gradient-to-r from-primary-container to-secondary transition-[width] duration-100"
          style={{ width: `${progress}%` }}
        />
      </header>

      {/* MOBILE DRAWER (outside header: backdrop-filter would break position:fixed) */}
      <div
        className={`xl:hidden fixed inset-0 z-[60] ${
          mobile ? "visible" : "invisible"
        }`}
      >
        <div
          className={`absolute inset-0 bg-on-surface/40 backdrop-blur-sm transition-opacity duration-300 ${
            mobile ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setMobile(false)}
        />

        <aside
          className={`absolute right-0 top-0 h-full w-[88%] max-w-sm bg-surface-container-lowest shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
            mobile ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="h-16 px-margin-mobile flex items-center justify-between border-b border-outline-variant">
            <Link to="/" onClick={() => setMobile(false)}>
              <img src={logo} alt="PRIMO CLOUD" className="h-9 w-auto" />
            </Link>

            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setMobile(false)}
              className="w-10 h-10 rounded-xl border border-outline-variant flex items-center justify-center text-on-surface hover:text-primary"
            >
              <I n="close" c="text-[22px]" />
            </button>
          </div>

          <div className="px-margin-mobile py-2 bg-gradient-to-r from-[#00391b] to-secondary text-on-primary font-label-sm text-label-sm flex items-center gap-1.5">
            <I n="redeem" c="text-[16px]" />
            Save 20% on every yearly plan
          </div>

          <div className="flex-1 overflow-y-auto px-margin-mobile py-space-sm">
            {menu.map((m) =>
              m.children ? (
                <div
                  key={m.label}
                  className="border-b border-outline-variant/60"
                >
                  <button
                    type="button"
                    onClick={() =>
                      setMobSub(mobSub === m.label ? null : m.label)
                    }
                    className="w-full flex items-center justify-between py-3.5 font-label-lg text-label-lg text-on-surface"
                  >
                    <span className="flex items-center gap-2">
                      <I n={m.icon} c="text-[20px] text-primary-container" />
                      {m.label}
                      {m.badge && <Badge t={m.badge} />}
                    </span>

                    <I
                      n="expand_more"
                      c={`transition-transform duration-300 ${
                        mobSub === m.label ? "rotate-180 text-primary" : ""
                      }`}
                    />
                  </button>

                  <div
                    className={`grid transition-all duration-300 ${
                      mobSub === m.label
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      {m.children.map((c) => (
                        <Link
                          key={c.label}
                          to={c.href}
                          onClick={() => setMobile(false)}
                          className="flex items-center gap-3 py-2.5 pl-1"
                        >
                          <span className="w-9 h-9 rounded-xl bg-secondary-container/40 flex items-center justify-center text-primary-container">
                            <I n={c.icon} c="text-[20px]" />
                          </span>

                          <span>
                            <span className="flex items-center font-label-lg text-label-lg text-on-surface">
                              {c.label}
                              {c.badge && <Badge t={c.badge} />}
                            </span>

                            <span className="block font-body-sm text-body-sm text-on-surface-variant">
                              {c.desc}
                            </span>
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={m.label}
                  to={m.href}
                  onClick={() => setMobile(false)}
                  className="flex items-center gap-2 py-3.5 border-b border-outline-variant/60 font-label-lg text-label-lg text-on-surface"
                >
                  <I n={m.icon} c="text-[20px] text-primary-container" />
                  {m.label}
                </Link>
              ),
            )}
          </div>

          <div className="p-margin-mobile border-t border-outline-variant space-y-3 bg-surface-container-low">
            <div className="flex items-center justify-between">
              <span className="font-label-md text-label-md text-on-surface-variant">
                Currency
              </span>

              <CurrencySwitch small />
            </div>

            <div className="flex gap-space-sm">
              <button
                type="button"
                onClick={() => {
                  setMobile(false);
                  window.dispatchEvent(new Event("primo:login-open"));
                }}
                className="flex-1 text-center py-2.5 rounded-xl border border-outline-variant font-label-md text-label-md text-on-surface bg-surface-container-lowest"
              >
                Login
              </button>

              <button
                type="button"
                onClick={() => {
                  setMobile(false);
                  window.dispatchEvent(new Event("primo:login-open"));
                }}
                className="flex-1 text-center py-2.5 rounded-xl bg-gradient-to-r from-primary-container to-secondary text-on-primary font-label-md text-label-md shadow-md"
              >
                Get Started
              </button>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
};

export default Topbar;
