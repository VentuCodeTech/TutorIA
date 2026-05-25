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

                    const handleAuth = async () => {
                          if (code) {
                                  try {
                                            const { data, error } = await supabase.auth.exchangeCodeForSession(code)
                                                      if (data?.session) { router.replace(next); return }
                                                                if (error) console.error('Code exchange failed:', error.message)
                                                                        } catch (err) { console.error('Code exchange exception:', err) }
                                                                              }
                                                                                    for (let i = 0; i < 5; i++) {
                                                                                            await new Promise(r => setTimeout(r, 500 + i * 300))
                                                                                                    const { data: { session } } = await supabase.auth.getSession()
                                                                                                            if (session) { router.replace(next); return }
                                                                                                                  }
                                                                                                                        let unsub: (() => void) | null = null
                                                                                                                              const { data: { subscription } } = supabase.auth.onAuthStateChange((evt, sess) => {
                                                                                                                                      if (evt === 'SIGNED_IN' && sess) { unsub?.(); router.replace(next) }
                                                                                                                                            })
                                                                                                                                                  unsub = () => subscription.unsubscribe()
                                                                                                                                                        setTimeout(async () => {
                                                                                                                                                                const { data: { session: s } } = await supabase.auth.getSession()
                                                                                                                                                                        if (!s) { unsub?.(); router.replace('/login?error=auth_callback_failed') }
                                                                                                                                                                              }, 5000)
                                                                                                                                                                                  }
                                                                                                                                                                                      handleAuth()
                                                                                                                                                                                        }, [searchParams, router, supabase])

                                                                                                                                                                                          return (
                                                                                                                                                                                              <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#0f0f0f,#1a0a2e,#16213e,#0f0f0f)' }}>
                                                                                                                                                                                                    <div className="text-center">
                                                                                                                                                                                                            <div className="w-14 h-14 border-4 rounded-full animate-spin mx-auto mb-6" style={{ borderColor: 'rgba(168,85,247,0.8)', borderTopColor: 'transparent' }}></div>
                                                                                                                                                                                                                    <p className="font-semibold text-lg mb-1 text-slate-100">Autenticando...</p>
                                                                                                                                                                                                                            <p className="text-sm text-slate-400">Por favor aguarde</p>
                                                                                                                                                                                                                                  </div>
                                                                                                                                                                                                                                      </div>
                                                                                                                                                                                                                                        )
                                                                                                                                                                                                                                        }

                                                                                                                                                                                                                                        export default function AuthCallbackPage() {
                                                                                                                                                                                                                                          return (
                                                                                                                                                                                                                                              <Suspense fallback={
                                                                                                                                                                                                                                                    <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#0f0f0f,#1a0a2e,#16213e,#0f0f0f)' }}>
                                                                                                                                                                                                                                                            <div className="w-12 h-12 border-4 rounded-full animate-spin" style={{ borderColor: 'rgba(168,85,247,0.8)', borderTopColor: 'transparent' }}></div>
                                                                                                                                                                                                                                                                  </div>
                                                                                                                                                                                                                                                                      }>
                                                                                                                                                                                                                                                                            <AuthCallbackContent />
                                                                                                                                                                                                                                                                                </Suspense>
                                                                                                                                                                                                                                                                                  )
                                                                                                                                                                                                                                                                                  }