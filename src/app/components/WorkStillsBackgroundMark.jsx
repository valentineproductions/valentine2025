'use client';

import Image from 'next/image';
import { resolveBackgroundLogoUrl } from './workStillsUtils';
import styles from './WorkStills.module.css';

// Logo taxonomy: hero (overlay white), body background (this watermark), footer (tail slide-in)
export default function WorkStillsBackgroundMark({ logo, fallbackLogo, fadeState }) {
  const url = resolveBackgroundLogoUrl(fallbackLogo) || resolveBackgroundLogoUrl(logo);
  if (!url) return null;

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
