import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';

  // Sanitize the next URL to prevent open redirects
  const safeNext = next.startsWith('/') ? next : '/dashboard';

  if (code) {
    // Redirect to client-side exchange page to handle PKCE code verifier
    // The code_verifier is stored in browser cookies and is NOT available server-side
    // due to SameSite=Lax cookie restrictions on cross-site redirects (from supabase.co)
    const exchangeUrl = new URL('/auth/exchange', origin);
    exchangeUrl.searchParams.set('code', code);
    exchangeUrl.searchParams.set('next', safeNext);
    return NextResponse.redirect(exchangeUrl.toString());
  }

  // No code (e.g., Stripe return) - redirect to exchange page to check existing session
  const exchangeUrl = new URL('/auth/exchange', origin);
  exchangeUrl.searchParams.set('next', safeNext);
  return NextResponse.redirect(exchangeUrl.toString());
}
