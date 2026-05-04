'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { resolveProfileProjectPlayback } from '@/app/lib/simianProfileVideo';
import DirectorProfilePlayCursor from '@/app/components/DirectorProfilePlayCursor';
import styles from './DirectorProjectVideoPlayer.module.css';

export default function DirectorProjectVideoPlayer({
  simianSource,
  directorProfileHref,
  directorName,
  projectName,
  logoUrl,
  logoAlt = 'Valentine',
}) {
  const playback = useMemo(
    () => resolveProfileProjectPlayback(simianSource),
    [simianSource]
  );

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
  const videoRef = useRef(null);
  const cursorZoneRef = useRef(null);

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
            width={120}
            height={28}
            className={styles.logoImg}
            priority
            sizes="120px"
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
                controls
                playsInline
                preload="auto"
                autoPlay
                muted={false}
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
          <p>No Simian source is set for this project, or it could not be read.</p>
          <p className={styles.missingHint}>
            In Sanity → Team Member → Profile Projects, set <strong>Simian proxy file (MP4)</strong> to the
            proxy file name (e.g. <code>Nike-x-Union-LA-Field-General-Colored_4K_mov.mp4</code>) or the full
            URL under <code>https://valentine.gosimian.com/assets/videos/</code>. You can also paste a legacy
            Simian <strong>share</strong> iframe URL (src only). After saving, do a full page refresh so the
            site picks up new data.
          </p>
        </div>
      )}
    </div>
  );
}
