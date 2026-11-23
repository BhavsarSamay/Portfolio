import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "../lib/motion";

// A giant outlined numeral behind a section's title ("01", "02"…). It draws in as the section arrives
// and drifts at its own speed while the section scrolls, which gives every chapter depth.
export default function Chapter({ n }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    const section = el?.closest("section");
    if (!el || !section || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(el, { yPercent: 18 }, {
        yPercent: -28, ease: "none",
        scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: true },
      });
      gsap.fromTo(el, { "--draw": 0 }, {
        "--draw": 1, duration: 2.2, ease: "power2.out",
        scrollTrigger: { trigger: section, start: "top 75%" },
      });
    });
    return () => ctx.revert();
  }, []);

  return <span ref={ref} className="chapter" aria-hidden="true">{n}</span>;
}
