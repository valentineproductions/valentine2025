'use client';
import { useEffect, useState, useRef } from 'react';

export default function ImagesAnimation({
  children,
  allImages = [],
  visibleCount = 16,
  intervalTime = 5000,
  fadeDuration = 1000
}) {
  const [visibleImages, setVisibleImages] = useState([]);
  const [fadingOut, setFadingOut] = useState([]);
  const availableImages = useRef([]);

  // Initialize with unique images
  useEffect(() => {
    if (allImages.length > 0) {
      availableImages.current = [...allImages];
      setVisibleImages(getRandomUniqueImages(visibleCount));
    }
  }, [allImages, visibleCount]);

  // Get random unique images that aren't currently visible
  const getRandomUniqueImages = (count) => {
    const newImages = [];
    const candidates = [...availableImages.current];
    
    while (newImages.length < count && candidates.length > 0) {
      const randomIndex = Math.floor(Math.random() * candidates.length);
      const selectedImage = candidates[randomIndex];
      
      // Ensure this image isn't already visible
      if (!visibleImages.some(img => img.asset.url === selectedImage.asset.url)) {
        newImages.push(selectedImage);
      }
      
      // Remove from candidates regardless to prevent infinite loops
      candidates.splice(randomIndex, 1);
    }
    
    // If we couldn't find enough unique images, start recycling
    if (newImages.length < count) {
      const recycled = allImages.filter(img => 
        !visibleImages.some(visible => visible.asset.url === img.asset.url)
      );
      const needed = count - newImages.length;
      newImages.push(...shuffleArray(recycled).slice(0, needed));
    }
    
    return newImages;
  };

  // Fisher-Yates shuffle
  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  // Animation effect
  useEffect(() => {
    if (allImages.length <= visibleCount) return;

    const interval = setInterval(() => {
      const numToReplace = Math.floor(Math.random() * 4) + 4; // Replace 4-7 images
      const indicesToReplace = getRandomIndices(numToReplace, visibleCount);
      
      // Start fade out
      setFadingOut(indicesToReplace);
      
      // After half duration, replace images
      setTimeout(() => {
        setVisibleImages(current => {
          const newImages = [...current];
          const replacements = getRandomUniqueImages(numToReplace);
          
          indicesToReplace.forEach((idx, i) => {
            if (replacements[i]) {
              newImages[idx] = replacements[i];
            }
          });
          
          return newImages;
        });
        
        // Fade back in
        setTimeout(() => {
          setFadingOut([]);
        }, fadeDuration / 2);
      }, fadeDuration / 2);
      
    }, intervalTime);

    return () => clearInterval(interval);
  }, [allImages, visibleCount, intervalTime, fadeDuration, visibleImages]);

  // Helper to get unique random indices
  const getRandomIndices = (count, max) => {
    const indices = new Set();
    while (indices.size < Math.min(count, max)) {
      indices.add(Math.floor(Math.random() * max));
    }
    return Array.from(indices);
  };

  return children(visibleImages, fadingOut);
}