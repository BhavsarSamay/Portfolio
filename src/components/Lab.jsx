import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { gsap, ease, prefersReducedMotion } from "../lib/motion";
import { useVisible } from "../lib/useVisible";
import Split from "./Split";

const TypeStudy = lazy(() => import("../experiments/TypeStudy"));
const FlowStudy = lazy(() => import("../experiments/FlowStudy"));
const BlobStudy = lazy(() => import("../experiments/BlobStudy"));
const GridStudy = lazy(() => import("../experiments/GridStudy"));

const studies = [
  { id: "type", n: "01", name: "Pointer typography", hint: "Move across the letters", Comp: TypeStudy, tone: "light" },
  { id: "flow", n: "02", name: "Flow field", hint: "Move to bend it, press to reseed", Comp: FlowStudy, tone: "dark" },
  { id: "blob", n: "03", name: "Soft body", hint: "Move to pull it, press to pulse", Comp: BlobStudy, tone: "light" },
  { id: "grid", n: "04", name: "Magnetic grid", hint: "Move to attract, press for a ripple", Comp: GridStudy, tone: "dark" },
];

function Study({ s, paused }) {
  // Experiments are code-split and only mounted once their frame is near the viewport.
  const [ref, near] = useVisible("200px");
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    if (near) setMounted(true);
  }, [near]);
  const { Comp } = s;
  return (
    <figure ref={ref} className={`study study--${s.id} study--${s.tone}`}>
      <div className="study__stage">
        {mounted && (
          <Suspense fallback={<span className="mono-label study__loading">Loading</span>}>
            <Comp paused={paused} />
          </Suspense>
        )}
      </div>
      <figcaption>
        <span className="mono-label">Study {s.n}</span>
        <strong>{s.name}</strong>
        <span className="study__hint">{s.hint}</span>
      </figcaption>
    </figure>
  );
}

export default function Lab() {
  const root = useRef(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".lab__title .c", { yPercent: 115 }, {
        yPercent: 0, duration: 1.2, stagger: 0.04, ease: ease.out,
        scrollTrigger: { trigger: ".lab__title", start: "top 85%" },
      });
      gsap.utils.toArray(".study").forEach((el, i) =>
        gsap.fromTo(el, { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 1, ease: ease.out, scrollTrigger: { trigger: el, start: "top 92%" } })
      );
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="lab" ref={root} className="lab" aria-labelledby="lab-h">
      <div className="sec__head">
        <p className="mono-label">[ 02 ] Motion lab</p>
        <button type="button" className="chip" aria-pressed={paused} onClick={() => setPaused((p) => !p)}>
          {paused ? "Resume motion" : "Pause motion"}
        </button>
      </div>
      <h2 id="lab-h" className="lab__title"><Split text="Lab" /></h2>
      <p className="lab__intro">
        Four small studies I built for this site: working experiments, not client work. Each one runs only while it is on screen.
      </p>
      <div className="lab__grid">
        {studies.map((s) => <Study key={s.id} s={s} paused={paused} />)}
      </div>
    </section>
  );
}
