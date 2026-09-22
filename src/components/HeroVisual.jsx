import React from 'react';
import { useTheme } from '../context/ThemeContext';

const nodes = [
  { x: 300, y: 78, label: 'REQUIREMENT' },
  { x: 492, y: 189, label: 'DESIGN' },
  { x: 492, y: 411, label: 'DATA' },
  { x: 300, y: 522, label: 'AI' },
  { x: 108, y: 411, label: 'ENGINEERING' },
  { x: 108, y: 189, label: 'OUTCOME' },
];

const CENTER = { x: 300, y: 300 };

export default function HeroVisual() {
  const { isDark } = useTheme();

  const ringStroke = isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(18, 21, 27, 0.08)";
  const ringStrokeMid = isDark ? "rgba(255, 255, 255, 0.06)" : "rgba(18, 21, 27, 0.06)";
  const ringStrokeOuter = isDark ? "rgba(255, 255, 255, 0.04)" : "rgba(18, 21, 27, 0.04)";
  const lineStroke = isDark ? "rgba(16, 185, 129, 0.55)" : "rgba(10, 122, 95, 0.45)";
  const nodeOuterRing = isDark ? "rgba(255, 255, 255, 0.15)" : "rgba(18, 21, 27, 0.18)";
  const textFill = isDark ? "rgba(241, 245, 249, 0.75)" : "rgba(18, 21, 27, 0.65)";
  const beaconColor = isDark ? "#10B981" : "#0A7A5F";

  return (
    <div className="relative rounded-2xl border border-[var(--border-line)] bg-[var(--bg-card)] shadow-lg grid-veil overflow-hidden aspect-square w-full max-w-[500px] mx-auto transition-all duration-300">
      {/* Top Left Status Badge */}
      <div className="absolute top-4 left-4 flex items-center gap-2 z-10 px-3 py-1 rounded-full bg-[var(--bg-surface)] border border-[var(--border-line)]">
        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-beacon" />
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--text-muted)] font-medium">
          System Map
        </span>
      </div>

      {/* Top Right Label */}
      <div className="absolute top-4 right-4 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--text-dim)] z-10">
        Product · Engineering
      </div>

      <svg
        viewBox="0 0 600 600"
        className="w-full h-full"
        role="img"
        aria-label="Interactive system map connecting requirement, design, data, AI, engineering and outcome nodes around product systems"
      >
        {/* Concentric Radar Rings */}
        <circle cx={CENTER.x} cy={CENTER.y} r="100" fill="none" stroke={ringStroke} strokeWidth="1" />
        <circle cx={CENTER.x} cy={CENTER.y} r="160" fill="none" stroke={ringStrokeMid} strokeWidth="1" strokeDasharray="4 4" />
        <circle cx={CENTER.x} cy={CENTER.y} r="220" fill="none" stroke={ringStrokeOuter} strokeWidth="1" />

        {/* Dashed Connecting Lines with Flow Animation */}
        {nodes.map((node, i) => (
          <line
            key={`line-${node.label}`}
            x1={CENTER.x}
            y1={CENTER.y}
            x2={node.x}
            y2={node.y}
            stroke={lineStroke}
            strokeWidth="1.2"
            strokeDasharray="4 6"
            className="animate-dash"
            style={{ animationDelay: `${i * 0.25}s` }}
          />
        ))}

        {/* Orbiting Satellite Nodes */}
        {nodes.map((node, i) => (
          <g key={node.label} className="group cursor-default">
            {/* Outer halo */}
            <circle
              cx={node.x}
              cy={node.y}
              r="14"
              fill={isDark ? "rgba(16, 185, 129, 0.06)" : "rgba(10, 122, 95, 0.05)"}
              stroke={nodeOuterRing}
              strokeWidth="1"
            />
            {/* Center Beacon */}
            <circle
              cx={node.x}
              cy={node.y}
              r="4.5"
              fill={beaconColor}
              className="animate-beacon"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
            {/* Node Label */}
            <text
              x={node.x}
              y={node.y > CENTER.y ? node.y + 30 : node.y - 20}
              textAnchor="middle"
              fontFamily="IBM Plex Mono, monospace"
              fontSize="10"
              fontWeight="600"
              letterSpacing="1.5"
              fill={textFill}
            >
              {node.label}
            </text>
          </g>
        ))}

        {/* Central Core Module */}
        <rect
          x={CENTER.x - 52}
          y={CENTER.y - 22}
          width="104"
          height="44"
          rx="8"
          fill={isDark ? "#1E2433" : "#12151B"}
          stroke={beaconColor}
          strokeWidth="1.5"
        />
        <text
          x={CENTER.x}
          y={CENTER.y + 5}
          textAnchor="middle"
          fontFamily="IBM Plex Mono, monospace"
          fontSize="11"
          fontWeight="700"
          letterSpacing="1.5"
          fill="#F7F7F4"
        >
          PRODUCT
        </text>
      </svg>
    </div>
  );
}
