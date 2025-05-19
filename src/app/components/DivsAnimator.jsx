'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useIntersection } from 'react-use';

const DivsAnimator = ({ children }) => {
  const containerRef = useRef(null);

  const intersection = useIntersection(containerRef, {
    root: null,
    rootMargin: '0px',
    threshold: 0.3, // Triggers when 30% of the element is visible
  });

  useEffect(() => {
    if (intersection?.intersectionRatio > 0.3) {
      const animatables = containerRef.current?.querySelectorAll('div'); // Grab all child divs
      
      gsap.fromTo(
        animatables,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 3,
          stagger: 0.7, // Staggered effect
          ease: 'power2.out',
        }
      );
    }
  }, [intersection]);

  return <div className='animatedDivs' ref={containerRef}>{children}</div>;
};

export default DivsAnimator;
