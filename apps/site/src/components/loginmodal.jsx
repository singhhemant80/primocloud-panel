import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { I } from "./kit";
import LoginForm from "./loginform";
import logo from "../assets/logo.png";
import { currentUser, CLIENT_URL } from "../lib/panel";

/*
  Login pop-up. Open it from anywhere with:
    window.dispatchEvent(new Event("primo:login-open"))
  (the top bar's "Get Started" and "Login" buttons do this). The full page is still at /login.
*/
const LoginModal = () => {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    // already signed in to the panel → straight to the client area
    const on = async () => {
      if (await currentUser()) window.location.assign(CLIENT_URL);
      else setOpen(true);
    };
    window.addEventListener("primo:login-open", on);
    return () => window.removeEventListener("primo:login-open", on);
  }, []);

  // close on route change (e.g. after following a link inside the pop-up)
  useEffect(() => {
    setOpen(false); // eslint-disable-line react-hooks/set-state-in-effect
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-start justify-center overflow-y-auto p-4 sm:items-center" role="dialog" aria-modal="true" aria-label="Sign in">
      <div className="fixed inset-0 bg-on-surface/50 backdrop-blur-sm" onClick={() => setOpen(false)} />
      <div className="relative my-auto w-full max-w-md overflow-hidden rounded-2xl border border-outline-variant bg-white shadow-2xl">
        <div className="flex items-center justify-between bg-gradient-to-r from-[#00391b] via-secondary to-primary-container px-space-md py-2.5">
          <span className="rounded-lg bg-white px-2.5 py-1.5"><img src={logo} alt="PRIMO CLOUD" className="h-6 w-auto" /></span>
          <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="flex h-9 w-9 items-center justify-center rounded-lg text-white hover:bg-white/15">
            <I n="close" c="text-[22px]" />
          </button>
        </div>
        <div className="p-space-md sm:p-space-lg">
          <LoginForm onClose={() => setOpen(false)} />
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
