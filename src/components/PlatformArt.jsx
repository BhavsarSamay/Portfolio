import { useEffect, useRef } from "react";

// Conceptual illustrations for the three Veracity platforms. The real products are under NDA,
// so these show the idea of each system (dispatch, pipeline, statutory calculation), not the product.
const themes = {
  "gig-platform": { bg: "#C7FF3D", ink: "#080808", a: "#F3F0E8" },
  "recruitment-platform": { bg: "#8EC5FF", ink: "#07121f", a: "#F3F0E8" },
  "payroll-platform": { bg: "#FFC857", ink: "#1a1200", a: "#F3F0E8" },
};

const art = {
  "gig-platform": (
    <g fill="none" stroke="var(--ink)" strokeWidth="2">
      {/* city blocks */}
      <g opacity=".22">
        {[40, 100, 160, 220, 280, 340].map((x) => <line key={x} x1={x} y1="0" x2={x} y2="300" />)}
        {[50, 110, 170, 230].map((y) => <line key={y} x1="0" y1={y} x2="400" y2={y} />)}
      </g>
      {/* routes from workers to the task */}
      <path className="pa-draw" pathLength="1" style={{ "--i": 0 }} strokeDasharray="1" d="M70 220H160V130H250" strokeWidth="3" />
      <path className="pa-draw" pathLength="1" style={{ "--i": 1 }} strokeDasharray="1" d="M330 230H280V170H250V130" strokeWidth="3" />
      <path className="pa-draw" pathLength="1" style={{ "--i": 2 }} strokeDasharray="1" d="M90 60H190V130H250" strokeWidth="3" />
      {[[70, 220], [330, 230], [90, 60]].map(([x, y], i) => (
        <g key={i} className="pa-pop" style={{ "--i": i + 3 }}>
          <circle cx={x} cy={y} r="13" fill="var(--a)" />
          <circle cx={x} cy={y} r="5" fill="var(--ink)" stroke="none" />
        </g>
      ))}
      <g className="pa-pop" style={{ "--i": 6 }}>
        <circle className="pa-ping" cx="250" cy="130" r="22" stroke="var(--ink)" />
        <rect x="236" y="116" width="28" height="28" rx="6" fill="var(--ink)" stroke="none" />
        <path d="M243 130l5 5 9-10" stroke="var(--a)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </g>
  ),
  "recruitment-platform": (
    <g>
      {[0, 1, 2, 3].map((c) => (
        <g key={c}>
          <rect x={26 + c * 92} y="34" width="80" height="232" rx="8" fill="var(--ink)" opacity=".1" />
          <rect x={36 + c * 92} y="44" width="40" height="7" rx="3.5" fill="var(--ink)" opacity=".55" />
          {Array.from({ length: [4, 3, 2, 1][c] }).map((_, r) => (
            <g key={r} className="pa-slide" style={{ "--i": c * 2 + r }}>
              <rect x={34 + c * 92} y={62 + r * 50} width="64" height="40" rx="6" fill={c === 3 ? "var(--ink)" : "var(--a)"} stroke="var(--ink)" strokeWidth="2" />
              <circle cx={47 + c * 92} cy={82 + r * 50} r="7" fill={c === 3 ? "var(--a)" : "var(--ink)"} />
              <rect x={59 + c * 92} y={77 + r * 50} width="30" height="5" rx="2.5" fill={c === 3 ? "var(--a)" : "var(--ink)"} opacity=".7" />
              <rect x={59 + c * 92} y={87 + r * 50} width="20" height="5" rx="2.5" fill={c === 3 ? "var(--a)" : "var(--ink)"} opacity=".4" />
            </g>
          ))}
        </g>
      ))}
      <path className="pa-draw" pathLength="1" strokeDasharray="1" d="M98 122C120 122 112 112 126 112M190 112C212 112 204 100 218 100M282 100C304 100 296 88 310 88" fill="none" stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" style={{ "--i": 6 }} />
    </g>
  ),
  "payroll-platform": (
    <g>
      {/* payslip */}
      <rect className="pa-slide" x="40" y="28" width="170" height="246" rx="8" fill="var(--a)" stroke="var(--ink)" strokeWidth="2" style={{ "--i": 0 }} />
      <rect x="56" y="46" width="70" height="9" rx="4.5" fill="var(--ink)" />
      {[78, 100, 122, 144].map((y, i) => (
        <g key={y}>
          <rect x="56" y={y} width={[80, 64, 72, 56][i]} height="6" rx="3" fill="var(--ink)" opacity=".4" />
          <rect x="164" y={y} width="30" height="6" rx="3" fill="var(--ink)" opacity=".75" />
        </g>
      ))}
      <line x1="56" y1="172" x2="194" y2="172" stroke="var(--ink)" strokeWidth="2" strokeDasharray="4 5" />
      <rect x="56" y="188" width="50" height="10" rx="5" fill="var(--ink)" />
      <rect className="pa-bar" x="56" y="214" width="138" height="12" rx="6" fill="var(--ink)" opacity=".15" />
      <rect className="pa-bar pa-bar--fill" x="56" y="214" width="96" height="12" rx="6" fill="var(--ink)" />
      {/* statutory chips + audit shield */}
      {["PF", "TAX", "AUDIT"].map((t, i) => (
        <g key={t} className="pa-pop" style={{ "--i": i + 1 }}>
          <rect x="236" y={44 + i * 52} width="124" height="38" rx="19" fill="none" stroke="var(--ink)" strokeWidth="2" />
          <circle cx="255" cy={63 + i * 52} r="8" fill="var(--ink)" />
          <path d={`M251 ${63 + i * 52}l3 3 6-6`} fill="none" stroke="var(--a)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          <text x="276" y={68 + i * 52} fontSize="14" fontWeight="700" fontFamily="'IBM Plex Mono', monospace" fill="var(--ink)">{t}</text>
        </g>
      ))}
      <path className="pa-pop" style={{ "--i": 5 }} d="M298 212l30 10v22c0 14-12 24-30 30-18-6-30-16-30-30v-22Z" fill="var(--ink)" />
      <path className="pa-pop" style={{ "--i": 5 }} d="M285 246l9 9 17-18" fill="none" stroke="var(--a)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  ),
};

export default function PlatformArt({ id }) {
  const ref = useRef(null);
  // Entrance animation plays once when the artwork scrolls into view.
  useEffect(() => {
    const el = ref.current;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        el.classList.add("is-in");
        io.disconnect();
      }
    }, { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const t = themes[id];
  return (
    <svg
      ref={ref}
      className="pa"
      viewBox="0 0 400 300"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label="Conceptual illustration, not a screenshot of the product"
      style={{ "--bg": t.bg, "--ink": t.ink, "--a": t.a }}
    >
      <rect width="400" height="300" fill="var(--bg)" />
      {art[id]}
    </svg>
  );
}
