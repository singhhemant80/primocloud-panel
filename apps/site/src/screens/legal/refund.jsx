import React from "react";
import LegalPage from "./LegalPage";
import { company as c, legalLinks } from "../../data/company";

const sections = [
  {
    id: "overview",
    title: "Overview",
    blocks: [
      `This Refund Policy explains when ${c.brand} refunds a payment and how to ask for one. It applies to every order placed through ${c.website} and forms part of our Terms & Conditions.`,
      "We want you to be confident when you buy, so eligible hosting and cloud plans carry a **30-day money-back window** from the date the service is first provisioned.",
    ],
  },
  {
    id: "eligible",
    title: "Services that are refundable",
    blocks: [
      "The following services can be refunded within 30 days of purchase, provided the conditions in this policy are met:",
      {
        ok: [
          "**Shared Hosting** and **WordPress Hosting**",
          "**Reseller Hosting**",
          "**VPS** plans: Windows VPS, Linux VPS, Forex VPS, n8n VPS and Gold VPS",
          "**Cloud Solutions** such as Tally on Cloud and Business Cloud",
          "**Dedicated Servers** and **GPU Servers**, subject to the specific terms below",
        ],
      },
      {
        note: {
          icon: "dns",
          title: "Dedicated and GPU servers",
          text: "Standard, in-stock configurations are refundable within 30 days. Servers built to a custom specification, hardware ordered for you, and one-time set-up fees are not refundable once the order has been confirmed. The terms shown on your quote or order page take precedence.",
        },
      },
    ],
  },
  {
    id: "non-refundable",
    title: "Services that are not refundable",
    blocks: [
      "The items below are not eligible for a refund because third parties charge us for them as soon as they are issued or because they are delivered as one-time work:",
      {
        no: [
          "Domain registrations and domain renewals",
          "Domain transfers (see the exception below)",
          "SSL certificates purchased separately from a hosting plan",
          "Installation, configuration, migration and other professional services",
          "Colocation and cross-connect orders, which are governed by their own service agreement",
          "Bulk bandwidth, IP address add-ons and other usage-based add-ons",
          "Third-party licences that have already been activated for you",
        ],
      },
      {
        note: {
          icon: "swap_horiz",
          title: "Domain transfer exception",
          text: "If the losing registrar does not approve the transfer, or the transfer is cancelled, we refund the transfer fee in full. Taxes such as 18% GST are excluded from the refund.",
        },
      },
    ],
  },
  {
    id: "conditions",
    title: "Eligibility and conditions",
    blocks: [
      "To qualify for a refund, all of the following must be true:",
      {
        ok: [
          "The plan is billed **annually or on a longer cycle**.",
          "The request is made **within 30 days** of the service being provisioned.",
          "It is the first invoice for that service, not a renewal.",
          "The account has not been suspended for breaching the Acceptable Use Policy or the Terms.",
        ],
      },
      "If a hosting plan came with a **free domain name**, the standard price of that domain is deducted from the refund, because the registry fee cannot be recovered.",
      { h: "What we cannot refund" },
      {
        no: [
          "Monthly plans",
          "Renewal invoices, and cancellations made after a renewal has been processed",
          "Accounts suspended or terminated for abuse, spam, phishing, copyright infringement or other Terms violations",
          "Problems caused by your own code, scripts or third-party software that is not compatible with the server",
          "Taxes such as GST, which are remitted to the government when the invoice is issued",
        ],
      },
    ],
  },
  {
    id: "how",
    title: "How to request a refund",
    blocks: [
      {
        steps: [
          "Sign in to the **Client Area** and submit a **cancellation request** for the service.",
          "Open a **billing ticket** from the Support page within 30 days of the purchase and mention the reason for cancelling.",
          "Our billing team reviews the request and checks it against this policy. We may ask you for extra details.",
          "If it is approved, we cancel the service and start the refund.",
          "Back up your data before you cancel. Data is deleted when the service is terminated and cannot be recovered.",
        ],
      },
      {
        note: {
          icon: "schedule",
          title: "Processing time",
          text: "Approved refunds are paid within **7–10 working days**. Customers in India are paid by UPI or bank transfer. Customers elsewhere are paid by PayPal or the original payment method where possible. Your bank may need extra time to post the funds.",
        },
      },
    ],
  },
  {
    id: "chargebacks",
    title: "Chargebacks and disputes",
    blocks: [
      "Please contact us before disputing a charge with your bank or card issuer. Most billing questions are solved within a day.",
      `Opening a chargeback instead of using the process above may lead to suspension of the account and the services on it until the dispute is settled. Write to ${c.email.billing} and we will help.`,
    ],
  },
  {
    id: "changes",
    title: "Changes to this policy",
    blocks: [
      `We may update this policy from time to time. The "last updated" date at the top of the page shows the latest version. A change does not affect refund requests that were submitted before the change.`,
    ],
  },
];

const Refund = () => (
  <LegalPage
    pill="Legal documentation"
    title="Refund"
    accent="Policy"
    sub="A clear 30-day window on eligible plans, a simple request process, and straight answers on what we can and cannot refund."
    stats={[
      ["event_available", "30 days", "Refund window"],
      ["schedule", "7–10 days", "Processing time"],
      ["support_agent", "24/7", "Billing support"],
    ]}
    sections={sections}
    contactTitle="Contact billing"
    contactEmail={c.email.billing}
    related={legalLinks.filter(([t]) => t !== "Refund Policy")}
  />
);

export default Refund;
