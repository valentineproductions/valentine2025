export function resolveImageUrl(img) {
  return img?.url || img?.asset?.url || null;
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
