import React from 'react';
import { howIThink } from '../data/thinking';

export default function HowIThink() {
  return (
    <section className="py-14 sm:py-18 border-t border-[var(--border-line)]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div>
          <span className="tag">Product Philosophy</span>
          <h2 className="mt-3 font-display text-3xl sm:text-5xl font-bold tracking-tight text-[var(--text-primary)]">
            How I think
          </h2>
          <p className="mt-3 text-base text-[var(--text-muted)] max-w-xl">
            Operating principles honed while architecting enterprise gig, recruitment, and production systems.
          </p>
        </div>

        <div className="mt-8 sm:mt-10 grid md:grid-cols-2 gap-6">
          {howIThink.map((item, i) => (
            <div
              key={item.title}
              className={`rounded-2xl border border-[var(--border-line)] bg-[var(--bg-card)] shadow-lg p-8 sm:p-10 transition-all duration-300 hover:border-emerald-500/40 hover:-translate-y-1 ${i === howIThink.length - 1 ? 'md:col-span-2' : ''
                }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm font-bold text-emerald-600 dark:text-emerald-400">
                  0{i + 1}
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500/40" />
              </div>

              <h3 className="mt-5 font-display text-xl sm:text-2xl font-bold text-[var(--text-primary)]">
                {item.title}
              </h3>

              <p className="mt-3.5 text-base leading-relaxed text-[var(--text-muted)] max-w-2xl">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
