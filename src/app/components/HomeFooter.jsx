'use client';

import styles from './HomeFooter.module.css';

export default function HomeFooter({ homePageData }) {
  const leftText = (homePageData?.locations || '').trim();
  const email = homePageData?.email;

  if (!leftText && !email) return null;

  return (
    <div className={`${styles.root} ${styles.column}`}>
      {leftText && <div className={styles.left}>{leftText}</div>}
      {email && (
        <div className={styles.right}>
          <a href={`mailto:${email}`}>{email}</a>
        </div>
      )}
    </div>
  );
}
