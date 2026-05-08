import os

# Fix pricing page with hardcoded price IDs (since STRIPE_PRICE_ vars are not NEXT_PUBLIC_)
pricing_page = """'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const PRICE_IDS = {
  standard: 'price_1TUZ11FPyDxwG3POShBnmqB0',
  student: 'price_1TUZ1rFPyDxwG3POwi0qzpJb',
  advancedPro: 'price_1TUZ2GFPyDxwG3PORJBla5oC',
}

const plans = [
  {
    id: 'free',
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
    id: 'standard',
    name: 'Standard',
    price: 19.90,
    priceId: PRICE_IDS.standard,
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
    id: 'student',
    name: 'Student',
    price: 49.90,
    priceId: PRICE_IDS.student,
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
    id: 'advanced',
    name: 'Advanced Pro',
    price: 99.90,
    priceId: PRICE_IDS.advancedPro,
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

export default function PricingPage() {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubscribe = async (plan: typeof plans[0]) => {
    if (plan.free) {
      router.push('/login?next=/dashboard')
      return
    }

    setLoading(plan.id)
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
        <div className="text-center mb-12">
          <Link href="/" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium mb-4 inline-block">
            &larr; Voltar ao inicio
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Planos e Precos</h1>
          <p className="text-xl text-gray-600">Escolha o plano ideal para sua preparacao</p>
          <div className="mt-4 inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
            Modo Teste - Use cartao 4242 4242 4242 4242
          </div>
        </div>

        {error && (
          <div className="max-w-md mx-auto mb-8 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-center">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
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
                      <span className="text-3xl font-bold text-indigo-600">
                        {plan.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                      <span className="text-gray-500 text-sm">/mes</span>
                    </>
                  )}
                </div>
              </div>

              <ul className="space-y-3 flex-1 mb-6">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-green-500 font-bold mt-0.5 flex-shrink-0">&#10003;</span>
                    <span className="text-gray-700 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe(plan)}
                disabled={loading === plan.id}
                className={`w-full py-3 px-4 rounded-xl font-semibold transition-all ${
                  plan.popular
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    : plan.free
                    ? 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300'
                    : 'border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {loading === plan.id ? (
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

# Fix layout.tsx to add Chatbot
layout_tsx = """import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Chatbot from '@/components/Chatbot'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TutorIA - Plataforma de Estudos com IA',
  description: 'Prepare-se para ENEM, OAB, Concursos Publicos e CPA-20 com inteligencia artificial adaptativa',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        {children}
        <Chatbot />
      </body>
    </html>
  )
}
"""

with open('app/pricing/page.tsx', 'w') as f:
    f.write(pricing_page.strip())
print("Written: app/pricing/page.tsx")

with open('app/layout.tsx', 'w') as f:
    f.write(layout_tsx.strip())
print("Written: app/layout.tsx")

print("Done!")
