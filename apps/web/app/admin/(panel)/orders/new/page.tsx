"use client";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api, CYCLES, money } from "@/lib/api";
import { Alert, Button, Card, Field, Icon, Input, Loading, PageHeader, Select, Textarea, Toggle, cx, toast, useApi } from "@/components/ui";
import { OsLogo } from "@/components/os-logo";
import { PasswordField, passwordProblem } from "@/components/password-field";

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <NewOrder />
    </Suspense>
  );
}

type Line = { key: number; productId: string; cycle: string; qty: number; os: string; hostname: string; password: string };
let nextKey = 1;
const blank = (): Line => ({ key: nextKey++, productId: "", cycle: "", qty: 1, os: "", hostname: "", password: "" });
const HOSTNAME = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$/i;

/**
 * Staff place an order for a customer — same checkout as the shop: one or several plans in one order
 * (one invoice), an optional promo code and root password, optionally marked paid.
 */
function NewOrder() {
  const router = useRouter();
  const sp = useSearchParams();
  const { data: pd, loading } = useApi<{ products: any[] }>("/admin/products");
  const [q, setQ] = useState("");
  const [found, setFound] = useState<any[]>([]);
  const [client, setClient] = useState<any>(null);
  const [lines, setLines] = useState<Line[]>(() => [blank()]);
  const [markPaid, setMarkPaid] = useState(false);
  const [reference, setReference] = useState("");
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const [promo, setPromo] = useState("");
  const [promoOpts, setPromoOpts] = useState<any[] | null>(null);

  // preselect a customer when opened from their page (?client=<id>)
  useEffect(() => {
    const id = sp.get("client");
    if (id) api(`/admin/clients/${id}`).then((r) => setClient(r.client ?? r.user ?? r)).catch(() => {});
  }, [sp]);
  useEffect(() => {
    if (q.trim().length < 2) return setFound([]);
    const t = setTimeout(() => api(`/admin/clients?q=${encodeURIComponent(q.trim())}&pageSize=8`).then((r) => setFound(r.clients ?? [])).catch(() => {}), 250);
    return () => clearTimeout(t);
  }, [q]);

  const products = (pd?.products ?? []).filter((p: any) => p.enabled);
  const productOf = (l: Line) => products.find((x: any) => x.id === l.productId);
  const isVpsP = (p: any) => p && (p.provisioner === "PROXMOX" || p.provisioner === "VIRTUALIZOR");
  const isHostingP = (p: any) => p && (["SHARED", "RESELLER_HOSTING", "WORDPRESS"].includes(p.type) || p.provisioner === "CPANEL");
  const cyclesOf = (p: any) => (p?.pricing ?? []).filter((x: any) => x.currency === "INR" && x.enabled);
  const osesOf = (p: any) => (p?.osTemplates ?? []).map((x: any) => x.osTemplate).filter((o: any) => o.enabled);
  const ready = lines.filter((l) => l.productId && l.cycle);
  // the plan list in shop order: each group under its own heading (group order, then cheapest first);
  // plans hidden from the shop (old / retired) last, so they're still there for existing customers
  const monthly = (p: any) => {
    const c = cyclesOf(p);
    return Number((c.find((x: any) => x.cycle === "MONTHLY") ?? c[0])?.price ?? Number.MAX_SAFE_INTEGER);
  };
  const byPlan = (a: any, b: any) => monthly(a) - monthly(b) || (a.sortOrder ?? 0) - (b.sortOrder ?? 0) || String(a.name).localeCompare(String(b.name), undefined, { numeric: true });
  const planGroups: { label: string; items: any[] }[] = [];
  {
    const shown = products.filter((p: any) => !p.hidden && !p.group?.hidden);
    const groups = new Map<string, { label: string; order: number; items: any[] }>();
    for (const p of shown) {
      const k = p.group?.id ?? "-";
      if (!groups.has(k)) groups.set(k, { label: p.group?.name ?? "Other", order: p.group?.sortOrder ?? 0, items: [] });
      groups.get(k)!.items.push(p);
    }
    for (const g of [...groups.values()].sort((a, b) => a.order - b.order || a.label.localeCompare(b.label))) planGroups.push({ label: g.label, items: g.items.sort(byPlan) });
    const old = products.filter((p: any) => p.hidden || p.group?.hidden).sort((a: any, b: any) => String(a.group?.name).localeCompare(String(b.group?.name)) || byPlan(a, b));
    if (old.length) planGroups.push({ label: "Hidden from the shop (old plans)", items: old });
  }

  const update = (key: number, patch: Partial<Line>) => setLines((ls) => ls.map((l) => (l.key === key ? { ...l, ...patch } : l)));
  const choosePlan = (key: number, productId: string) => {
    const p = products.find((x: any) => x.id === productId);
    const cycles = cyclesOf(p);
    update(key, { productId, cycle: cycles.find((c: any) => c.cycle === "MONTHLY")?.cycle ?? cycles[0]?.cycle ?? "", os: osesOf(p)[0]?.id ?? "" });
  };

  // promo codes that apply to this customer + the order's items (checked with the checkout's own pricing)
  const promoKey = JSON.stringify([client?.id ?? null, ready.map((l) => [l.productId, l.cycle, l.qty])]);
  useEffect(() => {
    setPromoOpts(null);
    if (!ready.length) return;
    const t = setTimeout(
      () =>
        api("/admin/orders/promo-options", { body: { userId: client?.id ?? null, items: ready.map((l) => ({ productId: l.productId, cycle: l.cycle, quantity: l.qty })) } })
          .then((r) => {
            setPromoOpts(r.options ?? []);
            setPromo((cur) => (cur && !(r.options ?? []).some((o: any) => o.code === cur && o.applicable) ? "" : cur));
          })
          .catch(() => setPromoOpts([])),
      250,
    );
    return () => clearTimeout(t);
  }, [promoKey]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) return <Loading />;

  async function submit() {
    if (!client) return toast.error("Choose the customer");
    if (!ready.length || ready.length !== lines.length) return toast.error(lines.length > 1 ? "Choose a plan and billing cycle for every item (or remove the empty one)" : "Choose a plan and billing cycle");
    for (const [n, l] of lines.entries()) {
      const p = productOf(l);
      const which = lines.length > 1 ? `Item ${n + 1}: ` : "";
      if (isVpsP(p) && p.requireHostname && !HOSTNAME.test(l.hostname)) return toast.error(`${which}enter a hostname like server1.example.com`);
      if (isHostingP(p) && !HOSTNAME.test(l.hostname)) return toast.error(`${which}enter the domain for ${p.name} (e.g. example.com)`);
      if (isHostingP(p) && l.qty > 1) return toast.error(`${which}order ${p.name} once per domain — add another plan for a second domain`);
      const pw = isVpsP(p) ? passwordProblem(l.password) : null;
      if (pw) return toast.error(`${which}root password: ${pw}`);
    }
    setBusy(true);
    try {
      const r = await api("/admin/orders", {
        body: {
          userId: client.id,
          items: lines.map((l) => {
            const vps = isVpsP(productOf(l));
            return { productId: l.productId, cycle: l.cycle, osTemplateId: vps ? l.os || null : null, hostname: l.hostname || null, rootPassword: vps ? l.password || null : null, quantity: l.qty, config: {}, addonIds: [] };
          }),
          domains: [],
          promoCode: promo || null,
          notes: notes || undefined,
          markPaid,
          paymentReference: reference || undefined,
        },
      });
      toast.success(`Order ${r.orderNumber} created${r.paid ? " and paid — setup has started" : " — invoice sent"}`);
      router.push(`/admin/orders/${r.orderId}`);
    } catch (e: any) {
      toast.error(e.message);
      setBusy(false);
    }
  }

  const priceOf = (l: Line) => cyclesOf(productOf(l)).find((c: any) => c.cycle === l.cycle);
  const subtotal = lines.reduce((t, l) => t + (priceOf(l)?.price ?? 0) * l.qty, 0);
  const chosenPromo = promoOpts?.find((x) => x.code === promo && x.applicable);
  const anyVps = lines.some((l) => isVpsP(productOf(l)));
  return (
    <>
      <PageHeader back="/admin/orders" title="New order" subtitle="Place an order for a customer — one plan or several in one invoice. It goes through the normal checkout: invoice, tax, emails and automatic setup." />
      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="space-y-5">
          <Card title="1 · Customer">
            {client ? (
              <div className="flex items-center justify-between gap-3 rounded-xl bg-primary-tint px-4 py-3 ring-1 ring-[#c9f5da]">
                <div><div className="font-bold text-ink">{[client.firstName, client.lastName].filter(Boolean).join(" ") || client.email}</div><div className="text-xs text-mute">{client.email}</div></div>
                <Button size="sm" variant="ghost" onClick={() => setClient(null)}>Change</Button>
              </div>
            ) : (
              <>
                <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name, email or GSTIN" autoFocus />
                {found.length > 0 && (
                  <div className="mt-2 divide-y divide-line overflow-hidden rounded-xl border border-line">
                    {found.map((c) => (
                      <button key={c.id} type="button" onClick={() => { setClient(c); setQ(""); setFound([]); }} className="flex w-full items-center justify-between px-4 py-2.5 text-left hover:bg-[#f6fbf8]">
                        <span><b className="text-sm text-ink">{[c.firstName, c.lastName].filter(Boolean).join(" ") || "—"}</b><span className="ml-2 text-xs text-mute">{c.email}</span></span>
                        <Icon name="chevron_right" className="text-mute" />
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </Card>

          {lines.map((l, n) => {
            const p = productOf(l);
            const vps = isVpsP(p);
            const cycles = cyclesOf(p);
            const oses = osesOf(p);
            const os = oses.find((o: any) => o.id === l.os);
            return (
              <Card
                key={l.key}
                title={lines.length > 1 ? `2 · Plan ${n + 1} of ${lines.length}` : "2 · Plan"}
                action={lines.length > 1 ? <Button size="sm" variant="ghost" icon="delete" onClick={() => setLines((ls) => ls.filter((x) => x.key !== l.key))}>Remove</Button> : undefined}
              >
                <div className="grid gap-4 sm:grid-cols-[1fr_200px_110px]">
                  <Field label="Plan">
                    <Select value={l.productId} onChange={(e) => choosePlan(l.key, e.target.value)}>
                      <option value="">Choose…</option>
                      {planGroups.map((g) => (
                        <optgroup key={g.label} label={g.label}>
                          {g.items.map((x: any) => {
                            const m = monthly(x);
                            return <option key={x.id} value={x.id}>{x.name}{m < Number.MAX_SAFE_INTEGER ? ` — ${money(m, "INR")}/mo` : ""}{g.label.startsWith("Hidden") && x.group?.name ? ` · ${x.group.name}` : ""}</option>;
                          })}
                        </optgroup>
                      ))}
                    </Select>
                  </Field>
                  <Field label="Billing cycle">
                    <Select value={l.cycle} onChange={(e) => update(l.key, { cycle: e.target.value })} disabled={!p}>
                      {cycles.map((c: any) => <option key={c.cycle} value={c.cycle}>{CYCLES[c.cycle] ?? c.cycle} — {money(c.price, "INR")}</option>)}
                    </Select>
                  </Field>
                  <Field label="Quantity"><Input type="number" min={1} max={10} value={l.qty} onChange={(e) => update(l.key, { qty: Math.max(1, Math.min(10, Number(e.target.value) || 1)) })} /></Field>
                </div>
                {isHostingP(p) && (
                  <Field label="Domain" className="mt-4 max-w-md"><Input value={l.hostname} onChange={(e) => update(l.key, { hostname: e.target.value.toLowerCase().trim() })} placeholder="example.com" /></Field>
                )}
                {vps && (
                  <div className="mt-4 border-t border-line pt-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field label="Hostname"><Input value={l.hostname} onChange={(e) => update(l.key, { hostname: e.target.value.toLowerCase().trim() })} placeholder="server1.example.com" /></Field>
                      <Field label="Operating system">
                        <Select value={l.os} onChange={(e) => update(l.key, { os: e.target.value })}>{oses.map((o: any) => <option key={o.id} value={o.id}>{o.name}</option>)}</Select>
                      </Field>
                    </div>
                    {os && <div className="mt-2 flex items-center gap-2 text-xs text-mute"><OsLogo os={os} size={20} />{os.name}</div>}
                    <div className="mt-4">
                      <div className="mb-1.5 text-sm font-bold text-ink">Root password{l.qty > 1 ? ` (used for all ${l.qty} servers)` : ""}</div>
                      <PasswordField value={l.password} onChange={(v) => update(l.key, { password: v })} optionalHint="Leave empty to generate one — it's emailed to the customer when the server is ready" />
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
          <button
            type="button"
            onClick={() => setLines((ls) => [...ls, blank()])}
            disabled={lines.length >= 20}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-primary/40 bg-primary-tint/60 py-3.5 text-sm font-extrabold text-primary-dark transition hover:border-primary hover:bg-primary-soft disabled:opacity-50"
          >
            <Icon name="add_circle" className="text-[20px]" />
            Add another plan to this order
          </button>

          <Card title="3 · Promo code & payment">
            <Field label="Promo code" className="max-w-xl">
              <Select value={promo} onChange={(e) => setPromo(e.target.value)} disabled={!ready.length || promoOpts === null}>
                <option value="">{!ready.length ? "Choose a plan first" : promoOpts === null ? "Checking promo codes…" : promoOpts.some((o) => o.applicable) ? "No promo code" : promoOpts.length ? "No promo code applies to this order" : "No promo codes set up"}</option>
                {(promoOpts ?? []).map((o) => (
                  <option key={o.code} value={o.code} disabled={!o.applicable}>
                    {o.code} — {o.label}
                    {o.applicable ? ` · saves ${money(o.discount, o.currency)}${o.recurring ? " every renewal" : " on the first payment"}` : ` · ${o.reason}`}
                    {o.newOnly ? " · new customers" : ""}
                    {o.usesLeft != null ? ` · ${o.usesLeft} left` : ""}
                  </option>
                ))}
              </Select>
            </Field>
            {!client && promoOpts?.some((o) => o.newOnly) && <p className="mt-1.5 text-xs text-mute">Codes for new customers are checked against the customer once you choose one.</p>}
            <div className="mt-5 border-t border-line pt-4">
              <Toggle checked={markPaid} onChange={setMarkPaid} label="Mark the invoice as paid now (payment received offline) — setup starts right away" />
              {markPaid && <Field label="Payment reference (optional)" className="mt-3 max-w-sm"><Input value={reference} onChange={(e) => setReference(e.target.value)} placeholder="UTR / cheque no." /></Field>}
              {!markPaid && <p className="mt-2 text-xs text-mute">The customer gets one invoice for the whole order by email; setup starts when it's paid.</p>}
            </div>
            <Field label="Note on the order (optional)" className="mt-4"><Textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} /></Field>
          </Card>
        </div>

        <aside>
          <Card title="Summary" className="xl:sticky xl:top-24">
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between gap-3"><dt className="text-mute">Customer</dt><dd className="truncate text-right font-semibold">{client?.email ?? "—"}</dd></div>
              {lines.map((l, n) => {
                const p = productOf(l);
                const pr = priceOf(l);
                return (
                  <div key={l.key} className="flex justify-between gap-3">
                    <dt className="min-w-0 text-mute"><span className="block truncate">{p ? `${p.name}${l.qty > 1 ? ` × ${l.qty}` : ""}` : lines.length > 1 ? `Plan ${n + 1} — not chosen` : "Plan"}</span>{pr && <span className="text-[11px]">{CYCLES[l.cycle] ?? l.cycle}</span>}</dt>
                    <dd className="shrink-0 text-right font-semibold">{pr ? money(pr.price * l.qty, "INR") : "—"}</dd>
                  </div>
                );
              })}
              {ready.length > 0 && (
                <div className="flex justify-between gap-3 border-t border-line pt-2"><dt className="text-mute">Subtotal</dt><dd className="text-right font-semibold">{money(subtotal, "INR")}</dd></div>
              )}
              {chosenPromo && (
                <>
                  <div className="flex justify-between gap-3 text-emerald-700"><dt>Promo {chosenPromo.code}</dt><dd className="text-right font-semibold">−{money(chosenPromo.discount, chosenPromo.currency)}</dd></div>
                  <div className="flex justify-between gap-3 border-t border-line pt-2"><dt className="font-bold text-ink">First payment</dt><dd className="text-right font-extrabold text-ink">{money(chosenPromo.total, chosenPromo.currency)} <span className="text-xs font-semibold text-mute">+ tax</span></dd></div>
                  <p className="text-xs text-mute">{chosenPromo.recurring ? "The discount also applies to every renewal." : "Renewals are at the normal price."}</p>
                </>
              )}
              {anyVps && <div className="flex justify-between gap-3"><dt className="text-mute">Root password</dt><dd className={cx("text-right font-semibold", lines.every((l) => !isVpsP(productOf(l)) || l.password) ? "text-emerald-700" : "text-mute")}>{lines.every((l) => !isVpsP(productOf(l)) || l.password) ? "Set by staff" : "Generated where empty"}</dd></div>}
            </dl>
            <p className="mt-3 text-xs text-mute">Tax and the final total are worked out by the invoice, as in the shop.</p>
            <Button className="mt-4 w-full" icon="shopping_cart_checkout" loading={busy} onClick={submit}>{lines.length > 1 ? `Create order (${lines.length} plans)` : "Create order"}</Button>
            {!client && <Alert className="mt-3" tone="info">Choose a customer first.</Alert>}
          </Card>
        </aside>
      </div>
    </>
  );
}
