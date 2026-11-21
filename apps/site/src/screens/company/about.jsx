import React from "react";
import { Page, Hero, Stats, Sec, Head, Cards, Cta, Btn, Ghost } from "../../components/kit";

const About = () => (
  <Page>
    <Hero
      pill="About Primo Cloud"
      title="Infrastructure you can"
      accent="build a business on"
      sub="Primo Cloud provides hosting, VPS, dedicated and GPU servers, colocation and cloud solutions for developers, traders, agencies and growing companies, backed by engineers who answer when you need them."
    >
      <div className="flex flex-wrap items-center justify-center gap-space-md mt-space-lg">
        <Btn href="/#vps-plans">Explore plans</Btn>
        <Ghost href="/contact">Talk to us</Ghost>
      </div>
      <Stats
        items={[
          ["verified", "99.99%", "Uptime SLA"],
          ["support_agent", "24/7", "Expert support"],
          ["public", "18+", "Datacenter locations"],
          ["verified_user", "30-Day", "Money-back guarantee"],
        ]}
      />
    </Hero>

    <Sec>
      <Head
        pill="What we do"
        title="One platform, from first website to GPU cluster"
        sub="Start small and move up without changing provider. Every product is built on the same network, the same support team and the same billing account."
      />
      <Cards
        items={[
          ["cloud", "Web hosting", "Shared, WordPress and Reseller Hosting with SSL, backups and a control panel you already know.", "/hosting/shared-hosting"],
          ["dns", "VPS", "Linux, Windows, Forex, n8n and Gold VPS with full root or administrator access.", "/vps/linux-vps"],
          ["storage", "Dedicated & GPU servers", "Bare-metal hardware for databases, rendering, AI training and inference.", "/server/dedicated-servers"],
          ["corporate_fare", "Colocation", "Secure rack space and connectivity for the hardware you own.", "/server/colocation"],
          ["receipt_long", "Cloud solutions", "Tally on Cloud and cloud desktops so your team can work from anywhere.", "/cloud-solution/tally-on-cloud"],
          ["support_agent", "Human support", "Real engineers on chat, phone and tickets, around the clock.", "/support"],
        ]}
      />
    </Sec>

    <Sec bg="bg-surface-container-low">
      <Head pill="How we work" title="Principles we run the company by" />
      <Cards
        items={[
          ["visibility", "Be transparent", "Clear prices, clear policies and a public status page. If something breaks, we say so and explain why."],
          ["engineering", "Let engineers talk to customers", "Questions go to people who can fix the problem, not to a script."],
          ["shield", "Protect what you run", "Security, backups and DDoS protection are part of the platform, not an afterthought."],
          ["trending_up", "Grow with you", "Upgrade a plan, move to a bigger server or add a cluster without starting over."],
          ["handshake", "Earn the renewal", "A 30-day guarantee on eligible plans means we have to deliver from day one."],
          ["balance", "Keep it fair", "Plain-language terms, honest refunds and no surprise charges."],
        ]}
      />
    </Sec>

    <Cta
      title="Ready to build on Primo Cloud?"
      text="Pick a plan and go live in minutes, or talk to us about a custom setup."
      primary={["View plans", "/#vps-plans"]}
      secondary={["Contact sales", "/contact"]}
    />
  </Page>
);

export default About;
