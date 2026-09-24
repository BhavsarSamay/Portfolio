import React from 'react';
import { samayProfile, navLinks } from '../data/samayProfile';
import { Terminal, ArrowUpRight, ArrowUp, Mail, MapPin } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './Icons';
import { playCyberClick } from '../utils/soundEffects';

export default function Footer({ onOpenTerminal }) {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    playCyberClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const platforms = [
    { label: 'Gig Workforce Platform', desc: 'Two-Sided Marketplace', href: '#work' },
    { label: 'Recruitment Platform', desc: 'Hiring & Talent Systems', href: '#work' },
    { label: 'Payroll & Compliance', desc: 'Statutory HRMS Engine', href: '#work' },
    { label: 'SiteAssist', desc: 'Full-Stack RAG Chat', href: '#work' },
  ];

  return (
    <footer className="bg-[var(--bg-surface)] border-t border-[var(--border-line)] text-[var(--text-muted)] pt-16 pb-12 transition-colors">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        {/* 4-Column Balanced Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-14 border-b border-[var(--border-line)]">
          {/* Column 1: Brand & Identity (Span 4) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center font-mono text-sm font-bold text-emerald-600 dark:text-emerald-400 shadow-sm">
                SB
              </div>
              <div>
                <span className="font-display font-bold text-2xl text-[var(--text-primary)] tracking-tight block">
                  {samayProfile.name}
                </span>
                <span className="font-mono text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold tracking-wide">
                  Architecture × Engineering × Systems
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed max-w-sm">
              Product Manager &amp; Full-Stack Engineer at Veracity Supply Chain Limited. Designing workforce, recruitment, and compliance platforms.
            </p>

            {/* Location & Status Beacon */}
            <div className="flex items-center gap-2 pt-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-mono text-[11px] text-[var(--text-dim)]">
                Bengaluru / Ahmedabad, India · Open for Product &amp; Architecture Roles
              </span>
            </div>
          </div>

          {/* Column 2: Navigation (Span 3) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-[var(--text-primary)] flex items-center gap-2">
              <span className="h-1 w-3 rounded-full bg-emerald-500"></span>
              <span>Navigation</span>
            </h4>
            <ul className="space-y-2 font-mono text-xs">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-[var(--text-muted)] hover:text-emerald-500 transition-colors inline-block py-0.5"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Enterprise Systems (Span 2) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-[var(--text-primary)] flex items-center gap-2">
              <span className="h-1 w-3 rounded-full bg-sky-500"></span>
              <span>Platforms</span>
            </h4>
            <ul className="space-y-2.5 font-mono text-xs">
              {platforms.map((p) => (
                <li key={p.label}>
                  <a
                    href={p.href}
                    className="group block text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                  >
                    <div className="font-semibold group-hover:text-emerald-500 transition-colors">{p.label}</div>
                    <div className="text-[10px] text-[var(--text-dim)]">{p.desc}</div>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Connect & Systems CLI (Span 3) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-[var(--text-primary)] flex items-center gap-2">
              <span className="h-1 w-3 rounded-full bg-amber-500"></span>
              <span>Connect</span>
            </h4>

            <div className="space-y-2">
              <a
                href={samayProfile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2.5 rounded-xl border border-[var(--border-line)] bg-[var(--bg-card)] hover:border-emerald-500/40 hover:bg-emerald-500/5 transition-all text-xs font-mono text-[var(--text-muted)] hover:text-[var(--text-primary)] group"
              >
                <div className="flex items-center gap-2.5">
                  <LinkedinIcon className="w-4 h-4 text-sky-500" />
                  <span>LinkedIn Profile</span>
                </div>
                <ArrowUpRight size={13} className="text-[var(--text-dim)] group-hover:text-emerald-500 transition-colors" />
              </a>

              <a
                href={samayProfile.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2.5 rounded-xl border border-[var(--border-line)] bg-[var(--bg-card)] hover:border-emerald-500/40 hover:bg-emerald-500/5 transition-all text-xs font-mono text-[var(--text-muted)] hover:text-[var(--text-primary)] group"
              >
                <div className="flex items-center gap-2.5">
                  <GithubIcon className="w-4 h-4 text-[var(--text-primary)]" />
                  <span>GitHub Repositories</span>
                </div>
                <ArrowUpRight size={13} className="text-[var(--text-dim)] group-hover:text-emerald-500 transition-colors" />
              </a>

              <a
                href={`mailto:${samayProfile.email}`}
                className="flex items-center justify-between p-2.5 rounded-xl border border-[var(--border-line)] bg-[var(--bg-card)] hover:border-emerald-500/40 hover:bg-emerald-500/5 transition-all text-xs font-mono text-[var(--text-muted)] hover:text-[var(--text-primary)] group"
              >
                <div className="flex items-center gap-2.5">
                  <Mail size={14} className="text-emerald-500" />
                  <span>{samayProfile.email}</span>
                </div>
                <ArrowUpRight size={13} className="text-[var(--text-dim)] group-hover:text-emerald-500 transition-colors" />
              </a>

              {/* SamayOS CLI launcher card */}
              <button
                onClick={() => {
                  playCyberClick();
                  onOpenTerminal?.();
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 transition-all text-xs font-mono font-semibold"
                title="Launch SamayOS Terminal (~)"
              >
                <div className="flex items-center gap-2">
                  <Terminal size={14} />
                  <span>Launch SamayOS CLI</span>
                </div>
                <span className="px-1.5 py-0.5 rounded bg-[var(--bg-card)] border border-[var(--border-line)] text-[10px]">
                  ~
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Attribution */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-[var(--text-dim)]">
          <div>
            © {currentYear} {samayProfile.name}. All rights reserved.
          </div>

          <div className="text-[11px] text-center sm:text-left">
            Crafted with React, Vite &amp; Tailwind CSS · 60fps Cosmic Canvas
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 hover:text-[var(--text-primary)] transition-colors group"
            title="Scroll to Top"
          >
            <span>Back to Top</span>
            <ArrowUp size={13} className="group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </footer>
  );
}
