"use client";
import { createElement, useEffect } from "react";

/**
 * The primocloud.in website's own header and footer (the React components from apps/site),
 * loaded from /site-chrome.js — built by `npm run build` in apps/site and served from public-site/.
 * They render inside shadow roots, so the website's styles and the panel's never mix.
 */
function useSiteChrome() {
  useEffect(() => {
    if (customElements.get("primo-site-header") || document.querySelector("script[data-site-chrome]")) return;
    const s = document.createElement("script");
    s.type = "module";
    s.src = "/site-chrome.js";
    s.dataset.siteChrome = "1";
    document.head.appendChild(s);
  }, []);
}

export function SiteHeader() {
  useSiteChrome();
  // until the script loads, hold the header's height so the page doesn't jump
  return createElement("primo-site-header", { class: "block min-h-[64px] xl:min-h-[148px]", suppressHydrationWarning: true });
}

export function SiteFooter() {
  useSiteChrome();
  return createElement("primo-site-footer", { class: "block", suppressHydrationWarning: true });
}
