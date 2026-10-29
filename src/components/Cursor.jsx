import { useEffect, useRef } from "react";
import { gsap, isTouch } from "../lib/motion";

// A trailing ring that grows and shows a label over [data-cursor] elements.
// The native cursor is left untouched, and nothing renders on touch devices.
export default function Cursor() {
  const ring = useRef(null);
  const label = useRef(null);

  useEffect(() => {
    if (isTouch() || !ring.current) return;
    const el = ring.current;
    const x = gsap.quickTo(el, "x", { duration: 0.45, ease: "power3" });
    const y = gsap.quickTo(el, "y", { duration: 0.45, ease: "power3" });

    const move = (e) => {
      x(e.clientX);
      y(e.clientY);
      if (!el.dataset.on) {
        el.dataset.on = "1";
        gsap.to(el, { opacity: 1, duration: 0.3 });
      }
    };
    const over = (e) => {
      const t = e.target.closest?.("[data-cursor]");
      if (t) {
        label.current.textContent = t.dataset.cursor;
        el.classList.add("is-label");
      } else {
        el.classList.remove("is-label");
        el.classList.toggle("is-link", !!e.target.closest?.("a, button, input, textarea, [role=button]"));
      }
    };
    const leave = () => {
      el.dataset.on = "";
      gsap.to(el, { opacity: 0, duration: 0.3 });
    };

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    document.documentElement.addEventListener("mouseleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      document.documentElement.removeEventListener("mouseleave", leave);
    };
  }, []);

  return (
    <div ref={ring} className="cursor" aria-hidden="true">
      <span ref={label} className="cursor__label" />
    </div>
  );
}
