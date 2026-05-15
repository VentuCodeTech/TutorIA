import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'
  const error = searchParams.get('error')
  const error_description = searchParams.get('error_description')

  // Handle OAuth errors from provider
  if (error) {
    console.error('OAuth error:', error, error_description)
    return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`)
  }

  if (code) {
    // Pass code to client-side handler which has access to PKCE code_verifier in localStorage
    const callbackUrl = new URL('/auth/callback', origin)
    callbackUrl.searchParams.set('code', code)
    if (next !== '/dashboard') {
      callbackUrl.searchParams.set('next', next)
    }
    return NextResponse.redirect(callbackUrl)
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`)
}
