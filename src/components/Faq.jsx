import { useEffect, useRef } from "react";
import { gsap, ease, prefersReducedMotion } from "../lib/motion";
import { faq } from "../data/services";
import Split from "./Split";

// Answers to the questions founders ask before they write. Native <details> keeps it accessible.
export default function Faq() {
  const root = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".faq__title .c", { yPercent: 115 }, {
        yPercent: 0, duration: 1.2, stagger: 0.03, ease: ease.out,
        scrollTrigger: { trigger: ".faq__title", start: "top 85%" },
      });
      gsap.fromTo(".faq__item", { opacity: 0, y: 24 }, {
        opacity: 1, y: 0, duration: 0.8, stagger: 0.07, ease: ease.out,
        scrollTrigger: { trigger: ".faq__list", start: "top 88%" },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="faq" ref={root} className="faq" aria-labelledby="faq-h">
      <div className="sec__head">
        <p className="mono-label">[ 08 ] FAQ</p>
        <p className="mono-label">Before you write</p>
      </div>
      <div className="faq__body">
        <h2 id="faq-h" className="faq__title">
          <Split text="Questions" />
          <Split text="founders ask" className="it" />
        </h2>
        <div className="faq__list">
          {faq.map((f, i) => (
            <details key={f.q} className="faq__item" open={i === 0}>
              <summary>
                <span>{f.q}</span>
                <i aria-hidden="true" />
              </summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
