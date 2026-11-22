import { useEffect, useRef } from "react";
import { gsap, ease, prefersReducedMotion } from "../lib/motion";
import { process } from "../data/services";
import Split from "./Split";
import Magnetic from "./Magnetic";
import { goTo } from "./Nav";

// How an engagement runs, step by step, ending in the main call to action.
export default function Process() {
  const root = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".proc__title .c", { yPercent: 115 }, {
        yPercent: 0, duration: 1.2, stagger: 0.03, ease: ease.out,
        scrollTrigger: { trigger: ".proc__title", start: "top 85%" },
      });
      // The rule above each step fills in turn as the section scrolls through.
      gsap.fromTo(".step__rule i", { scaleX: 0 }, {
        scaleX: 1, stagger: 0.25, ease: "none",
        scrollTrigger: { trigger: ".proc__list", start: "top 80%", end: "bottom 55%", scrub: true },
      });
      gsap.fromTo(".step", { opacity: 0, y: 30 }, {
        opacity: 1, y: 0, duration: 0.9, stagger: 0.1, ease: ease.out,
        scrollTrigger: { trigger: ".proc__list", start: "top 85%" },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="process" ref={root} className="proc" aria-labelledby="proc-h">
      <div className="sec__head">
        <p className="mono-label">[ 03 ] Process</p>
        <p className="mono-label">Idea to launch</p>
      </div>

      <h2 id="proc-h" className="proc__title">
        <Split text="How we" className="inl" /> <Split text="work together" className="inl it" />
      </h2>

      <ol className="proc__list">
        {process.map((s) => (
          <li key={s.n} className="step">
            <div className="step__rule" aria-hidden="true"><i /></div>
            <span className="step__n">{s.n}</span>
            <h3>{s.title}</h3>
            <p>{s.body}</p>
          </li>
        ))}
      </ol>

      <div className="proc__cta">
        <p className="proc__ask">Have an idea and a deadline? <em>Tell me about it.</em></p>
        <Magnetic
          as="a"
          href="#contact"
          className="btn btn--solid"
          data-cursor="Start"
          onClick={(e) => { e.preventDefault(); goTo("contact"); }}
        >
          Start a project <span aria-hidden="true" className="btn__ic">↗</span>
        </Magnetic>
      </div>
    </section>
  );
}
