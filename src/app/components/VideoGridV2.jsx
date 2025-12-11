'use client';

import { useState, useRef, useEffect } from 'react';
import styles from './VideoGridV2.module.css';

export default function VideoGridV2({ videos }) {
  const [playingVideoId, setPlayingVideoId] = useState(null);
  const videoRefs = useRef({});

  if (!videos || videos.length === 0) {
    return null;
  }

  const getAspectRatio = (embedCode) => {
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

  // Get embed code with autoplay enabled
  const getAutoplayEmbed = (embedCode) => {
    if (!embedCode) return embedCode;
    
    if (embedCode.includes('<iframe')) {
      return embedCode.replace(
        /src="([^"]+)"/,
        (match, url) => {
          // Enable autoplay by changing /false/ to /true/
          if (url.includes('/share/v/')) {
            const modifiedUrl = url.replace(/\/(false|true)(\/|$)/, '/true$2');
            return `src="${modifiedUrl}"`;
          }
          return match;
        }
      );
    }
    
    return embedCode;
  };

  const handleVideoClick = (video, index) => {
    const videoId = `video-${index}`;
    
    // If clicking the same video, toggle play/pause
    if (playingVideoId === videoId) {
      // Pause: hide name and reload without autoplay
      setPlayingVideoId(null);
    } else {
      // Switch to new video - immediately start playing
      setPlayingVideoId(videoId);
      
      // Scroll the new video into view if needed
      setTimeout(() => {
        const videoElement = videoRefs.current[videoId];
        if (videoElement) {
          videoElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 100);
    }
  };

  return (
    <div className={styles.grid}>
      {videos.map((video, index) => {
        const videoId = `video-${index}`;
        const isPlaying = playingVideoId === videoId;
        // Use autoplay embed only when this video is playing
        const embedCode = isPlaying ? getAutoplayEmbed(video.embedCode) : video.embedCode;
        
        return (
          <div
            key={`${videoId}-${isPlaying ? 'playing' : 'paused'}`}
            className={styles.videoItem}
            data-aspect={getAspectRatio(video.embedCode)}
            style={{
              animationDelay: `${index * 1.05}s`
            }}
          >
            <div
              ref={(el) => (videoRefs.current[videoId] = el)}
              className={styles.videoWrapper}
              onClick={() => handleVideoClick(video, index)}
            >
              <div
                className={styles.videoEmbed}
                dangerouslySetInnerHTML={{ __html: embedCode }}
              />
              {video.videoName && (
                <div className={styles.videoName}>
                  {video.videoName}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

