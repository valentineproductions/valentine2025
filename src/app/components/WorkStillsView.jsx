'use client';

import WorkStillsBackgroundMark from './WorkStillsBackgroundMark';
import HeroBannerLogoDown from './HeroBannerLogoDown';
import WorkStillsBlock from './WorkStillsBlock';
import { resolveStillsImages } from './workStillsUtils';
import styles from './WorkStills.module.css';
import Image from 'next/image';
import { useCallback, useEffect, useLayoutEffect, useRef } from 'react';

// Logo taxonomy: hero (overlay white), body background (watermark), footer (tail slide-in)
// Intro: head aligns over scroll distance snapScrollY (runway → second set), then binary snap (no overlap).
// Outro: sentinel s — first half fades body out, second half slides tail up (sequential, no overlap).

function clamp(n, lo, hi) {
  return Math.max(lo, Math.min(hi, n));
}

/** Sentinel progress s∈[0,1]: first half body fade, second half tail rise. */
const SENTINEL_BODY_EXIT_END = 0.5;

export default function WorkStillsView({ stills, backgroundLogo, fallbackLogo, pageCompanyLogo, backgroundColor }) {
  const rootRef = useRef(null);
  const firstBlockRef = useRef(null);
  const secondBlockRef = useRef(null);
  const bottomLogoRef = useRef(null);
  const fadeEndRef = useRef(null);
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

    const blockEl = firstBlockRef.current;
    const blockRect = blockEl?.getBoundingClientRect();
    const secondEl = secondBlockRef.current;
    const fadeEl = fadeEndRef.current;
    const fadeRect = fadeEl?.getBoundingClientRect();

    const docTop = (el) => {
      if (!el || typeof window === 'undefined') return 0;
      return el.getBoundingClientRect().top + window.scrollY;
    };

    const blockH = blockEl?.offsetHeight ?? vh * 0.65;
    /** Scroll distance over which the head completes align + snap — tied to runway before set 2. */
    let snapScrollY;
    if (blockEl && secondEl) {
      const secondTopDoc = docTop(secondEl);
      snapScrollY = secondTopDoc - vh * 0.94;
    } else {
      snapScrollY = Math.max(vh * 1.15, blockH * 1.5);
    }
    snapScrollY = Math.max(240, snapScrollY);

    const pAlign = clamp(sy / snapScrollY, 0, 1);
    const inAlignPhase = sy < snapScrollY;
    const headOpacity = inAlignPhase ? 1 : 0;
    const bodyIntroOpacity = inAlignPhase ? 0 : 1;

    const blockCenterY = blockRect ? blockRect.top + blockRect.height / 2 : vh / 2;
    const viewportCenterY = vh / 2;
    const headTopPx = blockCenterY + (viewportCenterY - blockCenterY) * pAlign;

    const maxContentPad = Math.max(0, vw - 48);
    const targetW = Math.min(720, Math.floor(Math.min(maxContentPad, vw * 0.82)));
    const startW = Math.floor(Math.min(2000, maxContentPad));
    const headW = Math.round(startW + (targetW - startW) * pAlign);

    let s = 0;
    if (fadeRect && Number.isFinite(fadeRect.top)) {
      const dist = Math.max(0, vh - fadeRect.top);
      s = clamp(dist / vh, 0, 1);
    }

    let bodyExitOpacity = 1;
    let tailProgress = 0;
    if (s > 0 && bodyIntroOpacity > 0) {
      if (s < SENTINEL_BODY_EXIT_END) {
        bodyExitOpacity = 1 - s / SENTINEL_BODY_EXIT_END;
        tailProgress = 0;
      } else {
        bodyExitOpacity = 0;
        tailProgress = clamp((s - SENTINEL_BODY_EXIT_END) / (1 - SENTINEL_BODY_EXIT_END), 0, 1);
      }
    }

    const bodyOpacity = bodyIntroOpacity * bodyExitOpacity;
    const tailTyPercent = (1 - tailProgress) * 110;

    root.style.setProperty('--ws-head-opacity', String(headOpacity));
    root.style.setProperty('--ws-head-top', `${headTopPx}px`);
    root.style.setProperty('--ws-head-width', `${headW}px`);
    root.style.setProperty('--ws-body-opacity', String(bodyOpacity));
    root.style.setProperty('--ws-tail-ty', `${tailTyPercent}%`);

    const img = bottomLogoRef.current?.querySelector('img');
    const h = img?.offsetHeight || 0;
    if (typeof document !== 'undefined') {
      document.documentElement.style.setProperty('--tail-offset', `${Math.round(tailProgress * h)}px`);
    }
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

    const block = firstBlockRef.current;
    const block2 = secondBlockRef.current;
    window.addEventListener('scroll', scheduleFrame, { passive: true });
    window.addEventListener('resize', scheduleFrame, { passive: true });

    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => scheduleFrame()) : null;
    if (block && ro) ro.observe(block);
    if (block2 && ro) ro.observe(block2);

    scheduleFrame();

    return () => {
      window.removeEventListener('scroll', scheduleFrame);
      window.removeEventListener('resize', scheduleFrame);
      ro?.disconnect();
      if (typeof document !== 'undefined') {
        document.documentElement.style.setProperty('--tail-offset', '0px');
      }
    };
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
      <WorkStillsBackgroundMark
        logo={backgroundLogo}
        fallbackLogo={fallbackLogo || pageCompanyLogo}
        scrollMode="interpolate"
      />
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
      <div ref={fadeEndRef} aria-hidden style={{ width: 1, height: 1, margin: 0, padding: 0 }} />
      <div ref={bottomLogoRef} className={styles.bottomLogoWrap}>
        {(backgroundLogo?.asset?.url || backgroundLogo?.url || fallbackLogo?.asset?.url || fallbackLogo?.url || pageCompanyLogo?.asset?.url) && (
          <Image
            src={(backgroundLogo?.asset?.url) || (backgroundLogo?.url) || (fallbackLogo?.asset?.url) || (fallbackLogo?.url) || (pageCompanyLogo?.asset?.url)}
            alt=""
            width={2000}
            height={500}
            sizes="(max-width: 2000px) 100vw, 2000px"
            style={{ width: '100%', height: 'auto', display: 'block' }}
            priority={false}
            onLoadingComplete={scheduleFrame}
          />
        )}
      </div>
    </div>
  );
}
