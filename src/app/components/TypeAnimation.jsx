'use client';

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';
import { usePathname } from 'next/navigation';

gsap.registerPlugin(TextPlugin);

export default function TypeAnimation({ children }) {
  const containerRef = useRef(null);
  const pathname = usePathname();

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Target all elements with data-text-animate
      gsap.utils.toArray('[data-text-animate]').forEach(element => {
        const text = element.dataset.originalText || element.textContent;
        element.dataset.originalText = text;
        element.textContent = ''; // Clear original text
        
        gsap.to(element, {
          duration: text.length * 0.05, // Adjust speed (0.05s per character)
          text: text,
          ease: 'none',
          delay: 1
        });
      });
    }, containerRef);

    return () => ctx.revert(); // Cleanup
  }, [pathname]);

  return <div ref={containerRef}>{children}</div>;
}