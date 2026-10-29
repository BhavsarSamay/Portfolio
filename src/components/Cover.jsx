// Original generative cover art, one motif per project. These are illustrations of each
// project's idea (chat, agent graph, telemetry, publishing, inventory, service mesh),
// not screenshots of the real products.
const palettes = {
  siteassist: { bg: "#C7FF3D", ink: "#080808", a: "#F3F0E8" },
  "agentic-ai": { bg: "#F3F0E8", ink: "#080808", a: "#FF5B2E" },
  cosmicquest: { bg: "#15183F", ink: "#F3F0E8", a: "#8C9BFF" },
  "echoing-ideas": { bg: "#FF5B2E", ink: "#080808", a: "#F3F0E8" },
  bizcart: { bg: "#1A1A1A", ink: "#F3F0E8", a: "#C7FF3D" },
  microservices: { bg: "#0F2A22", ink: "#F3F0E8", a: "#7AFFC1" },
};

export function palette(id) {
  return palettes[id] ?? palettes.bizcart;
}

const motifs = {
  chat: (
    <g>
      <rect className="cv-b cv-b1" x="36" y="46" width="190" height="46" rx="23" fill="var(--ink)" />
      <rect className="cv-b cv-b2" x="176" y="112" width="190" height="46" rx="23" fill="var(--a)" stroke="var(--ink)" strokeWidth="2" />
      <rect className="cv-b cv-b3" x="36" y="178" width="140" height="46" rx="23" fill="var(--ink)" />
      <g fill="var(--bg)">
        <circle className="cv-dot" cx="76" cy="201" r="6" />
        <circle className="cv-dot" cx="98" cy="201" r="6" />
        <circle className="cv-dot" cx="120" cy="201" r="6" />
      </g>
      <rect x="236" y="240" width="130" height="8" rx="4" fill="var(--ink)" opacity=".35" />
    </g>
  ),
  graph: (
    <g fill="none" stroke="var(--ink)" strokeWidth="3" strokeLinecap="round">
      {["M60 150C110 150 120 70 170 70", "M60 150H170", "M60 150C110 150 120 230 170 230", "M170 70C230 70 230 110 290 110", "M170 150C230 150 230 110 290 110", "M170 150C230 150 230 200 290 200", "M170 230C230 230 230 200 290 200", "M290 110C330 110 330 150 355 150", "M290 200C330 200 330 150 355 150"].map((d, i) => (
        <path key={i} className="cv-edge" pathLength="1" d={d} style={{ "--i": i }} />
      ))}
      {[[60, 150], [170, 70], [170, 150], [170, 230], [290, 110], [290, 200]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="15" fill="var(--bg)" />
      ))}
      <circle cx="355" cy="150" r="17" fill="var(--a)" />
    </g>
  ),
  orbit: (
    <g fill="none" stroke="var(--ink)" strokeWidth="2">
      <circle cx="200" cy="150" r="82" opacity=".6" />
      <circle cx="200" cy="150" r="128" opacity=".35" />
      <circle cx="200" cy="150" r="34" fill="var(--a)" stroke="none" />
      <g className="cv-spin cv-spin--a"><circle cx="282" cy="150" r="9" fill="var(--ink)" stroke="none" /></g>
      <g className="cv-spin cv-spin--b"><circle cx="72" cy="150" r="6" fill="var(--a)" stroke="none" /></g>
    </g>
  ),
  type: (
    <g>
      <text x="22" y="226" fontSize="250" fontWeight="800" fontFamily="'Inter Tight', sans-serif" fill="var(--ink)">E</text>
      {[60, 92, 124, 156, 188].map((y, i) => (
        <rect key={y} className="cv-line" x="238" y={y} width={[120, 100, 124, 80, 110][i]} height="10" rx="5" fill="var(--a)" style={{ "--i": i }} />
      ))}
      <rect x="238" y="226" width="40" height="10" rx="5" fill="var(--ink)" />
    </g>
  ),
  stock: (
    <g>
      {[70, 120, 90, 160, 130, 200, 150, 220, 180].map((h, i) => (
        <rect key={i} className="cv-bar" x={34 + i * 38} y={262 - h} width="22" height={h} rx="3" fill={i === 7 ? "var(--a)" : "var(--ink)"} opacity={i === 7 ? 1 : 0.85} style={{ "--i": i }} />
      ))}
      <path className="cv-edge" pathLength="1" d="M34 190L110 150L186 170L262 100L338 60" fill="none" stroke="var(--a)" strokeWidth="3" strokeLinecap="round" />
    </g>
  ),
  mesh: (
    <g fill="none" stroke="var(--ink)" strokeWidth="2">
      {[0, 1, 2].flatMap((c) => [0, 1, 2].map((r) => ({ x: 170 + c * 80, y: 70 + r * 80, c, r }))).map(({ x, y, c, r }) => (
        <g key={`${c}${r}`}>
          {c < 2 && <line className="cv-wire" x1={x} y1={y} x2={x + 80} y2={y} />}
          {r < 2 && <line className="cv-wire" x1={x} y1={y} x2={x} y2={y + 80} />}
        </g>
      ))}
      {[0, 1, 2].map((r) => <line key={r} className="cv-wire" x1="92" y1="150" x2="170" y2={70 + r * 80} />)}
      <rect x="40" y="120" width="52" height="60" rx="6" fill="var(--a)" />
      {[0, 1, 2].flatMap((c) => [0, 1, 2].map((r) => (
        <rect key={`${c}${r}`} x={170 + c * 80 - 12} y={70 + r * 80 - 12} width="24" height="24" rx="4" fill="var(--bg)" />
      )))}
    </g>
  ),
};

export default function Cover({ id, motif, className = "" }) {
  const p = palette(id);
  return (
    <svg
      className={`cv ${className}`}
      viewBox="0 0 400 300"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={`Generative cover illustration for ${id.replace("-", " ")}`}
      style={{ "--bg": p.bg, "--ink": p.ink, "--a": p.a }}
    >
      <rect width="400" height="300" fill="var(--bg)" />
      {motifs[motif]}
    </svg>
  );
}
