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
    
    // If it's an iframe, ensure autoplay is enabled in the URL path
    // Simian URL structure: /share/v/{videoId}/{autoplay}/{width}/{height}/{progressBarColor}/{backgroundColor}/
    if (embedCode.includes('<iframe')) {
      return embedCode.replace(
        /src="([^"]+)"/,
        (match, url) => {
          // Always set autoplay to 'true' in the modal
          // Match the pattern: /share/v/{videoId}/{autoplay}/...
          // Replace /false/ or /true/ with /true/ to ensure autoplay
          let modifiedUrl = url;
          
          // Check if URL matches Simian pattern
          if (url.includes('/share/v/')) {
            // Replace /false/ or /true/ with /true/ for autoplay
            modifiedUrl = url.replace(/\/(false|true)(\/|$)/, '/true$2');
          }
          
          return `src="${modifiedUrl}"`;
        }
      );
    }
    
    return embedCode;
  };

  // Try to infer the exact aspect ratio from embed code.
  // This helps avoid extra black bars when content is not 16:9.
  const getEmbedAspectRatio = (embedCode) => {
    if (!embedCode) return 16 / 9;

    // Most Simian wrappers include padding-bottom:{height/width*100}%
    const paddingMatch = embedCode.match(/padding-bottom:\s*([0-9]+(?:\.[0-9]+)?)%/i);
    if (paddingMatch) {
      const paddingPercent = Number(paddingMatch[1]);
      if (Number.isFinite(paddingPercent) && paddingPercent > 0) {
        return 100 / paddingPercent;
      }
    }

    // Fallback: iframe width/height attributes
    const widthMatch = embedCode.match(/width=["'](\d+)["']/i);
    const heightMatch = embedCode.match(/height=["'](\d+)["']/i);
    if (widthMatch && heightMatch) {
      const width = Number(widthMatch[1]);
      const height = Number(heightMatch[1]);
      if (Number.isFinite(width) && Number.isFinite(height) && width > 0 && height > 0) {
        return width / height;
      }
    }

    // Fallback: Simian URL pattern /share/v/{id}/{autoplay}/{width}/{height}/...
    const simianSizeMatch = embedCode.match(/\/share\/v\/[^/]+\/(?:true|false)\/(\d+)\/(\d+)\//i);
    if (simianSizeMatch) {
      const width = Number(simianSizeMatch[1]);
      const height = Number(simianSizeMatch[2]);
      if (Number.isFinite(width) && Number.isFinite(height) && width > 0 && height > 0) {
        return width / height;
      }
    }

    return 16 / 9;
  };

  const aspectRatio = getEmbedAspectRatio(video?.embedCode);
  const safeAspectRatio = Number.isFinite(aspectRatio) && aspectRatio > 0 ? aspectRatio : 16 / 9;

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
        <div
          className={styles.videoContainer}
          style={{ '--video-ratio': safeAspectRatio }}
        >
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

