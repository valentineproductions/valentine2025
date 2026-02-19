'use client';

import Link from 'next/link';
import styles from './DirectorsListOpt5.module.css';
import { categoryToSlug } from '@/app/utils/categoryUtils';

export default function DirectorsListOpt5({ directors }) {
  if (!directors || directors.length === 0) {
    return null;
  }

  const toTitleCase = (text) => {
    if (!text) return '';
    return text
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className={styles.directorsList}>
      <div className={styles.container}>
        {directors.map((director, idx) => {
          const directorUrl = `/directors/${director.slug}`;

          return (
            <div
              key={director._id}
              className={styles.row}
            >
              <div className={styles.left}>
                <Link href={directorUrl} className={styles.nameLink}>
                  <div className={styles.nameUpper}>
                    {director.fullName}
                  </div>
                </Link>
              </div>
              <div className={styles.right}>
                {director.talentPosition && (
                  <div className={styles.position}>
                    {toTitleCase(director.talentPosition)}
                  </div>
                )}
                {director.categories && director.categories.length > 0 && (
                  <div className={styles.categories}>
                    {director.categories.map((category, index) => {
                      const slug = categoryToSlug(category);
                      const url = `/directors/category/${slug}`;
                      const isLast = index === director.categories.length - 1;
                      return (
                        <span key={index} className={styles.categoryItem}>
                          <Link href={url} className={styles.categoryLink}>
                            {category}
                          </Link>
                          {!isLast && <span className={styles.separator}>, </span>}
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
