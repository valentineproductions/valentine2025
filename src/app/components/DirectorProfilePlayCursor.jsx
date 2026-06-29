'use client';

import { useEffect, useRef } from 'react';
import styles from './DirectorProfilePlayCursor.module.css';

const DEFAULT_ZONE = '[data-play-cursor-zone]';
const ICON_OPACITY = 1;
/** Play icon: 20% smaller than prior 12×12 */
const ICON_PX = 9.6;

/**
 * Play/pause icon at pointer. Only when hovering elements with data-play-cursor-zone.
 */
export default function DirectorProfilePlayCursor({
  disabled,
  zoneSelector = DEFAULT_ZONE,
  iconSrc = '/cursor-play.svg',
  /** When set, "in zone" = pointer inside this node and not under chromeExcludeSelector (e.g. Simian page). */
  containerRef = null,
  chromeExcludeSelector = '[data-no-play-cursor]',
}) {
  const useContainerZone = Boolean(containerRef);
  const mouseRef = useRef({ x: 0, y: 0 });
  const inZoneRef = useRef(false);
  const reduceMotionRef = useRef(false);
  const finePointerRef = useRef(true);

  const iconRef = useRef(null);
  const rafRef = useRef(0);

  useEffect(() => {
    reduceMotionRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    finePointerRef.current = window.matchMedia('(pointer: fine)').matches;
  }, []);

  useEffect(() => {
    const onMove = (e) => {
      if (disabled) {
        inZoneRef.current = false;
        return;
      }
      mouseRef.current = { x: e.clientX, y: e.clientY };
      const el = document.elementFromPoint(e.clientX, e.clientY);
      let inZone = false;
      if (useContainerZone && containerRef?.current) {
        if (el && containerRef.current.contains(el)) {
          inZone = !(
            typeof el.closest === 'function' && el.closest(chromeExcludeSelector)
          );
        }
      } else {
        inZone = Boolean(el && typeof el.closest === 'function' && el.closest(zoneSelector));
      }
      inZoneRef.current = inZone;
    };

    const onLeave = () => {
      inZoneRef.current = false;
    };

    /* Capture: helps some edge cases; cross-origin iframe still blocks parent mousemove while over embed. */
    const opts = { passive: true, capture: true };
    window.addEventListener('mousemove', onMove, opts);
    window.addEventListener('pointermove', onMove, opts);
    document.addEventListener('mouseleave', onLeave, true);
    return () => {
      window.removeEventListener('mousemove', onMove, opts);
      window.removeEventListener('pointermove', onMove, opts);
      document.removeEventListener('mouseleave', onLeave, true);
    };
  }, [disabled, zoneSelector, useContainerZone, containerRef, chromeExcludeSelector]);

  useEffect(() => {
    const tick = () => {
      const icon = iconRef.current;
      const show = !disabled && finePointerRef.current && inZoneRef.current;

      const m = mouseRef.current;

      if (show) {
        if (icon) {
          icon.style.opacity = String(ICON_OPACITY);
          icon.style.transform = `translate3d(${m.x}px, ${m.y}px, 0) translate(-50%, -50%)`;
        }
      } else if (icon) {
        icon.style.opacity = '0';
      }

      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [disabled]);

  return (
    <div className={styles.layer} aria-hidden>
      <div ref={iconRef} className={styles.iconWrap} style={{ width: ICON_PX, height: ICON_PX }}>
        <img key={iconSrc} src={iconSrc} alt="" width={ICON_PX} height={ICON_PX} decoding="async" />
      </div>
    </div>
  );
}
