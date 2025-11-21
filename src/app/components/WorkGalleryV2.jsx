'use client';

import { useEffect, useState, useMemo, useRef } from 'react';
import Image from 'next/image';
import VideoModal from './VideoModal';
import ImageGalleryModal from './ImageGalleryModal';
import styles from './WorkGalleryV2.module.css';

// Helper function to shuffle array
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Helper function to detect aspect ratio
const getAspectRatio = (embedCode) => {
  if (!embedCode) return '16-9';
  if (embedCode.includes('padding-bottom:75.00000%') || embedCode.includes('padding-bottom:75%')) {
    return '4-3';
  }
  if (embedCode.includes('padding-bottom:56.25000%') || embedCode.includes('padding-bottom:56.25%')) {
    return '16-9';
  }
  // Check for portrait videos (padding-bottom > 100%, like 133.33% for 9:16 or 177.78% for 9:16)
  if (embedCode.match(/padding-bottom:\s*1[0-9]{2}/i)) {
    return 'portrait';
  }
  // Direct iframe without wrapper is likely portrait
  if (embedCode.trim().startsWith('<iframe')) {
    return 'portrait';
  }
  return '16-9'; // Default to 16-9 if unknown
};

// Video Item Component with Loading State
function VideoItem({ video, index, onVideoClick }) {
  const [isLoading, setIsLoading] = useState(true);
  const videoRef = useRef(null);
  const hasCustomCover = video.coverImage?.asset?.url;

  useEffect(() => {
    // Only check for iframe loading if we don't have a custom cover
    if (hasCustomCover) {
      setIsLoading(false);
      return;
    }

    let loadTimeout;
    let checkTimer;

    // Find the iframe after it's rendered
    const checkIframeLoaded = () => {
      if (videoRef.current) {
        const iframe = videoRef.current.querySelector('iframe');
        if (iframe) {
          // Try to detect if iframe is loaded
          // For cross-origin iframes, onload might not fire, so we use a timeout
          loadTimeout = setTimeout(() => {
            setIsLoading(false);
          }, 2000); // Hide spinner after 2 seconds (adjust based on typical load time)

          // Try to listen for load event (works for same-origin)
          iframe.onload = () => {
            if (loadTimeout) clearTimeout(loadTimeout);
            setIsLoading(false);
          };

          // Also check if iframe content is accessible (may not work for cross-origin)
          try {
            if (iframe.contentWindow && iframe.contentWindow.document) {
              if (loadTimeout) clearTimeout(loadTimeout);
              setIsLoading(false);
            }
          } catch (e) {
            // Cross-origin restriction - timeout will handle it
          }
        } else {
          // No iframe found, hide spinner after short delay
          loadTimeout = setTimeout(() => {
            setIsLoading(false);
          }, 500);
        }
      }
    };

    // Check after a short delay to allow DOM to update
    checkTimer = setTimeout(checkIframeLoaded, 100);
    
    return () => {
      if (checkTimer) clearTimeout(checkTimer);
      if (loadTimeout) clearTimeout(loadTimeout);
    };
  }, [hasCustomCover]);

  return (
    <div
      className={styles.videoItem}
      data-aspect={getAspectRatio(video.embedCode)}
      onClick={() => onVideoClick(video)}
    >
      {hasCustomCover ? (
        // Show custom cover image with logo and play button
        <div className={styles.customVideoCover}>
          <Image
            src={video.coverImage.asset.url}
            alt={video.coverImage.alt || video.videoName || 'Video cover'}
            fill
            className={styles.coverImage}
            style={{ objectFit: 'cover' }}
            quality={90}
          />
          {video.logo?.asset?.url && (
            <div className={styles.logoOverlay}>
              <Image
                src={video.logo.asset.url}
                alt={video.logo.alt || 'Logo'}
                width={200}
                height={200}
                className={styles.logo}
                style={{ 
                  width: 'auto',
                  height: 'auto',
                  maxWidth: '30%',
                  maxHeight: '30%',
                  objectFit: 'contain'
                }}
              />
            </div>
          )}
          <div className={styles.playButtonOverlay}>
            <Image
              src="/playValentineSimian.png"
              alt="Play video"
              width={25}
              height={25}
              className={styles.playButtonImage}
            />
          </div>
        </div>
      ) : (
        // Fallback to Simian embed if no custom cover
        <>
          {isLoading && (
            <div className={styles.videoLoader}>
              <div className={styles.spinner}></div>
            </div>
          )}
          <div
            ref={videoRef}
            className={styles.videoEmbed}
            style={{ opacity: isLoading ? 0 : 1 }}
            dangerouslySetInnerHTML={{ __html: video.embedCode }}
          />
        </>
      )}
    </div>
  );
}

export default function WorkGalleryV2({ projects }) {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedImages, setSelectedImages] = useState(null);
  const [initialImageIndex, setInitialImageIndex] = useState(0);
  const [contentItems, setContentItems] = useState([]);

  // Process projects to extract videos and images
  const { allVideos, allImages } = useMemo(() => {
    if (!projects || projects.length === 0) {
      return { allVideos: [], allImages: [] };
    }

    const videos = [];
    const images = [];

    projects.forEach((project) => {
      // Collect videos from projects that have videos
      if (project.videos && project.videos.length > 0) {
        project.videos.forEach((video) => {
          if (video.embedCode) {
            videos.push({
              ...video,
              projectId: project._id,
              projectName: project.name,
            });
          }
        });
      }

      // Collect images from all projects that have images
      if (project.projectImages && project.projectImages.length > 0) {
        project.projectImages.forEach((image) => {
          if (image?.asset?.url) {
            images.push({
              ...image,
              projectId: project._id,
              projectName: project.name,
            });
          }
        });
      }
    });

    return {
      allVideos: shuffleArray(videos),
      allImages: shuffleArray(images),
    };
  }, [projects]);

  // Build content pattern: 2 videos + 4 images, repeating
  useEffect(() => {
    if (allVideos.length === 0 && allImages.length === 0) {
      setContentItems([]);
      return;
    }

    const items = [];
    let videoIndex = 0;
    let imageIndex = 0;

    // Continue until we can't complete a full cycle (2 videos + 4 images)
    while (true) {
      // Check if we have enough videos for this cycle (need 2)
      if (videoIndex + 2 > allVideos.length) {
        break; // Can't complete cycle, stop
      }

      // Check if we have enough images for this cycle (need 4)
      if (imageIndex + 4 > allImages.length) {
        break; // Can't complete cycle, stop
      }

      // Add 2 videos
      for (let i = 0; i < 2; i++) {
        items.push({
          type: 'video',
          data: allVideos[videoIndex],
          index: videoIndex,
        });
        videoIndex++;
      }

      // Add 4 images
      for (let i = 0; i < 4; i++) {
        items.push({
          type: 'image',
          data: allImages[imageIndex],
          index: imageIndex,
        });
        imageIndex++;
      }
    }

    setContentItems(items);
  }, [allVideos, allImages]);

  const handleVideoClick = (video) => {
    setSelectedVideo(video);
  };

  const handleCloseVideoModal = () => {
    setSelectedVideo(null);
  };

  const handleImageClick = (clickedImage) => {
    // Find all images from the same project
    const projectImages = allImages.filter(
      (image) => image.projectId === clickedImage.projectId
    );
    
    // Find the index of the clicked image in the project's images
    const clickedIndex = projectImages.findIndex(
      (img) => img.asset.url === clickedImage.asset.url
    );
    
    setSelectedImages(projectImages);
    setInitialImageIndex(clickedIndex >= 0 ? clickedIndex : 0);
  };

  const handleCloseImageModal = () => {
    setSelectedImages(null);
    setInitialImageIndex(0);
  };

  if (contentItems.length === 0) {
    return null;
  }

  return (
    <>
      <div className={styles.gallery}>
        {contentItems.map((item, index) => {
          if (item.type === 'video') {
            return (
              <VideoItem
                key={`video-${item.index}`}
                video={item.data}
                index={item.index}
                onVideoClick={handleVideoClick}
              />
            );
          } else {
            return (
              <div
                key={`image-${item.index}`}
                className={styles.imageItem}
                onClick={() => handleImageClick(item.data)}
                style={{ cursor: 'pointer' }}
              >
                <Image
                  src={item.data.asset.url}
                  alt={item.data.alt || 'Valentine Work Content'}
                  width={500}
                  height={500}
                  className={styles.workImage}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                  quality={80}
                  loading="lazy"
                  unoptimized={item.data.asset.url?.endsWith('.gif')}
                  placeholder={item.data.asset.metadata?.lqip ? 'blur' : 'empty'}
                  blurDataURL={item.data.asset.metadata?.lqip || ''}
                />
              </div>
            );
          }
        })}
      </div>
      {selectedVideo && (
        <VideoModal
          video={selectedVideo}
          onClose={handleCloseVideoModal}
        />
      )}
      {selectedImages && selectedImages.length > 0 && (
        <ImageGalleryModal
          images={selectedImages}
          initialIndex={initialImageIndex}
          onClose={handleCloseImageModal}
        />
      )}
    </>
  );
}

