import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const TOOL_SUBDOMAINS: Record<string, string> = {
  diagnostico: '/diagnostico',
  cronograma: '/cronograma',
  simulado: '/simulado',
}

function rewriteToolSubdomain(request: NextRequest): NextResponse | null {
  const host = request.headers.get('host') || ''
  const subdomain = host.split('.')[0]
  const basePath = TOOL_SUBDOMAINS[subdomain]

  if (!basePath) {
    return null
  }
  if (request.nextUrl.pathname.startsWith(basePath)) {
    return null
  }

  const url = request.nextUrl.clone()
  url.pathname = `${basePath}${request.nextUrl.pathname}`
  return NextResponse.rewrite(url)
}

export async function middleware(request: NextRequest) {
  // Free growth tools (diagnostico/cronograma/simulado.tirei10.com.br) are
  // public, auth-free micro sites that live inside the same Next.js app.
  // Requests coming from those subdomains are rewritten to /diagnostico,
  // /cronograma or /simulado before any Supabase session handling runs.
  const toolRewrite = rewriteToolSubdomain(request)
  if (toolRewrite) {
    return toolRewrite
  }

  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          cookiesToSet.forEach(({ name, value }: { name: string; value: string }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }: { name: string; value: string; options?: Record<string, unknown> }) =>
            supabaseResponse.cookies.set(name, value, options as never)
          )
        },
      },
    }
  )

  // Refresh session if needed - this updates the session cookie
  await supabase.auth.getSession()

  // IMPORTANT: Return the supabaseResponse to preserve cookies
  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT for the ones starting with:
     * - auth/callback (OAuth/Stripe callback - must not be intercepted by middleware)
     * - auth/exchange (client-side PKCE exchange page - must not be intercepted)
     * - api/auth/callback (legacy callback path)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!auth/callback|auth/exchange|api/auth/callback|_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)', // NOSONAR,
  ],
}
