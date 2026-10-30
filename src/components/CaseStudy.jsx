import { useEffect, useRef } from "react";
import { gsap, ease, ScrollTrigger, prefersReducedMotion } from "../lib/motion";
import { stopScroll, startScroll } from "../lib/scroll";
import { work } from "../data/work";
import { origin, closeCase } from "../lib/route";
import Split from "./Split";
import Cover, { palette } from "./Cover";

const stackLabels = { frontend: "Frontend", backend: "Backend", dataAI: "Data & AI", infrastructure: "Infrastructure" };

// Full-screen case study. Opens by expanding from the clicked card, closes with Esc or the button.
export default function CaseStudy({ id }) {
  const root = useRef(null);
  const closeBtn = useRef(null);
  const i = work.findIndex((w) => w.id === id);
  const p = work[i];
  const next = work[(i + 1) % work.length];
  const pal = palette(id);

  useEffect(() => {
    if (!p) return;
    const prevTitle = document.title;
    document.title = `${p.name} · Samay Bhavsar`;
    stopScroll();
    // Keep keyboard and screen-reader focus inside the open case study.
    const behind = [...document.querySelectorAll("main, footer, .nav")];
    behind.forEach((n) => n.setAttribute("inert", ""));
    closeBtn.current?.focus({ preventScroll: true });
    const el = root.current;
    el.scrollTop = 0;
    const ctx = gsap.context(() => {
      if (prefersReducedMotion()) return;
      const r = origin.rect;
      const vw = innerWidth, vh = innerHeight;
      const from = r
        ? `inset(${r.top}px ${vw - r.right}px ${vh - r.bottom}px ${r.left}px round 12px)`
        : "inset(50% 50% 50% 50% round 12px)";
      gsap
        .timeline()
        .fromTo(el, { clipPath: from }, { clipPath: `inset(0px 0px 0px 0px round 0px)`, duration: 0.9, ease: ease.inOut })
        .fromTo(".cs__title .c", { yPercent: 115 }, { yPercent: 0, duration: 1, stagger: 0.03, ease: ease.out }, 0.5)
        .fromTo(".cs__fade", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.07, ease: ease.out }, 0.7);
      // Sections reveal inside the overlay's own scroller.
      gsap.utils.toArray(".cs__sec").forEach((s) =>
        gsap.fromTo(s, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.9, ease: ease.out, scrollTrigger: { trigger: s, scroller: el, start: "top 88%" } })
      );
    }, root);
    // Trigger positions depend on final layout (fonts, wrapped text), so measure once it settles.
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    const onKey = (e) => { if (e.key === "Escape") closeCase(); };
    window.addEventListener("keydown", onKey);
    return () => {
      ctx.revert();
      window.removeEventListener("keydown", onKey);
      document.title = prevTitle;
      behind.forEach((n) => n.removeAttribute("inert"));
      startScroll();
      origin.el?.focus?.({ preventScroll: true });
    };
  }, [id, p]);

  if (!p) {
    return (
      <div className="cs" role="dialog" aria-modal="true" aria-label="Project not found" ref={root}>
        <div className="cs__inner">
          <p className="mono-label">Not found</p>
          <h1 className="cs__title">No such project</h1>
          <button type="button" className="btn btn--solid" onClick={closeCase}>Back to work</button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={root}
      className="cs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cs-h"
      data-lenis-prevent
      style={{ "--bg": pal.bg, "--ink": pal.ink, "--a": pal.a }}
    >
      <button ref={closeBtn} type="button" className="cs__close" onClick={closeCase} aria-label="Close project">
        <span aria-hidden="true">×</span> Close
      </button>

      <div className="cs__inner">
        <p className="mono-label cs__fade">{p.index} · {p.group} · Personal project</p>
        <h1 id="cs-h" className="cs__title" aria-label={p.name}>
          <Split text={p.name} as="span" />
        </h1>
        <p className="cs__lede cs__fade">{p.tagline}</p>

        <div className="cs__cover cs__fade"><Cover id={p.id} motif={p.motif} /></div>

        <dl className="cs__facts cs__fade">
          <div><dt>Type</dt><dd>Personal project on GitHub</dd></div>
          <div><dt>Stack</dt><dd>{p.tech.slice(0, 5).join(", ")}</dd></div>
          <div><dt>Source</dt><dd><a href={p.href} target="_blank" rel="noreferrer">View repository ↗</a></dd></div>
        </dl>

        <section className="cs__sec cs__two">
          <h2 className="mono-label">Overview</h2>
          <div>
            <p className="cs__big">{p.description}</p>
          </div>
        </section>

        <section className="cs__sec cs__two">
          <h2 className="mono-label">The problem</h2>
          <p className="cs__big">{p.problem}</p>
        </section>

        <section className="cs__sec">
          <h2 className="mono-label">How it fits together</h2>
          <p className="cs__flow">{p.architecture}</p>
          <ol className="cs__steps">
            {p.pipeline.map((s, n) => (
              <li key={s.name}>
                <span className="cs__n">{String(n + 1).padStart(2, "0")}</span>
                <h3>{s.name}</h3>
                <p>{s.desc}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="cs__sec">
          <h2 className="mono-label">Engineering decisions</h2>
          <ul className="cs__cols">
            {p.challenges.map((c) => (
              <li key={c.title}>
                <h3>{c.title}</h3>
                <p>{c.desc}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="cs__sec cs__two">
          <h2 className="mono-label">Stack</h2>
          <dl className="cs__stack">
            {Object.entries(p.stack).map(([k, v]) => (
              <div key={k}>
                <dt>{stackLabels[k] ?? k}</dt>
                <dd>{v.join(" · ")}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="cs__sec">
          <h2 className="mono-label">Code excerpt</h2>
          <pre className="cs__code" tabIndex={0}><code>{p.code}</code></pre>
        </section>

        <a
          className="cs__next"
          href={`#/work/${next.id}`}
          onClick={() => { origin.rect = null; origin.el = null; }}
        >
          <span className="mono-label">Next project</span>
          <span className="cs__next-name">{next.name} <i aria-hidden="true">→</i></span>
        </a>
      </div>
    </div>
  );
}
