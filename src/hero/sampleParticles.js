// Turns the portrait photo into GPU-ready particle buffers.
// Particles sit on a jittered grid over the photo and each one takes the exact colour of the pixel
// under it, so the assembled cloud reads as the original image, just made of points. Near-black
// pixels (the backdrop) get no particle: on a black page they would be invisible anyway.

export const PORTRAIT_SRC = "/assets/samay-portrait.jpg";

// Brightness of the portrait on the page (photo and particles alike): 1 = as shot, lower = dimmer.
export const PHOTO_TONE = 0.8;

const BLACK = 0.055; // luminance below this is the photo's backdrop (measured ~0.035-0.045; the shirt is ~0.06)

function rng(seed) {
  let s = seed >>> 0 || 1;
  return () => {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    return (s >>> 0) / 4294967296;
  };
}

export function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Could not load ${src}`));
    img.src = src;
  });
}

// Fade toward the photo's frame so the shirt, cut off by the frame, melts into the page instead of
// ending in a straight edge. u, v: 0-1 with v = 0 at the top. Keep in sync with frameFade() in the shader.
const smooth = (a, b, x) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
const frameFade = (u, v) => smooth(0, 0.16, u) * smooth(0, 0.16, 1 - u) * smooth(0, 0.3, 1 - v) * smooth(0, 0.05, v);

const lumAt =(px, i) => (0.2126 * px[i] + 0.7152 * px[i + 1] + 0.0722 * px[i + 2]) / 255;

// Returns { count, aspect, home, scatter, color, data } where
//   home    vec3  position in portrait space (height 1, centred), z = depth from brightness
//   scatter vec3  where the particle travels when the portrait bursts (added to home)
//   color   vec3  the photo's colour at that point (0-1, sRGB)
//   data    vec4  seed, speed, brightness, size
export function sampleParticles(img, count, { seed = 7 } = {}) {
  const w = img.naturalWidth;
  const h = img.naturalHeight;
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d", { willReadFrequently: true });
  ctx.drawImage(img, 0, 0);
  const px = ctx.getImageData(0, 0, w, h).data;

  // Grid spacing so that roughly `count` cells land on visible (non-black) pixels.
  let visible = 0;
  for (let y = 0; y < h; y += 4) for (let x = 0; x < w; x += 4) if (lumAt(px, (y * w + x) * 4) >= BLACK) visible++;
  const visibleArea = visible * 16;
  const step = Math.max(1, Math.sqrt(visibleArea / count));

  const aspect = w / h;
  const r = rng(seed);
  const home = new Float32Array(count * 3);
  const scatter = new Float32Array(count * 3);
  const color = new Float32Array(count * 3);
  const data = new Float32Array(count * 4);

  let n = 0;
  for (let gy = 0; gy < h && n < count; gy += step) {
    for (let gx = 0; gx < w && n < count; gx += step) {
      const x = Math.min(w - 1, gx + r() * step);
      const y = Math.min(h - 1, gy + r() * step);
      const i = ((y | 0) * w + (x | 0)) * 4;
      const fade = frameFade(x / w, y / h);
      const v = lumAt(px, i) * fade;
      if (v < BLACK) continue;

      const ux = (x / w - 0.5) * aspect;
      const uy = 0.5 - y / h;
      const uz = (v - 0.35) * 0.06 + (r() - 0.5) * 0.012; // lit features sit slightly forward

      // Burst direction: outward from the centre with a strong random component, so no two
      // particles share a path. Some head for the edges, some toward the camera, some away.
      const ang = Math.atan2(uy - 0.05, ux) + (r() - 0.5) * 2.2;
      const reach = 0.5 + Math.pow(r(), 0.7) * 2.6;
      const depthRoll = r();
      const sz = depthRoll < 0.28 ? 0.6 + r() * 1.3 : depthRoll < 0.6 ? -(0.8 + r() * 3.2) : (r() - 0.5) * 0.8;

      home[n * 3] = ux;
      home[n * 3 + 1] = uy;
      home[n * 3 + 2] = uz;
      scatter[n * 3] = Math.cos(ang) * reach * (1.1 + r() * 0.6);
      scatter[n * 3 + 1] = Math.sin(ang) * reach * 0.8 + (r() - 0.35) * 0.6;
      scatter[n * 3 + 2] = sz;
      color[n * 3] = (px[i] / 255) * fade * PHOTO_TONE;
      color[n * 3 + 1] = (px[i + 1] / 255) * fade * PHOTO_TONE;
      color[n * 3 + 2] = (px[i + 2] / 255) * fade * PHOTO_TONE;
      data[n * 4] = r();
      data[n * 4 + 1] = 0.65 + r() * 0.7;
      data[n * 4 + 2] = v;
      data[n * 4 + 3] = 0.95 + r() * 0.2; // even size, so the image reads like the photo
      n++;
    }
  }

  return {
    count: n,
    aspect,
    step,
    height: h,
    home: home.subarray(0, n * 3),
    scatter: scatter.subarray(0, n * 3),
    color: color.subarray(0, n * 3),
    data: data.subarray(0, n * 4),
  };
}
