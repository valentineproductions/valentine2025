// app/components/HomeChecker.jsx
'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

const HomeChecker = () => {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (pathname === '/') {
        document.body.classList.add('homeBody');
      } else {
        document.body.classList.remove('homeBody');
      }
    }
  }, [pathname]);

  return null;
};

export default HomeChecker;