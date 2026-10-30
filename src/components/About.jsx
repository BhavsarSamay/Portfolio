import { useEffect, useRef } from "react";
import { gsap, ease, prefersReducedMotion } from "../lib/motion";
import { samayProfile } from "../data/samayProfile";
import { education } from "../data/experience";
import { howIThink } from "../data/thinking";
import Split from "./Split";
import RingText from "./RingText";

const facts = [
  { v: "3", l: "Platforms architected at Veracity Supply Chain" },
  { v: "Feb 2026", l: "Star Performer of the Month, Saturncube" },
  { v: "8.65", l: "CGPI, Bachelor of Information Technology" },
];

export default function About() {
  const root = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".about__head .c", { yPercent: 115 }, {
        yPercent: 0, duration: 1.2, stagger: 0.025, ease: ease.out,
        scrollTrigger: { trigger: ".about__head", start: "top 82%" },
      });
      gsap.fromTo(".about__photo", { clipPath: "inset(100% 0 0 0)" }, {
        clipPath: "inset(0% 0 0 0)", duration: 1.3, ease: ease.inOut,
        scrollTrigger: { trigger: ".about__photo", start: "top 85%" },
      });
      gsap.fromTo(".about__photo img", { scale: 1.3 }, {
        scale: 1, ease: "none",
        scrollTrigger: { trigger: ".about__photo", start: "top bottom", end: "bottom top", scrub: true },
      });
      gsap.utils.toArray(".about__fade").forEach((el) =>
        gsap.fromTo(el, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.9, ease: ease.out, scrollTrigger: { trigger: el, start: "top 90%" } })
      );
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={root} className="about" aria-labelledby="about-h">
      <div className="sec__head">
        <p className="mono-label">[ 03 ] About</p>
        <p className="mono-label">{samayProfile.location}</p>
      </div>

      <h2 id="about-h" className="about__head">
        <Split text="Start with the operation." />
        <Split text="Then build the system." className="hollow" />
      </h2>

      <div className="about__body">
        <figure className="about__photo" data-cursor="Hi">
          <img src="/samay-profile.jpg" alt="Portrait of Samay Bhavsar" width="800" height="1000" loading="lazy" decoding="async" />
          <figcaption className="mono-label">Samay Bhavsar</figcaption>
        </figure>
        <div className="about__badge" aria-hidden="true"><RingText /><span>SB</span></div>

        <div className="about__text">
          <p className="about__lead about__fade">
            I&rsquo;m a Product Manager and Full-Stack Engineer at Veracity Supply Chain Limited, where I design the end-to-end architecture
            for a gig workforce platform, a recruitment platform and a payroll &amp; compliance platform.
          </p>
          <p className="about__fade">
            Before that I was a Node.js backend developer at Saturncube Technology, building agentic AI workflows, a RAG chatbot,
            a real-time trading system, Stripe payment flows and microservices. I stay close to engineering so that product decisions
            and the code describe the same system.
          </p>
          <p className="about__fade">
            This site is my own sandbox for motion and interaction. The experiments in the lab are studies I made for it, separate from the
            product work above.
          </p>

          <ul className="facts">
            {facts.map((f) => (
              <li key={f.l} className="about__fade">
                <strong>{f.v}</strong>
                <span>{f.l}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="think">
        <p className="mono-label">How I think</p>
        <ol>
          {howIThink.map((t, i) => (
            <li key={t.title} className="think__row about__fade">
              <span className="mono-label">{String(i + 1).padStart(2, "0")}</span>
              <h3>{t.title}</h3>
              <p>{t.body}</p>
            </li>
          ))}
        </ol>
      </div>

      <p className="about__edu mono-label">
        {education.degree} · {education.school} · {education.period}
      </p>
    </section>
  );
}
