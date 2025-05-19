'use client';
import React, { useEffect, useRef } from 'react';
import { useIntersection } from 'react-use';
import gsap from 'gsap';

const LocationsAndEmailAnimator = ({ locations, email }) => {
  const containerRef = useRef(null);
  const hasAnimated = useRef(false);

  const intersection = useIntersection(containerRef, {
    root: null,
    rootMargin: '-50px 0px 0px 0px', // More balanced margin
    threshold: 0.1 // Triggers at 10% visibility
  });

  const fadeIn = () => {
    if (containerRef.current && !hasAnimated.current) {
      gsap.to(containerRef.current, {
        duration: 1,
        opacity: 1,
        y: 0,
        ease: "power2.out",
        delay: 0.4,
        onComplete: () => hasAnimated.current = true
      });
    }
  };

  const fadeOut = () => {
    if (containerRef.current && hasAnimated.current) {
      gsap.to(containerRef.current, {
        duration: 1,
        opacity: 0,
        y: -20,
        ease: "power2.out"
      });
      hasAnimated.current = false;
    }
  };

  useEffect(() => {
    // Detect all touch devices including iPad Pro 12.9" in landscape
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isiPad = /iPad|Macintosh/i.test(navigator.userAgent) && isTouchDevice;
    
    if (isTouchDevice || isiPad || window.innerWidth <= 1024) {
      fadeIn();
    }
  }, []);

  useEffect(() => {
    if (intersection) {
      if (intersection.intersectionRatio > 0.1) {
        fadeIn();
      } else if (intersection.intersectionRatio <= 0) {
        fadeOut();
      }
    }
  }, [intersection]);

  return (
    <div ref={containerRef} className="locationsNemail" style={{ opacity: 0, transform: 'translateY(20px)' }}>
      <div className="locationsCodes">
        <p>{locations}</p>
      </div>
      <div className="homeEmail">
        <a href={`mailto:${email}`}>{email}</a>
      </div>
    </div>
  );
};

export default LocationsAndEmailAnimator;