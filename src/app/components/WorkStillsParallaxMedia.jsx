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
    const mediaH = el.clientHeight || 1;
    const baseTravel = Math.max(mediaH * 0.9, vh * 0.55);
    const isMobile = window.matchMedia('(max-width: 767px)').matches;
    const factor = isMobile ? 0.7 : 1;
    const effStrength = (typeof strength === 'number' ? strength : 0) * factor;
    const maxShift = (Math.max(0, effStrength) / 100) * baseTravel;

    // Overscan prevents edge exposure during larger vertical travel.
    gsap.set(inner, {
      scale: maxShift > 0 ? 1.2 : 1,
      transformOrigin: 'center center',
      force3D: true,
    });

    const st = ScrollTrigger.create({
      trigger: root,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1.5,
      onUpdate(self) {
        // Positive Y as you scroll down creates the heavy floating drift.
        const px = self.progress * maxShift;
        gsap.set(inner, { y: px, ease: 'none', force3D: true });
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
