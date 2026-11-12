// Plain mutable state shared between the DOM (scroll, pointer) and the WebGL scene.
// The scene reads it every frame, so it must not trigger React renders.
export const TOTAL = 470; // length of the camera path in world units

export const scene3d = {
  progress: 0, // 0..1 along the page
  heroT: 0, // 0..1 while the hero scrolls away
  objFade: 0, // celestial bodies fade in after the hero
  scrollY: 0,
  maxScroll: 1,
  vh: 800,
  pointer: { x: 0, y: 0 }, // -0.5..0.5
  camZ: 0,
  camSpeed: 0,
  warp: 0, // impulse that stretches stars and widens the lens (case-study dive)
  zoomDir: 1,
};

export const kickWarp = (dir = 1) => {
  scene3d.warp = 1;
  scene3d.zoomDir = dir;
};

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

// Called from a few DOM events; cheap enough to run on every scroll.
export function syncScroll() {
  const doc = document.documentElement;
  scene3d.vh = window.innerHeight;
  scene3d.scrollY = window.scrollY;
  scene3d.maxScroll = Math.max(1, doc.scrollHeight - window.innerHeight);
  scene3d.progress = clamp(scene3d.scrollY / scene3d.maxScroll, 0, 1);
  scene3d.heroT = clamp(scene3d.scrollY / scene3d.vh, 0, 1);
  scene3d.objFade = clamp((scene3d.scrollY - scene3d.vh * 0.35) / (scene3d.vh * 0.6), 0, 1);
}
