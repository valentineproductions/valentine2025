'use client';

import Image from 'next/image';
import Link from 'next/link';
import styles from './DirectorsListv4.module.css';
import { categoryToSlug } from '@/app/utils/categoryUtils';

export default function DirectorsListv4({ directors }) {
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
            <div key={director._id} className={styles.directorColumn}>
              {/* Left Side: Image */}
              <div className={styles.imageSide}>
                {director.image?.asset?.url && (
                  <Link href={directorUrl} className={styles.imageLink}>
                    <div className={styles.imageWrapper}>
                      <Image
                        src={director.image.asset.url}
                        alt={director.image.alt || director.fullName}
                        width={225}
                        height={320}
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
              </div>

              {/* Right Side: Text Info */}
              <div className={styles.textSide}>
                <Link href={directorUrl} className={styles.nameLink}>
                  <div className={styles.directorName}>
                    {formatName(director.fullName)}
                  </div>
                </Link>

                <div className={styles.positionInfo}>
                  {director.talentPosition && (
                    <div className={styles.position}>{director.talentPosition}</div>
                  )}
                  {director.city && (
                    <div className={styles.city}>{director.city}</div>
                  )}
                </div>

                <div className={styles.bottomSection}>
                  <hr className={styles.divider} />
                  
                  {director.categories && director.categories.length > 0 && (
                    <div className={styles.categoriesContainer}>
                      {director.categories.map((category, index) => {
                        const categorySlug = categoryToSlug(category);
                        const categoryUrl = `/talent/category/${categorySlug}`;
                        return (
                          <Link
                            key={index}
                            href={categoryUrl}
                            className={styles.categoryTag}
                          >
                            {category}
                          </Link>
                        );
                      })}
                    </div>
                  )}

                  <Link href={directorUrl} className={styles.projectsCTA}>
                    View Projects →
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

