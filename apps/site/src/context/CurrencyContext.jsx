import React, { createContext, useContext, useEffect, useState } from "react";

// Prices on this site are written in USD. INR = USD × INR_RATE, the same rate the panel's
// catalogue was seeded with (apps/api/prisma/seed.ts), so the price shown is the price billed.
// If you change it, change USD_TO_INR there too.
export const INR_RATE = 88;
const Ctx = createContext(null);

// shared with the client area / order pages (apps/web/lib/currency.tsx)
const KEY = "primocloud_currency";
const guess = () => {
  try {
    return /Calcutta|Kolkata/.test(Intl.DateTimeFormat().resolvedOptions().timeZone ?? "") ? "INR" : "USD";
  } catch {
    return "USD";
  }
};
const read = () => {
  try {
    const v = localStorage.getItem(KEY);
    return v === "INR" || v === "USD" ? v : guess();
  } catch {
    return guess();
  }
};

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrencyState] = useState(read);
  const rate = INR_RATE;
  const live = false;

  const setCurrency = (c) => {
    const v = typeof c === "function" ? c(currency) : c;
    setCurrencyState(v);
    try {
      localStorage.setItem(KEY, v);
    } catch {
      /* storage unavailable */
    }
    window.dispatchEvent(new Event("cc-currency"));
  };

  // follow changes made elsewhere (another tab, or the panel's own switch on the same page)
  useEffect(() => {
    const sync = () => setCurrencyState(read());
    window.addEventListener("cc-currency", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("cc-currency", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  // Pass a USD amount (number or '$14.99'); returns a formatted string in the selected currency.
  const fmt = (usd) => {
    const n =
      typeof usd === "number"
        ? usd
        : parseFloat(String(usd).replace(/[^0-9.]/g, ""));
    return currency === "INR"
      ? new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: "INR",
          maximumFractionDigits: 0,
        }).format(n * rate)
      : new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(n);
  };

  return (
    <Ctx.Provider value={{ currency, setCurrency, rate, live, fmt }}>
      {children}
    </Ctx.Provider>
  );
};

export const useCurrency = () => useContext(Ctx);
