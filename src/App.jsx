import { useState, useEffect } from "react";
import Lenis from "lenis";
import CyberBackground from "./components/CyberBackground";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import MetricsStrip from "./components/MetricsStrip";
import Intro from "./components/Intro";
import Projects from "./components/Projects";
import ProductEngineering from "./components/ProductEngineering";
import HowIThink from "./components/HowIThink";
import Skills from "./components/Skills";
import Experience from "./components/Experience";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import TerminalDrawer from "./components/TerminalDrawer";
import AIChatModal from "./components/AIChatModal";
import ResumeModal from "./components/ResumeModal";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { Bot } from "lucide-react";
import { playCyberChirp } from "./utils/soundEffects";

function AppContent() {
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const { isDark } = useTheme();

  useEffect(() => {
    // Global hotkey: ~ (backtick) toggles SamayOS CLI Terminal
    const handleKeyDown = (e) => {
      const active = document.activeElement;
      const isTyping =
        active?.tagName === "INPUT" ||
        active?.tagName === "TEXTAREA" ||
        active?.isContentEditable;

      if (e.key === "`" && !isTyping) {
        e.preventDefault();
        playCyberChirp();
        setIsTerminalOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Initialize Lenis smooth scroll
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let lenis = null;
    if (!prefersReducedMotion) {
      lenis = new Lenis({
        lerp: 0.08,
        smoothWheel: true,
        wheelMultiplier: 1.0,
        prevent: (node) => !!node.closest?.("[data-lenis-prevent]"),
      });

      window.__lenis = lenis;

      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.__lenis = null;
      if (lenis) lenis.destroy();
    };
  }, []);

  return (
    <div
      className={`relative min-h-screen ${isDark ? "bg-[#0B0E14] text-slate-100" : "bg-[#FAFAF7] text-[#12151B]"
        } overflow-x-hidden transition-colors duration-300`}
    >
      {/* Interactive Multi-layer Background Canvas & Particles */}
      <CyberBackground />

      {/* Main Foreground Content */}
      <div className="relative z-10">
        <Navbar
          onOpenTerminal={() => setIsTerminalOpen(true)}
          onOpenResume={() => setIsResumeOpen(true)}
        />

        {/* 1. Hero Section with Headline & Animated System Map */}
        <Hero onOpenTerminal={() => setIsTerminalOpen(true)} />

        {/* 2. High-Impact Metrics Strip */}
        <MetricsStrip />

        {/* 3. Intro: Where Software Meets Operations */}
        <Intro />

        {/* 4. Selected Work: BharatGIG, RicRoot & PayEaze Product Architecture */}
        <Projects />

        {/* 5. Product + Engineering: 7-Stage Flow Sequence */}
        <ProductEngineering />

        {/* 6. Product Philosophy: How I Think (5 Tenets) */}
        <HowIThink />

        {/* 7. Technical Background: Grouped Tech Ecosystem */}
        <Skills />

        {/* 8. Career Timeline & Education */}
        <Experience />

        {/* 9. Contact: Have a hard problem? Let's talk */}
        <Contact />

        {/* 10. Editorial Footer */}
        <Footer onOpenTerminal={() => setIsTerminalOpen(true)} />
      </div>

      {/* Floating Action Trigger: Ask Samay AI Assistant */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
        <button
          onClick={() => {
            playCyberChirp();
            setIsChatOpen(true);
          }}
          className={`group flex items-center gap-2.5 px-4 py-3 rounded-2xl ${isDark
              ? "bg-[#12151B]/90 border border-emerald-500/40 text-white hover:bg-[#1A1F2B] shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
              : "bg-white/95 border border-emerald-600/30 text-[#12151B] hover:bg-slate-50 shadow-[0_10px_30px_rgba(0,0,0,0.08)]"
            } hover:border-emerald-500 transition-all text-xs font-medium backdrop-blur-2xl hover:-translate-y-1`}
          title="Ask Samay AI Assistant"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <span className="font-semibold font-display tracking-tight">Ask Samay AI</span>
        </button>
      </div>

      {/* Interactive Modals & CLI Drawer */}
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
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
