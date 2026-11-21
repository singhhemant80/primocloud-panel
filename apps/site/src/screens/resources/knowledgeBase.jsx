import React, { useMemo, useState } from "react";
import { Page, Hero, Sec, Cta, I, rt, cardHover, IconBox } from "../../components/kit";

const kb = [
  {
    icon: "cloud",
    cat: "Web hosting",
    items: [
      ["How do I log in to cPanel?", "Open the cPanel link in your welcome email or Client Area, and sign in with the username and password we sent you. You can reset the password from the Client Area."],
      ["How do I install WordPress?", "In cPanel open the one-click installer (Softaculous), choose WordPress, pick your domain and set the admin details. The installation takes about a minute."],
      ["How do I install an SSL certificate?", "Free SSL is issued automatically for domains pointing to your hosting. If the padlock is missing, check your DNS records and run AutoSSL from cPanel."],
      ["How do I migrate my website to Primo Cloud?", "Open a ticket with the address of your current host. We will move your files, databases and email for you at no cost on eligible plans."],
    ],
  },
  {
    icon: "terminal",
    cat: "VPS & servers",
    items: [
      ["How do I connect to my Linux VPS?", "Use SSH: **ssh root@your-server-ip**. For better security, add an SSH key and disable password logins."],
      ["How do I connect to my Windows VPS?", "Open Remote Desktop Connection on your computer, enter your server IP, and sign in with the Administrator account and password we provided."],
      ["How do I reset my root or administrator password?", "Use the Client Area to reset the password, or open the VNC console and follow the recovery steps. If you are stuck, open a ticket."],
      ["Can I reinstall the operating system?", "Yes. Reinstalling is available from the Client Area. It erases all data on the server, so back up first."],
      ["How do I upgrade my plan?", "Open the service in your Client Area and choose Upgrade, or ask support to do it for you."],
    ],
  },
  {
    icon: "receipt_long",
    cat: "Billing & account",
    items: [
      ["Which payment methods do you accept?", "We accept cards, PayPal, wire transfer and other methods shown at checkout. Available methods can vary by country."],
      ["How do I download an invoice?", "Sign in to the Client Area and open Billing, then Invoices. You can download a PDF of any invoice."],
      ["How do I cancel a service?", "Submit a cancellation request from the Client Area. Back up your data first, because it is deleted when the service ends."],
      ["How do refunds work?", "Eligible plans have a 30-day money-back window. See the Refund Policy for what is covered and how to request one."],
    ],
  },
  {
    icon: "shield",
    cat: "Security",
    items: [
      ["How do I secure my server?", "Use SSH keys, turn on a firewall, keep software updated and avoid root logins. Our blog article on SSH basics walks through each step."],
      ["What should I do if my account is hacked?", "Change your passwords at once and open a Critical ticket. We will help you isolate the server and find the cause."],
      ["Do you provide DDoS protection?", "Yes. Network-level filtering protects against common volumetric attacks. Very large or targeted attacks may need extra protection."],
    ],
  },
  {
    icon: "mail",
    cat: "Email & domains",
    items: [
      ["How do I create an email account?", "In cPanel open Email Accounts, click Create, and choose an address and password. You can read mail through webmail or any email app."],
      ["How do I point my domain to Primo Cloud?", "Set an A record to your server's IP, or change your nameservers to the ones in your welcome email. DNS can take a few hours to update."],
      ["My emails are going to spam. What can I do?", "Make sure SPF, DKIM and DMARC records are set for your domain, and check that your server's IP is not on a blocklist."],
    ],
  },
];

const KnowledgeBase = () => {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(null);

  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return null;
    return kb.flatMap((c) => c.items.filter(([a, b]) => (a + b).toLowerCase().includes(s)).map((it) => ({ cat: c.cat, it })));
  }, [q]);

  const Item = ({ it, id }) => (
    <li className="border-b border-outline-variant/50 last:border-0">
      <button type="button" aria-expanded={open === id} onClick={() => setOpen(open === id ? null : id)} className="w-full flex items-center justify-between gap-3 py-3 text-left font-body-md text-body-md font-semibold text-on-surface hover:text-primary">
        <span>{it[0]}</span>
        <I n="expand_more" c={`text-[20px] shrink-0 transition-transform ${open === id ? "rotate-180 text-primary" : ""}`} />
      </button>
      {open === id && <p className="pb-3 font-body-md text-body-md text-on-surface-variant leading-relaxed">{rt(it[1])}</p>}
    </li>
  );

  return (
    <Page>
      <Hero pill="Knowledge base" title="Find answers" accent="in seconds" sub="Search our guides on hosting, servers, billing and security. Can't find it? Our engineers are one ticket away.">
        <div className="w-full max-w-2xl mt-space-lg">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-xl p-2 flex items-center gap-2 focus-within:border-primary-container focus-within:ring-4 focus-within:ring-primary-container/15 transition-all">
            <I n="search" c="text-[24px] text-primary-container ml-2" />
            <input value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search the knowledge base" placeholder="Search: SSH, cPanel, invoice, refund…" className="w-full bg-transparent py-3 text-on-surface placeholder:text-outline focus:outline-none font-body-md text-body-md" />
            {q && <button type="button" onClick={() => setQ("")} aria-label="Clear search" className="w-8 h-8 rounded-lg hover:bg-surface-container flex items-center justify-center"><I n="close" c="text-[20px]" /></button>}
          </div>
        </div>
      </Hero>

      <Sec>
        {results ? (
          <div className="max-w-3xl mx-auto w-full bg-surface-container-lowest border border-outline-variant rounded-xl p-space-lg">
            <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-space-sm">{results.length} result{results.length === 1 ? "" : "s"} for “{q}”</h2>
            {results.length ? (
              <ul>{results.map((r, i) => <Item key={r.it[0]} it={r.it} id={`s${i}`} />)}</ul>
            ) : (
              <p className="font-body-md text-body-md text-on-surface-variant">No guides match your search. <a href="/support" className="text-primary font-semibold hover:underline">Open a ticket</a> and we will help.</p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter">
            {kb.map((c) => (
              <div key={c.cat} className={`p-space-lg ${cardHover}`}>
                <div className="flex items-center gap-3 mb-space-sm">
                  <IconBox n={c.icon} size="w-10 h-10 rounded-lg" fs="text-[22px]" mb="" />
                  <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">{c.cat}</h2>
                  <span className="ml-auto font-mono-code text-[11px] px-2 py-0.5 rounded bg-surface-container text-on-surface-variant">{c.items.length} articles</span>
                </div>
                <ul>{c.items.map((it) => <Item key={it[0]} it={it} id={it[0]} />)}</ul>
              </div>
            ))}
          </div>
        )}
      </Sec>

      <Cta title="Still stuck?" text="A real engineer will help you, 24/7." primary={["Open a ticket", "/support"]} secondary={["Contact us", "/contact"]} />
    </Page>
  );
};

export default KnowledgeBase;
