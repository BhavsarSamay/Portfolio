import { Suspense, useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useTheme } from "../lib/theme";
import { scene3d, markReady, TOTAL } from "./store";
import { Stars, Saturn, Mars, Moon, Earth, Sun, Nebula, Galaxy, Asteroids, Wormhole } from "./bodies";
import Monogram3D from "./Monogram3D";

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

function Scene({ tier, light }) {
  useEffect(() => {
    const id = requestAnimationFrame(() => requestAnimationFrame(markReady));
    return () => cancelAnimationFrame(id);
  }, []);

  const high = tier > 1;
  const nebA = { dark: [[[120, 100, 255], [60, 190, 215]], [[255, 90, 170], [110, 90, 255]]], light: [[[255, 150, 190], [120, 175, 255]], [[255, 190, 140], [190, 160, 255]]] };
  const nebB = { dark: [[[255, 150, 90], [150, 110, 255]], [[90, 160, 255], [255, 110, 150]]], light: [[[255, 180, 120], [150, 130, 255]], [[130, 190, 255], [255, 160, 190]]] };

  return (
    <>
      <Rig />
      <ambientLight intensity={light ? 0.85 : 0.24} />
      <directionalLight position={[-30, 18, 22]} intensity={light ? 1.7 : 2.6} color="#fff4e6" />
      <Stars count={high ? 2400 : 1000} light={light} />

      <Saturn position={[15, 5.5, -48]} r={4.6} light={light} />
      <Mars position={[-13, 6, -80]} r={2} light={light} />
      <Nebula position={[0, 0, -118]} size={95} colors={nebA} light={light} />
      <Moon position={[-14, -5, -148]} r={2.6} light={light} />
      <Galaxy position={[12, 3, -198]} radius={30} count={high ? 5200 : 2400} light={light} />
      <Asteroids position={[11, -3, -242]} spread={9} count={high ? 46 : 24} light={light} />
      <Wormhole position={[0, 0, -292]} radius={7} color={light ? "#5a8f00" : "#c7ff3d"} light={light} />
      <Sun position={[-16, 7, -338]} r={3.2} light={light} />
      <Earth position={[13.5, -4.5, -380]} r={5.2} light={light} big={high} />
      <Nebula position={[0, 0, -425]} size={100} colors={nebB} light={light} />
      <Wormhole position={[0, 0, -462]} radius={7.5} color={light ? "#2a64c8" : "#8cd2ff"} light={light} />

      <Suspense fallback={null}>
        <Monogram3D light={light} />
      </Suspense>
    </>
  );
}

// Fixed full-screen WebGL layer behind the whole page.
export default function Cosmos3D({ tier }) {
  const [theme] = useTheme();
  const light = theme === "light";
  return (
    <div className="backdrop3d" aria-hidden="true">
      <Canvas
        flat
        dpr={[1, tier > 1 ? 1.5 : 1]}
        camera={{ fov: 55, near: 0.1, far: 800, position: [0, 0, 0] }}
        gl={{ alpha: true, antialias: tier > 1, powerPreference: "high-performance" }}
        onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
      >
        <Scene tier={tier} light={light} />
      </Canvas>
      <div className="guides"><i /><i /><i /></div>
    </div>
  );
}
