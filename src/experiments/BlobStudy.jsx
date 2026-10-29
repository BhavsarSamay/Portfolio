import { useCanvasLoop } from "../lib/useCanvasLoop";

// A soft body: radii of a closed curve are driven by layered sines. The pointer pulls the
// centre and swells the amplitude; pressing sends a pulse through the surface.
const N = 14;

export default function BlobStudy({ paused }) {
  const ref = useCanvasLoop({
    paused,
    setup(s) {
      s.data.c = { x: s.w / 2, y: s.h / 2 };
      s.data.amp = 0.12;
      s.data.pulse = 0;
      s.data.onDown = () => (s.data.pulse = 1);
    },
    draw(ctx, s) {
      const d = s.data, base = Math.min(s.w, s.h) * 0.27;
      const tx = s.pointer.in ? s.w / 2 + (s.pointer.x - s.w / 2) * 0.35 : s.w / 2;
      const ty = s.pointer.in ? s.h / 2 + (s.pointer.y - s.h / 2) * 0.35 : s.h / 2;
      d.c.x += (tx - d.c.x) * 0.08;
      d.c.y += (ty - d.c.y) * 0.08;
      d.amp += ((s.pointer.in ? 0.24 : 0.12) - d.amp) * 0.06;
      d.pulse *= 0.94;

      const pts = [];
      for (let i = 0; i < N; i++) {
        const a = (i / N) * Math.PI * 2;
        const r = base * (1 + d.amp * (Math.sin(a * 3 + s.t * 1.1) + 0.6 * Math.sin(a * 5 - s.t * 1.6)) + d.pulse * 0.25 * Math.sin(a * 6 + s.t * 10));
        pts.push([d.c.x + Math.cos(a) * r, d.c.y + Math.sin(a) * r]);
      }
      ctx.fillStyle = "#F3F0E8";
      ctx.fillRect(0, 0, s.w, s.h);

      const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
      const path = new Path2D();
      const m0 = mid(pts[N - 1], pts[0]);
      path.moveTo(m0[0], m0[1]);
      for (let i = 0; i < N; i++) {
        const m = mid(pts[i], pts[(i + 1) % N]);
        path.quadraticCurveTo(pts[i][0], pts[i][1], m[0], m[1]);
      }
      path.closePath();

      // Echo outlines, then the solid body.
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = "#080808";
      for (let k = 3; k >= 1; k--) {
        ctx.save();
        ctx.translate(d.c.x, d.c.y);
        ctx.scale(1 + k * 0.16, 1 + k * 0.16);
        ctx.translate(-d.c.x, -d.c.y);
        ctx.globalAlpha = 0.3 / k;
        ctx.stroke(path);
        ctx.restore();
      }
      ctx.globalAlpha = 1;
      ctx.fillStyle = "#080808";
      ctx.fill(path);
      ctx.fillStyle = "#C7FF3D";
      ctx.beginPath();
      ctx.arc(d.c.x + base * 0.28, d.c.y - base * 0.28, base * 0.1, 0, 6.283);
      ctx.fill();
    },
  });
  return <canvas ref={ref} className="exp__canvas" role="img" aria-label="A soft blob that follows and swells toward the pointer" />;
}
