import * as THREE from "three";
import { generate } from "./texgen";

// Every texture here is generated in code, so the scene needs no image downloads.
// The expensive pixel maths happens in a Web Worker; this file only turns the finished pixels into
// three.js textures. Everything is async and cached, so bodies simply appear once their map is ready.

// ---- worker plumbing ----
let worker;
let nextId = 1;
const pending = new Map();

function getWorker() {
  if (worker !== undefined) return worker;
  try {
    worker = new Worker(new URL("./texWorker.js", import.meta.url), { type: "module" });
    worker.onmessage = (e) => {
      const { id, w, h, data } = e.data;
      const p = pending.get(id);
      if (p) {
        pending.delete(id);
        p.resolve({ w, h, data });
      }
    };
    // If the worker fails to load, finish every waiting job on the page instead.
    worker.onerror = () => {
      worker = null;
      for (const [id, p] of pending) {
        pending.delete(id);
        setTimeout(() => p.resolve(generate(p.type, p.args)), 0);
      }
    };
  } catch {
    worker = null;
  }
  return worker;
}

function pixels(type, args) {
  return new Promise((resolve) => {
    const w = getWorker();
    if (!w) {
      setTimeout(() => resolve(generate(type, args)), 0);
      return;
    }
    const id = nextId++;
    pending.set(id, { resolve, type, args });
    w.postMessage({ id, type, args });
  });
}

// ---- helpers ----
function toCanvas({ w, h, data }) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  c.getContext("2d").putImageData(new ImageData(data, w, h), 0, 0);
  return c;
}
function finish(canvas) {
  const t = new THREE.CanvasTexture(canvas);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  t.needsUpdate = true;
  return t;
}
const cached = (key, make) => {
  if (!cached.m) cached.m = new Map();
  if (!cached.m.has(key)) cached.m.set(key, make());
  return cached.m.get(key);
};

// ---- planets ----
export const earthTextures = (big = true) =>
  cached(`earth${big}`, async () => {
    const w = big ? 1024 : 512;
    const [land, clouds] = await Promise.all([pixels("earthLand", { w }), pixels("earthClouds", { w })]);
    return { map: finish(toCanvas(land)), clouds: finish(toCanvas(clouds)) };
  });

export const saturnTexture = () => cached("saturn", async () => finish(toCanvas(await pixels("saturn"))));
export const marsTexture = () => cached("mars", async () => finish(toCanvas(await pixels("mars"))));

export const moonTexture = () =>
  cached("moon", async () => {
    const c = toCanvas(await pixels("moon"));
    // craters: dark bowl with a light rim (cheap, so done here)
    const ctx = c.getContext("2d");
    let s = 11;
    const rnd = () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
    for (let i = 0; i < 190; i++) {
      const x = rnd() * c.width, y = (0.1 + rnd() * 0.8) * c.height, r = 3 + rnd() * rnd() * 24;
      const g = ctx.createRadialGradient(x, y, r * 0.2, x, y, r);
      g.addColorStop(0, "rgba(30,30,36,0.38)");
      g.addColorStop(0.82, "rgba(30,30,36,0.18)");
      g.addColorStop(0.95, "rgba(235,235,238,0.34)");
      g.addColorStop(1, "rgba(235,235,238,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, 6.283);
      ctx.fill();
    }
    return finish(c);
  });

// Soft cloud of two colours, used for nebulae.
export const nebulaTexture = (c1, c2, seed = 1) =>
  cached(`neb${c1}${c2}${seed}`, async () => finish(toCanvas(await pixels("nebula", { c1, c2, seed }))));

// ---- cheap ones stay synchronous ----
// Radial strip used to colour a ring geometry (u runs from the inner to the outer edge).
export function ringTexture() {
  const w = 512;
  const c = document.createElement("canvas");
  c.width = w;
  c.height = 4;
  const ctx = c.getContext("2d");
  const img = ctx.createImageData(w, 4);
  const sm = (t) => t * t * (3 - 2 * t);
  const ss = (a, b, v) => sm(Math.min(1, Math.max(0, (v - a) / (b - a))));
  for (let x = 0; x < w; x++) {
    const u = x / (w - 1);
    let a = 0.2 + 0.8 * ss(0.02, 0.12, u) * ss(1, 0.88, u);
    a *= 0.55 + 0.45 * Math.sin(u * 140 + Math.sin(u * 31) * 2);
    a *= 1 - ss(0.56, 0.575, u) * ss(0.62, 0.605, u) * 0.92; // Cassini division
    const t = 0.5 + 0.5 * Math.sin(u * 150);
    const col = [176 + 64 * t, 144 + 78 * t, 104 + 80 * t];
    for (let y = 0; y < 4; y++) {
      const i = (y * w + x) * 4;
      img.data[i] = col[0]; img.data[i + 1] = col[1]; img.data[i + 2] = col[2]; img.data[i + 3] = Math.min(1, Math.max(0, a)) * 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return finish(c);
}
