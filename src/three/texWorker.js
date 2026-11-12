import { generate } from "./texgen.js";

// Runs the heavy texture maths away from the page's main thread, so scrolling and animations stay smooth.
self.onmessage = (e) => {
  const { id, type, args } = e.data;
  const r = generate(type, args);
  self.postMessage({ id, w: r.w, h: r.h, data: r.data }, [r.data.buffer]);
};
