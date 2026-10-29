import { useCanvasLoop } from "../lib/useCanvasLoop";

// Dot grid with spring physics. Dots lean toward the pointer and grow near it.
// Pressing launches a ripple that travels across the grid.
export default function GridStudy({ paused }) {
  const ref = useCanvasLoop({
    paused,
    setup(s) {
      const gap = s.w < 500 ? 26 : 30;
      const cols = Math.ceil(s.w / gap) + 1, rows = Math.ceil(s.h / gap) + 1;
      const dots = [];
      for (let r = 0; r < rows; r++)
        for (let c = 0; c < cols; c++) dots.push({ hx: c * gap, hy: r * gap, x: c * gap, y: r * gap, vx: 0, vy: 0 });
      s.data.dots = dots;
      s.data.ripples = [];
      s.data.onDown = () => s.data.ripples.push({ x: s.pointer.x, y: s.pointer.y, r: 0 });
    },
    draw(ctx, s) {
      const { dots, ripples } = s.data, R = 130;
      ctx.fillStyle = "#111";
      ctx.fillRect(0, 0, s.w, s.h);
      for (const rp of ripples) rp.r += 6;
      while (ripples.length && ripples[0].r > Math.hypot(s.w, s.h)) ripples.shift();

      for (const d of dots) {
        let fx = (d.hx - d.x) * 0.1, fy = (d.hy - d.y) * 0.1, grow = 0;
        if (s.pointer.in) {
          const dx = s.pointer.x - d.hx, dy = s.pointer.y - d.hy, dist = Math.hypot(dx, dy);
          if (dist < R) {
            const k = 1 - dist / R;
            fx += dx * k * 0.22;
            fy += dy * k * 0.22;
            grow = k;
          }
        }
        for (const rp of ripples) {
          const dist = Math.hypot(d.hx - rp.x, d.hy - rp.y), off = dist - rp.r;
          if (Math.abs(off) < 40) {
            const k = Math.cos((off / 40) * 1.57);
            fx += ((d.hx - rp.x) / (dist || 1)) * k * 3;
            fy += ((d.hy - rp.y) / (dist || 1)) * k * 3;
            grow = Math.max(grow, k);
          }
        }
        d.vx = (d.vx + fx) * 0.78;
        d.vy = (d.vy + fy) * 0.78;
        d.x += d.vx;
        d.y += d.vy;
        ctx.fillStyle = grow > 0.15 ? "#C7FF3D" : "#F3F0E8";
        ctx.globalAlpha = 0.35 + grow * 0.65;
        ctx.beginPath();
        ctx.arc(d.x, d.y, 1.6 + grow * 4.2, 0, 6.283);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    },
  });
  return <canvas ref={ref} className="exp__canvas" role="img" aria-label="A grid of dots that lean toward the pointer and ripple on click" />;
}
