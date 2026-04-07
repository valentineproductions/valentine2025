'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useDirectorSwipeEnabled } from '@/app/lib/useDirectorSwipeEnabled';
import styles from './DirectorsPageFullBleed.module.css';

const SWIPE_MIN_PX = 56;

export default function DirectorsPageFullBleed({ directors }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const isSwipeEnabled = useDirectorSwipeEnabled();
  const videoRefs = useRef([]);
  const swipeTouchStartRef = useRef(null);
  const nameLinkRefs = useRef([]);

  const withClips = useMemo(
    () =>
      (directors || []).filter((d) => d?.directorsPageClip?.asset?.url),
    [directors]
  );

  const count = withClips.length;

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

  const handleSwipeTouchStart = useCallback(
    (e) => {
      if (!isSwipeEnabled || count < 2) return;
      const t = e.targetTouches?.[0];
      if (!t) return;
      swipeTouchStartRef.current = { x: t.clientX, y: t.clientY };
    },
    [isSwipeEnabled, count]
  );

  const handleSwipeTouchEnd = useCallback(
    (e) => {
      const start = swipeTouchStartRef.current;
      swipeTouchStartRef.current = null;
      if (!start || !isSwipeEnabled || count < 2) return;
      const t = e.changedTouches?.[0];
      if (!t) return;
      const dx = t.clientX - start.x;
      const dy = t.clientY - start.y;
      if (Math.abs(dy) < SWIPE_MIN_PX || Math.abs(dy) < Math.abs(dx)) return;
      if (dy < 0) {
        setActiveIndex((i) => Math.min(count - 1, i + 1));
      } else {
        setActiveIndex((i) => Math.max(0, i - 1));
      }
    },
    [isSwipeEnabled, count]
  );

  const focusNameLink = useCallback(
    (index) => {
      const i = Math.max(0, Math.min(count - 1, index));
      requestAnimationFrame(() => {
        nameLinkRefs.current[i]?.focus();
      });
    },
    [count]
  );

  const handleNameKeyDown = useCallback(
    (e, index) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        const next = Math.min(count - 1, index + 1);
        if (next !== index) {
          setActiveIndex(next);
          focusNameLink(next);
        }
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        const prev = Math.max(0, index - 1);
        if (prev !== index) {
          setActiveIndex(prev);
          focusNameLink(prev);
        }
      }
    },
    [count, focusNameLink]
  );

  if (count === 0) {
    return null;
  }

  const handleMouseEnter = (index) => setActiveIndex(index);

  const getVideoType = (url) =>
    url?.endsWith('.webm') ? 'video/webm' : 'video/mp4';

  return (
    <div
      className={styles.wrapper}
      data-director-blur-root
      onTouchStart={handleSwipeTouchStart}
      onTouchEnd={handleSwipeTouchEnd}
    >
      {withClips.map((director, index) => {
        const url = director.directorsPageClip?.asset?.url;
        const isActive = activeIndex === index;

        return (
          <video
            key={director._id}
            ref={(el) => {
              videoRefs.current[index] = el;
            }}
            className={`${styles.videoLayer} ${isActive ? styles.active : ''}`}
            muted
            loop
            playsInline
            preload={index === 0 ? 'auto' : 'metadata'}
          >
            {url && <source src={url} type={getVideoType(url)} />}
          </video>
        );
      })}

      <nav className={styles.namesOverlay} aria-label="Directors">
        {withClips.map((director, index) => {
          const isActive = activeIndex === index;
          const label =
            director.fullName?.toUpperCase() || director.fullName || 'Director';
          return (
            <Link
              key={director._id}
              ref={(el) => {
                nameLinkRefs.current[index] = el;
              }}
              href={`/directors/${director.slug}`}
              className={`${styles.nameLink} ${isActive ? styles.nameLinkActive : ''} ${styles.nameLinkAnimate}`}
              style={{ '--name-delay': `${index * 80}ms` }}
              aria-current={isActive ? 'true' : undefined}
              aria-label={`${label}${isActive ? ', preview playing' : ''}`}
              onMouseEnter={() => handleMouseEnter(index)}
              onFocus={() => handleMouseEnter(index)}
              onKeyDown={(e) => handleNameKeyDown(e, index)}
            >
              {label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
