import { useEffect, useRef } from "react";
import { gsap, ease, prefersReducedMotion } from "../lib/motion";
import { services, reasons } from "../data/services";
import { openCase } from "../lib/route";
import Split from "./Split";

// What founders can hire me for. Each service links to the real project that proves it.
export default function Services() {
  const root = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".svc__title .c", { yPercent: 115 }, {
        yPercent: 0, duration: 1.2, stagger: 0.03, ease: ease.out,
        scrollTrigger: { trigger: ".svc__title", start: "top 85%" },
      });
      gsap.fromTo(".why li", { opacity: 0, y: 24 }, {
        opacity: 1, y: 0, duration: 0.9, stagger: 0.1, ease: ease.out,
        scrollTrigger: { trigger: ".why", start: "top 88%" },
      });
      gsap.utils.toArray(".svc").forEach((el, i) =>
        gsap.fromTo(el, { opacity: 0, y: 40 }, {
          opacity: 1, y: 0, duration: 1, delay: (i % 2) * 0.08, ease: ease.out,
          scrollTrigger: { trigger: el, start: "top 90%" },
        })
      );
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="services" ref={root} className="services" aria-labelledby="svc-h">
      <div className="sec__head">
        <p className="mono-label">[ 01 ] Services</p>
        <p className="mono-label">For startup founders</p>
      </div>

      <h2 id="svc-h" className="svc__title">
        <Split text="What I" className="inl" /> <Split text="build" className="inl it" />
      </h2>

      <ul className="why" aria-label="Why founders work with me">
        {reasons.map((r) => (
          <li key={r.k}>
            <p className="mono-label">{r.k}</p>
            <p>{r.v}</p>
          </li>
        ))}
      </ul>

      <ul className="svc__grid">
        {services.map((s) => (
          <li key={s.id} className="svc">
            <div className="svc__top">
              <span className="mono-label">{s.n}</span>
              <span className="svc__dot" aria-hidden="true" />
            </div>
            <h3 className="svc__name">
              {s.title[0]} <em>{s.title[1]}</em>
            </h3>
            <p className="svc__line">{s.line}</p>
            <ul className="svc__gets" aria-label="What you get">
              {s.gets.map((g) => <li key={g}>{g}</li>)}
            </ul>
            <p className="svc__proof">
              <span className="mono-label">Proof</span>
              {s.proof.map((p) =>
                p.id ? (
                  <a key={p.label} href={`#/work/${p.id}`} onClick={(e) => openCase(e, p.id)} data-cursor="View">
                    {p.label} <span aria-hidden="true">↗</span>
                  </a>
                ) : (
                  <a key={p.label} href={p.href}>
                    {p.label} <span aria-hidden="true">↓</span>
                  </a>
                )
              )}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
