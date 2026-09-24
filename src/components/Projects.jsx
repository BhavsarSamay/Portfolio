import React, { useState } from "react";
import { ArrowUpRight, Code2, Layers, CheckCircle2 } from "lucide-react";
import { veracityPlatforms } from "../data/products";
import { earlierProjects } from "../data/projects";
import ProjectModal from "./ProjectModal";
import { playCyberChirp, playCyberClick } from "../utils/soundEffects";

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [featuredProject, ...restProjects] = earlierProjects;

  return (
    <section id="work" className="py-16 sm:py-20 border-t border-[var(--border-line)]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <span className="tag">Selected Work</span>
            <h2 className="mt-3 font-display text-3xl sm:text-5xl font-bold tracking-tight text-[var(--text-primary)]">
              Systems Architecture
            </h2>
          </div>
        </div>

        {/* Veracity Platform Overview Cards */}
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {veracityPlatforms.map((platform) => {
            const colorMap = {
              emerald: { dot: 'bg-emerald-500', text: 'text-emerald-600 dark:text-emerald-400', border: 'hover:border-emerald-500/50' },
              sky: { dot: 'bg-sky-400', text: 'text-sky-600 dark:text-sky-400', border: 'hover:border-sky-500/50' },
              amber: { dot: 'bg-amber-400', text: 'text-amber-600 dark:text-amber-400', border: 'hover:border-amber-500/50' },
            };
            const colors = colorMap[platform.color] || colorMap.emerald;

            return (
              <div
                key={platform.id}
                className={`group rounded-2xl border border-[var(--border-line)] bg-[var(--bg-card)] shadow-md p-6 transition-all duration-300 ${colors.border} hover:-translate-y-1 flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${colors.dot} animate-beacon`} />
                    <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--text-dim)] font-semibold">
                      {platform.role}
                    </span>
                  </div>

                  <h3 className={`mt-3 font-display text-lg sm:text-xl font-bold text-[var(--text-primary)]`}>
                    {platform.label}
                  </h3>

                  <p className="mt-3 text-sm leading-relaxed text-[var(--text-muted)]">
                    {platform.overview}
                  </p>
                </div>

                {/* Tags */}
                <div className="mt-5 pt-4 border-t border-[var(--border-line)]">
                  <div className="flex flex-wrap gap-1.5">
                    {platform.tags.map((tag) => (
                      <span
                        key={tag}
                        className="font-mono text-[10px] px-2 py-0.5 rounded border border-[var(--border-line)] bg-[var(--bg-surface)] text-[var(--text-muted)]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-[var(--border-line)]">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--text-dim)]">
            Enterprise Platforms &amp; Workflows at Veracity Supply Chain Limited
          </p>
          <div className="flex items-center gap-2 font-mono text-xs text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 size={15} />
            <span>Product Manager &amp; Full-Stack Engineer</span>
          </div>
        </div>

        {/* Earlier Projects Section */}
        <div className="mt-12 pt-10 border-t border-[var(--border-line)]">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
            <div>
              <span className="tag">Full-Stack &amp; AI Systems</span>
              <h3 className="mt-2 font-display text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
                Production AI &amp; Software Projects
              </h3>
            </div>
            <p className="font-mono text-xs text-[var(--text-muted)] max-w-sm">
              Click any project to inspect system architecture, data models &amp; code snippets.
            </p>
          </div>

          {/* Featured Full-Width Project: SiteAssist */}
          <div className="rounded-2xl border border-[var(--border-line)] bg-[var(--bg-card)] shadow-lg p-6 sm:p-8 transition-all hover:border-emerald-500/50">
            <div className="grid lg:grid-cols-[1.3fr_1fr] gap-8 items-center">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-mono text-xs font-semibold">
                    Featured Architecture
                  </span>
                  <span className="font-mono text-xs text-[var(--text-dim)]">
                    {featuredProject.category}
                  </span>
                </div>

                <h4 className="mt-3 font-display text-xl sm:text-2xl font-bold text-[var(--text-primary)]">
                  {featuredProject.title}
                </h4>

                <p className="mt-2.5 text-sm sm:text-base leading-relaxed text-[var(--text-muted)]">
                  {featuredProject.description}
                </p>

                {/* Key Architecture Highlights */}
                {featuredProject.highlights && (
                  <ul className="mt-4 space-y-1.5 font-mono text-xs text-[var(--text-muted)]">
                    {featuredProject.highlights.map((hl, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-emerald-500 font-bold mt-0.5">›</span>
                        <span>{hl}</span>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="mt-5 flex flex-wrap gap-2">
                  {featuredProject.tech.map((t) => (
                    <span
                      key={t}
                      className="font-mono text-[11px] px-2.5 py-1 rounded-md border border-[var(--border-line)] bg-[var(--bg-surface)] text-[var(--text-muted)]"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t border-[var(--border-line)] flex items-center gap-4">
                  <button
                    onClick={() => {
                      playCyberChirp();
                      setSelectedProject(featuredProject);
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-semibold shadow-md transition-all"
                  >
                    <Layers size={14} />
                    <span>Inspect Architecture</span>
                  </button>
                  <a
                    href={featuredProject.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-mono text-xs text-[var(--text-muted)] hover:text-emerald-500 transition-colors"
                  >
                    <span>GitHub Repo</span>
                    <ArrowUpRight size={14} />
                  </a>
                </div>
              </div>

              {/* Code / Architecture Interactive Preview */}
              <div className="rounded-xl border border-[var(--border-line)] bg-[var(--bg-surface)] p-5 font-mono text-xs overflow-hidden shadow-inner">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-[var(--border-line)] text-[var(--text-dim)]">
                  <span className="flex items-center gap-1.5">
                    <Code2 size={13} className="text-emerald-500" />
                    <span>SiteAssist · Real-Time Pipeline</span>
                  </span>
                  <span className="text-[10px] uppercase tracking-wider">Node / Socket.io</span>
                </div>
                <pre className="text-[11px] leading-relaxed text-emerald-600 dark:text-emerald-400 overflow-x-auto whitespace-pre">
                  {featuredProject.codeSnippet}
                </pre>
                <div className="mt-4 pt-3 border-t border-[var(--border-line)] text-[11px] text-[var(--text-dim)]">
                  Flow: {featuredProject.architecture}
                </div>
              </div>
            </div>
          </div>

          {/* Rest of Projects in Balanced Responsive Grid */}
          <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {restProjects.map((proj) => (
              <div
                key={proj.title}
                className="group rounded-2xl border border-[var(--border-line)] bg-[var(--bg-card)] shadow-md p-5 transition-all duration-300 hover:border-emerald-500/50 hover:-translate-y-1 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                      {proj.category}
                    </span>
                    <button
                      onClick={() => {
                        playCyberChirp();
                        setSelectedProject(proj);
                      }}
                      className="p-1.5 rounded-lg border border-[var(--border-line)] hover:bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-emerald-500 transition-colors"
                      title="Inspect System Details"
                    >
                      <Code2 size={14} />
                    </button>
                  </div>

                  <h4 className="mt-2 font-display text-base font-bold text-[var(--text-primary)] group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {proj.title}
                  </h4>
                  <p className="mt-2 text-xs sm:text-sm leading-relaxed text-[var(--text-muted)] line-clamp-3">
                    {proj.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[var(--border-line)]">
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {proj.tech.slice(0, 4).map((t) => (
                      <span
                        key={t}
                        className="font-mono text-[10px] px-2 py-0.5 rounded border border-[var(--border-line)] bg-[var(--bg-surface)] text-[var(--text-muted)]"
                      >
                        {t}
                      </span>
                    ))}
                    {proj.tech.length > 4 && (
                      <span className="font-mono text-[10px] px-1.5 py-0.5 rounded text-[var(--text-dim)]">
                        +{proj.tech.length - 4}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => {
                        playCyberChirp();
                        setSelectedProject(proj);
                      }}
                      className="font-mono text-xs text-emerald-600 dark:text-emerald-400 font-medium hover:underline flex items-center gap-1"
                    >
                      <Layers size={13} /> Details
                    </button>
                    <a
                      href={proj.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-xs text-[var(--text-muted)] hover:text-emerald-500 flex items-center gap-1 transition-colors"
                    >
                      Repo <ArrowUpRight size={13} />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Project Deep Dive Modal */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </section>
  );
}
