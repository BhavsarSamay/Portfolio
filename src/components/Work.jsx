import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, ease, prefersReducedMotion } from "../lib/motion";
import { work, enterprise } from "../data/work";
import { openCase } from "../lib/route";
import Split from "./Split";
import Cover from "./Cover";
import PlatformArt from "./PlatformArt";
import Chapter from "./Chapter";

// Selected work as a pinned, horizontal gallery: the section holds still while scrolling down glides the
// project panels sideways. Each panel's artwork drifts against the motion (parallax), a counter and a
// progress line track the position. Small screens and reduced motion get a plain vertical list.
export default function Work() {
  const root = useRef(null);
  const pin = useRef(null);
  const track = useRef(null);
  const bar = useRef(null);
  const count = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".work__title .c", { yPercent: 115 }, {
        yPercent: 0, duration: 1.2, stagger: 0.04, ease: ease.out,
        scrollTrigger: { trigger: ".work__title", start: "top 85%" },
      });
      gsap.utils.toArray(".ent__row").forEach((row) =>
        gsap.fromTo(row, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.9, ease: ease.out, scrollTrigger: { trigger: row, start: "top 90%" } })
      );

      const mm = gsap.matchMedia();
      mm.add("(min-width: 901px)", () => {
        const panels = gsap.utils.toArray(".panel", track.current);
        const distance = () => track.current.scrollWidth - pin.current.clientWidth;
        const slide = gsap.to(track.current, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: pin.current,
            start: "top top",
            end: () => "+=" + distance(),
            pin: true,
            scrub: 0.7,
            invalidateOnRefresh: true,
            onUpdate: (s) => {
              if (bar.current) bar.current.style.transform = `scaleX(${s.progress})`;
              const i = Math.min(panels.length, Math.max(1, Math.round(s.progress * (panels.length - 1)) + 1));
              if (count.current) count.current.textContent = String(i).padStart(2, "0");
            },
          },
        });
        // Artwork drifts against the slide; panels sharpen and lift as they reach the centre.
        panels.forEach((panel) => {
          gsap.fromTo(panel.querySelector(".panel__art"), { xPercent: 9 }, {
            xPercent: -9, ease: "none",
            scrollTrigger: { trigger: panel, containerAnimation: slide, start: "left right", end: "right left", scrub: true },
          });
          gsap.fromTo(panel, { "--focus": 0.35 }, {
            "--focus": 1, ease: "none",
            scrollTrigger: { trigger: panel, containerAnimation: slide, start: "left 95%", end: "center 55%", scrub: true },
          });
        });
        requestAnimationFrame(() => ScrollTrigger.refresh());
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="work" ref={root} className="work" aria-labelledby="work-h">
      <Chapter n="01" />
      <div className="sec__head">
        <p className="mono-label">[ 01 ] Selected work</p>
        <p className="mono-label">{String(work.length).padStart(2, "0")} projects</p>
      </div>
      <h2 id="work-h" className="work__title"><Split text="Selected" className="inl" /> <Split text="work" className="inl it" /></h2>

      <div className="showcase" ref={pin}>
        <div className="showcase__hud" aria-hidden="true">
          <span className="mono-label"><span ref={count}>01</span> / {String(work.length).padStart(2, "0")}</span>
          <span className="showcase__bar"><i ref={bar} /></span>
          <span className="mono-label">Scroll to explore</span>
        </div>
        <ul className="showcase__track" ref={track}>
          {work.map((p) => (
            <li key={p.id} className="panel">
              <a className="panel__link" href={`#/work/${p.id}`} onClick={(e) => openCase(e, p.id)} data-cursor="Open">
                <div className="panel__media">
                  <div className="panel__art"><Cover id={p.id} motif={p.motif} /></div>
                  <span className="panel__index" aria-hidden="true">{p.index}</span>
                </div>
                <div className="panel__info">
                  <p className="mono-label panel__group">{p.group}</p>
                  <h3 className="panel__name">{p.name}</h3>
                  <p className="panel__sub">{p.subtitle}</p>
                  <ul className="panel__tech" aria-label="Technologies">
                    {p.tech.slice(0, 4).map((t) => <li key={t}>{t}</li>)}
                  </ul>
                  <span className="panel__go">Case study <i aria-hidden="true">↗</i></span>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>
      <p className="work__note mono-label">Covers are original generative illustrations of each project&rsquo;s idea, not screenshots.</p>

      <div className="ent" id="work-veracity">
        <div className="sec__head">
          <p className="mono-label">[ 01b ] Inside Veracity</p>
          <p className="mono-label">Confidential · details limited</p>
        </div>
        <ul className="ent__list">
          {enterprise.map((e) => (
            <li key={e.id} className="ent__row">
              <div className="ent__art"><PlatformArt id={e.id} /></div>
              <div className="ent__body">
                <span className="mono-label ent__n">{e.index} / Veracity Supply Chain</span>
                <h3>{e.label}</h3>
                <p className="ent__role">{e.role}</p>
                <p>{e.overview}</p>
                <ul className="ent__tags" aria-label="Focus areas">
                  {e.tags.map((t) => <li key={t}>{t}</li>)}
                </ul>
              </div>
            </li>
          ))}
        </ul>
        <p className="work__note mono-label">Product names and specifics are under NDA. Artwork is a conceptual illustration of each system, not a screenshot.</p>
      </div>
    </section>
  );
}
