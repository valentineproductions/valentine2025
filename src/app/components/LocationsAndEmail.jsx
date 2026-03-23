'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './LocationsAndEmail.module.css';

export default function LocationsAndEmail({ locations, email }) {
  const hasLocations = locations?.trim();
  const hasEmail = email?.trim();
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (!hasLocations && !hasEmail) return null;

  return (
    <div
      ref={ref}
      className={`${styles.root} ${isVisible ? styles.visible : ''}`}
      data-locations-email
    >
      {hasLocations && (
        <div className={styles.locationsCodes}>
          <p>{locations.trim()}</p>
        </div>
      )}
      {hasEmail && (
        <div className={styles.email}>
          <a href={`mailto:${email.trim()}`}>{email.trim()}</a>
        </div>
      )}
    </div>
  );
}
