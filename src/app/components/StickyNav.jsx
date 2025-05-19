'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function StickyNav() {
  const pathname = usePathname();
  const isTalentPage = pathname === '/talent';

  useEffect(() => {
    if (!isTalentPage) return;

    const navBar = document.querySelector('.navBar');
    if (!navBar) return;

    // Store original styles to restore on unmount
    const originalStyles = {
      position: navBar.style.position,
      top: navBar.style.top,
      left: navBar.style.left,
      right: navBar.style.right,
      zIndex: navBar.style.zIndex,
      background: navBar.style.background,
      padding: navBar.style.padding,
      boxShadow: navBar.style.boxShadow,
      willChange: navBar.style.willChange
    };

    // Apply sticky styles
    Object.assign(navBar.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      right: '0',
      zIndex: '100',
      background: 'var(--background)',
      padding: '12px 20px',
    //   boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
      willChange: 'transform'
    });

    const handleScroll = () => {
      // You can add additional scroll effects here if needed
      // For now just keeping it sticky at top
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      // Restore original styles
      Object.assign(navBar.style, originalStyles);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isTalentPage]);

  return null; // This component doesn't render anything
}