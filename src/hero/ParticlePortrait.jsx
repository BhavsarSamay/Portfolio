import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { vertexShader, fragmentShader, photoVertexShader, photoFragmentShader } from "./particleShaders";
import { loadImage, sampleParticles, PORTRAIT_SRC, PHOTO_TONE } from "./sampleParticles";
import { isTouch } from "../lib/motion";

const { damp, smoothstep, clamp, degToRad } = THREE.MathUtils;
const CAMERA_Z = 3;
// Photo opacity at rest: 1 = the clean photo exactly as given, 0 = particles only.
// While the photo is fully shown the particles fade out underneath it, so no dots show through
// its soft edges (hair, shirt); scrolling dissolves the photo back into the particles.
const PHOTO_REST = 1;

// How many particles each kind of device draws. The photo itself is shown at rest, so the
// particles only need to be dense enough to carry its colours through the burst.
function particleBudget(tier) {
  if (innerWidth < 700) return 22000;
  return tier > 1 ? 50000 : 32000;
}

// Share of particles that leave the face to write the headline; the rest stay as drifting dust.
const TEXT_SHARE = 0.62;

// Portrait scale: the portrait fills ~60% of the viewport height, never wider than the screen allows.
function fitScale(fov, width, height, aspect) {
  const visH = 2 * CAMERA_Z * Math.tan(degToRad(fov / 2));
  const visW = visH * (width / height);
  return { visH, visW, s: Math.min(visH * (width < 700 ? 0.56 : 0.6), (visW * 0.86) / aspect) };
}

// Rasterises the headline exactly where the page lays it out (same fonts, sizes and word positions,
// read from the real DOM) and returns points on its glyphs, in stage pixels. line: 1 or 2.
function headlinePoints() {
  const stage = document.querySelector(".phero__stage");
  const words = [...document.querySelectorAll(".phero__claim .phero__w")];
  if (!stage || !words.length) return null;
  const W = stage.clientWidth;
  const H = stage.clientHeight;
  const cv = document.createElement("canvas");
  cv.width = W;
  cv.height = H;
  const cx = cv.getContext("2d", { willReadFrequently: true });
  for (const el of words) {
    const cs = getComputedStyle(el);
    cx.font = `${cs.fontStyle} 400 ${cs.fontSize} ${cs.fontFamily}`;
    if ("letterSpacing" in cx) cx.letterSpacing = cs.letterSpacing;
    // offsetLeft/Top ignore the reveal's transforms, so this is the word's resting place.
    let x = el.offsetLeft;
    let y = el.offsetTop;
    for (let op = el.offsetParent; op && op !== stage; op = op.offsetParent) {
      x += op.offsetLeft;
      y += op.offsetTop;
    }
    const m = cx.measureText("Hg");
    const base = y + (el.offsetHeight - (m.fontBoundingBoxAscent + m.fontBoundingBoxDescent)) / 2 + m.fontBoundingBoxAscent;
    cx.fillStyle = el.closest(".is-it") ? "#0000ff" : "#ff0000";
    cx.fillText(el.textContent.trim(), x, base);
  }
  const px = cx.getImageData(0, 0, W, H).data;
  const pts = [];
  for (let y = 0; y < H; y += 2) {
    for (let x = 0; x < W; x += 2) {
      const i = (y * W + x) * 4;
      if (px[i] > 140) pts.push(x, y, 1);
      else if (px[i + 2] > 140) pts.push(x, y, 2);
    }
  }
  return pts.length ? { pts, W, H } : null;
}

function Cloud({ buffers, progress, ready, pointer }) {
  const group = useRef(null);
  const mat = useRef(null);
  const photoMat = useRef(null);
  const intro = useRef(0);
  const eased = useRef(0);
  const { camera, size, gl } = useThree();

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(buffers.home, 3));
    g.setAttribute("aScatter", new THREE.BufferAttribute(buffers.scatter, 3));
    g.setAttribute("aData", new THREE.BufferAttribute(buffers.data, 4));
    g.setAttribute("aColor", new THREE.BufferAttribute(buffers.color, 3));
    g.setAttribute("aText", new THREE.BufferAttribute(new Float32Array(buffers.count * 4), 4));
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 20);
    return g;
  }, [buffers]);
  useEffect(() => () => geometry.dispose(), [geometry]);

  // Give each headline particle a spot on the letters (portrait space), and redo it when the layout changes.
  useEffect(() => {
    let dead = false;
    const assign = () => {
      if (dead) return;
      const hp = headlinePoints();
      if (!hp) return;
      const { visH, s } = fitScale(camera.fov, hp.W, hp.H, buffers.aspect);
      const k = visH / hp.H / s; // stage pixels → portrait units
      const arr = geometry.attributes.aText.array;
      const n = hp.pts.length / 3;
      for (let i = 0; i < buffers.count; i++) {
        // Spread the choice with the particle's own seed so the selection is stable across resizes.
        const seed = buffers.data[i * 4];
        if (((seed * 9301 + 0.137) % 1) > TEXT_SHARE) {
          arr[i * 4 + 3] = 0;
          continue;
        }
        const j = (Math.floor(((seed * 7919) % 1) * n) + i) % n;
        arr[i * 4] = (hp.pts[j * 3] + 1 - hp.W / 2) * k;
        arr[i * 4 + 1] = -(hp.pts[j * 3 + 1] + 1 - hp.H / 2) * k;
        arr[i * 4 + 2] = ((seed * 4271) % 1 - 0.5) * 0.012;
        arr[i * 4 + 3] = hp.pts[j * 3 + 2];
      }
      geometry.attributes.aText.needsUpdate = true;
    };
    (document.fonts?.ready ?? Promise.resolve()).then(() => requestAnimationFrame(assign));
    return () => {
      dead = true;
    };
  }, [geometry, buffers, camera, size.width, size.height]);

  // The untouched photo, as a texture. NoColorSpace: sampled values are the file's own sRGB bytes,
  // written straight to the screen exactly like the particles' colours.
  const photo = useMemo(() => {
    const tex = new THREE.Texture(buffers.img);
    tex.colorSpace = THREE.NoColorSpace;
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    tex.anisotropy = 4;
    tex.needsUpdate = true;
    return {
      tex,
      geo: new THREE.PlaneGeometry(buffers.aspect, 1),
      uniforms: { uMap: { value: tex }, uTone: { value: PHOTO_TONE }, uOpacity: { value: 0 }, uPointer: { value: new THREE.Vector2(9, 9) }, uPointerOn: { value: 0 } },
    };
  }, [buffers]);
  useEffect(() => () => { photo.tex.dispose(); photo.geo.dispose(); }, [photo]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uIntro: { value: 0 },
      uProgress: { value: 0 },
      uSize: { value: 1.5 },
      uPixelRatio: { value: 1 },
      uFade: { value: 1 },
      uPointer: { value: new THREE.Vector2(9, 9) },
      uPointerOn: { value: 0 },
      uTextHold: { value: 0 },
    }),
    []
  );

  useFrame((_, raw) => {
    const dt = Math.min(raw, 0.05);
    const u = mat.current.uniforms;
    u.uTime.value += dt;

    // Assembly plays once, after the site's intro hands over.
    if (ready.current) intro.current = Math.min(1, intro.current + dt / 2.4);
    u.uIntro.value = intro.current;

    // Scroll drives the burst; damping keeps it organic while staying locked to the scrollbar.
    eased.current = damp(eased.current, progress.current, 6, dt);
    u.uProgress.value = eased.current;
    u.uFade.value = 1 - smoothstep(eased.current, 0.85, 1) * 0.4;
    // The crisp headline (DOM) fades in at 0.66–0.79; the particles on it then settle to a shimmer.
    u.uTextHold.value = smoothstep(eased.current, 0.64, 0.76);

    const { visH, visW, s } = fitScale(camera.fov, size.width, size.height, buffers.aspect);
    group.current.scale.setScalar(s);
    // Dot size follows the on-screen spacing of the sampling grid, so neighbours just touch.
    const portraitPx = (s / visH) * size.height;
    const spacingPx = (buffers.step / buffers.height) * portraitPx;
    u.uSize.value = clamp(spacingPx * 1.15, 1.0, 3.2);
    u.uPixelRatio.value = gl.getPixelRatio();

    // Pointer: a gentle camera sway reveals the depth of the point cloud. It calms down before the
    // headline forms, so the particle letters land exactly on the page's letters.
    const p = pointer.current;
    const calm = 1 - smoothstep(eased.current, 0.22, 0.45);
    camera.position.x = damp(camera.position.x, p.on ? p.x * 0.14 * calm : 0, 2.5, dt);
    camera.position.y = damp(camera.position.y, p.on ? p.y * 0.09 * calm : 0, 2.5, dt);
    // Dolly: the camera pushes into the burst and eases back as the particles converge on the words.
    camera.position.z = CAMERA_Z - 0.35 * Math.sin(Math.PI * clamp(eased.current / 0.6, 0, 1));
    camera.lookAt(0, 0, 0);
    u.uPointer.value.set((p.x * visW) / 2 / s, (p.y * visH) / 2 / s);
    u.uPointerOn.value = damp(u.uPointerOn.value, p.on ? 1 : 0, 6, dt);

    // At rest the photo is only partly opaque over the particles, so the portrait reads as dotted;
    // scrolling dissolves the rest of it into particles.
    // Write to the material's own uniforms (the renderer may not share the object passed as a prop).
    const pu = photoMat.current.uniforms;
    const photoA = PHOTO_REST * smoothstep(intro.current, 0.8, 1) * (1 - smoothstep(eased.current, 0.0, 0.07));
    pu.uOpacity.value = photoA;
    u.uFade.value *= 1 - photoA;
    pu.uPointer.value.copy(u.uPointer.value);
    pu.uPointerOn.value = u.uPointerOn.value;
  });

  return (
    <group ref={group}>
      <points geometry={geometry} frustumCulled={false}>
        <shaderMaterial
          ref={mat}
          uniforms={uniforms}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          transparent
          depthWrite={false}
          blending={THREE.NormalBlending}
        />
      </points>
      <mesh geometry={photo.geo} renderOrder={1} frustumCulled={false}>
        <shaderMaterial
          ref={photoMat}
          uniforms={photo.uniforms}
          vertexShader={photoVertexShader}
          fragmentShader={photoFragmentShader}
          transparent
          depthTest={false}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

// The hero's particle portrait. `progress` (ref, 0–1) comes from the hero's ScrollTrigger;
// `ready` (ref) becomes true once the page intro is done. `onFail` switches to the static fallback.
export default function ParticlePortrait({ progress, ready, tier, onFail, onReady }) {
  const wrap = useRef(null);
  const pointer = useRef({ x: 0, y: 0, on: false });
  const [buffers, setBuffers] = useState(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let dead = false;
    loadImage(PORTRAIT_SRC)
      .then((img) => {
        if (dead) return;
        const b = sampleParticles(img, particleBudget(tier));
        setBuffers({ ...b, img });
        onReady?.(b.count);
      })
      .catch((err) => !dead && onFail?.(err));
    return () => {
      dead = true;
    };
  }, [tier, onFail, onReady]);

  // Pointer in normalised device coordinates (y up). Touch devices skip it.
  useEffect(() => {
    if (isTouch()) return;
    const move = (e) => {
      pointer.current.x = (e.clientX / innerWidth) * 2 - 1;
      pointer.current.y = -((e.clientY / innerHeight) * 2 - 1);
      pointer.current.on = true;
    };
    const leave = () => (pointer.current.on = false);
    addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, []);

  // Stop rendering entirely once the hero has scrolled out of view.
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: "100px" });
    io.observe(wrap.current);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrap} className="phero__canvas" aria-hidden="true">
      {buffers && (
        <Canvas
          frameloop={visible ? "always" : "never"}
          dpr={[1, tier > 1 ? 1.75 : 1.25]}
          camera={{ fov: 35, position: [0, 0, CAMERA_Z], near: 0.05, far: 60 }}
          gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
          onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
        >
          <Cloud buffers={buffers} progress={progress} ready={ready} pointer={pointer} />
        </Canvas>
      )}
    </div>
  );
}
