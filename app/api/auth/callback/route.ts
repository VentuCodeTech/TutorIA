import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
      const next = searchParams.get('next') ?? '/dashboard'
        const error = searchParams.get('error')
          const error_description = searchParams.get('error_description')

            // Handle OAuth errors
              if (error) {
                  console.error('OAuth error:', error, error_description)
                      return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`)
                        }

                          if (code) {
                              // Redirect to the auth-callback page where the client can handle PKCE
                                  const callbackUrl = new URL('/auth/callback', origin)
                                      callbackUrl.searchParams.set('code', code)
                                          if (next !== '/dashboard') {
                                                callbackUrl.searchParams.set('next', next)
                                                    }
                                                        return NextResponse.redirect(callbackUrl)
                                                          }

                                                            return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`)
                                                            }
                                                            