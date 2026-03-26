'use client';

import Image from 'next/image';
import { resolveBackgroundLogoUrl } from './workStillsUtils';
import styles from './WorkStills.module.css';

export default function WorkStillsBackgroundMark({ logo, fallbackLogo }) {
  const url = resolveBackgroundLogoUrl(logo) || resolveBackgroundLogoUrl(fallbackLogo);
  if (!url) return null;

  return (
    <div className={styles.bgMark} aria-hidden>
      <Image
        src={url}
        alt=""
        width={720}
        height={280}
        className={styles.bgMarkImg}
        sizes="(max-width: 900px) 88vw, 720px"
        priority={false}
      />
    </div>
  );
}
