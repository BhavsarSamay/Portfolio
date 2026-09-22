import React from 'react';
import { techEcosystem } from '../data/skills';

export default function Skills() {
  return (
    <section className="py-14 sm:py-18 border-t border-[var(--border-line)] bg-[var(--bg-surface)]/40">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div>
          <span className="tag">Full-Stack &amp; Systems Ecosystem</span>
          <h2 className="mt-3 font-display text-3xl sm:text-5xl font-bold tracking-tight text-[var(--text-primary)]">
            A working full-stack engineering ecosystem.
          </h2>
          <p className="mt-3 text-base text-[var(--text-muted)] max-w-xl">
            From low-latency distributed Node.js/Python microservices and WebSockets to LangChain agentic systems and full-stack React applications.
          </p>
        </div>

        <div className="mt-8 sm:mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {techEcosystem.map((group) => (
            <div
              key={group.group}
              className="h-full rounded-2xl border border-[var(--border-line)] bg-[var(--bg-card)] shadow-lg p-7 transition-all duration-300 hover:border-emerald-500/40 hover:-translate-y-1 flex flex-col justify-between"
            >
              <div>
                <h3 className="font-mono text-xs uppercase tracking-[0.14em] text-emerald-600 dark:text-emerald-400 font-bold">
                  {group.group}
                </h3>
                <p className="mt-2 text-xs text-[var(--text-muted)]">
                  {group.description}
                </p>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <span
                    key={item}
                    className="font-mono text-xs text-[var(--text-primary)] rounded-lg border border-[var(--border-line)] bg-[var(--bg-surface)] px-3 py-1.5 transition-colors hover:border-emerald-500/50"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
