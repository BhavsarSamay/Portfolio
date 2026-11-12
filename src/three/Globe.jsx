import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useTheme } from "../lib/theme";
import { earthTextures } from "./textures";
import { Atmosphere } from "./bodies";

// The end of the journey: a planet rising from the bottom of the page, with a glowing location
// marker for Ahmedabad. It is stylised (procedural continents), not an accurate map.
function Planet({ light }) {
  const tex = useMemo(() => earthTextures(false), []);
  const earth = useRef();
  const clouds = useRef();
  const ring = useRef();
  const pin = useRef();
  const group = useRef();
  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    earth.current.rotation.y += dt * 0.012;
    clouds.current.rotation.y += dt * 0.02;
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, 0.12 - state.pointer.y * 0.08, 3, dt);
    group.current.rotation.z = THREE.MathUtils.damp(group.current.rotation.z, -state.pointer.x * 0.08, 3, dt);
    const k = (t * 0.55) % 1;
    ring.current.scale.setScalar(0.4 + k * 2.2);
    ring.current.material.opacity = (1 - k) * 0.8;
    pin.current.position.y = 0.38 + Math.sin(t * 2.2) * 0.04;
  });
  const R = 6;
  return (
    <group ref={group} position={[0, -7.55, 0]}>
      <mesh ref={earth}>
        <sphereGeometry args={[R, 96, 64]} />
        <meshStandardMaterial map={tex.map} roughness={0.85} />
      </mesh>
      <mesh ref={clouds}>
        <sphereGeometry args={[R * 1.012, 96, 64]} />
        <meshStandardMaterial map={tex.clouds} transparent depthWrite={false} roughness={1} />
      </mesh>
      <Atmosphere r={R} color="#6fb4ff" strength={1.2} light={light} />
      {/* Marker, standing on the surface facing the viewer */}
      <group position={[0, R * 0.985, R * 0.17]} rotation={[0.17, 0, 0]}>
        <mesh ref={ring} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
          <ringGeometry args={[0.8, 1, 48]} />
          <meshBasicMaterial color="#ffb35a" transparent depthWrite={false} blending={THREE.AdditiveBlending} />
        </mesh>
        <group ref={pin}>
          <mesh>
            <sphereGeometry args={[0.13, 16, 12]} />
            <meshBasicMaterial color="#ffb35a" />
          </mesh>
        </group>
      </group>
    </group>
  );
}

export default function Globe() {
  const [theme] = useTheme();
  const light = theme === "light";
  return (
    <div className="foot__globe" aria-hidden="true">
      <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 11], fov: 34 }} gl={{ alpha: true, antialias: true }} onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}>
        <ambientLight intensity={light ? 0.9 : 0.35} />
        <directionalLight position={[-6, 8, 7]} intensity={light ? 2 : 2.8} color="#fff4e6" />
        <Planet light={light} />
      </Canvas>
    </div>
  );
}
