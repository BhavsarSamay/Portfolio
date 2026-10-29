import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "../lib/motion";
import { palette } from "../lib/theme";

// Signature visual: thousands of particles sampled from a rendered "SB" glyph.
// They assemble on load, repel from the pointer, and drift apart as the hero scrolls away.
// `progress` (0 to 1) is a ref written by the hero's ScrollTrigger; `ready` starts the assembly.
export default function ParticleMonogram({ progress, ready }) {
  const wrap = useRef(null);
  const canvas = useRef(null);
  const readyRef = useRef(ready);
  readyRef.current = ready;

  useEffect(() => {
    const cv = canvas.current;
    const box = wrap.current;
    const ctx = cv.getContext("2d");
    const reduced = prefersReducedMotion();
    const small = window.matchMedia("(max-width: 700px)").matches;
    let dpr = Math.min(window.devicePixelRatio || 1, small ? 1.5 : 2);
    let w = 0, h = 0, parts = [], raf = 0, visible = true, t0 = performance.now();
    const ptr = { x: -9999, y: -9999, active: false };
    let formedAt = 0;

    const build = () => {
      const r = box.getBoundingClientRect();
      w = Math.max(1, Math.floor(r.width));
      h = Math.max(1, Math.floor(r.height));
      cv.width = w * dpr;
      cv.height = h * dpr;
      cv.style.width = w + "px";
      cv.style.height = h + "px";

      // Rasterise the monogram offscreen and keep a sparse grid of its filled pixels.
      const off = document.createElement("canvas");
      off.width = w;
      off.height = h;
      const o = off.getContext("2d", { willReadFrequently: true });
      const face = '"Inter Tight", Impact, sans-serif';
      o.font = `800 100px ${face}`;
      const size = Math.min(h * 0.8, (w * 0.9) / (o.measureText("SB").width / 100));
      o.fillStyle = "#fff";
      o.textAlign = "center";
      o.textBaseline = "middle";
      o.font = `800 ${size}px ${face}`;
      o.fillText("SB", w / 2, h * 0.52);
      const data = o.getImageData(0, 0, w, h).data;
      const step = Math.max(4, Math.round(size / (small ? 38 : 62)));
      const pts = [];
      for (let y = 0; y < h; y += step)
        for (let x = 0; x < w; x += step)
          if (data[(y * w + x) * 4 + 3] > 128) pts.push([x + (Math.random() - 0.5) * step * 0.6, y + (Math.random() - 0.5) * step * 0.6]);

      const px = Math.max(1.6, step * 0.34);
      parts = pts.map(([tx, ty], i) => ({
        tx, ty,
        x: reduced || formedAt ? tx : Math.random() * w,
        y: reduced || formedAt ? ty : Math.random() * h,
        vx: 0, vy: 0,
        s: px * (0.7 + Math.random() * 0.6),
        hot: i % 9 === 0,
        ph: Math.random() * 6.28,
        dx: Math.cos(i * 2.399) , dy: Math.sin(i * 2.399),
      }));
    };

    const frame = (now) => {
      raf = 0;
      const t = (now - t0) / 1000;
      const dis = progress.current;
      const R = Math.min(w, h) * 0.16;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const go = readyRef.current;
      if (go && !formedAt) formedAt = now;
      const settle = go ? Math.min(1, (now - formedAt) / 1600) : 0;
      const k = 0.02 + settle * 0.07;

      for (const p of parts) {
        // Scroll disperses each particle along its own direction with a slow wobble.
        const spread = dis * dis * Math.min(w, h) * 0.9;
        const gx = go ? p.tx + p.dx * spread + Math.sin(t * 0.6 + p.ph) * dis * 30 : p.x;
        const gy = go ? p.ty + p.dy * spread + Math.cos(t * 0.5 + p.ph) * dis * 30 : p.y;
        p.vx += (gx - p.x) * k;
        p.vy += (gy - p.y) * k;
        if (ptr.active) {
          const dx = p.x - ptr.x, dy = p.y - ptr.y, d2 = dx * dx + dy * dy;
          if (d2 < R * R) {
            const d = Math.sqrt(d2) || 1, f = (1 - d / R) * 5;
            p.vx += (dx / d) * f;
            p.vy += (dy / d) * f;
          }
        }
        p.vx *= 0.84;
        p.vy *= 0.84;
        p.x += p.vx;
        p.y += p.vy;
      }

      ctx.globalAlpha = Math.max(0.15, 1 - dis * 0.8);
      const P = palette();
      ctx.fillStyle = P.mono;
      for (const p of parts) if (!p.hot) ctx.fillRect(p.x, p.y, p.s, p.s);
      ctx.fillStyle = P.hot;
      for (const p of parts) if (p.hot) ctx.fillRect(p.x, p.y, p.s * 1.25, p.s * 1.25);

      if (!reduced && visible) raf = requestAnimationFrame(frame);
    };

    const start = () => { if (!raf && !reduced) raf = requestAnimationFrame(frame); };

    const move = (e) => {
      const r = box.getBoundingClientRect();
      ptr.x = e.clientX - r.left;
      ptr.y = e.clientY - r.top;
      ptr.active = ptr.x > -50 && ptr.x < w + 50 && ptr.y > -50 && ptr.y < h + 50;
    };

    const draw = () => frame(performance.now());
    let rt;
    const ro = new ResizeObserver(() => {
      clearTimeout(rt);
      rt = setTimeout(() => { build(); reduced ? draw() : start(); }, 150);
    });
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) start();
    });

    const init = () => { build(); reduced ? draw() : start(); };
    // Wait for the display font so the glyph is sampled in the right face.
    (document.fonts?.load('800 100px "Inter Tight"') ?? Promise.resolve()).finally(init);
    ro.observe(box);
    io.observe(box);
    window.addEventListener("pointermove", move, { passive: true });
    if (reduced) window.addEventListener("themechange", draw);
    return () => {
      window.removeEventListener("themechange", draw);
      cancelAnimationFrame(raf);
      clearTimeout(rt);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", move);
    };
  }, [progress]);

  // Reduced motion: re-draw once readiness changes so the static frame shows the formed monogram.
  return (
    <div ref={wrap} className="mono" aria-hidden="true">
      <canvas ref={canvas} />
    </div>
  );
}
