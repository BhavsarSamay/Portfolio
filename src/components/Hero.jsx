import { Component, lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { ScrollTrigger, prefersReducedMotion } from "../lib/motion";
import { samayProfile } from "../data/samayProfile";
import { PORTRAIT_SRC } from "../hero/sampleParticles";
import { goTo } from "./Nav";

const ParticlePortrait = lazy(() => import("../hero/ParticlePortrait"));

const CLAIM = ["From the first sketch", "to the system that runs it."];
const FACTS = [
  { v: "3", l: "Production platforms architected at Veracity Supply Chain" },
  { v: "Feb ’26", l: "Star Performer of the Month at SaturnCube" },
  { v: "AI → Web", l: "Agents, RAG, real-time, payments, shipped end to end" },
];

// If WebGL fails at runtime, show the static reference instead of a blank stage.
class PortraitGuard extends Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(err) {
    console.error("Particle portrait failed, showing the static portrait:", err);
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

// Cinematic opening: a portrait made of particles, centred on black. The section is two
// viewports tall with a sticky stage, so the portrait holds still while scroll bursts it apart;
// the burst is fully reversible. Progress is written to a ref and a CSS variable, never to state.
export default function Hero({ ready, tier }) {
  const root = useRef(null);
  const progress = useRef(0);
  const readyRef = useRef(ready);
  readyRef.current = ready;
  const [failed, setFailed] = useState(false);
  const use3d = tier > 0 && !failed;

  useEffect(() => {
    const el = root.current;
    const st = ScrollTrigger.create({
      trigger: el,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (s) => {
        progress.current = s.progress;
        el.style.setProperty("--p", s.progress.toFixed(4));
      },
    });
    return () => st.kill();
  }, []);

  // Metallic name: every letter carries the same champagne gradient, offset by its own position in the
  // word, so the gradient reads as one continuous sheet of metal across the letters. A light band
  // drifts slowly across it and leans toward the cursor.
  const nameRef = useRef(null);
  useEffect(() => {
    const name = nameRef.current;
    if (!name) return;
    const letters = [...name.querySelectorAll(".phero__ch")];
    const measure = () => {
      for (const word of name.querySelectorAll(".phero__first, .phero__last")) {
        word.style.setProperty("--ww", word.offsetWidth);
        for (const ch of word.querySelectorAll(".phero__ch")) ch.style.setProperty("--ox", ch.offsetLeft - word.offsetLeft);
      }
    };
    measure();
    document.fonts?.ready.then(measure);
    const ro = new ResizeObserver(measure);
    ro.observe(name);

    if (prefersReducedMotion()) return () => ro.disconnect();
    let raf = 0, t = 0, target = 0.5, mx = 0.5, last = performance.now(), visible = true;
    const onMove = (e) => (target = e.clientX / innerWidth);
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(name);
    const tick = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (visible) {
        t += dt;
        mx += (target - mx) * Math.min(1, dt * 3);
        // sheen position: a slow idle sweep plus the pointer's pull, in 0..1 of the gradient travel
        name.style.setProperty("--sheen", (0.5 + 0.32 * Math.sin(t * 0.35) + (mx - 0.5) * 0.5).toFixed(4));
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("pointermove", onMove);
      io.disconnect();
      ro.disconnect();
      letters.length = 0;
    };
  }, []);

  // The sheet after the hero (light theme) flattens its rounded edge as it rises into view.
  const sheetRef = useRef(null);
  useEffect(() => {
    const el = sheetRef.current;
    if (!el || prefersReducedMotion()) return;
    const st = ScrollTrigger.create({
      trigger: el, start: "top bottom", end: "top 35%", scrub: true,
      onUpdate: (s) => el.style.setProperty("--sheet", s.progress.toFixed(3)),
    });
    return () => st.kill();
  }, []);

  // Once the intro type has landed, drop its transitions so text tracks the scroll exactly.
  useEffect(() => {
    if (!ready) return;
    const t = setTimeout(() => root.current?.classList.add("is-live"), 3600);
    return () => clearTimeout(t);
  }, [ready]);

  const onFail = useCallback(() => setFailed(true), []);
  const fallback = <img className="phero__still" src={PORTRAIT_SRC} alt="" width="940" height="1260" decoding="async" />;

  return (
    <>
    <section
      id="home"
      ref={root}
      className={`phero${ready ? " is-ready" : ""}${prefersReducedMotion() ? " is-still" : ""}`}
      aria-labelledby="hero-h"
    >
      <div className="phero__stage">
        <div className="phero__bg" aria-hidden="true" />

        {use3d ? (
          <PortraitGuard fallback={fallback}>
            <Suspense fallback={null}>
              <ParticlePortrait progress={progress} ready={readyRef} tier={tier} onFail={onFail} />
            </Suspense>
          </PortraitGuard>
        ) : (
          <div className="phero__canvas" aria-hidden="true">{fallback}</div>
        )}

        <div className="phero__ui">
          <div className="phero__top mono-label">
            <span>{samayProfile.location}</span>
            <span className="phero__avail"><i aria-hidden="true" />Open to new work</span>
          </div>

          <h1 id="hero-h" className="phero__name" ref={nameRef}>
            <span className="sr-only">Samay Bhavsar</span>
            {["Samay", "Bhavsar"].map((word, wi) => (
              <span key={word} className={wi ? "phero__last" : "phero__first"} aria-hidden="true">
                {[...word].map((ch, ci) => (
                  <span key={ci} className="phero__ch" style={{ "--i": wi ? word.length - 1 - ci : ci }}>{ch}</span>
                ))}
              </span>
            ))}
          </h1>

          <div className="phero__foot">
            <p className="phero__role mono-label">Software Engineer / Full-Stack Developer</p>
            <p className="phero__intro">
              I build products <em>and the systems that run them,</em> from AI agents to full-stack platforms.
            </p>
          </div>

          <a
            className="phero__scroll"
            href="#work"
            onClick={(e) => {
              e.preventDefault();
              goTo("work");
            }}
          >
            <span className="mono-label">Scroll</span>
            <i aria-hidden="true" />
          </a>
        </div>

        {/* As the portrait scatters, a statement and three credentials condense out of the particles.
            Each piece has its own entry point (--at) along the hero's scroll progress (--p). */}
        <div className="phero__reveal">
          <p className="phero__kicker mono-label" style={{ "--at": 0.55 }}>Product &amp; engineering, in one person</p>
          <p className="phero__claim">
            <span className="sr-only">{CLAIM.join(" ")}</span>
            <span aria-hidden="true">
              {CLAIM.map((line, li) => (
                <span key={li} className={`phero__claim-line${li === 1 ? " is-it" : ""}`}>
                  {line.split(" ").map((w, wi) => (
                    <span key={wi} className="phero__w" style={{ "--at": 0.64 + (li * 4 + wi) * 0.008 }}>{w} </span>
                  ))}
                </span>
              ))}
            </span>
          </p>
          <ul className="phero__facts">
            {FACTS.map((f, i) => (
              <li key={f.l} style={{ "--at": 0.7 + i * 0.03 }}>
                <strong>{f.v}</strong>
                <span>{f.l}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
    <div className="phero-fade" ref={sheetRef} aria-hidden="true" />
    </>
  );
}
