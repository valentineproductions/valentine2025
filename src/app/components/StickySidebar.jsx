"use client";

import { useEffect, useRef } from 'react';

export default function StickySidebar({ children }) {
  const sidebarRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (sidebarRef.current) {
        sidebarRef.current.style.transform = `translateY(${window.scrollY}px)`;
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="sidebar-container">
      <aside className="sideBar" ref={sidebarRef}>
        {children}
      </aside>
    </div>
  );
}