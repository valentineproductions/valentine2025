function parseSanityDimensions(url) {
  const match = typeof url === 'string'
    ? url.match(/-(\d+)x(\d+)\.[a-z0-9]+(?:\?|$)/i)
    : null;
  if (!match) return null;
  return {
    width: Number(match[1]),
    height: Number(match[2]),
  };
}

function resolveSanityCropRect(img, url) {
  const crop = img?.crop;
  if (!crop || url?.includes('rect=')) return null;
  const dims = parseSanityDimensions(url);
  if (!dims?.width || !dims?.height) return null;

  const left = Math.max(0, crop.left || 0);
  const right = Math.max(0, crop.right || 0);
  const top = Math.max(0, crop.top || 0);
  const bottom = Math.max(0, crop.bottom || 0);
  if (left + right + top + bottom <= 0) return null;

  const x = Math.round(dims.width * left);
  const y = Math.round(dims.height * top);
  const width = Math.max(1, Math.round(dims.width * (1 - left - right)));
  const height = Math.max(1, Math.round(dims.height * (1 - top - bottom)));

  return `${x},${y},${width},${height}`;
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

export function resolveImageUrl(img) {
  const url = img?.url || img?.asset?.url || null;
  if (!url) return null;

  const cropRect = resolveSanityCropRect(img, url);
  if (!cropRect) return url;

  const sep = url.includes('?') ? '&' : '?';
  return `${url}${sep}rect=${cropRect}`;
}

export function resolveImageObjectPosition(img) {
  const hotspot = img?.hotspot;
  if (
    typeof hotspot?.x !== 'number' ||
    typeof hotspot?.y !== 'number'
  ) {
    return undefined;
  }

  const crop = img?.crop;
  const left = Math.max(0, crop?.left || 0);
  const right = Math.max(0, crop?.right || 0);
  const top = Math.max(0, crop?.top || 0);
  const bottom = Math.max(0, crop?.bottom || 0);
  const cropWidth = Math.max(0.0001, 1 - left - right);
  const cropHeight = Math.max(0.0001, 1 - top - bottom);
  const x = clamp(((hotspot.x - left) / cropWidth) * 100, 0, 100);
  const y = clamp(((hotspot.y - top) / cropHeight) * 100, 0, 100);

  return `${x}% ${y}%`;
}

/** Merge `images[]` and legacy single `image`. */
export function resolveStillsImages(item) {
  const fromArr = Array.isArray(item?.images)
    ? item.images.filter((im) => resolveImageUrl(im))
    : [];
  if (fromArr.length > 0) return fromArr;
  if (item?.image && resolveImageUrl(item.image)) return [item.image];
  return [];
}

export function resolveBackgroundLogoUrl(logo) {
  return logo?.url || logo?.asset?.url || null;
}

/**
 * next/image custom loader for Sanity CDN URLs. Bypasses the local /_next/image
 * proxy (which times out re-encoding 50MP+ masters) by letting Sanity's CDN
 * resize/transcode at the edge: `?w=...&q=...&auto=format&fit=max`.
 */
export function sanityImageLoader({ src, width, quality }) {
  if (!src) return src;
  const isSanity = /(^|\/\/)cdn\.sanity\.io\//.test(src);
  if (!isSanity) return src;
  const sep = src.includes('?') ? '&' : '?';
  const q = typeof quality === 'number' ? quality : 85;
  return `${src}${sep}w=${width}&q=${q}&auto=format&fit=max`;
}

/**
 * Effective parallax strength for one still image.
 * Prefers `parallaxAdjust` (added to block baseline). Falls back to legacy
 * per-image `parallaxStrength` as an absolute override, then block baseline.
 */
export function resolveImageParallaxStrength(im, blockBaseline) {
  const B =
    typeof blockBaseline === 'number' && !Number.isNaN(blockBaseline)
      ? blockBaseline
      : 0;
  if (
    typeof im?.parallaxAdjust === 'number' &&
    !Number.isNaN(im.parallaxAdjust)
  ) {
    return Math.min(120, Math.max(0, B + im.parallaxAdjust));
  }
  if (
    typeof im?.parallaxStrength === 'number' &&
    !Number.isNaN(im.parallaxStrength)
  ) {
    return Math.min(120, Math.max(0, im.parallaxStrength));
  }
  return B;
}
