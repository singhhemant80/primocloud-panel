import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { company as c } from "../data/company";
import logo from "../assets/logo.png";

/* ------------------------------------------------------------------ *
 *  WhatsApp-style live chat widget (rule-based assistant).
 *  - Open it from anywhere with: window.dispatchEvent(new Event("primo:chat-open"))
 *  - Edit the `intents` list below to change what the assistant knows.
 *  - It is an automated assistant; people reach a human via phone, ticket or WhatsApp.
 * ------------------------------------------------------------------ */

const Icon = ({ n, c: cls = "", size }) => (
  <span className={`material-symbols-outlined ${cls}`} style={size ? { fontSize: size } : undefined}>
    {n}
  </span>
);

const KEY = "primo-chat-v1";
const SEEN = "primo-chat-seen";

const store = {
  get(k, fallback) {
    try {
      const v = sessionStorage.getItem(k);
      return v ? JSON.parse(v) : fallback;
    } catch {
      return fallback;
    }
  },
  set(k, v) {
    try {
      sessionStorage.setItem(k, JSON.stringify(v));
    } catch {
      /* storage blocked */
    }
  },
};

const MAIN_CHIPS = ["Plans & pricing", "Refunds", "Technical support", "Billing", "Talk to a human"];

const human = () => {
  const links = [
    { label: `Call ${c.phoneLabel}`, to: c.phoneHref },
    { label: "Open a support ticket", to: "/support" },
    { label: "Email sales", to: `mailto:${c.email.sales}` },
  ];
  if (c.whatsapp) links.unshift({ label: "Continue on WhatsApp", to: `https://wa.me/${c.whatsapp}` });
  return {
    text: "Of course. Our engineers and sales team are available 24/7. Pick the quickest way to reach them:",
    links,
  };
};

// First matching intent wins, so keep the more specific ones first.
const intents = [
  {
    re: /\b(human|agent|person|someone|representative|operator|call|phone|whatsapp|talk to|speak)\w*/,
    reply: human,
  },
  {
    re: /\b(refund|money.?back|cancel|cancellation|chargeback)\w*/,
    reply: () => ({
      text: "Eligible hosting, VPS and cloud plans have a 30-day money-back window. Plans must be billed annually or longer, the request must come within 30 days, and renewals, monthly plans and domain fees are not covered. You can cancel from the Client Area and open a billing ticket.",
      links: [{ label: "Read the Refund Policy", to: "/refund-policy" }],
      chips: ["Billing", "Talk to a human"],
    }),
  },
  {
    re: /\b(invoice|billing|bill|payment|pay|gst|tax|card|paypal|wire|upi|crypto|renew)\w*/,
    reply: () => ({
      text: "You can view and download invoices in the Client Area under Billing. We accept cards, PayPal, wire transfer and crypto, and you can switch prices between USD and INR with the toggle at the top of the site. For customers in India, 18% GST is added. Renewal reminders are sent before each due date.",
      links: [{ label: "Terms & Conditions", to: "/terms-conditions" }, { label: "Contact billing", to: `mailto:${c.email.billing}` }],
      chips: ["Refunds", "Talk to a human"],
    }),
  },
  {
    re: /\b(down|outage|not working|offline|error|slow|hacked|attack|ddos|problem|issue|bug|broken|can'?t connect|cannot connect|unreachable|support|ticket|help)\w*/,
    reply: () => ({
      text: "Sorry you're having trouble. For a fast fix, open a ticket and choose the severity. Critical tickets page the engineer on call, and for a production outage you can phone us any time. First, you can check whether we have a known incident.",
      links: [
        { label: "Open a support ticket", to: "/support" },
        { label: "Check server status", to: "/server-status" },
        { label: `Call ${c.phoneLabel}`, to: c.phoneHref },
      ],
      chips: ["Talk to a human"],
    }),
  },
  {
    re: /\b(status|uptime|sla|guarantee|99\.99)\w*/,
    reply: () => ({
      text: "We commit to 99.99% availability for our network and infrastructure and to 99.9% for shared hosting, with service credits if we miss it. You can see live status any time.",
      links: [{ label: "Service Level Agreement", to: "/sla" }, { label: "Server status", to: "/server-status" }],
    }),
  },
  {
    re: /\b(gpu|ai\b|machine learning|nvidia|h100|training|render)\w*/,
    reply: () => ({
      text: "Our GPU servers are dedicated machines for AI training, inference and rendering. You get the whole card with no sharing. Our team can help you size one for your workload.",
      links: [{ label: "GPU Servers", to: "/server/gpu-servers" }, { label: "Talk to sales", to: "/contact" }],
    }),
  },
  {
    re: /\b(dedicated|bare.?metal|colo|colocation|rack)\w*/,
    reply: () => ({
      text: "Dedicated servers give you bare-metal hardware with no sharing. If you own your hardware, colocation gives you secure rack space and connectivity.",
      links: [{ label: "Dedicated Servers", to: "/server/dedicated-servers" }, { label: "Colocation", to: "/server/colocation" }],
    }),
  },
  {
    re: /\b(tally)\w*/,
    reply: () => ({
      text: "Tally on Cloud lets you and your team use Tally from anywhere, on any device, with automatic backups.",
      links: [{ label: "Tally on Cloud", to: "/cloud-solution/tally-on-cloud" }],
    }),
  },
  {
    re: /\b(forex|mt4|mt5|metatrader|trading|gold|n8n|automation)\w*/,
    reply: () => ({
      text: "We have VPS plans built for traders and automation: Forex VPS for MT4/MT5, Gold VPS for gold trading bots, and n8n VPS for workflows that run 24/7.",
      links: [{ label: "Forex VPS", to: "/vps/forex-vps" }, { label: "Gold VPS", to: "/vps/gold-vps" }, { label: "n8n VPS", to: "/vps/n8n-vps" }],
    }),
  },
  {
    re: /\b(price|pricing|plans?|cost|cheap|cheapest|how much|quote|offer|discount)\w*/,
    reply: () => ({
      text: "Prices are on each product page, and you can switch between USD and INR at the top of the site. Yearly plans save 20%. Which product are you interested in?",
      links: [{ label: "See VPS plans", to: "/#vps-plans" }],
      chips: ["Web hosting", "VPS", "Dedicated server", "GPU server"],
    }),
  },
  {
    re: /\b(migrat|move my|transfer my|switch from)\w*/,
    reply: () => ({
      text: "We offer free zero-downtime migration with every plan. Tell us where your site or server is hosted now, open a ticket and our engineers will do the move for you.",
      links: [{ label: "Open a ticket", to: "/support" }],
    }),
  },
  {
    re: /\b(vps|virtual|linux|windows|rdp|root|kvm)\w*/,
    reply: () => ({
      text: "Our VPS plans run on KVM with full root access on Linux, or Administrator access over RDP on Windows. You can upgrade later without moving servers.",
      links: [{ label: "Linux VPS", to: "/vps/linux-vps" }, { label: "Windows VPS", to: "/vps/windows-vps" }],
      chips: ["Plans & pricing"],
    }),
  },
  {
    re: /\b(hosting|shared|wordpress|wp|cpanel|reseller|website|site)\w*/,
    reply: () => ({
      text: "For websites we offer Shared Hosting, WordPress Hosting and Reseller Hosting. All come with SSL and a control panel, and we migrate your existing site for free.",
      links: [
        { label: "Shared Hosting", to: "/hosting/shared-hosting" },
        { label: "WordPress Hosting", to: "/hosting/wordpress-hosting" },
        { label: "Reseller Hosting", to: "/hosting/reseller-hosting" },
      ],
    }),
  },
  {
    re: /\b(domain|ssl|https|certificate)\w*/,
    reply: () => ({
      text: "Hosting plans include free SSL, and selected annual plans include a free domain for the first year. Domain registrations and renewals are not refundable. You can see which plans include a domain on the hosting pages.",
      links: [{ label: "Shared Hosting", to: "/hosting/shared-hosting" }],
    }),
  },
  {
    re: /\b(location|datacenter|data center|region|where|server location|frankfurt|london|new york|singapore|tokyo)\w*/,
    reply: () => ({
      text: "You can deploy in several regions, including Frankfurt, London, New York, Singapore and Tokyo, and we have 18+ locations in total.",
      links: [{ label: "Datacenter locations", to: "/datacenters" }],
    }),
  },
  {
    re: /\b(login|log in|sign in|signin|password|account|client area|register|sign up|signup)\w*/,
    reply: () => ({
      text: "You can sign in, create an account or reset your password from the login page.",
      links: [{ label: "Go to login", to: "/login" }],
    }),
  },
  {
    re: /\b(partner|reseller program|affiliate|referral)\w*/,
    reply: () => ({
      text: "We have reseller, referral and technology partner programs. Our partner team can share the current terms.",
      links: [{ label: "Partner program", to: "/partner-program" }],
    }),
  },
  {
    re: /\b(job|career|hiring|work with you|vacancy)\w*/,
    reply: () => ({ text: "We're always glad to hear from good people.", links: [{ label: "Careers", to: "/careers" }] }),
  },
  {
    re: /\b(thanks|thank you|thx|great|awesome|perfect|ok thanks)\w*/,
    reply: () => ({ text: "You're welcome! Anything else I can help you with?", chips: MAIN_CHIPS.slice(0, 3) }),
  },
  {
    re: /\b(bye|goodbye|see you)\w*/,
    reply: () => ({ text: "Goodbye! We're here 24/7 whenever you need us. 👋" }),
  },
  {
    re: /^(hi|hello|hey|hii+|hola|good (morning|afternoon|evening)|namaste)\b/,
    reply: () => ({ text: "Hi there! 👋 How can I help you today?", chips: MAIN_CHIPS }),
  },
];

// chip labels that aren't natural sentences map to a keyword the matcher understands
const chipAlias = {
  "Plans & pricing": "pricing",
  "Technical support": "support",
  "Talk to a human": "human",
  "Web hosting": "hosting",
  VPS: "vps",
  "Dedicated server": "dedicated",
  "GPU server": "gpu",
};

const answer = (raw) => {
  const q = (chipAlias[raw] || raw).toLowerCase().trim();
  for (const it of intents) if (it.re.test(q)) return it.reply();
  return {
    text: "I'm an automated assistant, so I may have missed that. I can help with plans, refunds, billing and technical support, or you can reach our team directly.",
    chips: MAIN_CHIPS,
  };
};

const hhmm = (t) => new Date(t).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
let uid = 0;
const mk = (from, text, extra = {}) => ({ id: `${Date.now()}-${uid++}`, from, text, ts: Date.now(), ...extra });

/* WhatsApp tick marks: 1 grey = sent, 2 grey = delivered, 2 blue = read. */
const Ticks = ({ status }) => (
  <Icon n={status === "sent" ? "check" : "done_all"} size={16} c={status === "read" ? "text-[#53bdeb]" : "text-[#8696a0]"} />
);

const Typing = () => (
  <div className="relative w-fit rounded-lg rounded-tl-none bg-white px-3.5 py-3 shadow-[0_1px_0.5px_rgba(11,20,26,0.13)] before:absolute before:top-0 before:-left-2 before:border-t-[8px] before:border-l-[8px] before:border-t-white before:border-l-transparent">
    <span className="flex items-center gap-1" aria-label="Assistant is typing">
      {[0, 1, 2].map((i) => (
        <span key={i} className="h-2 w-2 rounded-full bg-[#8696a0] animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
      ))}
    </span>
  </div>
);

const ChatWidget = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState(() => store.get(KEY, []));
  const [typing, setTyping] = useState(false);
  const [draft, setDraft] = useState("");
  const [unread, setUnread] = useState(() => !store.get(SEEN, false));
  const listRef = useRef(null);
  const inputRef = useRef(null);
  const timers = useRef([]);

  const later = useCallback((fn, ms) => {
    const t = setTimeout(fn, ms);
    timers.current.push(t);
  }, []);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  useEffect(() => store.set(KEY, msgs.slice(-60)), [msgs]);
  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [msgs, typing, open]);

  const botSay = useCallback(
    (res, delay = 900) => {
      setTyping(true);
      later(() => {
        setTyping(false);
        setMsgs((m) => [...m, mk("bot", res.text, { links: res.links, chips: res.chips })]);
      }, delay);
    },
    [later],
  );

  const show = useCallback(() => {
    setOpen(true);
    setUnread(false);
    store.set(SEEN, true);
    if (msgs.length === 0 && !typing) {
      botSay({ text: "Hi! 👋 I'm the Primo Cloud assistant. I can answer questions about plans, billing and support, and point you to our team.", chips: MAIN_CHIPS }, 700);
    }
  }, [msgs.length, typing, botSay]);

  // open from anywhere on the site
  useEffect(() => {
    window.addEventListener("primo:chat-open", show);
    return () => window.removeEventListener("primo:chat-open", show);
  }, [show]);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // lock page scroll behind the full-screen mobile panel
  useEffect(() => {
    if (!open || window.innerWidth >= 640) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const send = (text) => {
    const t = text.trim();
    if (!t || typing) return;
    const me = mk("me", t, { status: "sent" });
    setMsgs((m) => [...m.map((x) => ({ ...x, chips: undefined })), me]);
    setDraft("");
    later(() => setMsgs((m) => m.map((x) => (x.id === me.id ? { ...x, status: "delivered" } : x))), 350);
    later(() => setMsgs((m) => m.map((x) => (x.id === me.id ? { ...x, status: "read" } : x))), 800);
    botSay(answer(t), 1300 + Math.min(t.length * 12, 900));
  };

  const go = (to) => {
    if (to.startsWith("/")) {
      setOpen(false);
      navigate(to);
    } else if (to.startsWith("http")) window.open(to, "_blank", "noopener");
    else window.location.assign(to);
  };

  const clear = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setTyping(false);
    setMsgs([]);
    store.set(KEY, []);
    // greet again
    later(() => botSay({ text: "Chat cleared. How can I help?", chips: MAIN_CHIPS }, 500), 50);
  };

  const lastBot = [...msgs].reverse().find((m) => m.from === "bot");

  return (
    <>
      {/* chat window */}
      <div
        role="dialog"
        aria-label="Chat with Primo Cloud"
        aria-hidden={!open}
        className={`fixed z-[70] flex flex-col overflow-hidden bg-[#efeae2] shadow-2xl transition-all duration-300 origin-bottom-right inset-0 sm:inset-auto sm:bottom-[4.5rem] sm:right-5 sm:w-[19.5rem] sm:h-[26rem] sm:max-h-[calc(100vh-6rem)] sm:rounded-2xl ${
          open ? "visible opacity-100 scale-100" : "invisible opacity-0 scale-90 pointer-events-none"
        }`}
      >
        {/* header */}
        <div className="flex items-center gap-2 bg-[#008069] px-2.5 py-2 text-white">
          <button type="button" aria-label="Close chat" onClick={() => setOpen(false)} className="sm:hidden -ml-1 flex h-8 w-8 items-center justify-center rounded-full hover:bg-white/10">
            <Icon n="arrow_back" size={24} />
          </button>
          <span className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white">
            <img src={logo} alt="" className="h-4 w-auto" />
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[#008069] bg-[#25d366]" />
          </span>
          <div className="min-w-0 flex-1 leading-tight">
            <div className="truncate text-[13.5px] font-semibold">Primo Cloud Assistant</div>
            <div className="text-[11px] text-white/80">{typing ? "typing…" : "online · automated"}</div>
          </div>
          {c.phoneHref && (
            <a href={c.phoneHref} aria-label="Call us" className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-white/10">
              <Icon n="call" size={18} />
            </a>
          )}
          <button type="button" aria-label="Clear chat" title="Clear chat" onClick={clear} className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-white/10">
            <Icon n="delete_sweep" size={18} />
          </button>
          <button type="button" aria-label="Close chat" onClick={() => setOpen(false)} className="hidden sm:flex h-8 w-8 items-center justify-center rounded-full hover:bg-white/10">
            <Icon n="close" size={18} />
          </button>
        </div>

        {/* messages on the WhatsApp wallpaper */}
        <div
          ref={listRef}
          className="flex-1 overflow-y-auto overscroll-contain px-2.5 py-2 [background-image:radial-gradient(rgba(11,20,26,0.055)_1px,transparent_1.2px)] [background-size:18px_18px]"
          aria-live="polite"
        >
          <div className="mx-auto mb-2 w-fit rounded-lg bg-white/90 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-[#54656f] shadow-sm">Today</div>
          <div className="mx-auto mb-2 max-w-[90%] rounded-lg bg-[#fff5c4] px-2.5 py-1 text-center text-[10.5px] leading-snug text-[#54656f] shadow-sm">
            This is an automated assistant. Tap “Talk to a human” any time to reach our team.
          </div>

          <div className="flex flex-col gap-1">
            {msgs.map((m, i) => {
              const mine = m.from === "me";
              const first = !msgs[i - 1] || msgs[i - 1].from !== m.from;
              return (
                <div key={m.id} className={`flex flex-col ${mine ? "items-end" : "items-start"} ${first ? "mt-2" : ""}`}>
                  <div
                    className={`relative max-w-[82%] rounded-lg px-2 pt-1 pb-0.5 text-[12.8px] leading-[17px] text-[#111b21] shadow-[0_1px_0.5px_rgba(11,20,26,0.13)] ${
                      mine ? "bg-[#d9fdd3]" : "bg-white"
                    } ${first ? (mine ? "rounded-tr-none before:absolute before:top-0 before:-right-2 before:border-t-[8px] before:border-r-[8px] before:border-t-[#d9fdd3] before:border-r-transparent" : "rounded-tl-none before:absolute before:top-0 before:-left-2 before:border-t-[8px] before:border-l-[8px] before:border-t-white before:border-l-transparent") : ""}`}
                  >
                    <span className="whitespace-pre-wrap break-words">{m.text}</span>
                    <span className="float-right ml-2 mt-1 flex items-center gap-0.5 text-[10px] leading-none text-[#667781]">
                      {hhmm(m.ts)}
                      {mine && <Ticks status={m.status} />}
                    </span>
                    <span className="clear-both block" />

                    {m.links?.length > 0 && (
                      <div className="-mx-2 mt-1 border-t border-black/10">
                        {m.links.map((l) => (
                          <button
                            key={l.label}
                            type="button"
                            onClick={() => go(l.to)}
                            className="flex w-full items-center justify-center gap-1 border-b border-black/10 px-2 py-1.5 text-[12.5px] font-medium text-[#027eb5] last:border-b-0 hover:bg-black/[0.03]"
                          >
                            <Icon n={l.to.startsWith("/") ? "arrow_outward" : l.to.startsWith("tel") ? "call" : "open_in_new"} size={14} />
                            {l.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* quick replies, only on the latest bot message */}
                  {m.chips?.length > 0 && m === lastBot && !typing && (
                    <div className="mt-1 flex max-w-[94%] flex-wrap gap-1">
                      {m.chips.map((ch) => (
                        <button
                          key={ch}
                          type="button"
                          onClick={() => send(ch)}
                          className="rounded-full border border-[#00a884]/40 bg-white px-2.5 py-1 text-[12px] font-medium text-[#008069] shadow-sm transition-colors hover:bg-[#d9fdd3]"
                        >
                          {ch}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            {typing && (
              <div className="mt-2">
                <Typing />
              </div>
            )}
          </div>
        </div>

        {/* input bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(draft);
          }}
          className="flex items-center gap-1.5 bg-[#f0f2f5] px-2 py-1.5"
        >
          <input
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            maxLength={300}
            placeholder="Type a message"
            aria-label="Type a message"
            className="h-9 min-w-0 flex-1 rounded-full border-0 bg-white px-3.5 text-[13.5px] text-[#111b21] outline-none placeholder:text-[#667781] focus:ring-2 focus:ring-[#00a884]/40"
          />
          <button
            type="submit"
            aria-label="Send message"
            disabled={!draft.trim() || typing}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#00a884] text-white transition-colors hover:bg-[#008069] disabled:opacity-50"
          >
            <Icon n="send" size={18} />
          </button>
        </form>
      </div>

      {/* launcher */}
      <button
        type="button"
        aria-label={open ? "Close chat" : "Chat with us"}
        onClick={() => (open ? setOpen(false) : show())}
        className={`fixed bottom-5 right-5 z-[70] flex h-12 w-12 items-center justify-center rounded-full bg-[#25d366] text-white shadow-lg shadow-[#25d366]/40 transition-transform duration-300 hover:scale-110 ${
          open ? "max-sm:hidden" : ""
        }`}
      >
        <Icon n={open ? "close" : "chat"} size={24} />
        {unread && !open && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#ff3b30] text-[10px] font-bold text-white ring-2 ring-white">1</span>
        )}
        {unread && !open && <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-[#25d366]/50" />}
      </button>
    </>
  );
};

class ChatBoundary extends React.Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error) {
    console.error("[Primo chat] widget crashed:", error);
    try {
      sessionStorage.removeItem(KEY); // drop saved messages in case they caused it
    } catch {
      /* storage blocked */
    }
  }
  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <a
        href={c.phoneHref}
        aria-label="Call us"
        className="fixed bottom-5 right-5 z-[70] flex h-12 w-12 items-center justify-center rounded-full bg-[#25d366] text-white shadow-lg"
      >
        <Icon n="call" size={24} />
      </a>
    );
  }
}

const SafeChatWidget = () => (
  <ChatBoundary>
    <ChatWidget />
  </ChatBoundary>
);

export default SafeChatWidget;