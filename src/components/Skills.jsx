import { useEffect, useRef } from 'react';
import { techEcosystem } from '../data/skills';

export default function Skills() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting)
          el.querySelectorAll('.reveal').forEach((c) => c.classList.add('visible'));
      },
      { threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      id="skills"
      ref={sectionRef}
      style={{ borderTop: '1px solid var(--line)', background: 'var(--ink)' }}
      aria-label="Technical skills"
    >
      {/* Header */}
      <div style={{ padding: 'var(--section-pad-y) var(--section-pad-x) clamp(32px, 5vw, 60px)' }}>
        <p className="section-num reveal">04</p>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' }}>
          <h2
            className="reveal reveal-delay-1"
            style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(48px, 8vw, 130px)', lineHeight: 0.92, color: 'var(--bone)' }}
          >
            SKILLS
          </h2>
          <p className="reveal reveal-delay-2" style={{ fontSize: '0.85rem', color: 'var(--gray)', maxWidth: 280, lineHeight: 1.6 }}>
            Technologies across the full stack — from AI pipelines to production APIs and interactive UIs.
          </p>
        </div>
      </div>

      {/* Skill groups as horizontal rows */}
      {techEcosystem.map((group, gi) => (
        <div
          key={group.group}
          className="reveal"
          style={{
            borderTop: '1px solid var(--line)',
            padding: 'clamp(20px, 3vw, 36px) var(--section-pad-x)',
            display: 'grid',
            gridTemplateColumns: '240px 1fr',
            gap: 'clamp(20px, 4vw, 60px)',
            alignItems: 'start',
            transitionDelay: `${gi * 0.07}s`,
          }}
        >
          {/* Group label */}
          <div>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(20px, 2.5vw, 36px)',
              lineHeight: 1,
              color: gi === 0 ? 'var(--lime)' : 'var(--bone)',
              marginBottom: 8,
            }}>
              {group.group.split('/')[0].trim()}
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.14em', color: 'var(--gray-dim)', lineHeight: 1.5 }}>
              {group.description}
            </div>
          </div>

          {/* Skills as pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, paddingTop: 4 }}>
            {group.items.map((skill, si) => (
              <span
                key={skill}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.68rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  padding: '8px 16px',
                  border: `1px solid ${si === 0 ? 'var(--lime)' : 'var(--line-strong)'}`,
                  borderRadius: 2,
                  color: si === 0 ? 'var(--lime)' : 'var(--bone-dim)',
                  background: si === 0 ? 'var(--lime-dim)' : 'transparent',
                  transition: 'all 0.2s',
                  cursor: 'default',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'var(--lime)';
                  e.currentTarget.style.color = 'var(--lime)';
                  e.currentTarget.style.background = 'var(--lime-dim)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = si === 0 ? 'var(--lime)' : 'var(--line-strong)';
                  e.currentTarget.style.color = si === 0 ? 'var(--lime)' : 'var(--bone-dim)';
                  e.currentTarget.style.background = si === 0 ? 'var(--lime-dim)' : 'transparent';
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
