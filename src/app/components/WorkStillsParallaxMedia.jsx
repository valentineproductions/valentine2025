'use client';

import { useEffect, useRef, useCallback } from 'react';
import styles from './WorkStills.module.css';

export default function WorkStillsParallaxMedia({ strength, children }) {
  const ref = useRef(null);

  const onScroll = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight || 1;
    const center = rect.top + rect.height / 2;
    const offset = (center - vh / 2) / vh;
    const px = offset * (strength / 100) * 80;
    const inner = el.querySelector('[data-parallax-inner]');
    if (inner) inner.style.transform = `translate3d(0, ${px}px, 0)`;
  }, [strength]);

  useEffect(() => {
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [onScroll]);

  return (
    <div ref={ref} className={styles.parallaxWrap}>
      <div data-parallax-inner className={styles.parallaxInner}>
        {children}
      </div>
    </div>
  );
}
