import { NextResponse } from 'next/server';
import { isAllowedSimianFilename } from '@/app/lib/simianProfileVideo';

const SIMIAN_ORIGIN = 'https://valentine.gosimian.com';

/**
 * Simian /assets/videos/* only returns 200 when Referer is their own origin.
 * Browser <video> from valentine.global / localhost sends a different Referer, so we proxy server-side.
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  let file = searchParams.get('file');
  if (!file) {
    return NextResponse.json({ error: 'Missing file' }, { status: 400 });
  }
  try {
    file = decodeURIComponent(file);
  } catch {
    return NextResponse.json({ error: 'Invalid file' }, { status: 400 });
  }
  if (!isAllowedSimianFilename(file)) {
    return NextResponse.json({ error: 'Invalid file' }, { status: 400 });
  }

  const upstreamUrl = `${SIMIAN_ORIGIN}/assets/videos/${encodeURIComponent(file)}`;
  const range = request.headers.get('range');

  const upstreamHeaders = {
    Referer: `${SIMIAN_ORIGIN}/`,
    'User-Agent':
      'Mozilla/5.0 (compatible; ValentineSite/1.0; +https://valentine.global)',
  };
  if (range) upstreamHeaders.Range = range;

  let upstream;
  try {
    upstream = await fetch(upstreamUrl, {
      headers: upstreamHeaders,
      redirect: 'manual',
    });
  } catch {
    return NextResponse.json({ error: 'Fetch failed' }, { status: 502 });
  }

  if (upstream.status >= 300 && upstream.status < 400) {
    return NextResponse.json({ error: 'Upstream redirect' }, { status: 502 });
  }
  if (!upstream.ok || !upstream.body) {
    return NextResponse.json({ error: 'Upstream error' }, { status: upstream.status || 502 });
  }

  const ct = upstream.headers.get('content-type') || '';
  if (!/^video\//i.test(ct) && !/octet-stream/i.test(ct)) {
    return NextResponse.json({ error: 'Unexpected content type' }, { status: 502 });
  }

  const out = new Headers();
  out.set('Content-Type', ct);
  const cl = upstream.headers.get('content-length');
  if (cl) out.set('Content-Length', cl);
  const ar = upstream.headers.get('accept-ranges');
  if (ar) out.set('Accept-Ranges', ar);
  const cr = upstream.headers.get('content-range');
  if (cr) out.set('Content-Range', cr);

  return new Response(upstream.body, {
    status: upstream.status,
    headers: out,
  });
}
