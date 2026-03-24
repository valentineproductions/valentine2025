'use client';

import { useState, useRef, useEffect } from 'react';
import { PortableText } from '@portabletext/react';
import { defaultPortableTextComponents } from '@/app/lib/portableTextConfig';
import styles from './DirectorPageVideoV3.module.css';

export default function DirectorPageVideoV3({ member }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [bioOpen, setBioOpen] = useState(false);
  const [bioClosing, setBioClosing] = useState(false);
  const [bioUppercase, setBioUppercase] = useState(false);
  const [animationsDone, setAnimationsDone] = useState(false);
  const longPressRef = useRef(null);
  const videoRefs = useRef([]);

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
    if (!bioOpen) return;
    const handleEscape = (e) => { if (e.key === 'Escape') setBioOpen(false); };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [bioOpen]);

  useEffect(() => {
    if (!bioOpen && !bioClosing) setBioUppercase(false);
  }, [bioOpen, bioClosing]);

  const handleBioClose = () => {
    setBioClosing(true);
  };

  const handleBioAnimationEnd = (e) => {
    if (bioClosing && e.target === e.currentTarget) {
      setBioOpen(false);
      setBioClosing(false);
    }
  };

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
    <div className={styles.wrapper}>
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
      <div className={styles.centerBar}>
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
        <>
        {/* Director name brought upfront, same position, above modal */}
        <div className={`${styles.directorNameOverlay} ${bioClosing ? styles.bioOverlayClosing : styles.bioOverlayEnter}`}>
          <span className={styles.directorNameOverlayText}>
            {member?.fullName?.toUpperCase() || member?.fullName}
          </span>
        </div>
        <div
          className={`${styles.bioOverlay} ${bioClosing ? styles.bioOverlayClosing : styles.bioOverlayEnter}`}
          role="dialog"
          aria-modal="true"
          aria-label="Biography"
          onAnimationEnd={handleBioAnimationEnd}
        >
          <div className={styles.bioBackdrop} onClick={handleBioClose} />
          <div className={styles.bioWrapper} onClick={(e) => e.stopPropagation()}>
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
        </>
      )}
    </div>
  );
}
