'use client';

import { useEffect, useState, useMemo, useRef } from 'react';
import Image from 'next/image';
import VideoModal from './VideoModal';
import styles from './WorkGalleryV2.module.css';

const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const getAspectRatio = (embedCode) => {
  if (!embedCode) return '16-9';
  if (embedCode.includes('padding-bottom:75.00000%') || embedCode.includes('padding-bottom:75%')) {
    return '4-3';
  }
  if (embedCode.includes('padding-bottom:56.25000%') || embedCode.includes('padding-bottom:56.25%')) {
    return '16-9';
  }
  if (embedCode.match(/padding-bottom:\s*1[0-9]{2}/i)) {
    return 'portrait';
  }
  if (embedCode.trim().startsWith('<iframe')) {
    return 'portrait';
  }
  return '16-9';
};

function VideoItem({ video, onVideoClick }) {
  const [isLoading, setIsLoading] = useState(true);
  const videoRef = useRef(null);
  const hasCustomCover = video.coverImage?.asset?.url;

  useEffect(() => {
    if (hasCustomCover) {
      setIsLoading(false);
      return;
    }
    let loadTimeout;
    let checkTimer;
    const checkIframeLoaded = () => {
      if (videoRef.current) {
        const iframe = videoRef.current.querySelector('iframe');
        if (iframe) {
          loadTimeout = setTimeout(() => {
            setIsLoading(false);
          }, 2000);
          iframe.onload = () => {
            if (loadTimeout) clearTimeout(loadTimeout);
            setIsLoading(false);
          };
          try {
            if (iframe.contentWindow && iframe.contentWindow.document) {
              if (loadTimeout) clearTimeout(loadTimeout);
              setIsLoading(false);
            }
          } catch (e) {}
        } else {
          loadTimeout = setTimeout(() => {
            setIsLoading(false);
          }, 500);
        }
      }
    };
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
                style={{ width: 'auto', height: 'auto', maxWidth: '30%', maxHeight: '30%', objectFit: 'contain' }}
              />
            </div>
          )}
          <div className={styles.playButtonOverlay}>
            <Image
              src="/modal-icon.png"
              alt="Play video"
              width={25}
              height={25}
              className={styles.playButtonImage}
            />
          </div>
        </div>
      ) : (
        <>
          {isLoading && (
            <div className={styles.videoLoader}>
              <div className={styles.spinner}></div>
            </div>
          )}
          <div
            ref={videoRef}
            className={styles.videoEmbed}
            dangerouslySetInnerHTML={{ __html: video.embedCode }}
          />
        </>
      )}
    </div>
  );
}

export default function WorkGalleryV3({ projects }) {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [contentItems, setContentItems] = useState([]);
  const [visibleImages, setVisibleImages] = useState([]);
  const [imageContentIndexToSlotIndex, setImageContentIndexToSlotIndex] = useState({});
  const [imageSlotsCount, setImageSlotsCount] = useState(0);
  const [fadingSlots, setFadingSlots] = useState([]);
  const availablePoolRef = useRef([]);
  const INTERVAL_MS = 4000;
  const FADE_MS = 1000;

  const { allVideos, allImages } = useMemo(() => {
    if (!projects || projects.length === 0) {
      return { allVideos: [], allImages: [] };
    }
    const videos = [];
    const images = [];
    projects.forEach((project) => {
      if (project.videos && project.videos.length > 0) {
        project.videos.forEach((video) => {
          if (video.embedCode) {
            videos.push({ ...video, projectId: project._id, projectName: project.name });
          }
        });
      }
      if (project.projectImages && project.projectImages.length > 0) {
        project.projectImages.forEach((image) => {
          if (image?.asset?.url) {
            images.push({ ...image, projectId: project._id, projectName: project.name });
          }
        });
      }
    });
    return { allVideos: shuffleArray(videos), allImages: shuffleArray(images) };
  }, [projects]);

  useEffect(() => {
    if (allVideos.length === 0 && allImages.length === 0) {
      setContentItems([]);
      setVisibleImages([]);
      setImageContentIndexToSlotIndex({});
      setImageSlotsCount(0);
      return;
    }
    const items = [];
    let v = 0;
    let i = 0;
    while (true) {
      if (v + 2 > allVideos.length) break;
      if (i + 4 > allImages.length) break;
      for (let k = 0; k < 2; k++) {
        items.push({ type: 'video', data: allVideos[v], index: v });
        v++;
      }
      for (let k = 0; k < 4; k++) {
        items.push({ type: 'image', data: allImages[i], index: i });
        i++;
      }
    }
    setContentItems(items);
    const imgIndices = [];
    const mapping = {};
    let slot = 0;
    for (let idx = 0; idx < items.length; idx++) {
      if (items[idx].type === 'image') {
        mapping[idx] = slot;
        imgIndices.push(idx);
        slot++;
      }
    }
    const initialVisible = imgIndices.map((ci) => items[ci].data);
    setVisibleImages(initialVisible);
    setImageContentIndexToSlotIndex(mapping);
    setImageSlotsCount(initialVisible.length);
    const visibleUrls = new Set(initialVisible.map((img) => img?.asset?.url));
    availablePoolRef.current = allImages.filter((img) => !visibleUrls.has(img?.asset?.url));
  }, [allVideos, allImages]);

  useEffect(() => {
    if (imageSlotsCount === 0) return;
    if (selectedVideo) return;
    const interval = setInterval(() => {
      const slotIdx = Math.floor(Math.random() * imageSlotsCount);
      setFadingSlots([slotIdx]);
      setTimeout(() => {
        setVisibleImages((current) => {
          const next = [...current];
          let pool = availablePoolRef.current.slice();
          let candidate = null;
          const currentUrl = current[slotIdx]?.asset?.url;
          const currentUrls = new Set(current.map((img) => img?.asset?.url));
          while (pool.length > 0) {
            const r = Math.floor(Math.random() * pool.length);
            const pick = pool[r];
            const pickUrl = pick?.asset?.url;
            if (pickUrl !== currentUrl && !currentUrls.has(pickUrl)) {
              candidate = pick;
              pool.splice(r, 1);
              break;
            }
            pool.splice(r, 1);
          }
          if (!candidate) {
            const options = allImages.filter((img) => img?.asset?.url !== currentUrl && !currentUrls.has(img?.asset?.url));
            candidate = options.length > 0 ? options[Math.floor(Math.random() * options.length)] : current[slotIdx];
          }
          next[slotIdx] = candidate;
          const nextUrls = new Set(next.map((img) => img?.asset?.url));
          availablePoolRef.current = allImages.filter((img) => !nextUrls.has(img?.asset?.url));
          return next;
        });
        setTimeout(() => {
          setFadingSlots([]);
        }, FADE_MS / 2);
      }, FADE_MS / 2);
    }, INTERVAL_MS);
    return () => clearInterval(interval);
  }, [imageSlotsCount, allImages, selectedVideo]);

  const handleVideoClick = (video) => {
    setSelectedVideo(video);
  };
  const handleCloseVideoModal = () => {
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
                onVideoClick={handleVideoClick}
              />
            );
          } else {
            const slotIdx = imageContentIndexToSlotIndex[index];
            const currentImage = typeof slotIdx === 'number' ? visibleImages[slotIdx] : item.data;
            const fading = typeof slotIdx === 'number' && fadingSlots.includes(slotIdx);
            return (
              <div
                key={`image-${item.index}-${slotIdx ?? 'x'}`}
                className={`${styles.imageItem} ${fading ? styles.fadeOut : styles.fadeIn}`}
                style={{ cursor: 'default' }}
              >
                <Image
                  src={currentImage.asset.url}
                  alt={currentImage.alt || 'Valentine Work Content'}
                  width={500}
                  height={500}
                  className={styles.workImage}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  quality={80}
                  loading="lazy"
                  unoptimized={currentImage.asset.url?.endsWith('.gif')}
                  placeholder={currentImage.asset.metadata?.lqip ? 'blur' : 'empty'}
                  blurDataURL={currentImage.asset.metadata?.lqip || ''}
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
    </>
  );
}
