import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function Loader({ onComplete }) {
  const wrapRef = useRef(null);
  const sbRef = useRef(null);
  const barRef = useRef(null);
  const countRef = useRef(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      onComplete?.();
      return;
    }

    // Check if already seen this session
    const seen = sessionStorage.getItem('loader-seen');
    if (seen) {
      onComplete?.();
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        sessionStorage.setItem('loader-seen', '1');
        onComplete?.();
      },
    });

    tl
      .set(wrapRef.current, { autoAlpha: 1 })
      // Monogram slides up into view
      .to(sbRef.current, {
        y: '0%',
        duration: 1.0,
        ease: 'expo.out',
        delay: 0.2,
      })
      // Bar fills
      .to(barRef.current, {
        width: '100%',
        duration: 1.0,
        ease: 'expo.inOut',
      }, '-=0.4')
      // Count up
      .to(countRef.current, {
        textContent: '100',
        duration: 1.0,
        ease: 'expo.inOut',
        snap: { textContent: 1 },
        onUpdate() {
          if (countRef.current) {
            countRef.current.textContent = Math.round(Number(countRef.current.textContent)).toString().padStart(3, '0');
          }
        },
      }, '<')
      // Brief pause
      .to({}, { duration: 0.3 })
      // Whole loader slides up and out
      .to(wrapRef.current, {
        yPercent: -100,
        duration: 0.9,
        ease: 'expo.in',
      });

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  return (
    <div
      ref={wrapRef}
      className="loader-wrap"
      aria-hidden="true"
    >
      {/* SB Monogram */}
      <div className="loader-monogram">
        <span ref={sbRef} className="monogram-sb">SB</span>
      </div>

      {/* Progress Bar */}
      <div className="loader-bar-wrap">
        <div ref={barRef} className="loader-bar-fill" style={{ width: '0%' }} />
      </div>

      {/* Counter */}
      <div ref={countRef} className="loader-count">000</div>
    </div>
  );
}
