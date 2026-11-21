/*
  The website's real header and footer as two custom elements, for the panel's pages
  (order, client sign-in/registration):

    <script type="module" src="/site-chrome.js"></script>
    <primo-site-header></primo-site-header>   …page…   <primo-site-footer></primo-site-footer>

  Each renders inside a shadow root with the site's own compiled CSS, so the website's Tailwind
  theme and the panel's never touch each other. Links do a full page load (the panel is a
  different app). Built by `npm run build` (vite.chrome.config.js) into public-site/site-chrome.js.
*/
import React from "react";
import { createRoot } from "react-dom/client";
import { Router } from "react-router-dom";
import Topbar from "./components/topbar";
import Footer from "./components/footer";
import { CurrencyProvider } from "./context/CurrencyContext";
import { company } from "./data/company";
import { currentUser, CLIENT_URL } from "./lib/panel";
import siteCss from "./index.css?inline";

// :root variables (header height, glass colours) must live on the shadow host
const CSS =
  siteCss.replaceAll(":root", ":root, :host") +
  `
:host { display: block; }
.material-symbols-outlined {
  font-family: "Material Symbols Outlined"; font-weight: normal; font-style: normal; font-size: 24px;
  line-height: 1; letter-spacing: normal; text-transform: none; display: inline-block; white-space: nowrap;
  word-wrap: normal; direction: ltr; font-feature-settings: "liga"; -webkit-font-smoothing: antialiased;
}`;

const toHref = (to) => (typeof to === "string" ? to : `${to.pathname ?? ""}${to.search ?? ""}${to.hash ?? ""}`);
// every link leaves the panel page with a normal navigation
const navigator = {
  createHref: toHref,
  encodeLocation: (to) => {
    const u = new URL(toHref(to), window.location.href);
    return { pathname: u.pathname, search: u.search, hash: u.hash };
  },
  push: (to) => window.location.assign(toHref(to)),
  replace: (to) => window.location.replace(toHref(to)),
  go: (n) => window.history.go(n),
};

const Shell = ({ children }) => (
  <CurrencyProvider>
    <Router location={{ pathname: window.location.pathname, search: window.location.search, hash: window.location.hash }} navigator={navigator}>
      {children}
    </Router>
  </CurrencyProvider>
);

// header buttons that open the website's login pop-up / chat go to the panel's own equivalents
let wired = false;
function wireEvents() {
  if (wired) return;
  wired = true;
  window.addEventListener("primo:login-open", async () => {
    window.location.assign((await currentUser()) ? CLIENT_URL : "/client/login");
  });
  window.addEventListener("primo:chat-open", () => {
    if (company.whatsapp) window.open(`https://wa.me/${company.whatsapp}`, "_blank", "noopener");
    else window.location.assign("/contact");
  });
}

class SiteElement extends HTMLElement {
  part = "header";
  connectedCallback() {
    wireEvents();
    if (!this.shadowRoot) {
      const shadow = this.attachShadow({ mode: "open" });
      const style = document.createElement("style");
      style.textContent = CSS;
      shadow.appendChild(style);
      this._mount = document.createElement("div");
      shadow.appendChild(this._mount);
    }
    if (this._root) return;
    this._root = createRoot(this._mount);
    this._root.render(<Shell>{this.part === "header" ? <Topbar /> : <Footer />}</Shell>);
    if (this.part === "header") this.reserveSpace();
  }
  disconnectedCallback() {
    // React may still be rendering; unmount on the next tick
    const root = this._root;
    this._root = null;
    this._ro?.disconnect();
    if (root) setTimeout(() => root.unmount());
  }
  /** The topbar is position:fixed; keep the host as tall as it so the page starts below it. */
  reserveSpace() {
    const fit = () => {
      const h = this.shadowRoot.querySelector("header");
      if (h && window.scrollY <= 8) this.style.height = `${h.offsetHeight}px`;
    };
    requestAnimationFrame(() => {
      fit();
      const h = this.shadowRoot.querySelector("header");
      if (h) {
        this._ro = new ResizeObserver(fit);
        this._ro.observe(h);
      }
    });
  }
}

class SiteHeader extends SiteElement {
  part = "header";
}
class SiteFooter extends SiteElement {
  part = "footer";
}

if (!customElements.get("primo-site-header")) customElements.define("primo-site-header", SiteHeader);
if (!customElements.get("primo-site-footer")) customElements.define("primo-site-footer", SiteFooter);
