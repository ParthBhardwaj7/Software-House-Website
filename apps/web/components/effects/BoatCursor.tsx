"use client";

import { useEffect, useRef, useState } from "react";

const LERP = 0.1;
const SPAWN_DIST_PX = 20;
const SPAWN_INTERVAL_MS = 60;
const RIPPLE_LIFETIME_MS = 600;
const MAX_RIPPLES = 30;

type Ripple = { x: number; y: number; startTime: number };

function shouldEnableBoatCursor(): boolean {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  if (window.matchMedia("(pointer: coarse)").matches) return false;
  return true;
}

export function BoatCursor() {
  const [ready, setReady] = useState(false);
  const targetRef = useRef({ x: 0, y: 0 });
  const boatRef = useRef({ x: 0, y: 0 });
  const lastSpawnRef = useRef({ x: 0, y: 0, t: 0 });
  const ripplesRef = useRef<Ripple[]>([]);
  const rafRef = useRef(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const boatElRef = useRef<HTMLDivElement>(null);
  const hasMovedRef = useRef(false);

  useEffect(() => {
    if (!shouldEnableBoatCursor()) return;
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;

    const canvas = canvasRef.current;
    const boatEl = boatElRef.current;
    if (!canvas || !boatEl) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    document.body.classList.add("boat-cursor-active");

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    let running = true;

    const tick = (now: number) => {
      if (!running) return;

      const t = targetRef.current;
      const b = boatRef.current;
      b.x += (t.x - b.x) * LERP;
      b.y += (t.y - b.y) * LERP;

      if (hasMovedRef.current) {
        const dx = t.x - b.x;
        const dy = t.y - b.y;
        const angleDeg = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
        boatEl.style.opacity = "1";
        boatEl.style.transform = `translate3d(${b.x}px, ${b.y}px, 0) translate(-50%, -50%) rotate(${angleDeg}deg)`;
      }

      const ripples = ripplesRef.current;
      ripplesRef.current = ripples.filter((r) => now - r.startTime < RIPPLE_LIFETIME_MS);
      while (ripplesRef.current.length > MAX_RIPPLES) {
        ripplesRef.current.shift();
      }

      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      for (const r of ripplesRef.current) {
        const age = now - r.startTime;
        const progress = age / RIPPLE_LIFETIME_MS;
        const alpha = (1 - progress) * 0.52;
        const radius = 6 + progress * 38;

        ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
        ctx.lineWidth = 1.45;
        ctx.beginPath();
        ctx.arc(r.x, r.y, radius, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = `rgba(56, 189, 248, ${alpha * 0.55})`;
        ctx.beginPath();
        ctx.arc(r.x, r.y, radius * 0.55, 0, Math.PI * 2);
        ctx.stroke();
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    const onPointerMove = (e: PointerEvent) => {
      targetRef.current.x = e.clientX;
      targetRef.current.y = e.clientY;

      const time = performance.now();
      if (!hasMovedRef.current) {
        boatRef.current.x = e.clientX;
        boatRef.current.y = e.clientY;
        lastSpawnRef.current = { x: e.clientX, y: e.clientY, t: time };
        hasMovedRef.current = true;
        return;
      }

      const ls = lastSpawnRef.current;
      const dist = Math.hypot(e.clientX - ls.x, e.clientY - ls.y);
      const dt = time - ls.t;
      if (dist > SPAWN_DIST_PX || dt > SPAWN_INTERVAL_MS) {
        ripplesRef.current.push({ x: e.clientX, y: e.clientY, startTime: time });
        if (ripplesRef.current.length > MAX_RIPPLES) {
          ripplesRef.current.shift();
        }
        lastSpawnRef.current = { x: e.clientX, y: e.clientY, t: time };
      }
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      running = false;
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("resize", resize);
      document.body.classList.remove("boat-cursor-active");
    };
  }, [ready]);

  if (!ready) return null;

  return (
    <>
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-[90]"
        aria-hidden
      />
      <div
        ref={boatElRef}
        className="pointer-events-none fixed left-0 top-0 z-[100] opacity-0 will-change-transform"
        style={{ width: 28, height: 28 }}
        aria-hidden
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 28 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-sm"
        >
          <path
            d="M14 3L16 8H12L14 3Z"
            fill="#0f172a"
            stroke="#0f172a"
            strokeWidth="0.5"
            strokeLinejoin="round"
          />
          <path
            d="M6 18C6 18 10 14 14 14C18 14 22 18 22 18V20H6V18Z"
            fill="#1e3a5f"
            stroke="#0f172a"
            strokeWidth="0.75"
            strokeLinejoin="round"
          />
          <path
            d="M5 20H23L22 22C21.5 23 20.5 23.5 19.5 23.5H8.5C7.5 23.5 6.5 23 6 22L5 20Z"
            fill="#0f172a"
            stroke="#0f172a"
            strokeWidth="0.5"
            strokeLinejoin="round"
          />
          <path d="M8 20.5H20" stroke="#38bdf8" strokeWidth="0.5" strokeOpacity="0.6" />
        </svg>
      </div>
    </>
  );
}
