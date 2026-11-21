import React from "react";
import LegalPage from "./LegalPage";
import { company as c, legalLinks } from "../../data/company";

const rel = legalLinks.filter(([t]) => t !== "Terms & Conditions");

const sections = [
  {
    id: "agreement",
    title: "Agreement and scope",
    blocks: [
      `These Terms & Conditions govern your use of the hosting, server, colocation and cloud services provided by ${c.legalName} ("${c.brand}", "we", "us"). By placing an order, creating an account or using a service, you agree to them, together with our Privacy Policy, Refund Policy, Acceptable Use Policy and Service Level Agreement.`,
      "If a term in an order form, purchase order or other document you send us conflicts with these Terms, these Terms prevail unless we have agreed otherwise in writing.",
    ],
  },
  {
    id: "account",
    title: "Your account",
    blocks: [
      "You must be at least 18 years old, or the authorised representative of a business, and give accurate and complete information when you register. Keep your contact details up to date.",
      "You are responsible for everything done through your account and for keeping your passwords and keys secret. Tell us at once if you suspect unauthorised use.",
    ],
  },
  {
    id: "responsibilities",
    title: "Your responsibilities",
    blocks: [
      "When you use our services you agree to:",
      {
        ul: [
          "Follow all laws that apply to you and to the content you host, including Indian law where relevant",
          "Respect intellectual property and other third-party rights",
          "Not host content that is defamatory, threatening, abusive, or that discriminates against people",
          "Keep your systems free of viruses and malware, and keep your software patched",
          "Secure your own applications, scripts and data. Unmanaged servers are administered by you.",
        ],
      },
    ],
  },
  {
    id: "abuse",
    title: "Spam and abuse",
    blocks: [
      "Sending unsolicited commercial or bulk email is prohibited. So are worms, viruses, trojans, denial-of-service attacks, phishing, port scanning and any activity that harms our network or other customers.",
      "We may suspend or terminate services that break these rules, with or without notice, depending on the severity. Details are in the Acceptable Use Policy.",
    ],
  },
  {
    id: "domains",
    title: "Domain names",
    blocks: [
      "This section applies when you register, transfer or receive a domain through us, including a free domain bundled with a hosting plan.",
      {
        ul: [
          "**Confirmation:** please check within 2 hours that your registration is active and tell Support straight away if it failed.",
          "**Restrictions:** we may lock, suspend or cancel a domain for a name that infringes a trademark, incorrect KYC or registrant details, an unverified email address, spam or illegal activity.",
          "**Renewals:** we send reminders 30, 7 and 1 day before expiry. You are responsible for renewing on time and we are not liable for a lapse. Renewals are non-refundable.",
          "**Transfers:** transferring a domain in requires paying at least one year of renewal. Transferring one out carries an administrative fee that is shown at the time of the request.",
          "**Free domains:** if a free domain came with a shared or WordPress hosting plan, cancelling the plan also cancels the domain offer.",
          "Domain registrations and add-ons are generally non-refundable.",
        ],
      },
    ],
  },
  {
    id: "billing",
    title: "Billing, taxes and renewals",
    blocks: [
      "Prices are shown before tax. For customers in India, 18% GST is added. Taxes are non-refundable once an invoice has been issued.",
      "Services renew for the same period unless you cancel before the renewal date. We send invoices ahead of the due date.",
      {
        table: {
          head: ["Service", "If payment is late"],
          rows: [
            ["Shared, WordPress and Reseller Hosting", "Suspended 2 days after the due date. Terminated after 15 days."],
            ["VPS, Dedicated and GPU Servers", "Please pay at least 5 days before expiry. Unpaid services are terminated at expiry."],
            ["Colocation and custom contracts", "As set out in your service agreement."],
          ],
        },
      },
      { note: { icon: "backup", title: "Backups after termination", text: "We do not keep backups of terminated services. You are responsible for your own data and should back it up before a service expires or is cancelled." } },
    ],
  },
  {
    id: "service-levels",
    title: "Service levels and uptime",
    blocks: [
      "We work to keep your services available as described in our Service Level Agreement. The uptime commitment does not cover scheduled maintenance, failures of third-party networks or services, events beyond our control (force majeure), or downtime caused by your own firewall, software or connection.",
    ],
  },
  {
    id: "bandwidth",
    title: "Bandwidth and fair use",
    blocks: [
      "Plans with a bandwidth allowance or fair-use limit are monitored. If you exceed it, we will warn you. If it continues, we may suspend the service until usage is brought down or you upgrade your plan.",
    ],
  },
  {
    id: "termination",
    title: "Suspension and termination",
    blocks: [
      "We may suspend or terminate a service when:",
      {
        ul: [
          "You cancel, or the service is not renewed",
          "We reasonably suspect fraud or illegal use",
          "You break these Terms or the Acceptable Use Policy",
          "There is a payment dispute or a chargeback",
          "We are required to by law or a court or authority",
        ],
      },
      "You may cancel at any time from the Client Area. Cancellation does not entitle you to a refund except as stated in the Refund Policy.",
    ],
  },
  {
    id: "fraud",
    title: "Fraud prevention and VPN use",
    blocks: [
      "To protect customers and payment partners, orders placed while connected through a VPN or proxy may be held for verification. Services bought this way may be suspended or terminated without a refund if we cannot verify the order.",
    ],
  },
  {
    id: "third-party",
    title: "Third-party services",
    blocks: [
      "Some products include or depend on third-party software and services, for example cPanel, Plesk, Windows Server, Tally or cloud providers. They are also subject to the terms of those providers, and we pass on changes to their licences and prices.",
    ],
  },
  {
    id: "content",
    title: "Your content and our property",
    blocks: [
      "You keep ownership of the content you store on our services. You give us the limited permission needed to host, back up and deliver it.",
      `The ${c.brand} name, logo, website and software we provide remain our property or that of our licensors.`,
    ],
  },
  {
    id: "liability",
    title: "Disclaimer and limitation of liability",
    blocks: [
      "Services are provided “as is” and “as available”. To the maximum extent the law allows, we are not liable for indirect, incidental or consequential loss, loss of profit, revenue or data, or loss arising from events beyond our reasonable control.",
      "Our total liability for any claim is limited to the fees you paid for the affected service in the 3 months before the claim arose. Nothing in these Terms limits liability that cannot be limited by law.",
    ],
  },
  {
    id: "changes",
    title: "Changes to prices and terms",
    blocks: [
      "We may change our prices, services and these Terms. Changes are published on this page with a new date and, for material changes, notified by email. Price changes apply from your next renewal. If you do not accept a change, you may cancel before it takes effect.",
    ],
  },
  {
    id: "law",
    title: "Governing law and disputes",
    blocks: [
      `These Terms are governed by the laws of ${c.governingLaw}. Any dispute is subject to the exclusive jurisdiction of the courts at ${c.jurisdiction}. We encourage you to contact us first so we can try to resolve the matter informally.`,
    ],
  },
  {
    id: "contact",
    title: "Contact",
    blocks: [`${c.legalName}, ${c.address}`, `Email: ${c.email.legal}  ·  Phone: ${c.phoneLabel}`],
  },
];

const Terms = () => (
  <LegalPage
    pill="Legal documentation"
    title="Terms &"
    accent="Conditions"
    sub="The rules that apply when you use Primo Cloud services: your account, billing, acceptable use, domains and what to expect from us."
    stats={[
      ["gavel", `${sections.length}`, "Clear sections"],
      ["receipt_long", "18% GST", "India only"],
      ["support_agent", "24/7", "Support"],
    ]}
    sections={sections}
    contactTitle="Contact legal team"
    contactEmail={c.email.legal}
    related={rel}
  />
);

export default Terms;
