import { gsap, ScrollTrigger, prefersReducedMotion } from "./motion";
import { scene3d } from "../three/store";

// Where should content launch from? The visible celestial body nearest to it on screen. With no body in
// view (or no 3D scene at all) it launches from the vanishing point near the middle of the screen.
function pickOrigin(cx, cy) {
  const w = window.innerWidth, h = window.innerHeight;
  let best = null, bestScore = Infinity;
  for (const a of Object.values(scene3d.anchors)) {
    if (!a.ahead || a.f < 0.2) continue;
    if (a.sx < -120 || a.sx > w + 120 || a.sy < -120 || a.sy > h + 120) continue;
    const score = Math.hypot(a.sx - cx, a.sy - cy) / (0.4 + a.f);
    if (score < bestScore) {
      bestScore = score;
      best = a;
    }
  }
  return best ? { x: best.sx, y: best.sy, key: best.key } : { x: w / 2, y: h * 0.4, key: null };
}

// Content starts hidden, then, as it scrolls into view, flies out of the nearest celestial body:
// small and turned away at first, growing to its place while it swings to face the viewer.
// Call inside a gsap.context so everything is cleaned up with the component.
export function emerge(el, { minScale = 0.12, delay = 0, start = "top 92%", duration = 1.3 } = {}) {
  if (!el || prefersReducedMotion()) return;
  gsap.set(el, { opacity: 0 });
  ScrollTrigger.create({
    trigger: el,
    start,
    once: true,
    onEnter: () => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      const o = pickOrigin(cx, cy);
      const dx = o.x - cx, dy = o.y - cy;
      if (o.key) scene3d.pulse[o.key] = 1;
      gsap.fromTo(
        el,
        { x: dx, y: dy, scale: minScale, opacity: 0, rotationY: dx > 0 ? -38 : 38, rotationX: 14, transformPerspective: 1300 },
        {
          x: 0, y: 0, scale: 1, opacity: 1, rotationY: 0, rotationX: 0,
          duration, delay, ease: "expo.out",
          clearProps: "transform,opacity",
        }
      );
    },
  });
}
