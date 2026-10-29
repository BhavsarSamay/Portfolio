import { useEffect, useMemo, useRef, useState } from "react";
import { gsap, ease, prefersReducedMotion } from "../lib/motion";
import { work, workFilters, enterprise } from "../data/work";
import { openCase } from "../lib/route";
import Split from "./Split";
import Cover, { palette } from "./Cover";
import PlatformArt from "./PlatformArt";

export default function Work() {
  const root = useRef(null);
  const grid = useRef(null);
  const [filter, setFilter] = useState("All");
  const changed = useRef(false);

  const shown = useMemo(() => work.filter((w) => filter === "All" || w.group === filter), [filter]);

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
    }, root);
    return () => ctx.revert();
  }, []);

  // Cards enter on first view and re-enter when the filter changes.
  useEffect(() => {
    if (prefersReducedMotion() || !grid.current) return;
    const cards = grid.current.querySelectorAll(".card");
    const ctx = gsap.context(() => {
      if (!changed.current) {
        cards.forEach((c) =>
          gsap.fromTo(c, { opacity: 0, y: 70, clipPath: "inset(12% 0 0 0)" }, {
            opacity: 1, y: 0, clipPath: "inset(0% 0 0 0)", duration: 1.1, ease: ease.out,
            scrollTrigger: { trigger: c, start: "top 92%" },
          })
        );
      } else {
        gsap.fromTo(cards, { opacity: 0, y: 40, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 0.7, stagger: 0.07, ease: ease.out, clearProps: "transform" });
      }
    }, grid);
    return () => ctx.revert();
  }, [shown]);

  return (
    <section id="work" ref={root} className="work" aria-labelledby="work-h">
      <div className="sec__head">
        <p className="mono-label">[ 01 ] Selected work</p>
        <p className="mono-label">{String(work.length).padStart(2, "0")} projects</p>
      </div>
      <h2 id="work-h" className="work__title"><Split text="Work" /></h2>

      <div className="filters" role="group" aria-label="Filter projects by category">
        {workFilters.map((f) => (
          <button key={f} type="button" className="chip" aria-pressed={filter === f} onClick={() => { changed.current = true; setFilter(f); }}>
            {f}
          </button>
        ))}
        <p className="filters__count mono-label" aria-live="polite">{shown.length} shown</p>
      </div>

      <ul className="grid" ref={grid}>
        {shown.map((p, i) => {
          const pal = palette(p.id);
          return (
            <li key={p.id} className={`grid__item grid__item--${i % 6}`}>
              <a
                className="card"
                href={`#/work/${p.id}`}
                onClick={(e) => openCase(e, p.id)}
                data-cursor="View"
                style={{ "--ink": pal.ink, "--bg": pal.bg }}
              >
                <div className="card__media"><Cover id={p.id} motif={p.motif} /></div>
                <div className="card__meta">
                  <span className="mono-label">{p.index} · {p.group}</span>
                  <span className="card__arrow" aria-hidden="true">↗</span>
                </div>
                <h3 className="card__name">{p.name}</h3>
                <p className="card__tag">{p.subtitle}</p>
                <ul className="card__tech" aria-label="Technologies">
                  {p.tech.slice(0, 4).map((t) => <li key={t}>{t}</li>)}
                </ul>
              </a>
            </li>
          );
        })}
      </ul>
      <p className="work__note mono-label">Covers are original generative illustrations of each project&rsquo;s idea, not screenshots.</p>

      <div className="ent">
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
