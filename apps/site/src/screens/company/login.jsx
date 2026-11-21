import React, { useEffect } from "react";
import { currentUser, afterLoginUrl } from "../../lib/panel";
import { Page, I } from "../../components/kit";
import LoginForm from "../../components/loginform";
import logo from "../../assets/logo.png";

/*
  Customer login. This page has no password database of its own: the forms submit to your client
  portal (billing system) at the addresses in src/data/company.js (loginAction / resetAction), using
  WHMCS-style field names (username, password, rememberme / email).
  Until you set `clientAreaEnabled: true` there, submitting shows a notice instead of posting.
*/

const perks = [
  ["verified", "99.99% uptime SLA", "Infrastructure you can rely on"],
  ["support_agent", "24/7 expert support", "Real engineers on chat, phone and tickets"],
  ["verified_user", "30-day money-back", "On eligible plans"],
];

const Login = () => {
  useEffect(() => {
    currentUser().then((u) => u && window.location.replace(afterLoginUrl()));
  }, []);
  return (
    <Page>
      <section className="relative w-full px-margin-mobile lg:px-margin py-space-md overflow-hidden">
        <div className="pointer-events-none absolute -top-32 -left-20 h-96 w-96 rounded-full bg-primary-container/15 blur-3xl" />
        <div className="relative mx-auto grid max-w-4xl grid-cols-1 overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-lowest shadow-2xl lg:grid-cols-[0.8fr_1fr]">
          {/* brand panel */}
          <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-[#00391b] via-secondary to-primary-container p-space-lg text-on-primary lg:flex">
            <span className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10" />
            <span className="pointer-events-none absolute -bottom-20 -left-10 h-60 w-60 rounded-full bg-white/10" />
            <div className="relative">
              <span className="inline-block rounded-xl bg-white px-3 py-2"><img src={logo} alt="PRIMO CLOUD" className="h-9 w-auto" /></span>
              <h2 className="mt-space-md font-headline-md text-headline-md font-bold tracking-tight">Welcome back</h2>
              <p className="mt-2 font-body-md text-body-md text-on-primary/85">Manage your servers, invoices, domains and support tickets from one place.</p>
            </div>
            <ul className="relative mt-space-md flex flex-col gap-space-sm">
              {perks.map(([ic, t, d]) => (
                <li key={t} className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/15"><I n={ic} c="text-[22px]" /></span>
                  <span>
                    <span className="block font-label-lg text-label-lg font-bold">{t}</span>
                    <span className="block font-body-sm text-body-sm text-on-primary/80">{d}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* form */}
          <div className="p-space-md sm:p-space-lg"><LoginForm /></div>
        </div>
      </section>
    </Page>
  );
};

export default Login;
