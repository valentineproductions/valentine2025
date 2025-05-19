'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function HomeAnimations({ children }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const scroller = containerRef.current;

    // Set up scroller proxy
    ScrollTrigger.scrollerProxy(scroller, {
      scrollTop(value) {
        if (arguments.length) {
          scroller.scrollTop = value;
        }
        return scroller.scrollTop;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
      pinType: scroller.style.transform ? 'transform' : 'fixed',
    });

    const ctx = gsap.context(() => {
      gsap.utils.toArray('section').forEach((section) => {
        const animatables = section.querySelectorAll('[data-animate]');
        gsap.from(animatables, {
          opacity: 0,
          y: 70,
          duration: 1.2,
          stagger: 0.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            scroller: scroller,
            start: 'top top', // Adjusted start position
            toggleActions: 'play none none reverse',
            scrub: false,
            markers: false,
            invalidateOnRefresh: true,
          },
        });
      });

      // Refresh ScrollTrigger after setup
      ScrollTrigger.refresh();
    }, containerRef);

    return () => {
      ctx.revert();
      ScrollTrigger.kill();
    };
  }, []);

  return <div ref={containerRef}>{children}</div>;
}
