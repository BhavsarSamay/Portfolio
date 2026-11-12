import { useEffect, useRef } from "react";
import { gsap, ease, prefersReducedMotion } from "../lib/motion";
import { experience } from "../data/experience";

// Vertical timeline; a connector line draws itself as the section scrolls through.
export default function Experience() {
  const root = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".xp__line i", { scaleY: 0 }, {
        scaleY: 1, ease: "none", transformOrigin: "top",
        scrollTrigger: { trigger: ".xp__list", start: "top 70%", end: "bottom 60%", scrub: true },
      });
      gsap.utils.toArray(".xp__item").forEach((el) =>
        gsap.fromTo(el, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1, ease: ease.out, scrollTrigger: { trigger: el, start: "top 85%" } })
      );
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="experience" ref={root} className="xp" aria-labelledby="xp-h">
      <div className="sec__head">
        <p className="mono-label">[ 05 ] Experience</p>
        <p className="mono-label">2024 to now</p>
      </div>
      <h2 id="xp-h" className="sr-only">Professional experience</h2>

      <div className="xp__list">
        <div className="xp__line" aria-hidden="true"><i /></div>
        {experience.map((job) => (
          <article key={job.id} className="xp__item">
            <p className="mono-label xp__period">{job.period}{job.status === "CURRENT ROLE" && <span className="xp__live"><i aria-hidden="true" /> Now</span>}</p>
            <div>
              <h3 className="xp__company">{job.company}</h3>
              <p className="xp__role">{job.role}{job.subrole ? ` · ${job.subrole}` : ""}</p>
              <ul className="xp__points">
                {job.points.map((pt) => <li key={pt}>{pt}</li>)}
              </ul>
              <ul className="xp__tech" aria-label="Technologies">
                {job.tech.map((t) => <li key={t}>{t}</li>)}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
