'use client';

import { PortableText } from "@portabletext/react";
import { defaultPortableTextComponents } from "@/app/lib/portableTextConfig";
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
            {pageDescription && <PortableText value={pageDescription} components={defaultPortableTextComponents} />}
          </div>
          <div className="contactInfo">
            {contactInfo && <PortableText value={contactInfo} components={defaultPortableTextComponents} />}
          </div>
        </div>
      </div>
    </header>
  );
}
