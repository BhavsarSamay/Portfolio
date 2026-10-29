import { useState, useRef, useEffect, useCallback } from 'react';
import { earlierProjects } from '../data/projects';
import gsap from 'gsap';

/* ── Project visual: animated canvas cover ────────────────────── */
function ProjectVisual({ project, hovered }) {
  const canvasRef = useRef(null);
  const rafRef    = useRef(null);
  const tRef      = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // Each project gets a distinct color theme
    const palettes = {
      'siteassist':     { a: '#C7FF3D', bg: '#0a1500' },
      'agentic-ai':     { a: '#FF6B6B', bg: '#1a0500' },
      'cosmicquest':    { a: '#7C9EFF', bg: '#00081a' },
      'echoing-ideas':  { a: '#FFD166', bg: '#1a1200' },
      'bizcart':        { a: '#06D6A0', bg: '#001510' },
      'microservices':  { a: '#BF5FFF', bg: '#0a0015' },
    };
    const pal = palettes[project.id] || { a: '#C7FF3D', bg: '#0a1500' };
    const bRgb = '10,10,10';

    const hexToRgb = (hex) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `${r},${g},${b}`;
    };
    const aRgb = hexToRgb(pal.a);

    const draw = (ts) => {
      tRef.current = ts * 0.001;
      const t = tRef.current;
      const W = canvas.width;
      const H = canvas.height;

      // Dark background with palette tint
      ctx.fillStyle = pal.bg;
      ctx.fillRect(0, 0, W, H);

      // Animated grid lines
      const gridStep = 40;
      const offset   = (t * 20) % gridStep;
      ctx.strokeStyle = `rgba(${aRgb},0.06)`;
      ctx.lineWidth = 0.5;
      for (let x = -gridStep + (offset % gridStep); x < W + gridStep; x += gridStep) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.stroke();
      }
      for (let y = -gridStep + (offset % gridStep); y < H + gridStep; y += gridStep) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }

      // Floating orbs
      const orbCount = 4;
      for (let i = 0; i < orbCount; i++) {
        const phase = (i / orbCount) * Math.PI * 2;
        const ox = W * 0.5 + Math.cos(t * 0.4 + phase) * W * 0.3;
        const oy = H * 0.5 + Math.sin(t * 0.3 + phase * 1.3) * H * 0.3;
        const r  = W * 0.18 + Math.sin(t + phase) * W * 0.05;
        const grd = ctx.createRadialGradient(ox, oy, 0, ox, oy, r);
        grd.addColorStop(0, `rgba(${aRgb},${hovered ? 0.32 : 0.18})`);
        grd.addColorStop(0.5, `rgba(${aRgb},${hovered ? 0.12 : 0.06})`);
        grd.addColorStop(1, `rgba(${aRgb},0)`);
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(ox, oy, r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Project id text watermark
      ctx.font = `bold clamp(40px,8vw,80px) "Bebas Neue", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = `rgba(${aRgb},${hovered ? 0.12 : 0.05})`;
      const idText = project.id.toUpperCase().replace(/-/g, ' ');
      ctx.font = `700 ${Math.min(W * 0.14, 64)}px "Bebas Neue", sans-serif`;
      ctx.fillText(idText, W / 2, H / 2);

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, [project.id, hovered]);

  return (
    <canvas
      ref={canvasRef}
      className="project-visual-canvas"
      aria-hidden="true"
    />
  );
}

/* ── Project Row ───────────────────────────────────────────────── */
function ProjectRow({ project, index, isEven }) {
  const [hovered, setHovered] = useState(false);
  const rowRef = useRef(null);

  // Reveal on scroll
  useEffect(() => {
    const el = rowRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) el.classList.add('project-row-visible'); },
      { threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const techLimit = 4;
  const shownTech = project.tech?.slice(0, techLimit) || [];
  const extra     = (project.tech?.length || 0) - techLimit;

  // GitHub / live link
  const link = project.githubUrl || project.href || '#';

  return (
    <article
      ref={rowRef}
      className="project-row"
      style={{
        opacity: 0,
        transform: 'translateY(30px)',
        transition: 'opacity 0.7s var(--ease-out-expo), transform 0.7s var(--ease-out-expo)',
        transitionDelay: `${index * 0.08}s`,
        gridTemplateColumns: isEven ? '1fr 1fr' : '1fr 1fr',
        '--row-even': isEven ? 1 : 0,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Text side */}
      <div className="project-row-num" style={{ order: isEven ? 0 : 1 }}>
        <div>
          <div className="project-num">{String(index + 1).padStart(2, '0')}</div>
          <div className="project-row-category" style={{ marginTop: 20 }}>{project.category}</div>
          <h3 className="project-row-title">{project.title.split(':')[0]}</h3>
          {project.title.includes(':') && (
            <p style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.65rem',
              letterSpacing: '0.12em',
              color: 'var(--gray-dim)',
              marginTop: 8,
              textTransform: 'uppercase',
            }}>
              {project.title.split(':')[1]?.trim()}
            </p>
          )}
        </div>

        <div>
          <p className="project-row-desc">{project.tagline}</p>

          <div className="project-row-tech">
            {shownTech.map((t) => (
              <span key={t} className="tech-tag">{t}</span>
            ))}
            {extra > 0 && (
              <span className="tech-tag" style={{ color: 'var(--lime)', borderColor: 'var(--line-lime)' }}>
                +{extra}
              </span>
            )}
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 20, flexWrap: 'wrap' }}>
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
              style={{ padding: '8px 16px', fontSize: '0.65rem' }}
              data-cursor-label="View"
            >
              GitHub ↗
            </a>
          </div>
        </div>
      </div>

      {/* Visual side */}
      <div className="project-row-visual" style={{ order: isEven ? 1 : 0, minHeight: 280 }}>
        <ProjectVisual project={project} hovered={hovered} />

        {/* Hover arrow */}
        <div className="project-row-link" aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M7 17L17 7M7 7h10v10" />
          </svg>
        </div>
      </div>
    </article>
  );
}

/* ── Projects Section ──────────────────────────────────────────── */
const CATEGORIES = ['All', 'AI & LLM', 'Full-Stack', 'Product Systems'];

export default function Projects() {
  const [active, setActive] = useState('All');
  const headerRef = useRef(null);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.querySelectorAll('.reveal').forEach((c) => c.classList.add('visible'));
        }
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const filtered = active === 'All'
    ? earlierProjects
    : earlierProjects.filter((p) =>
        p.category?.toLowerCase().includes(active.toLowerCase().split(' ')[0].toLowerCase())
      );

  return (
    <section id="work" className="projects-section" aria-label="Selected work">
      {/* Header */}
      <div ref={headerRef} className="projects-header">
        <div>
          <p className="section-num reveal">02</p>
          <h2 className="section-title reveal reveal-delay-1">
            SELECTED<br />
            <span style={{ color: 'transparent', WebkitTextStroke: '1.5px rgba(243,240,232,0.3)' }}>WORK</span>
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-end' }}>
          <p className="reveal reveal-delay-2" style={{
            fontSize: '0.85rem',
            color: 'var(--gray)',
            maxWidth: 280,
            lineHeight: 1.6,
            textAlign: 'right',
          }}>
            Production systems and full-stack projects from real engineering work.
          </p>

          <div className="project-filters reveal reveal-delay-3">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`filter-btn ${active === cat ? 'active' : ''}`}
                onClick={() => setActive(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Project rows */}
      <div role="list">
        {filtered.map((project, i) => (
          <ProjectRow
            key={project.id}
            project={project}
            index={i}
            isEven={i % 2 === 0}
          />
        ))}
      </div>

      {/* Footer link */}
      <div style={{
        padding: 'clamp(32px, 5vw, 60px) var(--section-pad-x)',
        display: 'flex',
        justifyContent: 'center',
      }}>
        <a
          href="https://github.com/BhavsarSamay"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary"
          data-cursor-label="GitHub"
        >
          <span>All Projects on GitHub</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M7 17L17 7M7 7h10v10" />
          </svg>
        </a>
      </div>
    </section>
  );
}

/* Add visible style via JS (IntersectionObserver sets it) */
const style = document.createElement('style');
style.textContent = `.project-row-visible { opacity: 1 !important; transform: none !important; }`;
document.head.appendChild(style);
