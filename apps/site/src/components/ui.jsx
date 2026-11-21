import React from "react";

// Applies text-[Npx] inline: the Google icon stylesheet forces 24px and would override Tailwind's size class.
export const I = ({ n, c = "" }) => {
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

export const Pill = ({ children, c = "" }) => (
  <span
    className={`inline-flex items-center gap-1.5 font-mono-code text-label-sm text-primary font-semibold uppercase tracking-wider bg-secondary-container/40 border border-primary-container/20 px-3 py-1 rounded-full ${c}`}
  >
    <span className="h-1.5 w-1.5 rounded-full bg-primary-container" />
    {children}
  </span>
);

export const Sec = ({ bg = "bg-surface", id, children }) => (
  <section
    id={id}
    className={`relative overflow-hidden w-full ${bg} py-space-xl`}
  >
    <div className="pointer-events-none absolute -right-32 top-10 h-72 w-72 rounded-full bg-primary-container/5 blur-3xl" />
    <div className="relative max-w-7xl mx-auto px-margin-mobile lg:px-margin">
      {children}
    </div>
  </section>
);

export const Head = ({ pill, title, sub }) => (
  <div className="text-center max-w-3xl mx-auto mb-space-xl">
    <Pill>{pill}</Pill>
    <h2 className="font-headline-xl text-headline-xl text-on-surface font-bold mt-space-sm">
      {title}
    </h2>
    <div className="mx-auto mt-space-sm h-1 w-16 rounded-full bg-gradient-to-r from-primary-container to-secondary" />
    {sub && (
      <p className="font-body-lg text-body-lg text-on-surface-variant mt-space-sm">
        {sub}
      </p>
    )}
  </div>
);

export const Btn = ({ href = "#", children }) => (
  <a
    href={href}
    className="group relative overflow-hidden inline-flex items-center justify-center font-label-lg text-label-lg bg-gradient-to-r from-primary-container to-secondary text-on-primary px-8 py-3.5 rounded-xl transition-all shadow-md shadow-primary-container/30 font-bold hover:shadow-lg hover:-translate-y-0.5 before:absolute before:inset-y-0 before:-left-full before:w-1/2 before:skew-x-[-20deg] before:bg-white/30 hover:before:left-[150%] before:transition-all before:duration-700"
  >
    <span>{children}</span>
    <I
      n="arrow_forward"
      c="ml-1.5 text-[20px] transition-transform group-hover:translate-x-1"
    />
  </a>
);

export const OutlineBtn = ({ href = "#", children, light }) => (
  <a
    href={href}
    className={`inline-flex items-center justify-center font-label-lg text-label-lg px-7 py-3.5 rounded-xl transition-all font-semibold border-2 ${light ? "border-white/80 text-on-primary hover:bg-white/15" : "border-primary-container text-primary-container bg-surface-container-lowest hover:bg-secondary-container/20"}`}
  >
    {children}
  </a>
);

export const IconBox = ({
  n,
  size = "w-12 h-12 rounded-full",
  fs = "text-[26px]",
  mb = "mb-space-md",
  col = "text-primary-container",
}) => (
  <div
    className={`${size} bg-secondary-container/40 flex items-center justify-center ${col} ${mb} transition-all duration-300 group-hover:bg-primary-container group-hover:text-on-primary group-hover:scale-110 group-hover:-rotate-6`}
  >
    <I n={n} c={fs} />
  </div>
);

export const cardHover =
  "group relative overflow-hidden bg-surface-container-lowest rounded-2xl border border-outline-variant hover:border-primary-container/40 transition-all before:absolute before:inset-x-0 before:top-0 before:h-0.5 before:bg-gradient-to-r before:from-primary-container before:to-secondary before:scale-x-0 before:origin-left before:transition-transform before:duration-500 hover:before:scale-x-100";

export const Check = ({ c = "text-[18px]" }) => (
  <I n="check_circle" c={`text-primary-container ${c}`} />
);
