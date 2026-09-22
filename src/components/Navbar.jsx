import React, { useState, useEffect } from "react";
import { Terminal, Volume2, VolumeX, Menu, X, Sun, Moon, ArrowUpRight, Sparkles } from "lucide-react";
import { playCyberClick, playCyberChirp, isSoundMuted, toggleSoundMute } from "../utils/soundEffects";
import { useTheme } from "../context/ThemeContext";
import { samayProfile, navLinks } from "../data/samayProfile";

export default function Navbar({ onOpenTerminal, onOpenResume }) {
  const [muted, setMuted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    setMuted(isSoundMuted());

    const sectionIds = ["home", "about", "work", "thinking", "experience", "contact"];

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      // Check if scrolled near the bottom of the page
      const scrollBottom = window.innerHeight + window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      if (scrollBottom >= docHeight - 120) {
        setActiveSection("contact");
        return;
      }

      // Check if at the very top
      if (window.scrollY < 180) {
        setActiveSection("home");
        return;
      }

      // Trigger line in the viewport for active section detection
      const triggerY = 160;
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= triggerY && rect.bottom > triggerY) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    playCyberClick();
    const id = href.replace("#", "");
    setActiveSection(id);
    setMobileMenuOpen(false);

    if (id === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const target = document.getElementById(id);
    if (target) {
      const navHeight = 85;
      const targetPos = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
      window.scrollTo({ top: targetPos, behavior: "smooth" });
    }
  };

  const handleAudioToggle = () => {
    const nextMuted = toggleSoundMute();
    setMuted(nextMuted);
  };

  const handleThemeToggle = () => {
    playCyberClick();
    toggleTheme();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-3 sm:px-6 pt-3 sm:pt-4 pointer-events-none transition-all duration-300">
      {/* Sleek Floating Glass Capsule Dock */}
      <div
        className={`max-w-6xl mx-auto rounded-2xl border transition-all duration-300 pointer-events-auto relative overflow-hidden ${scrolled
            ? "border-[var(--border-line-strong)] bg-[var(--bg-card)]/90 backdrop-blur-2xl shadow-2xl shadow-black/20 py-2.5 px-4 sm:px-6"
            : "border-[var(--border-line)] bg-[var(--bg-card)]/75 backdrop-blur-xl shadow-lg shadow-black/10 py-3 px-4 sm:px-6"
          }`}
      >
        {/* Subtle Top Specular Light Highlight Line */}
        <div className="absolute inset-x-8 top-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-400/40 via-sky-400/35 to-transparent pointer-events-none" />

        <div className="flex items-center justify-between gap-4">
          {/* Brand Logo & Live Status */}
          <a
            href="#home"
            onClick={(e) => handleNavClick(e, "#home")}
            className="group flex items-center gap-3 focus:outline-none"
            aria-label="Samay Bhavsar Homepage"
          >
            {/* Monogram Badge */}
            <div className="relative h-9 w-9 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-line-strong)] shadow-inner flex items-center justify-center font-mono text-sm font-bold text-emerald-500 group-hover:border-emerald-500/60 group-hover:shadow-[0_0_12px_rgba(16,185,129,0.3)] transition-all">
              <span>SB</span>
              {/* Corner Beacon */}
              <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-500 animate-beacon ring-2 ring-[var(--bg-card)]" />
            </div>

            {/* Title & Live Status */}
            <div className="flex flex-col">
              <span className="font-display font-bold text-sm sm:text-base tracking-tight text-[var(--text-primary)] leading-tight group-hover:text-emerald-500 transition-colors">
                {samayProfile.name}
              </span>
              <span className="flex items-center gap-1.5 font-mono text-[10px] text-[var(--text-dim)] uppercase tracking-wider font-semibold">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500/80" />
                <span>Product · Systems</span>
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links (Bold, Sleek Pill Design) */}
          <nav className="hidden md:flex items-center gap-1.5 p-1 rounded-xl bg-[var(--bg-surface)]/60 border border-[var(--border-line)]">
            {navLinks.map((link) => {
              const sectionId = link.href.replace("#", "");
              const isActive = activeSection === sectionId;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`relative px-3.5 py-1.5 rounded-lg font-mono text-xs uppercase tracking-wider font-bold transition-all duration-200 flex items-center gap-1.5 ${isActive
                      ? "text-[var(--text-primary)] bg-[var(--bg-surface-raised)] border border-[var(--border-line-strong)] shadow-sm"
                      : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-raised)]/50"
                    }`}
                >
                  {isActive && (
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-beacon" />
                  )}
                  <span>{link.label}</span>
                </a>
              );
            })}
          </nav>

          {/* Actions & Toggles */}
          <div className="hidden lg:flex items-center gap-2.5">
            {/* Theme Toggle (Dark / Light) */}
            <button
              onClick={handleThemeToggle}
              className="p-2 rounded-xl border border-[var(--border-line)] bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-raised)] text-[var(--text-muted)] hover:text-emerald-500 hover:border-emerald-500/40 transition-all shadow-sm active:scale-95"
              title={`Switch to ${isDark ? "Light Paper" : "Dark Ink"} Mode`}
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} className="text-slate-700" />}
            </button>

            {/* Sound Toggle */}
            <button
              onClick={handleAudioToggle}
              className="p-2 rounded-xl border border-[var(--border-line)] bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-raised)] text-[var(--text-muted)] hover:text-emerald-500 hover:border-emerald-500/40 transition-all shadow-sm active:scale-95"
              title={muted ? "Unmute Sound Feedback" : "Mute Sound Feedback"}
              aria-label="Toggle Audio"
            >
              {muted ? <VolumeX size={16} /> : <Volume2 size={16} className="text-emerald-500" />}
            </button>

            {/* SamayOS Terminal Launcher */}
            <button
              onClick={() => {
                playCyberChirp();
                onOpenTerminal?.();
              }}
              className="px-3 py-1.5 rounded-xl border border-[var(--border-line)] bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-raised)] text-[var(--text-muted)] hover:text-emerald-400 text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
              title="Open SamayOS CLI Terminal (~)"
            >
              <Terminal size={14} className="text-emerald-500" />
              <span>CLI</span>
              <span className="text-[10px] px-1 py-0.2 rounded bg-[var(--border-line)] text-[var(--text-dim)] font-normal">~</span>
            </button>

            {/* Let's Connect Button */}
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, "#contact")}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-mono text-xs uppercase tracking-wider font-bold transition-all shadow-md shadow-emerald-600/25 hover:shadow-emerald-600/40 hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>Let's Connect</span>
              <ArrowUpRight size={14} />
            </a>
          </div>

          {/* Mobile Action Controls */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={handleThemeToggle}
              className="p-2 rounded-xl border border-[var(--border-line)] bg-[var(--bg-surface)] text-[var(--text-muted)]"
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun size={17} className="text-amber-400" /> : <Moon size={17} />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl border border-[var(--border-line)] bg-[var(--bg-surface)] text-[var(--text-primary)]"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer Menu */}
        {mobileMenuOpen && (
          <div className="mt-4 pt-4 border-t border-[var(--border-line)] space-y-4">
            <nav className="flex flex-col space-y-1.5 font-mono text-xs uppercase tracking-wider font-bold">
              {navLinks.map((link) => {
                const sectionId = link.href.replace("#", "");
                const isActive = activeSection === sectionId;
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className={`px-3 py-2.5 rounded-lg flex items-center justify-between transition-colors ${isActive
                        ? "text-emerald-500 bg-[var(--bg-surface)] border border-[var(--border-line)]"
                        : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)]"
                      }`}
                  >
                    <span>{link.label}</span>
                    {isActive && <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />}
                  </a>
                );
              })}
            </nav>

            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenTerminal?.();
                }}
                className="w-full py-2.5 rounded-xl border border-[var(--border-line)] bg-[var(--bg-surface)] text-xs font-mono font-bold flex items-center justify-center gap-2 text-[var(--text-primary)] hover:text-emerald-400 transition-colors"
              >
                <Terminal size={14} className="text-emerald-500" />
                <span>Launch SamayOS Terminal</span>
                <span className="text-[10px] px-1 py-0.5 rounded bg-[var(--border-line)] text-[var(--text-dim)]">~</span>
              </button>

              <a
                href="#contact"
                onClick={(e) => handleNavClick(e, "#contact")}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-1.5 font-bold shadow-md shadow-emerald-600/25"
              >
                <span>Let's Connect</span>
                <ArrowUpRight size={14} />
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
