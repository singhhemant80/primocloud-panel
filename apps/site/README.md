# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Before you launch (Primo Cloud content pass)

Policy and company pages read their details from `src/data/company.js`. Replace every value in
`[square brackets]` there: legal entity name, registered address, GSTIN, court jurisdiction.
Also confirm the email addresses, the phone number and the Client Area URL.

Pages that show placeholder data you should connect or confirm:
- `/server-status` - edit the `services`, `regions` and `incidents` arrays, or fetch from your monitoring tool.
- `/api-docs` - documents a sample REST API; match the base URL and endpoints to your real API.
- `/sla` - credit percentages and uptime targets are proposals; use your real commitments.
- `/blog` - articles live in `src/data/posts.js`.

Have a lawyer review the Terms, Privacy, Refund, AUP and SLA pages before publishing.
Host with SPA fallback (all routes served by index.html) so `/refund-policy` etc. work on refresh.

## Login page and chat widget

- `/login` posts to your client portal. In `src/data/company.js` set `clientAreaEnabled: true` and check
  `loginAction`, `resetAction` and `registerUrl` (WHMCS-style defaults) once the portal is live.
- The WhatsApp-style chat (`src/components/chatbot.jsx`) is a rule-based assistant: edit the `intents`
  list to change its answers. Set `whatsapp` in `src/data/company.js` to show a "Continue on WhatsApp" button.
  Any button can open it with `window.dispatchEvent(new Event("primo:chat-open"))`.
