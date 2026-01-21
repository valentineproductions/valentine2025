'use client';

import { PortableText } from '@portabletext/react';
import styles from './LegalContent.module.css';

export default function LegalContent({ value }) {
  if (!value) return null;
  return (
    <div className={styles.pageWrapper}>
      <div className={styles.content}>
        <div className={styles.portableText}>
          <PortableText value={value} />
        </div>
      </div>
    </div>
  );
}

