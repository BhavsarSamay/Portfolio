import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Center, Text3D } from "@react-three/drei";
import * as THREE from "three";
import { scene3d, markReady } from "./store";

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
    const k = light ? 2.6 : 2.2;
    const gm = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: gt, color: new THREE.Color(k, k, k), side: THREE.DoubleSide }));
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
const D = 10; // distance in front of the camera while the hero is on screen

// The hero's signature: an extruded metal "SB".
// Its position and size are read from the page layout every frame, so it always sits in the free space
// beside the headline (or above it on narrow screens) and scrolls away together with the hero content.
export default function Monogram3D({ light }) {
  const root = useRef();
  const inner = useRef();
  const base = useRef(null);
  const els = useRef(null);
  const announced = useRef(false);
  const spin = useRef({ x: 0, y: 0 });
  const env = useStudioEnv(light);
  const tmp = useMemo(() => new THREE.Vector3(), []);
  const box = useMemo(() => new THREE.Box3(), []);

  useFrame((state, dt) => {
    const g = root.current;

    // The first frame that draws the monogram is when the 2D hero fallback can step aside.
    if (!announced.current) {
      announced.current = true;
      markReady();
    }

    // Natural size of the lettering, measured once at scale 1 with no rotation.
    if (!base.current) {
      g.scale.setScalar(1);
      g.quaternion.identity();
      g.position.set(0, 0, 0);
      g.updateMatrixWorld(true);
      const size = box.setFromObject(inner.current).getSize(tmp);
      if (size.x < 0.01) return;
      base.current = { w: size.x, h: size.y };
    }

    if (!els.current) {
      const chars = document.querySelectorAll(".hero__name .line--2 .c");
      els.current = {
        name: document.querySelector(".hero__name"),
        last: chars[chars.length - 1],
        top: document.querySelector(".hero__top"),
        bottom: document.querySelector(".hero__bottom"),
      };
    }
    const { name, last, top, bottom } = els.current;
    const t = scene3d.heroT;
    if (!name || !last || !top || !bottom || t >= 1) {
      g.visible = false;
      return;
    }

    // Free space for the monogram, in screen pixels.
    const W = state.size.width, H = state.size.height;
    const nr = name.getBoundingClientRect(), br = bottom.getBoundingClientRect(), tr = top.getBoundingClientRect();
    let left, right, topY, botY;
    if (W > 900) {
      // Beside the headline, vertically centred on it.
      left = last.getBoundingClientRect().right + Math.max(24, W * 0.03);
      right = br.right;
      topY = nr.top - nr.height * 0.06;
      botY = nr.bottom + nr.height * 0.04;
    } else {
      // Between the meta line and the headline.
      left = br.left;
      right = br.right;
      topY = tr.bottom + 10;
      botY = nr.top - 10;
    }
    const sw = right - left, sh = botY - topY;
    if (sw < 80 || sh < 60 || botY < -40) {
      g.visible = false;
      return;
    }
    g.visible = true;

    // Place it where that rectangle is, at a depth that recedes a little as the hero scrolls away.
    const cam = state.camera;
    cam.updateMatrixWorld();
    const d = D + t * 6;
    const worldPerPx = (2 * Math.tan((cam.fov * Math.PI) / 360) * d) / H;
    const cx = (left + right) / 2, cy = (topY + botY) / 2;
    g.position.set((cx - W / 2) * worldPerPx, -(cy - H / 2) * worldPerPx, -d).applyMatrix4(cam.matrixWorld);
    const fit = W > 900 ? 0.94 : 0.68; // narrow screens: keep it clearly smaller than the headline
    g.scale.setScalar(Math.min((sw * fit) / base.current.w, (sh * (fit - 0.04)) / base.current.h) * worldPerPx * (1 - t * 0.25));

    // Faces the viewer, leans gently toward the pointer, and turns away as the hero scrolls off.
    const { x: px, y: py } = scene3d.pointer;
    spin.current.y = damp(spin.current.y, px * 0.4 + t * 1.1, 3, dt);
    spin.current.x = damp(spin.current.x, -py * 0.25, 3, dt);
    g.quaternion.copy(cam.quaternion);
    g.rotateY(spin.current.y + Math.sin(state.clock.elapsedTime * 0.35) * 0.08);
    g.rotateX(spin.current.x);
  });

  return (
    <group ref={root} visible={false}>
      {!light && <pointLight position={[-2, 2, 4]} color="#c7ff3d" intensity={14} distance={16} />}
      <group ref={inner}>
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
    </group>
  );
}
