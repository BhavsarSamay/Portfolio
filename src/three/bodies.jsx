import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { scene3d } from "./store";
import { earthTextures, saturnTexture, marsTexture, moonTexture, ringTexture, nebulaTexture } from "./textures";

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

// Fades everything inside it by distance from the camera, and by the post-hero fade.
// Works on built-in materials (opacity) and on custom shaders that expose a uOpacity uniform.
export function Fade({ z, far = 150, near = 6, hero = true, amount = 1, children }) {
  const g = useRef();
  const mats = useRef([]);
  useEffect(() => {
    const list = [];
    g.current.traverse((o) => {
      const m = o.material;
      if (!m) return;
      (Array.isArray(m) ? m : [m]).forEach((mm) => {
        if (mm.uniforms?.uOpacity) {
          list.push([mm, "u"]);
        } else {
          if (mm.userData.base === undefined) mm.userData.base = mm.opacity;
          mm.transparent = true;
          list.push([mm, "o"]);
        }
      });
    });
    mats.current = list;
  });
  useFrame((state) => {
    const d = state.camera.position.z - z;
    const f = clamp((far - d) / (far * 0.3), 0, 1) * clamp((d - near) / near, 0, 1) * (hero ? scene3d.objFade : 1) * amount;
    g.current.visible = f > 0.003 || scene3d.warmup;
    if (!g.current.visible) return;
    for (const [m, kind] of mats.current) {
      if (kind === "u") m.uniforms.uOpacity.value = f;
      else m.opacity = (m.userData.base ?? 1) * f;
    }
  });
  return <group ref={g}>{children}</group>;
}

// ---------- stars ----------
const starVert = /* glsl */ `
  uniform float uPx; uniform float uStreak;
  attribute float aSize; attribute vec3 aColor; attribute float aEnd;
  varying vec3 vC; varying float vA;
  void main() {
    vec3 p = position;
    p.z += aEnd * uStreak;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    float dist = -mv.z;
    gl_PointSize = clamp(aSize * uPx * 160.0 / max(dist, 0.1), 1.0, 5.0 * uPx);
    vC = aColor;
    vA = clamp(1.0 - dist / 320.0, 0.0, 1.0) * clamp((dist - 1.5) / 8.0, 0.0, 1.0);
  }`;
const starFragPoint = /* glsl */ `
  uniform float uOpacity; varying vec3 vC; varying float vA;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    gl_FragColor = vec4(vC, vA * uOpacity * smoothstep(0.5, 0.05, d));
  }`;
const starFragLine = /* glsl */ `
  uniform float uOpacity; varying vec3 vC; varying float vA;
  void main() { gl_FragColor = vec4(vC, vA * uOpacity * 0.55); }`;

export function Stars({ count, light }) {
  const { pts, lines } = useMemo(() => {
    const pos = new Float32Array(count * 3), size = new Float32Array(count), col = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = Math.sqrt(Math.random()) * 85 + 6, a = Math.random() * 6.283;
      pos.set([Math.cos(a) * r, Math.sin(a) * r * 0.7, -Math.random() * 540 + 20], i * 3);
      size[i] = 0.5 + Math.random() * 1.1;
      const t = Math.random();
      const c = light
        ? t > 0.82 ? [0.85, 0.42, 0.16] : t < 0.25 ? [0.2, 0.31, 0.74] : [0.03, 0.03, 0.03]
        : t > 0.88 ? [1, 0.84, 0.67] : t < 0.12 ? [0.67, 0.78, 1] : [1, 1, 1];
      col.set(c, i * 3);
    }
    const p = new THREE.BufferGeometry();
    p.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    p.setAttribute("aSize", new THREE.BufferAttribute(size, 1));
    p.setAttribute("aColor", new THREE.BufferAttribute(col, 3));
    p.setAttribute("aEnd", new THREE.BufferAttribute(new Float32Array(count), 1));

    const lp = new Float32Array(count * 6), lc = new Float32Array(count * 6), le = new Float32Array(count * 2), ls = new Float32Array(count * 2);
    for (let i = 0; i < count; i++) {
      lp.set(pos.subarray(i * 3, i * 3 + 3), i * 6);
      lp.set(pos.subarray(i * 3, i * 3 + 3), i * 6 + 3);
      lc.set(col.subarray(i * 3, i * 3 + 3), i * 6);
      lc.set(col.subarray(i * 3, i * 3 + 3), i * 6 + 3);
      le[i * 2 + 1] = 1;
    }
    const l = new THREE.BufferGeometry();
    l.setAttribute("position", new THREE.BufferAttribute(lp, 3));
    l.setAttribute("aColor", new THREE.BufferAttribute(lc, 3));
    l.setAttribute("aEnd", new THREE.BufferAttribute(le, 1));
    l.setAttribute("aSize", new THREE.BufferAttribute(ls, 1));
    return { pts: p, lines: l };
  }, [count, light]);

  const pointMat = useMemo(
    () => new THREE.ShaderMaterial({ vertexShader: starVert, fragmentShader: starFragPoint, transparent: true, depthWrite: false, blending: light ? THREE.NormalBlending : THREE.AdditiveBlending, uniforms: { uPx: { value: 1 }, uStreak: { value: 0 }, uOpacity: { value: 1 } } }),
    [light]
  );
  const lineMat = useMemo(
    () => new THREE.ShaderMaterial({ vertexShader: starVert, fragmentShader: starFragLine, transparent: true, depthWrite: false, blending: light ? THREE.NormalBlending : THREE.AdditiveBlending, uniforms: { uPx: { value: 1 }, uStreak: { value: 0 }, uOpacity: { value: 1 } } }),
    [light]
  );
  const lineRef = useRef();
  useFrame((state) => {
    const streak = clamp((scene3d.camSpeed || 0) * 0.05, -16, 16) + scene3d.warp * 22 * (scene3d.zoomDir || 1);
    pointMat.uniforms.uPx.value = state.gl.getPixelRatio();
    lineMat.uniforms.uPx.value = state.gl.getPixelRatio();
    pointMat.uniforms.uStreak.value = streak;
    lineMat.uniforms.uStreak.value = streak;
    if (lineRef.current) lineRef.current.visible = Math.abs(streak) > 0.6;
  });
  return (
    <>
      <points geometry={pts} material={pointMat} frustumCulled={false} />
      <lineSegments ref={lineRef} geometry={lines} material={lineMat} frustumCulled={false} />
    </>
  );
}

// Textures are generated off the main thread, so they arrive a moment after the body mounts.
function useAsync(factory, deps) {
  const [value, setValue] = useState(null);
  useEffect(() => {
    let live = true;
    factory().then((r) => live && setValue(r));
    return () => {
      live = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return value;
}

// ---------- planets ----------
function Planet({ r, map, spin = 0.03, children, rough = 1 }) {
  const ref = useRef();
  useFrame((_, dt) => {
    ref.current.rotation.y += dt * spin;
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[r, 64, 48]} />
      {/* keyed so the material is rebuilt when its texture arrives (three.js will not recompile on a map change) */}
      <meshStandardMaterial key={map ? "map" : "plain"} map={map} color={map ? "#ffffff" : "#5d5750"} roughness={rough} metalness={0} />
      {children}
    </mesh>
  );
}

export function Saturn({ position, r, light }) {
  const map = useAsync(saturnTexture, []);
  const ring = useMemo(ringTexture, []);
  const ringGeo = useMemo(() => {
    const inner = r * 1.35, outer = r * 2.45;
    const g = new THREE.RingGeometry(inner, outer, 160, 1);
    const p = g.attributes.position, uv = g.attributes.uv;
    for (let i = 0; i < p.count; i++) uv.setXY(i, (Math.hypot(p.getX(i), p.getY(i)) - inner) / (outer - inner), 0.5);
    return g;
  }, [r]);
  return (
    <Fade z={position[2]} amount={0.85}>
      <group position={position} rotation={[0.28, 0, -0.42]}>
        <Planet r={r} map={map} spin={0.02} />
        <mesh geometry={ringGeo} rotation={[-Math.PI / 2, 0, 0]}>
          <meshBasicMaterial map={ring} side={THREE.DoubleSide} transparent depthWrite={false} color={light ? "#8a6a3a" : "#ffffff"} />
        </mesh>
      </group>
    </Fade>
  );
}

export function Mars({ position, r, light }) {
  const map = useAsync(marsTexture, []);
  return (
    <Fade z={position[2]}>
      <group position={position}>
        <Planet r={r} map={map} spin={0.04} />
      </group>
    </Fade>
  );
}

export function Moon({ position, r, light }) {
  const map = useAsync(moonTexture, []);
  return (
    <Fade z={position[2]}>
      <group position={position}>
        <Planet r={r} map={map} spin={0.01} />
      </group>
    </Fade>
  );
}

function Station({ s }) {
  // A tiny International Space Station: truss, modules and gold solar arrays.
  return (
    <group scale={s}>
      <mesh><boxGeometry args={[3.2, 0.1, 0.1]} /><meshStandardMaterial color="#d8dde6" metalness={0.6} roughness={0.35} /></mesh>
      <mesh><boxGeometry args={[0.7, 0.3, 0.3]} /><meshStandardMaterial color="#eef0f4" metalness={0.5} roughness={0.4} /></mesh>
      {[-1.35, -0.9, 0.9, 1.35].map((x) => (
        <group key={x}>
          <mesh position={[x, 0.55, 0]}><boxGeometry args={[0.36, 0.9, 0.03]} /><meshStandardMaterial color="#d6a542" metalness={0.5} roughness={0.35} emissive="#5a3d08" emissiveIntensity={0.4} /></mesh>
          <mesh position={[x, -0.55, 0]}><boxGeometry args={[0.36, 0.9, 0.03]} /><meshStandardMaterial color="#d6a542" metalness={0.5} roughness={0.35} emissive="#5a3d08" emissiveIntensity={0.4} /></mesh>
        </group>
      ))}
    </group>
  );
}

export function Earth({ position, r, light, big }) {
  const tex = useAsync(() => earthTextures(big), [big]);
  const clouds = useRef();
  const orbit = useRef();
  useFrame((state, dt) => {
    if (clouds.current) clouds.current.rotation.y += dt * 0.012;
    const a = state.clock.elapsedTime * 0.35;
    orbit.current.position.set(Math.cos(a) * r * 1.7, 0, Math.sin(a) * r * 1.7);
    orbit.current.rotation.y = -a + Math.PI / 2;
  });
  return (
    <Fade z={position[2]}>
      <group position={position}>
        <Planet r={r} map={tex?.map ?? null} spin={0.02} rough={0.85} />
        {tex && (
          <mesh ref={clouds}>
            <sphereGeometry args={[r * 1.012, 64, 48]} />
            <meshStandardMaterial map={tex.clouds} transparent depthWrite={false} roughness={1} />
          </mesh>
        )}
        <group rotation={[0.42, 0, 0.18]}>
          <group ref={orbit}>
            <Station s={r * 0.07} />
          </group>
        </group>
      </group>
    </Fade>
  );
}

export function Sun({ position, r, light }) {
  return (
    <Fade z={position[2]}>
      <group position={position}>
        <mesh>
          <sphereGeometry args={[r, 48, 32]} />
          <meshBasicMaterial color={light ? "#ff9d3c" : "#ffe3b0"} />
        </mesh>
      </group>
    </Fade>
  );
}

// ---------- deep space ----------
export function Nebula({ position, size, colors, light }) {
  const maps = useAsync(() => Promise.all(colors[light ? "light" : "dark"].map(([a, b], i) => nebulaTexture(a, b, 3 + i * 11))), [colors, light]);
  const refs = useRef([]);
  useFrame((state) => {
    refs.current.forEach((m, i) => m && (m.rotation.z = state.clock.elapsedTime * 0.01 * (i ? -1 : 1)));
  });
  return (
    <Fade z={position[2]} far={200}>
      <group position={position}>
        {(maps ?? []).map((map, i) => (
          <mesh key={i} ref={(el) => (refs.current[i] = el)} position={[i * 9 - 5, i * -6 + 3, -i * 6]} scale={size * (1 - i * 0.2)}>
            <planeGeometry args={[1, 1]} />
            <meshBasicMaterial map={map} transparent depthWrite={false} blending={light ? THREE.NormalBlending : THREE.AdditiveBlending} opacity={light ? 0.5 : 0.42} />
          </mesh>
        ))}
      </group>
    </Fade>
  );
}

export function Galaxy({ position, radius, count, light }) {
  const geo = useMemo(() => {
    const pos = new Float32Array(count * 3), col = new Float32Array(count * 3), sz = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const r = Math.pow(Math.random(), 0.7);
      const arm = (i % 3) * ((Math.PI * 2) / 3);
      const ang = arm + r * 5.4 + (Math.random() - 0.5) * 0.5 * (0.25 + r);
      const thick = (Math.random() - 0.5) * (0.12 - r * 0.07);
      pos.set([Math.cos(ang) * r * radius, thick * radius, Math.sin(ang) * r * radius], i * 3);
      const core = 1 - clamp(r * 2.2, 0, 1);
      const c = light
        ? [0.35 + core * 0.55, 0.38 + core * 0.2, 0.82 - core * 0.6]
        : [0.66 + core * 0.34, 0.74 + core * 0.2, 1 - core * 0.2];
      col.set(c, i * 3);
      sz[i] = 0.6 + Math.random() * 1.4 + core * 1.2;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("aColor", new THREE.BufferAttribute(col, 3));
    g.setAttribute("aSize", new THREE.BufferAttribute(sz, 1));
    return g;
  }, [count, radius, light]);
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: light ? THREE.NormalBlending : THREE.AdditiveBlending,
        uniforms: { uPx: { value: 1 }, uOpacity: { value: 1 } },
        vertexShader: `uniform float uPx; attribute float aSize; attribute vec3 aColor; varying vec3 vC;
          void main(){ vec4 mv = modelViewMatrix * vec4(position,1.0); gl_Position = projectionMatrix * mv; gl_PointSize = clamp(aSize * uPx * 70.0 / -mv.z, 1.0, 9.0 * uPx); vC = aColor; }`,
        fragmentShader: `uniform float uOpacity; varying vec3 vC;
          void main(){ float d = length(gl_PointCoord - 0.5); if(d>0.5) discard; gl_FragColor = vec4(vC, smoothstep(0.5,0.0,d) * uOpacity * ${light ? "0.8" : "0.7"}); }`,
      }),
    [light]
  );
  const ref = useRef();
  useFrame((state, dt) => {
    ref.current.rotation.y += dt * 0.02;
    mat.uniforms.uPx.value = state.gl.getPixelRatio();
  });
  return (
    <Fade z={position[2]} far={190}>
      <group position={position} rotation={[0.9, 0, -0.4]}>
        <points ref={ref} geometry={geo} material={mat} frustumCulled={false} />
      </group>
    </Fade>
  );
}

export function Asteroids({ position, spread, count, light }) {
  const geo = useMemo(() => {
    const g = new THREE.IcosahedronGeometry(1, 1);
    const p = g.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const v = new THREE.Vector3().fromBufferAttribute(p, i);
      v.multiplyScalar(0.75 + noiseHash(v.x * 3.1, v.y * 2.7, v.z * 3.7) * 0.5);
      p.setXYZ(i, v.x, v.y, v.z);
    }
    g.computeVertexNormals();
    return g;
  }, []);
  const rocks = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        p: new THREE.Vector3((Math.random() - 0.5) * spread * 2, (Math.random() - 0.5) * spread * 0.9, (Math.random() - 0.5) * spread * 2.4),
        s: new THREE.Vector3(0.35 + Math.random() * 1.1, 0.35 + Math.random() * 0.9, 0.35 + Math.random() * 1.1),
        r: new THREE.Euler(Math.random() * 6, Math.random() * 6, Math.random() * 6),
        w: new THREE.Vector3((Math.random() - 0.5) * 0.4, (Math.random() - 0.5) * 0.4, (Math.random() - 0.5) * 0.4),
      })),
    [count, spread]
  );
  const ref = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    rocks.forEach((k, i) => {
      dummy.position.copy(k.p);
      dummy.scale.copy(k.s);
      dummy.rotation.set(k.r.x + k.w.x * t, k.r.y + k.w.y * t, k.r.z + k.w.z * t);
      dummy.updateMatrix();
      ref.current.setMatrixAt(i, dummy.matrix);
    });
    ref.current.instanceMatrix.needsUpdate = true;
  });
  return (
    <Fade z={position[2]} far={120}>
      <group position={position}>
        <instancedMesh ref={ref} args={[geo, undefined, count]} frustumCulled={false}>
          <meshStandardMaterial color={light ? "#8a7a68" : "#9a8e82"} roughness={1} flatShading />
        </instancedMesh>
      </group>
    </Fade>
  );
}
function noiseHash(x, y, z) {
  const s = Math.sin(x * 12.9898 + y * 78.233 + z * 37.719) * 43758.5453;
  return s - Math.floor(s);
}

export function Wormhole({ position, radius, color, light }) {
  const N = 16;
  const rings = useRef([]);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    rings.current.forEach((m, i) => {
      if (!m) return;
      const p = (i / N + t * 0.1) % 1;
      m.scale.setScalar(radius * (0.12 + p * p * 3.2));
      m.position.z = -p * 36;
      m.material.userData.base = (1 - p) * (light ? 0.5 : 0.4);
    });
  });
  return (
    <Fade z={position[2]} far={170} near={3}>
      <group position={position}>
        {Array.from({ length: N }, (_, i) => (
          <mesh key={i} ref={(el) => (rings.current[i] = el)}>
            <ringGeometry args={[0.97, 1, 96]} />
            <meshBasicMaterial color={color} transparent depthWrite={false} side={THREE.DoubleSide} blending={light ? THREE.NormalBlending : THREE.AdditiveBlending} />
          </mesh>
        ))}
      </group>
    </Fade>
  );
}
