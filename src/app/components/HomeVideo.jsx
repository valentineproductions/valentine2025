'use client';

import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

function HomeVideo({ homePageData }) {
  const videoRef = useRef(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    const section = sectionRef.current;

    const handleVideoLoad = () => {
      if (section) {
        section.classList.add('videoReady');
        if (video) {
          gsap.to(video, { opacity: 1, duration: 7, ease: 'power1.inOut' });
        }
      }
    };

    if (video && section) {
      // Set initial opacity to 0
      gsap.set(video, { 
        opacity: 0,
      });

      // Check if the video is already loaded
      if (video.readyState >= 2) {
        section.classList.add('videoReady');
        gsap.to(video, { 
          opacity: 1, 
          delay: 4, 
          duration: 7, 
          ease: 'power1.inOut' 
        });
      } else {
        video.addEventListener('loadeddata', handleVideoLoad);
      }

      return () => {
        if (video) {
          video.removeEventListener('loadeddata', handleVideoLoad);
        }
      };
    }
  }, [homePageData]);

  // Use the asset URL as-is from Sanity - don't construct .webm (Sanity only stores the uploaded format)
  const defaultVideoUrl = "https://cdn.sanity.io/files/m2vd2mbt/production/553b5f5b07875eee33eea3f5988c241b00237e50.mp4";
  const videoUrl = homePageData?.homeVideo1?.asset?.url || defaultVideoUrl;

  return (
    <section ref={sectionRef} className="homeVideo">
      <video 
        ref={videoRef} 
        className="videos" 
        autoPlay 
        muted 
        loop 
        playsInline 
        style={{ opacity: 0 }}
      >
        <source src={videoUrl} type={videoUrl.endsWith('.webm') ? 'video/webm' : 'video/mp4'} />
      </video>
    </section>
  );
}

export default HomeVideo;