import React from "react";
import { Page, Hero, Sec, Head, Cards, Cta, Btn, Ghost, Accordion, Eyebrow } from "../../components/kit";
import { company as c } from "../../data/company";

const Partner = () => (
  <Page>
    <Hero
      pill="Partner program"
      title="Grow your business with"
      accent="Primo Cloud"
      sub="Resell our infrastructure, refer customers, or integrate your product with our platform. Choose the model that fits how you work."
    >
      <div className="flex flex-wrap items-center justify-center gap-space-md mt-space-lg">
        <Btn href={`mailto:${c.email.partners}?subject=Partner%20program%20enquiry`} icon="mail">Become a partner</Btn>
        <Ghost href="/hosting/reseller-hosting">See Reseller Hosting</Ghost>
      </div>
    </Hero>

    <Sec>
      <Head pill="Ways to partner" title="Three programs, one team behind you" />
      <Cards
        cols="lg:grid-cols-3"
        items={[
          ["storefront", "Reseller", "Sell hosting and servers under your own brand with white-label control panels and your own billing. We run the infrastructure and support your customers on the back end.", "/hosting/reseller-hosting"],
          ["share", "Referral", "Recommend Primo Cloud to clients, readers or your network. You are rewarded when the people you refer become customers."],
          ["integration_instructions", "Technology", "Build a product that works with our platform, from automation tools to monitoring and migration services. Let's discuss integration and co-marketing."],
        ]}
      />
    </Sec>

    <Sec bg="bg-surface-container-low">
      <Head pill="What you get" title="Support that helps you win clients" />
      <Cards
        items={[
          ["support_agent", "Priority support", "A direct line for you and your customers' issues."],
          ["palette", "White-label options", "Your brand on the panel and the invoices where the plan allows."],
          ["school", "Onboarding help", "We help you set up, price and launch your offer."],
          ["campaign", "Marketing material", "Guides and assets you can share with your audience."],
          ["sync_alt", "Free migrations", "We help move your clients' sites to us."],
          ["dashboard", "One account", "Manage customers and services from one dashboard."],
        ]}
      />
    </Sec>

    <Sec>
      <div className="max-w-3xl mx-auto w-full">
        <div className="text-center mb-space-lg"><Eyebrow>Partner FAQ</Eyebrow><h2 className="font-headline-lg text-headline-lg font-bold text-on-surface mt-1">Common questions</h2></div>
        <Accordion
          items={[
            ["Is there a joining fee?", "Joining the referral and technology programs is free. Reseller plans are paid plans, priced on the Reseller Hosting page."],
            ["What are the commission or discount terms?", `Terms depend on the program and volume. Email ${c.email.partners} and we will share the current terms.`],
            ["Can my customers contact you directly?", "Not unless you want them to. We can support your customers quietly in the background under your brand."],
            ["How do I get started?", "Send us a short note about your business and the program you are interested in. We usually reply within a working day."],
          ]}
        />
      </div>
    </Sec>

    <Cta title="Let's build something together" text="Tell us about your business and we will suggest the right program." primary={["Email the partner team", `mailto:${c.email.partners}`]} secondary={["Contact us", "/contact"]} />
  </Page>
);

export default Partner;
