'use client';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function SoonAnimation({ children }) {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const cursorRef = useRef(null);
  const text = children || "TBD"; // Default to "TBD" if empty

  useEffect(() => {
    if (!containerRef.current || !text) return;

    // Check for special trailing patterns
    const dotPattern = text.match(/[.]+$/)?.[0] || '';
    const colonPattern = text.match(/[.:]+$/)?.[0] || '';
    const hasDots = dotPattern.length > 0;
    const hasColon = colonPattern.includes(':');
    const displayText = hasDots || hasColon ? text.slice(0, -(hasColon ? colonPattern.length : dotPattern.length)) : text;
    
    // Pattern type detection
    const isTwoDots = dotPattern === '..';
    const isDotColon = colonPattern === '.:';
    const isThreeDots = dotPattern === '...';
    const isFourDots = dotPattern === '....';
    const isFiveDots = dotPattern === '.....';

    // Clear any existing content
    textRef.current.textContent = '';
    
    // Set initial styles
    gsap.set(cursorRef.current, { opacity: 0 });
    gsap.set(containerRef.current, { y: -80 });

    const tl = gsap.timeline();
    let currentText = '';

    // Typewriter effect for main text
    displayText.split('').forEach((_, i) => {
      tl.to(textRef.current, {
        duration: 0.08,
        onStart: () => {
          currentText += displayText[i];
          textRef.current.textContent = currentText;
        }
      });
    });

    // Handle all special pattern cases
    if (isDotColon) {
      // Add . then .:
      tl.to(textRef.current, {
        duration: 0.08,
        onStart: () => {
          textRef.current.textContent = currentText + '.';
        }
      })
      .to(textRef.current, {
        duration: 0.08,
        onStart: () => {
          textRef.current.textContent = currentText + '.:';
        }
      })
      // Remove both with delay between
      .to({}, { duration: 0.7 })
      .to(textRef.current, {
        duration: 0.1,
        onStart: () => {
          textRef.current.textContent = currentText + '.';
        }
      })
      .to({}, { duration: 0.3 })
      .to(textRef.current, {
        duration: 0.1,
        onStart: () => {
          textRef.current.textContent = currentText;
        }
      });
    }
    else if (isTwoDots) {
      // Add . then ..
      tl.to(textRef.current, {
        duration: 0.08,
        onStart: () => {
          textRef.current.textContent = currentText + '.';
        }
      })
      .to(textRef.current, {
        duration: 0.08,
        onStart: () => {
          textRef.current.textContent = currentText + '..';
        }
      })
      // Remove both with delay between
      .to({}, { duration: 0.7 })
      .to(textRef.current, {
        duration: 0.1,
        onStart: () => {
          textRef.current.textContent = currentText + '.';
        }
      })
      .to({}, { duration: 0.3 })
      .to(textRef.current, {
        duration: 0.1,
        onStart: () => {
          textRef.current.textContent = currentText;
        }
      });
    }
    else if (isThreeDots) {
      // Add . then .. then ... (no 4th dot)
      for (let i = 1; i <= 3; i++) {
        tl.to(textRef.current, {
          duration: 0.08,
          onStart: () => {
            textRef.current.textContent = currentText + '.'.repeat(i);
          }
        });
      }
      // Keep as ... (no removal)
      tl.to({}, { duration: 0.7 });
    }
    else if (isFourDots) {
      // Add . then .. then ...
      for (let i = 1; i <= 3; i++) {
        tl.to(textRef.current, {
          duration: 0.08,
          onStart: () => {
            textRef.current.textContent = currentText + '.'.repeat(i);
          }
        });
      }
      // Remove all three dots one by one
      tl.to({}, { duration: 0.7 });
      for (let i = 3; i > 0; i--) {
        tl.to(textRef.current, {
          duration: 0.1,
          onStart: () => {
            textRef.current.textContent = currentText + '.'.repeat(i-1);
          }
        })
        .to({}, { duration: 0.3 });
      }
    }
    else if (isFiveDots) {
      // Add . then .. then ... then ....
      for (let i = 1; i <= 4; i++) {
        tl.to(textRef.current, {
          duration: 0.08,
          onStart: () => {
            textRef.current.textContent = currentText + '.'.repeat(i);
          }
        });
      }
      // Reduce to ...
      tl.to({}, { duration: 0.7 })
        .to(textRef.current, {
          duration: 0.1,
          onStart: () => {
            textRef.current.textContent = currentText + '...';
          }
        });
    }

    // Blinking cursor during typing
    tl.to(cursorRef.current, { 
      opacity: 1,
      repeat: Math.floor(text.length / 2),
      yoyo: true,
      duration: 0.7
    }, 0);

    // Remove cursor after typing
    tl.to(cursorRef.current, { 
      opacity: 0,
      duration: 0.1
    });

    // Final floating animation (looped)
    // tl.to(containerRef.current, {
    //   y: -5,
    //   duration: 2,
    //   ease: "sine.inOut",
    //   repeat: -1,
    //   yoyo: true
    // });

    return () => tl.kill();
  }, [text]);

  return (
    <div 
      ref={containerRef} 
      style={{ 
        display: 'inline-block',
        position: 'relative',
        willChange: 'transform'
      }}
    >
      <h2 
        ref={textRef} 
        className="gallery h2" 
        style={{ 
          display: 'inline',
          margin: 0
        }} 
      />
      <span 
        ref={cursorRef} 
        style={{
          display: 'inline-block',
          width: '2px',
          height: '60px',
          background: 'currentColor',
          marginLeft: '4px',
          verticalAlign: 'middle',
          position: 'absolute'
        }} 
      />
    </div>
  );
}