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
        // PKCE flow: exchange code for session
        try {
          const { data, error } = await supabase.auth.exchangeCodeForSession(code)
          if (data?.session) {
            router.replace(next)
            return
          }
          if (error) {
            console.error('Code exchange failed:', error.message)
          }
        } catch (err) {
          console.error('Code exchange exception:', err)
        }
      }

      // Implicit flow: wait for Supabase to process hash fragment
      // The client library auto-processes #access_token on init
      // Give it a moment then check session
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        router.replace(next)
        return
      }

      // Last resort: listen for auth state change
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if (session) {
          subscription.unsubscribe()
          router.replace(next)
        }
      })

      // If still no session after 3 seconds, redirect to login
      setTimeout(async () => {
        const { data: { session: finalSession } } = await supabase.auth.getSession()
        if (!finalSession) {
          subscription.unsubscribe()
          router.replace('/login?error=auth_callback_failed')
        }
      }, 3000)
    }

    handleAuth()
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
