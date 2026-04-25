'use client';

import WorkStillsBackgroundMark from './WorkStillsBackgroundMark';
import HeroBannerLogoDown from './HeroBannerLogoDown';
import WorkStillsBlock from './WorkStillsBlock';
import { resolveStillsImages } from './workStillsUtils';
import styles from './WorkStills.module.css';
import { useRef } from 'react';

export default function WorkStillsView({ stills, backgroundLogo, fallbackLogo, pageCompanyLogo, backgroundColor }) {
  const firstBlockRef = useRef(null);
  const secondBlockRef = useRef(null);

  const list = Array.isArray(stills)
    ? stills.filter((s) => resolveStillsImages(s).length > 0)
    : [];

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
      className={[styles.root, firstIsFullBleed ? styles.rootHasFirstFullBleed : ''].filter(Boolean).join(' ')}
      style={backgroundColor ? { background: backgroundColor } : undefined}
    >
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
    </div>
  );
}
