import { useEffect, useRef, useState } from "react";
import { gsap, ease, prefersReducedMotion } from "../lib/motion";
import { samayProfile } from "../data/samayProfile";
import { goTo } from "./Nav";

const time = () =>
  new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Kolkata" }).format(new Date());

// The end of the journey: a planet horizon rises at the bottom of the page. The big "SB" has a slow
// shimmer of its own and lights up under the pointer.
export default function Footer() {
  const root = useRef(null);
  const big = useRef(null);
  const [now, setNow] = useState(time);

  useEffect(() => {
    const id = setInterval(() => setNow(time()), 30000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".foot__big", { yPercent: 18, opacity: 0 }, {
        yPercent: 0, opacity: 1, duration: 1.3, ease: ease.out,
        scrollTrigger: { trigger: root.current, start: "top 85%" },
      });
      gsap.fromTo(".foot__planet", { yPercent: 30 }, {
        yPercent: 0, ease: "none",
        scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom bottom", scrub: true },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  const move = (e) => {
    const el = big.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  const leave = () => {
    big.current?.style.setProperty("--mx", "-600px");
  };

  return (
    <footer ref={root} className="foot" onPointerMove={move} onPointerLeave={leave}>
      <div className="foot__planet" aria-hidden="true" />
      <p className="foot__sign mono-label">Thanks for flying this far. See you on the next orbit.</p>
      <p ref={big} className="foot__big" data-t="SB" aria-hidden="true">SB</p>
      <div className="foot__row">
        <p className="mono-label">&copy; {new Date().getFullYear()} {samayProfile.name}</p>
        <p className="mono-label">Ahmedabad · {now} IST</p>
        <p className="mono-label">
          <a href={samayProfile.github} target="_blank" rel="noreferrer">GitHub</a>
          {" / "}
          <a href={samayProfile.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
        </p>
        <button type="button" className="foot__top" onClick={() => goTo("home")}>
          Back to top <span aria-hidden="true">↑</span>
        </button>
      </div>
    </footer>
  );
}
