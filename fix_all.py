import os

# ==============================================================
# FILE 1: app/api/stripe/checkout/route.ts - Fix checkout to allow unauthenticated users
# and handle free plan
# ==============================================================
checkout_route = '''import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-04-10',
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { priceId, planName } = body

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const origin = request.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'https://tutoria-eight.vercel.app'

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${origin}/dashboard?success=true&plan=${planName}`,
      cancel_url: `${origin}/pricing?canceled=true`,
      customer_email: user?.email,
      metadata: {
        user_id: user?.id || '',
        plan: planName,
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
'''

# ==============================================================
# FILE 2: app/api/auth/callback/route.ts - Fix Google OAuth callback
# ==============================================================
callback_route = '''import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'
  const error = searchParams.get('error')
  const error_description = searchParams.get('error_description')

  if (error) {
    console.error('Auth callback error:', error, error_description)
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error_description || error)}`)
  }

  if (code) {
    const supabase = createClient()
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
    if (!exchangeError) {
      return NextResponse.redirect(`${origin}${next}`)
    }
    console.error('Exchange error:', exchangeError)
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`)
}
'''

# ==============================================================
# FILE 3: app/pricing/page.tsx - Add Free plan, remove "Sessoes ao vivo com tutores", add chatbot
# ==============================================================
pricing_page = """'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const plans = [
  {
    name: 'Gratis',
    price: 0,
    priceId: null,
    description: 'Comece sua jornada de estudos gratuitamente',
    features: [
      'Questoes adaptativas com dificuldade progressiva',
      'Explicacoes geradas por IA no nivel do aluno',
      'Acesso basico ao app',
      'Limite de 10 questoes por dia',
    ],
    cta: 'Comecar Gratis',
    popular: false,
    free: true,
  },
  {
    name: 'Standard',
    price: 1990,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_STANDARD,
    description: 'Para estudantes que querem evoluir',
    features: [
      'Questoes ilimitadas',
      'Explicacoes por IA',
      'Simulados cronometrados',
      'Historico de desempenho',
      'ENEM, OAB, Concursos, CPA-20',
    ],
    cta: 'Assinar Standard',
    popular: false,
    free: false,
  },
  {
    name: 'Student',
    price: 4990,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_STUDENT,
    description: 'Para quem leva os estudos a serio',
    features: [
      'Tudo do Standard',
      'Planejamento de estudos com calendario',
      'Comunidade por nicho de prova',
      'Suporte prioritario',
      'Analise avancada de desempenho',
    ],
    cta: 'Assinar Student',
    popular: true,
    free: false,
  },
  {
    name: 'Advanced Pro',
    price: 9990,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ADVANCED_PRO,
    description: 'Experiencia completa de preparacao',
    features: [
      'Tudo do Student',
      'Assistente IA 24/7',
      'Explicacoes ilimitadas por IA',
      'Acesso antecipado a novidades',
    ],
    cta: 'Assinar Advanced Pro',
    popular: false,
    free: false,
  },
]

function formatPrice(price: number) {
  return (price / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })
}

export default function PricingPage() {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubscribe = async (plan: typeof plans[0]) => {
    if (plan.free) {
      router.push('/login?next=/dashboard')
      return
    }

    if (!plan.priceId) {
      setError('Plano nao disponivel no momento.')
      return
    }

    setLoading(plan.name)
    setError(null)

    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId: plan.priceId,
          planName: plan.name,
        }),
      })

      const data = await res.json()

      if (!res.ok || data.error) {
        throw new Error(data.error || 'Erro ao criar sessao de pagamento')
      }

      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error('URL de pagamento nao encontrada')
      }
    } catch (err: unknown) {
      console.error('Checkout error:', err)
      setError(err instanceof Error ? err.message : 'Erro ao processar pagamento. Tente novamente.')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Link href="/" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium mb-4 inline-block">
            ← Voltar ao inicio
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Planos e Precos</h1>
          <p className="text-xl text-gray-600">Escolha o plano ideal para sua preparacao</p>
          <div className="mt-4 inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
            Modo Teste - Use cartao 4242 4242 4242 4242
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="max-w-md mx-auto mb-8 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-center">
            {error}
          </div>
        )}

        {/* Plans grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative bg-white rounded-2xl shadow-lg p-6 flex flex-col ${
                plan.popular ? 'ring-2 ring-indigo-600 scale-105' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-indigo-600 text-white text-sm font-semibold px-4 py-1 rounded-full">
                    Mais Popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-1">{plan.name}</h2>
                <p className="text-gray-500 text-sm mb-4">{plan.description}</p>
                <div className="flex items-baseline gap-1">
                  {plan.free ? (
                    <span className="text-3xl font-bold text-indigo-600">Gratis</span>
                  ) : (
                    <>
                      <span className="text-sm text-gray-500">R$</span>
                      <span className="text-3xl font-bold text-indigo-600">{formatPrice(plan.price)}</span>
                      <span className="text-gray-500 text-sm">/mes</span>
                    </>
                  )}
                </div>
              </div>

              <ul className="space-y-3 flex-1 mb-6">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-green-500 font-bold mt-0.5 flex-shrink-0">v</span>
                    <span className="text-gray-700 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe(plan)}
                disabled={loading === plan.name}
                className={`w-full py-3 px-4 rounded-xl font-semibold transition-all ${
                  plan.popular
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    : plan.free
                    ? 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300'
                    : 'border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {loading === plan.name ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Processando...
                  </span>
                ) : plan.cta}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>Pagamento seguro via Stripe. Cancele a qualquer momento.</p>
          <p className="mt-1">Nao cobramos taxa de cancelamento.</p>
        </div>
      </div>
    </div>
  )
}
"""

# ==============================================================
# FILE 4: app/login/page.tsx - Fix Google OAuth login
# ==============================================================
login_page = """'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get('next') || '/dashboard'
  const errorParam = searchParams.get('error')

  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(errorParam || null)
  const [message, setMessage] = useState<string | null>(null)

  const supabase = createClient()

  const handleGoogleLogin = async () => {
    setLoading(true)
    setError(null)

    const redirectTo = `${window.location.origin}/api/auth/callback?next=${encodeURIComponent(next)}`

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    }
  }

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/api/auth/callback?next=${encodeURIComponent(next)}`,
          },
        })
        if (error) throw error
        setMessage('Verifique seu email para confirmar o cadastro.')
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        router.push(next)
        router.refresh()
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao autenticar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold text-indigo-600">TutorIA</Link>
          <p className="text-gray-600 mt-2">
            {isSignUp ? 'Crie sua conta' : 'Bem-vindo de volta'}
          </p>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {message && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
            {message}
          </div>
        )}

        {/* Google Login */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-xl py-3 px-4 text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-6"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          {loading ? 'Redirecionando...' : 'Entrar com Google'}
        </button>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">ou</span>
          </div>
        </div>

        {/* Email/Password Form */}
        <form onSubmit={handleEmailAuth} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="seu@email.com"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Aguarde...' : isSignUp ? 'Criar conta' : 'Entrar'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          {isSignUp ? 'Ja tem uma conta?' : 'Nao tem uma conta?'}{' '}
          <button
            onClick={() => { setIsSignUp(!isSignUp); setError(null); setMessage(null) }}
            className="text-indigo-600 font-medium hover:underline"
          >
            {isSignUp ? 'Entrar' : 'Criar conta gratis'}
          </button>
        </p>
      </div>
    </div>
  )
}
"""

# ==============================================================
# FILE 5: components/Chatbot.tsx - Customer support chatbot
# ==============================================================
chatbot_component = """'use client'

import { useState, useRef, useEffect } from 'react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const FAQ_RESPONSES: Record<string, string> = {
  'plano': 'Temos 4 planos: Gratis (basico, 10 questoes/dia), Standard (R$19,90/mes - questoes ilimitadas), Student (R$49,90/mes - recursos avancados) e Advanced Pro (R$99,90/mes - experiencia completa com IA 24/7).',
  'preco': 'Nossos precos sao: Gratis (R$0), Standard (R$19,90/mes), Student (R$49,90/mes) e Advanced Pro (R$99,90/mes). Todos os planos pagos tem cancelamento gratuito a qualquer momento.',
  'cancelar': 'Voce pode cancelar sua assinatura a qualquer momento, sem taxa de cancelamento. Acesse as configuracoes da sua conta ou entre em contato conosco.',
  'pagamento': 'Aceitamos cartoes de credito e debito via Stripe. No modo teste, use o cartao 4242 4242 4242 4242 com qualquer data futura e CVV.',
  'google': 'Para fazer login com Google, clique no botao "Entrar com Google" na pagina de login. Voce sera redirecionado para autorizar o acesso.',
  'senha': 'Para redefinir sua senha, clique em "Esqueci minha senha" na pagina de login. Voce recebera um email com instrucoes.',
  'enem': 'Sim! Temos questoes e simulados especificos para ENEM, OAB, Concursos Publicos e CPA-20.',
  'ia': 'Nossa IA adapta as questoes ao seu nivel, gera explicacoes personalizadas e acompanha seu progresso de forma inteligente.',
  'suporte': 'Estou aqui para ajudar! Voce pode me perguntar sobre planos, pagamentos, funcionalidades ou qualquer duvida sobre o TutorIA.',
  'funcionalidade': 'O TutorIA oferece: questoes adaptativas por IA, explicacoes personalizadas, simulados cronometrados, historico de desempenho, planejamento de estudos e muito mais!',
}

function getBotResponse(message: string): string {
  const lowerMsg = message.toLowerCase()
  
  for (const [key, response] of Object.entries(FAQ_RESPONSES)) {
    if (lowerMsg.includes(key)) {
      return response
    }
  }
  
  if (lowerMsg.includes('ola') || lowerMsg.includes('oi') || lowerMsg.includes('bom dia') || lowerMsg.includes('boa tarde')) {
    return 'Ola! Bem-vindo ao TutorIA! Como posso ajudar voce hoje? Posso responder perguntas sobre planos, pagamentos, funcionalidades e muito mais.'
  }
  
  if (lowerMsg.includes('obrigad') || lowerMsg.includes('valeu')) {
    return 'De nada! Fico feliz em ajudar. Se tiver mais alguma duvida, estou aqui!'
  }
  
  return 'Entendi sua mensagem! Para assuntos mais complexos, nossa equipe de suporte pode ajudar. Posso responder perguntas sobre: planos e precos, pagamento, cancelamento, funcionalidades do app, login com Google, preparacao para ENEM/OAB/Concursos. O que voce gostaria de saber?'
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Ola! Sou o assistente do TutorIA. Como posso ajudar voce hoje?'
    }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim()) return

    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setIsTyping(true)

    // Simulate response delay
    setTimeout(() => {
      const response = getBotResponse(userMessage)
      setMessages(prev => [...prev, { role: 'assistant', content: response }])
      setIsTyping(false)
    }, 800)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat window */}
      {isOpen && (
        <div className="mb-4 bg-white rounded-2xl shadow-2xl border border-gray-100 w-80 sm:w-96 flex flex-col overflow-hidden" style={{ height: '480px' }}>
          {/* Header */}
          <div className="bg-indigo-600 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-white font-semibold text-sm">Suporte TutorIA</p>
                <p className="text-indigo-200 text-xs">Online agora</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && (
                  <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center mr-2 flex-shrink-0 mt-1">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
                <div
                  className={`max-w-xs px-3 py-2 rounded-2xl text-sm ${
                    msg.role === 'user'
                      ? 'bg-indigo-600 text-white rounded-tr-sm'
                      : 'bg-white text-gray-800 shadow-sm rounded-tl-sm'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="bg-white px-3 py-2 rounded-2xl shadow-sm rounded-tl-sm">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick questions */}
          <div className="px-3 py-2 bg-white border-t border-gray-100 flex gap-2 overflow-x-auto">
            {['Planos', 'Pagamento', 'Cancelar', 'ENEM'].map((q) => (
              <button
                key={q}
                onClick={() => { setInput(q); }}
                className="flex-shrink-0 text-xs bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full hover:bg-indigo-100 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="p-3 bg-white border-t border-gray-100 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Digite sua mensagem..."
              className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim()}
              className="bg-indigo-600 text-white p-2 rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-indigo-600 hover:bg-indigo-700 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110"
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
          </svg>
        )}
      </button>
    </div>
  )
}
"""

# ==============================================================
# FILE 6: app/layout.tsx - Add Chatbot to layout
# ==============================================================
with open('app/layout.tsx', 'r') as f:
    layout_content = f.read()

print("=== Current layout.tsx ===")
print(layout_content)

# Write all files
files_to_write = {
    'app/api/stripe/checkout/route.ts': checkout_route,
    'app/api/auth/callback/route.ts': callback_route,
    'app/pricing/page.tsx': pricing_page,
    'app/login/page.tsx': login_page,
    'components/Chatbot.tsx': chatbot_component,
}

for path, content in files_to_write.items():
    os.makedirs(os.path.dirname(path), exist_ok=True) if os.path.dirname(path) else None
    with open(path, 'w') as f:
        f.write(content.strip())
    print(f"Written: {path}")

print("All files written successfully!")
