'use client';

import { useEffect } from 'react';

function ScrollAnimation() {
  useEffect(() => {
    const boxes = document.querySelectorAll('.aProject');

    const checkBoxes = () => {
      const triggerBottom = window.innerHeight / 4 * 3.5;

      boxes.forEach(box => {
        const boxTop = box.getBoundingClientRect().top;

        if (boxTop < triggerBottom) {
          box.classList.add('show');
        } else {
          box.classList.remove('show');
        }
      });
    };

    window.addEventListener('scroll', checkBoxes);
    checkBoxes();

    return () => {
      window.removeEventListener('scroll', checkBoxes);
    };
  }, []);

  return null; // This component doesn't need to render any visible elements directly
}

export default ScrollAnimation;