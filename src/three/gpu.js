// Decides how much 3D this device should get.
//   0 = none (use the lightweight 2D scene)
//   1 = reduced (fewer particles, no antialiasing)
//   2 = full
// Override with ?3d=off, ?3d=low or ?3d=high in the URL for testing.
export function webglTier() {
  if (typeof window === "undefined") return 0;
  const q = new URLSearchParams(window.location.search).get("3d");
  if (q === "off") return 0;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches && q !== "high") return 0;

  try {
    const c = document.createElement("canvas");
    if (!c.getContext("webgl2")) return 0;
  } catch {
    return 0;
  }
  if (q === "low") return 1;
  if (q === "high") return 2;

  const mobile = window.matchMedia("(max-width: 700px)").matches || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  const cores = navigator.hardwareConcurrency || 4;
  const mem = navigator.deviceMemory || 4;
  if (mobile) return cores >= 6 && mem >= 4 ? 1 : 0;
  return cores >= 8 && mem >= 4 ? 2 : 1;
}
