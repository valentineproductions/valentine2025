'use client';

import { useState } from 'react';
import VideoModal from './VideoModal';
import styles from './VideoGrid.module.css';

export default function VideoGrid({ videos }) {
  const [selectedVideo, setSelectedVideo] = useState(null);

  if (!videos || videos.length === 0) {
    return null;
  }

  const handleVideoClick = (video) => {
    setSelectedVideo(video);
  };

  const handleCloseModal = () => {
    setSelectedVideo(null);
  };

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

  return (
    <>
      <div className={styles.grid}>
        {videos.map((video, index) => (
          <div
            key={index}
            className={styles.videoItem}
            data-aspect={getAspectRatio(video.embedCode)}
            style={{
              animationDelay: `${index * 1.05}s`
            }}
            onClick={() => handleVideoClick(video)}
          >
            <div
              className={styles.videoEmbed}
              dangerouslySetInnerHTML={{ __html: video.embedCode }}
            />
          </div>
        ))}
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

