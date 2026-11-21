import React, { useState } from "react";
import { Page, Hero, Sec, Eyebrow, Accordion, I, field, cardHover, IconBox } from "../../components/kit";
import { company as c } from "../../data/company";

const depts = [
  ["sales", "Sales and new orders", c.email.sales],
  ["support", "Technical support", c.email.support],
  ["billing", "Billing and refunds", c.email.billing],
  ["abuse", "Report abuse", c.email.abuse],
  ["partners", "Partnerships", c.email.partners],
];

const channels = [
  ["confirmation_number", "Support ticket", "Best for technical issues. Attach logs and files.", "Open a ticket", "/support"],
  ["call", "Phone", "Talk to an engineer. Available 24/7.", c.phoneLabel, c.phoneHref],
  ["mail", "Email", "For sales, billing and general questions.", c.email.sales, `mailto:${c.email.sales}`],
];

const Contact = () => {
  const [f, setF] = useState({ dept: "sales", name: "", email: "", phone: "", subject: "", msg: "" });
  const set = (k) => (e) => setF((x) => ({ ...x, [k]: e.target.value }));

  // No form backend: open the visitor's email app with the message filled in.
  const submit = (e) => {
    e.preventDefault();
    const to = depts.find((d) => d[0] === f.dept)[2];
    const body = `${f.msg}\n\n--\n${f.name}\n${f.email}${f.phone ? `\n${f.phone}` : ""}`;
    window.location.href = `mailto:${to}?subject=${encodeURIComponent(f.subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <Page>
      <Hero
        pill="Contact us"
        title="Talk to the"
        accent="people who run it"
        sub="Questions about a plan, a migration or an invoice? Pick the fastest route below. Support is available 24/7."
      />

      <Sec>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
          {channels.map(([ic, t, d, cta, href]) => (
            <a key={t} href={href} className={`block p-space-lg ${cardHover}`}>
              <IconBox n={ic} />
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-1">{t}</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-sm">{d}</p>
              <span className="font-label-md text-label-md text-primary font-semibold inline-flex items-center gap-1">{cta}<I n="arrow_forward" c="text-[16px]" /></span>
            </a>
          ))}
        </div>
      </Sec>

      <Sec bg="bg-surface-container-low">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-lg items-start">
          <form onSubmit={submit} className="lg:col-span-7 bg-surface-container-lowest border border-outline-variant rounded-xl p-space-lg lg:p-space-xl flex flex-col gap-space-md">
            <div>
              <Eyebrow>Send a message</Eyebrow>
              <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface mt-1">How can we help?</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
              <div>
                <label className="block font-label-md text-label-md font-semibold text-on-surface mb-1.5" htmlFor="ct-dept">Department</label>
                <select id="ct-dept" value={f.dept} onChange={set("dept")} className={field}>
                  {depts.map(([v, t]) => <option key={v} value={v}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block font-label-md text-label-md font-semibold text-on-surface mb-1.5" htmlFor="ct-name">Your name *</label>
                <input id="ct-name" required value={f.name} onChange={set("name")} className={field} />
              </div>
              <div>
                <label className="block font-label-md text-label-md font-semibold text-on-surface mb-1.5" htmlFor="ct-email">Email *</label>
                <input id="ct-email" type="email" required value={f.email} onChange={set("email")} className={field} />
              </div>
              <div>
                <label className="block font-label-md text-label-md font-semibold text-on-surface mb-1.5" htmlFor="ct-phone">Phone / WhatsApp</label>
                <input id="ct-phone" type="tel" value={f.phone} onChange={set("phone")} className={field} />
              </div>
            </div>
            <div>
              <label className="block font-label-md text-label-md font-semibold text-on-surface mb-1.5" htmlFor="ct-sub">Subject *</label>
              <input id="ct-sub" required value={f.subject} onChange={set("subject")} className={field} />
            </div>
            <div>
              <label className="block font-label-md text-label-md font-semibold text-on-surface mb-1.5" htmlFor="ct-msg">Message *</label>
              <textarea id="ct-msg" required rows={5} value={f.msg} onChange={set("msg")} className={field} />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
              <p className="font-body-sm text-[12px] text-on-surface-variant">This opens your email app with the message ready to send.</p>
              <button type="submit" className="px-space-xl py-3 rounded-lg bg-gradient-to-r from-primary-container to-secondary text-on-primary font-label-md text-label-md font-semibold shadow-md hover:-translate-y-0.5 transition-all inline-flex items-center justify-center gap-2">
                Send message <I n="send" c="text-[18px]" />
              </button>
            </div>
          </form>

          <div className="lg:col-span-5 flex flex-col gap-space-md">
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-space-lg">
              <Eyebrow>Company details</Eyebrow>
              <div className="mt-space-sm flex flex-col gap-3 font-body-md text-body-md text-on-surface-variant">
                <div className="flex gap-3"><I n="apartment" c="text-[20px] text-primary-container shrink-0" /><span>{c.legalName}</span></div>
                <div className="flex gap-3"><I n="location_on" c="text-[20px] text-primary-container shrink-0" /><span>{c.address}</span></div>
                <div className="flex gap-3"><I n="call" c="text-[20px] text-primary-container shrink-0" /><a className="hover:text-primary" href={c.phoneHref}>{c.phoneLabel}</a></div>
              </div>
            </div>
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-space-lg">
              <Eyebrow>Email directly</Eyebrow>
              <ul className="mt-space-sm flex flex-col gap-2">
                {depts.map(([k, t, m]) => (
                  <li key={k} className="flex items-center justify-between gap-3 font-body-sm text-[13px]">
                    <span className="text-on-surface-variant">{t}</span>
                    <a href={`mailto:${m}`} className="text-primary font-semibold hover:underline">{m}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Sec>

      <Sec>
        <div className="max-w-3xl mx-auto w-full">
          <div className="text-center mb-space-lg"><Eyebrow>Before you write</Eyebrow><h2 className="font-headline-lg text-headline-lg font-bold text-on-surface mt-1">Quick answers</h2></div>
          <Accordion
            items={[
              ["Which channel is the fastest for a server problem?", "Open a ticket from the Support page and choose the severity. Critical tickets page the on-call engineer. For a production outage, call the phone number above."],
              ["I want to cancel or ask for a refund.", "Submit a cancellation request in the Client Area and open a billing ticket within 30 days of purchase. See the Refund Policy for what is eligible."],
              ["How do I report spam or abuse from your network?", `Email ${c.email.abuse} with the headers or logs, the IP address and the time. We act on valid reports quickly.`],
              ["Can you help me move my site to Primo Cloud?", "Yes. Tell us where it is hosted now and we will help you migrate with minimal downtime."],
            ]}
          />
        </div>
      </Sec>
    </Page>
  );
};

export default Contact;
