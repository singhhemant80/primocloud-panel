import { useEffect, useRef } from "react";

/**
 * Page-wide visual effects. Mounted ONCE in App (outside <Routes>) so the
 * background never resets when you navigate between pages.
 *
 *  - Aurora: soft drifting colour blobs that parallax with the mouse
 *  - Particle network: nodes that drift, link up, and are drawn toward the cursor
 *  - Cursor glow + trailing ring (mouse devices only)
 *  - Glass-card 3D tilt + moving glare, magnetic CTA buttons, click ripple
 *  - Hero parallax (hero orbs follow the mouse)
 *
 * Everything is disabled for `prefers-reduced-motion`; mouse-only effects are
 * skipped on touch devices.
 */

const mq = (q) => window.matchMedia(q).matches;

// Glass cards that get tilt + glare (JS only enhances ones of a "card-like" size)
const CARD_SEL =
  'main :is(div,article,li,aside)[class*="bg-surface-container-lowest"][class*="rounded"],' +
  'main :is(div,article,li,aside)[class*="hover:border-primary-container"],' +
  "#vps-plans .grid > div";
// Primary gradient call-to-action buttons
const MAG_SEL =
  'a[class*="from-primary-container"][class*="to-secondary"],' +
  'button[class*="from-primary-container"][class*="to-secondary"]';
const LINK_SEL =
  'a,button,[role="button"],summary,label,select,input,[class*="cursor-pointer"]';

const fits = (el) => {
  const r = el.getBoundingClientRect();
  return r.width >= 150 && r.width <= 640 && r.height >= 90 && r.height <= 620;
};

export function BackgroundFX() {
  const auroraRef = useRef(null);
  const canvasRef = useRef(null);
  const glowRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const reduced = mq("(prefers-reduced-motion: reduce)");
    const hasMouse = mq("(hover: hover) and (pointer: fine)");
    const aurora = auroraRef.current;
    const canvas = canvasRef.current;
    const glow = glowRef.current;
    const ring = ringRef.current;
    const ctx = canvas.getContext("2d");
    const cleanups = [];

    const mouse = {
      x: -9999,
      y: -9999,
      gx: window.innerWidth / 2,
      gy: window.innerHeight / 3,
      rx: -100,
      ry: -100,
      active: false,
      link: false,
    };

    /* ---------------- particle network ---------------- */
    let w = 0,
      h = 0,
      parts = [];
    const LINK = 125;
    const PULL = 175;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round(Math.min(w < 700 ? 26 : 48, Math.max(22, (w * h) / 30000)));
      parts = Array.from({ length: n }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: 1 + Math.random() * 1.6,
      }));
    };

    const drawParticles = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of parts) {
        if (mouse.active) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const d = Math.hypot(dx, dy);
          if (d < PULL && d > 1) {
            // gentle attraction, soft repulsion when too close -> nodes orbit the cursor
            const f = d < 55 ? -0.05 : (1 - d / PULL) * 0.018;
            p.vx += (dx / d) * f;
            p.vy += (dy / d) * f;
          }
        }
        p.vx *= 0.985;
        p.vy *= 0.985;
        const sp = Math.hypot(p.vx, p.vy);
        if (sp < 0.12) {
          p.vx += (Math.random() - 0.5) * 0.02;
          p.vy += (Math.random() - 0.5) * 0.02;
        }
        if (sp > 1.4) {
          p.vx *= 1.4 / sp;
          p.vy *= 1.4 / sp;
        }
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -20) p.x = w + 20;
        else if (p.x > w + 20) p.x = -20;
        if (p.y < -20) p.y = h + 20;
        else if (p.y > h + 20) p.y = -20;
      }

      ctx.lineWidth = 1;
      for (let i = 0; i < parts.length; i++) {
        const a = parts[i];
        for (let j = i + 1; j < parts.length; j++) {
          const b = parts[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < LINK) {
            ctx.strokeStyle = `rgba(11,175,96,${((1 - d / LINK) * 0.2).toFixed(3)})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
        if (mouse.active) {
          const d = Math.hypot(a.x - mouse.x, a.y - mouse.y);
          if (d < PULL) {
            ctx.strokeStyle = `rgba(0,150,100,${((1 - d / PULL) * 0.38).toFixed(3)})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }
      }
      ctx.fillStyle = "rgba(0,140,80,.55)";
      for (const p of parts) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    /* ---------------- hero parallax ---------------- */
    let heroEl = null;
    let heroOrbs = [];
    const syncHero = () => {
      const el = document.querySelector(".pc-hero");
      if (el === heroEl) return;
      heroOrbs.forEach((o) => (o.style.translate = ""));
      heroEl = el;
      heroOrbs = el
        ? [...el.children].filter(
            (c) =>
              c.classList.contains("pointer-events-none") &&
              c.classList.contains("absolute") &&
              !c.className.includes("inset-0"),
          )
        : [];
      heroOrbs.forEach((o, i) => {
        o.style.transition = "translate .9s cubic-bezier(.2,.7,.2,1)";
        o.dataset.k = i % 2 ? "-34" : "28";
      });
    };

    /* ---------------- main loop ---------------- */
    let raf = 0;
    let frameNo = 0;
    let running = true;

    // Performance guard: if the page can't hold ~24fps right after load, switch to "lite glass"
    // (tinted glass without live blur, no particles). Set localStorage 'pc-fx' = 'full' to opt out.
    const html = document.documentElement;
    const mon = { t0: 0, frames: 0, done: false };
    try {
      if (localStorage.getItem("pc-fx") === "full") mon.done = true;
    } catch {
      /* storage unavailable */
    }
    const watchFps = (now) => {
      if (mon.done) return;
      if (!mon.t0) mon.t0 = now + 1500; // warm-up: ignore image decoding / first paint
      if (now < mon.t0) return;
      mon.frames++;
      if (now - mon.t0 >= 2200) {
        mon.done = true;
        if (mon.frames / ((now - mon.t0) / 1000) < 24) html.classList.add("pc-lite");
      }
    };

    const tick = (now) => {
      if (!running) return;
      watchFps(now);
      frameNo++;
      if (!reduced && frameNo % 2 === 0 && !html.classList.contains("pc-lite")) drawParticles(); // ~30fps is plenty for slow drifting dots

      if (hasMouse) {
        mouse.gx += (mouse.x - mouse.gx) * 0.08;
        mouse.gy += (mouse.y - mouse.gy) * 0.08;
        mouse.rx += (mouse.x - mouse.rx) * 0.2;
        mouse.ry += (mouse.y - mouse.ry) * 0.2;
        glow.style.transform = `translate3d(${mouse.gx}px,${mouse.gy}px,0)`;
        ring.style.transform = `translate3d(${mouse.rx}px,${mouse.ry}px,0) scale(${mouse.link ? 1.9 : 1})`;
        ring.style.opacity = mouse.active ? "1" : "0";
        glow.style.opacity = mouse.active ? "1" : "0";

        if (mouse.active && !reduced) {
          const nx = (mouse.x / w) * 2 - 1;
          const ny = (mouse.y / h) * 2 - 1;
          aurora.style.setProperty("--ax", nx.toFixed(3));
          aurora.style.setProperty("--ay", ny.toFixed(3));
          syncHero();
          heroOrbs.forEach((o) => {
            const k = Number(o.dataset.k);
            o.style.translate = `${(nx * k).toFixed(1)}px ${(ny * k * 0.7).toFixed(1)}px`;
          });
        }
      }
      raf = requestAnimationFrame(tick);
    };

    const onVisibility = () => {
      running = !document.hidden;
      if (!mon.done) {
        mon.t0 = 0; // restart the measurement after the tab was hidden
        mon.frames = 0;
      }
      if (running) raf = requestAnimationFrame(tick);
      else cancelAnimationFrame(raf);
    };

    resize();
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);
    cleanups.push(() => {
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    });
    if (reduced) {
      canvas.style.display = "none";
    }
    raf = requestAnimationFrame(tick);
    cleanups.push(() => {
      running = false;
      html.classList.remove("pc-lite");
      cancelAnimationFrame(raf);
      heroOrbs.forEach((o) => (o.style.translate = ""));
    });

    /* ---------------- pointer interactions (mouse only) ---------------- */
    if (hasMouse) {
      let hot = null; // glass card under the cursor
      let mag = null; // magnetic button under the cursor
      let last = null;
      let pending = 0;

      const engage = (c) => {
        if (getComputedStyle(c).position === "static") {
          c.style.position = "relative";
          c.dataset.pcPos = "1";
        }
        c.classList.add("pc-hot");
      };
      const release = (c) => {
        if (!c) return;
        c.classList.remove("pc-hot");
        c.style.transform = "";
        c.style.removeProperty("--gx");
        c.style.removeProperty("--gy");
        if (c.dataset.pcPos) {
          c.style.position = "";
          delete c.dataset.pcPos;
        }
      };

      const apply = () => {
        pending = 0;
        const e = last;
        if (!e || !(e.target instanceof Element)) return;

        // 1. glass card: 3D tilt + glare following the cursor
        if (!reduced) {
          let c = e.target.closest(CARD_SEL);
          while (c && !fits(c)) c = c.parentElement ? c.parentElement.closest(CARD_SEL) : null;
          if (c !== hot) {
            release(hot);
            hot = c;
            if (hot) engage(hot);
          }
          if (hot) {
            const r = hot.getBoundingClientRect();
            const px = e.clientX - r.left;
            const py = e.clientY - r.top;
            const x = px / r.width - 0.5;
            const y = py / r.height - 0.5;
            hot.style.setProperty("--gx", `${px.toFixed(0)}px`);
            hot.style.setProperty("--gy", `${py.toFixed(0)}px`);
            hot.style.transform = `perspective(900px) rotateX(${(-y * 7).toFixed(2)}deg) rotateY(${(x * 7).toFixed(2)}deg) translateY(-4px)`;
          }

          // 2. magnetic CTA
          const m = e.target.closest(MAG_SEL);
          if (m !== mag) {
            if (mag) mag.style.transform = "";
            mag = m;
          }
          if (mag) {
            const r = mag.getBoundingClientRect();
            const dx = (e.clientX - (r.left + r.width / 2)) / r.width;
            const dy = (e.clientY - (r.top + r.height / 2)) / r.height;
            mag.style.transform = `translate(${(dx * 12).toFixed(1)}px, ${(dy * 9).toFixed(1)}px)`;
          }
        }
      };

      const onMove = (e) => {
        if (e.pointerType === "touch") return;
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        if (!mouse.active) {
          mouse.active = true;
          mouse.rx = e.clientX;
          mouse.ry = e.clientY;
          mouse.gx = e.clientX;
          mouse.gy = e.clientY;
        }
        mouse.link = !!(e.target instanceof Element && e.target.closest(LINK_SEL));
        last = e;
        if (!pending) pending = requestAnimationFrame(apply);
      };

      const onLeave = () => {
        mouse.active = false;
        release(hot);
        hot = null;
        if (mag) mag.style.transform = "";
        mag = null;
      };

      const onDown = (e) => {
        const b = e.target instanceof Element ? e.target.closest(MAG_SEL) : null;
        if (!b || reduced) return;
        const r = b.getBoundingClientRect();
        const d = Math.max(r.width, r.height) * 2;
        const s = document.createElement("span");
        s.className = "pc-ripple";
        s.style.cssText = `width:${d}px;height:${d}px;left:${e.clientX - r.left - d / 2}px;top:${e.clientY - r.top - d / 2}px`;
        b.appendChild(s);
        setTimeout(() => s.remove(), 700);
      };

      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerdown", onDown, { passive: true });
      document.documentElement.addEventListener("mouseleave", onLeave);
      window.addEventListener("blur", onLeave);
      cleanups.push(() => {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerdown", onDown);
        document.documentElement.removeEventListener("mouseleave", onLeave);
        window.removeEventListener("blur", onLeave);
        cancelAnimationFrame(pending);
        release(hot);
        if (mag) mag.style.transform = "";
      });
    }

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return (
    <>
      <div ref={auroraRef} className="pc-aurora" aria-hidden="true">
        <span className="pc-blob pc-blob-1" style={{ "--k": 42 }}>
          <i />
        </span>
        <span className="pc-blob pc-blob-2" style={{ "--k": -56 }}>
          <i />
        </span>
        <span className="pc-blob pc-blob-3" style={{ "--k": 30 }}>
          <i />
        </span>
        <span className="pc-blob pc-blob-4" style={{ "--k": -38 }}>
          <i />
        </span>
        <canvas ref={canvasRef} className="pc-particles" />
        <div ref={glowRef} className="pc-glow" />
      </div>
      <div ref={ringRef} className="pc-ring" aria-hidden="true" />
    </>
  );
}
