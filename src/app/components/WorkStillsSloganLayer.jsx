'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './WorkStills.module.css';

/** Scroll distance (px) over which the layer fades from 1 → 0 */
const FADE_RANGE_PX = 400;

function logoUrl(logo) {
  return logo?.url || logo?.asset?.url || null;
}

/**
 * Fixed center — same spot as WorkStillsBackgroundMark.
 * Uses Work page **Pages Company Logo** (colored). Fades on scroll so the faint mark stays behind.
 */
export default function WorkStillsSloganLayer({ pageCompanyLogo }) {
  const [opacity, setOpacity] = useState(1);
  const url = logoUrl(pageCompanyLogo);

  useEffect(() => {
    if (!url) return;
    const onScroll = () => {
      const y = window.scrollY;
      setOpacity(Math.max(0, Math.min(1, 1 - y / FADE_RANGE_PX)));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [url]);

  if (!url) return null;

  return (
    <div className={styles.sloganLayer} style={{ opacity }} aria-hidden>
      <Image
        src={url}
        alt=""
        width={720}
        height={200}
        className={styles.sloganLayerImg}
        sizes="(max-width: 900px) 88vw, 720px"
      />
    </div>
  );
}
