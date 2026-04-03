'use client';

import { useEffect, useRef } from 'react';
import styles from './DirectorNavigateTransition.module.css';

/**
 * Burst at click point: thin ring + scaled burst; thicker rotating ring as loading; then onComplete.
 */
export default function DirectorNavigateTransition({ origin, onComplete }) {
  const doneRef = useRef(false);

  useEffect(() => {
    /* 0.4s thin ring + 0.6s ticker */
    const t = window.setTimeout(() => {
      if (!doneRef.current) {
        doneRef.current = true;
        onComplete();
      }
    }, 1000);
    return () => window.clearTimeout(t);
  }, [onComplete]);

  return (
    <div
      className={styles.root}
      style={{ left: origin.x, top: origin.y }}
      aria-hidden
    >
      <div className={styles.burst}>
        <div className={styles.ringThin} />
        <div className={styles.loaderWrap}>
          <div className={styles.ringThick} />
        </div>
      </div>
    </div>
  );
}
