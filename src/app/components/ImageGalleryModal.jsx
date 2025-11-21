'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import styles from './ImageGalleryModal.module.css';

export default function ImageGalleryModal({ images, initialIndex, onClose }) {
  const modalRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(initialIndex || 0);

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

    // Handle arrow keys for navigation
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowLeft') {
        handlePrevious();
      } else if (event.key === 'ArrowRight') {
        handleNext();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    document.addEventListener('keydown', handleKeyDown);
    
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';

    // Scroll to initial image
    if (scrollContainerRef.current && initialIndex !== undefined) {
      const imageElement = scrollContainerRef.current.children[initialIndex];
      if (imageElement) {
        imageElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [onClose, initialIndex]);

  const handleNext = () => {
    if (currentIndex < images.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      const imageElement = scrollContainerRef.current?.children[newIndex];
      if (imageElement) {
        imageElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      const imageElement = scrollContainerRef.current?.children[newIndex];
      if (imageElement) {
        imageElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollLeft = container.scrollLeft;
      const imageWidth = container.children[0]?.offsetWidth || 0;
      const gap = 20; // Match the gap in CSS
      const newIndex = Math.round(scrollLeft / (imageWidth + gap));
      setCurrentIndex(newIndex);
    }
  };

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal} ref={modalRef}>
        <button
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close gallery"
        >
          ×
        </button>
        
        {images.length > 1 && (
          <>
            <button
              className={styles.navButton}
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              aria-label="Previous image"
            >
              ‹
            </button>
            <button
              className={`${styles.navButton} ${styles.navButtonRight}`}
              onClick={handleNext}
              disabled={currentIndex === images.length - 1}
              aria-label="Next image"
            >
              ›
            </button>
          </>
        )}

        <div 
          className={styles.galleryContainer}
          ref={scrollContainerRef}
          onScroll={handleScroll}
        >
          {images.map((image, index) => (
            <div key={index} className={styles.imageWrapper}>
              <Image
                src={image.asset.url}
                alt={image.alt || `Image ${index + 1}`}
                width={1200}
                height={800}
                className={styles.galleryImage}
                quality={90}
                unoptimized={image.asset.url?.endsWith('.gif')}
                placeholder={image.asset.metadata?.lqip ? 'blur' : 'empty'}
                blurDataURL={image.asset.metadata?.lqip || ''}
              />
            </div>
          ))}
        </div>

        {images.length > 1 && (
          <div className={styles.counter}>
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>
    </div>
  );
}

