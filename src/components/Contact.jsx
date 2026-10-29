import { useEffect, useRef } from 'react';
import { samayProfile } from '../data/samayProfile';

export default function Contact() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting)
          el.querySelectorAll('.reveal').forEach((c) => c.classList.add('visible'));
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="contact-section"
      aria-label="Contact Samay"
    >
      {/* Section num */}
      <p className="section-num reveal" style={{ marginBottom: 'clamp(24px, 4vw, 48px)' }}>06</p>

      {/* Big closing text */}
      <h2 className="contact-big-text reveal reveal-delay-1" aria-label="Let's make something that matters">
        <span style={{ display: 'block' }}>LET'S MAKE</span>
        <span className="line-outline">SOMETHING</span>
        <span className="line-lime">THAT MATTERS.</span>
      </h2>

      {/* Sub copy */}
      <p
        className="reveal reveal-delay-2"
        style={{
          fontSize: 'clamp(14px, 1.2vw, 16px)',
          color: 'var(--gray)',
          maxWidth: 440,
          lineHeight: 1.7,
          marginTop: 'clamp(24px, 4vw, 40px)',
        }}
      >
        Whether it's a complex backend system, an AI-powered product, or something
        you haven't quite figured out yet — I'm interested. Let's talk.
      </p>

      {/* Actions */}
      <div className="contact-actions reveal reveal-delay-3">
        {/* Email CTA */}
        <a
          href={`mailto:${samayProfile.email}`}
          className="btn-primary"
          aria-label="Send email to Samay"
          data-cursor-label="Email"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 4h16v16H4z" rx="2" />
            <path d="m22 6-10 7L2 6" />
          </svg>
          <span>{samayProfile.email}</span>
        </a>

        {/* LinkedIn */}
        <a
          href={samayProfile.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary"
          aria-label="LinkedIn profile"
          data-cursor-label="LinkedIn"
        >
          LinkedIn ↗
        </a>

        {/* GitHub */}
        <a
          href={samayProfile.github}
          target="_blank"
          rel="noopener noreferrer"
          className="social-link"
          aria-label="GitHub profile"
          data-cursor-label="GitHub"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
          </svg>
        </a>
      </div>

      {/* Direct contact info */}
      <div
        className="reveal reveal-delay-4"
        style={{
          marginTop: 'clamp(40px, 6vw, 80px)',
          display: 'flex',
          gap: 'clamp(24px, 5vw, 60px)',
          flexWrap: 'wrap',
          paddingTop: 'clamp(24px, 4vw, 40px)',
          borderTop: '1px solid var(--line)',
        }}
      >
        <div>
          <div className="label" style={{ marginBottom: 6 }}>Phone</div>
          <a
            href={`tel:${samayProfile.phone.replace(/\s/g, '')}`}
            style={{ fontSize: '0.85rem', color: 'var(--bone)', transition: 'color 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--lime)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--bone)'}
          >
            {samayProfile.phone}
          </a>
        </div>
        <div>
          <div className="label" style={{ marginBottom: 6 }}>Location</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--bone)' }}>{samayProfile.location}</div>
        </div>
        <div>
          <div className="label" style={{ marginBottom: 6 }}>Current Role</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--bone)' }}>{samayProfile.companyRole}</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--gray)', marginTop: 2 }}>
            {samayProfile.company}
          </div>
        </div>
      </div>

      {/* Background glow */}
      <div aria-hidden="true" style={{
        position: 'absolute',
        bottom: '0',
        right: '5%',
        width: 'clamp(200px, 40vw, 600px)',
        height: 'clamp(200px, 40vw, 600px)',
        background: 'radial-gradient(circle, rgba(199,255,61,0.05) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />
    </section>
  );
}
