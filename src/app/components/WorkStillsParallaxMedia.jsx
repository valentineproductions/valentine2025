'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './WorkStills.module.css';

gsap.registerPlugin(ScrollTrigger);

export default function WorkStillsParallaxMedia({ strength, rootRef, children }) {
  const wrapRef = useRef(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const inner = el.querySelector('[data-parallax-inner]');
    if (!inner) return;
    const root = rootRef?.current || el;
    const vh = window.innerHeight || 1;
    const baseMult = Math.min(520, Math.max(220, vh * 0.55));
    const isMobile = window.matchMedia('(max-width: 767px)').matches;
    const factor = isMobile ? 0.7 : 1;
    const effStrength = (typeof strength === 'number' ? strength : 0) * factor;

    const st = ScrollTrigger.create({
      trigger: root,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
      onUpdate(self) {
        const centered = self.progress - 0.5;
        const px = centered * (effStrength / 100) * baseMult;
        gsap.set(inner, { y: px, force3D: true });
      },
    });

    return () => {
      st.kill();
    };
  }, [strength, rootRef]);

  return (
    <div ref={wrapRef} className={styles.parallaxWrap}>
      <div data-parallax-inner className={styles.parallaxInner}>
        {children}
      </div>
    </div>
  );
}
