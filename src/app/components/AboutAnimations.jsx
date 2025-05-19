'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function AboutAnimations({ children }) {
    const containerRef = useRef(null);
  
    useEffect(() => {
      const ctx = gsap.context(() => {
        // Animate all elements with data-animate attribute
        gsap.utils.toArray('[data-animate]').forEach(element => {
          gsap.from(element, {
            opacity: 0,
            y: 70,
            duration: 4,
            stagger: 0.7,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: element,
              start: 'top 80%',
            //   end: 'bottom 20%',
              toggleActions: 'play none none reverse', // animate in, do nothing on scroll back
              scrub: false,
              markers: false // set to true for debugging
            }
          });
        });
      }, containerRef);
  
      return () => ctx.revert(); // Cleanup
    }, []);
  
    return <div ref={containerRef}>{children}</div>;
  }