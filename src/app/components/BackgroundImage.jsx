'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

export default function BackgroundImage({ src, alt }) {
  const containerRef = useRef(null);
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

  return (
    <div className='coolBG' 
      ref={containerRef}
      style={{
        position: 'fixed',
        top: '20px',
        left: 0,
        right: 0,
        height: '95%',
        zIndex: -1,
        pointerEvents: 'none',
        transform: `scaleY(${isFooterVisible ? 0.95 : 1})`,
        transformOrigin: 'top',
        transition: 'transform 0.4s ease'
      }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        style={{ objectFit: 'contain', pointerEvents: 'none' }}
        priority
      />
    </div>
  );
}
