import { useEffect, useRef, useState } from "react";
import { gsap, ease } from "../lib/motion";

// Short opening sequence. It is decorative: the page underneath is already rendered,
// nothing waits on it, and it can be skipped by click, key or button.
export default function Loader({ onReady, onDone }) {
  const root = useRef(null);
  const count = useRef(null);
  const [skipped, setSkipped] = useState(false);
  const tl = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const counter = { v: 0 };
      tl.current = gsap
        .timeline({ onComplete: onDone })
        .call(onReady, null, 1.7)
        .fromTo(".ld__path", { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1, stagger: 0.18, ease: "power2.inOut" }, 0)
        .to(counter, { v: 100, duration: 1.3, ease: "power1.inOut", onUpdate: () => { if (count.current) count.current.textContent = String(Math.round(counter.v)).padStart(3, "0"); } }, 0)
        .fromTo(".ld__line .c", { yPercent: 110 }, { yPercent: 0, duration: 0.8, stagger: 0.03, ease: ease.out }, 0.2)
        .to(".ld__mark", { scale: 0.9, opacity: 0, duration: 0.4, ease: "power2.in" }, 1.45)
        .to(".ld__panel--t", { yPercent: -101, duration: 0.9, ease: ease.inOut }, 1.55)
        .to(".ld__panel--b", { yPercent: 101, duration: 0.9, ease: ease.inOut }, 1.55)
        .set(root.current, { display: "none" });
    }, root);
    return () => ctx.revert();
  }, [onReady, onDone]);

  const skip = () => {
    if (skipped) return;
    setSkipped(true);
    tl.current?.timeScale(4);
  };

  useEffect(() => {
    const onKey = () => skip();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <div ref={root} className="ld" onClick={skip} role="status" aria-label="Loading">
      <div className="ld__panel ld__panel--t" />
      <div className="ld__panel ld__panel--b" />
      <div className="ld__mark">
        <svg viewBox="0 0 160 100" className="ld__svg" aria-hidden="true">
          <path className="ld__path" pathLength="1" d="M52 16C22 6 8 36 32 47c24 11 20 42-16 35" />
          <path className="ld__path" pathLength="1" d="M92 12v76M92 12h26c26 0 26 36 0 36H92M118 48h8c28 0 28 40-4 40H92" />
        </svg>
        <p className="ld__line">
          <span className="w">
            {[..."SAMAY BHAVSAR"].map((ch, i) => (
              <span className="c" key={i}>{ch === " " ? "\u00A0" : ch}</span>
            ))}
          </span>
        </p>
        <div className="ld__meta">
          <span ref={count}>000</span>
          <button type="button" className="ld__skip" onClick={skip}>Skip</button>
        </div>
      </div>
    </div>
  );
}
