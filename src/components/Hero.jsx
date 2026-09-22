import React from "react";
import { ArrowUpRight, Terminal, Sparkles, ShieldCheck } from "lucide-react";
import HeroVisual from "./HeroVisual";
import HeroPlanets from "./HeroPlanets";
import { samayProfile } from "../data/samayProfile";
import { playCyberChirp } from "../utils/soundEffects";

export default function Hero({ onOpenTerminal }) {
  return (
    <section id="home" className="relative pt-36 pb-20 sm:pt-44 sm:pb-28 overflow-hidden">
      {/* Dynamic Planetary Orbit System */}
      <HeroPlanets />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-16 items-center">
          {/* Left Column: Editorial Headline & Actions */}
          <div>
            {/* Eyebrow badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--border-line)] bg-[var(--bg-surface)] backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-beacon" />
              <span className="tag">Product Manager + Full Stack Engineer</span>
            </div>

            {/* Main Title */}
            <h1 className="mt-6 font-display text-4xl sm:text-6xl md:text-[4rem] font-bold tracking-tight text-[var(--text-primary)] leading-[1.08]">
              I build products, and the systems that run them.
            </h1>

            {/* Subtitle / Description */}
            <p className="mt-6 text-lg sm:text-xl leading-relaxed text-[var(--text-muted)] max-w-xl">
              I'm <span className="font-semibold text-[var(--text-primary)]">{samayProfile.name}</span> — a <span className="font-medium text-[var(--text-primary)]">Product Manager + Full Stack Engineer</span> at{" "}
              <span className="font-medium text-[var(--text-primary)]">{samayProfile.company}</span>. I bridge product strategy and deep technical architecture, building scalable workflows, distributed APIs, and system design for{" "}
              <span className="text-emerald-500 font-semibold">BharatGIG</span> and{" "}
              <span className="text-emerald-500 font-semibold">RicRoot</span>, alongside{" "}
              <span className="text-emerald-500 font-semibold">PayEaze</span> — turning complex ground operations into robust, high-performance digital platforms.
            </p>

            {/* Quick Metrics Badges */}
            <div className="mt-8 flex flex-wrap gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[var(--border-line)] bg-[var(--bg-surface)] text-xs font-mono text-[var(--text-muted)]">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span>Product &amp; Systems Architecture</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[var(--border-line)] bg-[var(--bg-surface)] text-xs font-mono text-[var(--text-muted)]">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span>Full-Stack &amp; AI Engineering</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[var(--border-line)] bg-[var(--bg-surface)] text-xs font-mono text-[var(--text-muted)]">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span>Multi-Role Field Operations</span>
              </div>
            </div>

            {/* Call to Actions */}
            <div className="mt-10 flex flex-wrap items-center gap-4 sm:gap-5">
              <a
                href="#work"
                onClick={() => playCyberChirp()}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm transition-all shadow-md hover:shadow-emerald-600/30 hover:-translate-y-0.5"
              >
                View Selected Work
                <ArrowUpRight size={16} />
              </a>

              <a
                href="#contact"
                onClick={() => playCyberChirp()}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-[var(--border-line)] bg-[var(--bg-card)] hover:border-emerald-500/50 text-[var(--text-primary)] font-medium text-sm transition-all hover:-translate-y-0.5"
              >
                Let's Connect
              </a>

              {/* SamayOS Terminal Trigger */}
              <button
                onClick={() => {
                  playCyberChirp();
                  onOpenTerminal?.();
                }}
                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-[var(--border-line)] bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-raised)] text-[var(--text-muted)] hover:text-emerald-400 text-xs font-mono transition-all"
                title="Open SamayOS Interactive Terminal (~)"
              >
                <Terminal size={14} className="text-emerald-500" />
                <span>SamayOS CLI</span>
                <span className="px-1.5 py-0.5 rounded bg-[var(--border-line)] text-[10px] text-[var(--text-dim)]">~</span>
              </button>
            </div>
          </div>

          {/* Right Column: Animated Radar & System Map */}
          <div className="relative flex justify-center items-center">
            <HeroVisual />
          </div>
        </div>
      </div>
    </section>
  );
}
