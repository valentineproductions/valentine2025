'use client';

import WorkStillsBackgroundMark from './WorkStillsBackgroundMark';
import HeroBannerLogoDown from './HeroBannerLogoDown';
import WorkStillsBlock from './WorkStillsBlock';
import { resolveStillsImages } from './workStillsUtils';
import styles from './WorkStills.module.css';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

// Logo taxonomy: hero (overlay white), body background (watermark), footer (tail slide-in)
export default function WorkStillsView({ stills, backgroundLogo, fallbackLogo, pageCompanyLogo, backgroundColor }) {
  const bottomLogoRef = useRef(null);
  const [bottomVisible, setBottomVisible] = useState(false);
  const fadeEndRef = useRef(null);
  const [bodyPhase, setBodyPhase] = useState('visible'); // 'hidden' | 'visible' | 'gone'
  const bodyGoneYRef = useRef(0);
  const HEAD_RANGE = 180;
  const [endInView, setEndInView] = useState(false);

  useEffect(() => {
    const endEl = fadeEndRef.current;
    if (endEl) {
      const ioEnd = new IntersectionObserver(
        (entries) => {
          const inView = !!entries[0]?.isIntersecting;
          setEndInView(inView);
          if (inView) {
            bodyGoneYRef.current = typeof window !== 'undefined' ? window.scrollY : 0;
          }
        },
        { threshold: 0.25 }
      );
      ioEnd.observe(endEl);
      return () => ioEnd.disconnect();
    }
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const y = typeof window !== 'undefined' ? window.scrollY : 0;
      if (endInView) {
        setBodyPhase('gone');
      } else {
        setBodyPhase(y < HEAD_RANGE ? 'hidden' : 'visible');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [endInView]);

  useEffect(() => {
    const onScroll = () => {
      const y = typeof window !== 'undefined' ? window.scrollY : 0;
      const goneY = bodyGoneYRef.current || 0;
      const delta = y - goneY;
      if (endInView && delta > 240) {
        setBottomVisible(true);
      } else {
        setBottomVisible(false);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [endInView]);
  const list = Array.isArray(stills)
    ? stills.filter((s) => resolveStillsImages(s).length > 0)
    : [];

  useEffect(() => {
    const updateOffset = () => {
      const el = bottomLogoRef.current;
      const img = el?.querySelector('img');
      const h = bottomVisible && img ? img.offsetHeight || 0 : 0;
      if (typeof document !== 'undefined') {
        document.documentElement.style.setProperty('--tail-offset', `${h}px`);
      }
    };
    updateOffset();
    window.addEventListener('resize', updateOffset, { passive: true });
    return () => {
      window.removeEventListener('resize', updateOffset);
      if (typeof document !== 'undefined') {
        document.documentElement.style.setProperty('--tail-offset', '0px');
      }
    };
  }, [bottomVisible]);

  if (list.length === 0) {
    return (
      <div className={styles.root} style={backgroundColor ? { background: backgroundColor } : undefined}>
        <WorkStillsBackgroundMark logo={backgroundLogo} fallbackLogo={fallbackLogo || pageCompanyLogo} fadeState={bodyPhase === 'gone' ? 'gone' : bodyPhase === 'hidden' ? 'hidden' : undefined} />
        <HeroBannerLogoDown overlayLogo={backgroundLogo || fallbackLogo || pageCompanyLogo} />
        <div className={styles.heroSpacer} aria-hidden />
        <div className={styles.empty}>
          <p>Add Stills in Sanity (Work page → Stills). Choose a layout, then add images.</p>
        </div>
      </div>
    );
  }

  const firstIsFullBleed = list.length > 0 && String(list[0]?.layout) === 'fullBleed';
  return (
    <div className={[styles.root, firstIsFullBleed ? styles.rootHasFirstFullBleed : ''].filter(Boolean).join(' ')} style={backgroundColor ? { background: backgroundColor } : undefined}>
      <WorkStillsBackgroundMark logo={backgroundLogo} fallbackLogo={fallbackLogo || pageCompanyLogo} fadeState={bodyPhase === 'gone' ? 'gone' : bodyPhase === 'hidden' ? 'hidden' : undefined} />
      <HeroBannerLogoDown overlayLogo={backgroundLogo || fallbackLogo || pageCompanyLogo} />
      <div className={styles.heroSpacer} aria-hidden />
      <div className={styles.feed}>
        {list.map((item, index) => (
          <WorkStillsBlock key={`${item.title}-${index}`} item={item} />
        ))}
      </div>
      <div ref={fadeEndRef} aria-hidden style={{ width: 1, height: 1, margin: 0, padding: 0 }} />
      <div ref={bottomLogoRef} className={`${styles.bottomLogoWrap} ${bottomVisible ? styles.visible : ''}`}>
        {(backgroundLogo?.asset?.url || backgroundLogo?.url || fallbackLogo?.asset?.url || fallbackLogo?.url || pageCompanyLogo?.asset?.url) && (
          <Image
            src={(backgroundLogo?.asset?.url) || (backgroundLogo?.url) || (fallbackLogo?.asset?.url) || (fallbackLogo?.url) || (pageCompanyLogo?.asset?.url)}
            alt=""
            width={2000}
            height={500}
            sizes="(max-width: 2000px) 100vw, 2000px"
            style={{ width: '100%', height: 'auto', display: 'block' }}
            priority={false}
          />
        )}
      </div>
    </div>
  );
}
