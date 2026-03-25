'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { PortableText } from '@portabletext/react';
import { defaultPortableTextComponents } from '@/app/lib/portableTextConfig';
import styles from './DirectorPageVideoV3.module.css';

const MOBILE_SWIPE_MAX_WIDTH = 767;
const SWIPE_MIN_PX = 56;

export default function DirectorPageVideoV3({ member }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [bioOpen, setBioOpen] = useState(false);
  const [bioClosing, setBioClosing] = useState(false);
  const [bioUppercase, setBioUppercase] = useState(false);
  const [animationsDone, setAnimationsDone] = useState(false);
  const [isMobileViewport, setIsMobileViewport] = useState(false);
  const longPressRef = useRef(null);
  const videoRefs = useRef([]);
  const swipeTouchStartRef = useRef(null);

  // Build items: profileProjects with profileClip, or fallback to directorsPageClip
  const items = (() => {
    const profile = (member?.profileProjects || [])
      .filter((p) => p?.profileClip?.asset?.url)
      .map((p, i) => ({
        id: p.profileClip?.asset?._id || `profile-${i}`,
        name: (p.name || 'Untitled').toUpperCase(),
        url: p.profileClip?.asset?.url,
      }));
    if (profile.length > 0) return profile;
    const fallback = member?.directorsPageClip?.asset?.url;
    if (fallback) {
      return [{ id: 'fallback', name: (member?.fullName || '').toUpperCase(), url: fallback }];
    }
    return [];
  })();

  const handleBioClose = useCallback(() => {
    setBioClosing(true);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${MOBILE_SWIPE_MAX_WIDTH}px)`);
    const onChange = () => setIsMobileViewport(mq.matches);
    onChange();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

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

  useEffect(() => {
    if (!bioOpen && !bioClosing) return;
    const handleEscape = (e) => {
      if (e.key === 'Escape') handleBioClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [bioOpen, bioClosing, handleBioClose]);

  useEffect(() => {
    if (!bioOpen && !bioClosing) setBioUppercase(false);
  }, [bioOpen, bioClosing]);

  const handleBioAnimationEnd = (e) => {
    if (bioClosing && e.target === e.currentTarget) {
      setBioOpen(false);
      setBioClosing(false);
    }
  };

  const handleSwipeTouchStart = useCallback(
    (e) => {
      if (!isMobileViewport || bioOpen || bioClosing || items.length < 2) return;
      const t = e.targetTouches?.[0];
      if (!t) return;
      swipeTouchStartRef.current = { x: t.clientX, y: t.clientY };
    },
    [isMobileViewport, bioOpen, bioClosing, items.length]
  );

  const handleSwipeTouchEnd = useCallback(
    (e) => {
      const start = swipeTouchStartRef.current;
      swipeTouchStartRef.current = null;
      if (!start || !isMobileViewport || bioOpen || bioClosing || items.length < 2) return;
      const t = e.changedTouches?.[0];
      if (!t) return;
      const dx = t.clientX - start.x;
      const dy = t.clientY - start.y;
      if (Math.abs(dy) < SWIPE_MIN_PX || Math.abs(dy) < Math.abs(dx)) return;
      /* Finger moves up → next clip; moves down → previous */
      if (dy < 0) {
        setActiveIndex((i) => Math.min(items.length - 1, i + 1));
      } else {
        setActiveIndex((i) => Math.max(0, i - 1));
      }
    },
    [isMobileViewport, bioOpen, bioClosing, items.length]
  );

  if (items.length === 0) {
    return null;
  }

  const handleMouseEnter = (index) => setActiveIndex(index);
  const handleDotClick = (index) => setActiveIndex(index);

  const handleBioLongPressStart = () => {
    longPressRef.current = setTimeout(() => {
      setBioUppercase((prev) => !prev);
      longPressRef.current = null;
    }, 500);
  };
  const handleBioLongPressEnd = () => {
    if (longPressRef.current) {
      clearTimeout(longPressRef.current);
      longPressRef.current = null;
    }
  };
  const getVideoType = (url) =>
    url?.endsWith('.webm') ? 'video/webm' : 'video/mp4';
  const currentItem = items[activeIndex];
  const hasBio = member?.bio && member.bio.length > 0;

  // Remove animation class once last item finishes (enables cascade for opacity)
  const handleIconAnimationEnd = () => {
    setAnimationsDone(true);
  };

  return (
    <div
      className={styles.wrapper}
      onTouchStart={handleSwipeTouchStart}
      onTouchEnd={handleSwipeTouchEnd}
    >
      {items.map((item, index) => {
        const isActive = activeIndex === index;
        return (
          <video
            key={item.id}
            ref={(el) => (videoRefs.current[index] = el)}
            className={`${styles.videoLayer} ${isActive ? styles.active : ''}`}
            muted
            loop
            playsInline
            preload={index === 0 ? 'auto' : 'metadata'}
          >
            {item.url && (
              <source src={item.url} type={getVideoType(item.url)} />
            )}
          </video>
        );
      })}

      {/* Center bar: vertically centered, director name + video name */}
      <div
        className={`${styles.centerBar} ${bioOpen || bioClosing ? styles.centerBarBioOpen : ''}`}
      >
        <div className={styles.directorInfo}>
          <div className={`${styles.directorInfoLine} ${styles.directorInfoLineAnimate}`}>
            <span className={styles.directorName}>
              {member?.fullName?.toUpperCase() || member?.fullName}
            </span>
            {' '}
            <br className={styles.mobileBreak} />
            <span className={styles.projectName}>{currentItem?.name || ''}</span>
          </div>
        </div>

        <div className={styles.projectNav} aria-label="Project navigation">
          {items.map((item, index) => {
            const isActive = activeIndex === index;
            return (
              <button
                key={item.id}
                type="button"
                className={`${styles.projectRow} ${!animationsDone ? styles.projectRowAnimate : ''} ${isActive ? styles.projectRowActive : ''}`}
                style={{ '--icon-delay': `${index * 80}ms` }}
                onMouseEnter={() => handleMouseEnter(index)}
                onClick={() => handleDotClick(index)}
                onAnimationEnd={index === items.length - 1 ? handleIconAnimationEnd : undefined}
              >
                <span className={styles.projectItemName}>{item.name}</span>
                <span
                  className={`${styles.mediaIcon} ${isActive ? styles.mediaIconPlay : styles.mediaIconStop}`}
                  aria-hidden
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* BIO link - fixed at bottom, same on mobile */}
      {hasBio && (
        <div className={`${styles.bioBar} ${styles.bioBarAnimate}`} style={{ '--bio-delay': `${100 + items.length * 80}ms` }}>
          <button
            type="button"
            className={styles.bioLink}
            onClick={() => setBioOpen(true)}
          >
            BIO
          </button>
        </div>
      )}

      {/* Bio overlay - click anywhere to close, video keeps playing underneath */}
      {(bioOpen || bioClosing) && (
        <div
          className={`${styles.bioOverlay} ${bioClosing ? styles.bioOverlayClosing : styles.bioOverlayEnter}`}
          role="dialog"
          aria-modal="true"
          aria-label="Biography"
          onAnimationEnd={handleBioAnimationEnd}
        >
          <div className={styles.bioBackdrop} onClick={handleBioClose} />
          <div className={styles.bioColumn} onClick={(e) => e.stopPropagation()}>
            <div className={styles.bioColumnStack}>
              <div className={styles.bioTitleBlock}>
                <div className={styles.directorInfoLine}>
                  <span className={styles.directorName}>
                    {member?.fullName?.toUpperCase() || member?.fullName}
                  </span>
                  {' '}
                  <br className={styles.mobileBreak} />
                  <span className={styles.projectName}>{currentItem?.name || ''}</span>
                </div>
              </div>
              <div className={styles.bioWrapper}>
                <div
                  className={styles.bioPanel}
                  onClick={(e) => e.stopPropagation()}
                  onMouseDown={handleBioLongPressStart}
                  onMouseUp={handleBioLongPressEnd}
                  onMouseLeave={handleBioLongPressEnd}
                  onTouchStart={handleBioLongPressStart}
                  onTouchEnd={handleBioLongPressEnd}
                  onContextMenu={(e) => e.preventDefault()}
                >
                  <div
                    className={`${styles.bioContent} ${bioUppercase ? styles.bioContentUppercase : ''}`}
                  >
                    <PortableText
                      value={member.bio}
                      components={defaultPortableTextComponents}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
