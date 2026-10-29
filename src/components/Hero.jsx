import { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';

/* ─── Particle Canvas ───────────────────────────────────────────── */
function HeroCanvas() {
  const canvasRef = useRef(null);
  const stateRef  = useRef({ particles: [], mouse: { x: 0.5, y: 0.5 }, animId: null });

  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const state = stateRef.current;

    const LIME   = '199,255,61';
    const BONE   = '243,240,232';

    const spawnParticles = () => {
      state.particles = [];
      const count = Math.min(Math.floor(canvas.width * canvas.height / 8000), 120);
      for (let i = 0; i < count; i++) {
        state.particles.push({
          x:   Math.random() * canvas.width,
          y:   Math.random() * canvas.height,
          vx:  (Math.random() - 0.5) * 0.3,
          vy:  (Math.random() - 0.5) * 0.3,
          r:   Math.random() * 1.4 + 0.4,
          alpha: Math.random() * 0.5 + 0.15,
          lime: Math.random() < 0.12,
        });
      }
    };

    resize();
    spawnParticles();

    const onResize = () => { resize(); spawnParticles(); };
    window.addEventListener('resize', onResize, { passive: true });

    const onMouse = (e) => {
      const r = canvas.getBoundingClientRect();
      state.mouse.x = (e.clientX - r.left) / canvas.width;
      state.mouse.y = (e.clientY - r.top)  / canvas.height;
    };
    window.addEventListener('mousemove', onMouse, { passive: true });

    const CONN_DIST = 120;
    const MOUSE_FORCE = 60;

    const draw = () => {
      const { width: W, height: H } = canvas;
      ctx.clearRect(0, 0, W, H);

      const mx = state.mouse.x * W;
      const my = state.mouse.y * H;

      state.particles.forEach((p, i) => {
        // Mouse influence
        const dx = mx - p.x;
        const dy = my - p.y;
        const dist = Math.hypot(dx, dy);
        if (dist < MOUSE_FORCE) {
          const force = (MOUSE_FORCE - dist) / MOUSE_FORCE * 0.012;
          p.vx -= dx * force;
          p.vy -= dy * force;
        }

        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Friction
        p.vx *= 0.985;
        p.vy *= 0.985;

        // Wrap
        if (p.x < 0)  p.x = W;
        if (p.x > W)  p.x = 0;
        if (p.y < 0)  p.y = H;
        if (p.y > H)  p.y = 0;

        // Draw point
        const col = p.lime ? LIME : BONE;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${col},${p.alpha})`;
        ctx.fill();

        // Connect nearby particles
        for (let j = i + 1; j < state.particles.length; j++) {
          const q = state.particles[j];
          const ddx = q.x - p.x;
          const ddy = q.y - p.y;
          const d   = Math.hypot(ddx, ddy);
          if (d < CONN_DIST) {
            const a = (1 - d / CONN_DIST) * 0.18;
            const c = (p.lime || q.lime) ? LIME : BONE;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(${c},${a})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      });

      state.animId = requestAnimationFrame(draw);
    };

    state.animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(state.animId);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMouse);
    };
  }, [resize]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        opacity: 0.6,
      }}
      aria-hidden="true"
    />
  );
}

/* ─── Hero ──────────────────────────────────────────────────────── */
export default function Hero({ onOpenTerminal }) {
  const heroRef  = useRef(null);
  const name1Ref = useRef(null);
  const name2Ref = useRef(null);
  const metaRef  = useRef(null);
  const tagRef   = useRef(null);
  const scrollRef = useRef(null);
  const prefersReduced = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  useEffect(() => {
    if (prefersReduced) return;

    const tl = gsap.timeline({ delay: 0.2 });

    tl.fromTo(
      [name1Ref.current, name2Ref.current],
      { y: '105%' },
      {
        y: '0%',
        duration: 1.2,
        ease: 'expo.out',
        stagger: 0.08,
      }
    )
    .fromTo(
      [tagRef.current, metaRef.current],
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'expo.out',
        stagger: 0.12,
      },
      '-=0.7'
    )
    .fromTo(
      scrollRef.current,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'expo.out' },
      '-=0.4'
    );

    return () => tl.kill();
  }, [prefersReduced]);

  const handleScrollDown = () => {
    const next = document.querySelector('#work');
    if (next) next.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section id="hero" ref={heroRef} className="hero-section" aria-label="Hero">
      {/* Particle background */}
      <div className="hero-canvas-wrap" aria-hidden="true">
        <HeroCanvas />

        {/* Radial glow: lime bottom-left */}
        <div style={{
          position: 'absolute',
          bottom: '-10%',
          left: '-5%',
          width: 'clamp(300px, 50vw, 700px)',
          height: 'clamp(300px, 50vw, 700px)',
          background: 'radial-gradient(circle, rgba(199,255,61,0.07) 0%, transparent 65%)',
          pointerEvents: 'none',
        }} />
        {/* Subtle top-right glow */}
        <div style={{
          position: 'absolute',
          top: '-5%',
          right: '-5%',
          width: 'clamp(200px, 35vw, 500px)',
          height: 'clamp(200px, 35vw, 500px)',
          background: 'radial-gradient(circle, rgba(243,240,232,0.03) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
      </div>

      {/* Large ghost number */}
      <div className="hero-accent-num" aria-hidden="true">01</div>

      {/* Main content */}
      <div className="hero-content">
        {/* Name lines */}
        <div className="clip-wrap" style={{ lineHeight: 0 }}>
          <span
            ref={name1Ref}
            style={{
              display: 'block',
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(72px, 13vw, 210px)',
              lineHeight: 0.88,
              color: 'var(--bone)',
              transform: 'translateY(110%)',
            }}
            aria-hidden="true"
          >
            SAMAY
          </span>
        </div>
        <div className="clip-wrap" style={{ lineHeight: 0 }}>
          <span
            ref={name2Ref}
            style={{
              display: 'block',
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(72px, 13vw, 210px)',
              lineHeight: 0.88,
              color: 'transparent',
              WebkitTextStroke: '1.5px rgba(243,240,232,0.35)',
              transform: 'translateY(110%)',
            }}
            aria-hidden="true"
          >
            BHAVSAR
          </span>
        </div>

        {/* Hidden accessible h1 */}
        <h1 style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)' }}>
          Samay Bhavsar — Creative Developer & Engineer
        </h1>

        {/* Role row */}
        <div ref={tagRef} className="hero-role-row" style={{ opacity: 0 }}>
          <div>
            <p className="hero-tagline">
              I build digital experiences that move.<br />
              <span style={{ color: 'var(--gray-dim)' }}>Product Manager · Full-Stack Engineer · AI Builder</span>
            </p>
            <div style={{ display: 'flex', gap: 12, marginTop: 24, flexWrap: 'wrap' }}>
              <button
                onClick={() => { const el = document.querySelector('#work'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }}
                className="btn-primary"
                style={{ padding: '12px 24px', fontSize: '0.72rem' }}
              >
                View Work
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 5v14M5 12l7 7 7-7" />
                </svg>
              </button>
              <a
                href="mailto:samaybhavsar24oct@gmail.com"
                className="btn-secondary"
                style={{ padding: '11px 24px', fontSize: '0.72rem' }}
              >
                Get in Touch
              </a>
            </div>
          </div>

          <div ref={metaRef} className="hero-meta-row" style={{ opacity: 0 }}>
            <div className="hero-meta-item">
              <span className="hero-meta-value">Ahmedabad, IN</span>
              <span className="hero-meta-label">Location</span>
            </div>
            <div className="hero-meta-item">
              <span className="hero-meta-value">3 Platforms</span>
              <span className="hero-meta-label">Architected</span>
            </div>
            <div className="hero-meta-item">
              <span className="hero-meta-value" style={{ color: 'var(--lime)' }}>Available</span>
              <span className="hero-meta-label">For Work</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll CTA */}
      <div
        ref={scrollRef}
        className="hero-scroll-hint"
        style={{ opacity: 0, cursor: 'none' }}
        onClick={handleScrollDown}
        role="button"
        tabIndex={0}
        aria-label="Scroll to work section"
        onKeyDown={(e) => { if (e.key === 'Enter') handleScrollDown(); }}
      >
        <span className="label" style={{ fontSize: '0.58rem', writingMode: 'vertical-rl', letterSpacing: '0.2em' }}>
          SCROLL
        </span>
        <div className="scroll-line" />
      </div>

      {/* Terminal hint */}
      <button
        onClick={onOpenTerminal}
        aria-label="Open SamayOS Terminal (press backtick)"
        style={{
          position: 'absolute',
          bottom: 'clamp(24px, 4vw, 48px)',
          left: 'var(--section-pad-x)',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.62rem',
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: 'var(--gray-dim)',
          background: 'none',
          border: '1px solid var(--line)',
          padding: '8px 14px',
          borderRadius: '2px',
          cursor: 'none',
          outline: 'none',
          transition: 'all 0.2s',
          zIndex: 2,
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = 'var(--lime)';
          e.currentTarget.style.color = 'var(--lime)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = 'var(--line)';
          e.currentTarget.style.color = 'var(--gray-dim)';
        }}
      >
        ` SamayOS
      </button>
    </section>
  );
}
