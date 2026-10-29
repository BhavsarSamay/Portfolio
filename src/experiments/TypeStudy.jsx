import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "../lib/motion";

// Pointer-reactive variable font: weight and width of each letter follow its distance to the pointer.
const WORD = "MOTION";

export default function TypeStudy({ paused }) {
  const box = useRef(null);
  const state = useRef({ x: -1e4, y: -1e4, raf: 0 });
  const pausedRef = useRef(paused);
  pausedRef.current = paused;

  useEffect(() => {
    const el = box.current;
    const letters = [...el.querySelectorAll("span[data-l]")];
    const cur = letters.map(() => ({ wg: 300, wd: 100 }));
    const reduced = prefersReducedMotion();
    const s = state.current;

    const apply = () =>
      letters.forEach((l, i) => (l.style.fontVariationSettings = `"wght" ${cur[i].wg.toFixed(0)}, "wdth" ${cur[i].wd.toFixed(0)}`));
    const step = () => {
      s.raf = 0;
      let moving = false;
      letters.forEach((l, i) => {
        const r = l.getBoundingClientRect();
        const d = Math.hypot(s.x - (r.left + r.width / 2), s.y - (r.top + r.height / 2));
        const k = Math.max(0, 1 - d / 260);
        const tw = 300 + 500 * k, td = 100 - 25 * k;
        cur[i].wg += (tw - cur[i].wg) * 0.14;
        cur[i].wd += (td - cur[i].wd) * 0.14;
        if (Math.abs(tw - cur[i].wg) > 1 || Math.abs(td - cur[i].wd) > 0.5) moving = true;
      });
      apply();
      if (moving && !pausedRef.current) s.raf = requestAnimationFrame(step);
    };
    const kick = () => {
      if (!s.raf && !reduced && !pausedRef.current) s.raf = requestAnimationFrame(step);
    };
    const move = (e) => {
      s.x = e.clientX;
      s.y = e.clientY;
      kick();
    };
    const leave = () => {
      s.x = -1e4;
      s.y = -1e4;
      kick();
    };

    apply();
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerdown", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(s.raf);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerdown", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <div ref={box} className="exp__type" role="img" aria-label="The word MOTION. Letters grow heavier and narrower near the pointer.">
      <span aria-hidden="true">
        {[...WORD].map((c, i) => (
          <span key={i} data-l>
            {c}
          </span>
        ))}
      </span>
    </div>
  );
}
