import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "../lib/motion";

const text = "Founders bring me an idea and a deadline. I turn it into a product people actually use, then build the systems that keep it running.";
const hot = new Set(["product", "systems"]);

// Manifesto: each word lights up as the sentence scrolls through the viewport.
export default function Statement() {
  const root = useRef(null);
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".stmt__w",
        { opacity: 0.14 },
        {
          opacity: 1,
          stagger: 0.12,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top 75%", end: "bottom 55%", scrub: 0.6 },
        }
      );
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="stmt" aria-label="Approach">
      <p className="mono-label stmt__label">[ Approach ]</p>
      <p className="stmt__text">
        {text.split(" ").map((w, i) => (
          <span key={i} className={`stmt__w${hot.has(w.replace(/[.,]/g, "")) ? " is-hot" : ""}`}>
            {w}{" "}
          </span>
        ))}
      </p>
    </section>
  );
}
