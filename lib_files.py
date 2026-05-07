import os

def w(path, content):
    d = os.path.dirname(path)
    if d:
        os.makedirs(d, exist_ok=True)
    with open(path, 'w') as f:
        f.write(content)
    print(f'Created: {path}')

# lib/supabase/server.ts
w('lib/supabase/server.ts', """import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
  const cookieStore = cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {}
        },
      },
    }
  )
}
""")

# lib/supabase/client.ts
w('lib/supabase/client.ts', """import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
""")

# lib/stripe.ts
w('lib/stripe.ts', """import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-04-10',
  typescript: true,
})

export const PLANS = {
  standard: {
    name: 'Standard',
    priceId: process.env.STRIPE_PRICE_STANDARD_MONTHLY!,
    price: 19.90,
    features: ['Questoes ilimitadas', 'Simulados', 'Historico de desempenho'],
  },
  student: {
    name: 'Student',
    priceId: process.env.STRIPE_PRICE_STUDENT_MONTHLY!,
    price: 49.90,
    features: ['Tudo do Standard', 'Planejamento de estudos', 'Comunidade', 'Suporte prioritario'],
  },
  advanced: {
    name: 'Advanced Pro',
    priceId: process.env.STRIPE_PRICE_ADVANCED_MONTHLY!,
    price: 99.90,
    features: ['Tudo do Student', 'Assistente IA 24/7', 'Explicacoes ilimitadas por IA', 'Acesso antecipado'],
  },
}
""")

# middleware.ts
w('middleware.ts', """import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const protectedPaths = ['/dashboard', '/questoes', '/simulados', '/plano', '/chat']
  const isProtected = protectedPaths.some(p => request.nextUrl.pathname.startsWith(p))

  if (!user && isProtected) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/stripe/webhook|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
""")

print('Lib files created!')

