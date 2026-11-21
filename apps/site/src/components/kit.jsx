import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "./layout";
import { useMotion } from "./motion";
import { I, Pill, Sec, Head, cardHover, IconBox } from "./ui";

export { I, Pill, Sec, Head, cardHover, IconBox };

/* Link that uses the router for in-app paths and a normal anchor otherwise. */
export const L = ({ href = "#", children, ...p }) =>
  href.startsWith("/") && !href.startsWith("//") ? (
    <Link to={href} {...p}>{children}</Link>
  ) : (
    <a href={href} {...p}>{children}</a>
  );

/* **bold** inline markup. */
export const rt = (s) =>
  String(s)
    .split("**")
    .map((t, i) => (i % 2 ? <strong key={i} className="text-on-surface font-semibold">{t}</strong> : <React.Fragment key={i}>{t}</React.Fragment>));

export const Page = ({ children }) => {
  const ref = useRef(null);
  useMotion(ref);
  return (
    <Layout>
      <div ref={ref} className="flex flex-col w-full">{children}</div>
    </Layout>
  );
};

export const Eyebrow = ({ children }) => (
  <span className="font-mono-code text-label-sm uppercase tracking-widest text-primary font-bold">{children}</span>
);

export const Hero = ({ pill, title, accent, sub, children }) => (
  <section className="relative w-full bg-gradient-to-b from-surface-container-low via-surface to-surface pb-space-xl pt-space-lg px-margin-mobile lg:px-margin overflow-hidden">
    <div className="pointer-events-none absolute -top-40 right-0 h-96 w-96 rounded-full bg-primary-container/10 blur-3xl" />
    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,rgba(11,175,96,0.18)_1px,transparent_1px)] bg-[size:28px_28px] [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_70%)]" />
    <div className="relative max-w-7xl mx-auto flex flex-col items-center text-center">
      <Pill>{pill}</Pill>
      <h1 className="font-headline-xl lg:font-display-lg text-headline-xl lg:text-display-lg text-on-surface tracking-tight max-w-4xl font-bold mt-space-sm">
        {title}{" "}
        {accent && (
          <span className="bg-gradient-to-r from-primary-container via-secondary to-primary-container bg-[length:200%_auto] bg-clip-text text-transparent animate-[shimmer_4s_linear_infinite]">
            {accent}
          </span>
        )}
      </h1>
      {sub && <p className="font-body-lg text-body-lg text-on-surface-variant max-w-3xl mt-space-sm leading-relaxed">{sub}</p>}
      {children}
    </div>
  </section>
);

export const Stats = ({ items }) => (
  <div className={`grid grid-cols-2 ${items.length >= 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"} gap-gutter w-full max-w-4xl mt-space-lg`}>
    {items.map(([ic, v, l]) => (
      <div key={l} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-space-md shadow-sm text-left flex items-center gap-3">
        <span className="w-10 h-10 shrink-0 rounded-lg bg-secondary-container/40 text-primary-container flex items-center justify-center"><I n={ic} c="text-[22px]" /></span>
        <div>
          <div className="font-headline-sm text-headline-sm font-bold text-on-surface leading-tight">{v}</div>
          <div className="font-body-sm text-body-sm text-on-surface-variant">{l}</div>
        </div>
      </div>
    ))}
  </div>
);

export const Btn = ({ href, children, icon = "arrow_forward" }) => (
  <L
    href={href}
    className="group relative overflow-hidden inline-flex items-center justify-center font-label-lg text-label-lg bg-gradient-to-r from-primary-container to-secondary text-on-primary px-7 py-3.5 rounded-xl transition-all shadow-md shadow-primary-container/30 font-bold hover:shadow-lg hover:-translate-y-0.5 before:absolute before:inset-y-0 before:-left-full before:w-1/2 before:skew-x-[-20deg] before:bg-white/30 hover:before:left-[150%] before:transition-all before:duration-700"
  >
    <span>{children}</span>
    <I n={icon} c="ml-1.5 text-[20px] transition-transform group-hover:translate-x-1" />
  </L>
);

export const Ghost = ({ href, children, light }) => (
  <L
    href={href}
    className={`inline-flex items-center justify-center font-label-lg text-label-lg px-6 py-3.5 rounded-xl transition-all font-semibold border-2 ${
      light ? "border-white/80 text-on-primary hover:bg-white/15" : "border-primary-container text-primary-container bg-surface-container-lowest hover:bg-secondary-container/20"
    }`}
  >
    {children}
  </L>
);

export const Cta = ({ title, text, primary, secondary }) => (
  <section className="w-full py-space-xl px-margin-mobile lg:px-margin">
    <div className="max-w-7xl mx-auto relative overflow-hidden bg-gradient-to-r from-primary via-secondary to-primary-container rounded-xl shadow-2xl shadow-primary/20 p-space-lg lg:p-space-xl text-on-primary flex flex-col lg:flex-row items-center justify-between gap-space-lg">
      <span className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10 animate-float" />
      <div className="relative max-w-2xl">
        <h3 className="font-headline-lg text-headline-lg font-bold tracking-tight mb-2">{title}</h3>
        <p className="font-body-md text-body-md text-on-primary/90 leading-relaxed">{text}</p>
      </div>
      <div className="relative flex flex-col sm:flex-row items-center gap-space-md shrink-0">
        {primary && (
          <L href={primary[1]} className="px-space-lg py-3.5 rounded-lg bg-surface-container-lowest text-on-surface font-label-md text-label-md font-bold hover:bg-surface transition-all shadow-lg hover:-translate-y-0.5">
            {primary[0]}
          </L>
        )}
        {secondary && <Ghost href={secondary[1]} light>{secondary[0]}</Ghost>}
      </div>
    </div>
  </section>
);

export const Accordion = ({ items }) => {
  const [open, setOpen] = useState(0);
  return (
    <div className="flex flex-col gap-space-sm">
      {items.map(([q, a], i) => (
        <div key={q} className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden">
          <button
            type="button"
            aria-expanded={open === i}
            onClick={() => setOpen(open === i ? -1 : i)}
            className="w-full flex items-center justify-between gap-3 p-space-md text-left font-headline-sm text-[16px] font-bold text-on-surface"
          >
            <span>{q}</span>
            <I n="expand_more" c={`text-[24px] shrink-0 text-primary transition-transform duration-300 ${open === i ? "rotate-180" : ""}`} />
          </button>
          <div className={`grid transition-all duration-300 ${open === i ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
            <div className="overflow-hidden">
              <div className="px-space-md pb-space-md font-body-md text-body-md text-on-surface-variant leading-relaxed">{typeof a === "string" ? rt(a) : a}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

/* Dark terminal / code block with copy button. */
export const Code = ({ title = "terminal", children }) => {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(children); } catch { /* blocked */ }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  return (
    <div className="bg-inverse-surface rounded-xl shadow-xl text-inverse-on-surface overflow-hidden">
      <div className="flex items-center justify-between gap-2 px-4 py-2.5 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-error" /><span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]" /><span className="w-2.5 h-2.5 rounded-full bg-primary-container" />
          <span className="font-mono-code text-[12px] text-surface-variant ml-2">{title}</span>
        </div>
        <button type="button" onClick={copy} className="flex items-center gap-1 text-[11px] font-mono-code px-2 py-1 rounded bg-white/10 hover:bg-white/20 transition-colors">
          <I n={copied ? "check" : "content_copy"} c="text-[14px]" />{copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto font-mono-code text-[12.5px] leading-relaxed whitespace-pre"><code>{children}</code></pre>
    </div>
  );
};

/* Card grid: items = [icon, title, text]. */
export const Cards = ({ items, cols = "lg:grid-cols-3" }) => (
  <div className={`grid grid-cols-1 md:grid-cols-2 ${cols} gap-gutter`}>
    {items.map(([ic, t, d, href]) => {
      const inner = (
        <>
          <IconBox n={ic} />
          <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-2">{t}</h3>
          <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">{d}</p>
          {href && <span className="mt-space-md inline-flex items-center gap-1 font-label-md text-label-md text-primary font-semibold">Learn more <I n="arrow_forward" c="text-[16px]" /></span>}
        </>
      );
      return href ? (
        <L key={t} href={href} className={`block p-space-lg ${cardHover}`}>{inner}</L>
      ) : (
        <div key={t} className={`p-space-lg ${cardHover}`}>{inner}</div>
      );
    })}
  </div>
);

/* Simple table. */
export const Table = ({ head, rows, min = "min-w-[640px]" }) => (
  <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-md overflow-x-auto">
    <table className={`w-full ${min} text-left border-collapse`}>
      <thead>
        <tr className="bg-surface-container">
          {head.map((h) => <th key={h} className="p-space-md font-label-lg text-label-lg font-bold text-on-surface">{h}</th>)}
        </tr>
      </thead>
      <tbody className="divide-y divide-surface-container font-body-sm text-[13px]">
        {rows.map((r, i) => (
          <tr key={i} className="hover:bg-secondary-container/10 transition-colors">
            {r.map((c, j) => <td key={j} className={`p-space-md ${j === 0 ? "font-semibold text-on-surface" : "text-on-surface-variant"}`}>{c}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export const field =
  "w-full bg-surface-container-low border border-outline-variant/60 text-on-surface rounded-lg px-3 py-2.5 font-body-md text-body-md transition-all focus:outline-none focus:bg-surface-container-lowest focus:border-primary-container focus:ring-4 focus:ring-primary-container/15";
