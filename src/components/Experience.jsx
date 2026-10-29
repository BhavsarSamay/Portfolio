import { useEffect, useRef } from 'react';
import { experience, education } from '../data/experience';

export default function Experience() {
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
      id="experience"
      ref={sectionRef}
      style={{ padding: 'var(--section-pad-y) var(--section-pad-x)', borderTop: '1px solid var(--line)' }}
      aria-label="Professional experience"
    >
      {/* Header */}
      <div style={{ marginBottom: 'clamp(40px, 6vw, 80px)' }}>
        <p className="section-num reveal">05</p>
        <h2
          className="reveal reveal-delay-1"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(48px, 8vw, 130px)',
            lineHeight: 0.92,
            color: 'var(--bone)',
          }}
        >
          CAREER
        </h2>
      </div>

      {/* Experience rows */}
      {experience.map((exp, i) => (
        <div
          key={exp.id}
          className={`experience-row reveal`}
          style={{ transitionDelay: `${i * 0.12}s` }}
        >
          {/* Left: period */}
          <div className="exp-period">
            {exp.status && (
              <div className="exp-current">{exp.status}</div>
            )}
            <div>{exp.period}</div>
          </div>

          {/* Right: details */}
          <div>
            <h3 className="exp-role">{exp.role}</h3>
            <div className="exp-company">{exp.company}</div>
            {exp.subrole && (
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                fontFamily: 'var(--font-mono)',
                fontSize: '0.65rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--lime)',
                marginBottom: 20,
              }}>
                <span style={{ display: 'inline-block', width: 4, height: 4, borderRadius: '50%', background: 'var(--lime)' }} />
                {exp.subrole}
              </div>
            )}

            <ul className="exp-points" role="list">
              {exp.points.map((pt, pi) => (
                <li key={pi} className="exp-point">{pt}</li>
              ))}
            </ul>

            {/* Tech tags */}
            <div className="exp-tech-row">
              {exp.tech.map((t) => (
                <span key={t} className="tech-tag">{t}</span>
              ))}
            </div>
          </div>
        </div>
      ))}

      {/* Education block */}
      <div
        className="experience-row reveal"
        style={{ transitionDelay: `${experience.length * 0.12}s` }}
      >
        <div className="exp-period">
          <div className="exp-current" style={{ color: 'var(--gray)', borderColor: 'var(--line)' }}>
            EDUCATION
          </div>
          <div>{education.period}</div>
        </div>
        <div>
          <h3 className="exp-role" style={{ fontSize: 'clamp(20px, 3vw, 40px)' }}>{education.degree}</h3>
          <div className="exp-company">{education.school}</div>
          <p style={{ fontSize: '0.85rem', color: 'var(--gray)', lineHeight: 1.6, marginTop: 12 }}>
            {education.details}
          </p>
        </div>
      </div>
    </section>
  );
}
