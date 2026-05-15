import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
      const next = searchParams.get('next') ?? '/dashboard'

        if (code) {
            // Create a temporary response to capture cookies
                const tempResponse = new NextResponse()

                    const supabase = createServerClient(
                          process.env.NEXT_PUBLIC_SUPABASE_URL!,
                                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
                                      {
                                              cookies: {
                                                        getAll() {
                                                                    return request.cookies.getAll()
                                                                              },
                                                                                        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
                                                                                                    cookiesToSet.forEach(({ name, value, options }) => {
                                                                                                                  tempResponse.cookies.set(name, value, options as never)
                                                                                                                              })
                                                                                                                                        },
                                                                                                                                                },
                                                                                                                                                      }
                                                                                                                                                          )

                                                                                                                                                              const { error } = await supabase.auth.exchangeCodeForSession(code)

                                                                                                                                                                  if (!error) {
                                                                                                                                                                        const redirectResponse = NextResponse.redirect(`${origin}${next}`)
                                                                                                                                                                              // Copy all cookies from tempResponse to redirectResponse
                                                                                                                                                                                    tempResponse.cookies.getAll().forEach((cookie) => {
                                                                                                                                                                                            redirectResponse.cookies.set(cookie.name, cookie.value, {
                                                                                                                                                                                                      path: cookie.path,
                                                                                                                                                                                                                domain: cookie.domain,
                                                                                                                                                                                                                          expires: cookie.expires,
                                                                                                                                                                                                                                    httpOnly: cookie.httpOnly,
                                                                                                                                                                                                                                              secure: cookie.secure,
                                                                                                                                                                                                                                                        sameSite: cookie.sameSite as 'strict' | 'lax' | 'none' | undefined,
                                                                                                                                                                                                                                                                })
                                                                                                                                                                                                                                                                      })
                                                                                                                                                                                                                                                                            return redirectResponse
                                                                                                                                                                                                                                                                                }

                                                                                                                                                                                                                                                                                    console.error('Auth callback error:', error.message)
                                                                                                                                                                                                                                                                                      }

                                                                                                                                                                                                                                                                                        return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`)
                                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                                        