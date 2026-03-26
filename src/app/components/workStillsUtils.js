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
