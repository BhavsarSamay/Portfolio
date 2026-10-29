import { useState, useEffect } from 'react';
import Lenis from 'lenis';

/* ─── Layout ─────────────────────────── */
import CustomCursor  from './components/CustomCursor';
import Loader        from './components/Loader';
import Navbar        from './components/Navbar';
import Hero          from './components/Hero';
import MarqueeStrip  from './components/MarqueeStrip';

/* ─── Sections ───────────────────────── */
import Projects    from './components/Projects';
import Playground  from './components/Playground';
import About       from './components/About';
import Experience  from './components/Experience';
import Contact     from './components/Contact';
import Footer      from './components/Footer';

/* ─── Modals / Overlays ──────────────── */
import TerminalDrawer from './components/TerminalDrawer';
import AIChatModal    from './components/AIChatModal';
import ResumeModal    from './components/ResumeModal';

/* ─── Utils ──────────────────────────── */
import { playCyberChirp } from './utils/soundEffects';
import { Bot } from 'lucide-react';

/* ============================================================
   APP
   ============================================================ */
export default function App() {
  const [loaderDone,    setLoaderDone]    = useState(false);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [isChatOpen,    setIsChatOpen]    = useState(false);
  const [isResumeOpen,  setIsResumeOpen]  = useState(false);

  /* ── Lenis smooth scroll ────────────────────────────────── */
  useEffect(() => {
    if (!loaderDone) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const lenis = new Lenis({
      lerp: 0.085,
      smoothWheel: true,
      wheelMultiplier: 1.0,
      prevent: (node) => !!node.closest?.('[data-lenis-prevent]'),
    });

    window.__lenis = lenis;

    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    return () => {
      window.__lenis = null;
      lenis.destroy();
    };
  }, [loaderDone]);

  /* ── Global hotkey: backtick → terminal ─────────────────── */
  useEffect(() => {
    const onKey = (e) => {
      const active   = document.activeElement;
      const isTyping = active?.tagName === 'INPUT'
                    || active?.tagName === 'TEXTAREA'
                    || active?.isContentEditable;
      if (e.key === '`' && !isTyping) {
        e.preventDefault();
        playCyberChirp();
        setIsTerminalOpen((p) => !p);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      {/* ── Custom cursor (desktop only) ────────────────── */}
      <CustomCursor />

      {/* ── Cinematic loader ─────────────────────────────── */}
      <Loader onComplete={() => setLoaderDone(true)} />

      {/* ── Main site ────────────────────────────────────── */}
      <div
        style={{
          opacity: loaderDone ? 1 : 0,
          transition: 'opacity 0.5s ease',
          background: 'var(--ink)',
          minHeight: '100dvh',
          overflowX: 'hidden',
        }}
      >
        {/* Navigation */}
        <Navbar onOpenResume={() => setIsResumeOpen(true)} />

        {/* ① Hero */}
        <Hero onOpenTerminal={() => setIsTerminalOpen(true)} />

        {/* Marquee between hero and work */}
        <MarqueeStrip />

        {/* ② Selected Work */}
        <Projects />

        {/* ③ Playground */}
        <Playground />

        {/* ④ About */}
        <About />

        {/* ⑤ Experience */}
        <Experience />

        {/* ⑥ Contact */}
        <Contact />

        {/* Footer */}
        <Footer onOpenTerminal={() => setIsTerminalOpen(true)} />
      </div>

      {/* ── Floating AI Chat Button ────────────────────── */}
      <button
        onClick={() => { playCyberChirp(); setIsChatOpen(true); }}
        aria-label="Ask Samay AI Assistant"
        title="Ask Samay AI"
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 500,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '10px 18px',
          background: 'rgba(8,8,8,0.9)',
          border: '1px solid rgba(199,255,61,0.3)',
          borderRadius: 2,
          color: 'var(--bone)',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.68rem',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          cursor: 'none',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          transition: 'border-color 0.2s, background 0.2s, transform 0.2s var(--ease-out-expo)',
          outline: 'none',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = 'var(--lime)';
          e.currentTarget.style.transform = 'translateY(-3px)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = 'rgba(199,255,61,0.3)';
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        <div style={{ position: 'relative' }}>
          <Bot size={15} color="var(--lime)" />
          <span style={{
            position: 'absolute',
            top: -2,
            right: -2,
            width: 5,
            height: 5,
            borderRadius: '50%',
            background: 'var(--lime)',
            animation: 'pulseLime 1.8s ease-in-out infinite',
          }} />
        </div>
        <span>Ask Samay AI</span>
      </button>

      {/* ── Modals ─────────────────────────────────────── */}
      <TerminalDrawer
        isOpen={isTerminalOpen}
        onClose={() => setIsTerminalOpen(false)}
      />
      <AIChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />
      <ResumeModal
        isOpen={isResumeOpen}
        onClose={() => setIsResumeOpen(false)}
      />
    </>
  );
}
