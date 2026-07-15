'use client';

import { useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

function ExchangePage() {
const router = useRouter();

useEffect(() => {
const supabase = createClient();

// Read params directly from globalThis.location to avoid SSR/ISR caching issues
const params = new URLSearchParams(globalThis.location.search);
const code = params.get('code');
const next = params.get('next') ?? '/dashboard';
const safeNext = next.startsWith('/') ? next : '/dashboard';

async function handleAuth() {
// With implicit flow: the access_token is in the URL hash (#access_token=...)
// The @supabase/ssr createBrowserClient automatically detects the hash and
// processes it into a session when getSession() is called.
// With PKCE flow: we have a ?code= param that needs to be exchanged.
if (code) {
// PKCE flow fallback: exchange code for session
const { error } = await supabase.auth.exchangeCodeForSession(code);
if (error) {
console.error('[auth/exchange] exchangeCodeForSession error:', error.message);
// Don't bail out immediately: the SDK's automatic PKCE/hash detection
        // may have already completed this exchange in parallel. Fall through
        // to the session check below before treating this as a failure.
}
}

// For implicit flow (or after PKCE exchange), verify we have a valid session.
// With implicit flow, getSession() triggers the client to process the hash fragment.
// We retry a few times to give the client time to process the hash.
let session = null;
for (let i = 0; i < 3; i++) {
const { data } = await supabase.auth.getSession();
session = data.session;
if (session) break;
// Small delay to allow the implicit flow hash processing
await new Promise(resolve => setTimeout(resolve, 300));
}

if (!session) {
console.error('[auth/exchange] No session found after auth');
router.replace('/login?error=no_session');
return;
}

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
}

handleAuth();
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
