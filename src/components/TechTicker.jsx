import { coreMarqueeTech } from "../data/skills";

export default function TechTicker() {
  const rowA = [...coreMarqueeTech, ...coreMarqueeTech];
  const rowB = [...coreMarqueeTech].reverse().concat([...coreMarqueeTech].reverse());

  return (
    <div className="relative w-full py-8 border-y border-white/[0.06] bg-[#070b14]/50 backdrop-blur-xl overflow-hidden space-y-3.5 select-none">
      {/* Track A */}
      <div className="flex w-max animate-marquee-l gap-3">
        {rowA.map((tech, i) => (
          <div
            key={`${tech}-a-${i}`}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/[0.08] bg-slate-900/60 hover:border-sky-500/40 hover:bg-slate-800/80 text-xs font-mono font-medium text-slate-300 hover:text-white transition-all cursor-default shadow-sm"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
            <span>{tech}</span>
          </div>
        ))}
      </div>

      {/* Track B */}
      <div className="flex w-max animate-marquee-r gap-3">
        {rowB.map((tech, i) => (
          <div
            key={`${tech}-b-${i}`}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/[0.08] bg-slate-900/60 hover:border-indigo-500/40 hover:bg-slate-800/80 text-xs font-mono font-medium text-slate-300 hover:text-white transition-all cursor-default shadow-sm"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
            <span>{tech}</span>
          </div>
        ))}
      </div>

      {/* Left/Right Vignette Gradients */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#030712] to-transparent pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#030712] to-transparent pointer-events-none" />
    </div>
  );
}
