import React from "react";
import LegalPage from "./LegalPage";
import { company as c } from "../../data/company";

const sections = [
  {
    id: "purpose",
    title: "Purpose",
    blocks: [
      `This Acceptable Use Policy keeps the ${c.brand} network fast, safe and legal for everyone. It applies to all services and to anyone using them, including your own customers and users. Breaking it can lead to suspension or termination under our Terms & Conditions.`,
    ],
  },
  {
    id: "prohibited",
    title: "What is not allowed",
    blocks: [
      {
        no: [
          "Sending unsolicited bulk or commercial email (spam), or running open mail relays",
          "Phishing, fraud, impersonation or any scheme that deceives people",
          "Hosting or spreading malware, viruses, worms, trojans, ransomware or botnet controllers",
          "Launching or hosting denial-of-service tools, stress-testing a network you do not own, or port scanning without permission",
          "Attempting to break into systems, accounts or networks without authorisation",
          "Infringing copyright, trademarks or other rights, including hosting pirated material",
          "Content that is illegal, defamatory, threatening, harassing, or that exploits children",
          "Cryptocurrency mining on shared hosting or on plans that do not allow it",
          "Anything that degrades the service for other customers, such as sustained overuse of CPU, memory, disk I/O or bandwidth on shared platforms",
        ],
      },
    ],
  },
  {
    id: "resources",
    title: "Resource use",
    blocks: [
      "Shared, WordPress and Reseller Hosting plans share hardware between customers, so limits on CPU, memory, processes, inodes and bandwidth apply. VPS, dedicated and GPU servers have more freedom but must not disrupt our network or neighbours.",
    ],
  },
  {
    id: "enforcement",
    title: "How we enforce this policy",
    blocks: [
      "When we receive a complaint or detect a violation, we may:",
      {
        steps: [
          "Contact you and ask you to fix the problem within a stated time",
          "Rate-limit, filter or null-route the affected service",
          "Suspend the service until the issue is resolved",
          "Terminate the service and, where the law requires, report it to the authorities",
        ],
      },
      "For serious or urgent threats, such as an active attack or illegal content, we may act without notice. Services terminated for violations are not eligible for refunds.",
    ],
  },
  {
    id: "report",
    title: "Reporting abuse",
    blocks: [
      `To report spam, phishing, malware or other abuse coming from our network, email ${c.email.abuse} with the full headers or logs, the IP address or URL, and the time it happened. We respond to valid reports as quickly as we can.`,
    ],
  },
];

const Aup = () => (
  <LegalPage
    pill="Legal documentation"
    title="Acceptable Use"
    accent="Policy"
    sub="Simple rules that protect our network, your servers and every other customer on it."
    sections={sections}
    contactTitle="Report abuse"
    contactEmail={c.email.abuse}
    related={[["Terms & Conditions", "/terms-conditions"], ["Privacy Policy", "/privacy-policy"], ["Refund Policy", "/refund-policy"], ["Service Level Agreement", "/sla"]]}
  />
);

export default Aup;
