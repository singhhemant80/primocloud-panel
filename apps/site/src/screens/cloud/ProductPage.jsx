import React from "react";
import { Page, Hero, Stats, Sec, Head, Cards, Cta, Btn, Ghost, Accordion, Eyebrow } from "../../components/kit";

/* Template for cloud-solution landing pages. Prices are intentionally not shown: sales quotes them. */
const ProductPage = ({ pill, title, accent, sub, stats, features, useCases, steps, faqs, ctaTitle, ctaText, related }) => (
  <Page>
    <Hero pill={pill} title={title} accent={accent} sub={sub}>
      <div className="flex flex-wrap items-center justify-center gap-space-md mt-space-lg">
        <Btn href="/contact">Request a quote</Btn>
        <Ghost href="/support">Talk to an engineer</Ghost>
      </div>
      {stats && <Stats items={stats} />}
    </Hero>

    <Sec>
      <Head pill="Features" title="Everything included" />
      <Cards items={features} />
    </Sec>

    <Sec bg="bg-surface-container-low">
      <Head pill="Use cases" title="Built for how you work" />
      <Cards items={useCases} />
    </Sec>

    <Sec>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-lg items-start">
        <div className="lg:col-span-5">
          <Eyebrow>Getting started</Eyebrow>
          <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface mt-1 mb-space-md">Up and running in {steps.length} steps</h2>
          <ol className="flex flex-col gap-4">
            {steps.map(([t, d], i) => (
              <li key={t} className="flex items-start gap-3">
                <span className="w-8 h-8 shrink-0 rounded-lg bg-gradient-to-br from-primary-container to-secondary text-on-primary font-mono-code text-label-md font-bold flex items-center justify-center">{i + 1}</span>
                <div>
                  <div className="font-headline-sm text-[16px] font-bold text-on-surface">{t}</div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">{d}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <div className="lg:col-span-7">
          <Accordion items={faqs} />
        </div>
      </div>
    </Sec>

    {related && (
      <Sec bg="bg-surface-container-low">
        <Head pill="Related" title="You may also like" />
        <Cards items={related} />
      </Sec>
    )}

    <Cta title={ctaTitle} text={ctaText} primary={["Contact sales", "/contact"]} secondary={["See all plans", "/#vps-plans"]} />
  </Page>
);

export default ProductPage;
