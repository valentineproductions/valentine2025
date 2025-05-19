'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function AboutInitAnimation({ children }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const elements = gsap.utils.toArray('[data-init-animate]');

      gsap.from(elements, {
        opacity: 0,
        y: 50,
        duration: 3,
        stagger: 0.7, // Delay between each element
        ease: 'power2.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 70%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse',
          scrub: false,
          markers: false, // turn to true for debugging
        },
      });
    }, containerRef);

    return () => ctx.revert(); // Cleanup
  }, []);

  return <div className='firstSectionAbout' ref={containerRef}>{children}</div>;
}
