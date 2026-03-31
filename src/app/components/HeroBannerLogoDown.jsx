'use client';

import { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import styles from './WorkStills.module.css';

// Logo taxonomy: hero (overlay white), body background (watermark in center), footer (tail slide-in)
function resolveLogoUrl(logo) {
  return logo?.url || logo?.asset?.url || null;
}

export default function HeroBannerLogoDown({ overlayLogo, targetMax = 720, scrollRange = 180 }) {
  const url = resolveLogoUrl(overlayLogo);
  const [vw, setVw] = useState(typeof window === 'undefined' ? 1280 : window.innerWidth);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onResize = () => setVw(window.innerWidth);
    const onScroll = () => setScrollY(window.scrollY || 0);
    onResize();
    onScroll();
    window.addEventListener('resize', onResize, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const style = useMemo(() => {
    const maxContentPad = Math.max(0, vw - 48); // match nav side paddings (~24px each side)
    const target = Math.min(targetMax, Math.floor(Math.min(maxContentPad, vw * 0.82)));
    const start = Math.floor(Math.min(2000, maxContentPad));
    const p = Math.max(0, Math.min(1, scrollY / scrollRange));
    const w = Math.round(start + (target - start) * p);
    const ty = Math.round(10 * p);
    const opacity = p >= 1 ? 0 : 1;
    return { width: `${w}px`, transform: `translateX(-50%) translateY(${ty}px)`, opacity };
  }, [vw, scrollY, scrollRange, targetMax]);

  if (!url) return null;

  return (
    <div className={styles.heroOverlayWrap} style={style} aria-hidden>
      <Image
        src={url}
        alt=""
        width={2000}
        height={500}
        sizes="100vw"
        style={{ width: '100%', height: 'auto' }}
        priority={false}
      />
    </div>
  );
}
