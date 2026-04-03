'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';
import { normalizeSimianEmbedSrc } from '@/app/lib/simianEmbedUrl';
import styles from './DirectorProjectVideoPlayer.module.css';

export default function DirectorProjectVideoPlayer({
  embedUrl,
  directorProfileHref,
  directorName,
  projectName,
  logoUrl,
  logoAlt = 'Valentine',
}) {
  const hasEmbed = Boolean(embedUrl && String(embedUrl).trim());
  const normalizedSrc = hasEmbed ? normalizeSimianEmbedSrc(embedUrl) : '';

  /** playing: iframe mounted | paused: removed */
  const [playback, setPlayback] = useState(() => (normalizedSrc ? 'playing' : 'paused'));
  /** Only bumps when resuming from paused — do not remount on a timer (that caused triple loads + cursor glitches). */
  const [embedRemountKey, setEmbedRemountKey] = useState(0);
  const [iframeLoading, setIframeLoading] = useState(() => Boolean(normalizedSrc));

  const showIframe = playback === 'playing' && Boolean(normalizedSrc);
  const embedInteractive = showIframe && !iframeLoading;

  /** Max wait for loading badge if onLoad is delayed; does not remount iframe. */
  useEffect(() => {
    if (!iframeLoading || !showIframe) return;
    const t = window.setTimeout(() => setIframeLoading(false), 15000);
    return () => clearTimeout(t);
  }, [iframeLoading, showIframe]);

  const handleIframeLoad = useCallback(() => {
    setIframeLoading(false);
  }, []);

  const handlePlayEmbed = useCallback(() => {
    if (!normalizedSrc) return;
    if (iframeLoading) return;
    setPlayback('playing');
    setIframeLoading(true);
    setEmbedRemountKey((k) => k + 1);
  }, [normalizedSrc, iframeLoading]);

  const directorDisplay = directorName?.trim() || 'Director';
  const projectDisplay = (projectName || 'Video').trim();

  const showPlayOverlay = hasEmbed && !embedInteractive;

  return (
    <div className={styles.root}>
      {logoUrl ? (
        <Link href="/" className={styles.logoLink} aria-label="Valentine home">
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
        aria-label={`Close and return to ${directorName || 'director profile'}`}
      >
        CLOSE
      </Link>

      {hasEmbed ? (
        <div className={styles.playerStack}>
          {showIframe ? (
            <iframe
              key={embedRemountKey}
              title={
                projectName ? `${directorName || 'Director'} — ${projectName}` : 'Project video'
              }
              src={normalizedSrc}
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
              <span className={styles.directorTitle}>{directorDisplay.toUpperCase()}</span>
              {' '}
              <span className={styles.projectTitle}>{projectDisplay.toUpperCase()}</span>
            </div>
          </div>

          {iframeLoading ? (
            <div className={styles.loadingBadge} aria-live="polite">
              Loading…
            </div>
          ) : null}

          {showPlayOverlay ? (
            <button
              type="button"
              className={styles.hitLayer}
              aria-label={playback === 'paused' ? 'Load and play video' : 'Loading video'}
              onClick={playback === 'paused' ? handlePlayEmbed : undefined}
            />
          ) : null}
        </div>
      ) : (
        <div className={styles.missing}>
          No Simian embed URL is set for this project. Add it in Sanity under Profile Projects.
        </div>
      )}
    </div>
  );
}
