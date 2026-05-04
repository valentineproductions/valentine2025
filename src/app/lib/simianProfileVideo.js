import { normalizeSimianEmbedSrc } from '@/app/lib/simianEmbedUrl';

/** Single-segment filenames for /api/simian-mp4 — no path chars / SSRF. */
export function isAllowedSimianFilename(name) {
  const s = String(name || '').trim();
  if (!s || s.length > 512) return false;
  if (s.includes('..') || /[/\\?#]/.test(s)) return false;
  return /\.(mp4|webm)$/i.test(s);
}

/**
 * Same-origin URL so <video> works: Simian only serves /assets/videos/* with Referer from gosimian.com.
 */
export function simianFilenameToProxySrc(filename) {
  const name = String(filename || '').trim();
  if (!isAllowedSimianFilename(name)) return '';
  return `/api/simian-mp4?file=${encodeURIComponent(name)}`;
}

/**
 * Strip invisible chars; pull Simian URL out of pasted iframe HTML or loose text.
 * @param {string|null|undefined} raw
 * @returns {string}
 */
export function coerceSimianSourceInput(raw) {
  let s = String(raw ?? '')
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .trim();
  if (!s) return '';

  const iframeMatch = s.match(/\bsrc\s*=\s*["']([^"']+)["']/i);
  if (iframeMatch?.[1]?.includes('gosimian.com')) {
    s = iframeMatch[1].trim();
  }

  if (!/^https?:/i.test(s)) {
    const loose = s.match(/https?:\/\/[^\s<>"']*gosimian\.com[^\s<>"']*/i);
    if (loose) s = loose[0].trim();
  }

  return s.trim();
}

/**
 * Background clip for director profile: uploaded file, else Simian MP4 from proxy filename / full MP4 URL.
 * Legacy share embed URLs do not produce a value here (use uploaded profile clip for those).
 *
 * @param {{ profileClip?: { asset?: { url?: string } }; simianProxyFile?: string; simianEmbedUrl?: string } | null | undefined} project
 * @returns {string}
 */
export function getProfileProjectBackgroundUrl(project) {
  const clip = project?.profileClip?.asset?.url;
  if (clip) return clip;
  const raw = project?.simianProxyFile || project?.simianEmbedUrl;
  const playback = resolveProfileProjectPlayback(raw);
  return playback.kind === 'mp4' ? playback.src : '';
}

/**
 * Directors list background clip: Simian MP4 first, uploaded fallback second.
 *
 * @param {{ directorsPageClipSimian?: string; directorsPageClip?: { asset?: { url?: string } } } | null | undefined} member
 * @returns {string}
 */
export function getDirectorPageClipUrl(member) {
  const playback = resolveProfileProjectPlayback(member?.directorsPageClipSimian);
  if (playback.kind === 'mp4') return playback.src;
  return member?.directorsPageClip?.asset?.url || '';
}

/**
 * Profile project Simian source: proxy filename (new) or legacy share/embed URL.
 *
 * @param {string|null|undefined} raw
 * @returns {{ kind: 'none' } | { kind: 'mp4'; src: string } | { kind: 'iframe'; src: string }}
 */
export function resolveProfileProjectPlayback(raw) {
  const trimmed = coerceSimianSourceInput(raw);
  if (!trimmed) return { kind: 'none' };

  if (/^https?:\/\//i.test(trimmed)) {
    try {
      const u = new URL(trimmed);
      const host = u.hostname.toLowerCase();
      if (host.endsWith('gosimian.com') && u.pathname.includes('/assets/videos/')) {
        if (/\.(mp4|webm)(\?|#|$)/i.test(u.pathname + u.search)) {
          const last = u.pathname.split('/').filter(Boolean).pop() || '';
          const proxy = simianFilenameToProxySrc(last);
          if (proxy) return { kind: 'mp4', src: proxy };
        }
      }
      if (host.endsWith('gosimian.com')) {
        return { kind: 'iframe', src: normalizeSimianEmbedSrc(trimmed) };
      }
    } catch {
      return { kind: 'none' };
    }
    return { kind: 'none' };
  }

  let name = trimmed.replace(/^\.\/+/, '').replace(/^\/+/, '');
  if (name.includes('/')) name = name.split('/').pop() || '';
  name = name.trim();
  if (!name || name.includes('..')) return { kind: 'none' };

  const proxy = simianFilenameToProxySrc(name);
  if (!proxy) return { kind: 'none' };
  return { kind: 'mp4', src: proxy };
}
