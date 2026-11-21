import React from "react";
import { Page, Hero, Sec, Head, Cards, Cta, Btn, Ghost, I, Eyebrow, cardHover } from "../../components/kit";
import { company as c } from "../../data/company";

const teams = [
  ["terminal", "Systems & infrastructure", "Linux, networking, virtualisation, storage and hardware."],
  ["support_agent", "Support & NOC", "Tier-1 to Tier-3 engineers who keep customers online around the clock."],
  ["code", "Software & automation", "Control panels, billing integrations, tooling and the website you are on."],
  ["trending_up", "Sales & partnerships", "Helping customers and resellers choose the right setup."],
  ["receipt_long", "Billing & operations", "Invoices, renewals, compliance and keeping the business running."],
  ["campaign", "Marketing & content", "Guides, tutorials and campaigns that explain our products clearly."],
];

const steps = [
  ["Apply", "Send your CV or profile and a few lines about what you want to work on."],
  ["Conversation", "A short call to learn about you and answer your questions."],
  ["Practical round", "A role-relevant task or technical discussion, never a trick quiz."],
  ["Offer", "We aim to give a clear answer quickly after the final round."],
];

const Careers = () => (
  <Page>
    <Hero
      pill="Careers"
      title="Help us keep the internet"
      accent="running"
      sub="We are always interested in engineers, support specialists and business people who like solving real problems for real customers."
    >
      <div className="flex flex-wrap items-center justify-center gap-space-md mt-space-lg">
        <Btn href={`mailto:${c.email.careers}?subject=Application`} icon="mail">Send your application</Btn>
        <Ghost href="/about-us">About Primo Cloud</Ghost>
      </div>
    </Hero>

    <Sec>
      <Head pill="Teams" title="Where you could fit" sub="Roles open and close as we grow. Tell us which team interests you and we will keep your details on file." />
      <Cards items={teams} />
    </Sec>

    <Sec bg="bg-surface-container-low">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-lg items-start">
        <div className="lg:col-span-5">
          <Eyebrow>Open roles</Eyebrow>
          <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface mt-1 mb-space-sm">No openings listed right now</h2>
          <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
            We do not have a role posted at the moment, but we read every application. Send a short note about yourself and the team you would like to join, and we will contact you when something matches.
          </p>
          <a href={`mailto:${c.email.careers}`} className="mt-space-md inline-flex items-center gap-2 font-label-lg text-label-lg text-primary font-semibold hover:underline">
            <I n="mail" c="text-[20px]" />{c.email.careers}
          </a>
        </div>
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-gutter">
          {steps.map(([t, d], i) => (
            <div key={t} className={`p-space-lg ${cardHover}`}>
              <span className="font-mono-code text-label-lg font-bold text-primary-container">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mt-1 mb-1">{t}</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">{d}</p>
            </div>
          ))}
        </div>
      </div>
    </Sec>

    <Cta
      title="Not sure where you fit?"
      text="Write to us anyway. Good people usually find a role with us."
      primary={["Email careers", `mailto:${c.email.careers}`]}
      secondary={["Contact us", "/contact"]}
    />
  </Page>
);

export default Careers;
