import { useEffect, useState, useRef } from "react";
import { samayProfile } from "../data/samayProfile";
import { CheckCircle2, ShieldCheck, Zap, Activity } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function StatsHud() {
  const [isVisible, setIsVisible] = useState(false);
  const hudRef = useRef(null);
  const { isDark } = useTheme();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (hudRef.current) {
      observer.observe(hudRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={hudRef} className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="rounded-3xl border border-black/[0.08] dark:border-white/[0.08] bg-white/70 dark:bg-slate-900/40 backdrop-blur-2xl p-6 sm:p-8 relative overflow-hidden shadow-sm dark:shadow-2xl">

        {/* Top Header */}
        <div className="flex flex-wrap items-center justify-between border-b border-black/[0.06] dark:border-white/[0.06] pb-4 mb-8 font-mono text-xs text-slate-500 dark:text-slate-400 gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-900 dark:text-white font-semibold tracking-wide">ENGINEERING AUDIT REPORT</span>
            <span className="text-slate-400 dark:text-slate-600">//</span>
            <span className="text-sky-600 dark:text-sky-400 font-medium">PRODUCTION METRICS</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>AVAILABILITY: 99.98%</span>
            <span>OBSERVABILITY: 100%</span>
          </div>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {samayProfile.stats.map((st, i) => (
            <div
              key={st.label}
              className="p-6 rounded-2xl border border-black/[0.06] dark:border-white/[0.06] bg-slate-50/70 dark:bg-slate-950/50 hover:border-sky-500/30 hover:bg-white dark:hover:bg-slate-900/60 transition-all duration-300 group shadow-sm"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-mono text-sky-600 dark:text-sky-400 tracking-wider font-semibold">
                  0{i + 1} // METRIC
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700 group-hover:bg-sky-400 transition-colors" />
              </div>

              <div className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white font-mono tracking-tight my-2 flex items-baseline">
                <span>{isVisible ? st.value : 0}</span>
                <span className="text-sky-600 dark:text-sky-400 text-2xl ml-1 font-bold">{st.suffix}</span>
              </div>

              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-1 font-display">
                {st.label}
              </p>

              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 font-light leading-relaxed">
                {st.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
