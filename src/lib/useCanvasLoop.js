import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "./motion";

// Shared runner for canvas experiments: DPR-aware sizing, pointer tracking, and a loop that
// only runs while the canvas is on screen and not paused. With reduced motion it draws one frame.
export function useCanvasLoop({ setup, draw, paused }) {
  const canvas = useRef(null);
  const fns = useRef({ setup, draw });
  fns.current = { setup, draw };
  const pausedRef = useRef(paused);
  pausedRef.current = paused;
  const api = useRef({ restart: () => {} });

  useEffect(() => {
    const cv = canvas.current;
    const ctx = cv.getContext("2d");
    const reduced = prefersReducedMotion();
    const s = { w: 0, h: 0, dpr: 1, t: 0, pointer: { x: 0, y: 0, in: false, down: false }, data: {} };
    let raf = 0, last = 0, visible = false;

    const size = () => {
      const r = cv.getBoundingClientRect();
      s.dpr = Math.min(window.devicePixelRatio || 1, 2);
      s.w = Math.max(1, r.width);
      s.h = Math.max(1, r.height);
      cv.width = s.w * s.dpr;
      cv.height = s.h * s.dpr;
      ctx.setTransform(s.dpr, 0, 0, s.dpr, 0, 0);
      s.pointer.x = s.w / 2;
      s.pointer.y = s.h / 2;
      fns.current.setup?.(s, ctx);
    };

    const frame = (now) => {
      raf = 0;
      const dt = Math.min((now - last) / 1000 || 0.016, 0.05);
      last = now;
      s.t += dt;
      fns.current.draw(ctx, s, dt);
      if (visible && !pausedRef.current && !reduced) raf = requestAnimationFrame(frame);
    };
    const run = () => {
      if (reduced) {
        s.t = 2;
        fns.current.draw(ctx, s, 0.016);
        return;
      }
      if (!raf && visible && !pausedRef.current) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    };
    api.current.restart = run;

    const toLocal = (e) => {
      const r = cv.getBoundingClientRect();
      s.pointer.x = e.clientX - r.left;
      s.pointer.y = e.clientY - r.top;
    };
    const onMove = (e) => {
      toLocal(e);
      s.pointer.in = true;
    };
    const onLeave = () => {
      s.pointer.in = false;
      s.pointer.down = false;
    };
    const onDown = (e) => {
      toLocal(e);
      s.pointer.in = true;
      s.pointer.down = true;
      s.data.onDown?.();
    };
    const onUp = () => (s.pointer.down = false);

    cv.addEventListener("pointermove", onMove);
    cv.addEventListener("pointerleave", onLeave);
    cv.addEventListener("pointerdown", onDown);
    cv.addEventListener("pointerup", onUp);

    const ro = new ResizeObserver(() => {
      size();
      if (reduced) run();
    });
    ro.observe(cv);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) run();
    });
    io.observe(cv);
    size();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      cv.removeEventListener("pointermove", onMove);
      cv.removeEventListener("pointerleave", onLeave);
      cv.removeEventListener("pointerdown", onDown);
      cv.removeEventListener("pointerup", onUp);
    };
  }, []);

  // Resume when un-paused.
  useEffect(() => {
    if (!paused) api.current.restart();
  }, [paused]);

  return canvas;
}
