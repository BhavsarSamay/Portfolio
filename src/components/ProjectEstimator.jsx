import { useState } from "react";
import { Calculator, Check, ArrowRight, Zap, Layers, Cpu, Clock } from "lucide-react";
import { playCyberClick } from "../utils/soundEffects";
import { useTheme } from "../context/ThemeContext";

const PROJECT_TYPES = [
  { id: "saas", name: "Full-Stack SaaS MVP", baseDays: 14, baseCost: 3500 },
  { id: "distributed", name: "High-Scale Distributed Backend", baseDays: 21, baseCost: 5500 },
  { id: "ai", name: "AI Agent & Workflow Pipeline", baseDays: 16, baseCost: 4200 },
  { id: "webgl", name: "Interactive 3D / WebGL Interface", baseDays: 12, baseCost: 3200 }
];

const ADDONS = [
  { id: "raft", name: "Distributed Consensus & Raft", days: 7, cost: 1800 },
  { id: "vector", name: "Vector Search & RAG Architecture", days: 5, cost: 1400 },
  { id: "payment", name: "Multi-Currency Ledger & Payments", days: 4, cost: 1100 },
  { id: "ebpf", name: "Kernel Observability & Monitoring", days: 6, cost: 1600 }
];

export default function ProjectEstimator() {
  const [selectedType, setSelectedType] = useState(PROJECT_TYPES[0]);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const { isDark } = useTheme();

  const toggleAddon = (addon) => {
    playCyberClick();
    if (selectedAddons.find((a) => a.id === addon.id)) {
      setSelectedAddons(selectedAddons.filter((a) => a.id !== addon.id));
    } else {
      setSelectedAddons([...selectedAddons, addon]);
    }
  };

  const totalDays = selectedType.baseDays + selectedAddons.reduce((acc, curr) => acc + curr.days, 0);
  const totalCost = selectedType.baseCost + selectedAddons.reduce((acc, curr) => acc + curr.cost, 0);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="rounded-3xl border border-black/[0.08] dark:border-white/[0.08] bg-white/70 dark:bg-slate-900/40 backdrop-blur-2xl p-6 sm:p-10 relative overflow-hidden shadow-sm dark:shadow-2xl">
        
        {/* Header */}
        <div className="space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 dark:bg-sky-950/40 border border-sky-500/20 text-sky-600 dark:text-sky-400 font-mono text-xs font-semibold tracking-wider uppercase">
            <Calculator className="w-3.5 h-3.5 text-sky-500 dark:text-sky-400" />
            <span>Interactive Scope Calculator</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-white font-display tracking-tight">
            Estimate Engineering Scope & Architecture
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm max-w-xl font-light">
            Configure system complexity to preview projected delivery cycles and architectural components.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Options (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1: Project Archetype */}
            <div className="space-y-3">
              <label className="block text-xs font-mono text-slate-700 dark:text-slate-300 uppercase tracking-wider font-semibold">
                01 // Select Core Architecture Archetype:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PROJECT_TYPES.map((type) => {
                  const isSelected = selectedType.id === type.id;
                  return (
                    <button
                      key={type.id}
                      onClick={() => {
                        playCyberClick();
                        setSelectedType(type);
                      }}
                      className={`p-4 rounded-2xl border text-left transition-all space-y-1.5 shadow-sm ${
                        isSelected
                          ? "border-sky-500 bg-sky-50 dark:bg-sky-950/40 text-slate-900 dark:text-white shadow-[0_0_20px_rgba(56,189,248,0.2)]"
                          : "border-black/[0.06] dark:border-white/[0.06] bg-slate-50/70 dark:bg-slate-950/60 text-slate-600 dark:text-slate-400 hover:border-sky-500/30 hover:text-slate-900 dark:hover:text-slate-200"
                      }`}
                    >
                      <div className="font-semibold text-sm font-display text-slate-900 dark:text-white">
                        {type.name}
                      </div>
                      <div className="text-xs font-mono text-sky-600 dark:text-sky-300 font-medium">
                        Base: ~{type.baseDays} working days
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Addons */}
            <div className="space-y-3">
              <label className="block text-xs font-mono text-slate-700 dark:text-slate-300 uppercase tracking-wider font-semibold">
                02 // Specialized Subsystems & Accelerators:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ADDONS.map((addon) => {
                  const isChecked = !!selectedAddons.find((a) => a.id === addon.id);
                  return (
                    <button
                      key={addon.id}
                      onClick={() => toggleAddon(addon)}
                      className={`p-4 rounded-2xl border text-left flex items-center justify-between transition-all shadow-sm ${
                        isChecked
                          ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 text-slate-900 dark:text-white shadow-[0_0_20px_rgba(99,102,241,0.2)]"
                          : "border-black/[0.06] dark:border-white/[0.06] bg-slate-50/70 dark:bg-slate-950/60 text-slate-600 dark:text-slate-400 hover:border-indigo-500/30 hover:text-slate-900 dark:hover:text-slate-200"
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 font-display">
                          {addon.name}
                        </div>
                        <div className="text-[11px] font-mono text-indigo-600 dark:text-indigo-300 font-medium">
                          +{addon.days} days
                        </div>
                      </div>

                      <div
                        className={`w-5 h-5 rounded-lg flex items-center justify-center border transition-all ${
                          isChecked
                            ? "bg-indigo-600 border-indigo-500 text-white"
                            : "border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                        }`}
                      >
                        {isChecked && <Check className="w-3.5 h-3.5" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Results Summary (5 Cols) */}
          <div className="lg:col-span-5 rounded-3xl border border-black/[0.08] dark:border-white/[0.1] bg-white/90 dark:bg-[#0b0f19] p-7 sm:p-8 space-y-6 shadow-xl font-mono">
            <div className="flex items-center justify-between border-b border-black/[0.06] dark:border-white/[0.08] pb-4">
              <span className="text-xs font-bold text-slate-900 dark:text-white tracking-wider">
                ESTIMATED PROJECTION
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 text-[11px] border border-sky-500/30 font-medium">
                Provisional
              </span>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-sky-500 dark:text-sky-400" />
                  Estimated Turnaround:
                </span>
                <span className="text-lg font-bold text-sky-600 dark:text-sky-300">
                  ~{totalDays} Working Days
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
                  Indicative Budget:
                </span>
                <span className="text-2xl font-black text-slate-900 dark:text-white">
                  ${totalCost.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-black/[0.06] dark:border-white/[0.06] text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans font-light">
              Includes full source code ownership, automated CI/CD deployment pipelines, unit test suites, and documentation.
            </div>

            <a
              href="#contact"
              onClick={() => playCyberClick()}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(56,189,248,0.3)] transition-all font-sans"
            >
              <span>Lock in Architecture Specs</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

        </div>

      </div>
    </section>
  );
}
