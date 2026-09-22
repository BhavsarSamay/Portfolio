import React, { useState } from "react";
import { ArrowUpRight, ExternalLink, Code2, Layers, CheckCircle2, ShieldCheck, MapPin, Users, Smartphone, FileSpreadsheet, Building2, Sliders } from "lucide-react";
import {
  bharatGigData,
  ricRootData,
  payEazeData,
  veracityProducts,
  productModules,
  lifecycleStages
} from "../data/products";
import { earlierProjects } from "../data/projects";
import ProjectModal from "./ProjectModal";
import { playCyberChirp, playCyberClick } from "../utils/soundEffects";

export default function Projects() {
  const [activeTab, setActiveTab] = useState("bharatgig");
  const [selectedProject, setSelectedProject] = useState(null);
  const [featuredProject, ...restProjects] = earlierProjects;

  const currentProduct =
    activeTab === "bharatgig"
      ? bharatGigData
      : activeTab === "ricroot"
        ? ricRootData
        : payEazeData;

  return (
    <section id="work" className="py-16 sm:py-20 border-t border-[var(--border-line)]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <span className="tag">Selected Work</span>
            <h2 className="mt-3 font-display text-3xl sm:text-5xl font-bold tracking-tight text-[var(--text-primary)]">
              Product Architecture &amp; Systems
            </h2>
          </div>
          <p className="font-mono text-xs text-[var(--text-muted)] max-w-md">
            Two-sided gig marketplaces, large-scale recruitment taxonomies, and multi-tenant compliance engines at Veracity Supply Chain Limited.
          </p>
        </div>

        {/* 1. Flagship Products Selector Tabs */}
        <div className="mt-8 flex flex-wrap gap-2 p-1.5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-line)] max-w-fit">
          <button
            onClick={() => {
              playCyberClick();
              setActiveTab("bharatgig");
            }}
            className={`px-5 py-2.5 rounded-xl font-mono text-xs font-semibold transition-all flex items-center gap-2 ${activeTab === "bharatgig"
                ? "bg-emerald-600 text-white shadow-md"
                : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)]"
              }`}
          >
            <span className="h-2 w-2 rounded-full bg-emerald-300 animate-beacon" />
            <span>BharatGIG</span>
            <span className="text-[10px] opacity-75 hidden sm:inline">(Gig Workforce)</span>
          </button>

          <button
            onClick={() => {
              playCyberClick();
              setActiveTab("ricroot");
            }}
            className={`px-5 py-2.5 rounded-xl font-mono text-xs font-semibold transition-all flex items-center gap-2 ${activeTab === "ricroot"
                ? "bg-emerald-600 text-white shadow-md"
                : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)]"
              }`}
          >
            <span className="h-2 w-2 rounded-full bg-sky-400" />
            <span>RicRoot</span>
            <span className="text-[10px] opacity-75 hidden sm:inline">(Hiring Platform)</span>
          </button>

          <button
            onClick={() => {
              playCyberClick();
              setActiveTab("payeaze");
            }}
            className={`px-5 py-2.5 rounded-xl font-mono text-xs font-semibold transition-all flex items-center gap-2 ${activeTab === "payeaze"
                ? "bg-emerald-600 text-white shadow-md"
                : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)]"
              }`}
          >
            <span className="h-2 w-2 rounded-full bg-amber-400" />
            <span>PayEaze</span>
            <span className="text-[10px] opacity-75 hidden sm:inline">(Compliance HRMS)</span>
          </button>
        </div>

        {/* 2. Flagship Product Deep Card */}
        <div className="mt-6 rounded-2xl border border-[var(--border-line)] bg-[var(--bg-card)] shadow-xl p-6 sm:p-8 transition-all">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-beacon" />
                <span className="tag">{currentProduct.category}</span>
              </div>
              <div className="mt-2.5 flex flex-wrap items-center gap-3">
                <h3 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--text-primary)]">
                  {currentProduct.title}
                </h3>
                {currentProduct.link && (
                  <a
                    href={currentProduct.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-xs hover:bg-emerald-500/20 transition-all"
                  >
                    <span>Visit Live Site</span>
                    <ArrowUpRight size={13} />
                  </a>
                )}
                <button
                  onClick={() => {
                    playCyberChirp();
                    setSelectedProject({
                      id: currentProduct.id,
                      title: `${currentProduct.title}: Enterprise Platform Architecture`,
                      category: currentProduct.category,
                      tagline: currentProduct.tagline,
                      description: currentProduct.summary,
                      metrics: `${currentProduct.role} · Veracity Supply Chain Limited`,
                      problemStatement: currentProduct.summary,
                      architecture: currentProduct.id === 'bharatgig'
                        ? 'GIG Worker Mobile App <-> Geo-Pricing Location Engine <-> Admin / Client / Branch Panels <-> PDF Dossier Synthesis'
                        : currentProduct.id === 'ricroot'
                          ? 'Candidate Mobile Journey <-> Job Master Taxonomy <-> Recruiter Portal <-> Offer Automation'
                          : 'State Statutory Rules <-> Multi-Tenant Subdomain Isolation <-> SuperAdmin & SPOC Portals',
                      pipelineStages: currentProduct.panels
                        ? currentProduct.panels.map((p) => ({ name: p.name, desc: p.desc }))
                        : currentProduct.corePieces
                          ? currentProduct.corePieces.slice(0, 4).map((cp) => ({ name: cp.title, desc: cp.desc }))
                          : [],
                      challenges: (currentProduct.pricingArchitecture || currentProduct.corePieces || []).slice(0, 3).map((item) => ({
                        title: item.title,
                        desc: item.desc
                      })),
                      stats: currentProduct.stats,
                      tech: ['Enterprise System Design', 'Product Architecture', 'Microservices', 'RBAC Matrix', 'Location Engine', 'Workflow SLA'],
                      href: currentProduct.link || 'https://github.com/BhavsarSamay',
                      githubUrl: currentProduct.link || 'https://github.com/BhavsarSamay',
                      link: currentProduct.link,
                      codeSnippet: `// ${currentProduct.title} - Operational Architecture Specification
// Designed & Architected by Samay Bhavsar (APM, Veracity Supply Chain Limited)
// High-level system topology compliant with Non-Disclosure Agreement (NDA)

export const systemArchitecture = {
  productId: "${currentProduct.id}",
  designation: "Product Manager + Full Stack Engineer",
  coreTenet: "Physical ground operations aligned with dynamic software state",
  securityModel: "Role-Based Access Control (RBAC) with audit trail",
  deploymentScale: "Multi-tenant enterprise operations across Indian states"
};`
                    });
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-emerald-500/40 bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 font-mono text-xs hover:bg-emerald-500/25 transition-all font-semibold"
                >
                  <Layers size={13} />
                  <span>Inspect Architecture</span>
                </button>
              </div>
              <p className="mt-1 text-sm sm:text-base text-emerald-600 dark:text-emerald-400 font-medium">
                {currentProduct.tagline}
              </p>
            </div>

            {/* High-level stats: Balanced horizontal card */}
            <div className="grid grid-cols-3 gap-3 sm:gap-6 bg-[var(--bg-surface)] p-4 sm:p-5 rounded-xl border border-[var(--border-line)] flex-shrink-0">
              {currentProduct.stats.map((stat) => (
                <div key={stat.label}>
                  <div className="font-display text-xl sm:text-2xl lg:text-3xl font-bold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                    {stat.value}
                  </div>
                  <div className="mt-1 font-mono text-[10px] sm:text-[11px] uppercase tracking-wider text-[var(--text-muted)] whitespace-nowrap">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="mt-4 text-sm sm:text-base leading-relaxed text-[var(--text-muted)] max-w-3xl">
            {currentProduct.summary}
          </p>

          {/* Conditional Product Breakdowns */}
          {activeTab === "bharatgig" && (
            <div className="mt-10 space-y-8 pt-8 border-t border-[var(--border-line)]">
              {/* Four Panels Breakdown */}
              <div>
                <h4 className="font-mono text-xs uppercase tracking-[0.14em] text-emerald-600 dark:text-emerald-400 font-bold mb-4 flex items-center gap-2">
                  <Layers size={14} />
                  <span>The Four Operational Panels:</span>
                </h4>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {bharatGigData.panels.map((p) => (
                    <div
                      key={p.name}
                      className="p-4 rounded-xl border border-[var(--border-line)] bg-[var(--bg-surface)] flex flex-col justify-between"
                    >
                      <div>
                        <div className="font-bold text-sm text-[var(--text-primary)]">{p.name}</div>
                        <div className="mt-1 font-mono text-[10px] text-emerald-500 uppercase tracking-wider">{p.target}</div>
                        <p className="mt-2 text-xs text-[var(--text-muted)] leading-relaxed">{p.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dynamic Geo-Pricing Engine */}
              <div>
                <h4 className="font-mono text-xs uppercase tracking-[0.14em] text-emerald-600 dark:text-emerald-400 font-bold mb-4 flex items-center gap-2">
                  <MapPin size={14} />
                  <span>Dynamic Location-Based Pricing Architecture:</span>
                </h4>
                <div className="grid sm:grid-cols-3 gap-4">
                  {bharatGigData.pricingArchitecture.map((pa) => (
                    <div
                      key={pa.title}
                      className="p-4 rounded-xl border border-[var(--border-line)] bg-[var(--bg-surface)]"
                    >
                      <div className="font-semibold text-sm text-[var(--text-primary)]">{pa.title}</div>
                      <p className="mt-2 text-xs text-[var(--text-muted)] leading-relaxed">{pa.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Core Systems Layered */}
              <div>
                <h4 className="font-mono text-xs uppercase tracking-[0.14em] text-emerald-600 dark:text-emerald-400 font-bold mb-4 flex items-center gap-2">
                  <Sliders size={14} />
                  <span>Platform Engines &amp; Financial Machinery:</span>
                </h4>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {bharatGigData.coreSystems.map((cs) => (
                    <div
                      key={cs.title}
                      className="p-4 rounded-xl border border-[var(--border-line)] bg-[var(--bg-surface)]"
                    >
                      <div className="font-semibold text-xs text-[var(--text-primary)] flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        <span>{cs.title}</span>
                      </div>
                      <p className="mt-2 text-xs text-[var(--text-muted)] leading-relaxed">{cs.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "ricroot" && (
            <div className="mt-10 space-y-8 pt-8 border-t border-[var(--border-line)]">
              <div>
                <h4 className="font-mono text-xs uppercase tracking-[0.14em] text-sky-500 font-bold mb-4 flex items-center gap-2">
                  <Users size={14} />
                  <span>Candidate App &amp; Employer Web Ecosystem:</span>
                </h4>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {ricRootData.corePieces.map((cp) => (
                    <div
                      key={cp.title}
                      className="p-4 rounded-xl border border-[var(--border-line)] bg-[var(--bg-surface)]"
                    >
                      <div className="font-semibold text-sm text-[var(--text-primary)] flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
                        <span>{cp.title}</span>
                      </div>
                      <p className="mt-2 text-xs text-[var(--text-muted)] leading-relaxed">{cp.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Data Foundation Callout */}
              <div className="p-5 rounded-xl border border-sky-500/30 bg-sky-500/5 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="text-sm font-bold text-[var(--text-primary)]">
                    Taxonomy Master Foundation for Blue/Grey-Collar India
                  </div>
                  <div className="mt-1 text-xs text-[var(--text-muted)]">
                    92,250+ Candidate Records · 212 Job Profiles · 709 Designations · 515 Degree Master · Geocoded Cities
                  </div>
                </div>
                <a
                  href="https://ricroot.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-mono text-xs font-semibold transition-all shadow-sm"
                >
                  <span>Explore RicRoot.in</span>
                  <ExternalLink size={13} />
                </a>
              </div>
            </div>
          )}

          {activeTab === "payeaze" && (
            <div className="mt-10 space-y-8 pt-8 border-t border-[var(--border-line)]">
              <div>
                <h4 className="font-mono text-xs uppercase tracking-[0.14em] text-amber-500 font-bold mb-4 flex items-center gap-2">
                  <Building2 size={14} />
                  <span>Multi-Tenant &amp; Compliance Architecture:</span>
                </h4>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {payEazeData.corePieces.map((cp) => (
                    <div
                      key={cp.title}
                      className="p-4 rounded-xl border border-[var(--border-line)] bg-[var(--bg-surface)]"
                    >
                      <div className="font-semibold text-sm text-[var(--text-primary)] flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                        <span>{cp.title}</span>
                      </div>
                      <p className="mt-2 text-xs text-[var(--text-muted)] leading-relaxed">{cp.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Multi-Tenant Callout */}
              <div className="p-5 rounded-xl border border-amber-500/30 bg-amber-500/5 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="text-sm font-bold text-[var(--text-primary)]">
                    Subdomain Multi-Tenant Isolation &amp; GTM Launch Plan
                  </div>
                  <div className="mt-1 text-xs text-[var(--text-muted)]">
                    Subdomain-partitioned client tenancies · 3 Role Views (Admin, SPOC, Employee) · 90-Day GTM Launch Roadmap
                  </div>
                </div>
                <div className="px-3.5 py-1.5 rounded-lg border border-amber-500/40 bg-amber-500/10 text-amber-500 font-mono text-xs font-semibold">
                  GTM Preparation Phase
                </div>
              </div>
            </div>
          )}

          {/* Product Modules Strip */}
          <div className="mt-10 pt-8 border-t border-[var(--border-line)]">
            <h4 className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--text-muted)] mb-4">
              Systems &amp; Architecture Modules Designed:
            </h4>
            <div className="flex flex-wrap gap-2.5">
              {productModules.map((mod) => (
                <span
                  key={mod.title}
                  className="font-mono text-xs px-3.5 py-2 rounded-lg border border-[var(--border-line)] bg-[var(--bg-surface)] text-[var(--text-primary)] hover:border-emerald-500/50 transition-colors"
                >
                  <span className="text-emerald-500 mr-2 font-bold">•</span>
                  {mod.title}
                </span>
              ))}
            </div>
          </div>

          {/* Lifecycle sequence */}
          <div className="mt-8 pt-6 border-t border-[var(--border-line)]">
            <h4 className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--text-muted)] mb-4">
              End-to-End Product Lifecycle Execution:
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              {lifecycleStages.map((stage) => (
                <div
                  key={stage.stage}
                  className="p-3 rounded-lg border border-[var(--border-line)] bg-[var(--bg-surface)]"
                >
                  <div className="font-mono text-[11px] font-bold text-emerald-500">
                    {stage.stage}
                  </div>
                  <div className="mt-1 text-xs text-[var(--text-muted)] leading-snug">
                    {stage.detail}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-[var(--border-line)]">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--text-dim)]">
              Enterprise Platforms &amp; Workflows — Veracity Supply Chain Limited
            </p>
            <div className="flex items-center gap-2 font-mono text-xs text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 size={15} />
              <span>Product Manager + Full Stack Engineer · Product &amp; Systems Architecture</span>
            </div>
          </div>
        </div>

        {/* 3. Earlier Projects Section */}
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
