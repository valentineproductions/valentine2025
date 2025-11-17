'use client';

import { useEffect, useState, useMemo, useRef } from 'react';
import Image from 'next/image';
import VideoModal from './VideoModal';
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

// Video Item Component with Loading State
function VideoItem({ video, index, onVideoClick }) {
  const [isLoading, setIsLoading] = useState(true);
  const videoRef = useRef(null);

  useEffect(() => {
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
  }, []);

  return (
    <div
      className={styles.videoItem}
      onClick={() => onVideoClick(video)}
    >
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
    </div>
  );
}

export default function WorkGalleryV2({ projects }) {
  const [selectedVideo, setSelectedVideo] = useState(null);
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

  const handleCloseModal = () => {
    setSelectedVideo(null);
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
          onClose={handleCloseModal}
        />
      )}
    </>
  );
}

