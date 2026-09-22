import { useState, useEffect, useRef } from "react";
import { X, ExternalLink, Copy, Check, Terminal, Cpu, CheckCircle, Sparkles, ArrowUpRight, ShieldCheck, Layers, GitBranch, Zap } from "lucide-react";
import { GithubIcon } from "./Icons";
import { playCyberClick, playSuccessChime } from "../utils/soundEffects";
import { useTheme } from "../context/ThemeContext";

export default function ProjectModal({ project, onClose }) {
  const { isDark } = useTheme();
  const [copiedCode, setCopiedCode] = useState(false);
  const contentRef = useRef(null);

  // Keyboard navigation, keypad scrolling, and trackpad 2-finger wheel event protection
  useEffect(() => {
    // 1. Lock body scroll
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // 2. Focus scroll container immediately so keyboard and keypad keys target the popup
    const focusTimer = setTimeout(() => {
      contentRef.current?.focus();
    }, 60);

    // 3. Ensure native 2-finger trackpad/mouse wheel scrolling works inside the modal
    const container = contentRef.current;
    const handleWheel = (e) => {
      // Prevent parent windows from swallowing the wheel event
      e.stopPropagation();
    };

    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: true });
    }

    // 4. Handle keyboard & keypad scrolling
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }

      // Check if user is scrolling with keyboard or keypad
      const scrollKeys = [
        "ArrowDown", "Down", "ArrowUp", "Up",
        "PageDown", "PageUp", "Home", "End", " ",
        "Numpad2", "Numpad8", "Numpad3", "Numpad9", "Numpad7", "Numpad1"
      ];

      const isScrollKey = scrollKeys.includes(e.key) || scrollKeys.includes(e.code);

      if (isScrollKey) {
        if (!container) return;

        // Prevent window or background page from scrolling
        e.preventDefault();
        e.stopPropagation();

        const isDown = e.key === "ArrowDown" || e.key === "Down" || e.code === "Numpad2";
        const isUp = e.key === "ArrowUp" || e.key === "Up" || e.code === "Numpad8";
        const isPgDn = e.key === "PageDown" || e.code === "Numpad3" || (e.key === " " && !e.shiftKey);
        const isPgUp = e.key === "PageUp" || e.code === "Numpad9" || (e.key === " " && e.shiftKey);
        const isHome = e.key === "Home" || e.code === "Numpad7";
        const isEnd = e.key === "End" || e.code === "Numpad1";

        if (isDown) {
          container.scrollBy({ top: 80, behavior: "smooth" });
        } else if (isUp) {
          container.scrollBy({ top: -80, behavior: "smooth" });
        } else if (isPgDn) {
          container.scrollBy({ top: container.clientHeight * 0.75, behavior: "smooth" });
        } else if (isPgUp) {
          container.scrollBy({ top: -container.clientHeight * 0.75, behavior: "smooth" });
        } else if (isHome) {
          container.scrollTo({ top: 0, behavior: "smooth" });
        } else if (isEnd) {
          container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown, { passive: false });

    return () => {
      clearTimeout(focusTimer);
      if (container) {
        container.removeEventListener("wheel", handleWheel);
      }
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  if (!project) return null;

  const handleCopyCode = () => {
    if (!project.codeSnippet) return;
    navigator.clipboard.writeText(project.codeSnippet);
    playSuccessChime();
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const githubUrl = project.githubUrl || project.href || "https://github.com/BhavsarSamay";

  return (
    <div
      data-lenis-prevent="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-hidden"
    >
      {/* Translucent Frosted Glass Overlay: clearly shows the portfolio softly blurred underneath */}
      <div
        data-lenis-prevent="true"
        className={`fixed inset-0 transition-all duration-300 animate-fadeIn cursor-pointer ${
          isDark
            ? "bg-slate-950/65 backdrop-blur-md"
            : "bg-slate-900/35 backdrop-blur-md"
        }`}
        onClick={() => {
          playCyberClick();
          onClose();
        }}
        title="Click outside to return to portfolio"
      />

      {/* Floating Cyber Glass Popup Window */}
      <div
        data-lenis-prevent="true"
        className={`relative w-full max-w-4xl rounded-2xl sm:rounded-3xl border transition-all animate-scaleUp z-10 overflow-hidden flex flex-col max-h-[85vh] backdrop-blur-2xl ${
          isDark
            ? "border-emerald-500/35 bg-[#0C101A]/95 text-slate-100 shadow-[0_25px_80px_rgba(0,0,0,0.85),0_0_50px_rgba(16,185,129,0.12)]"
            : "border-slate-200/90 bg-white/95 text-slate-900 shadow-[0_25px_80px_rgba(0,0,0,0.2),0_0_40px_rgba(16,185,129,0.08)]"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top ambient luminous specular line */}
        <div className="absolute inset-x-12 top-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500 via-sky-500 to-transparent pointer-events-none" />

        {/* Sticky Header Bar */}
        <div
          className={`sticky top-0 z-20 flex items-center justify-between border-b px-5 sm:px-7 py-3.5 backdrop-blur-xl transition-colors ${
            isDark
              ? "border-white/10 bg-[#0C101A]/95 text-slate-100"
              : "border-slate-200/80 bg-slate-50/95 text-slate-900"
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
            <span
              className={`font-mono text-[10px] sm:text-[11px] uppercase tracking-wider font-semibold truncate ${
                isDark ? "text-emerald-400" : "text-emerald-700"
              }`}
            >
              SYSTEM ARCHITECTURE SPECIFICATION · {project.category?.toUpperCase() || "ENGINEERING"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => playCyberClick()}
              className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono transition-all ${
                isDark
                  ? "border-white/15 bg-white/5 hover:bg-emerald-500/15 hover:border-emerald-500/50 hover:text-emerald-300 text-slate-200"
                  : "border-slate-200 bg-white hover:bg-emerald-50 hover:border-emerald-500/50 hover:text-emerald-700 text-slate-700 shadow-sm"
              }`}
            >
              <GithubIcon className="w-3.5 h-3.5" />
              <span>Source Repo</span>
              <ArrowUpRight size={13} />
            </a>

            <button
              onClick={() => {
                playCyberClick();
                onClose();
              }}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border transition-colors text-xs font-mono ${
                isDark
                  ? "border-white/15 bg-white/5 hover:bg-red-500/15 hover:border-red-500/40 text-slate-300 hover:text-red-300"
                  : "border-slate-200 bg-white hover:bg-red-50 hover:border-red-300 text-slate-600 hover:text-red-600 shadow-sm"
              }`}
              title="Close Dossier (Esc)"
            >
              <span className="hidden sm:inline text-[10px] opacity-70">ESC</span>
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Dossier Content Area: Full 2-finger trackpad, mousewheel & keyboard scroll */}
        <div
          ref={contentRef}
          tabIndex={0}
          data-lenis-prevent="true"
          className="overflow-y-auto overscroll-contain touch-pan-y p-5 sm:p-8 space-y-7 custom-scrollbar focus:outline-none select-text"
        >
          {/* 1. Project Title & Mission Header */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <span
                className={`px-3 py-1 rounded-full border font-mono text-[11px] font-semibold shadow-sm ${
                  isDark
                    ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-300"
                    : "border-emerald-600/30 bg-emerald-50 text-emerald-800"
                }`}
              >
                Production Architecture
              </span>
              {project.metrics && (
                <span className={`font-mono text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                  // {project.metrics}
                </span>
              )}
            </div>

            <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-bold font-display tracking-tight ${
              isDark ? "text-white" : "text-slate-900"
            }`}>
              {project.title}
            </h2>

            {project.tagline && (
              <p className={`text-sm sm:text-base font-medium font-mono ${
                isDark ? "text-emerald-400" : "text-emerald-700"
              }`}>
                {project.tagline}
              </p>
            )}

            <p className={`text-sm sm:text-base leading-relaxed font-normal max-w-3xl ${
              isDark ? "text-slate-300 font-light" : "text-slate-600"
            }`}>
              {project.description}
            </p>
          </div>

          {/* 2. Key Quantitative System Stats */}
          {project.stats && (
            <div className={`grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl border ${
              isDark
                ? "bg-white/[0.03] border-white/10"
                : "bg-emerald-50/50 border-emerald-200/70 shadow-sm"
            }`}>
              {project.stats.map((stat, i) => (
                <div key={i} className="px-2">
                  <div className={`text-xl sm:text-2xl font-bold font-display ${
                    isDark ? "text-emerald-400" : "text-emerald-700"
                  }`}>
                    {stat.value}
                  </div>
                  <div className={`mt-1 font-mono text-[10px] uppercase tracking-wider ${
                    isDark ? "text-slate-400" : "text-slate-600 font-medium"
                  }`}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 3. Problem Statement & Real-World Context */}
          {project.problemStatement && (
            <div className={`p-5 rounded-2xl border space-y-2 ${
              isDark
                ? "border-amber-500/25 bg-amber-500/[0.04]"
                : "border-amber-200 bg-amber-50/80 shadow-sm"
            }`}>
              <div className={`flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider ${
                isDark ? "text-amber-400" : "text-amber-800"
              }`}>
                <Zap size={14} />
                <span>The Engineering Problem &amp; Operational Context</span>
              </div>
              <p className={`text-xs sm:text-sm leading-relaxed ${
                isDark ? "text-slate-300" : "text-slate-700"
              }`}>
                {project.problemStatement}
              </p>
            </div>
          )}

          {/* 4. Architecture Pipeline & Dataflow Topology */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className={`font-mono text-xs uppercase tracking-widest font-bold flex items-center gap-2 ${
                isDark ? "text-sky-400" : "text-sky-700"
              }`}>
                <Cpu size={14} />
                <span>End-to-End Data &amp; Control Topology</span>
              </h3>
              <span className={`font-mono text-[10px] uppercase ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                Distributed Flow
              </span>
            </div>

            {/* Pipeline Stage Cards */}
            {project.pipelineStages ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {project.pipelineStages.map((stage, idx) => (
                  <div
                    key={idx}
                    className={`relative p-4 rounded-xl border flex flex-col justify-between transition-colors ${
                      isDark
                        ? "border-sky-500/20 bg-sky-500/[0.03] hover:border-sky-500/40"
                        : "border-sky-200 bg-sky-50/70 hover:border-sky-300 shadow-sm"
                    }`}
                  >
                    <div className={`font-mono text-[10px] font-bold mb-1 ${
                      isDark ? "text-sky-400" : "text-sky-700"
                    }`}>
                      STAGE 0{idx + 1}
                    </div>
                    <div className={`font-bold text-xs mb-2 ${
                      isDark ? "text-white" : "text-slate-900"
                    }`}>
                      {stage.name}
                    </div>
                    <p className={`text-[11px] leading-relaxed ${
                      isDark ? "text-slate-300" : "text-slate-600"
                    }`}>
                      {stage.desc}
                    </p>
                  </div>
                ))}
              </div>
            ) : null}

            {/* Linear Pipeline Trace */}
            <div className={`p-4 rounded-xl border font-mono text-xs ${
              isDark
                ? "border-sky-500/30 bg-sky-950/30 text-slate-200"
                : "border-slate-200 bg-slate-100/90 text-slate-800"
            }`}>
              <div className={`font-bold mb-1 flex items-center gap-1.5 text-[11px] ${
                isDark ? "text-sky-300" : "text-sky-800"
              }`}>
                <GitBranch size={13} /> Pipeline Data Route:
              </div>
              <code className="text-xs block leading-relaxed break-words">
                {project.architecture}
              </code>
            </div>
          </div>

          {/* 5. Key Engineering Challenges & Trade-offs */}
          {project.challenges && (
            <div className="space-y-3">
              <h3 className={`font-mono text-xs uppercase tracking-widest font-bold flex items-center gap-2 ${
                isDark ? "text-emerald-400" : "text-emerald-700"
              }`}>
                <ShieldCheck size={14} />
                <span>Engineering Challenges &amp; Technical Decisions</span>
              </h3>
              <div className="grid sm:grid-cols-3 gap-3">
                {project.challenges.map((ch, i) => (
                  <div
                    key={i}
                    className={`p-4 rounded-xl border space-y-2 transition-colors ${
                      isDark
                        ? "border-white/10 bg-white/[0.02] hover:border-emerald-500/30"
                        : "border-slate-200 bg-slate-50/80 hover:border-emerald-300 shadow-sm"
                    }`}
                  >
                    <div className={`font-semibold text-xs flex items-center gap-1.5 ${
                      isDark ? "text-white" : "text-slate-900"
                    }`}>
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      <span>{ch.title}</span>
                    </div>
                    <p className={`text-[11px] leading-relaxed ${
                      isDark ? "text-slate-400" : "text-slate-600"
                    }`}>
                      {ch.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. Production Code Snippet Preview */}
          {project.codeSnippet && (
            <div className="space-y-2">
              <div className="flex items-center justify-between font-mono text-xs">
                <span className={`flex items-center gap-1.5 font-semibold ${
                  isDark ? "text-indigo-300" : "text-indigo-700"
                }`}>
                  <Terminal className="w-4 h-4 text-indigo-500" />
                  <span>Core Implementation Code</span>
                </span>
                <button
                  onClick={handleCopyCode}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-colors text-xs font-mono font-medium border ${
                    isDark
                      ? "bg-white/10 hover:bg-white/15 text-slate-200 border-white/10"
                      : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-sm"
                  }`}
                >
                  {copiedCode ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-emerald-500">Copied to Clipboard</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Snippet</span>
                    </>
                  )}
                </button>
              </div>

              <pre className="p-4 sm:p-5 rounded-2xl bg-[#0B0F19] border border-slate-800 font-mono text-xs text-emerald-400 overflow-x-auto leading-relaxed shadow-inner">
                <code>{project.codeSnippet}</code>
              </pre>
            </div>
          )}

          {/* 7. Engineering Highlights */}
          {project.highlights && (
            <div className="space-y-3">
              <h3 className={`font-mono text-xs uppercase tracking-widest font-semibold flex items-center gap-2 ${
                isDark ? "text-slate-400" : "text-slate-600"
              }`}>
                <Sparkles size={14} className="text-amber-500" />
                <span>System Features &amp; Capabilities</span>
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {project.highlights.map((h, i) => (
                  <div
                    key={i}
                    className={`flex items-start gap-2.5 p-3.5 rounded-xl border text-xs ${
                      isDark
                        ? "bg-white/[0.02] border-white/10 text-slate-300"
                        : "bg-slate-50/70 border-slate-200 text-slate-700 shadow-sm"
                    }`}
                  >
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{h}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 8. Full Categorized Tech Stack */}
          <div className="space-y-3 pt-2">
            <h3 className={`font-mono text-xs uppercase tracking-widest font-semibold ${
              isDark ? "text-slate-400" : "text-slate-600"
            }`}>
              // Technology Stack &amp; Dependencies
            </h3>
            <div className="flex flex-wrap gap-2">
              {project.tech.map((t) => (
                <span
                  key={t}
                  className={`px-3 py-1 rounded-lg border font-mono text-xs transition-colors ${
                    isDark
                      ? "bg-white/5 border-white/10 text-slate-300 hover:border-emerald-500/40"
                      : "bg-slate-100 border-slate-200 text-slate-700 hover:border-emerald-400 shadow-xs"
                  }`}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Sticky Bottom Action Bar */}
        <div
          className={`border-t px-5 sm:px-7 py-3.5 flex flex-wrap items-center justify-between gap-4 transition-colors ${
            isDark
              ? "border-white/10 bg-[#0C101A]/95 text-slate-100"
              : "border-slate-200 bg-slate-50/95 text-slate-900"
          }`}
        >
          <div className="flex items-center gap-3">
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => playCyberClick()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-semibold shadow-md transition-all hover:-translate-y-0.5"
            >
              <GithubIcon className="w-4 h-4" />
              <span>Explore GitHub Repository</span>
              <ArrowUpRight size={14} />
            </a>

            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => playCyberClick()}
                className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border font-mono text-xs font-semibold transition-all ${
                  isDark
                    ? "border-white/15 bg-white/5 hover:bg-white/10 text-white"
                    : "border-slate-300 bg-white hover:bg-slate-100 text-slate-800 shadow-sm"
                }`}
              >
                <span>Live Platform</span>
                <ExternalLink size={14} />
              </a>
            )}
          </div>

          <button
            onClick={() => {
              playCyberClick();
              onClose();
            }}
            className={`font-mono text-xs transition-colors underline underline-offset-4 ${
              isDark ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Return to Portfolio
          </button>
        </div>
      </div>
    </div>
  );
}
