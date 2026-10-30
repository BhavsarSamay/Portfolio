import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "../lib/motion";

const words = ["Product", "Systems", "Full-Stack", "AI Agents", "Real-time", "Compliance", "Marketplaces"];

// Band of outlined type. It drifts on its own and speeds up with scroll velocity.
export default function Marquee() {
  const track = useRef(null);
  useEffect(() => {
    const el = track.current;
    if (prefersReducedMotion() || !el) return;
    let x = 0, boost = 0, dir = 1;
    const half = () => el.scrollWidth / 2;
    const st = ScrollTrigger.create({
      onUpdate: (s) => {
        dir = s.direction;
        boost = Math.min(Math.abs(s.getVelocity()) / 600, 14);
      },
    });
    const tick = () => {
      boost *= 0.93;
      x -= (0.6 + boost) * dir;
      const hw = half();
      if (x <= -hw) x += hw;
      if (x > 0) x -= hw;
      el.style.transform = `translate3d(${x}px,0,0)`;
    };
    gsap.ticker.add(tick);
    return () => { gsap.ticker.remove(tick); st.kill(); };
  }, []);

  const row = words.map((w, i) => (
    <span key={w} className="marquee__item">
      <span className={i % 2 ? "hollow" : ""}>{w}</span>
      <i aria-hidden="true" />
    </span>
  ));

  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track" ref={track}>
        {row}
        {row}
      </div>
    </div>
  );
}
