import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useTheme } from "../lib/theme";
import { scene3d, TOTAL } from "./store";
import { Stars, Saturn, Mars, Moon, Earth, Sun, Nebula, Galaxy, Asteroids, Wormhole } from "./bodies";

const damp = THREE.MathUtils.damp;

// Moves the camera along the page's journey. Scroll sets how far we are; the camera eases toward it,
// sways gently, and leans with the pointer. A "warp" impulse widens the lens for a quick dive.
function Rig() {
  const z = useRef(0);
  const prev = useRef(0);
  const t = useRef(0);
  const look = useRef(new THREE.Vector3());

  useFrame((state, dtRaw) => {
    const dt = Math.min(dtRaw, 0.05);
    t.current += dt;
    z.current = damp(z.current, -scene3d.progress * TOTAL, 2.6, dt);
    scene3d.camSpeed = (prev.current - z.current) / Math.max(dt, 1e-3);
    prev.current = z.current;

    scene3d.warp = Math.max(0, scene3d.warp - dt * 1.3);
    const cz = z.current + Math.sin(t.current * 0.2) * 0.6;
    scene3d.camZ = cz;

    const { x: px, y: py } = scene3d.pointer;
    const sway = (zz) => [Math.sin(zz * 0.045) * 1.5, Math.cos(zz * 0.031) * 1.0];
    const [sx, sy] = sway(z.current);
    const cam = state.camera;
    cam.position.set(sx + px * 0.9, sy - py * 0.6, cz);
    const [lx, ly] = sway(z.current - 22);
    look.current.set(lx + px * 2.2, ly - py * 1.4, cz - 22);
    cam.lookAt(look.current);

    const fov = 55 + scene3d.warp * 24 * (scene3d.zoomDir || 1);
    if (Math.abs(cam.fov - fov) > 0.01) {
      cam.fov = fov;
      cam.updateProjectionMatrix();
    }
  });
  return null;
}

// Keeps the scene invisible for a moment while shaders compile and textures arrive, then reveals it.
function Reveal({ onReady }) {
  const t = useRef(0);
  const done = useRef(false);
  useFrame((_, dt) => {
    if (done.current) return;
    scene3d.warmup = true;
    t.current += Math.min(dt, 0.05);
    if (t.current > 1.2) {
      done.current = true;
      scene3d.warmup = false;
      onReady();
    }
  });
  return null;
}

function Scene({ tier, light, onReady }) {
  const high = tier > 1;
  const nebA = { dark: [[[150, 120, 80], [70, 70, 90]], [[120, 95, 70], [60, 62, 80]]], light: [[[235, 200, 150], [210, 205, 195]], [[240, 215, 170], [215, 205, 190]]] };
  const nebB = { dark: [[[160, 125, 80], [70, 72, 92]], [[80, 82, 100], [140, 110, 75]]], light: [[[240, 205, 155], [205, 200, 190]], [[215, 208, 195], [235, 210, 165]]] };

  return (
    <>
      <Rig />
      <Reveal onReady={onReady} />
      <ambientLight intensity={light ? 0.85 : 0.24} />
      <directionalLight position={[-30, 18, 22]} intensity={light ? 1.7 : 2.6} color="#fff4e6" />
      <Stars count={high ? 2400 : 1000} light={light} />

      <Saturn position={[21, 7, -48]} r={4.6} light={light} />
      <Mars position={[-19, 8, -80]} r={2} light={light} />
      <Nebula position={[0, 0, -118]} size={95} colors={nebA} light={light} />
      <Moon position={[-20, -7, -148]} r={2.6} light={light} />
      <Galaxy position={[16, 4, -198]} radius={30} count={high ? 5200 : 2400} light={light} />
      <Asteroids position={[17, -5, -242]} spread={9} count={high ? 46 : 24} light={light} />
      <Wormhole position={[0, 0, -292]} radius={7} color={light ? "#8c6a2e" : "#e2c58c"} light={light} />
      <Sun position={[-22, 9, -338]} r={3.2} light={light} />
      <Earth position={[19, -6.5, -380]} r={5.2} light={light} big={high} />
      <Nebula position={[0, 0, -425]} size={100} colors={nebB} light={light} />
      <Wormhole position={[0, 0, -462]} radius={7.5} color={light ? "#a5814a" : "#c9a66b"} light={light} />
    </>
  );
}

// Fixed full-screen WebGL layer behind the whole page.
export default function Cosmos3D({ tier, onShown }) {
  const [theme] = useTheme();
  const light = theme === "light";
  const [on, setOn] = useState(false);
  const reveal = () => {
    setOn(true);
    // once the fade has finished the lightweight 2D scene underneath can be dropped
    setTimeout(() => onShown?.(), 1000);
  };
  return (
    <div className={`backdrop3d${on ? " is-on" : ""}`} aria-hidden="true">
      <Canvas
        flat
        dpr={[1, tier > 1 ? 1.5 : 1]}
        camera={{ fov: 55, near: 0.1, far: 800, position: [0, 0, 0] }}
        gl={{ alpha: true, antialias: tier > 1, powerPreference: "high-performance" }}
        onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
      >
        <Scene tier={tier} light={light} onReady={reveal} />
      </Canvas>
      <div className="guides"><i /><i /><i /></div>
    </div>
  );
}
