import { useEffect, useLayoutEffect, useRef } from "react";
import { gsap, ease, ScrollTrigger, prefersReducedMotion } from "../lib/motion";
import { samayProfile } from "../data/samayProfile";
import { useTheme, palettes } from "../lib/theme";
import Split from "./Split";
import ParticleMonogram from "./ParticleMonogram";
import Magnetic from "./Magnetic";
import { goTo } from "./Nav";

export default function Hero({ ready }) {
  const root = useRef(null);
  const progress = useRef(0);
  const [theme] = useTheme();

  // Scroll-linked: monogram disperses, name fills in, content drifts up.
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: root.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
        onUpdate: (s) => (progress.current = s.progress),
      });
      gsap.to(".hero__name .line--2 .c", {
        "--fill": palettes[theme].fill,
        stagger: 0.04,
        scrollTrigger: { trigger: root.current, start: "top top", end: "60% top", scrub: true },
      });
      gsap.to(".hero__content", {
        yPercent: -14,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
    }, root);
    return () => ctx.revert();
  }, [theme]);

  // Intro sequence, triggered once the loader hands over.
  useLayoutEffect(() => {
    if (!ready || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: ease.out } })
        .fromTo(".hero__name .c", { yPercent: 115, "--wg": 200, "--wd": 75 }, { yPercent: 0, "--wg": 800, "--wd": 100, duration: 1.5, stagger: 0.045 }, 0)
        .fromTo(".hero__fade", { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.9, stagger: 0.08 }, 0.5)
        .fromTo(".hero__rule", { scaleX: 0 }, { scaleX: 1, duration: 1.3, ease: ease.inOut }, 0.3);
    }, root);
    return () => ctx.revert();
  }, [ready]);

  return (
    <section id="home" ref={root} className={`hero${ready ? "" : " hero--wait"}`} aria-label="Introduction">
      <ParticleMonogram progress={progress} ready={ready} />

      <div className="hero__content">
        <div className="hero__top mono-label">
          <span className="hero__fade">{samayProfile.location}</span>
          <span className="hero__fade hero__disc">Product / Systems / Full-Stack / AI</span>
          <span className="hero__fade hero__avail">
            <i aria-hidden="true" /> Open to conversations
          </span>
        </div>

        <h1 className="hero__name">
          <Split text="SAMAY" className="line line--1" />
          <Split text="BHAVSAR" className="line line--2 outline" />
        </h1>

        <div className="hero__rule" aria-hidden="true" />

        <div className="hero__bottom">
          <div className="hero__copy">
            <p className="hero__role hero__fade">Product Manager &amp; Full-Stack Engineer</p>
            <p className="hero__line hero__fade">I build products, and the systems that run them.</p>
          </div>
          <div className="hero__cta hero__fade">
            <Magnetic as="a" href={`mailto:${samayProfile.email}`} className="btn btn--solid" data-cursor="Write">
              Say hello <span aria-hidden="true">↗</span>
            </Magnetic>
            <a
              href="#work"
              className="btn btn--ghost"
              onClick={(e) => { e.preventDefault(); goTo("work"); }}
            >
              See the work <span aria-hidden="true" className="btn__arrow">↓</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
