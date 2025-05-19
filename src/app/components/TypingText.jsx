'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from 'gsap/TextPlugin';


gsap.registerPlugin(ScrollTrigger,TextPlugin);

const TypingText = ({ text, speed = 0.05 }) => {
  const textRef = useRef(null);

  useEffect(() => {
    const element = textRef.current;
    if (element) {
      gsap.to(".sloganContainerSolid h2", {
         opacity: 1, 
         duration: 3
        }); 
    }
  }, []);

  return <span ref={textRef} style={{ opacity: 0.5 }}></span>; // Initially hidden
};

export default TypingText;