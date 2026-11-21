import React, { useEffect, useLayoutEffect, useRef, useState } from "react";

const prefersReduced = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * One hook for the whole page. Pass a ref to the element whose direct children are the <section>s.
 *  - Hero: tagged `.pc-hero` (compact spacing + parallax orbs, see index.css) and its blocks
 *    rise in with a stagger on load - works for centred AND two-column heroes
 *  - Other sections: headings / grid items fade up with a stagger as they scroll into view
 *
 * Pointer effects (card tilt + glare, magnetic buttons, cursor glow) live in fx.jsx.
 */
export function useMotion(rootRef) {
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const cleanups = [];

    const hero = root.querySelector(":scope > section");
    if (hero) {
      // Always tag the hero (even for reduced motion) so it gets the compact layout.
      hero.classList.add("pc-hero");
      cleanups.push(() => hero.classList.remove("pc-hero"));
    }
    if (prefersReduced()) return () => cleanups.forEach((fn) => fn());

    // Hero entrance: find the logical blocks (badge, title, text, buttons, stats, mockup...)
    if (hero) {
      const inner = [...hero.children].find(
        (c) => !/(^|\s)absolute(\s|$)/.test(c.className),
      );
      if (inner) {
        let holder = inner;
        while (holder.children.length === 1) holder = holder.children[0];
        let blocks = [...holder.children];
        // two-column hero: stagger the text column, then bring the mockup column in
        if (/grid-cols/.test(holder.className) && blocks.length >= 2) {
          blocks = [...blocks[0].children, ...blocks.slice(1)];
        }
        blocks.forEach((el, i) => {
          el.style.animation = `pc-rise .85s cubic-bezier(.2,.7,.2,1) ${120 + i * 90}ms both`;
          const done = () => (el.style.animation = ""); // hand `animation` back to the page's own classes (e.g. animate-float)
          el.addEventListener("animationend", done, { once: true });
        });
        cleanups.push(() => blocks.forEach((el) => (el.style.animation = "")));
      }
    }

    // Scroll reveal (skip hero)
    const targets = [];
    [...root.querySelectorAll(":scope > section")].slice(1).forEach((s) => {
      s.querySelectorAll(":scope > div > *").forEach((c) => {
        const kids = c.classList.contains("grid") ? [...c.children] : [c];
        kids.forEach((k, i) => targets.push([k, Math.min(i, 8) * 70]));
      });
    });
    const timers = [];
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const el = e.target;
          io.unobserve(el);
          el.classList.add("in");
          // remove helper classes afterwards so hover styles/transitions go back to normal
          timers.push(
            setTimeout(
              () => el.classList.remove("reveal", "in"),
              900 + Number(el.dataset.d || 0),
            ),
          );
        }),
      { threshold: 0.1, rootMargin: "0px 0px -5% 0px" },
    );
    targets.forEach(([el, d]) => {
      el.classList.add("reveal");
      el.dataset.d = d;
      el.style.setProperty("--d", `${d}ms`);
      io.observe(el);
    });
    cleanups.push(() => {
      io.disconnect();
      timers.forEach(clearTimeout);
      targets.forEach(([el]) => {
        el.classList.remove("reveal", "in");
        el.style.removeProperty("--d");
      });
    });

    return () => cleanups.forEach((fn) => fn());
  }, [rootRef]);
}

/** Animates numbers like "99.99%", "10K+", "<60s" when scrolled into view. Leaves "24/7" alone. */
export const CountUp = ({ value, duration = 1400 }) => {
  const ref = useRef(null);
  const [text, setText] = useState(value);

  useEffect(() => {
    const m = /^(<?)(\d+(?:\.\d+)?)(.*)$/.exec(value);
    if (!m || value.includes("/") || prefersReduced()) return;
    const dec = (m[2].split(".")[1] || "").length;
    const end = parseFloat(m[2]);
    let raf;
    setText(m[1] + (0).toFixed(dec) + m[3]);
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const t0 = performance.now();
        const tick = (now) => {
          const p = Math.min((now - t0) / duration, 1);
          setText(m[1] + (end * (1 - Math.pow(1 - p, 3))).toFixed(dec) + m[3]);
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.5 },
    );
    io.observe(ref.current);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, duration]);

  return <span ref={ref}>{text}</span>;
};
