import React from 'react';
import { experience, education } from '../data/experience';
import { GraduationCap, Award } from 'lucide-react';

export default function Experience() {
  return (
    <section id="experience" className="py-16 sm:py-20 border-t border-[var(--border-line)]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div>
          <span className="tag">Timeline</span>
          <h2 className="mt-3 font-display text-3xl sm:text-5xl font-bold tracking-tight text-[var(--text-primary)]">
            Experience
          </h2>
          <p className="mt-3 text-base text-[var(--text-muted)] max-w-xl">
            Where product strategy meets real-world full-stack engineering.
          </p>
        </div>

        {/* Experience Roles */}
        <div className="mt-8 sm:mt-10 space-y-10">
          {experience.map((role, i) => (
            <div
              key={role.id}
              className={`grid md:grid-cols-[300px_1fr] gap-8 md:gap-14 pb-10 ${i < experience.length - 1 ? 'border-b border-[var(--border-line)]' : ''
                }`}
            >
              <div>
                {role.id === 'veracity' && (
                  <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-emerald-600 dark:text-emerald-400 font-semibold mb-3">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-beacon" />
                    Current Role
                  </span>
                )}
                <h3 className="font-display text-xl sm:text-2xl font-bold text-[var(--text-primary)]">
                  {role.company}
                </h3>
                <p className="mt-1 text-sm font-medium text-[var(--text-muted)]">
                  {role.role}
                </p>
                <p className="text-sm font-mono text-emerald-600 dark:text-emerald-400">
                  {role.subrole}
                </p>
                <p className="mt-3 font-mono text-xs uppercase tracking-[0.14em] text-[var(--text-dim)]">
                  {role.period}
                </p>

                {role.tech && (
                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {role.tech.map((t) => (
                      <span
                        key={t}
                        className="font-mono text-[10px] px-2 py-0.5 rounded bg-[var(--bg-surface)] text-[var(--text-dim)] border border-[var(--border-line)]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Bullet Points */}
              <ul className="space-y-3.5">
                {role.points.map((point) => (
                  <li key={point} className="flex items-start gap-3 text-sm sm:text-base leading-relaxed text-[var(--text-muted)]">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Education & Academic Card */}
        <div className="mt-12 rounded-2xl border border-[var(--border-line)] bg-[var(--bg-card)] shadow-lg p-7 sm:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex-shrink-0">
              <GraduationCap size={24} />
            </div>
            <div>
              <span className="tag">Education</span>
              <h3 className="mt-1 font-display text-lg sm:text-xl font-bold text-[var(--text-primary)]">
                Bachelor of Technology in Computer Science &amp; Engineering
              </h3>
              <p className="mt-1 text-sm text-[var(--text-muted)]">
                Focused on Systems Architecture, Distributed Data &amp; Operational Software
              </p>
            </div>
          </div>

          <div className="font-mono text-xs text-[var(--text-muted)] sm:text-right flex-shrink-0">
            <div className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center sm:justify-end gap-1.5">
              <Award size={14} />
              <span>Competitive Problem Solver</span>
            </div>
            <div className="mt-1 text-[var(--text-dim)]">300+ Algorithmic Challenges Solved</div>
          </div>
        </div>
      </div>
    </section>
  );
}
