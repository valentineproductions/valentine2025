'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

export default function BackgroundImage({ src, alt }) {
  const containerRef = useRef(null);
  const [isFooterVisible, setIsFooterVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFooterVisible(entry.isIntersecting);
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
      }
    );

    const footer = document.querySelector('.homeLastVideoFooter');
    if (footer) {
      observer.observe(footer);
    }

    return () => {
      if (footer) observer.unobserve(footer);
    };
  }, []);

  return (
    <div className='coolBG' 
      ref={containerRef}
      style={{
        position: 'fixed',
        top: isFooterVisible ? '20px' : '10px',
        left: 0,
        right: 0,
        height: isFooterVisible ? '80%' : '95%', // Now controlling container height
        zIndex: -1,
        transition: 'height 0.3s ease, top 0.3s ease'
      }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        style={{
          objectFit: 'fill' // or 'contain' depending on your needs
        }}
        priority
      />
    </div>
  );
}