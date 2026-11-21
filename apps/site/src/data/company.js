// Single source of truth for company details used on the legal, contact and company pages.
// Billing entity: Crapplet Infotech Private Limited (same GSTIN as the invoices the panel issues).
export const company = {
  brand: "Primo Cloud",
  brandCaps: "PRIMO CLOUD",
  legalName: "Crapplet Infotech Private Limited",
  address: "City Center, Gwalior, Madhya Pradesh 474011, India",
  gstin: "23AAHCC8426G1ZR",
  jurisdiction: "Gwalior, Madhya Pradesh, India", // courts that hear disputes (Terms)
  governingLaw: "India", // governing law named in the Terms
  website: "primocloud.in",
  phoneLabel: "+91 70002 50584",
  phoneHref: "tel:+917000250584",
  email: {
    support: "info@primocloud.in",
    billing: "info@primocloud.in",
    sales: "info@primocloud.in",
    privacy: "info@primocloud.in",
    abuse: "info@primocloud.in",
    legal: "info@primocloud.in",
    careers: "info@primocloud.in",
    partners: "info@primocloud.in",
  },
  // Where the "Login" button sends customers (your billing / client portal).
  clientAreaUrl: "/client",
  // The login form signs in against the PrimoCloud panel on this same domain (see src/lib/panel.js).
  clientAreaEnabled: true,
  loginAction: "/api/auth/login",
  registerUrl: "/client/register",
  resetAction: "/api/auth/forgot-password",
  // WhatsApp number for the chat widget's "Continue on WhatsApp" button: country code + number,
  // digits only (e.g. "919876543210"). Leave empty to hide the button.
  whatsapp: "917000250584",
  updated: "13 October 2026",
};

export const legalLinks = [
  ["Terms & Conditions", "/terms-conditions"],
  ["Privacy Policy", "/privacy-policy"],
  ["Refund Policy", "/refund-policy"],
  ["Acceptable Use Policy", "/acceptable-use"],
  ["Service Level Agreement", "/sla"],
];
