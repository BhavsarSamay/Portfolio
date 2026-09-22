import React from 'react';
import { engineeringFlow } from '../data/products';

export default function ProductEngineering() {
  return (
    <section id="thinking" className="py-16 sm:py-20 border-t border-[var(--border-line)]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid lg:grid-cols-[auto_1fr] gap-8 lg:gap-14 items-start">
          {/* Left Column: Vertical Flow Sequence */}
          <div className="order-2 lg:order-1 overflow-x-auto w-full max-w-sm">
            <div className="flex flex-col items-start w-full">
              {engineeringFlow.map((step, i) => (
                <div key={step} className="flex flex-col items-start w-full">
                  {/* Step Card */}
                  <div className="group font-mono text-xs sm:text-sm px-4 py-3 rounded-xl border border-[var(--border-line)] bg-[var(--bg-card)] shadow-sm text-[var(--text-primary)] hover:border-emerald-500/50 transition-all flex items-center justify-between w-full">
                    <span className="font-semibold">{step}</span>
                    <span className="text-[10px] text-[var(--text-dim)] font-mono">0{i + 1}</span>
                  </div>

                  {/* Connecting Line & Beacon */}
                  {i < engineeringFlow.length - 1 && (
                    <div className="flex items-center justify-center h-8 w-px relative my-1 ml-6">
                      <div className="w-px h-full bg-[var(--border-line-strong)]" />
                      <span
                        className="absolute h-2 w-2 rounded-full bg-emerald-500 animate-beacon shadow-sm shadow-emerald-500/50"
                        style={{ animationDelay: `${i * 0.2}s` }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Narrative Copy */}
          <div className="order-1 lg:order-2">
            <div className="inline-flex items-center gap-2">
              <span className="tag">Product + Engineering</span>
            </div>
            <h2 className="mt-4 font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[var(--text-primary)] leading-tight">
              I don't stop at the requirements document.
            </h2>

            <div className="mt-8 space-y-6 text-base sm:text-lg leading-relaxed text-[var(--text-muted)] max-w-2xl">
              <p>
                I have a Computer Science and Systems Architecture background, and I stay comfortable working directly with the technical system behind the product decisions I make.
              </p>

              <p>
                Across BharatGIG and RicRoot, that means working hand-in-hand with engineering on <strong className="text-[var(--text-primary)]">two-sided geographic pricing algorithms</strong>, mobile app release lifecycles, relational schemas, module behaviour, API contracts, and App Store compliance — not just handing off a Figma link or spec and waiting for a sprint demo.
              </p>

              <div className="p-5 rounded-xl border border-emerald-500/30 bg-emerald-500/5 text-[var(--text-primary)] font-medium">
                I can move fluidly between executive business requirements and low-level technical implementation, which radically shortens the distance between operational bottlenecks in the field and software that actually resolves them.
              </div>

              <p>
                Whether it's debugging webhook payloads, orchestrating SLA penalty ladders, configuring DPDP Act privacy rules, or tuning matching latency across 92,250+ candidate profiles, engineering depth makes product leadership significantly more effective.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
