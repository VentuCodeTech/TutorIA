'use client'

import { useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

function AuthCallbackContent() {
  const router = useRouter()
    const searchParams = useSearchParams()
      const supabase = createClient()

        useEffect(() => {
            const code = searchParams.get('code')
                const next = searchParams.get('next') ?? '/dashboard'

                    if (code) {
                          supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
                                  if (error) {
                                            console.error('Auth callback error:', error.message)
                                                      router.push('/login?error=auth_callback_failed')
                                                              } else {
                                                                        router.push(next)
                                                                                }
                                                                                      })
                                                                                          } else {
                                                                                                router.push('/login?error=auth_callback_failed')
                                                                                                    }
                                                                                                      }, [searchParams, router, supabase])

                                                                                                        return (
                                                                                                            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
                                                                                                                  <div className="text-center">
                                                                                                                          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                                                                                                                  <p className="text-gray-600 font-medium">Autenticando...</p>
                                                                                                                                          <p className="text-gray-400 text-sm mt-1">Por favor aguarde</p>
                                                                                                                                                </div>
                                                                                                                                                    </div>
                                                                                                                                                      )
                                                                                                                                                      }

                                                                                                                                                      export default function AuthCallbackPage() {
                                                                                                                                                        return (
                                                                                                                                                            <Suspense fallback={
                                                                                                                                                                  <div className="min-h-screen flex items-center justify-center">
                                                                                                                                                                          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                                                                                                                                                                                </div>
                                                                                                                                                                                    }>
                                                                                                                                                                                          <AuthCallbackContent />
                                                                                                                                                                                              </Suspense>
                                                                                                                                                                                                )
                                                                                                                                                                                                }
                                                                                                                                                                                                