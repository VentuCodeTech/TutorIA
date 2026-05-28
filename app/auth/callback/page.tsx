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
      let session = null;

      if (code) {
        try {
          const { data, error } = await supabase.auth.exchangeCodeForSession(code)
          if (data?.session) { session = data.session; }
          if (error) console.error('Code exchange failed:', error.message)
        } catch (err) { console.error('Code exchange exception:', err) }
      }

      if (!session) {
        for (let i = 0; i < 5; i++) {
          await new Promise(r => setTimeout(r, 500 + i * 300))
          const { data: { session: s } } = await supabase.auth.getSession()
          if (s) { session = s; break; }
        }
      }

      if (session) {
        // Check if user has completed onboarding
        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('onboarding_completed')
            .eq('id', session.user.id)
            .maybeSingle();

          if (!profile || !profile.onboarding_completed) {
            router.replace('/onboarding');
            return;
          }
        } catch (err) {
          console.error('Error checking onboarding status:', err);
        }
        router.replace(next);
        return;
      }

      let unsub: (() => void) | null = null
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (evt, sess) => {
        if (evt === 'SIGNED_IN' && sess) {
          unsub?.();
          try {
            const { data: profile } = await supabase
              .from('profiles')
              .select('onboarding_completed')
              .eq('id', sess.user.id)
              .maybeSingle();
            if (!profile || !profile.onboarding_completed) {
              router.replace('/onboarding');
              return;
            }
          } catch (err) {
            console.error('Error checking onboarding status:', err);
          }
          router.replace(next);
        }
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
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 50%, #ddd6fe 100%)' }}>
      <div className="text-center">
        <div className="w-14 h-14 border-4 rounded-full animate-spin mx-auto mb-6" style={{ borderColor: '#6d28d9', borderTopColor: 'transparent' }}></div>
        <p className="font-semibold text-lg mb-1" style={{ color: '#1e1b4b' }}>Autenticando...</p>
        <p className="text-sm" style={{ color: '#6b7280' }}>Por favor aguarde</p>
      </div>
    </div>
  )
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 50%, #ddd6fe 100%)' }}>
        <div className="w-12 h-12 border-4 rounded-full animate-spin" style={{ borderColor: '#6d28d9', borderTopColor: 'transparent' }}></div>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  )
}
