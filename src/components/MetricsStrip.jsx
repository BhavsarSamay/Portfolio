import React from 'react';
import { samayProfile } from '../data/samayProfile';

export default function MetricsStrip() {
  return (
    <section className="bg-[#12151B] dark:bg-[#07090D] border-y border-[rgba(255,255,255,0.08)] py-10 sm:py-12 text-white relative z-20">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex items-center gap-3">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-beacon" />
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-slate-400 font-semibold">
            Currently Building: Workforce, Recruitment &amp; Compliance Platforms at Veracity Supply Chain Limited
          </p>
        </div>

        <div className="mt-6 sm:mt-8 grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
          {samayProfile.heroMetrics.map((metric, i) => (
            <div
              key={metric.label}
              className="group border-l-2 border-emerald-500/40 pl-5 transition-all hover:border-emerald-400"
            >
              <div className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white group-hover:text-emerald-300 transition-colors whitespace-nowrap">
                {metric.value}
              </div>
              <div className="mt-2 font-mono text-xs uppercase tracking-[0.12em] text-slate-400 leading-snug">
                {metric.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
