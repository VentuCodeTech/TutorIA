import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const next = searchParams.get('next') ?? '/dashboard';
  const safeNext = next.startsWith('/') ? next : '/dashboard';

  // With implicit flow, Supabase sends tokens in the URL hash (#access_token=...)
  // Hash fragments are NEVER sent to the server - only accessible via client-side JS
  // We return HTML with JS that reads the hash and redirects to /auth/exchange
  const html = [
    '<!DOCTYPE html>',
    '<html>',
    '<head><meta charset="utf-8"><title>Autenticando...</title></head>',
    '<body>',
    '<script>',
    '  var params = new URLSearchParams(window.location.search);',
    "  params.set('next', '" + safeNext + "');",
    "  var targetUrl = '/auth/exchange?' + params.toString();",
    '  if (window.location.hash && window.location.hash.length > 1) {',
    '    targetUrl += window.location.hash;',
    '  }',
    '  window.location.replace(targetUrl);',
    '<\/script>',
    '<noscript><meta http-equiv="refresh" content="0;url=/auth/exchange?next=' + safeNext + '"></noscript>',
    '<style>body{display:flex;align-items:center;justify-content:center;min-height:100vh;background:#f0f4ff;font-family:sans-serif;color:#666}</style>',
    '<p>Autenticando...</p>',
    '</body>',
    '</html>',
  ].join('\n');

  return new NextResponse(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html',
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    },
  });
}
