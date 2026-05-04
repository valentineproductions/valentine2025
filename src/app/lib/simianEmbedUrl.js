/**
 * Simian hosts: *.gosimian.com (e.g. valentine.gosimian.com).
 *
 * Share embeds often look like:
 *   /share/v/{id}/false/auto/auto/...
 * The first `false` after the id is typically the autoplay flag; `true` turns it on.
 *
 * Other embeds use query params; we add ?autoplay=1 when missing.
 */
export function normalizeSimianEmbedSrc(urlString) {
  const trimmed = String(urlString || '').trim();
  if (!trimmed) return '';

  let u;
  try {
    u = new URL(trimmed);
  } catch {
    return trimmed;
  }

  const host = u.hostname.toLowerCase();
  if (!host.endsWith('gosimian.com')) {
    return trimmed;
  }

  /* /share/v/{token}/false/... → .../true/... */
  if (/\/share\/v\/[^/]+\/false\//.test(u.pathname)) {
    u.pathname = u.pathname.replace(
      /(\/share\/v\/[^/]+\/)false\//,
      '$1true/'
    );
  }

  const hasAutoplayQuery =
    u.searchParams.has('autoplay') ||
    u.searchParams.has('Autoplay') ||
    /[?&]autoplay=/i.test(u.search);

  if (!hasAutoplayQuery) {
    u.searchParams.set('autoplay', '1');
  }

  return u.toString();
}
