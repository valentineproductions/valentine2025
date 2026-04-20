'use client';

import Image from 'next/image';
import { resolveBackgroundLogoUrl } from './workStillsUtils';
import styles from './WorkStills.module.css';

/**
 * @param {'legacy' | 'interpolate'} scrollMode
 *   interpolate: opacity from --ws-body-opacity on ancestor .root (scroll-driven).
 */
export default function WorkStillsBackgroundMark({ logo, fallbackLogo, fadeState, scrollMode = 'legacy' }) {
  const url = resolveBackgroundLogoUrl(logo) || resolveBackgroundLogoUrl(fallbackLogo);
  if (!url) return null;

  if (scrollMode === 'interpolate') {
    return (
      <div className={styles.bgMark} aria-hidden>
        <Image
          src={url}
          alt=""
          width={720}
          height={280}
          className={styles.bgMarkImg}
          style={{ opacity: 'var(--ws-body-opacity, 0)' }}
          sizes="(max-width: 900px) 88vw, 720px"
          priority={false}
        />
      </div>
    );
  }

  return (
    <div className={styles.bgMark} aria-hidden>
      <Image
        src={url}
        alt=""
        width={720}
        height={280}
        className={
          [
            styles.bgMarkImg,
            fadeState === 'gone' ? styles.bgMarkImgGone : '',
            fadeState === 'hidden' ? styles.bgMarkImgHidden : '',
          ].filter(Boolean).join(' ')
        }
        sizes="(max-width: 900px) 88vw, 720px"
        priority={false}
      />
    </div>
  );
}
