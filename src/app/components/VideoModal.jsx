'use client';

import { useEffect, useRef } from 'react';
import styles from './VideoModal.module.css';

export default function VideoModal({ video, onClose }) {
  const modalRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    // Handle click outside to close
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    // Handle ESC key to close
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  // Extract iframe src from embed code for autoplay
  const getAutoplayEmbed = (embedCode) => {
    if (!embedCode) return embedCode;
    
    // If it's an iframe, add autoplay parameter
    if (embedCode.includes('<iframe')) {
      // Check if src already has parameters
      const hasParams = embedCode.includes('?');
      const autoplayParam = hasParams ? '&autoplay=1' : '?autoplay=1';
      
      // Add autoplay to src
      return embedCode.replace(
        /src="([^"]+)"/,
        `src="$1${autoplayParam}"`
      );
    }
    
    return embedCode;
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal} ref={modalRef}>
        <button
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close modal"
        >
          ×
        </button>
        <div className={styles.videoContainer}>
          <div
            className={styles.videoEmbed}
            ref={videoRef}
            dangerouslySetInnerHTML={{ __html: getAutoplayEmbed(video.embedCode) }}
          />
        </div>
        {video.videoName && (
          <div className={styles.videoName}>
            {video.videoName}
          </div>
        )}
      </div>
    </div>
  );
}

