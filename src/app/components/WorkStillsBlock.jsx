'use client';

import Image from 'next/image';
import { useRef } from 'react';
import WorkStillsParallaxMedia from './WorkStillsParallaxMedia';
import {
  resolveImageUrl,
  resolveStillsImages,
  resolveImageParallaxStrength,
} from './workStillsUtils';
import styles from './WorkStills.module.css';

export default function WorkStillsBlock({ item }) {
  const parallaxRootRef = useRef(null);
  const layoutRaw = item.layout;
  const layout =
    layoutRaw === 'fullBleed' ||
    layoutRaw === 'centered' ||
    layoutRaw === 'twoColumn' ||
    layoutRaw === 'dualImageTextRow' ||
    layoutRaw === 'threeColumn'
      ? layoutRaw
      : 'twoColumn';

  const strength =
    typeof item.parallaxStrength === 'number' ? item.parallaxStrength : 35;
  const images = resolveStillsImages(item);
  const count = images.length;
  const gridCols = Math.min(count, 3);
  const gridExtra =
    gridCols >= 3
      ? styles.imageGridCols3
      : gridCols === 2
        ? styles.imageGridCols2
        : '';

  const renderStillImg = (im, idx, sizes, driftBias = 0) => {
    const url = resolveImageUrl(im);
    if (!url) return null;
    const alt = im.alt || item.title || `Still ${idx + 1}`;
    const sBase = resolveImageParallaxStrength(im, strength);
    const s = Math.min(120, Math.max(0, sBase + driftBias));
    return (
      <WorkStillsParallaxMedia
        key={`${url}-${idx}`}
        rootRef={parallaxRootRef}
        strength={s}
      >
        <Image
          src={url}
          alt={alt}
          width={1200}
          height={1500}
          className={styles.img}
          sizes={sizes}
        />
      </WorkStillsParallaxMedia>
    );
  };

  const textBlock = (
    <div className={styles.text}>
      {item.title && <h2 className={styles.title}>{item.title}</h2>}
      {item.description && (
        <p className={styles.desc}>{item.description}</p>
      )}
    </div>
  );

  if (layout === 'twoColumn') {
    const pair = images.slice(0, 2);
    return (
      <article
        ref={parallaxRootRef}
        className={`${styles.block} ${styles.blockStaggerPair}`}
      >
        <div className={`${styles.mediaShell} ${styles.mediaShellPair}`}>
          <div className={styles.pairRow}>
            {pair.map((im, idx) => (
              <div
                key={`${resolveImageUrl(im)}-${idx}`}
                className={styles.pairCell}
              >
                {renderStillImg(
                  im,
                  idx,
                  '(max-width: 767px) 100vw, 48vw',
                  idx === 0 ? -20 : 20,
                )}
              </div>
            ))}
          </div>
        </div>
        <div
          className={`${styles.text} ${styles.textBelowPair} ${styles.textHelvPair}`}
        >
          {item.title && <h2 className={styles.title}>{item.title}</h2>}
          {item.description && (
            <p className={`${styles.desc} ${styles.descHelv}`}>{item.description}</p>
          )}
        </div>
      </article>
    );
  }

  if (layout === 'dualImageTextRow') {
    const pair = images.slice(0, 2);
    return (
      <article
        ref={parallaxRootRef}
        className={`${styles.block} ${styles.blockPairFlat}`}
      >
        <div className={`${styles.mediaShell} ${styles.mediaShellPair}`}>
          <div className={`${styles.pairRow} ${styles.pairRowFlat}`}>
            {pair.map((im, idx) => (
              <div
                key={`${resolveImageUrl(im)}-${idx}`}
                className={styles.pairCell}
              >
                {renderStillImg(
                  im,
                  idx,
                  '(max-width: 767px) 100vw, 48vw',
                )}
              </div>
            ))}
          </div>
        </div>
        <div
          className={`${styles.text} ${styles.textBelowPair} ${styles.textHelvPair}`}
        >
          {item.title && <h2 className={styles.title}>{item.title}</h2>}
          {item.description && (
            <p className={`${styles.desc} ${styles.descHelv}`}>{item.description}</p>
          )}
        </div>
      </article>
    );
  }

  if (layout === 'threeColumn') {
    const trio = images.slice(0, 3);
    return (
      <article
        ref={parallaxRootRef}
        className={`${styles.block} ${styles.blockThreeAligned}`}
      >
        <div className={styles.mediaShell}>
          {trio.length > 0 && (
            <div className={`${styles.imageGrid} ${styles.imageGridCols3}`}>
              {trio.map((im, idx) =>
                renderStillImg(
                  im,
                  idx,
                  '(max-width: 767px) 100vw, (max-width: 899px) 50vw, 33vw',
                  idx === 0 ? -18 : idx === 2 ? 18 : 0,
                ),
              )}
            </div>
          )}
        </div>
        <div
          className={`${styles.text} ${styles.textBelowPair} ${styles.textHelvPair}`}
        >
          {item.title && <h2 className={styles.title}>{item.title}</h2>}
          {item.description && (
            <p className={`${styles.desc} ${styles.descHelv}`}>{item.description}</p>
          )}
        </div>
      </article>
    );
  }

  const layoutMod = layout === 'fullBleed'
    ? styles.blockFullBleed
    : styles.blockCentered;

  const imageGridClass = [styles.imageGrid, gridExtra].filter(Boolean).join(' ');

  return (
    <article ref={parallaxRootRef} className={`${styles.block} ${layoutMod}`}>
      <div className={styles.mediaShell}>
        {count > 0 && (
          <div className={imageGridClass}>
            {images.map((im, idx) =>
              renderStillImg(
                im,
                idx,
                '(max-width: 767px) 100vw, (max-width: 899px) 50vw, 33vw',
              ),
            )}
          </div>
        )}
      </div>
      {textBlock}
    </article>
  );
}
