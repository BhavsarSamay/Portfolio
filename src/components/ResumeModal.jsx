import React, { useEffect, useRef } from "react";
import { X, Download, Printer, FileText, CheckCircle2 } from "lucide-react";
import { samayProfile } from "../data/samayProfile";
import { experience } from "../data/experience";
import { playCyberClick, playSuccessChime } from "../utils/soundEffects";
import { useTheme } from "../context/ThemeContext";

export default function ResumeModal({ isOpen, onClose }) {
  const { isDark } = useTheme();
  const contentRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.__lenis?.stop();

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    const container = contentRef.current;
    const handleWheel = (e) => {
      e.stopPropagation();
    };

    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: true });
    }

    return () => {
      document.body.style.overflow = originalOverflow;
      window.__lenis?.start();
      window.removeEventListener("keydown", handleKeyDown);
      if (container) {
        container.removeEventListener("wheel", handleWheel);
      }
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handlePrint = () => {
    playCyberClick();
    window.print();
  };

  const handleDownload = () => {
    playSuccessChime();
    const resumeText = `SAMAY BHAVSAR — ASSOCIATE PRODUCT MANAGER & SYSTEMS ARCHITECT
Email: ${samayProfile.email} | Phone: ${samayProfile.phone} | Location: ${samayProfile.location}
LinkedIn: ${samayProfile.linkedin} | GitHub: ${samayProfile.github}

EXECUTIVE SUMMARY:
Associate Product Manager and Systems Architect at Veracity Supply Chain Limited. Designs end-to-end systems architecture for workforce, recruitment, and compliance platforms. Background in distributed systems, backend engineering, and production AI automation.

EXPERIENCE:
${experience.map(e => `${e.role} (${e.subrole || ''}) — ${e.company} [${e.period}]\n${(e.points || []).map(p => `• ${p}`).join("\n")}`).join("\n\n")}

TECHNICAL ECOSYSTEM:
• Languages: JavaScript (ES2022+), Python, Java, SQL
• AI & LLM: LangChain.js, RAG Pipelines, Agentic Systems, Vector Databases, OpenAI API
• Backend & Systems: Node.js, Express.js, Socket.io, FastAPI, Django, REST APIs, Microservices, Stripe API, JWT / RBAC
• Databases & Infra: MongoDB, PostgreSQL, Redis (Caching), Aggregation Pipelines, Docker, Git, Swagger / OpenAPI

EDUCATION:
Bachelor of Information Technology — LJ Institute of Engineering and Technology [Nov 2022 – Present]
CPI: 8.45 / 10.0
`;
    const blob = new Blob([resumeText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Samay_Bhavsar_Resume.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      data-lenis-prevent="true"
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 backdrop-blur-md transition-all ${
        isDark ? "bg-black/75" : "bg-slate-900/35"
      }`}
      onClick={() => {
        playCyberClick();
        onClose();
      }}
    >
      <div
        data-lenis-prevent="true"
        className="relative w-full max-w-3xl rounded-2xl border border-[var(--border-line)] bg-[var(--bg-card)] text-[var(--text-primary)] flex flex-col max-h-[90vh] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-[var(--bg-surface)] border-b border-[var(--border-line)]">
          <div className="flex items-center gap-2 font-display text-sm font-bold">
            <FileText className="w-4 h-4 text-emerald-500" />
            <span>Samay_Bhavsar_Dossier.pdf</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>
            <button
              onClick={handlePrint}
              className="p-1.5 rounded-lg border border-[var(--border-line)] hover:bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
              title="Print Resume"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                playCyberClick();
                onClose();
              }}
              className="p-1.5 rounded-lg border border-[var(--border-line)] hover:bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Resume Content Body */}
        <div
          ref={contentRef}
          data-lenis-prevent="true"
          className="flex-1 p-6 sm:p-10 overflow-y-auto overscroll-contain touch-pan-y space-y-8 select-text custom-scrollbar"
        >
          {/* Header */}
          <div className="border-b border-[var(--border-line)] pb-6 space-y-2">
            <h2 className="text-3xl font-bold font-display tracking-tight text-[var(--text-primary)]">
              {samayProfile.name}
            </h2>
            <p className="text-emerald-600 dark:text-emerald-400 font-mono text-sm font-semibold">
              {samayProfile.role} · {samayProfile.product}
            </p>
            <div className="flex flex-wrap gap-4 text-xs text-[var(--text-muted)] pt-1 font-mono">
              <span>{samayProfile.email}</span>
              <span>•</span>
              <span>{samayProfile.phone}</span>
              <span>•</span>
              <span>{samayProfile.location}</span>
            </div>
          </div>

          {/* Executive Summary */}
          <div className="space-y-2">
            <h3 className="font-mono text-xs uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-bold">
              // Summary
            </h3>
            <p className="text-sm leading-relaxed text-[var(--text-muted)]">
              Associate Product Manager and Systems Architect at Veracity Supply Chain Limited. Designs end-to-end systems architecture for workforce, recruitment, and compliance platforms. Background in distributed systems, scalable backend engineering, and production AI automation.
            </p>
          </div>

          {/* Experience */}
          <div className="space-y-4">
            <h3 className="font-mono text-xs uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-bold">
              // Professional Experience
            </h3>
            <div className="space-y-6">
              {experience.map((exp) => (
                <div key={exp.company} className="space-y-2 border-l-2 border-emerald-500/40 pl-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                    <h4 className="text-base font-bold font-display text-[var(--text-primary)]">
                      {exp.role} <span className="text-emerald-600 dark:text-emerald-400 font-normal">@ {exp.company}</span>
                    </h4>
                    <span className="text-xs font-mono text-[var(--text-dim)]">
                      {exp.period}
                    </span>
                  </div>
                  {exp.subrole && (
                    <p className="text-xs font-mono text-[var(--text-muted)]">{exp.subrole}</p>
                  )}
                  <ul className="space-y-1.5 pt-1">
                    {(exp.points || []).map((pt, i) => (
                      <li key={i} className="text-xs text-[var(--text-muted)] flex items-start gap-2">
                        <span className="text-emerald-500 mt-0.5">•</span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Education & Core Competencies */}
          <div className="space-y-4 border-t border-[var(--border-line)] pt-6">
            <h3 className="font-mono text-xs uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-bold">
              // Education & Credentials
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-3.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-line)] space-y-1">
                <div className="text-[var(--text-dim)]">Education:</div>
                <div className="text-[var(--text-primary)] font-semibold">Bachelor of Information Technology</div>
                <div className="text-[var(--text-muted)] text-[11px]">LJ Institute of Engineering &amp; Technology · CPI: 8.45/10</div>
              </div>
              <div className="p-3.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-line)] space-y-1">
                <div className="text-[var(--text-dim)]">Honors &amp; Track Record:</div>
                <div className="text-[var(--text-primary)] font-semibold">Star Performer of the Month (Feb 2026)</div>
                <div className="text-[var(--text-muted)] text-[11px]">Saturncube Technology · Backend &amp; Agentic AI</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
