'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import styles from './DirectorsPageFullBleed.module.css';

export default function DirectorsPageFullBleed({ directors }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const videoRefs = useRef([]);

  // directors must have directorsPageClip with asset.url
  const withClips = (directors || []).filter(
    (d) => d?.directorsPageClip?.asset?.url
  );

  useEffect(() => {
    videoRefs.current.forEach((video, i) => {
      if (!video) return;
      if (i === activeIndex) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, [activeIndex]);

  if (withClips.length === 0) {
    return null;
  }

  const handleMouseEnter = (index) => setActiveIndex(index);

  const getVideoType = (url) =>
    url?.endsWith('.webm') ? 'video/webm' : 'video/mp4';

  return (
    <div className={styles.wrapper}>
      {withClips.map((director, index) => {
        const url = director.directorsPageClip?.asset?.url;
        const isActive = activeIndex === index;

        return (
          <video
            key={director._id}
            ref={(el) => (videoRefs.current[index] = el)}
            className={`${styles.videoLayer} ${isActive ? styles.active : ''}`}
            muted
            loop
            playsInline
            preload={index === 0 ? 'auto' : 'metadata'}
          >
            {url && (
              <source src={url} type={getVideoType(url)} />
            )}
          </video>
        );
      })}

      <div className={styles.namesOverlay}>
        {withClips.map((director, index) => {
          const isActive = activeIndex === index;
          return (
            <Link
              key={director._id}
              href={`/directors/${director.slug}`}
              className={`${styles.nameLink} ${isActive ? styles.nameLinkActive : ''} ${styles.nameLinkAnimate}`}
              style={{ '--name-delay': `${index * 80}ms` }}
              onMouseEnter={() => handleMouseEnter(index)}
            >
              {director.fullName?.toUpperCase() || director.fullName}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
