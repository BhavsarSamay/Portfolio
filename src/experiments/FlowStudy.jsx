import { useCanvasLoop } from "../lib/useCanvasLoop";

// Particles ride a trigonometric flow field and leave trails. The pointer bends the field;
// pressing seeds a fresh set of particles.
export default function FlowStudy({ paused }) {
  const ref = useCanvasLoop({
    paused,
    setup(s, ctx) {
      const n = s.w < 500 ? 380 : 700;
      const seed = () => Array.from({ length: n }, () => ({ x: Math.random() * s.w, y: Math.random() * s.h }));
      s.data.p = seed();
      s.data.onDown = () => {
        s.data.p = seed();
        ctx.fillStyle = "#111";
        ctx.fillRect(0, 0, s.w, s.h);
      };
      ctx.fillStyle = "#111";
      ctx.fillRect(0, 0, s.w, s.h);
    },
    draw(ctx, s) {
      const { p } = s.data, t = s.t * 0.25, sc = 0.004;
      ctx.fillStyle = "rgba(17,17,17,0.08)";
      ctx.fillRect(0, 0, s.w, s.h);
      ctx.lineWidth = 1.2;
      ctx.strokeStyle = "#C7FF3D";
      ctx.beginPath();
      for (const q of p) {
        let ang = Math.sin(q.x * sc + t) * 2 + Math.cos(q.y * sc * 1.3 - t) * 2;
        if (s.pointer.in) {
          const dx = q.x - s.pointer.x, dy = q.y - s.pointer.y, d = Math.hypot(dx, dy);
          if (d < 160) ang += Math.atan2(dy, dx) * (1 - d / 160) + (1 - d / 160) * 2;
        }
        const nx = q.x + Math.cos(ang) * 1.6, ny = q.y + Math.sin(ang) * 1.6;
        ctx.moveTo(q.x, q.y);
        ctx.lineTo(nx, ny);
        q.x = nx;
        q.y = ny;
        if (q.x < 0 || q.x > s.w || q.y < 0 || q.y > s.h) {
          q.x = Math.random() * s.w;
          q.y = Math.random() * s.h;
        }
      }
      ctx.stroke();
    },
  });
  return <canvas ref={ref} className="exp__canvas" role="img" aria-label="Particles flowing along a field that bends around the pointer" />;
}
