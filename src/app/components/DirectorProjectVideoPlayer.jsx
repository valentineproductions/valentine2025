'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { resolveProfileProjectPlayback } from '@/app/lib/simianProfileVideo';
import DirectorProfilePlayCursor from '@/app/components/DirectorProfilePlayCursor';
import styles from './DirectorProjectVideoPlayer.module.css';

export default function DirectorProjectVideoPlayer({
  simianSource,
  uploadedClipUrl = '',
  directorProfileHref,
  directorName,
  projectName,
  logoUrl,
  logoAlt = 'Valentine',
}) {
  const playback = useMemo(() => {
    const simian = resolveProfileProjectPlayback(simianSource);
    if (simian.kind !== 'none') return simian;
    const clip = String(uploadedClipUrl || '').trim();
    if (clip) return { kind: 'mp4', src: clip };
    return { kind: 'none' };
  }, [simianSource, uploadedClipUrl]);

  const hasMedia = playback.kind !== 'none';
  const mp4Src = playback.kind === 'mp4' ? playback.src : '';
  const iframeSrc = playback.kind === 'iframe' ? playback.src : '';

  /** playing: iframe mounted | paused: removed — iframe legacy only */
  const [playbackState, setPlaybackState] = useState(() => (iframeSrc ? 'playing' : 'paused'));
  const [embedRemountKey, setEmbedRemountKey] = useState(0);
  const [iframeLoading, setIframeLoading] = useState(() => Boolean(iframeSrc));
  const [videoLoading, setVideoLoading] = useState(() => Boolean(mp4Src));
  const [videoError, setVideoError] = useState(false);
  /** Drives cursor icon — mirrors <video>.paused */
  const [videoUiPaused, setVideoUiPaused] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [muted, setMuted] = useState(false);
  const videoRef = useRef(null);
  const cursorZoneRef = useRef(null);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const apply = () => setIsMobile(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  useEffect(() => {
    setVideoError(false);
    setVideoLoading(Boolean(mp4Src));
    setVideoUiPaused(true);
  }, [mp4Src]);

  useEffect(() => {
    if (playback.kind !== 'mp4') return undefined;
    const v = videoRef.current;
    if (!v) return undefined;
    const sync = () => setVideoUiPaused(v.paused);
    sync();
    v.addEventListener('play', sync);
    v.addEventListener('pause', sync);
    v.addEventListener('emptied', sync);
    return () => {
      v.removeEventListener('play', sync);
      v.removeEventListener('pause', sync);
      v.removeEventListener('emptied', sync);
    };
  }, [playback.kind, mp4Src]);

  useEffect(() => {
    if (!videoLoading || playback.kind !== 'mp4' || !mp4Src) return;
    const t = window.setTimeout(() => setVideoLoading(false), 15000);
    return () => clearTimeout(t);
  }, [videoLoading, playback.kind, mp4Src]);

  const showIframe = playback.kind === 'iframe' && playbackState === 'playing' && Boolean(iframeSrc);
  const embedInteractive = showIframe && !iframeLoading;

  useEffect(() => {
    if (!iframeLoading || !showIframe) return;
    const t = window.setTimeout(() => setIframeLoading(false), 15000);
    return () => clearTimeout(t);
  }, [iframeLoading, showIframe]);

  const handleIframeLoad = useCallback(() => {
    setIframeLoading(false);
  }, []);

  const handlePlayEmbed = useCallback(() => {
    if (!iframeSrc) return;
    if (iframeLoading) return;
    setPlaybackState('playing');
    setIframeLoading(true);
    setEmbedRemountKey((k) => k + 1);
  }, [iframeSrc, iframeLoading]);

  const handleVideoReady = useCallback(() => {
    setVideoLoading(false);
    setVideoError(false);
  }, []);

  const handleVideoError = useCallback(() => {
    setVideoLoading(false);
    setVideoError(true);
  }, []);

  const toggleMute = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  }, []);

  const toggleFullscreen = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (document.fullscreenElement) {
      document.exitFullscreen?.().catch(() => {});
      return;
    }
    if (typeof v.webkitEnterFullscreen === 'function') {
      v.webkitEnterFullscreen();
      return;
    }
    v.requestFullscreen?.().catch(() => {});
  }, []);

  const togglePictureInPicture = useCallback(async () => {
    const v = videoRef.current;
    if (!v || !document.pictureInPictureEnabled) return;
    try {
      if (document.pictureInPictureElement === v) {
        await document.exitPictureInPicture();
      } else {
        await v.requestPictureInPicture();
      }
    } catch {
      /* PiP denied or unsupported */
    }
  }, []);

  const showMobileVideoControls =
    isMobile && playback.kind === 'mp4' && Boolean(mp4Src) && !videoLoading && !videoError;
  const pipSupported =
    typeof document !== 'undefined' && 'pictureInPictureEnabled' in document;

  const directorDisplay = directorName?.trim() || 'Director';
  const projectDisplay = (projectName || 'Video').trim();

  const showPlayOverlay = playback.kind === 'iframe' && hasMedia && !embedInteractive;

  return (
    <div className={styles.root}>
      {logoUrl ? (
        <Link href="/" className={styles.logoLink} aria-label="Valentine home" data-no-play-cursor>
          <Image
            src={logoUrl}
            alt={logoAlt}
            width={77}
            height={18}
            className={styles.logoImg}
            priority
            sizes="77px"
          />
        </Link>
      ) : null}

      <Link
        href={directorProfileHref}
        className={styles.close}
        data-no-play-cursor
        aria-label={`Close and return to ${directorName || 'director profile'}`}
      >
        CLOSE
      </Link>

      {hasMedia ? (
        <div ref={cursorZoneRef} className={styles.playerStack}>
          {playback.kind === 'mp4' && mp4Src ? (
            <>
              <video
                ref={videoRef}
                key={mp4Src}
                className={styles.frame}
                src={mp4Src}
                controls={!isMobile}
                playsInline
                preload="auto"
                autoPlay
                muted={isMobile ? muted : false}
                onLoadedData={handleVideoReady}
                onLoadedMetadata={handleVideoReady}
                onCanPlay={handleVideoReady}
                onError={handleVideoError}
                aria-label={projectName ? `${directorName || 'Director'} — ${projectName}` : 'Project video'}
              />
              {videoError ? (
                <div className={styles.videoError} role="alert">
                  This video could not be loaded (blocked, wrong file name, or missing on Simian). Check
                  the Simian proxy file / MP4 URL in Sanity, hard-refresh after publishing, and confirm the
                  file opens at the same URL in a new tab.
                </div>
              ) : null}
            </>
          ) : showIframe ? (
            <iframe
              key={embedRemountKey}
              title={
                projectName ? `${directorName || 'Director'} — ${projectName}` : 'Project video'
              }
              src={iframeSrc}
              className={styles.frame}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; fullscreen; gyroscope; picture-in-picture"
              allowFullScreen
              onLoad={handleIframeLoad}
            />
          ) : (
            <div className={styles.framePlaceholder} aria-hidden />
          )}

          <div className={styles.titleBar}>
            <div className={styles.titleLine}>
              <span className={styles.directorTitle}>{directorDisplay}</span>
              {' '}
              <span className={styles.projectTitle}>{projectDisplay}</span>
            </div>
          </div>

          {showMobileVideoControls ? (
            <div className={styles.mobileControlBar} data-no-play-cursor>
              <button
                type="button"
                className={styles.mobileControlBtn}
                onClick={toggleFullscreen}
                aria-label="Enter fullscreen"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path
                    d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              {pipSupported ? (
                <button
                  type="button"
                  className={styles.mobileControlBtn}
                  onClick={togglePictureInPicture}
                  aria-label="Picture in picture"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <rect
                      x="3"
                      y="5"
                      width="14"
                      height="11"
                      rx="1.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <rect
                      x="11"
                      y="9"
                      width="10"
                      height="10"
                      rx="1.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                  </svg>
                </button>
              ) : null}
              <button
                type="button"
                className={styles.mobileControlBtn}
                onClick={toggleMute}
                aria-label={muted ? 'Unmute' : 'Mute'}
              >
                {muted ? (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path
                      d="M11 5L6 9H3v6h3l5 4V5zM22 9l-6 6M16 9l6 6"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path
                      d="M11 5L6 9H3v6h3l5 4V5zM15.54 8.46a5 5 0 010 7.08M19.07 4.93a9 9 0 010 14.14"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </button>
            </div>
          ) : null}

          {playback.kind === 'mp4' && videoLoading && !videoError ? (
            <div className={styles.loadingBadge} aria-live="polite">
              Loading…
            </div>
          ) : null}

          {playback.kind === 'iframe' && iframeLoading ? (
            <div className={styles.loadingBadge} aria-live="polite">
              Loading…
            </div>
          ) : null}

          {showPlayOverlay ? (
            <button
              type="button"
              className={styles.hitLayer}
              aria-label={playbackState === 'paused' ? 'Load and play video' : 'Loading video'}
              onClick={playbackState === 'paused' ? handlePlayEmbed : undefined}
            />
          ) : null}

          {playback.kind === 'mp4' && mp4Src && !videoLoading && !videoError ? (
            <DirectorProfilePlayCursor
              containerRef={cursorZoneRef}
              chromeExcludeSelector="[data-no-play-cursor]"
              iconSrc={videoUiPaused ? '/cursor-play.svg' : '/cursor-pause.svg'}
              disabled={false}
            />
          ) : null}
        </div>
      ) : (
        <div className={styles.missing}>
          <p>No video is available for this project.</p>
          <p className={styles.missingHint}>
            In Sanity → Team Member → Profile Projects, upload a <strong>Profile Clip</strong> or set{' '}
            <strong>Simian proxy file (MP4)</strong> for this project, then publish and refresh.
          </p>
        </div>
      )}
    </div>
  );
}
