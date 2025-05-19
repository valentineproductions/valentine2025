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

  // Helper function to get video URLs with proper extensions
  const getVideoUrls = (url) => {
    if (!url) return { webm: null, mp4: null };
    
    const baseUrl = url.split('.').slice(0, -1).join('.');
    return {
      webm: `${baseUrl}.webm`,
      mp4: `${baseUrl}.mp4`
    };
  };

  const defaultVideoUrls = {
    webm: "https://cdn.sanity.io/files/m2vd2mbt/production/553b5f5b07875eee33eea3f5988c241b00237e50.webm",
    mp4: "https://cdn.sanity.io/files/m2vd2mbt/production/553b5f5b07875eee33eea3f5988c241b00237e50.mp4"
  };

  const videoUrls = homePageData?.homeVideo1?.asset?.url 
    ? getVideoUrls(homePageData.homeVideo1.asset.url)
    : defaultVideoUrls;

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
        {videoUrls.webm && <source src={videoUrls.webm} type="video/webm" />}
        {videoUrls.mp4 && <source src={videoUrls.mp4} type="video/mp4" />}
      </video>
    </section>
  );
}

export default HomeVideo;