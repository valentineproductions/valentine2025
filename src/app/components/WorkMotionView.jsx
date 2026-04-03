'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { useWorkPageChrome } from './WorkModeContext';
import styles from './WorkMotionView.module.css';

export default function WorkMotionView({ clips }) {
  const chrome = useWorkPageChrome();
  const scrollRef = useRef(null);
  const videoRefs = useRef([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const list = Array.isArray(clips) ? clips.filter((c) => c?.videoUrl) : [];

  const updateActiveFromScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el || list.length === 0) return;
    const h = el.clientHeight;
    if (h <= 0) return;
    const i = Math.min(list.length - 1, Math.max(0, Math.round(el.scrollTop / h)));
    setActiveIndex(i);
    chrome?.reportMotionSlideIndex?.(i);
  }, [list.length, chrome]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateActiveFromScroll();
    el.addEventListener('scroll', updateActiveFromScroll, { passive: true });
    return () => el.removeEventListener('scroll', updateActiveFromScroll);
  }, [updateActiveFromScroll]);

  useEffect(() => {
    videoRefs.current.forEach((v, i) => {
      if (!v) return;
      if (i === activeIndex) {
        v.play().catch(() => {});
      } else {
        v.pause();
      }
    });
  }, [activeIndex]);

  const active = list[activeIndex];

  if (list.length === 0) {
    return (
      <div className={styles.empty}>
        <p>Add Motion clips in Sanity (Work page → Motion videos).</p>
      </div>
    );
  }

  const getVideoType = (url) =>
    url?.endsWith('.webm') ? 'video/webm' : 'video/mp4';

  const talentLabel = (active?.talentPosition || '').trim().toUpperCase();

  return (
    <div
      ref={scrollRef}
      className={styles.root}
      data-work-motion-scroll
    >
      {list.map((clip, index) => (
        <section key={`${clip.videoUrl}-${index}`} className={styles.slide}>
          <video
            ref={(el) => {
              videoRefs.current[index] = el;
            }}
            className={styles.video}
            muted
            loop
            playsInline
            preload={index === 0 ? 'auto' : 'metadata'}
          >
            <source src={clip.videoUrl} type={getVideoType(clip.videoUrl)} />
          </video>
        </section>
      ))}
      <div className={styles.metaStrip} aria-live="polite">
        <div key={activeIndex} className={styles.metaStripInner}>
          <div className={styles.metaLeft}>
            {active?.title && (
              <span className={styles.metaTitle}>{active.title}</span>
            )}
            {active?.description && (
              <span className={styles.metaDesc}>{active.description}</span>
            )}
          </div>
          <div className={styles.metaLine} aria-hidden />
          {talentLabel ? (
            <span className={styles.metaTalent}>{talentLabel}</span>
          ) : null}
        </div>
      </div>
    </div>
  );
}
