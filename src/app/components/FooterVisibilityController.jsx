'use client';

import { useEffect, useState } from 'react';

/**
 * Controls homeLastVideoFooter visibility based on scroll.
 * Observes approachSection and logos - when they're in view, shows the footer.
 * Must render regardless of home frame to work when homeFrame is empty.
 */
export default function FooterVisibilityController() {
  const [isFooterVisible, setIsFooterVisible] = useState(false);

  useEffect(() => {
    const handler = (entries) => {
      const anyVisible = entries.some((e) => e.isIntersecting);
      setIsFooterVisible(anyVisible);
    };
    const observer = new IntersectionObserver(handler, {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
    });

    const targets = [];
    const approach = document.querySelector('.approachSection.five');
    const logos = document.querySelector('.logos-image-container');
    if (approach) { observer.observe(approach); targets.push(approach); }
    if (logos) { observer.observe(logos); targets.push(logos); }

    return () => {
      targets.forEach((t) => observer.unobserve(t));
    };
  }, []);

  useEffect(() => {
    const footer = document.querySelector('.homeLastVideoFooter');
    if (!footer) return;
    if (isFooterVisible) {
      footer.classList.add('footerFixed', 'footerVisible');
    } else {
      footer.classList.remove('footerFixed', 'footerVisible');
    }
  }, [isFooterVisible]);

  return null;
}
