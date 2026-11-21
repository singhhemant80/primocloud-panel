import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import {
  CSS2DRenderer,
  CSS2DObject,
} from "three/examples/jsm/renderers/CSS2DRenderer.js";

const GREEN = 0x0baf60;
const DARK = 0x087a43;
const CITIES = [
  ["New York", 40.7, -74.0, "9ms"],
  ["Frankfurt", 50.1, 8.7, "11ms"],
  ["Mumbai", 19.1, 72.9, "14ms"],
  ["Singapore", 1.35, 103.8, "15ms"],
  ["Tokyo", 35.7, 139.7, "18ms"],
  ["São Paulo", -23.5, -46.6, "28ms"],
  ["Sydney", -33.9, 151.2, "24ms"],
];
const LINKS = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [0, 5],
  [3, 6],
  [1, 4],
];

const latLon = (lat, lon, r = 1) => {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lon + 180) * Math.PI) / 180;
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta),
  );
};

export default function HeroGlobe({ className = "" }) {
  const mount = useRef(null);

  useEffect(() => {
    const el = mount.current;
    if (!el) return;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      return; // WebGL unavailable: component stays empty
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    el.appendChild(renderer.domElement);

    const labelRenderer = new CSS2DRenderer();
    labelRenderer.domElement.style.cssText =
      "position:absolute;inset:0;pointer-events:none;overflow:hidden";
    el.appendChild(labelRenderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 50);
    camera.position.set(0, 0, 3.7);

    const globe = new THREE.Group();
    globe.rotation.set(0.35, -1.2, 0);
    scene.add(globe);

    // Body + grid
    globe.add(
      new THREE.Mesh(
        new THREE.SphereGeometry(0.99, 48, 48),
        new THREE.MeshBasicMaterial({ color: 0xeaf8f0 }),
      ),
    );
    globe.add(
      new THREE.Mesh(
        new THREE.SphereGeometry(1, 24, 16),
        new THREE.MeshBasicMaterial({
          color: GREEN,
          wireframe: true,
          transparent: true,
          opacity: 0.1,
        }),
      ),
    );

    // Dotted surface (Fibonacci sphere)
    const N = 1800;
    const dots = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const th = Math.PI * (3 - Math.sqrt(5)) * i;
      dots.set(
        [Math.cos(th) * r * 1.003, y * 1.003, Math.sin(th) * r * 1.003],
        i * 3,
      );
    }
    const dotGeo = new THREE.BufferGeometry();
    dotGeo.setAttribute("position", new THREE.BufferAttribute(dots, 3));
    globe.add(
      new THREE.Points(
        dotGeo,
        new THREE.PointsMaterial({
          color: GREEN,
          size: 0.017,
          transparent: true,
          opacity: 0.5,
        }),
      ),
    );

    // Datacenter nodes + labels
    const nodes = [];
    const nodeGroup = new THREE.Group();
    globe.add(nodeGroup);
    CITIES.forEach(([name, lat, lon, ms]) => {
      const p = latLon(lat, lon, 1.01);
      const dot = new THREE.Mesh(
        new THREE.SphereGeometry(0.026, 16, 16),
        new THREE.MeshBasicMaterial({ color: GREEN }),
      );
      dot.position.copy(p);
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(0.035, 0.047, 32),
        new THREE.MeshBasicMaterial({
          color: GREEN,
          transparent: true,
          opacity: 0.6,
          side: THREE.DoubleSide,
        }),
      );
      ring.position.copy(p);
      ring.lookAt(p.clone().multiplyScalar(2));
      const div = document.createElement("div");
      div.className =
        "font-mono-code text-[10px] font-bold text-on-surface bg-surface-container-lowest/95 border border-outline-variant rounded px-1.5 py-0.5 shadow-sm whitespace-nowrap transition-opacity duration-200";
      div.textContent = `${name} · ${ms}`;
      const label = new CSS2DObject(div);
      label.position.copy(p.clone().normalize().multiplyScalar(0.09));
      dot.add(label);
      nodeGroup.add(dot, ring);
      nodes.push({ dot, ring, div });
    });

    // Arcs + travelling data packets
    const arcs = LINKS.map(([a, b], i) => {
      const A = latLon(CITIES[a][1], CITIES[a][2], 1.01);
      const B = latLon(CITIES[b][1], CITIES[b][2], 1.01);
      const mid = A.clone()
        .add(B)
        .multiplyScalar(0.5)
        .normalize()
        .multiplyScalar(1 + A.distanceTo(B) * 0.42);
      const curve = new THREE.QuadraticBezierCurve3(A, mid, B);
      globe.add(
        new THREE.Line(
          new THREE.BufferGeometry().setFromPoints(curve.getPoints(56)),
          new THREE.LineBasicMaterial({
            color: GREEN,
            transparent: true,
            opacity: 0.5,
          }),
        ),
      );
      const packet = new THREE.Mesh(
        new THREE.SphereGeometry(0.016, 12, 12),
        new THREE.MeshBasicMaterial({ color: DARK }),
      );
      globe.add(packet);
      return {
        curve,
        packet,
        offset: i / LINKS.length,
        speed: 0.12 + (i % 3) * 0.03,
      };
    });

    // Floating particles around the globe
    const M = 140;
    const pp = new Float32Array(M * 3);
    for (let i = 0; i < M; i++) {
      const v = new THREE.Vector3()
        .randomDirection()
        .multiplyScalar(1.35 + Math.random() * 0.9);
      pp.set([v.x, v.y, v.z], i * 3);
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(pp, 3));
    const particles = new THREE.Points(
      pGeo,
      new THREE.PointsMaterial({
        color: GREEN,
        size: 0.02,
        transparent: true,
        opacity: 0.4,
      }),
    );
    scene.add(particles);

    // Sizing
    const resize = () => {
      const w = el.clientWidth || 1;
      const h = el.clientHeight || 1;
      renderer.setSize(w, h);
      labelRenderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    // Interaction: drag to rotate, mouse parallax, inertia
    let dragging = false;
    let lx = 0;
    let ly = 0;
    let spin = reduce ? 0 : 0.0025;
    const auto = reduce ? 0 : 0.0025;
    const mouse = { x: 0, y: 0 };
    el.style.touchAction = "pan-y";
    el.style.cursor = "grab";
    const down = (e) => {
      dragging = true;
      lx = e.clientX;
      ly = e.clientY;
      el.style.cursor = "grabbing";
      el.setPointerCapture?.(e.pointerId);
    };
    const up = () => {
      dragging = false;
      el.style.cursor = "grab";
    };
    const move = (e) => {
      const r = el.getBoundingClientRect();
      mouse.x = ((e.clientX - r.left) / r.width - 0.5) * 2;
      mouse.y = ((e.clientY - r.top) / r.height - 0.5) * 2;
      if (!dragging) return;
      const dx = e.clientX - lx;
      const dy = e.clientY - ly;
      lx = e.clientX;
      ly = e.clientY;
      spin = dx * 0.006;
      globe.rotation.y += dx * 0.006;
      globe.rotation.x = Math.max(
        -0.9,
        Math.min(0.9, globe.rotation.x + dy * 0.004),
      );
    };
    const leave = () => {
      mouse.x = 0;
      mouse.y = 0;
    };
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
    el.addEventListener("pointerleave", leave);

    // Render loop (paused when offscreen)
    let visible = true;
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
    });
    io.observe(el);
    const clock = new THREE.Clock();
    const camDir = new THREE.Vector3();
    const wp = new THREE.Vector3();
    let raf;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (!visible) return;
      const t = clock.getElapsedTime();
      if (!dragging) {
        spin += (auto - spin) * 0.03;
        globe.rotation.y += spin;
      }
      camera.position.x += (mouse.x * 0.25 - camera.position.x) * 0.05;
      camera.position.y += (-mouse.y * 0.18 - camera.position.y) * 0.05;
      camera.lookAt(0, 0, 0);
      particles.rotation.y = -t * 0.04;

      nodes.forEach((n, i) => {
        const k = (t * 0.8 + i * 0.3) % 1;
        n.ring.scale.setScalar(1 + k * 1.6);
        n.ring.material.opacity = 0.6 * (1 - k);
        n.dot.getWorldPosition(wp);
        camDir.copy(camera.position).normalize();
        n.div.style.opacity =
          wp.clone().normalize().dot(camDir) > 0.25 ? "1" : "0";
      });
      arcs.forEach((a) =>
        a.packet.position.copy(a.curve.getPoint((t * a.speed + a.offset) % 1)),
      );

      renderer.render(scene, camera);
      labelRenderer.render(scene, camera);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
      el.removeEventListener("pointerleave", leave);
      scene.traverse((o) => {
        o.geometry?.dispose();
        if (o.material) [].concat(o.material).forEach((m) => m.dispose());
      });
      renderer.dispose();
      el.replaceChildren();
    };
  }, []);

  return (
    <div
      ref={mount}
      className={`relative ${className}`}
      aria-label="Interactive globe of PRIMO CLOUD datacenters"
      role="img"
    />
  );
}
