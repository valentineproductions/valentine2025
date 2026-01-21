'use client';

import { PortableText } from "@portabletext/react";
import styles from './TalentHorizontalHeader.module.css';

export default function LegalHorizontalHeader({ pageTitle, pageDescription, contactInfo }) {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.leftColumns}>
          <h1 className={styles.pageTitle}>{pageTitle}</h1>
        </div>
        <div className={styles.column3}>
          <div className={styles.pageDescription}>
            {pageDescription && <PortableText value={pageDescription} />}
          </div>
          <div className="contactInfo">
            {contactInfo && <PortableText value={contactInfo} />}
          </div>
        </div>
      </div>
    </header>
  );
}
