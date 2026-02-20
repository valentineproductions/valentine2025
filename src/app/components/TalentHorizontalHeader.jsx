'use client';

import { PortableText } from "@portabletext/react";
import styles from './TalentHorizontalHeader.module.css';

export default function TalentHorizontalHeader({ indexTitle, pageTitle, pageDescription }) {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.leftColumns}>
          <h1 className={styles.pageTitle}>{indexTitle}</h1>
        </div>
      </div>
    </header>
  );
}
