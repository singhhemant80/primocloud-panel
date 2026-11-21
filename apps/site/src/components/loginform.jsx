import React, { useRef, useState } from "react";
import { I, L } from "./kit";
import { company as c } from "../data/company";
import { panelApi, afterLoginUrl } from "../lib/panel";

/*
  Sign-in form shared by the /login page and the login pop-up. It signs in against the PrimoCloud
  panel on this domain (POST /api/auth/login, then /api/auth/login/2fa when two-factor is on) and
  sends the customer to the client area. "Forgot password?" asks the panel to email a reset link.
*/

const input =
  "w-full h-10 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface px-4 font-body-md text-body-md transition-all placeholder:text-on-surface-variant/60 focus:outline-none focus:border-primary-container focus:ring-4 focus:ring-primary-container/15";

const Label = ({ htmlFor, children, right }) => (
  <div className="flex items-center justify-between mb-1.5">
    <label htmlFor={htmlFor} className="font-label-lg text-label-lg text-on-surface">{children}</label>
    {right}
  </div>
);

const LoginForm = ({ onClose }) => {
  const [mode, setMode] = useState("in"); // "in" | "reset" | "2fa"
  const [code, setCode] = useState("");
  const [challenge, setChallenge] = useState("");
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(true);
  const [caps, setCaps] = useState(false);
  const [errors, setErrors] = useState({});
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const formRef = useRef(null);

  const validate = () => {
    const e = {};
    if (!email.trim()) e.email = "Enter your email address.";
    else if (!/^\S+@\S+\.\S+$/.test(email.trim())) e.email = "That doesn't look like a valid email address.";
    if (mode === "in" && !password) e.password = "Enter your password.";
    if (mode === "2fa") {
      delete e.email;
      if (!/^\d{6}$/.test(code.trim())) e.code = "Enter the 6-digit code from your authenticator app.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    setNotice("");
    setSent(false);
    if (!validate()) return;
    setBusy(true);
    try {
      if (mode === "reset") {
        await panelApi("/auth/forgot-password", { email: email.trim() });
        setSent(true);
        setNotice("If an account exists for that email, we've sent a password reset link. Check your inbox (and spam folder).");
      } else if (mode === "2fa") {
        await panelApi("/auth/login/2fa", { challenge, code: code.trim() });
        window.location.assign(afterLoginUrl());
        return;
      } else {
        const r = await panelApi("/auth/login", { email: email.trim(), password, portal: "client" });
        if (r.twoFactorRequired) {
          setChallenge(r.challenge);
          setMode("2fa");
        } else {
          window.location.assign(afterLoginUrl());
          return;
        }
      }
    } catch (e) {
      if (mode === "2fa" && /expired/i.test(e.message)) setMode("in");
      setNotice(e.message);
    }
    setBusy(false);
  };

  const switchMode = (m) => {
    setMode(m);
    setErrors({});
    setNotice("");
    setSent(false);
    setCode("");
  };
  const tfa = mode === "2fa";

  const reset = mode === "reset";

  return (
    <div>
            <div className="mb-space-md">
              <h1 className="font-headline-md text-headline-md font-bold text-on-surface tracking-tight">{tfa ? "Two-step verification" : reset ? "Reset your password" : "Sign in to your account"}</h1>
              <p className="mt-1 font-body-md text-body-md text-on-surface-variant">
                {tfa ? "Enter the 6-digit code from your authenticator app." : reset ? "Enter the email address on your account and we'll send you a reset link." : "Use the email and password you registered with."}
              </p>
            </div>

            {notice && (
              <div role="alert" className={`mb-space-md flex items-start gap-2.5 rounded-lg border p-3 font-body-sm text-[13px] ${sent ? "border-primary-container/40 bg-primary-container/10 text-on-surface" : "border-[#f59e0b]/40 bg-[#fff7e0] text-[#7a4b00]"}`}>
                <I n={sent ? "mark_email_read" : "info"} c="text-[20px] shrink-0" />
                <span>{notice}</span>
              </div>
            )}

            <form
              ref={formRef}
              onSubmit={submit}
              noValidate
              className="flex flex-col gap-space-sm"
            >
              {tfa && (
                <div>
                  <Label htmlFor="lg-code">Authentication code</Label>
                  <input
                    id="lg-code"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    autoFocus
                    maxLength={6}
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                    aria-invalid={!!errors.code}
                    placeholder="123456"
                    className={`${input} tracking-[0.4em] ${errors.code ? "!border-error" : ""}`}
                  />
                  {errors.code && <p className="mt-1 font-body-sm text-[12px] text-error">{errors.code}</p>}
                </div>
              )}

              {!tfa && <div>
                <Label htmlFor="lg-email">Email address</Label>
                <input
                  id="lg-email"
                  name={reset ? "email" : "username"}
                  type="email"
                  autoComplete="email"
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "lg-email-err" : undefined}
                  placeholder="you@company.com"
                  className={`${input} ${errors.email ? "!border-error" : ""}`}
                />
                {errors.email && <p id="lg-email-err" className="mt-1 font-body-sm text-[12px] text-error">{errors.email}</p>}
              </div>}

              {mode === "in" && (
                <div>
                  <Label
                    htmlFor="lg-pass"
                    right={<button type="button" onClick={() => switchMode("reset")} className="font-label-md text-label-md font-semibold text-primary hover:underline">Forgot password?</button>}
                  >
                    Password
                  </Label>
                  <div className="relative">
                    <input
                      id="lg-pass"
                      name="password"
                      type={show ? "text" : "password"}
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyUp={(e) => setCaps(e.getModifierState?.("CapsLock") ?? false)}
                      aria-invalid={!!errors.password}
                      aria-describedby={errors.password ? "lg-pass-err" : undefined}
                      placeholder="Your password"
                      className={`${input} pr-12 ${errors.password ? "!border-error" : ""}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShow((s) => !s)}
                      aria-label={show ? "Hide password" : "Show password"}
                      className="absolute right-1.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-md text-on-surface-variant hover:bg-surface-container hover:text-primary"
                    >
                      <I n={show ? "visibility_off" : "visibility"} c="text-[22px]" />
                    </button>
                  </div>
                  {caps && <p className="mt-1 flex items-center gap-1 font-body-sm text-[12px] text-[#b45309]"><I n="keyboard_capslock" c="text-[16px]" />Caps Lock is on</p>}
                  {errors.password && <p id="lg-pass-err" className="mt-1 font-body-sm text-[12px] text-error">{errors.password}</p>}
                </div>
              )}

              {mode === "in" && (
                <label className="flex cursor-pointer items-center gap-2.5 font-body-md text-body-md text-on-surface-variant">
                  <input type="checkbox" name="rememberme" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="h-4 w-4 rounded accent-primary-container" />
                  Keep me signed in on this device
                </label>
              )}

              <button
                type="submit"
                disabled={busy}
                className="group relative inline-flex h-11 items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-primary-container to-secondary px-6 font-label-lg text-label-lg font-bold text-on-primary shadow-md shadow-primary-container/30 transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60 before:absolute before:inset-y-0 before:-left-full before:w-1/2 before:skew-x-[-20deg] before:bg-white/30 hover:before:left-[150%] before:transition-all before:duration-700"
              >
                {busy ? "Please wait…" : reset ? "Send reset link" : tfa ? "Verify and sign in" : "Sign in"}
                <I n={reset ? "mail" : tfa ? "verified_user" : "arrow_forward"} c="text-[20px]" />
              </button>
            </form>

            <div className="mt-space-md flex flex-col gap-1 border-t border-outline-variant/60 pt-space-sm font-body-md text-body-md text-on-surface-variant">
              {reset || tfa ? (
                <button type="button" onClick={() => switchMode("in")} className="inline-flex w-fit items-center gap-1 font-semibold text-primary hover:underline">
                  <I n="arrow_back" c="text-[18px]" />Back to sign in
                </button>
              ) : (
                <p>
                  New to Primo Cloud?{" "}
                  <a href={c.registerUrl} className="font-semibold text-primary hover:underline">Create an account</a>
                </p>
              )}
            </div>

            <p className="mt-space-sm flex items-center gap-1.5 font-body-sm text-[12px] text-on-surface-variant">
              <I n="lock" c="text-[14px] text-primary-container" />Your connection is encrypted. We never ask for your password by email or chat.
            </p>
    </div>
  );
};

export default LoginForm;
