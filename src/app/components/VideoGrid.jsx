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

  return (
    <>
      <div className={styles.grid}>
        {videos.map((video, index) => (
          <div
            key={index}
            className={styles.videoItem}
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

