import React, { useEffect, useState } from "react";
import { Page, Hero, Stats, Cta, I, L, rt, Table } from "../../components/kit";
import { company } from "../../data/company";

/* Renders one content block of a legal section. */
const Block = ({ b }) => {
  if (typeof b === "string")
    return <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">{rt(b)}</p>;

  if (b.h) return <h3 className="font-headline-sm text-[16px] font-bold text-on-surface mt-space-sm">{b.h}</h3>;

  if (b.ul)
    return (
      <ul className="flex flex-col gap-2">
        {b.ul.map((x) => (
          <li key={x} className="flex items-start gap-2.5 font-body-md text-body-md text-on-surface-variant leading-relaxed">
            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary-container shrink-0" />
            <span>{rt(x)}</span>
          </li>
        ))}
      </ul>
    );

  if (b.ok || b.no) {
    const ok = !!b.ok;
    return (
      <ul className="flex flex-col gap-2">
        {(b.ok || b.no).map((x) => (
          <li key={x} className="flex items-start gap-2.5 font-body-md text-body-md text-on-surface-variant leading-relaxed">
            <I n={ok ? "check_circle" : "cancel"} c={`text-[20px] shrink-0 mt-0.5 ${ok ? "text-primary-container" : "text-error"}`} />
            <span>{rt(x)}</span>
          </li>
        ))}
      </ul>
    );
  }

  if (b.steps)
    return (
      <ol className="flex flex-col gap-3">
        {b.steps.map((x, i) => (
          <li key={x} className="flex items-start gap-3">
            <span className="w-7 h-7 shrink-0 rounded-lg bg-secondary-container/50 text-primary font-mono-code text-label-md font-bold flex items-center justify-center">{i + 1}</span>
            <span className="font-body-md text-body-md text-on-surface-variant leading-relaxed pt-0.5">{rt(x)}</span>
          </li>
        ))}
      </ol>
    );

  if (b.note)
    return (
      <div className="flex items-start gap-3 rounded-xl border border-primary-container/30 bg-secondary-container/25 p-space-md">
        <I n={b.note.icon || "info"} c="text-[22px] text-primary shrink-0" />
        <div>
          <div className="font-label-lg text-label-lg font-bold text-on-surface">{b.note.title}</div>
          <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed mt-0.5">{rt(b.note.text)}</p>
        </div>
      </div>
    );

  if (b.table) return <Table head={b.table.head} rows={b.table.rows} min={b.table.min || "min-w-[560px]"} />;
  return null;
};

/**
 * Shared template for every legal / policy page.
 * props: pill, title, accent, sub, stats, sections[{id,title,blocks[]}], contact{title,lines[]}, cta
 */
const LegalPage = ({ pill, title, accent, sub, stats, sections, contactTitle, contactEmail, related = [] }) => {
  const [active, setActive] = useState(sections[0].id);

  // highlight the section currently in view
  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-20% 0px -70% 0px" },
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [sections]);

  return (
    <Page>
      <Hero pill={pill} title={title} accent={accent} sub={sub}>
        <div className="mt-space-sm inline-flex items-center gap-2 font-mono-code text-label-sm text-on-surface-variant">
          <I n="update" c="text-[16px] text-primary-container" /> Last updated {company.updated}
        </div>
        {stats && <Stats items={stats} />}
      </Hero>

      {/* plain <section> (not Sec): overflow-hidden would break the sticky contents column */}
      <section className="relative w-full py-space-xl">
        <div className="relative max-w-7xl mx-auto px-margin-mobile lg:px-margin">
          <div className="grid grid-cols-1 lg:grid-cols-[18rem_1fr] gap-gutter-lg items-start">
            <aside className="lg:sticky lg:top-[calc(var(--header-min)+1rem)] flex flex-col gap-space-md">
              <nav aria-label="Contents" className="bg-surface-container-lowest border border-outline-variant rounded-xl p-space-md">
                <div className="font-mono-code text-label-sm uppercase tracking-widest text-primary font-bold mb-space-sm">Contents</div>
                <ul className="flex flex-col gap-0.5">
                  {sections.map((s, i) => (
                    <li key={s.id}>
                      <a
                        href={`#${s.id}`}
                        className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 font-body-sm text-[13px] transition-colors ${
                          active === s.id ? "bg-secondary-container/50 text-primary font-semibold" : "text-on-surface-variant hover:bg-secondary-container/25 hover:text-primary"
                        }`}
                      >
                        <span className="font-mono-code text-[11px] opacity-70">{String(i + 1).padStart(2, "0")}</span>
                        {s.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>

              <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-space-md">
                <div className="font-mono-code text-label-sm uppercase tracking-widest text-primary font-bold mb-space-sm">{contactTitle}</div>
                <div className="flex flex-col gap-2 font-body-sm text-[13px] text-on-surface-variant">
                  <div className="flex items-start gap-2"><I n="location_on" c="text-[18px] text-primary-container shrink-0" /><span>{company.legalName}<br />{company.address}</span></div>
                  <a href={`mailto:${contactEmail}`} className="flex items-center gap-2 hover:text-primary"><I n="mail" c="text-[18px] text-primary-container shrink-0" />{contactEmail}</a>
                  <a href={company.phoneHref} className="flex items-center gap-2 hover:text-primary"><I n="call" c="text-[18px] text-primary-container shrink-0" />{company.phoneLabel}</a>
                </div>
              </div>

              {related.length > 0 && (
                <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-space-md">
                  <div className="font-mono-code text-label-sm uppercase tracking-widest text-primary font-bold mb-space-sm">Related policies</div>
                  <ul className="flex flex-col gap-1.5">
                    {related.map(([t, h]) => (
                      <li key={h}><L href={h} className="flex items-center gap-1.5 font-body-sm text-[13px] text-on-surface-variant hover:text-primary"><I n="chevron_right" c="text-[16px] text-primary-container" />{t}</L></li>
                    ))}
                  </ul>
                </div>
              )}
            </aside>

            <article className="flex flex-col gap-space-lg min-w-0">
              {sections.map((s, i) => (
                <div key={s.id} id={s.id} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-space-lg lg:p-space-xl scroll-mt-32">
                  <div className="flex items-center gap-3 mb-space-md">
                    <span className="font-mono-code text-label-lg font-bold text-primary-container">{String(i + 1).padStart(2, "0")}</span>
                    <h2 className="font-headline-md text-headline-md font-bold text-on-surface tracking-tight">{s.title}</h2>
                  </div>
                  <div className="flex flex-col gap-space-md">
                    {s.blocks.map((b, j) => <Block key={j} b={b} />)}
                  </div>
                </div>
              ))}
            </article>
          </div>
        </div>
      </section>

      <Cta
        title="Questions about this policy?"
        text="Our team will gladly explain any section in plain language. Reach out and we'll get back to you."
        primary={["Contact us", "/contact"]}
        secondary={["Open a support ticket", "/support"]}
      />
    </Page>
  );
};

export default LegalPage;
