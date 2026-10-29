import { useEffect, useRef } from 'react';

/* ════════════════════════════════════════════════
   EXPERIMENT 1: Magnetic Type Field
   ════════════════════════════════════════════════ */
function MagneticTypeExperiment() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    const mouse = { x: -9999, y: -9999 };
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789∆∞Σ∂λ'.split('');
    let grid = [];

    const COLS = 20;
    const ROWS = 12;
    const FORCE_RADIUS = 100;

    const build = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      const cw = canvas.width  / COLS;
      const ch = canvas.height / ROWS;
      grid = [];

      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          grid.push({
            x:     c * cw + cw / 2,
            y:     r * ch + ch / 2,
            ox:    c * cw + cw / 2,
            oy:    r * ch + ch / 2,
            char:  chars[Math.floor(Math.random() * chars.length)],
            alpha: Math.random() * 0.3 + 0.05,
            size:  Math.random() * 6 + 8,
          });
        }
      }
    };

    build();
    const ro = new ResizeObserver(build);
    ro.observe(canvas);

    const onMouse = (e) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    };
    const onLeave = () => { mouse.x = -9999; mouse.y = -9999; };
    canvas.addEventListener('mousemove', onMouse);
    canvas.addEventListener('mouseleave', onLeave);

    let t = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      t += 0.008;

      grid.forEach((cell) => {
        const dx   = mouse.x - cell.ox;
        const dy   = mouse.y - cell.oy;
        const dist = Math.hypot(dx, dy);
        const pull = Math.max(0, 1 - dist / FORCE_RADIUS);

        cell.x = cell.ox + dx * pull * 0.45;
        cell.y = cell.oy + dy * pull * 0.45;

        // Flicker near mouse
        const a = pull > 0.1
          ? cell.alpha + pull * 0.6
          : cell.alpha + Math.sin(t * 2 + cell.ox) * 0.04;

        // Char swap on strong pull
        if (pull > 0.6 && Math.random() < 0.04) {
          cell.char = chars[Math.floor(Math.random() * chars.length)];
        }

        const lime = pull > 0.3;
        ctx.fillStyle = lime
          ? `rgba(199,255,61,${Math.min(a, 0.95)})`
          : `rgba(243,240,232,${Math.min(a, 0.4)})`;
        ctx.font = `${cell.size + pull * 8}px "IBM Plex Mono", monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(cell.char, cell.x, cell.y);
      });

      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
      canvas.removeEventListener('mousemove', onMouse);
      canvas.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className="experiment-canvas" style={{ cursor: 'none' }} aria-label="Magnetic type field experiment" />;
}

/* ════════════════════════════════════════════════
   EXPERIMENT 2: Morphing Geometry
   ════════════════════════════════════════════════ */
function MorphingGeometry() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let mx = 0.5, my = 0.5;

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const onMouse = (e) => {
      const r = canvas.getBoundingClientRect();
      mx = (e.clientX - r.left) / canvas.width;
      my = (e.clientY - r.top)  / canvas.height;
    };
    canvas.addEventListener('mousemove', onMouse);

    // Build polygon points that morph between shapes
    const makeShape = (n, W, H, t, noise) => {
      const cx = W / 2;
      const cy = H / 2;
      const baseR = Math.min(W, H) * 0.32;
      const pts = [];

      for (let i = 0; i < n; i++) {
        const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
        const phase = (i / n) * Math.PI * 2;
        const r = baseR + Math.sin(t * 0.7 + phase * 2) * baseR * noise;
        pts.push({
          x: cx + Math.cos(angle) * r,
          y: cy + Math.sin(angle) * r,
        });
      }
      return pts;
    };

    let t = 0;
    const draw = () => {
      const W = canvas.width;
      const H = canvas.height;
      t += 0.01;

      ctx.clearRect(0, 0, W, H);

      // Layers of morphing polygons
      const layers = [
        { sides: 3 + Math.round(Math.sin(t * 0.4) * 2 + 2), noise: 0.2, alpha: 0.18, lime: true  },
        { sides: 6,                                           noise: 0.12, alpha: 0.1,  lime: false },
        { sides: 12,                                          noise: 0.06, alpha: 0.07, lime: false },
      ];

      layers.forEach(({ sides, noise, alpha, lime }, li) => {
        const pts = makeShape(Math.max(3, Math.round(sides)), W, H, t + li * 1.5, noise);
        ctx.beginPath();
        pts.forEach((p, i) => {
          if (i === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        });
        ctx.closePath();

        // Mouse tilt
        const dx = (mx - 0.5) * 30;
        const dy = (my - 0.5) * 20;
        ctx.save();
        ctx.translate(dx * (li + 1) * 0.3, dy * (li + 1) * 0.3);

        const col = lime ? `199,255,61` : `243,240,232`;
        ctx.strokeStyle = `rgba(${col},${alpha * 3})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Fill the innermost
        if (li === 0) {
          ctx.fillStyle = `rgba(${col},${alpha})`;
          ctx.fill();
        }
        ctx.restore();
      });

      // Center dot
      ctx.beginPath();
      ctx.arc(W/2 + (mx - 0.5)*20, H/2 + (my - 0.5)*20, 3, 0, Math.PI*2);
      ctx.fillStyle = 'rgba(199,255,61,0.8)';
      ctx.fill();

      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
      canvas.removeEventListener('mousemove', onMouse);
    };
  }, []);

  return <canvas ref={canvasRef} className="experiment-canvas" style={{ cursor: 'none' }} aria-label="Morphing geometry experiment" />;
}

/* ════════════════════════════════════════════════
   EXPERIMENT 3: Cursor Particle Trail
   ════════════════════════════════════════════════ */
function ParticleTrail() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const particles = [];
    let mx = canvas.width / 2;
    let my = canvas.height / 2;
    let prevMx = mx, prevMy = my;

    const onMouse = (e) => {
      const r = canvas.getBoundingClientRect();
      mx = e.clientX - r.left;
      my = e.clientY - r.top;
    };
    canvas.addEventListener('mousemove', onMouse);

    const LIME_HUE    = '199,255,61';
    const BONE_HUE    = '243,240,232';
    const MAX_PARTICLES = 200;

    const draw = () => {
      const W = canvas.width;
      const H = canvas.height;

      // Fade trail
      ctx.fillStyle = 'rgba(8,8,8,0.12)';
      ctx.fillRect(0, 0, W, H);

      // Emit particles on mouse move
      const speed = Math.hypot(mx - prevMx, my - prevMy);
      const count = Math.min(Math.ceil(speed * 0.5), 6);

      for (let i = 0; i < count; i++) {
        if (particles.length < MAX_PARTICLES) {
          particles.push({
            x:     mx,
            y:     my,
            vx:    (Math.random() - 0.5) * speed * 0.3,
            vy:    (Math.random() - 0.5) * speed * 0.3 - 0.5,
            life:  1,
            decay: Math.random() * 0.025 + 0.015,
            r:     Math.random() * 3 + 1,
            lime:  Math.random() < 0.3,
          });
        }
      }

      prevMx = mx; prevMy = my;

      // Update & draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life -= p.decay;
        if (p.life <= 0) { particles.splice(i, 1); continue; }

        p.x  += p.vx;
        p.y  += p.vy;
        p.vy += 0.04; // gravity
        p.vx *= 0.97;

        const col = p.lime ? LIME_HUE : BONE_HUE;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * p.life, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${col},${p.life * 0.8})`;
        ctx.fill();
      }

      // Ambient auto-particles when idle
      if (Math.random() < 0.06) {
        const angle = Math.random() * Math.PI * 2;
        const rad   = Math.random() * 40 + 20;
        particles.push({
          x: mx + Math.cos(angle) * rad,
          y: my + Math.sin(angle) * rad,
          vx: Math.cos(angle) * 0.3,
          vy: Math.sin(angle) * 0.3 - 0.4,
          life:  0.6,
          decay: 0.012,
          r:     1,
          lime:  true,
        });
      }

      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
      canvas.removeEventListener('mousemove', onMouse);
    };
  }, []);

  return <canvas ref={canvasRef} className="experiment-canvas" style={{ cursor: 'none' }} aria-label="Particle trail experiment" />;
}

/* ════════════════════════════════════════════════
   PLAYGROUND SECTION
   ════════════════════════════════════════════════ */
const EXPERIMENTS = [
  {
    title: 'Magnetic Type',
    label: 'Interactive · Move Cursor',
    component: MagneticTypeExperiment,
  },
  {
    title: 'Morphing Geometry',
    label: 'Generative · Reactive',
    component: MorphingGeometry,
  },
  {
    title: 'Particle Trail',
    label: 'Canvas · Move Cursor',
    component: ParticleTrail,
  },
];

export default function Playground() {
  const headerRef = useRef(null);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting)
          el.querySelectorAll('.reveal').forEach((c) => c.classList.add('visible'));
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      id="playground"
      style={{ paddingTop: 'var(--section-pad-y)', paddingBottom: 'var(--section-pad-y)', background: 'var(--surface)' }}
      aria-label="Interactive playground"
    >
      {/* Header */}
      <div ref={headerRef} className="section-header" style={{ marginBottom: 'clamp(32px, 5vw, 60px)' }}>
        <div>
          <p className="section-num reveal">03</p>
          <h2 className="section-title reveal reveal-delay-1">
            PLAY<br />
            <span style={{ color: 'transparent', WebkitTextStroke: '1.5px rgba(243,240,232,0.25)' }}>GROUND</span>
          </h2>
        </div>
        <p className="reveal reveal-delay-2" style={{
          maxWidth: 280,
          fontSize: '0.85rem',
          color: 'var(--gray)',
          lineHeight: 1.6,
        }}>
          Three live interactive experiments.<br />
          Move your cursor inside each one.
        </p>
      </div>

      {/* Grid */}
      <div className="playground-grid">
        {EXPERIMENTS.map(({ title, label, component: Exp }) => (
          <div key={title} className="experiment-card">
            <Exp />
            <div className="experiment-info">
              <div className="experiment-title">{title}</div>
              <div className="experiment-label">{label}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
