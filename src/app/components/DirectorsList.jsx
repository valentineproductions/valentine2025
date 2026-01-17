'use client';

import Image from 'next/image';
import Link from 'next/link';
import styles from './DirectorsList.module.css';
import { categoryToSlug } from '@/app/utils/categoryUtils';

export default function DirectorsList({ directors }) {
  if (!directors || directors.length === 0) {
    return null;
  }

  // Format name to title case (first letter of each word uppercase, rest lowercase)
  const formatName = (name) => {
    if (!name) return '';
    return name
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className={styles.directorsList}>
      <div className={styles.container}>
        {directors.map((director) => {
          const directorUrl = `/talent/${director.slug}`;
          
          return (
            <div key={director._id} className={styles.directorRow}>
            {/* Left Column: Picture + Name */}
            <div className={styles.leftColumn}>
              {director.image?.asset?.url && (
                <Link href={directorUrl} className={styles.imageLink}>
                  <div className={styles.imageWrapper}>
                    <Image
                      src={director.image.asset.url}
                      alt={director.image.alt || director.fullName}
                      width={200}
                      height={250}
                      className={styles.directorImage}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                      quality={80}
                      loading="lazy"
                      unoptimized={director.image?.asset?.url?.endsWith('.gif')}
                    />
                  </div>
                </Link>
              )}
              <Link href={directorUrl} className={styles.nameLink}>
                <div className={styles.directorName}>
                  {formatName(director.fullName)}
                </div>
              </Link>
            </div>

            {/* Middle Column: Categories */}
            <div className={styles.middleColumn}>
              {director.categories && director.categories.length > 0 ? (
                <ul className={styles.categoriesList}>
                  {director.categories.map((category, index) => {
                    const categorySlug = categoryToSlug(category);
                    const categoryUrl = `/talent/category/${categorySlug}`;
                    return (
                      <li key={index} className={styles.categoryItem}>
                        <Link href={categoryUrl} className={styles.categoryLink}>
                          {category}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <span className={styles.noCategories}>—</span>
              )}
            </div>

            {/* Right Column: Position, City, Projects CTA */}
            <div className={styles.rightColumn}>
              <div className={styles.positionInfo}>
                {director.talentPosition && (
                  <div className={styles.position}>{director.talentPosition}</div>
                )}
                {director.city && (
                  <div className={styles.city}>{director.city}</div>
                )}
              </div>
              <Link href={directorUrl} className={styles.projectsCTA}>
                Projects
              </Link>
            </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
