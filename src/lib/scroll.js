import Lenis from "lenis";
import { gsap, ScrollTrigger, prefersReducedMotion } from "./motion";

let lenis = null;
let tick = null;

// Smooth scrolling is optional. Without it (or with reduced motion) native scrolling is used.
export function initScroll() {
  if (lenis || prefersReducedMotion()) return;
  lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1, smoothWheel: true });
  lenis.on("scroll", ScrollTrigger.update);
  tick = (t) => lenis.raf(t * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
}

export function destroyScroll() {
  if (!lenis) return;
  gsap.ticker.remove(tick);
  lenis.destroy();
  lenis = null;
}

export const stopScroll = () => lenis?.stop();
export const startScroll = () => lenis?.start();

export function scrollToTarget(target, opts = {}) {
  const el = typeof target === "string" ? document.querySelector(target) : target;
  if (lenis) lenis.scrollTo(el ?? target, { duration: 1.4, easing: (t) => 1 - Math.pow(1 - t, 4), ...opts });
  else if (el) el.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth" });
  else window.scrollTo({ top: target, behavior: "auto" });
}
