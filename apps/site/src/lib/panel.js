// Bridge between the website and the PrimoCloud panel (same domain: /client, /order, /api).

export const CLIENT_URL = "/client";
export const REGISTER_URL = "/client/register";

const HEADERS = { "Content-Type": "application/json", "X-Requested-With": "primocloud" };

/** JSON call to the panel API. Throws Error(message) on a non-2xx answer. */
export async function panelApi(path, body) {
  const res = await fetch(`/api${path}`, {
    method: body === undefined ? "GET" : "POST",
    credentials: "include",
    headers: HEADERS,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  let data = {};
  try {
    data = await res.json();
  } catch {
    /* empty body */
  }
  if (!res.ok) {
    const e = new Error(data.error || (res.status === 429 ? "Too many attempts. Please wait a few minutes and try again." : "Something went wrong. Please try again."));
    e.status = res.status;
    throw e;
  }
  return data;
}

/** The signed-in customer, or null. Refreshes an expired access cookie once. */
export async function currentUser() {
  try {
    return (await panelApi("/auth/me")).user ?? null;
  } catch (e) {
    if (e.status !== 401) return null;
    try {
      await panelApi("/auth/refresh", {});
      return (await panelApi("/auth/me")).user ?? null;
    } catch {
      return null;
    }
  }
}

/** Where to go after signing in: ?next=/client/... when it is a panel path, else the client area. */
export function afterLoginUrl() {
  try {
    const next = new URLSearchParams(window.location.search).get("next") || "";
    if (/^\/(client|order)(\/|$|\?)/.test(next)) return next;
  } catch {
    /* no window */
  }
  return CLIENT_URL;
}

/**
 * Order link for a plan. `slug` is the product slug in the panel (prisma/seed.ts).
 * `yearly` pre-selects annual billing when the page's yearly toggle is on.
 */
export function orderUrl(slug, yearly = false) {
  if (!slug) return "/contact";
  return `/order/configure?product=${encodeURIComponent(slug)}${yearly ? "&cycle=ANNUAL" : ""}`;
}
