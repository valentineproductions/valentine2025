'use client';

import React, { useEffect, useRef } from 'react';
import { useIntersection } from 'react-use';
import gsap from 'gsap';

const ServicesAnimation = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const serviceListItems = container.querySelectorAll('.serviceList'); // Select elements by class

    if (serviceListItems.length > 0) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              // Animate each service list item sequentially
              Array.from(serviceListItems).forEach((item, index) => { // Use Array.from
                gsap.to(item, {
                  opacity: 1,
                  y: 0,
                  duration: 0.8,
                  delay: index * 0.3,
                  ease: 'power2.out',
                });
              });
              observer.disconnect(); // Stop observing after animating
            } else {
                Array.from(serviceListItems).forEach(item => {
                    gsap.set(item, {opacity: 0, y: 20})
                })
            }
          });
        },
        {
          root: null,
          rootMargin: '0px',
          threshold: 0.5,
        }
      );

      observer.observe(container); // Observe the parent container
    }
  }, []); // Run only once on mount

  return (
    <div ref={containerRef} className="servicesLists">
      {/* The content will be rendered server-side */}
    </div>
  );
};

export default ServicesAnimation;
