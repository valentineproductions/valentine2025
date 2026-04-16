'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import { useRouter } from 'next/navigation';
import { PortableText } from '@portabletext/react';
import { defaultPortableTextComponents } from '@/app/lib/portableTextConfig';
import { useDirectorSwipeEnabled } from '@/app/lib/useDirectorSwipeEnabled';
import DirectorProfilePlayCursor from '@/app/components/DirectorProfilePlayCursor';
import DirectorNavigateTransition from '@/app/components/DirectorNavigateTransition';
import styles from './DirectorPageVideoV3.module.css';

const SWIPE_MIN_PX = 56;

export default function DirectorPageVideoV3({ member }) {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const [bioOpen, setBioOpen] = useState(false);
  const [bioClosing, setBioClosing] = useState(false);
  const [bioUppercase, setBioUppercase] = useState(false);
  const [animationsDone, setAnimationsDone] = useState(false);
  const isSwipeEnabled = useDirectorSwipeEnabled();
  const longPressRef = useRef(null);
  const videoRefs = useRef([]);
  const swipeTouchStartRef = useRef(null);
  const swipeLockRef = useRef(false);
  const projectBtnRefs = useRef([]);
  const bioBtnRef = useRef(null);
  const [dividerStyle, setDividerStyle] = useState(null);
  const [dividerVisible, setDividerVisible] = useState(false);
  const bioBarRef = useRef(null);
  const talentCornerRef = useRef(null);
  const clipProgressFillRef = useRef(null);
  const clipProgressQuickYRef = useRef(null);
  const [pendingNav, setPendingNav] = useState(null);

  // Build items: profileProjects with profileClip, or fallback to directorsPageClip
  const items = (() => {
    const profile = (member?.profileProjects || [])
      .filter((p) => p?.profileClip?.asset?.url)
      .map((p, i) => ({
        id: p.profileClip?.asset?._id || `profile-${i}`,
        name: p.name || 'Untitled',
        url: p.profileClip?.asset?.url,
        projectSlug: p.slug || null,
      }));
    if (profile.length > 0) return profile;
    const fallback = member?.directorsPageClip?.asset?.url;
    if (fallback) {
      return [{ id: 'fallback', name: member?.fullName || '', url: fallback }];
    }
    return [];
  })();

  const handleBioClose = useCallback(() => {
    setBioClosing(true);
  }, []);

  const handleBioOpen = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('valentine-close-contact'));
    }
    setBioClosing(false);
    setBioOpen(true);
  }, []);

  const handleBioToggle = useCallback(() => {
    if (bioOpen && !bioClosing) {
      handleBioClose();
    } else {
      handleBioOpen();
    }
  }, [bioOpen, bioClosing, handleBioOpen, handleBioClose]);

  useEffect(() => {
    const bioPaused = bioOpen || bioClosing;
    videoRefs.current.forEach((video, i) => {
      if (!video) return;
      if (i === activeIndex) {
        if (bioPaused) {
          video.pause();
        } else {
          video.play().catch(() => {});
        }
      } else {
        video.pause();
      }
    });
  }, [activeIndex, bioOpen, bioClosing]);

  /**
   * Reset clip + progress bar when switching videos. Must recreate gsap.quickTo after
   * killTweensOf — killing tweens on the element invalidates the function returned
   * by quickTo(), so the bar would stop updating until items.length changed.
   */
  useEffect(() => {
    const v = videoRefs.current[activeIndex];
    if (v) {
      try {
        v.currentTime = 0;
      } catch (_) {}
    }
    const fill = clipProgressFillRef.current;
    if (!fill || items.length <= 1) {
      clipProgressQuickYRef.current = null;
      return;
    }
    gsap.killTweensOf(fill);
    gsap.set(fill, { transformOrigin: 'bottom center', scaleY: 1 });
    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      clipProgressQuickYRef.current = null;
    } else {
      clipProgressQuickYRef.current = gsap.quickTo(fill, 'scaleY', {
        duration: 0.55,
        ease: 'power2.out',
      });
    }
  }, [activeIndex, items.length]);

  const handleClipTimeUpdate = useCallback(
    (e) => {
      if (bioOpen || bioClosing) return;
      const v = e.currentTarget;
      const idx = videoRefs.current.indexOf(v);
      if (idx !== activeIndex) return;
      const fill = clipProgressFillRef.current;
      if (!fill || items.length <= 1) return;
      if (!v.duration || !isFinite(v.duration)) {
        gsap.set(fill, { scaleY: 1 });
        return;
      }
      const remaining = Math.max(0, Math.min(1, 1 - v.currentTime / v.duration));
      const reduced =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduced) {
        gsap.set(fill, { scaleY: remaining });
      } else {
        clipProgressQuickYRef.current?.(remaining);
      }
    },
    [activeIndex, bioOpen, bioClosing, items.length]
  );

  const handleClipEnded = useCallback(() => {
    if (bioOpen || bioClosing) return;
    if (items.length <= 1) return;
    setActiveIndex((i) => (i + 1) % items.length);
  }, [items.length, bioOpen, bioClosing]);

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

  useEffect(() => {
    const onContactOpen = () => {
      if (bioOpen && !bioClosing) setBioClosing(true);
    };
    const onBioClose = () => {
      if (bioOpen && !bioClosing) setBioClosing(true);
    };
    window.addEventListener('valentine-open-contact', onContactOpen);
    window.addEventListener('valentine-close-bio', onBioClose);
    return () => {
      window.removeEventListener('valentine-open-contact', onContactOpen);
      window.removeEventListener('valentine-close-bio', onBioClose);
    };
  }, [bioOpen, bioClosing]);

  const handleBioAnimationEnd = (e) => {
    if (bioClosing && e.target === e.currentTarget) {
      setBioOpen(false);
      setBioClosing(false);
    }
  };

  const handleSwipeTouchStart = useCallback(
    (e) => {
      if (!isSwipeEnabled || bioOpen || bioClosing || items.length < 2) return;
      const t = e.targetTouches?.[0];
      if (!t) return;
      swipeTouchStartRef.current = { x: t.clientX, y: t.clientY };
    },
    [isSwipeEnabled, bioOpen, bioClosing, items.length]
  );

  const handleSwipeTouchEnd = useCallback(
    (e) => {
      const start = swipeTouchStartRef.current;
      swipeTouchStartRef.current = null;
      if (!start || !isSwipeEnabled || bioOpen || bioClosing || items.length < 2) return;
      const t = e.changedTouches?.[0];
      if (!t) return;
      const dx = t.clientX - start.x;
      const dy = t.clientY - start.y;
      if (Math.abs(dy) < SWIPE_MIN_PX || Math.abs(dy) < Math.abs(dx)) return;
      swipeLockRef.current = true;
      window.setTimeout(() => {
        swipeLockRef.current = false;
      }, 450);
      /* Finger moves up → next clip; moves down → previous */
      if (dy < 0) {
        setActiveIndex((i) => Math.min(items.length - 1, i + 1));
      } else {
        setActiveIndex((i) => Math.max(0, i - 1));
      }
    },
    [isSwipeEnabled, bioOpen, bioClosing, items.length]
  );

  if (items.length === 0) {
    return null;
  }

  const handleMouseEnter = (index) => setActiveIndex(index);
  const handleDotClick = (index) => setActiveIndex(index);

  const focusProjectButton = useCallback((index) => {
    const i = Math.max(0, Math.min(items.length - 1, index));
    requestAnimationFrame(() => {
      projectBtnRefs.current[i]?.focus();
    });
  }, [items.length]);

  const handleProjectKeyDown = useCallback(
    (e, index) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        const next = Math.min(items.length - 1, index + 1);
        if (next !== index) {
          setActiveIndex(next);
          focusProjectButton(next);
        }
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        const prev = Math.max(0, index - 1);
        if (prev !== index) {
          setActiveIndex(prev);
          focusProjectButton(prev);
        }
      }
    },
    [items.length, focusProjectButton]
  );

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
  const currentProjectHref =
    currentItem?.projectSlug && member?.slug
      ? `/directors/${member.slug}/${currentItem.projectSlug}`
      : null;
  const hasBio = member?.bio && member.bio.length > 0;

  useEffect(() => {
    const v = videoRefs.current[activeIndex];
    if (v) {
      v.play().catch(() => {});
    }
  }, [bioOpen, bioClosing, activeIndex]);
  const goToVideoPage = useCallback(
    (href) => {
      setPendingNav(null);
      router.push(href);
    },
    [router]
  );

  const handleNavigateToVideo = useCallback(
    (e, href) => {
      if (!href || swipeLockRef.current) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button === 1) {
        return;
      }
      e.preventDefault();
      if (
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ) {
        router.push(href);
        return;
      }
      setPendingNav({ href, x: e.clientX, y: e.clientY });
    },
    [router]
  );

  const updateDivider = useCallback(() => {
    try {
      const bioBtn = bioBtnRef.current;
      const contactBtn = document.querySelector('[data-contact-trigger]');
      const rightAnchor = talentCornerRef.current || contactBtn;
      if (!bioBtn || !rightAnchor) {
        setDividerStyle(null);
        setDividerVisible(false);
        return;
      }
      const bioRect = bioBtn.getBoundingClientRect();
      const rightRect = rightAnchor.getBoundingClientRect();
      const left = Math.round(bioRect.right + 10);
      const right = Math.round(window.innerWidth - rightRect.left + 10);
      const top = Math.round((bioRect.top + bioRect.bottom) / 2);
      setDividerStyle({ left: `${left}px`, right: `${right}px`, top: `${top}px` });
      setDividerVisible(true);
    } catch (_) {
      setDividerStyle(null);
      setDividerVisible(false);
    }
  }, []);

  useEffect(() => {
    updateDivider();
    window.addEventListener('resize', updateDivider, { passive: true });
    return () => {
      window.removeEventListener('resize', updateDivider);
    };
  }, [updateDivider, activeIndex, member?.talentPosition, bioOpen, bioClosing]);

  useEffect(() => {
    const btn = document.querySelector('[data-contact-trigger]');
    if (!btn || typeof MutationObserver === 'undefined') return;
    const mo = new MutationObserver(updateDivider);
    mo.observe(btn, { attributes: true, attributeFilter: ['aria-expanded'] });
    return () => mo.disconnect();
  }, [updateDivider]);

  useEffect(() => {
    let rafId;
    let start = performance.now();
    const tick = (ts) => {
      updateDivider();
      if (ts - start < 1800) {
        rafId = requestAnimationFrame(tick);
      }
    };
    rafId = requestAnimationFrame(tick);
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [updateDivider]);

  useEffect(() => {
    const el = bioBarRef.current;
    if (!el) return;
    const onEnd = () => updateDivider();
    el.addEventListener('animationend', onEnd);
    return () => el.removeEventListener('animationend', onEnd);
  }, [updateDivider]);

  // Remove animation class once last item finishes (enables cascade for opacity)
  const handleIconAnimationEnd = () => {
    setAnimationsDone(true);
  };

  return (
    <>
      <div
        className={`${styles.wrapper} ${bioOpen || bioClosing ? styles.wrapperBioBlur : ''}`}
        data-director-blur-root
        onTouchStart={handleSwipeTouchStart}
        onTouchEnd={handleSwipeTouchEnd}
      >
      {items.length > 1 && (
        <div className={styles.clipProgressTrack} aria-hidden>
          <div ref={clipProgressFillRef} className={styles.clipProgressFill} />
        </div>
      )}

      {items.map((item, index) => {
        const isActive = activeIndex === index;
        return (
          <video
            key={item.id}
            ref={(el) => (videoRefs.current[index] = el)}
            className={`${styles.videoLayer} ${isActive ? styles.active : ''}`}
            muted
            loop={items.length === 1}
            playsInline
            preload={index === 0 ? 'auto' : 'metadata'}
            onTimeUpdate={handleClipTimeUpdate}
            onEnded={items.length > 1 ? handleClipEnded : undefined}
          >
            {item.url && (
              <source src={item.url} type={getVideoType(item.url)} />
            )}
          </video>
        );
      })}

      {currentProjectHref && (
        <button
          type="button"
          className={styles.videoHitLayer}
          data-play-cursor-zone
          aria-label="Open full-screen project video"
          onClick={(e) => handleNavigateToVideo(e, currentProjectHref)}
        />
      )}

      <DirectorProfilePlayCursor disabled={bioOpen || bioClosing || !!pendingNav} />

      {pendingNav && (
        <DirectorNavigateTransition
          origin={{ x: pendingNav.x, y: pendingNav.y }}
          onComplete={() => goToVideoPage(pendingNav.href)}
        />
      )}

      {/* Center bar: vertically centered, director name + video name */}
      <div className={styles.centerBar}>
        <div className={styles.directorInfo}>
          <div className={`${styles.directorInfoLine} ${styles.directorInfoLineAnimate}`}>
            <span className={`${styles.directorName} ${styles.cursorDefault}`}>
              {member?.fullName}
            </span>
            {' '}
            <br className={styles.mobileBreak} />
            {currentProjectHref ? (
              <a
                key={currentItem?.id ?? activeIndex}
                href={currentProjectHref}
                className={`${styles.projectName} ${styles.projectNameSwap} ${styles.projectNameLink}`}
                data-play-cursor-zone
                onClick={(e) => handleNavigateToVideo(e, currentProjectHref)}
              >
                {currentItem?.name || ''}
              </a>
            ) : (
              <span
                key={currentItem?.id ?? activeIndex}
                className={`${styles.projectName} ${styles.projectNameSwap}`}
              >
                {currentItem?.name || ''}
              </span>
            )}
          </div>
        </div>

        <div className={styles.projectNav} aria-label="Project navigation">
          {items.map((item, index) => {
            const isActive = activeIndex === index;
            const rowClass = `${styles.projectRow} ${!animationsDone ? styles.projectRowAnimate : ''} ${isActive ? styles.projectRowActive : ''}`;
            return (
              <button
                key={item.id}
                ref={(el) => {
                  projectBtnRefs.current[index] = el;
                }}
                type="button"
                className={rowClass}
                style={{ '--icon-delay': `${index * 80}ms` }}
                aria-current={isActive ? 'true' : undefined}
                aria-label={`${item.name}${isActive ? ', current clip' : ''}. Select to preview this clip.`}
                onMouseEnter={() => handleMouseEnter(index)}
                onClick={() => handleDotClick(index)}
                onKeyDown={(e) => handleProjectKeyDown(e, index)}
                onAnimationEnd={index === items.length - 1 ? handleIconAnimationEnd : undefined}
              >
                <span className={styles.projectItemName} aria-hidden="true">
                  {item.name}
                </span>
                <img
                  src={isActive ? '/play-bullet.svg' : '/stop-bullet.svg'}
                  alt=""
                  className={styles.mediaIconImg}
                  width={281}
                  height={318}
                  decoding="async"
                  aria-hidden
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Bio overlay - click anywhere to close, video keeps playing underneath */}
      {(bioOpen || bioClosing) && (
        <>
          <div className={`${styles.bioBlurLayer} ${bioClosing ? styles.bioOverlayClosing : styles.bioOverlayEnter}`}>
            <div
              className={styles.bioBackdropHit}
              role="presentation"
              onClick={handleBioClose}
              aria-hidden
            >
              <span className={styles.bioBackdropBlur} aria-hidden />
              <span
                className={styles.bioBackdropShade}
                aria-hidden
                onAnimationEnd={handleBioAnimationEnd}
              />
            </div>
          </div>
          <div
            className={`${styles.bioPanelDock} ${bioClosing ? styles.bioOverlayClosing : styles.bioOverlayEnter}`}
            role="dialog"
            aria-modal="true"
            aria-label="Biography"
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.bioPanelDockInner}>
              <div className={styles.bioColumnStack}>
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
        </>
      )}
      </div>

      {/* Keep these outside blurred root so they stay sharp while contact is open */}
      {hasBio && (
        <div ref={bioBarRef} className={`${styles.bioBar} ${styles.bioBarAnimate}`} style={{ '--bio-delay': `${100 + items.length * 80}ms` }}>
          <button
            type="button"
            className={styles.bioLink}
            ref={bioBtnRef}
            onClick={handleBioToggle}
          >
            BIO
          </button>
        </div>
      )}

      {dividerStyle && (
        <div
          className={`${styles.bioContactDivider} ${dividerVisible ? styles.bioContactDividerVisible : ''}`}
          style={dividerStyle}
          aria-hidden
        />
      )}

      {member?.talentPosition?.trim() ? (
        <div className={styles.talentBar}>
          <div className={styles.talentBarInner}>
            <span
              ref={talentCornerRef}
              className={styles.talentLabel}
              data-director-talent-anchor
              aria-hidden
            >
              {member.talentPosition.trim().toUpperCase()}
            </span>
          </div>
        </div>
      ) : null}
    </>
  );
}
