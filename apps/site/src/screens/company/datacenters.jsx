import React from "react";
import { Page, Hero, Stats, Sec, Head, Cards, Cta, cardHover, I } from "../../components/kit";

// Same sites that the Support page lists.
const sites = [
  ["FRA-01", "Frankfurt", "Germany", "Europe"],
  ["LON-01", "London", "United Kingdom", "Europe"],
  ["NYC-01", "New York", "United States", "North America"],
  ["SIN-01", "Singapore", "Singapore", "Asia-Pacific"],
  ["TYO-01", "Tokyo", "Japan", "Asia-Pacific"],
];

const Datacenters = () => (
  <Page>
    <Hero
      pill="Datacenter locations"
      title="Servers close to"
      accent="your customers"
      sub="Deploy where your users are. Pick a region when you order and keep latency low for visitors, traders and teams."
    >
      <Stats
        items={[
          ["public", "18+", "Locations worldwide"],
          ["verified", "99.99%", "Infrastructure SLA"],
          ["bolt", "Redundant", "Power & network"],
        ]}
      />
    </Hero>

    <Sec>
      <Head pill="Featured regions" title="Where you can deploy" sub="More locations are available for dedicated, GPU and colocation orders. Ask us if yours is not listed." />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
        {sites.map(([code, city, country, region]) => (
          <div key={code} className={`p-space-lg ${cardHover}`}>
            <div className="flex items-center justify-between mb-space-sm">
              <span className="font-mono-code text-label-lg font-bold text-on-surface">{code}</span>
              <span className="inline-flex items-center gap-1.5 font-mono-code text-[11px] font-semibold text-primary"><span className="w-1.5 h-1.5 rounded-full bg-primary-container animate-pulse" />Operational</span>
            </div>
            <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">{city}</h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant">{country} · {region}</p>
          </div>
        ))}
        <div className={`p-space-lg flex flex-col justify-center ${cardHover}`}>
          <I n="add_location_alt" c="text-[32px] text-primary-container mb-2" />
          <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">Need another region?</h3>
          <a href="/contact" className="mt-1 font-label-md text-label-md text-primary font-semibold hover:underline">Ask our sales team</a>
        </div>
      </div>
    </Sec>

    <Sec bg="bg-surface-container-low">
      <Head pill="Facility standards" title="What every location is built for" />
      <Cards
        items={[
          ["electric_bolt", "Redundant power", "Multiple power feeds, UPS and generators keep servers running through outages."],
          ["ac_unit", "Precision cooling", "Temperature and humidity are monitored and controlled around the clock."],
          ["lan", "Multi-carrier network", "Diverse uplinks and peering for low latency and resilience."],
          ["badge", "Physical security", "Controlled access, surveillance and logged visits."],
          ["local_fire_department", "Fire protection", "Early detection and suppression systems protect your hardware."],
          ["monitoring", "24/7 monitoring", "Our NOC watches the network and hardware in real time."],
        ]}
      />
    </Sec>

    <Cta title="Pick your region at checkout" text="Choose a location when you order, or ask us to plan a multi-region setup." primary={["View plans", "/#vps-plans"]} secondary={["Server status", "/server-status"]} />
  </Page>
);

export default Datacenters;
