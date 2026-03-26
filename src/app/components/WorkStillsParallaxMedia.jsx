'use client';

import { useEffect, useRef, useCallback } from 'react';
import styles from './WorkStills.module.css';

/** Viewport based multiplier so motion stays noticeable on large screens. */
function motionMultiplier(vh) {
  return Math.min(520, Math.max(220, vh * 0.55));
}

export default function WorkStillsParallaxMedia({ strength, rootRef, children }) {
  const wrapRef = useRef(null);

  const onScroll = useCallback(() => {
    const el = wrapRef.current;
    if (!el) return;
    const inner = el.querySelector('[data-parallax-inner]');
    if (!inner) return;

    const vh = window.innerHeight || 1;
    const root = rootRef?.current;

    let progress;
    if (root) {
      const r = root.getBoundingClientRect();
      const blockCenter = r.top + r.height / 2;
      progress = (blockCenter - vh / 2) / vh;
    } else {
      const rect = el.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      progress = (center - vh / 2) / vh;
    }

    const mult = motionMultiplier(vh);
    const px = progress * (strength / 100) * mult;
    inner.style.transform = `translate3d(0, ${px}px, 0)`;
  }, [strength, rootRef]);

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
    <div ref={wrapRef} className={styles.parallaxWrap}>
      <div data-parallax-inner className={styles.parallaxInner}>
        {children}
      </div>
    </div>
  );
}
