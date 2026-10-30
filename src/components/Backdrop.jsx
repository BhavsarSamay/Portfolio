import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "../lib/motion";
import { getTheme } from "../lib/theme";

// A quiet journey through space behind the page. Scrolling moves a camera forward through a star
// tunnel past recognisable bodies: a ringed gas giant, the Moon, a spiral galaxy, an asteroid field,
// a wormhole, a sun, and Earth with the International Space Station in orbit. They sit toward the
// edges so they frame the content. The same coloured scene is used in both themes; dark mode adds
// light (glow), light mode adds soft shading and a fine outline.

const F = 720; // focal length
const WORLD = 640; // lateral world scale
const FAR = 3200;
const NEAR = 80;
const DEPTH = 3400; // star tunnel length

// z = distance along the journey. x / y = lateral offset (-1 to 1). r = world radius.
const objects = [
  { type: "saturn", z: 1500, x: 0.84, y: -0.26, r: 190 },
  { type: "mars", z: 2000, x: -0.93, y: -0.4, r: 110 },
  { type: "nebula", z: 2600, x: -0.35, y: 0.1, r: 720, dark: [[120, 110, 255], [60, 190, 215]], light: [[255, 140, 185], [110, 170, 255]] },
  { type: "moon", z: 3500, x: -0.86, y: 0.3, r: 140 },
  { type: "galaxy", z: 4600, x: 0.7, y: -0.2, r: 400 },
  { type: "asteroids", z: 5400, x: 0.72, y: 0.2, r: 380 },
  { type: "wormhole", z: 6300, x: 0, y: 0, r: 300 },
  { type: "sun", z: 7200, x: -0.78, y: -0.3, r: 130 },
  { type: "earth", z: 8200, x: 0.74, y: 0.34, r: 240 },
  { type: "nebula", z: 9100, x: 0.3, y: -0.1, r: 760, dark: [[255, 150, 90], [150, 110, 255]], light: [[255, 175, 120], [140, 120, 255]] },
  { type: "wormhole", z: 10100, x: 0, y: 0, r: 320 },
];
const Z_TOTAL = 10500;

const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

// Deterministic pseudo-random so shapes stay the same between sessions.
const rng = (seed) => () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;

// Continents and clouds as clusters of blobs on a sphere (longitude, latitude, size).
const earthRand = rng(7);
const land = Array.from({ length: 7 }, () => {
  const lon = earthRand() * 6.283, lat = (earthRand() - 0.5) * 1.6;
  return Array.from({ length: 5 }, () => ({ lon: lon + (earthRand() - 0.5) * 0.7, lat: lat + (earthRand() - 0.5) * 0.45, s: 0.1 + earthRand() * 0.14 }));
}).flat();
const clouds = Array.from({ length: 16 }, () => ({ lon: earthRand() * 6.283, lat: (earthRand() - 0.5) * 2.2, s: 0.07 + earthRand() * 0.11 }));

// Asteroids: irregular polygons with their own spin.
const aRand = rng(21);
const rocks = Array.from({ length: 17 }, () => ({
  x: (aRand() - 0.5) * 2, y: (aRand() - 0.5) * 1.1, s: 0.035 + aRand() * 0.07, rot: aRand() * 6.28, spin: (aRand() - 0.5) * 0.4,
  poly: Array.from({ length: 9 }, () => 0.7 + aRand() * 0.45),
}));

export default function Backdrop() {
  const ref = useRef(null);

  useEffect(() => {
    const cv = ref.current;
    const ctx = cv.getContext("2d");
    const reduced = prefersReducedMotion();
    const small = window.matchMedia("(max-width: 700px)").matches;
    let w = 0, h = 0, raf = 0;
    let cam = 0, camPrev = 0, t = 0, last = performance.now();
    let objFade = 0; // bodies fade in once the hero is scrolled past, so the first screen stays clean
    const ptr = { x: 0, y: 0, tx: 0, ty: 0 };

    // Stars live in a tunnel that wraps around the camera, so the field never runs out.
    const stars = Array.from({ length: small ? 240 : 480 }, () => ({
      x: (Math.random() * 2 - 1) * 1.6, y: (Math.random() * 2 - 1) * 1.6,
      z: Math.random() * DEPTH, s: 0.5 + Math.random() * 0.9, tint: Math.random(),
    }));

    // Galaxy: points on three spiral arms, created once.
    const galaxy = Array.from({ length: small ? 260 : 520 }, (_, i) => {
      const r = Math.pow(Math.random(), 0.75);
      const ang = (i % 3) * ((Math.PI * 2) / 3) + r * 5.2 + (Math.random() - 0.5) * 0.45 * (0.3 + r);
      return { x: Math.cos(ang) * r, y: Math.sin(ang) * r * 0.5, b: 0.3 + Math.random() * 0.7, core: r < 0.2 };
    });

    const size = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      cv.width = w;
      cv.height = h;
    };
    const scrollProgress = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      return max > 0 ? clamp(window.scrollY / max, 0, 1) : 0;
    };

    // ----- drawing helpers -----
    const glow = (x, y, r, c, a) => {
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, rgba(c, a));
      g.addColorStop(1, rgba(c, 0));
      ctx.fillStyle = g;
      ctx.fillRect(x - r, y - r, r * 2, r * 2);
    };
    const halo = (x, y, r, c, a) => {
      // Soft atmosphere just outside the limb. Drawn before the body so the body covers its centre.
      const g = ctx.createRadialGradient(x, y, r * 0.94, x, y, r * 1.28);
      g.addColorStop(0, rgba(c, 0.5 * a));
      g.addColorStop(1, rgba(c, 0));
      ctx.fillStyle = g;
      ctx.fillRect(x - r * 1.3, y - r * 1.3, r * 2.6, r * 2.6);
    };
    // Lit sphere: light from the upper left, dark terminator toward the lower right.
    const ball = (x, y, r, pal, a, L) => {
      const g = ctx.createRadialGradient(x - r * 0.38, y - r * 0.38, r * 0.05, x, y, r * 1.02);
      g.addColorStop(0, rgba(pal.l, a));
      g.addColorStop(0.5, rgba(pal.b, a));
      g.addColorStop(1, rgba(pal.d, a));
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, 6.283);
      ctx.fill();
      if (L) {
        ctx.strokeStyle = `rgba(8,8,8,${0.2 * a})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    };
    const bands = (x, y, r, color, n, a) => {
      ctx.save();
      ctx.beginPath();
      ctx.arc(x, y, r, 0, 6.283);
      ctx.clip();
      for (let i = 0; i < n; i++) {
        const by = y - r + ((i + 0.5) / n) * r * 2;
        ctx.fillStyle = rgba(color, (i % 2 ? 0.3 : 0.16) * a);
        ctx.fillRect(x - r, by - r * 0.04, r * 2, r * (i % 3 ? 0.06 : 0.1));
      }
      ctx.restore();
    };
    const ringsOf = (x, y, r, c, a, back, tilt) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(tilt);
      ctx.scale(1, 0.26);
      for (let k = 0; k < 5; k++) {
        const rr = r * (1.38 + k * 0.15);
        ctx.lineWidth = Math.max(1, r * (k === 2 ? 0.02 : 0.045));
        ctx.strokeStyle = rgba(c, (k === 2 ? 0.2 : 0.55 - k * 0.07) * a);
        ctx.beginPath();
        if (back) ctx.arc(0, 0, rr, Math.PI, Math.PI * 2);
        else ctx.arc(0, 0, rr, 0, Math.PI);
        ctx.stroke();
      }
      ctx.restore();
    };

    const iss = (x, y, s, ang, a, L) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(ang);
      const metal = L ? `rgba(70,76,92,${a})` : `rgba(225,228,235,${a})`;
      const panel = `rgba(${L ? "196,140,40" : "232,184,80"},${a})`;
      ctx.fillStyle = metal;
      ctx.fillRect(-s, -s * 0.04, s * 2, s * 0.08); // truss
      ctx.fillRect(-s * 0.2, -s * 0.1, s * 0.4, s * 0.2); // modules
      ctx.fillStyle = panel;
      [-0.78, -0.5, 0.5, 0.78].forEach((px) => {
        ctx.fillRect(s * px - s * 0.08, -s * 0.55, s * 0.16, s * 0.4);
        ctx.fillRect(s * px - s * 0.08, s * 0.15, s * 0.16, s * 0.4);
      });
      ctx.restore();
    };

    const draw = (o, d, L) => {
      // True perspective: a body appears small near the centre of the view and sweeps outward toward
      // the corners as the camera approaches, then fades once it has passed.
      const sc = F / d;
      const cx = w / 2 + ptr.x * 12 * sc + o.x * WORLD * sc;
      const cy = h / 2 + ptr.y * 8 * sc + o.y * WORLD * sc;
      const r = o.r * sc;
      if (r < 1.2) return;
      let a = clamp((FAR - d) / 1300, 0, 1) * clamp((d - NEAR) / 260, 0, 1);
      if (cx + r * 2.4 < -50 || cx - r * 2.4 > w + 50 || cy + r * 2.4 < -50 || cy - r * 2.4 > h + 50) return;
      a *= (L ? 0.52 : 0.5) * objFade;

      switch (o.type) {
        case "saturn": {
          const pal = { l: [250, 232, 190], b: [216, 176, 108], d: [92, 62, 38] };
          const ringC = L ? [160, 120, 62] : [236, 208, 156];
          ringsOf(cx, cy, r, ringC, a, true, -0.38);
          halo(cx, cy, r, [255, 220, 160], a * 0.5);
          ball(cx, cy, r, pal, a, L);
          bands(cx, cy, r, [120, 80, 40], 9, a);
          ringsOf(cx, cy, r, ringC, a, false, -0.38);
          break;
        }
        case "mars": {
          const pal = { l: [244, 176, 134], b: [198, 98, 58], d: [66, 28, 22] };
          halo(cx, cy, r, [255, 150, 100], a * 0.45);
          ball(cx, cy, r, pal, a, L);
          ctx.save();
          ctx.beginPath();
          ctx.arc(cx, cy, r, 0, 6.283);
          ctx.clip();
          ctx.fillStyle = `rgba(92,40,30,${0.3 * a})`; // dark volcanic plains
          [[-0.2, 0.1, 0.42, 0.18], [0.3, 0.38, 0.28, 0.12], [-0.4, -0.2, 0.22, 0.1]].forEach(([dx, dy, rx, ry]) => {
            ctx.beginPath();
            ctx.ellipse(cx + dx * r, cy + dy * r, rx * r, ry * r, -0.3, 0, 6.283);
            ctx.fill();
          });
          ctx.fillStyle = `rgba(255,250,246,${0.85 * a})`; // polar cap
          ctx.beginPath();
          ctx.ellipse(cx - r * 0.05, cy - r * 0.96, r * 0.34, r * 0.17, 0, 0, 6.283);
          ctx.fill();
          ctx.restore();
          break;
        }
        case "moon": {
          const pal = { l: [238, 238, 234], b: [178, 178, 176], d: [62, 62, 68] };
          halo(cx, cy, r, [220, 225, 240], a * 0.4);
          ball(cx, cy, r, pal, a, L);
          ctx.save();
          ctx.beginPath();
          ctx.arc(cx, cy, r, 0, 6.283);
          ctx.clip();
          ctx.fillStyle = `rgba(70,72,80,${0.28 * a})`; // maria
          [[-0.25, -0.15, 0.34, 0.24], [0.2, 0.2, 0.26, 0.2], [0.05, -0.45, 0.2, 0.14]].forEach(([dx, dy, rx, ry]) => {
            ctx.beginPath();
            ctx.ellipse(cx + dx * r, cy + dy * r, rx * r, ry * r, 0.4, 0, 6.283);
            ctx.fill();
          });
          [[-0.45, 0.3, 0.1], [0.4, -0.2, 0.08], [0.3, 0.5, 0.12], [-0.1, 0.55, 0.07], [0.55, 0.1, 0.06]].forEach(([dx, dy, k]) => {
            ctx.strokeStyle = `rgba(50,52,60,${0.35 * a})`;
            ctx.lineWidth = Math.max(1, r * 0.012);
            ctx.beginPath();
            ctx.arc(cx + dx * r, cy + dy * r, k * r, 0, 6.283);
            ctx.stroke();
          });
          ctx.restore();
          break;
        }
        case "earth": {
          const pal = { l: [120, 185, 250], b: [32, 96, 200], d: [6, 22, 70] };
          halo(cx, cy, r, [120, 190, 255], a);
          ball(cx, cy, r, pal, a, L);
          ctx.save();
          ctx.beginPath();
          ctx.arc(cx, cy, r, 0, 6.283);
          ctx.clip();
          const spin = t * 0.05;
          const blob = (lon, lat, s, fill) => {
            const c = Math.cos(lon);
            if (c <= 0.05) return;
            ctx.fillStyle = fill;
            ctx.beginPath();
            ctx.ellipse(cx + r * Math.cos(lat) * Math.sin(lon), cy - r * Math.sin(lat), s * r * c, s * r, 0, 0, 6.283);
            ctx.fill();
          };
          for (const b of land) blob(b.lon + spin, b.lat, b.s, `rgba(${(b.lat * 7 + 8) % 2 > 1 ? "176,160,96" : "74,142,78"},${0.92 * a})`);
          for (const b of clouds) blob(b.lon + spin * 1.5, b.lat, b.s, `rgba(255,255,255,${0.34 * a})`);
          const sh = ctx.createRadialGradient(cx - r * 0.4, cy - r * 0.4, r * 0.3, cx, cy, r * 1.05);
          sh.addColorStop(0, "rgba(0,0,0,0)");
          sh.addColorStop(1, `rgba(0,6,30,${0.6 * a})`);
          ctx.fillStyle = sh;
          ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
          ctx.restore();

          // The ISS circles the planet; the far half of its orbit passes behind Earth.
          const ang = t * 0.4, tilt = -0.35;
          const ox = Math.cos(ang) * r * 1.75, oy = Math.sin(ang) * r * 0.46;
          const px = cx + ox * Math.cos(tilt) - oy * Math.sin(tilt), py = cy + ox * Math.sin(tilt) + oy * Math.cos(tilt);
          ctx.save();
          ctx.translate(cx, cy);
          ctx.rotate(tilt);
          ctx.strokeStyle = L ? `rgba(8,8,8,${0.16 * a})` : `rgba(255,255,255,${0.14 * a})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.ellipse(0, 0, r * 1.75, r * 0.46, 0, 0, 6.283);
          ctx.stroke();
          ctx.restore();
          if (Math.sin(ang) >= 0) iss(px, py, Math.max(4, r * 0.13), tilt + 0.1, a, L);
          break;
        }
        case "sun": {
          if (L) {
            glow(cx, cy, r * 2.6, [255, 190, 90], 0.4 * a);
            const g = ctx.createRadialGradient(cx - r * 0.2, cy - r * 0.2, 0, cx, cy, r * 0.8);
            g.addColorStop(0, rgba([255, 240, 190], a));
            g.addColorStop(1, rgba([255, 150, 40], a));
            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.arc(cx, cy, r * 0.8, 0, 6.283);
            ctx.fill();
          } else {
            ctx.globalCompositeOperation = "lighter";
            glow(cx, cy, r * 3, [255, 170, 80], 0.22 * a);
            glow(cx, cy, r * 1.1, [255, 225, 170], 0.7 * a);
            ctx.globalCompositeOperation = "source-over";
          }
          break;
        }
        case "asteroids":
          for (const k of rocks) {
            const rr = k.s * r * 1.9;
            const rx = cx + k.x * r, ry = cy + k.y * r;
            ctx.save();
            ctx.translate(rx, ry);
            ctx.rotate(k.rot + t * k.spin);
            ctx.beginPath();
            k.poly.forEach((m, i) => {
              const ang = (i / k.poly.length) * 6.283;
              ctx.lineTo(Math.cos(ang) * rr * m, Math.sin(ang) * rr * m * 0.85);
            });
            ctx.closePath();
            const g = ctx.createLinearGradient(-rr, -rr, rr, rr);
            g.addColorStop(0, rgba(L ? [170, 150, 126] : [176, 164, 150], 0.95 * a));
            g.addColorStop(1, rgba(L ? [96, 82, 70] : [60, 54, 52], 0.95 * a));
            ctx.fillStyle = g;
            ctx.fill();
            if (L) {
              ctx.strokeStyle = `rgba(8,8,8,${0.25 * a})`;
              ctx.lineWidth = 1;
              ctx.stroke();
            }
            ctx.restore();
          }
          break;
        case "nebula": {
          const cols = L ? o.light : o.dark;
          if (!L) ctx.globalCompositeOperation = "lighter";
          cols.forEach((c, i) => {
            const ang = t * 0.035 + i * 2.6;
            glow(cx + Math.cos(ang) * r * 0.3, cy + Math.sin(ang * 1.2) * r * 0.22, r * (0.85 - i * 0.15), c, (L ? 0.2 : 0.1) * a);
          });
          ctx.globalCompositeOperation = "source-over";
          break;
        }
        case "galaxy": {
          ctx.save();
          ctx.translate(cx, cy);
          ctx.rotate(-0.4 + t * 0.025);
          if (!L) {
            ctx.globalCompositeOperation = "lighter";
            glow(0, 0, r * 0.35, [255, 232, 200], 0.3 * a);
          } else {
            glow(0, 0, r * 0.3, [255, 190, 110], 0.3 * a);
          }
          const px = Math.max(1, r * 0.006);
          for (const p of galaxy) {
            const col = p.core ? (L ? [220, 140, 40] : [255, 230, 190]) : L ? [92, 96, 210] : [170, 190, 255];
            ctx.fillStyle = rgba(col, (L ? 0.7 : 0.6) * p.b * a);
            ctx.fillRect(p.x * r, p.y * r, px, px);
          }
          ctx.restore();
          break;
        }
        case "wormhole": {
          // Thin rings expand outward and fade, so passing through feels like the scene opening up.
          const c = L ? (o.z < 8000 ? [90, 140, 0] : [40, 100, 200]) : o.z < 8000 ? [199, 255, 61] : [140, 210, 255];
          ctx.save();
          ctx.translate(cx, cy);
          for (let i = 0; i < 12; i++) {
            const p = (i / 12 + t * 0.09) % 1;
            const rr = r * (0.1 + p * p * 3);
            ctx.lineWidth = 1.1;
            ctx.strokeStyle = rgba(c, (1 - p) * (L ? 0.45 : 0.34) * a);
            ctx.beginPath();
            ctx.ellipse(0, 0, rr, rr * 0.93, 0.3, 0, 6.283);
            ctx.stroke();
          }
          if (!L) {
            ctx.globalCompositeOperation = "lighter";
            glow(0, 0, r * 0.5, c, 0.1 * a);
            ctx.globalCompositeOperation = "source-over";
          }
          ctx.restore();
          break;
        }
        default:
      }
    };

    // Occasional human-made visitors, small and faint, kept to the screen edges so text stays clear.
    const rocketAt = (x, y, tilt, s, a, L, burn) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(tilt);
      // flame
      const fl = s * (1.1 + Math.sin(t * 40) * 0.12 + burn * 0.6);
      const g = ctx.createLinearGradient(0, s * 0.5, 0, s * 0.5 + fl);
      g.addColorStop(0, `rgba(255,236,170,${0.95 * a})`);
      g.addColorStop(0.5, `rgba(255,140,50,${0.7 * a})`);
      g.addColorStop(1, "rgba(255,90,30,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.moveTo(-s * 0.16, s * 0.5);
      ctx.lineTo(s * 0.16, s * 0.5);
      ctx.lineTo(0, s * 0.5 + fl);
      ctx.fill();
      // fins
      ctx.fillStyle = `rgba(214,60,52,${a})`;
      ctx.beginPath();
      ctx.moveTo(-s * 0.18, s * 0.1); ctx.lineTo(-s * 0.4, s * 0.52); ctx.lineTo(-s * 0.18, s * 0.42); ctx.fill();
      ctx.beginPath();
      ctx.moveTo(s * 0.18, s * 0.1); ctx.lineTo(s * 0.4, s * 0.52); ctx.lineTo(s * 0.18, s * 0.42); ctx.fill();
      // body + nose
      ctx.fillStyle = L ? `rgba(250,248,244,${a})` : `rgba(240,242,248,${a})`;
      ctx.beginPath();
      ctx.moveTo(-s * 0.18, s * 0.5);
      ctx.lineTo(-s * 0.18, -s * 0.2);
      ctx.quadraticCurveTo(0, -s * 0.78, s * 0.18, -s * 0.2);
      ctx.lineTo(s * 0.18, s * 0.5);
      ctx.closePath();
      ctx.fill();
      if (L) {
        ctx.strokeStyle = `rgba(8,8,8,${0.25 * a})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      ctx.fillStyle = `rgba(214,60,52,${a})`;
      ctx.beginPath();
      ctx.moveTo(-s * 0.18, -s * 0.2);
      ctx.quadraticCurveTo(0, -s * 0.78, s * 0.18, -s * 0.2);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = `rgba(60,110,200,${a})`;
      ctx.beginPath();
      ctx.arc(0, s * 0.05, s * 0.08, 0, 6.283);
      ctx.fill();
      ctx.restore();
    };

    const shuttleAt = (x, y, tilt, s, a, L, dir) => {
      ctx.save();
      ctx.translate(x, y);
      if (dir < 0) ctx.scale(-1, 1);
      ctx.rotate(tilt);
      const dark = `rgba(${L ? "40,44,56" : "58,62,76"},${a})`;
      const white = `rgba(${L ? "252,250,246" : "238,240,246"},${a})`;
      // tail fin and delta wing
      ctx.fillStyle = white;
      ctx.beginPath();
      ctx.moveTo(-s * 0.5, -s * 0.07); ctx.lineTo(-s * 0.36, -s * 0.07); ctx.lineTo(-s * 0.44, -s * 0.24); ctx.lineTo(-s * 0.54, -s * 0.24);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = dark;
      ctx.beginPath();
      ctx.moveTo(-s * 0.46, s * 0.05); ctx.lineTo(s * 0.12, s * 0.05); ctx.lineTo(-s * 0.5, s * 0.24);
      ctx.closePath(); ctx.fill();
      // fuselage, white top and dark belly
      ctx.fillStyle = white;
      ctx.beginPath();
      ctx.moveTo(-s * 0.5, -s * 0.07); ctx.lineTo(s * 0.26, -s * 0.07); ctx.quadraticCurveTo(s * 0.52, -s * 0.02, s * 0.5, s * 0.02);
      ctx.lineTo(-s * 0.5, s * 0.02);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = dark;
      ctx.beginPath();
      ctx.moveTo(-s * 0.5, s * 0.02); ctx.lineTo(s * 0.5, s * 0.02); ctx.quadraticCurveTo(s * 0.4, s * 0.08, s * 0.2, s * 0.08);
      ctx.lineTo(-s * 0.5, s * 0.08);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = `rgba(${L ? "60,100,190" : "120,170,240"},${a})`;
      ctx.fillRect(s * 0.3, -s * 0.045, s * 0.09, s * 0.03); // cockpit window
      if (L) {
        ctx.strokeStyle = `rgba(8,8,8,${0.2 * a})`;
        ctx.lineWidth = 1;
        ctx.strokeRect(-s * 0.5, -s * 0.07, s, s * 0.15);
      }
      ctx.restore();
    };

    const flights = (L) => {
      // Rocket launch: every ~40 s, climbs along a side margin, accelerating, with a fading smoke trail.
      const RP = 40, RD = 11;
      const rt = (t + 25) % RP;
      if (rt < RD) {
        const side = Math.floor((t + 25) / RP) % 2 ? 0.965 : 0.035;
        const pos = (p) => ({ x: w * side + Math.sin(p * 3.2) * 5 + p * p * (side < 0.5 ? 22 : -22), y: h * 1.08 - h * 1.22 * Math.pow(p, 1.7) });
        const p = rt / RD;
        const fade = Math.min(1, p * 8, (1 - p) * 4) * (L ? 0.7 : 0.62);
        for (let k = 22; k >= 1; k--) {
          const q = p - k * 0.014;
          if (q < 0) continue;
          const sp = pos(q);
          ctx.fillStyle = L ? `rgba(120,124,140,${0.2 * fade * (1 - k / 24)})` : `rgba(210,220,240,${0.2 * fade * (1 - k / 24)})`;
          ctx.beginPath();
          ctx.arc(sp.x, sp.y + 14, 2 + k * 0.45, 0, 6.283);
          ctx.fill();
        }
        const rp = pos(p);
        rocketAt(rp.x, rp.y, side < 0.5 ? 0.1 : -0.1, small ? 22 : 30, fade, L, p);
      }
      // Space shuttle: every ~60 s, glides slowly across the very top of the screen.
      const SP = 60, SD = 22;
      const st = (t + 30) % SP;
      if (st < SD) {
        const p = st / SD;
        const fade = Math.min(1, p * 6, (1 - p) * 6) * (L ? 0.5 : 0.42);
        const dir = Math.floor((t + 30) / SP) % 2 ? -1 : 1;
        const x = dir > 0 ? -80 + (w + 160) * p : w + 80 - (w + 160) * p;
        shuttleAt(x, h * 0.125 + p * h * 0.04, 0.08, small ? 40 : 64, fade, L, dir);
      }
    };

    const frame = (now) => {
      raf = 0;
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      t += dt;
      const L = getTheme() === "light";

      // Camera follows scroll with a soft lag, plus a slow idle drift so space is never frozen.
      cam += (scrollProgress() * Z_TOTAL - cam) * 0.06;
      const vel = cam - camPrev;
      camPrev = cam;
      const camZ = cam + t * 6;
      objFade = clamp((window.scrollY - window.innerHeight * 0.35) / (window.innerHeight * 0.6), 0, 1);
      ptr.x += (ptr.tx - ptr.x) * 0.05;
      ptr.y += (ptr.ty - ptr.y) * 0.05;

      ctx.clearRect(0, 0, w, h);

      // Stars; short soft streaks only while the camera is moving quickly.
      const streak = clamp(Math.abs(vel) * 1.1, 0, 60);
      for (const s of stars) {
        const d = ((((s.z - camZ) % DEPTH) + DEPTH) % DEPTH) + 1;
        const sc = F / d;
        const sx = w / 2 + s.x * WORLD * sc + ptr.x * 8 * sc;
        const sy = h / 2 + s.y * WORLD * sc + ptr.y * 6 * sc;
        if (sx < -20 || sx > w + 20 || sy < -20 || sy > h + 20) continue;
        const a = clamp(1 - d / DEPTH, 0, 1) * (L ? 0.6 : 0.8);
        const px = clamp(s.s * sc * 0.8, 0.4, 2.2);
        const col = L
          ? s.tint > 0.82 ? "214,110,40" : s.tint < 0.25 ? "50,80,190" : "8,8,8"
          : s.tint > 0.88 ? "255,214,170" : s.tint < 0.12 ? "170,200,255" : "255,255,255";
        if (streak > 3) {
          const sc2 = F / (d + (vel > 0 ? 1 : -1) * streak);
          ctx.strokeStyle = `rgba(${col},${a * 0.5})`;
          ctx.lineWidth = px * 0.8;
          ctx.beginPath();
          ctx.moveTo(sx, sy);
          ctx.lineTo(w / 2 + s.x * WORLD * sc2, h / 2 + s.y * WORLD * sc2);
          ctx.stroke();
        } else {
          ctx.fillStyle = `rgba(${col},${a})`;
          ctx.fillRect(sx, sy, px, px);
        }
      }

      // Celestial bodies, farthest first.
      const vis = [];
      for (const o of objects) {
        const d = o.z - camZ;
        if (d > NEAR && d < FAR) vis.push([d, o]);
      }
      vis.sort((a, b) => b[0] - a[0]);
      for (const [d, o] of vis) draw(o, d, L);

      if (!reduced) flights(L);

      if (!reduced && !document.hidden) raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (!raf) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    };
    const move = (e) => {
      ptr.tx = e.clientX / w - 0.5;
      ptr.ty = e.clientY / h - 0.5;
    };
    const onResize = () => {
      size();
      if (reduced) frame(performance.now());
    };
    const onTheme = () => {
      if (reduced) frame(performance.now());
    };
    const onVis = () => {
      if (!document.hidden && !reduced) start();
    };

    // Dev only (removed from production builds): jump the scene clock to preview timed events.
    if (import.meta.env.DEV) window.__spaceSet = (v) => { t = v; };

    size();
    cam = camPrev = scrollProgress() * Z_TOTAL;
    if (reduced) frame(performance.now());
    else start();
    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("themechange", onTheme);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("themechange", onTheme);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <div className="backdrop" aria-hidden="true">
      <canvas ref={ref} />
      <div className="guides"><i /><i /><i /></div>
    </div>
  );
}
