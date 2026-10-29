import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [label, setLabel] = useState('');
  const pos = useRef({ x: 0, y: 0 });
  const ring = useRef({ x: 0, y: 0 });
  const raf = useRef(null);

  useEffect(() => {
    // Don't show on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const dot = dotRef.current;
    const ringEl = ringRef.current;
    if (!dot || !ringEl) return;

    // Lag factor for ring
    const lag = prefersReduced ? 1 : 0.12;

    const onMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };
      // Move dot immediately
      gsap.set(dot, { x: e.clientX, y: e.clientY });
    };

    const tick = () => {
      // Lerp ring toward cursor
      ring.current.x += (pos.current.x - ring.current.x) * lag;
      ring.current.y += (pos.current.y - ring.current.y) * lag;
      gsap.set(ringEl, { x: ring.current.x, y: ring.current.y });
      raf.current = requestAnimationFrame(tick);
    };

    const onEnterLink = (e) => {
      const el = e.currentTarget;
      ringEl.classList.add('cursor-hover');
      const data = el.dataset.cursorLabel;
      if (data) setLabel(data);
    };

    const onLeaveLink = () => {
      ringEl.classList.remove('cursor-hover');
      setLabel('');
    };

    const bindLinks = () => {
      document
        .querySelectorAll('a, button, [data-cursor]')
        .forEach((el) => {
          el.addEventListener('mouseenter', onEnterLink);
          el.addEventListener('mouseleave', onLeaveLink);
        });
    };

    window.addEventListener('mousemove', onMove);
    raf.current = requestAnimationFrame(tick);

    // Bind on initial render and re-bind after 800ms to catch dynamic elements
    bindLinks();
    const rebind = setTimeout(bindLinks, 800);

    return () => {
      window.removeEventListener('mousemove', onMove);
      if (raf.current) cancelAnimationFrame(raf.current);
      clearTimeout(rebind);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true">
        {label && (
          <span style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%,-50%)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.55rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--lime)',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
          }}>
            {label}
          </span>
        )}
      </div>
    </>
  );
}
