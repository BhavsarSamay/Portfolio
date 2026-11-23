import { useEffect, useRef } from "react";
import { gsap, ease, prefersReducedMotion } from "../lib/motion";
import { techEcosystem } from "../data/skills";
import Split from "./Split";
import Chapter from "./Chapter";

// The stack as endless lanes: each group is a ticker of large words, alternating direction, that
// pauses under the pointer. The second copy of every lane exists only to make the loop seamless.
export default function Stack() {
  const root = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".stack__title .c", { yPercent: 115 }, {
        yPercent: 0, duration: 1.2, stagger: 0.035, ease: ease.out,
        scrollTrigger: { trigger: ".stack__title", start: "top 85%" },
      });
      gsap.utils.toArray(".stack__row").forEach((row) =>
        gsap.fromTo(row, { opacity: 0, y: 40 }, {
          opacity: 1, y: 0, duration: 1, ease: ease.out,
          scrollTrigger: { trigger: row, start: "top 92%" },
        })
      );
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="stack" ref={root} className="stack" aria-labelledby="stack-h">
      <Chapter n="05" />
      <div className="sec__head">
        <p className="mono-label">[ 05 ] Stack</p>
        <p className="mono-label">{techEcosystem.reduce((n, g) => n + g.items.length, 0)} tools, 5 groups</p>
      </div>
      <h2 id="stack-h" className="stack__title"><Split text="Tools I" className="inl" /> <Split text="use" className="inl it" /></h2>
      <div className="stack__rows">
        {techEcosystem.map((g, i) => (
          <div key={g.group} className={`stack__row${i % 2 ? " is-rev" : ""}`} style={{ "--dur": `${22 + g.items.length * 4}s` }}>
            <div className="stack__head">
              <span className="stack__n mono-label">{String(i + 1).padStart(2, "0")}</span>
              <h3>{g.group}</h3>
              <p>{g.description}</p>
            </div>
            <div className="stack__lane">
              <div className="stack__track">
                {[0, 1].map((copy) => (
                  <ul key={copy} className="stack__items" aria-hidden={copy ? "true" : undefined}>
                    {g.items.map((it) => (
                      <li key={it}><span className="stack__item">{it}</span><i aria-hidden="true">✦</i></li>
                    ))}
                  </ul>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
