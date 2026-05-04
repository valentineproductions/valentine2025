'use client';

import { useState, useEffect } from 'react';

export const DIRECTOR_SWIPE_VIEWPORT_MAX = 767;

function computeDirectorSwipeEnabled() {
  if (typeof window === 'undefined') return false;
  if (
    window.matchMedia(`(max-width: ${DIRECTOR_SWIPE_VIEWPORT_MAX}px)`).matches
  ) {
    return true;
  }
  const touchPoints =
    typeof navigator !== 'undefined' ? Number(navigator.maxTouchPoints) || 0 : 0;
  return touchPoints > 0;
}

/**
 * Vertical swipe for director / clip when viewport is narrow OR device has touch
 * (e.g. iPad Pro 12.9" wide layout still has maxTouchPoints).
 */
export function useDirectorSwipeEnabled() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(
      `(max-width: ${DIRECTOR_SWIPE_VIEWPORT_MAX}px)`
    );
    const update = () => setEnabled(computeDirectorSwipeEnabled());
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  return enabled;
}
