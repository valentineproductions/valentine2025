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
  const firstVisualProgressRef = useRef(null);
  const firstVisualStartRef = useRef(null);
  const firstVisualTopRef = useRef(null);
  const headStartScrollYRef = useRef(null);
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

    const firstEl = firstBlockRef.current;
    const fadeEl = fadeEndRef.current;
    const fadeRect = fadeEl?.getBoundingClientRect();

    // Hair reacts to first-still visual motion; Head is gated and continues from 50 -> 30.
    const totalTravel = Math.max(600, vh * 0.9);
    const hairTravel = totalTravel * 0.55;
    const headTravel = totalTravel * 0.45;

    let visualDeltaPx = sy;
    if (firstEl) {
      const firstRect = firstEl.getBoundingClientRect();
      const visualProgress = firstVisualProgressRef.current;
      const visualStart = firstVisualStartRef.current;
      if (visualProgress !== null && visualStart !== null) {
        visualDeltaPx = Math.max(0, (visualProgress - visualStart) * (vh + firstRect.height));
      } else {
        if (firstVisualTopRef.current === null) firstVisualTopRef.current = firstRect.top;
        visualDeltaPx = Math.max(0, firstVisualTopRef.current - firstRect.top);
      }
    }

    const hairProgress = clamp(visualDeltaPx / hairTravel, 0, 1);
    if (hairProgress >= 1 && headStartScrollYRef.current === null) {
      headStartScrollYRef.current = sy;
    } else if (hairProgress < 1) {
      headStartScrollYRef.current = null;
    }
    const headBaseY = headStartScrollYRef.current ?? sy;
    const headProgress = hairProgress >= 1 ? clamp((sy - headBaseY) / headTravel, 0, 1) : 0;
    const topProgress = hairProgress < 1
      ? hairProgress * 0.5
      : 0.5 + headProgress * 0.5;
    const headOpacity = topProgress < 1 ? 1 : 0;
    const bodyIntroOpacity = topProgress >= 1 ? 1 : 0;

    const maxContentPad = Math.max(0, vw - 48);
    const targetW = Math.min(720, Math.floor(Math.min(maxContentPad, vw * 0.82)));
    const startW = Math.floor(Math.min(2000, maxContentPad));
    // Strict linear mapping: full responsive width -> Body size.
    const pAlign = topProgress;
    const headW = Math.round(startW + (targetW - startW) * pAlign);

    // Fixed start anchor at viewport bottom so movement starts immediately on first scroll px.
    const startHeadH = startW * (500 / 2000);
    const visibleBottomPad = 16;
    const startBottomY = vh - visibleBottomPad;
    const startCenterY = startBottomY - startHeadH / 2;
    const targetCenterY = vh / 2;
    const headTopPx = startCenterY + (targetCenterY - startCenterY) * pAlign;

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
    const img = bottomLogoRef.current?.querySelector('img');
    const h = img?.offsetHeight || 0;
    const tailTravel = h || vh * 0.6;
    const tailYPx = Math.round((1 - tailProgress) * tailTravel * 1.1);

    root.style.setProperty('--ws-head-opacity', String(headOpacity));
    root.style.setProperty('--ws-head-top', `${headTopPx}px`);
    root.style.setProperty('--ws-head-width', `${headW}px`);
    root.style.setProperty('--ws-head-z', topProgress < 1 ? '9999' : '0');
    root.style.setProperty('--ws-body-opacity', String(bodyOpacity));
    root.style.setProperty('--ws-tail-y', `${tailYPx}px`);

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
    const handleResize = () => {
      if ((window.scrollY || 0) <= 2) {
        firstVisualProgressRef.current = null;
        firstVisualStartRef.current = null;
        firstVisualTopRef.current = block?.getBoundingClientRect().top ?? null;
        headStartScrollYRef.current = null;
      }
      ScrollTrigger.refresh();
      scheduleFrame();
    };
    window.addEventListener('scroll', scheduleFrame, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });

    const ro = typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver(() => {
        ScrollTrigger.refresh();
        scheduleFrame();
      })
      : null;
    if (block && ro) ro.observe(block);
    if (block2 && ro) ro.observe(block2);

    let firstSt = null;
    if (block) {
      firstSt = ScrollTrigger.create({
        trigger: block,
        start: 'top bottom',
        end: 'bottom top',
        onRefresh(self) {
          firstVisualProgressRef.current = self.progress;
          if (firstVisualStartRef.current === null) {
            firstVisualStartRef.current = self.progress;
          }
          if (firstVisualTopRef.current === null) {
            firstVisualTopRef.current = block.getBoundingClientRect().top;
          }
          scheduleFrame();
        },
        onUpdate(self) {
          if (firstVisualStartRef.current === null) firstVisualStartRef.current = self.progress;
          firstVisualProgressRef.current = self.progress;
          scheduleFrame();
        },
      });
    }

    scheduleFrame();

    return () => {
      window.removeEventListener('scroll', scheduleFrame);
      window.removeEventListener('resize', handleResize);
      firstSt?.kill();
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
