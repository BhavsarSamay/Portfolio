import React, { useState, useEffect } from "react";
import { ArrowUpRight, Clock, MapPin, Building2, Anchor } from "lucide-react";
import { samayProfile } from "../data/samayProfile";
import samayPhoto from "../assets/samay-profile.jpeg";

export default function Intro() {
  const [localTime, setLocalTime] = useState("");

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
        setLocalTime("IST");
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="about" className="py-16 sm:py-20 border-t border-[var(--border-line)]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid lg:grid-cols-[400px_1fr] gap-10 lg:gap-14 items-start">
          {/* Left Column: Heading & Large Editorial Portrait Frame */}
          <div>
            <div className="inline-flex items-center gap-2">
              <span className="tag">Where I work</span>
            </div>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[var(--text-primary)] leading-tight">
              I work where software meets operations.
            </h2>

            <div className="mt-6 flex flex-col items-start gap-5">
              {/* Large Editorial Portrait Card */}
              <div className="relative group w-full max-w-sm rounded-3xl border border-[var(--border-line)] bg-[var(--bg-card)] shadow-2xl overflow-hidden transition-all duration-500 hover:border-emerald-500/60 hover:shadow-emerald-950/20 hover:-translate-y-1">
                {/* Full-bleed Photo Container */}
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-900">
                  <img
                    src={samayPhoto}
                    alt={samayProfile.name}
                    className="w-full h-full object-cover object-[center_15%] transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="eager"
                  />

                  {/* Elegant Ambient Lighting Gradients */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 via-45% to-transparent pointer-events-none" />
                  <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-3xl pointer-events-none" />

                  {/* Corner Status Badge */}
                  <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-emerald-500/40 font-mono text-[10px] text-emerald-400 font-semibold shadow-lg">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-beacon" />
                    <span>LIVE OPS</span>
                  </div>

                  {/* Identity Glass Banner at Bottom */}
                  <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-black/60 backdrop-blur-xl border border-white/15 text-white shadow-2xl">
                    <div className="flex items-center justify-between">
                      <h4 className="font-display font-bold text-lg sm:text-xl text-white tracking-tight">
                        {samayProfile.name}
                      </h4>
                      <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/25 text-emerald-300 border border-emerald-500/40">
                        APM + SA
                      </span>
                    </div>

                    <p className="mt-1 font-mono text-xs text-emerald-400 font-medium">
                      Associate Product Manager &amp; Systems Architect
                    </p>
                    <p className="mt-0.5 text-xs text-slate-300">
                      {samayProfile.company}
                    </p>
                  </div>
                </div>
              </div>

              {/* Status Pills */}
              <div className="space-y-2 w-full max-w-sm font-mono text-xs text-[var(--text-muted)] pt-1">
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-emerald-500 flex-shrink-0" />
                  <span>{samayProfile.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-emerald-500 flex-shrink-0" />
                  <span>{localTime ? `${localTime} (Asia/Kolkata)` : "IST"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 size={14} className="text-emerald-500 flex-shrink-0" />
                  <span>Veracity Supply Chain (RCSL)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Narrative */}
          <div className="space-y-6 text-base sm:text-lg leading-relaxed text-[var(--text-muted)]">
            <p className="text-xl text-[var(--text-primary)] font-medium leading-relaxed">
              I'm an <strong className="text-emerald-500">Associate Product Manager &amp; Systems Architect</strong> at Veracity Supply Chain Limited, designing end-to-end systems architecture for workforce, recruitment, and compliance platforms.
            </p>

            <p>
              I design and build scalable distributed systems, real-time backend services, and multi-role operational platforms. My work spans the full lifecycle — from system design and API contracts to engineering collaboration and production rollout.
            </p>

            <div className="p-6 rounded-xl border-l-2 border-emerald-500 bg-[var(--bg-surface)] border-y border-r border-[var(--border-line)]">
              <p className="font-medium text-[var(--text-primary)] italic">
                "Workforce platforms in India cannot be one-size-fits-all. Geography, compliance, and field-level incentives must be engineered directly into the software."
              </p>
            </div>

            <p>
              From distributed system topologies and multi-role workflows to App Store compliance and statutory regulations, I bridge ground-floor operational realities with scalable systems architecture.
            </p>

            <p className="font-medium text-[var(--text-primary)] pt-2 border-t border-[var(--border-line)]">
              I don't just write PRDs — I build backend architectures, write production code, design API contracts, and engineer the distributed mechanics that make large-scale platforms run smoothly.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
