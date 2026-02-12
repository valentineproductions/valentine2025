'use client';

import Image from 'next/image';
import Link from 'next/link';
import styles from './DirectorsListOpt2v4.module.css';
import { categoryToSlug } from '@/app/utils/categoryUtils';

export default function DirectorsListOpt2v4({ directors }) {
  if (!directors || directors.length === 0) {
    return null;
  }

  // Format name to uppercase
  const formatName = (name) => {
    if (!name) return '';
    return name.toUpperCase();
  };

  // Format text to title case (first letter of each word uppercase)
  const formatTitleCase = (text) => {
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
        {directors.map((director) => {
          const directorUrl = `/directors/${director.slug}`;
          
          return (
            <div key={director._id} className={styles.directorColumn}>
              {/* Left Side: Image (30%) */}
              <div className={styles.imageSide}>
                {director.image?.asset?.url && (
                  <Link href={directorUrl} className={styles.imageLink}>
                    <div className={styles.imageWrapper}>
                      <Image
                        src={director.image.asset.url}
                        alt={director.image.alt || director.fullName}
                        width={170}
                        height={210}
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

              {/* Right Side: Text Info (70%) */}
              <div className={styles.textSide}>
                <Link href={directorUrl} className={styles.nameLink}>
                  <div className={styles.directorName}>
                    {formatName(director.fullName)}
                  </div>
                </Link>

                <div className={styles.positionInfo}>
                  {director.talentPosition && director.city ? (
                    <div className={styles.positionCity}>
                      {formatTitleCase(director.talentPosition)}, {formatTitleCase(director.city)}
                    </div>
                  ) : director.talentPosition ? (
                    <div className={styles.positionCity}>
                      {formatTitleCase(director.talentPosition)}
                    </div>
                  ) : director.city ? (
                    <div className={styles.positionCity}>
                      {formatTitleCase(director.city)}
                    </div>
                  ) : null}
                </div>

                {director.categories && director.categories.length > 0 && (
                  <div className={styles.categoriesContainer}>
                    {director.categories.map((category, index) => {
                      const categorySlug = categoryToSlug(category);
                      const categoryUrl = `/directors/category/${categorySlug}`;
                      const isLast = index === director.categories.length - 1;
                      return (
                        <span key={index}>
                          <Link
                            href={categoryUrl}
                            className={styles.categoryLink}
                          >
                            {formatTitleCase(category)}
                          </Link>
                          {isLast ? '.' : ', '}
                        </span>
                      );
                    })}
                  </div>
                )}

                <div className={styles.bottomSection}>
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


