'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const MenuAnimation = ({ isOpen, children }) => {
    const linksRef = useRef(null);
    const menuTriggerRef = useRef(null);

    useEffect(() => {
        if (isOpen && linksRef.current) {
            const linkElements = linksRef.current.children;

            // Initial animation: Fade in and move up
            gsap.fromTo(
                linkElements,
                { opacity: 0, y: -10 },
                { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out' }
            );

            // Add this part: Selected item animation
            Array.from(linkElements).forEach(link => {
                link.addEventListener('click', (event) => {
                    const clickedLink = event.currentTarget;
                    gsap.to(clickedLink, {
                        y: 5,         // Move down by 5 pixels (adjust as needed)
                        opacity: 0.7, // Slightly reduce opacity
                        duration: 0.3, // Short duration for the movement
                        ease: 'power1.out',
                        onComplete: () => {
                            //  No need to reset here, Next.js handles navigation
                        }
                    });
                });
            });
        }
    }, [isOpen, children]);

    return (
        <div ref={linksRef}>
            {children}
        </div>
    );
};

export default MenuAnimation;