import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Center, Text3D } from "@react-three/drei";
import * as THREE from "three";
import { scene3d, TOTAL, markReady } from "./store";

// A small studio made of glowing panels, baked once into a reflection map.
// It is applied only to the monogram so the planets keep their own lighting.
function useStudioEnv(light) {
  const gl = useThree((s) => s.gl);
  return useMemo(() => {
    const pm = new THREE.PMREMGenerator(gl);
    const sc = new THREE.Scene();
    sc.background = new THREE.Color(light ? "#cfcabd" : "#05060a");
    const panel = (color, k, pos, scale) => {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(k), side: THREE.DoubleSide }));
      m.position.set(...pos);
      m.scale.set(...scale);
      m.lookAt(0, 0, 0);
      sc.add(m);
    };
    panel("#ffffff", light ? 3 : 4, [0, 6, 8], [14, 4, 1]);
    panel("#c7ff3d", light ? 2 : 3.2, [-9, 0, 3], [3, 10, 1]);
    panel("#7fb4ff", light ? 2 : 3.2, [9, -1, 3], [3, 10, 1]);
    panel("#ffffff", 1.4, [0, -6, 5], [12, 2, 1]);
    panel("#fff1d8", 2, [0, 0, -9], [14, 8, 1]);
    // A big gradient panel behind the camera, so faces that look straight at us show a sheen
    // (light corner fading to dark) instead of one flat colour.
    const gc = document.createElement("canvas");
    gc.width = gc.height = 128;
    const gx = gc.getContext("2d");
    const gg = gx.createLinearGradient(0, 0, 128, 128);
    gg.addColorStop(0, "#ffffff");
    gg.addColorStop(0.45, "#b6b9c2");
    gg.addColorStop(1, "#15171d");
    gx.fillStyle = gg;
    gx.fillRect(0, 0, 128, 128);
    const gt = new THREE.CanvasTexture(gc);
    gt.colorSpace = THREE.SRGBColorSpace;
    const gm = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: gt, color: new THREE.Color(light ? 2.6 : 2.2, light ? 2.6 : 2.2, light ? 2.6 : 2.2), side: THREE.DoubleSide }));
    gm.position.set(0, 0, 10);
    gm.scale.set(22, 14, 1);
    gm.lookAt(0, 0, 0);
    sc.add(gm);
    panel("#c7ff3d", 1.2, [6, -3, 9], [4, 2, 1]);
    const tex = pm.fromScene(sc, 0.02).texture;
    pm.dispose();
    return tex;
  }, [gl, light]);
}

const damp = THREE.MathUtils.damp;

// The hero's signature: an extruded metal "SB". It rests beside the headline, leans toward the
// cursor, and is left behind as the camera moves on through the page.
export default function Monogram3D({ light }) {
  const root = useRef();
  const spin = useRef({ x: 0, y: 0 });
  const env = useStudioEnv(light);

  const announced = useRef(false);
  useFrame((state, dt) => {
    const g = root.current;
    // The first frame that draws the monogram is when the 2D hero fallback can step aside.
    if (!announced.current) {
      announced.current = true;
      markReady();
    }
    const aspect = state.size.width / state.size.height;
    const D = 10;
    const halfH = Math.tan((state.camera.fov * Math.PI) / 360) * D;
    const halfW = halfH * aspect;
    const portrait = aspect < 0.95;

    const s = portrait ? Math.min(halfW * 1.5, halfH * 0.8) / 7.2 : Math.min(halfW * 0.8, halfH * 1.5) / 7.2;
    g.scale.setScalar(s);

    // Held in front of the camera during the hero, then left where it is so the camera flies past.
    const camZ = scene3d.camZ;
    const z1 = -(scene3d.vh / scene3d.maxScroll) * TOTAL - 4;
    const t = scene3d.heroT;
    const camX = t < 1 ? state.camera.position.x : 0;
    g.position.set(camX + (portrait ? 0 : halfW * 0.56), portrait ? halfH * 0.36 : halfH * 0.04, t < 1 ? camZ - D + 6 * t * t : z1);
    g.visible = camZ - g.position.z > 0.6;

    const { x: px, y: py } = scene3d.pointer;
    spin.current.y = damp(spin.current.y, px * 0.9 + t * 1.6, 3, dt);
    spin.current.x = damp(spin.current.x, -py * 0.5, 3, dt);
    g.rotation.y = spin.current.y + Math.sin(state.clock.elapsedTime * 0.35) * 0.12;
    g.rotation.x = spin.current.x;
    g.position.y += Math.sin(state.clock.elapsedTime * 0.8) * 0.06;
  });

  return (
    <group ref={root}>
      {!light && <pointLight position={[-2, 2, 4]} color="#c7ff3d" intensity={14} distance={16} />}
      <Center>
        <Text3D
          font="/fonts/helvetiker_bold.typeface.json"
          size={2.6}
          height={0.75}
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.08}
          bevelSize={0.06}
          bevelSegments={6}
          letterSpacing={0.04}
        >
          SB
          <meshPhysicalMaterial
            color={light ? "#3b4049" : "#a9b2c6"}
            metalness={1}
            roughness={0.2}
            clearcoat={1}
            clearcoatRoughness={0.12}
            envMap={env}
            envMapIntensity={light ? 1.4 : 1.15}
          />
        </Text3D>
      </Center>
    </group>
  );
}
