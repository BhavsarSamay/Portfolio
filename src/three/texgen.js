// Pure pixel generators for the planet and nebula textures. No DOM and no three.js, so the same code
// runs in a Web Worker (off the main thread) or, if workers are unavailable, directly on the page.
// Each generator returns { w, h, data } where data is RGBA bytes.

// ---- value noise ----
const hash = (x, y, z, s) => {
  let n = Math.imul(x, 374761393) ^ Math.imul(y, 668265263) ^ Math.imul(z, 1274126177) ^ Math.imul(s, 2246822519);
  n = Math.imul(n ^ (n >>> 13), 1274126177);
  return ((n ^ (n >>> 16)) >>> 0) / 4294967295;
};
const smooth = (t) => t * t * (3 - 2 * t);
const mix = (a, b, t) => a + (b - a) * t;
const clamp01 = (v) => Math.min(1, Math.max(0, v));
const smoothstep = (a, b, v) => smooth(clamp01((v - a) / (b - a)));

function noise3(x, y, z, s) {
  const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z);
  const xf = smooth(x - xi), yf = smooth(y - yi), zf = smooth(z - zi);
  const c = (dx, dy, dz) => hash(xi + dx, yi + dy, zi + dz, s);
  return mix(
    mix(mix(c(0, 0, 0), c(1, 0, 0), xf), mix(c(0, 1, 0), c(1, 1, 0), xf), yf),
    mix(mix(c(0, 0, 1), c(1, 0, 1), xf), mix(c(0, 1, 1), c(1, 1, 1), xf), yf),
    zf
  );
}
function fbm3(x, y, z, s, oct = 5) {
  let a = 0.5, f = 1, v = 0, norm = 0;
  for (let i = 0; i < oct; i++) {
    v += a * noise3(x * f, y * f, z * f, s + i * 17);
    norm += a;
    f *= 2;
    a *= 0.5;
  }
  return v / norm;
}
const mixRgb = (a, b, t) => [mix(a[0], b[0], t), mix(a[1], b[1], t), mix(a[2], b[2], t)];

// Sample fn at every pixel of an equirectangular map (3D point on the unit sphere).
function equirect(w, h, fn) {
  const data = new Uint8ClampedArray(w * h * 4);
  for (let y = 0; y < h; y++) {
    const lat = (0.5 - (y + 0.5) / h) * Math.PI;
    const cl = Math.cos(lat), sl = Math.sin(lat);
    for (let x = 0; x < w; x++) {
      const lon = ((x + 0.5) / w) * Math.PI * 2;
      const [r, g, b, a = 255] = fn(cl * Math.cos(lon), sl, cl * Math.sin(lon), lat);
      const i = (y * w + x) * 4;
      data[i] = r; data[i + 1] = g; data[i + 2] = b; data[i + 3] = a;
    }
  }
  return { w, h, data };
}

const generators = {
  earthLand: ({ w }) =>
    equirect(w, w / 2, (x, y, z, lat) => {
      const e = fbm3(x * 1.6, y * 1.6, z * 1.6, 3, 6);
      const ice = smoothstep(1.2, 1.38, Math.abs(lat) + (fbm3(x * 4, y * 4, z * 4, 8, 3) - 0.5) * 0.25);
      let c;
      if (e < 0.54) {
        const depth = clamp01((0.54 - e) / 0.2);
        c = mixRgb([48, 128, 196], [8, 30, 100], smooth(depth));
        if (e > 0.515) c = mixRgb(c, [84, 168, 200], (e - 0.515) / 0.025);
      } else {
        const hgt = clamp01((e - 0.54) / 0.25);
        c = mixRgb([58, 128, 64], [164, 140, 84], clamp01(hgt * 1.8));
        c = mixRgb(c, [236, 236, 238], smoothstep(0.62, 0.9, hgt));
        c = mixRgb(c, [196, 176, 112], smoothstep(0.1, 0.3, Math.abs(Math.sin(lat * 1.4 + 1.3) * fbm3(x * 2, y * 2, z * 2, 41, 3))) * 0.45);
      }
      return mixRgb(c, [240, 246, 250], ice);
    }),

  earthClouds: ({ w }) =>
    equirect(w, w / 2, (x, y, z) => {
      const c = fbm3(x * 2.4, y * 2.4, z * 2.4, 91, 5);
      return [255, 255, 255, smoothstep(0.5, 0.74, c) * 215];
    }),

  saturn: () =>
    equirect(512, 256, (x, y, z, lat) => {
      const turb = fbm3(x * 3, y * 3, z * 3, 5, 4);
      const t = lat * 30 + turb * 4;
      const v = 0.5 + 0.5 * Math.sin(t);
      const w = 0.5 + 0.5 * Math.sin(lat * 9 + turb * 2);
      let c = mixRgb([188, 142, 88], [240, 218, 170], v * 0.8 + w * 0.2);
      c = mixRgb(c, [120, 84, 52], smoothstep(0.7, 0.95, turb) * 0.3);
      return c;
    }),

  mars: () =>
    equirect(512, 256, (x, y, z, lat) => {
      const e = fbm3(x * 2, y * 2, z * 2, 12, 5);
      let c = mixRgb([140, 62, 36], [214, 124, 72], e);
      c = mixRgb(c, [82, 36, 26], smoothstep(0.5, 0.35, fbm3(x * 1.2, y * 1.2, z * 1.2, 70, 3)) * 0.7);
      return mixRgb(c, [250, 246, 244], smoothstep(1.3, 1.42, Math.abs(lat)));
    }),

  moon: () =>
    equirect(512, 256, (x, y, z) => {
      const e = fbm3(x * 2.4, y * 2.4, z * 2.4, 4, 5);
      const g = 110 + e * 120;
      const maria = smoothstep(0.55, 0.4, fbm3(x * 1.1, y * 1.1, z * 1.1, 30, 3));
      const v = g * (1 - maria * 0.35);
      return [v, v, v * 1.02];
    }),

  nebula: ({ c1, c2, seed }) => {
    const n = 256;
    const data = new Uint8ClampedArray(n * n * 4);
    for (let y = 0; y < n; y++)
      for (let x = 0; x < n; x++) {
        const nx = x / n, ny = y / n;
        const d = Math.hypot(nx - 0.5, ny - 0.5) * 2;
        const f = fbm3(nx * 3.2, ny * 3.2, 0.5, seed, 5);
        const a = smoothstep(0.42, 0.78, f) * smoothstep(1, 0.25, d);
        const col = mixRgb(c1, c2, fbm3(nx * 2, ny * 2, 3.3, seed + 9, 3));
        const i = (y * n + x) * 4;
        data[i] = col[0]; data[i + 1] = col[1]; data[i + 2] = col[2]; data[i + 3] = a * 255;
      }
    return { w: n, h: n, data };
  },
};

export function generate(type, args = {}) {
  return generators[type](args);
}
