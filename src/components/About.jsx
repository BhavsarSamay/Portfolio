import { useState, useEffect } from "react";
import {
  Clock,
  Cpu,
  ShieldCheck,
  Sparkles,
  Workflow,
  Terminal,
  Layers
} from "lucide-react";
import { samayProfile } from "../data/samayProfile";
import { useTheme } from "../context/ThemeContext";

export default function About() {
  const [localTime, setLocalTime] = useState("");
  const { isDark } = useTheme();

  useEffect(() => {
    const updateTime = () => {
      try {
        const timeStr = new Date().toLocaleTimeString("en-IN", {
          timeZone: "Asia/Kolkata",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        });
        setLocalTime(timeStr);
      } catch {
        setLocalTime("12:00:00 PM IST");
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const coreTenets = [
    {
      title: "Predictable Latency First",
      desc: "Architecting systems with bounded p99 tail latencies, non-blocking asynchronous I/O, and aggressive cache warming.",
      icon: <Cpu className="w-5 h-5 text-sky-500 dark:text-sky-400" />
    },
    {
      title: "Resilient Failure Domains",
      desc: "Engineering defensive backpressure, distributed circuit breakers, and idempotent retry queues that gracefully handle disruptions.",
      icon: <ShieldCheck className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
    },
    {
      title: "High-Craft Fluid Interfaces",
      desc: "Building web interfaces that respond under 50ms with 60fps animations, intuitive keyboard navigation, and zero visual jank.",
      icon: <Sparkles className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
    }
  ];

  return (
    <section id="about" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20">
      {/* Header */}
      <div className="space-y-3 mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 dark:bg-sky-950/40 border border-sky-500/20 text-sky-600 dark:text-sky-400 font-mono text-xs font-semibold tracking-wider uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-sky-500 dark:bg-sky-400" />
          <span>01 // Architectural Profile</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white font-display tracking-tight">
          Engineering Mindset & <span className="text-gradient-main">Technical DNA</span>
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base max-w-2xl font-light">
          A disciplined philosophy centered around high throughput, predictable system performance, and modern web elegance.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

        {/* Left 7 Cols: Narrative & Tenets */}
        <div className="lg:col-span-7 space-y-8">
          <div className="p-8 rounded-3xl border border-black/[0.08] dark:border-white/[0.08] bg-white/70 dark:bg-slate-900/40 backdrop-blur-2xl space-y-6 text-slate-700 dark:text-slate-300 leading-relaxed font-light text-base shadow-sm dark:shadow-xl">
            <p>
              My engineering philosophy revolves around a simple conviction: <strong className="text-slate-900 dark:text-white font-semibold">great software must feel effortless on the outside, and look like rigorous engineering on the inside</strong>.
            </p>
            <p>
              I bridge the gap between heavy distributed systems (consensus algorithms, event streaming, multi-region datastores) and polished, silky client experiences. Whether constructing an autonomous multi-agent task runner in <span className="text-sky-600 dark:text-sky-300 font-mono text-sm font-medium">Go</span> or designing a real-time collaborative WebGL canvas in <span className="text-indigo-600 dark:text-indigo-300 font-mono text-sm font-medium">React 19</span>, I prioritize measurable correctness, low latency, and zero single points of failure.
            </p>
            <p>
              Beyond the code, I care deeply about developer velocity: automated CI/CD pipelines, reproducible containerized environments, and clean separation of concerns.
            </p>
          </div>

          {/* Architectural Tenets */}
          <div className="space-y-4">
            <h3 className="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-2 font-semibold">
              <Workflow className="w-4 h-4 text-sky-500 dark:text-sky-400" />
              <span>Core Architectural Tenets</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {coreTenets.map((tenet) => (
                <div
                  key={tenet.title}
                  className="p-5 rounded-2xl border border-black/[0.06] dark:border-white/[0.06] bg-slate-50/70 dark:bg-slate-950/50 hover:border-sky-500/30 hover:bg-white dark:hover:bg-slate-900/70 transition-all space-y-3 shadow-sm"
                >
                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-black/[0.06] dark:border-white/[0.08] w-max shadow-xs">
                    {tenet.icon}
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight font-display">
                    {tenet.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal font-light">
                    {tenet.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 5 Cols: System & Environment Specs */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-3xl border border-black/[0.08] dark:border-white/[0.08] bg-white/80 dark:bg-[#0b0f19]/80 backdrop-blur-2xl p-6 sm:p-7 space-y-6 shadow-sm dark:shadow-2xl">

            {/* Header with Live Local Time in India */}
            <div className="flex items-center justify-between border-b border-black/[0.06] dark:border-white/[0.08] pb-4">
              <div className="flex items-center gap-2 font-display text-sm font-bold text-slate-900 dark:text-white">
                <Terminal className="w-4 h-4 text-sky-500 dark:text-sky-400" />
                <span>Primary Tech Stack</span>
              </div>
              <div className="flex items-center gap-2 font-mono text-xs text-sky-600 dark:text-sky-300">
                <Clock className="w-3.5 h-3.5 text-sky-500 dark:text-sky-400" />
                <span>{localTime || "IST (UTC+5:30)"}</span>
              </div>
            </div>

            {/* Spec Attributes */}
            <div className="space-y-3 font-mono text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-950/60 border border-black/[0.06] dark:border-white/[0.06] space-y-1">
                <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
                  // Primary Runtimes & Languages
                </div>
                <div className="text-slate-800 dark:text-slate-200 font-medium">
                  TypeScript, Go (Golang), Python 3.12, Node.js 22, SQL
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-950/60 border border-black/[0.06] dark:border-white/[0.06] space-y-1">
                <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
                  // Frontend & Graphics Stack
                </div>
                <div className="text-slate-800 dark:text-slate-200 font-medium">
                  React 19, Next.js, Tailwind CSS v4, Three.js, WebGL, Framer
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-950/60 border border-black/[0.06] dark:border-white/[0.06] space-y-1">
                <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
                  // Storage, Messaging & Caching
                </div>
                <div className="text-slate-800 dark:text-slate-200 font-medium">
                  PostgreSQL, Redis 7, Kafka, RocksDB, Vector DBs
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-950/60 border border-black/[0.06] dark:border-white/[0.06] space-y-1">
                <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
                  // Cloud & Infrastructure
                </div>
                <div className="text-slate-800 dark:text-slate-200 font-medium">
                  Docker, Kubernetes, AWS (ECS, Lambda), Cloudflare Workers
                </div>
              </div>
            </div>

            {/* Operational Status Footer */}
            <div className="pt-2 border-t border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between text-xs font-mono">
              <span className="text-slate-500 dark:text-slate-400">Current Status:</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Available for Engagements
              </span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
