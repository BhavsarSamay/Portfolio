import { useEffect, useRef } from 'react';
import { techEcosystem } from '../data/skills';

const SKILL_GROUPS = techEcosystem;

export default function About() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting)
          el.querySelectorAll('.reveal').forEach((c) => c.classList.add('visible'));
      },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      style={{ padding: 'var(--section-pad-y) var(--section-pad-x)', borderTop: '1px solid var(--line)' }}
      aria-label="About Samay"
    >
      {/* Section number + title */}
      <div style={{ marginBottom: 'clamp(40px, 6vw, 80px)' }}>
        <p className="section-num reveal">04</p>
        <h2
          className="reveal reveal-delay-1"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(48px, 8vw, 130px)',
            lineHeight: 0.92,
            color: 'var(--bone)',
          }}
        >
          ABOUT
        </h2>
      </div>

      {/* Two-column editorial layout */}
      <div className="about-grid">
        {/* Left: big statement */}
        <div>
          <p
            className="about-statement reveal reveal-delay-2"
            style={{ marginBottom: 'clamp(24px, 4vw, 48px)' }}
          >
            I ARCHITECT<br />
            <span className="accent">SYSTEMS</span><br />
            THAT ACTUALLY<br />
            <span style={{ color: 'transparent', WebkitTextStroke: '1.5px rgba(243,240,232,0.35)' }}>WORK.</span>
          </p>

          {/* Profile image placeholder — editorial circle */}
          <div
            className="reveal reveal-delay-3"
            style={{
              position: 'relative',
              width: 'clamp(140px, 22vw, 260px)',
              height: 'clamp(140px, 22vw, 260px)',
              borderRadius: '50%',
              border: '1px solid var(--line-strong)',
              overflow: 'hidden',
            }}
          >
            <img
              src="/samay-profile.jpeg"
              alt="Samay Bhavsar"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              loading="lazy"
            />
            {/* Lime tint overlay on hover */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(199,255,61,0)',
              transition: 'background 0.3s',
              mixBlendMode: 'color',
            }} />
          </div>
        </div>

        {/* Right: bio + skills */}
        <div style={{ paddingTop: 'clamp(0px, 3vw, 40px)' }}>
          <div
            className="reveal reveal-delay-2"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 24,
            }}
          >
            <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--lime)', animation: 'pulseLime 2s ease-in-out infinite' }} />
            <span className="eyebrow">Ahmedabad, Gujarat, India</span>
          </div>

          <p className="about-bio reveal reveal-delay-3">
            I'm a Product Manager & Full-Stack Engineer at{' '}
            <strong style={{ color: 'var(--bone)' }}>Veracity Supply Chain Limited</strong>, where I design
            end-to-end systems architecture for gig workforce, recruitment, and payroll platforms.
          </p>

          <p className="about-bio reveal reveal-delay-4" style={{ marginTop: 16 }}>
            Previously at{' '}
            <strong style={{ color: 'var(--bone)' }}>Saturncube Technology</strong>, I built autonomous
            LangChain agentic systems, real-time trading engines with Socket.io, and microservices
            architectures — earning <em style={{ color: 'var(--lime)', fontStyle: 'normal' }}>Star Performer of the Month</em> in February 2026.
          </p>

          <p className="about-bio reveal reveal-delay-5" style={{ marginTop: 16 }}>
            I operate at the intersection of product thinking, systems engineering, and creative development.
            I work across the full lifecycle — from system design and API contracts to interactive
            frontend experiences and AI pipelines.
          </p>

          {/* Skill groups */}
          <div style={{ marginTop: 'clamp(32px, 5vw, 56px)' }}>
            {SKILL_GROUPS.map((group, gi) => (
              <div
                key={group.group}
                className="reveal"
                style={{
                  marginBottom: 24,
                  transitionDelay: `${0.2 + gi * 0.08}s`,
                }}
              >
                <div className="skill-group-title">{group.group}</div>
                <div className="about-skills-cloud">
                  {group.items.map((skill) => (
                    <span key={skill} className="skill-pill">{skill}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Education */}
          <div
            className="reveal"
            style={{
              marginTop: 'clamp(24px, 4vw, 40px)',
              padding: '20px 24px',
              border: '1px solid var(--line)',
              borderRadius: 2,
              borderLeft: '2px solid var(--lime)',
            }}
          >
            <div className="eyebrow" style={{ marginBottom: 8 }}>Education</div>
            <div style={{ fontSize: '0.9rem', color: 'var(--bone)', fontWeight: 600 }}>
              Bachelor of Information Technology
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--gray)', marginTop: 4 }}>
              LJ Institute of Engineering and Technology · Nov 2022 – Present
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--lime)', marginTop: 6, letterSpacing: '0.1em' }}>
              CPI: 8.45 / 10.0
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
