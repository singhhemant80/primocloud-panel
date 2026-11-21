import React from "react";
import LegalPage from "./LegalPage";
import { company as c } from "../../data/company";

const sections = [
  {
    id: "commitment",
    title: "Our uptime commitment",
    blocks: [
      `${c.brand} commits to the monthly availability below for the network and the infrastructure that runs your service. Availability is measured by our monitoring systems, per calendar month, excluding the exclusions listed further down.`,
      {
        table: {
          head: ["Service", "Monthly availability target"],
          rows: [
            ["Network and datacenter infrastructure (power, cooling, uplinks)", "99.99%"],
            ["VPS, Dedicated, GPU and Cloud Solutions", "99.99%"],
            ["Shared, WordPress and Reseller Hosting", "99.9%"],
          ],
        },
      },
    ],
  },
  {
    id: "credits",
    title: "Service credits",
    blocks: [
      "If we miss the target for a service, you can claim a credit against your next invoice:",
      {
        table: {
          head: ["Monthly availability", "Credit (share of that month's fee)"],
          rows: [
            ["Below the target but at least 99.0%", "10%"],
            ["Below 99.0% but at least 98.0%", "25%"],
            ["Below 98.0%", "50%"],
          ],
        },
      },
      "Credits are applied to future invoices and have no cash value. They are your sole remedy for downtime, and cannot exceed the fee for the affected service for that month.",
    ],
  },
  {
    id: "claim",
    title: "How to claim a credit",
    blocks: [
      {
        steps: [
          "Open a ticket in the **Billing** category within **14 days** of the incident.",
          "Give the service name, the date and time, and what you saw.",
          "We compare your report with our external probes and hypervisor logs.",
          "If the downtime is verified, the credit is added to your next billing cycle.",
        ],
      },
    ],
  },
  {
    id: "exclusions",
    title: "What is not counted as downtime",
    blocks: [
      {
        no: [
          "Scheduled maintenance announced in advance",
          "Emergency maintenance needed to protect security or stability, kept as short as possible",
          "Failures of networks, services or software outside our control, including third-party providers",
          "Force majeure events such as natural disasters, war, strikes or government action",
          "Problems caused by your own software, configuration, firewall or internet connection",
          "Suspension or termination under the Terms & Conditions or Acceptable Use Policy",
          "Attacks that exceed the protection included in your plan",
        ],
      },
    ],
  },
  {
    id: "support",
    title: "Support response",
    blocks: [
      "Our support team is available 24/7. Response targets depend on your plan and the severity of the ticket, as shown on the Support page. Response targets are goals and are not covered by service credits unless your contract says so.",
    ],
  },
  {
    id: "changes",
    title: "Changes",
    blocks: ["We may update this SLA. The date at the top of the page shows the latest version. Changes apply to the month after they are published."],
  },
];

const Sla = () => (
  <LegalPage
    pill="Legal documentation"
    title="Service Level"
    accent="Agreement"
    sub="What uptime we commit to, what happens when we miss it, and how to claim a credit."
    stats={[
      ["verified", "99.99%", "Infrastructure SLA"],
      ["event", "14 days", "To claim a credit"],
      ["support_agent", "24/7", "Support"],
    ]}
    sections={sections}
    contactTitle="Contact support"
    contactEmail={c.email.support}
    related={[["Terms & Conditions", "/terms-conditions"], ["Refund Policy", "/refund-policy"], ["Acceptable Use Policy", "/acceptable-use"], ["Privacy Policy", "/privacy-policy"]]}
  />
);

export default Sla;
