import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';

const NAV_LINKS = [
  { label: 'Work',       href: '#work' },
  { label: 'Playground', href: '#playground' },
  { label: 'About',      href: '#about' },
  { label: 'Experience', href: '#experience' },
  { label: 'Contact',    href: '#contact' },
];

export default function Navbar({ onOpenResume }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const navRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Scrolled state
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Active section via IntersectionObserver
  useEffect(() => {
    const sections = document.querySelectorAll('section[id]');
    if (!sections.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveSection(e.target.id);
        });
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );

    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  // Animate mobile menu items on open/close
  useEffect(() => {
    const items = mobileMenuRef.current?.querySelectorAll('.mobile-nav-link');
    if (!items) return;

    if (menuOpen) {
      document.body.style.overflow = 'hidden';
      gsap.to(items, {
        x: 0,
        opacity: 1,
        stagger: 0.06,
        duration: 0.5,
        ease: 'expo.out',
        delay: 0.1,
      });
    } else {
      document.body.style.overflow = '';
      gsap.to(items, {
        x: -30,
        opacity: 0,
        stagger: 0.03,
        duration: 0.3,
        ease: 'expo.in',
      });
    }
  }, [menuOpen]);

  // Keyboard close
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setMenuOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const handleNavClick = (href) => {
    setMenuOpen(false);
    setTimeout(() => {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 300);
  };

  return (
    <>
      <nav
        ref={navRef}
        className={`navbar ${scrolled ? 'scrolled' : ''}`}
        aria-label="Primary navigation"
      >
        {/* Logo */}
        <a
          href="#hero"
          className="nav-logo"
          onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          aria-label="Samay Bhavsar — back to top"
        >
          S<span>B</span>
        </a>

        {/* Desktop links */}
        <ul className="nav-links" role="list">
          {NAV_LINKS.map(({ label, href }) => (
            <li key={href}>
              <a
                href={href}
                className={`nav-link ${activeSection === href.slice(1) ? 'active' : ''}`}
                onClick={(e) => { e.preventDefault(); handleNavClick(href); }}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <button
          className="nav-cta"
          onClick={onOpenResume}
          aria-label="View resume"
        >
          Resume
        </button>

        {/* Hamburger */}
        <button
          className={`hamburger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen((p) => !p)}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      {/* Mobile full-screen menu */}
      <div
        ref={mobileMenuRef}
        className={`mobile-menu ${menuOpen ? 'open' : ''}`}
        aria-hidden={!menuOpen}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        {/* Eyebrow */}
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.62rem',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: 'var(--gray)',
          marginBottom: 'clamp(32px, 5vw, 60px)',
        }}>
          Navigation
        </div>

        {NAV_LINKS.map(({ label, href }, i) => (
          <a
            key={href}
            href={href}
            className="mobile-nav-link"
            onClick={(e) => { e.preventDefault(); handleNavClick(href); }}
            style={{ transitionDelay: menuOpen ? `${i * 0.06 + 0.1}s` : '0s' }}
            tabIndex={menuOpen ? 0 : -1}
          >
            {label}
          </a>
        ))}

        {/* Footer meta */}
        <div style={{
          position: 'absolute',
          bottom: 'clamp(32px, 5vw, 60px)',
          left: 'var(--section-pad-x)',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.14em', color: 'var(--gray-dim)' }}>
            © 2026 Samay Bhavsar
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.14em', color: 'var(--gray-dim)' }}>
            Ahmedabad, India
          </div>
        </div>
      </div>
    </>
  );
}
