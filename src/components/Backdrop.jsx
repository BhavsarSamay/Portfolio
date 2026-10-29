import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "../lib/motion";
import { palette } from "../lib/theme";

// Fixed ambient layer behind the whole page: two slow light pools, a sparse drifting
// constellation, and a soft spotlight that trails the pointer. Pauses when the tab is hidden.
export default function Backdrop() {
  const ref = useRef(null);

  useEffect(() => {
    const cv = ref.current;
    const ctx = cv.getContext("2d");
    const reduced = prefersReducedMotion();
    const small = window.matchMedia("(max-width: 700px)").matches;
    const dpr = 1; // soft shapes do not need retina resolution
    let w = 0, h = 0, raf = 0, nodes = [];
    const m = { x: 0.7, y: 0.3, tx: 0.7, ty: 0.3, on: false };

    const size = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      cv.width = w * dpr;
      cv.height = h * dpr;
      const n = small ? 26 : 54;
      nodes = Array.from({ length: n }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25,
        r: 0.8 + Math.random() * 1.2,
      }));
    };

    const glow = (x, y, r, rgb, a) => {
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, `rgba(${rgb},${a})`);
      g.addColorStop(1, `rgba(${rgb},0)`);
      ctx.fillStyle = g;
      ctx.fillRect(x - r, y - r, r * 2, r * 2);
    };

    const frame = (now) => {
      raf = 0;
      const t = now / 1000;
      const sy = window.scrollY;
      const P = palette();
      ctx.clearRect(0, 0, w, h);

      // Light pools drift on slow Lissajous paths and shift gently with scroll.
      const R = Math.max(w, h) * 0.55;
      glow(w * (0.25 + 0.15 * Math.sin(t * 0.07)), h * (0.3 + 0.12 * Math.cos(t * 0.09)) - sy * 0.03, R, P.glowA[0], P.glowA[1]);
      glow(w * (0.8 + 0.1 * Math.cos(t * 0.06)), h * (0.75 + 0.1 * Math.sin(t * 0.08)) + sy * 0.02, R * 0.8, P.glowB[0], P.glowB[1]);

      m.x += (m.tx - m.x) * 0.05;
      m.y += (m.ty - m.y) * 0.05;
      if (m.on) glow(m.x * w, m.y * h, Math.min(w, h) * 0.5, P.spot[0], P.spot[1]);

      // Constellation.
      const link = 150;
      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        a.x += a.vx;
        a.y += a.vy;
        if (a.x < -20) a.x = w + 20; else if (a.x > w + 20) a.x = -20;
        if (a.y < -20) a.y = h + 20; else if (a.y > h + 20) a.y = -20;
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j], dx = a.x - b.x, dy = a.y - b.y, d = dx * dx + dy * dy;
          if (d < link * link) {
            ctx.strokeStyle = `rgba(${P.ink},${(1 - Math.sqrt(d) / link) * 0.11})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
        if (m.on) {
          const dx = a.x - m.x * w, dy = a.y - m.y * h, d = Math.hypot(dx, dy);
          if (d < 200) {
            ctx.strokeStyle = `rgba(${P.link},${(1 - d / 200) * 0.3})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(m.x * w, m.y * h);
            ctx.stroke();
          }
        }
      }
      ctx.fillStyle = `rgba(${P.ink},0.35)`;
      for (const a of nodes) {
        ctx.beginPath();
        ctx.arc(a.x, a.y, a.r, 0, 6.283);
        ctx.fill();
      }
      if (!reduced && !document.hidden) raf = requestAnimationFrame(frame);
    };

    const start = () => { if (!raf) raf = requestAnimationFrame(frame); };
    const move = (e) => { m.tx = e.clientX / w; m.ty = e.clientY / h; m.on = true; };
    const vis = () => { if (!document.hidden && !reduced) start(); };

    size();
    start();
    const onResize = () => { size(); if (reduced) frame(performance.now()); };
    const onTheme = () => { if (reduced) frame(performance.now()); };
    window.addEventListener("themechange", onTheme);
    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("visibilitychange", vis);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("themechange", onTheme);
      window.removeEventListener("pointermove", move);
      document.removeEventListener("visibilitychange", vis);
    };
  }, []);

  return (
    <div className="backdrop" aria-hidden="true">
      <canvas ref={ref} />
      <div className="guides"><i /><i /><i /></div>
    </div>
  );
}
