'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import ImagesAnimation from '@/app/components/ImagesAnimation';
import styles from './WorkGallery.module.css';

export default function WorkGallery({ projects }) {
  const [shuffledImages, setShuffledImages] = useState([]);

  useEffect(() => {
    if (projects && projects.length > 0) {
      const allProjectImages = [];
      projects.forEach((project) => {
        const images = [project.mainImage, ...(project.projectImages || [])].filter(Boolean);
        allProjectImages.push(...images);
      });
      
      // Shuffle the images
      const shuffled = [...allProjectImages].sort(() => Math.random() - 0.5);
      setShuffledImages(shuffled);
    }
  }, [projects]);

  if (!projects || projects.length === 0 || shuffledImages.length === 0) {
    return null;
  }

  return (
    <ImagesAnimation 
      allImages={shuffledImages}
      visibleCount={16}
      intervalTime={4000}
      fadeDuration={1000}
    >
      {(visibleImages, fadingOut) => (
        <div className={styles.workImages}>
          {visibleImages.map((image, index) => (
            <div 
              key={`${image?.asset?.url}-${index}`}
              className={`${styles.imageContainer} ${fadingOut.includes(index) ? styles.fadeOut : styles.fadeIn}`}
            >
              <Image
                src={image?.asset?.url || ''}
                alt={image?.alt || 'Valentine Work Content'}
                width={500}
                height={500}
                className={styles.workProductImage}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  position: 'relative'
                }}
                quality={80}
                loading="lazy"
                unoptimized={image?.asset?.url?.endsWith('.gif')}
                placeholder={image?.asset?.metadata?.lqip ? 'blur' : 'empty'}
                blurDataURL={image?.asset?.metadata?.lqip || ''}
              />
            </div>
          ))}
        </div>
      )}
    </ImagesAnimation>
  );
}

