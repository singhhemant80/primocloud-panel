import React from "react";
import LegalPage from "./LegalPage";
import { company as c, legalLinks } from "../../data/company";

const rel = legalLinks.filter(([t]) => t !== "Privacy Policy");

const sections = [
  {
    id: "intro",
    title: "Who we are and what this covers",
    blocks: [
      `${c.legalName} ("${c.brand}", "we", "us") provides web hosting, VPS, dedicated and GPU servers, colocation and cloud solutions through ${c.website}. This Privacy Policy explains what personal data we collect, why we collect it, who sees it and the choices you have.`,
      "It applies to visitors of our website, people who chat with us, customers who buy or manage services, and anyone who contacts our support team.",
    ],
  },
  {
    id: "collect",
    title: "Information we collect",
    blocks: [
      { h: "When you visit our website" },
      "We automatically record technical details such as your approximate location, IP address, browser type and version, device, and the pages you view and for how long.",
      { h: "When you use live chat or contact us" },
      "We keep your name, email address, phone or WhatsApp number (if you give one) and the content of your messages so we can answer you and follow up.",
      { h: "When you sign up or buy" },
      {
        ul: [
          "Contact details: name, email, phone number and postal address",
          "Company name and, for customers in India, GST number",
          "Account details: login email, password (stored as a hash), currency preference and marketing preferences",
          "Billing records: invoices, payment status and the last digits of a card where the gateway shares them. Full card numbers are handled by our payment gateways and are never stored on our servers.",
        ],
      },
      { h: "When you ask for support" },
      "Tickets can include server hostnames, IP addresses, logs, files you attach and, if you choose to share them, temporary access credentials. Credentials you add through the secure ticket field are visible only to the assigned engineer and are removed when the ticket closes.",
      { h: "Domain names" },
      "If you register or transfer a domain with us, we collect the registrant, administrative, technical and billing contact details that the domain registry and ICANN rules require.",
    ],
  },
  {
    id: "use",
    title: "How we use your information",
    blocks: [
      {
        ul: [
          "**Provide services:** create and run your account, deliver and bill for the services you order",
          "**Support:** answer questions, diagnose problems and keep you informed about your services",
          "**Security and compliance:** detect fraud and abuse, verify identity before restoring access, and meet legal and tax obligations",
          "**Improve:** understand how the site is used, fix errors and develop better products",
          "**Communicate:** send service notices, invoices, renewal reminders and policy updates",
          "**Market:** tell you about offers and news. Where the law requires it, we do this only with your consent.",
        ],
      },
    ],
  },
  {
    id: "share",
    title: "Who we share it with",
    blocks: [
      "We do not sell your personal data. We share it only when it is needed to run the service:",
      {
        ul: [
          "**Payment gateway providers** that process your payments",
          "**Service partners and sub-processors** such as datacenter operators, email and live-chat tools, analytics and anti-fraud services, acting on our instructions",
          "**Domain registries and registrars** when you register or transfer a domain",
          "**Resellers**, when you buy through a reseller, so the reseller can support you",
          "**Authorities**, when the law or a valid legal request requires it, or to protect our rights, customers and the public",
          "**A successor**, if the business is merged or sold, under the same protections",
        ],
      },
    ],
  },
  {
    id: "cookies",
    title: "Cookies and similar technologies",
    blocks: [
      "We use cookies, pixels and local storage to recognise your browser or device, remember settings such as your currency, keep you signed in, measure traffic and make the site easier to use.",
      "You can block or delete cookies in your browser settings. Some features, such as saved preferences, may not work if you do.",
    ],
  },
  {
    id: "marketing",
    title: "Newsletters and marketing",
    blocks: [
      "You can choose to receive our newsletter and offers when you sign up or at any time later. Every email has an unsubscribe link, and you can also change your choice from the Client Area.",
      "You will still receive messages that are essential to your service, such as invoices, security alerts and renewal notices.",
    ],
  },
  {
    id: "retention",
    title: "How long we keep data",
    blocks: [
      "We keep personal data for as long as your account is active and afterwards for as long as we need it for tax, accounting, fraud-prevention and legal reasons. After that we delete or anonymise it.",
      "Data stored on your servers is yours. We delete it when a service is terminated, so please keep your own backups.",
    ],
  },
  {
    id: "security",
    title: "How we protect it",
    blocks: [
      "We use encryption in transit, access controls, monitoring and internal policies to protect personal data. We confirm your identity before restoring access to an account.",
      "No online service can promise absolute security. If we ever learn of a breach affecting your data, we will notify you and the authorities as the law requires.",
    ],
  },
  {
    id: "rights",
    title: "Your rights and choices",
    blocks: [
      "Depending on where you live, and in line with laws such as India's Digital Personal Data Protection Act, 2023 and, where it applies, the GDPR, you may have the right to:",
      {
        ul: [
          "Ask for a copy of the personal data we hold about you",
          "Have inaccurate data corrected or incomplete data completed",
          "Ask us to delete your data, subject to records we must keep by law",
          "Withdraw consent for marketing or other consent-based processing",
          "Object to or restrict certain processing, and make a complaint to a data protection authority",
        ],
      },
      `To use any of these rights, write to ${c.email.privacy}. We may need to verify your identity first.`,
    ],
  },
  {
    id: "transfers",
    title: "International transfers",
    blocks: [
      "Our infrastructure and partners are located in several countries, so your data may be processed outside the country where you live. When we do this, we use contractual and technical safeguards that the law requires.",
    ],
  },
  {
    id: "children",
    title: "Children",
    blocks: [
      "Our services are intended for adults and businesses. We do not knowingly collect personal data from anyone under 18. If you believe a child has given us data, contact us and we will delete it.",
    ],
  },
  {
    id: "changes",
    title: "Changes to this policy",
    blocks: [
      "We may update this policy as our services or the law change. The date at the top of this page shows the latest version. For material changes we will also notify account holders by email.",
    ],
  },
  {
    id: "contact",
    title: "Contact us",
    blocks: [
      `${c.legalName}, ${c.address}`,
      `Privacy questions: ${c.email.privacy}  ·  Phone: ${c.phoneLabel}`,
    ],
  },
];

const Privacy = () => (
  <LegalPage
    pill="Legal documentation"
    title="Privacy"
    accent="Policy"
    sub="What we collect, why we collect it, who we share it with, and how you stay in control of your data."
    stats={[
      ["lock", "Never sold", "Your data"],
      ["manage_accounts", "Your rights", "Access · correct · delete"],
      ["mail", "Opt-out", "Any time"],
    ]}
    sections={sections}
    contactTitle="Contact privacy team"
    contactEmail={c.email.privacy}
    related={rel}
  />
);

export default Privacy;
