'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import WorkStillsBackgroundMark from './WorkStillsBackgroundMark';
import HeroBannerLogoDown from './HeroBannerLogoDown';
import WorkStillsBlock from './WorkStillsBlock';
import { resolveStillsImages } from './workStillsUtils';
import styles from './WorkStills.module.css';
import Image from 'next/image';
import { useCallback, useEffect, useLayoutEffect, useRef } from 'react';

gsap.registerPlugin(ScrollTrigger);

function clamp(n, lo, hi) {
  return Math.max(lo, Math.min(hi, n));
}

export default function WorkStillsView({ stills, backgroundLogo, fallbackLogo, pageCompanyLogo, backgroundColor }) {
  const rootRef = useRef(null);
  const firstBlockRef = useRef(null);
  const secondBlockRef = useRef(null);
  const bottomRunwayRef = useRef(null);
  const tailLogoRef = useRef(null);
  const bottomProgressRef = useRef(0);
  const rafPending = useRef(false);

  const list = Array.isArray(stills)
    ? stills.filter((s) => resolveStillsImages(s).length > 0)
    : [];

  const applyScrollFrame = useCallback(() => {
    const root = rootRef.current;
    if (!root || list.length === 0) return;

    const vw = typeof window !== 'undefined' ? window.innerWidth : 1280;
    const vh = typeof window !== 'undefined' ? window.innerHeight : 800;
    const sy = typeof window !== 'undefined' ? window.scrollY : 0;
    const shrinkRunway = Math.max(800, Math.round(vh * 0.95));
    const progress = clamp(sy / shrinkRunway, 0, 1);

    const startW = Math.floor(Math.min(2000, Math.max(0, vw - 48)));
    const targetW = Math.floor(Math.min(720, vw * 0.82));
    const logoW = Math.round(startW + (targetW - startW) * progress);

    const startLogoH = startW * (500 / 2000);
    const startCenterY = vh - 16 - startLogoH / 2;
    const targetCenterY = vh / 2;
    const logoTop = startCenterY + (targetCenterY - startCenterY) * progress;

    root.style.setProperty('--ws-head-opacity', String(1 - bottomProgressRef.current));
    root.style.setProperty('--ws-head-top', `${logoTop}px`);
    root.style.setProperty('--ws-head-width', `${logoW}px`);
    root.style.setProperty('--ws-head-z', progress < 1 ? '9999' : '1');
  }, [list.length]);

  const scheduleFrame = useCallback(() => {
    if (rafPending.current) return;
    rafPending.current = true;
    requestAnimationFrame(() => {
      rafPending.current = false;
      applyScrollFrame();
    });
  }, [applyScrollFrame]);

  useLayoutEffect(() => {
    if (list.length === 0) return undefined;
    applyScrollFrame();
    return undefined;
  }, [list.length, applyScrollFrame]);

  useEffect(() => {
    if (list.length === 0) return undefined;

    window.addEventListener('scroll', scheduleFrame, { passive: true });
    window.addEventListener('resize', scheduleFrame, { passive: true });
    scheduleFrame();
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
      scheduleFrame();
    });

    return () => {
      window.removeEventListener('scroll', scheduleFrame);
      window.removeEventListener('resize', scheduleFrame);
    };
  }, [list.length, scheduleFrame]);

  useEffect(() => {
    if (list.length === 0) return undefined;
    const root = rootRef.current;
    const runway = bottomRunwayRef.current;
    const tailLogo = tailLogoRef.current;
    if (!root || !runway || !tailLogo) return undefined;

    gsap.set(tailLogo, { xPercent: -50, yPercent: 100 });
    const trigger = ScrollTrigger.create({
      trigger: runway,
      start: 'top bottom',
      end: 'bottom bottom',
      scrub: true,
      onUpdate(self) {
        const mainFadeProgress = clamp(self.progress / 0.45, 0, 1);
        const tailProgress = clamp((self.progress - 0.45) / 0.55, 0, 1);
        bottomProgressRef.current = mainFadeProgress;
        scheduleFrame();
        gsap.set(tailLogo, { xPercent: -50, yPercent: (1 - tailProgress) * 100 });
      },
    });
    requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => trigger.kill();
  }, [list.length, scheduleFrame]);

  if (list.length === 0) {
    return (
      <div className={styles.root} style={backgroundColor ? { background: backgroundColor } : undefined}>
        <WorkStillsBackgroundMark logo={backgroundLogo} fallbackLogo={fallbackLogo || pageCompanyLogo} fadeState="hidden" />
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
    <div
      ref={rootRef}
      className={[styles.root, firstIsFullBleed ? styles.rootHasFirstFullBleed : ''].filter(Boolean).join(' ')}
      style={backgroundColor ? { background: backgroundColor } : undefined}
    >
      <HeroBannerLogoDown overlayLogo={backgroundLogo || fallbackLogo || pageCompanyLogo} scrollMode="interpolate" />
      <div className={styles.heroSpacer} aria-hidden />
      <div className={styles.feed}>
        {list.map((item, index) => (
          <div
            key={`${item.title}-${index}`}
            ref={index === 0 ? firstBlockRef : index === 1 ? secondBlockRef : undefined}
            className={styles.feedItemWrap}
          >
            <WorkStillsBlock item={item} />
          </div>
        ))}
      </div>
      <div ref={bottomRunwayRef} className={styles.bottomRunway}>
        {(backgroundLogo?.asset?.url || backgroundLogo?.url || fallbackLogo?.asset?.url || fallbackLogo?.url || pageCompanyLogo?.asset?.url) && (
          <div ref={tailLogoRef} className={styles.tailLogoWrap}>
            <Image
              src={(backgroundLogo?.asset?.url) || (backgroundLogo?.url) || (fallbackLogo?.asset?.url) || (fallbackLogo?.url) || (pageCompanyLogo?.asset?.url)}
              alt=""
              width={2000}
              height={500}
              sizes="(max-width: 2000px) 100vw, 2000px"
              style={{ width: '100%', height: 'auto', display: 'block' }}
              priority={false}
              onLoadingComplete={() => {
                ScrollTrigger.refresh();
                scheduleFrame();
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
