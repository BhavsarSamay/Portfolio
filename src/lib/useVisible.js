import { useEffect, useRef, useState } from "react";

// True while the element is near the viewport. Used to pause canvases and loops offscreen.
export function useVisible(margin = "100px") {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: margin });
    io.observe(el);
    return () => io.disconnect();
  }, [margin]);
  return [ref, visible];
}
