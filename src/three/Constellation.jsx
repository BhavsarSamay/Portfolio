import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { useVisible } from "../lib/useVisible";
import { useTheme } from "../lib/theme";
import { techEcosystem } from "../data/skills";

// Skills as a 3D constellation: each group is a bright hub with its technologies orbiting around it,
// joined by fine lines. Hover a node to read it. No percentages: breadth is shown by grouping.
const dark = ["#e2c58c", "#ece7dc", "#c9a66b", "#a9a49b", "#f1dcb0"];
const light = ["#8c6a2e", "#2a2723", "#a5814a", "#6b675f", "#5e4720"];
const short = ["AI & Agents", "Backend", "Frontend", "Data", "Languages & Tools"];

function Cluster({ group, index, center, color, onHover, hovered }) {
  const nodes = useMemo(() => {
    let seed = 40 + index * 13;
    const r = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
    return group.items.map((name) => {
      const u = r() * 2 - 1, a = r() * 6.283, rad = 0.9 + r() * 0.75;
      const k = Math.sqrt(1 - u * u);
      return { name, pos: new THREE.Vector3(Math.cos(a) * k * rad, u * rad * 0.8, Math.sin(a) * k * rad), s: 0.07 + r() * 0.05 };
    });
  }, [group, index]);

  const lines = useMemo(() => {
    const pts = [];
    nodes.forEach((n) => pts.push(0, 0, 0, n.pos.x, n.pos.y, n.pos.z));
    for (let i = 0; i < nodes.length; i++) {
      const j = (i + 1) % nodes.length;
      pts.push(nodes[i].pos.x, nodes[i].pos.y, nodes[i].pos.z, nodes[j].pos.x, nodes[j].pos.y, nodes[j].pos.z);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    return g;
  }, [nodes]);

  const spin = useRef();
  useFrame((_, dt) => {
    spin.current.rotation.y += dt * 0.12;
  });

  return (
    <group position={center}>
      <mesh>
        <sphereGeometry args={[0.2, 24, 18]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <Html center position={[0, 0.5, 0]} style={{ pointerEvents: "none" }} zIndexRange={[5, 0]}>
        <span className="cn-hub" style={{ color }}>{short[index]}</span>
      </Html>
      <group ref={spin}>
        <lineSegments geometry={lines}>
          <lineBasicMaterial color={color} transparent opacity={0.3} />
        </lineSegments>
        {nodes.map((n) => (
          <mesh
            key={n.name}
            position={n.pos}
            onPointerOver={(e) => {
              e.stopPropagation();
              onHover(n.name);
            }}
            onPointerOut={() => onHover(null)}
          >
            <sphereGeometry args={[hovered === n.name ? n.s * 1.9 : n.s, 14, 12]} />
            <meshBasicMaterial color={hovered === n.name ? "#ffffff" : color} />
            {hovered === n.name && (
              <Html center position={[0, 0.28, 0]} style={{ pointerEvents: "none" }} zIndexRange={[9, 0]}>
                <span className="cn-tip">{n.name}</span>
              </Html>
            )}
          </mesh>
        ))}
      </group>
    </group>
  );
}

function HubLines({ hubs, color }) {
  const geo = useMemo(() => {
    const pts = [];
    hubs.forEach((h, i) => {
      const n = hubs[(i + 1) % hubs.length];
      pts.push(h[0], h[1], h[2], n[0], n[1], n[2]);
    });
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    return g;
  }, [hubs]);
  return (
    <lineSegments geometry={geo}>
      <lineBasicMaterial color={color} transparent opacity={0.16} />
    </lineSegments>
  );
}

export default function Constellation() {
  const [ref, visible] = useVisible("200px");
  const [mounted, setMounted] = useState(false);
  const [hovered, setHovered] = useState(null);
  const [theme] = useTheme();
  const colors = theme === "light" ? light : dark;
  useEffect(() => {
    if (visible) setMounted(true);
  }, [visible]);

  const hubs = useMemo(
    () =>
      techEcosystem.map((_, i) => {
        const a = (i / techEcosystem.length) * Math.PI * 2;
        return [Math.cos(a) * 3.3, Math.sin(a * 2) * 0.9, Math.sin(a) * 3.3];
      }),
    []
  );

  return (
    <div ref={ref} className="constellation" role="img" aria-label="Interactive 3D constellation of technologies, grouped by area. The same list is written out below.">
      {mounted && (
        <Canvas frameloop={visible ? "always" : "never"} dpr={[1, 1.5]} camera={{ position: [0, 1.0, 8.6], fov: 38 }} gl={{ alpha: true, antialias: true }} onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}>
          <Orbit>
            <HubLines hubs={hubs} color={colors[0]} />
            {techEcosystem.map((g, i) => (
              <Cluster key={g.group} group={g} index={i} center={hubs[i]} color={colors[i % colors.length]} hovered={hovered} onHover={setHovered} />
            ))}
          </Orbit>
        </Canvas>
      )}
    </div>
  );
}

// Slow turntable for the whole constellation.
function Orbit({ children }) {
  const g = useRef();
  useFrame((state, dt) => {
    g.current.rotation.y += dt * 0.12;
    g.current.rotation.x = THREE.MathUtils.damp(g.current.rotation.x, -state.pointer.y * 0.3, 3, dt);
  });
  return <group ref={g}>{children}</group>;
}
