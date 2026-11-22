import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { useVisible } from "../lib/useVisible";

// Conceptual 3D dioramas for the three Veracity platforms. The real products are under NDA, so these
// show the idea of each system (dispatch, pipeline, statutory calculation), not the product itself.
const palettes = {
  "gig-platform": { bg: "#D9BC85", ink: "#1b160c", a: "#F6F1E6", mid: "#a8843f", route: "#3a2c12" },
  "recruitment-platform": { bg: "#ECE6D8", ink: "#141210", a: "#FFFFFF", mid: "#b8a27a" },
  "payroll-platform": { bg: "#C9C2B3", ink: "#15130f", a: "#F6F1E6", mid: "#8f877a" },
};

const rng = (seed) => () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
const ease = (t) => t * t * (3 - 2 * t);

// Slow turntable that also leans toward the pointer.
function Stage({ children, y = 0.6 }) {
  const g = useRef();
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    g.current.rotation.y = -0.65 + Math.sin(t * 0.25) * 0.28 + state.pointer.x * 0.45;
    g.current.rotation.x = -state.pointer.y * 0.12;
  });
  return <group ref={g} position={[0, y, 0]}>{children}</group>;
}

// ---------- Gig: a city, workers routed to a task ----------
function Gig({ p }) {
  const city = useMemo(() => {
    const r = rng(5);
    const blocks = [];
    for (let x = -3; x <= 3; x++)
      for (let z = -3; z <= 3; z++) {
        if ((x + z) % 2 === 0 || r() > 0.72) continue;
        if (Math.abs(x) > 2.2 && Math.abs(z) > 2.2) continue;
        blocks.push({ x: x * 1.1, z: z * 1.1, h: 0.22 + r() * r() * 1.15 });
      }
    return blocks;
  }, []);

  const routes = useMemo(() => {
    const target = new THREE.Vector3(1.1, 0.06, -1.1);
    const starts = [new THREE.Vector3(-3.3, 0.06, 2.2), new THREE.Vector3(3.3, 0.06, 2.2), new THREE.Vector3(-2.2, 0.06, -3.3)];
    return starts.map((s) => {
      const pts = [s, new THREE.Vector3(s.x, 0.06, target.z + (s.z > 0 ? 0.55 : -0.55)), new THREE.Vector3(target.x - Math.sign(target.x - s.x) * 0.55, 0.06, target.z), target];
      const curve = new THREE.CatmullRomCurve3(pts, false, "catmullrom", 0.25);
      return { curve, geo: new THREE.TubeGeometry(curve, 48, 0.085, 8, false) };
    });
  }, []);

  const workers = useRef([]);
  const ping = useRef();
  const pin = useRef();
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    routes.forEach((r, i) => {
      const u = (t * 0.12 + i * 0.33) % 1;
      const w = workers.current[i];
      if (w) w.position.copy(r.curve.getPointAt(u)).setY(0.2);
    });
    const k = (t * 0.6) % 1;
    ping.current.scale.setScalar(0.3 + k * 1.6);
    ping.current.material.opacity = (1 - k) * 0.7;
    pin.current.position.y = 1.1 + Math.sin(t * 2.2) * 0.08;
  });

  return (
    <Stage y={0.35}>
      <mesh position={[0, -0.12, 0]}>
        <boxGeometry args={[8.4, 0.2, 8.4]} />
        <meshStandardMaterial color={p.a} roughness={0.9} />
      </mesh>
      <gridHelper args={[8.2, 14, p.ink, p.ink]} position={[0, -0.015, 0]} material-opacity={0.18} material-transparent />
      {city.map((b, i) => (
        <mesh key={i} position={[b.x, b.h / 2, b.z]}>
          <boxGeometry args={[0.8, b.h, 0.8]} />
          <meshStandardMaterial color={i % 4 === 0 ? p.mid : i % 3 === 0 ? "#6b5f45" : p.ink} roughness={0.8} />
        </mesh>
      ))}
      {routes.map((r, i) => (
        <mesh key={i} geometry={r.geo}>
          <meshStandardMaterial color={p.route} emissive={p.route} emissiveIntensity={0.5} />
        </mesh>
      ))}
      {routes.map((_, i) => (
        <mesh key={i} ref={(el) => (workers.current[i] = el)}>
          <sphereGeometry args={[0.2, 20, 16]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
        </mesh>
      ))}
      <group position={[1.1, 0, -1.1]}>
        <mesh ref={ping} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
          <ringGeometry args={[0.85, 1, 48]} />
          <meshBasicMaterial color={p.route} transparent />
        </mesh>
        <group ref={pin}>
          <mesh rotation={[Math.PI, 0, 0]} position={[0, -0.25, 0]}>
            <coneGeometry args={[0.28, 0.7, 20]} />
            <meshStandardMaterial color={p.route} emissive={p.route} emissiveIntensity={0.6} />
          </mesh>
          <mesh position={[0, 0.12, 0]}>
            <sphereGeometry args={[0.34, 20, 16]} />
            <meshStandardMaterial color={p.route} emissive={p.route} emissiveIntensity={0.6} />
          </mesh>
        </group>
      </group>
    </Stage>
  );
}

// ---------- Recruitment: candidates moving through pipeline stages ----------
function Recruit({ p }) {
  const N = 6;
  const cards = useRef([]);
  const col = useMemo(() => new THREE.Color(), []);
  const light = useMemo(() => new THREE.Color(p.a), [p.a]);
  const dark = useMemo(() => new THREE.Color(p.ink), [p.ink]);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    cards.current.forEach((m, i) => {
      if (!m) return;
      const u = (t * 0.075 + i / N) % 1;
      const x = -3.7 + ease(u) * 7.4;
      m.position.set(x, 0.18 + Math.sin(t * 1.6 + i) * 0.035, ((i % 3) - 1) * 1.05);
      m.rotation.y = Math.sin(t * 0.8 + i) * 0.08;
      col.copy(light).lerp(dark, THREE.MathUtils.smoothstep(x, 2.4, 3.3));
      m.material.color.copy(col);
    });
  });
  return (
    <Stage y={0.2}>
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} position={[-3.45 + i * 2.3, -0.1, 0]}>
          <boxGeometry args={[1.9, 0.12, 4.1]} />
          <meshStandardMaterial color={p.mid} roughness={0.7} transparent opacity={0.55 + i * 0.1} />
        </mesh>
      ))}
      {Array.from({ length: N }, (_, i) => (
        <RoundedBox key={i} ref={(el) => (cards.current[i] = el)} args={[1.2, 0.14, 0.8]} radius={0.06} smoothness={4}>
          <meshStandardMaterial color={p.a} roughness={0.5} />
        </RoundedBox>
      ))}
      <mesh position={[4.15, 0.3, 0]}>
        <torusGeometry args={[0.42, 0.07, 12, 40]} />
        <meshStandardMaterial color={p.ink} />
      </mesh>
    </Stage>
  );
}

// ---------- Payroll: a statement, calculation blocks and an audit shield ----------
function Payroll({ p }) {
  const bars = useRef([]);
  const shield = useRef();
  const shieldGeo = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, 1.05);
    s.lineTo(0.8, 0.78);
    s.lineTo(0.8, 0.05);
    s.quadraticCurveTo(0.8, -0.65, 0, -1.05);
    s.quadraticCurveTo(-0.8, -0.65, -0.8, 0.05);
    s.lineTo(-0.8, 0.78);
    s.closePath();
    const g = new THREE.ExtrudeGeometry(s, { depth: 0.28, bevelEnabled: true, bevelSize: 0.07, bevelThickness: 0.07, bevelSegments: 4, curveSegments: 20 });
    g.center();
    return g;
  }, []);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    bars.current.forEach((m, i) => {
      if (!m) return;
      const h = 0.5 + (0.5 + 0.5 * Math.sin(t * 0.9 + i * 1.3)) * 1.5 + i * 0.15;
      m.scale.y = h;
      m.position.y = h / 2;
    });
    shield.current.rotation.y = t * 0.7;
    shield.current.position.y = 1.25 + Math.sin(t * 1.4) * 0.1;
  });
  return (
    <Stage y={0.1}>
      {[0, 1, 2, 3].map((i) => (
        <RoundedBox key={i} position={[-1.7 + i * 0.07, i * 0.09, 0.15 - i * 0.1]} rotation={[0, i * 0.045, 0]} args={[2.9, 0.07, 3.9]} radius={0.03}>
          <meshStandardMaterial color={p.a} roughness={0.7} />
        </RoundedBox>
      ))}
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh key={i} position={[-2.2 + (i % 2 ? 0.22 : 0), 0.45, -1.2 + i * 0.55]}>
          <boxGeometry args={[1.6 - (i % 3) * 0.3, 0.04, 0.12]} />
          <meshStandardMaterial color={p.ink} transparent opacity={0.8} />
        </mesh>
      ))}
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh key={i} ref={(el) => (bars.current[i] = el)} position={[1.4 + i * 0.5, 0.5, 1.1]}>
          <boxGeometry args={[0.36, 1, 0.36]} />
          <meshStandardMaterial color={i === 4 ? p.mid : p.ink} roughness={0.5} />
        </mesh>
      ))}
      <mesh ref={shield} geometry={shieldGeo} position={[1.9, 1.25, -1.3]} scale={0.8}>
        <meshStandardMaterial color={p.ink} metalness={0.3} roughness={0.35} />
      </mesh>
    </Stage>
  );
}

const scenes = { "gig-platform": Gig, "recruitment-platform": Recruit, "payroll-platform": Payroll };

export default function Diorama({ id }) {
  const [ref, visible] = useVisible("200px");
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    if (visible) setMounted(true);
  }, [visible]);
  const p = palettes[id];
  const Scene = scenes[id];
  return (
    <div ref={ref} className="dio" style={{ background: p.bg }} role="img" aria-label="Interactive 3D conceptual illustration, not a screenshot of the product">
      {mounted && (
        <Canvas
          frameloop={visible ? "always" : "never"}
          dpr={[1, 1.5]}
          camera={{ position: [10.5, 8.6, 10.5], fov: 30 }}
          gl={{ alpha: true, antialias: true }}
          onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
        >
          <ambientLight intensity={0.85} />
          <directionalLight position={[6, 9, 5]} intensity={1.9} />
          <directionalLight position={[-6, 4, -4]} intensity={0.5} color="#ffffff" />
          <Scene p={p} />
        </Canvas>
      )}
    </div>
  );
}
