import { useEffect, useRef, useState } from "react";
import { gsap } from "../lib/motion";
import { useSound } from "../lib/sound";

// Opening sequence: a short dive through space.
//   ignition (stars drift) -> warp (stars stretch into streaks) -> a planet grows ahead of us
//   -> we plunge through its atmosphere in a flash -> the page appears.
// It runs on its own small 2D canvas, so it shows instantly and never waits for the 3D scene.
// It is decorative: the page underneath is already rendered, and click, key or the button skips it.
const STARS = 520;
const STAGES = [
  [0, "Ignition"],
  [0.95, "Warp speed"],
  [2.0, "Entering atmosphere"],
];

export default function Loader({ onReady, onDone }) {
  const root = useRef(null);
  const canvas = useRef(null);
  const count = useRef(null);
  const label = useRef(null);
  const tl = useRef(null);
  const [skipped, setSkipped] = useState(false);
  const [soundOn, toggleSound] = useSound();

  useEffect(() => {
    const cv = canvas.current;
    const ctx = cv.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let w = 0, h = 0;
    const size = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
    };
    size();
    window.addEventListener("resize", size);

    // S is animated by the timeline; the canvas just reads it every frame.
    const S = { speed: 0.12, planet: 0, flash: 0 };
    const stars = Array.from({ length: STARS }, () => ({ x: Math.random() * 2 - 1, y: Math.random() * 2 - 1, z: 0.02 + Math.random() * 0.98, t: Math.random() }));
    // cloud bands for the planet, fixed so they look like weather, not noise
    const clouds = Array.from({ length: 9 }, () => ({ a: Math.random() * 6.283, d: Math.random() * 0.8, w: 0.25 + Math.random() * 0.5, h: 0.05 + Math.random() * 0.09 }));

    const planet = (cx, cy, r, time) => {
      // ocean body, lit from the upper left
      const body = ctx.createRadialGradient(cx - r * 0.38, cy - r * 0.42, r * 0.08, cx, cy, r);
      body.addColorStop(0, "#b8e8ff");
      body.addColorStop(0.45, "#3b86e8");
      body.addColorStop(1, "#0b2058");
      ctx.fillStyle = body;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, 6.283);
      ctx.fill();
      // drifting clouds, clipped to the disc
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, 6.283);
      ctx.clip();
      // clouds thin out as we get close, so the plunge reads as haze instead of big shapes
      const haze = 1 - Math.min(1, Math.max(0, (S.planet - 0.5) / 0.35));
      ctx.fillStyle = `rgba(255,255,255,${0.24 * haze})`;
      for (const c of clouds) {
        const a = c.a + time * 0.05;
        ctx.beginPath();
        ctx.ellipse(cx + Math.cos(a) * c.d * r, cy + Math.sin(a * 1.3) * c.d * r * 0.8, c.w * r, c.h * r, a * 0.5, 0, 6.283);
        ctx.fill();
      }
      // night side
      const night = ctx.createRadialGradient(cx - r * 0.45, cy - r * 0.45, r * 0.4, cx + r * 0.2, cy + r * 0.2, r * 1.15);
      night.addColorStop(0, "rgba(0,4,20,0)");
      night.addColorStop(1, "rgba(0,4,20,0.42)");
      ctx.fillStyle = night;
      ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
      ctx.restore();
    };

    let time = 0;
    const draw = (_, deltaMs) => {
      const dt = Math.min(deltaMs / 1000, 0.05);
      time += dt;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // a little persistence at high speed gives the streaks a glow
      ctx.fillStyle = S.speed > 2 ? "rgba(3,4,9,0.4)" : "#030409";
      ctx.fillRect(0, 0, w, h);

      const cx = w / 2, cy = h / 2, k = Math.max(w, h) * 0.2;

      // the planet sits behind the stars' rush but in front of the far field
      let pr = 0;
      if (S.planet > 0.001) {
        pr = Math.min(w, h) * (0.025 + 2.6 * Math.pow(S.planet, 3.2));
        planet(cx, cy, pr, time);
      }

      for (const s of stars) {
        s.z -= S.speed * dt;
        let sx = cx + (s.x / s.z) * k, sy = cy + (s.y / s.z) * k;
        if (s.z <= 0.02 || sx < -40 || sx > w + 40 || sy < -40 || sy > h + 40) {
          s.x = Math.random() * 2 - 1;
          s.y = Math.random() * 2 - 1;
          s.z = 1;
          continue;
        }
        // stars live behind the planet: never draw them across its disc
        if (pr && Math.hypot(sx - cx, sy - cy) < pr * 0.98) continue;
        const near = 1 - s.z;
        const col = s.t > 0.88 ? "255,210,160" : s.t < 0.2 ? "150,200,255" : "255,255,255";
        const a = Math.min(1, near * 1.5 + 0.2);
        if (S.speed > 0.6) {
          const z2 = Math.min(1.4, s.z + S.speed * 0.04);
          ctx.strokeStyle = `rgba(${col},${a})`;
          ctx.lineWidth = 0.6 + near * 1.8;
          ctx.beginPath();
          ctx.moveTo(cx + (s.x / z2) * k, cy + (s.y / z2) * k);
          ctx.lineTo(sx, sy);
          ctx.stroke();
        } else {
          ctx.fillStyle = `rgba(${col},${a})`;
          const px = 0.6 + near * 1.6;
          ctx.fillRect(sx, sy, px, px);
        }
      }

      if (S.flash > 0.001) {
        ctx.fillStyle = `rgba(214,238,255,${S.flash})`;
        ctx.fillRect(0, 0, w, h);
      }
    };
    gsap.ticker.add(draw);

    const ctxGsap = gsap.context(() => {
      const counter = { v: 0 };
      const tlm = gsap.timeline();
      tl.current = tlm;
      tlm
        // brand mark draws in while we idle
        .fromTo(".ld__path", { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.9, stagger: 0.15, ease: "power2.inOut" }, 0)
        // progress counter and bar run for the whole dive
        .to(counter, { v: 100, duration: 2.5, ease: "power1.inOut", onUpdate: () => { if (count.current) count.current.textContent = String(Math.round(counter.v)).padStart(3, "0"); } }, 0)
        .fromTo(".ld__bar i", { scaleX: 0 }, { scaleX: 1, duration: 2.5, ease: "power1.inOut" }, 0)
        // ignition -> warp
        .to(S, { speed: 5, duration: 1.2, ease: "power2.in" }, 0.85)
        // a planet appears far ahead and grows as we close in
        .to(S, { planet: 1, duration: 1.4, ease: "power2.in" }, 1.05)
        .to(S, { speed: 12, duration: 0.7, ease: "power2.in" }, 1.85)
        // plunge through the atmosphere
        .to(".ld__mark, .ld__hud", { opacity: 0, duration: 0.3, ease: "power1.in" }, 2.0)
        .to(S, { flash: 1, duration: 0.45, ease: "power2.in" }, 2.2)
        .call(onReady, null, 2.6)
        .to(root.current, { opacity: 0, scale: 1.05, duration: 0.6, ease: "power2.out" }, 2.6)
        .set(root.current, { display: "none" })
        .eventCallback("onComplete", onDone);
      STAGES.forEach(([t, text]) => tlm.call(() => { if (label.current) label.current.textContent = text; }, null, t));
    }, root);

    return () => {
      ctxGsap.revert();
      gsap.ticker.remove(draw);
      window.removeEventListener("resize", size);
    };
  }, [onReady, onDone]);

  const skip = () => {
    if (skipped) return;
    setSkipped(true);
    tl.current?.timeScale(4);
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.target.closest?.(".ld__sound")) return; // keyboard use of the sound button should not skip the intro
      skip();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <div ref={root} className="ld" onClick={skip} role="status" aria-label="Loading">
      <canvas ref={canvas} className="ld__canvas" aria-hidden="true" />
      <div className="ld__mark" aria-hidden="true">
        <svg viewBox="0 0 160 100" className="ld__svg">
          <path className="ld__path" pathLength="1" d="M52 16C22 6 8 36 32 47c24 11 20 42-16 35" />
          <path className="ld__path" pathLength="1" d="M92 12v76M92 12h26c26 0 26 36 0 36H92M118 48h8c28 0 28 40-4 40H92" />
        </svg>
      </div>
      <div className="ld__hud">
        <p className="ld__stage" ref={label} aria-hidden="true">Ignition</p>
        <div className="ld__meta">
          <span ref={count} aria-hidden="true">000</span>
          <button type="button" className="ld__skip ld__sound" aria-pressed={soundOn} onClick={(e) => { e.stopPropagation(); toggleSound(); }}>
            Sound {soundOn ? "on" : "off"}
          </button>
          <button type="button" className="ld__skip" onClick={skip}>Skip</button>
        </div>
        <div className="ld__bar" aria-hidden="true"><i /></div>
      </div>
    </div>
  );
}
