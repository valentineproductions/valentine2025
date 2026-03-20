'use client';

import { PortableText } from "@portabletext/react";
import { defaultPortableTextComponents } from "@/app/lib/portableTextConfig";
import styles from './CategoryPageOpt3.module.css';

export default function CategoryPageOpt3({ categoryName, directorsCount, pageDescription }) {
  const directorsText = `${directorsCount} DIRECTORS IN THIS CATEGORY`;

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.leftColumns}>
          <h1 className={styles.categoryTitle}>{categoryName}</h1>
          <div className={styles.directorsCount}>
            {directorsText}
          </div>
        </div>
        <div className={styles.column3}>
          <div className={styles.pageDescription}>
            <PortableText value={pageDescription} components={defaultPortableTextComponents} />
          </div>
        </div>
      </div>
    </header>
  );
}




