import React, { useState } from "react";
import { Page, Hero, Sec, Cta, Code, Table, Eyebrow, I } from "../../components/kit";

/*
  API DOCS - this page documents a REST API at BASE. Check the base URL, paths and fields below
  against your real client-area/API before launch and edit them to match.
*/
const BASE = "https://api.primocloud.com/v1";

const examples = {
  curl: `curl ${BASE}/servers \\
  -H "Authorization: Bearer $PRIMO_API_TOKEN"`,
  javascript: `const res = await fetch("${BASE}/servers", {
  headers: { Authorization: \`Bearer \${process.env.PRIMO_API_TOKEN}\` },
});
const { data } = await res.json();
console.log(data);`,
  python: `import os, requests

r = requests.get(
    "${BASE}/servers",
    headers={"Authorization": f"Bearer {os.environ['PRIMO_API_TOKEN']}"},
    timeout=15,
)
r.raise_for_status()
print(r.json()["data"])`,
};

const endpoints = [
  ["GET", "/servers", "List your servers"],
  ["GET", "/servers/{id}", "Get one server"],
  ["POST", "/servers/{id}/actions/reboot", "Reboot a server"],
  ["POST", "/servers/{id}/actions/power-off", "Power a server off"],
  ["POST", "/servers/{id}/actions/power-on", "Power a server on"],
  ["GET", "/invoices", "List invoices"],
  ["GET", "/tickets", "List support tickets"],
  ["POST", "/tickets", "Open a support ticket"],
];

const errors = [
  ["400", "bad_request", "The request is malformed or missing a field."],
  ["401", "unauthorized", "The token is missing, invalid or expired."],
  ["403", "forbidden", "The token does not have permission for this action."],
  ["404", "not_found", "The resource does not exist."],
  ["429", "rate_limited", "Too many requests. Wait and retry."],
  ["500", "server_error", "Something went wrong on our side."],
];

const verb = { GET: "bg-secondary-container text-on-secondary-container", POST: "bg-primary-container text-on-primary" };

const ApiDocs = () => {
  const [lang, setLang] = useState("curl");
  return (
    <Page>
      <Hero pill="API documentation" title="Automate your" accent="infrastructure" sub="A simple REST API to manage servers, invoices and tickets from your own scripts and tools." />

      <Sec>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-lg items-start">
          <div className="lg:col-span-5 flex flex-col gap-space-lg">
            <div>
              <Eyebrow>Get started</Eyebrow>
              <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface mt-1 mb-space-sm">Authentication</h2>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                Create an API token in your Client Area and send it in the <code className="font-mono-code bg-surface-container px-1.5 py-0.5 rounded">Authorization</code> header as a Bearer token. Keep the token secret, never commit it to Git, and revoke it if it leaks.
              </p>
            </div>
            <div>
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-1">Base URL</h3>
              <Code title="base url">{BASE}</Code>
            </div>
            <div>
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-1">Rate limits</h3>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">Requests are rate limited per token. When you receive a 429 response, wait and retry with exponential back-off.</p>
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col gap-space-sm">
            <div className="flex gap-2">
              {Object.keys(examples).map((k) => (
                <button key={k} type="button" onClick={() => setLang(k)} className={`px-3.5 py-1.5 rounded-full font-label-md text-label-md capitalize transition-colors ${lang === k ? "bg-primary-container text-on-primary" : "bg-surface-container-high text-on-surface-variant hover:bg-secondary-container"}`}>{k}</button>
              ))}
            </div>
            <Code title={`list-servers.${lang === "curl" ? "sh" : lang === "python" ? "py" : "js"}`}>{examples[lang]}</Code>
            <Code title="response.json">{`{
  "data": [
    {
      "id": "srv_1234",
      "name": "web-01",
      "status": "running",
      "region": "FRA-01",
      "ipv4": "203.0.113.10"
    }
  ]
}`}</Code>
          </div>
        </div>
      </Sec>

      <Sec bg="bg-surface-container-low">
        <div className="text-center mb-space-lg"><Eyebrow>Reference</Eyebrow><h2 className="font-headline-lg text-headline-lg font-bold text-on-surface mt-1">Endpoints</h2></div>
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-x-auto">
          <ul className="min-w-[560px] divide-y divide-outline-variant/50">
            {endpoints.map(([m, p, d]) => (
              <li key={m + p} className="flex items-center gap-4 px-space-md py-3">
                <span className={`w-14 text-center px-2 py-0.5 rounded font-mono-code text-[11px] font-bold ${verb[m]}`}>{m}</span>
                <code className="font-mono-code text-[13px] text-on-surface flex-1">{p}</code>
                <span className="font-body-sm text-body-sm text-on-surface-variant">{d}</span>
              </li>
            ))}
          </ul>
        </div>
      </Sec>

      <Sec>
        <div className="text-center mb-space-lg"><Eyebrow>Reference</Eyebrow><h2 className="font-headline-lg text-headline-lg font-bold text-on-surface mt-1">Errors</h2></div>
        <Table head={["Status", "Code", "Meaning"]} rows={errors} min="min-w-[520px]" />
        <p className="mt-space-md flex items-center gap-2 font-body-sm text-body-sm text-on-surface-variant"><I n="info" c="text-[18px] text-primary-container" />Need an endpoint that is not listed? Tell our team through a support ticket.</p>
      </Sec>

      <Cta title="Questions about the API?" text="Our engineers can help you design your automation." primary={["Open a ticket", "/support"]} secondary={["Read tutorials", "/tutorials"]} />
    </Page>
  );
};

export default ApiDocs;
