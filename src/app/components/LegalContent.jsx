'use client';

import { PortableText } from '@portabletext/react';
import { defaultPortableTextComponents } from '@/app/lib/portableTextConfig';
import styles from './LegalContent.module.css';

export default function LegalContent({ value }) {
  if (!value) return null;
  return (
    <div className={styles.pageWrapper}>
      <div className={styles.content}>
        <div className={styles.portableText}>
          <PortableText value={value} components={defaultPortableTextComponents} />
        </div>
      </div>
    </div>
  );
}

