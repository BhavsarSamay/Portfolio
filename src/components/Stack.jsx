import { useEffect, useRef } from "react";
import { gsap, ease, prefersReducedMotion } from "../lib/motion";
import { techEcosystem } from "../data/skills";

// Skills as a typographic composition: each group is a row of large words that fill on hover.
// No percentages; breadth is shown by grouping.
export default function Stack() {
  const root = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray(".stack__row").forEach((row, i) => {
        gsap.fromTo(row.querySelectorAll(".stack__item"), { yPercent: 100, opacity: 0 }, {
          yPercent: 0, opacity: 1, duration: 0.9, stagger: 0.04, ease: ease.out,
          scrollTrigger: { trigger: row, start: "top 88%" },
        });
        // Alternate rows slide in opposite directions as they cross the viewport.
        gsap.fromTo(row.querySelector(".stack__items"), { x: i % 2 ? 60 : -60 }, {
          x: i % 2 ? -60 : 60, ease: "none",
          scrollTrigger: { trigger: row, start: "top bottom", end: "bottom top", scrub: true },
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="stack" ref={root} className="stack" aria-labelledby="stack-h">
      <div className="sec__head">
        <p className="mono-label">[ 04 ] Stack</p>
        <p className="mono-label">Tools I use</p>
      </div>
      <h2 id="stack-h" className="sr-only">Technology stack</h2>
      <div>
        {techEcosystem.map((g, i) => (
          <div key={g.group} className="stack__row" data-n={String(i + 1).padStart(2, "0")}>
            <div className="stack__head">
              <h3>{g.group}</h3>
              <p>{g.description}</p>
            </div>
            <ul className="stack__items">
              {g.items.map((it) => (
                <li key={it} className="stack__mask"><span className="stack__item">{it}</span></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
