'use client';

import { useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

function ExchangePage() {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();

    // Read params directly from window.location to avoid SSR/ISR caching issues
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const next = params.get('next') ?? '/dashboard';
    const safeNext = next.startsWith('/') ? next : '/dashboard';

    async function handleExchange() {
      if (code) {
        // Exchange the PKCE code for a session
        // createBrowserClient has access to the code_verifier stored in browser cookies
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          console.error('[auth/exchange] exchangeCodeForSession error:', error.message);
          router.replace('/login?error=auth_callback_failed');
          return;
        }
      }

      // Verify we have a valid session
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        // Check onboarding status
        const { data: profile } = await supabase
          .from('profiles')
          .select('onboarding_completed')
          .eq('id', session.user.id)
          .maybeSingle();

        if (!profile?.onboarding_completed) {
          router.replace('/onboarding');
          return;
        }

        router.replace(safeNext);
        return;
      }

      router.replace('/login?error=no_session');
    }

    handleExchange();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600 text-sm">Autenticando...</p>
      </div>
    </div>
  );
}

export default function AuthExchangePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <ExchangePage />
    </Suspense>
  );
}
