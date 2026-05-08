export const dynamic = 'force-dynamic'

'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

const PLANS = [
  {
    name: 'Standard',
    price: 19.90,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_STANDARD || '',
    planKey: 'standard',
    color: 'blue',
    features: [
      'Questoes ilimitadas',
      'Explicacoes por IA',
      'Simulados cronometrados',
      'Historico de desempenho',
      'ENEM, OAB, Concursos, CPA-20',
    ],
  },
  {
    name: 'Student',
    price: 49.90,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_STUDENT || '',
    planKey: 'student',
    color: 'indigo',
    popular: true,
    features: [
      'Tudo do Standard',
      'Planejamento de estudos com calendario',
      'Comunidade por nicho de prova',
      'Suporte prioritario',
      'Analise avancada de desempenho',
    ],
  },
  {
    name: 'Advanced Pro',
    price: 99.90,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ADVANCED || '',
    planKey: 'advanced',
    color: 'purple',
    features: [
      'Tudo do Student',
      'Assistente IA 24/7',
      'Explicacoes ilimitadas por IA',
      'Acesso antecipado a novidades',
      'Sessoes ao vivo com tutores',
    ],
  },
]

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null)

  async function handleSubscribe(plan: typeof PLANS[0]) {
    setLoading(plan.planKey)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        window.location.href = '/login?redirect=/pricing'
        return
      }

      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId: plan.priceId, planName: plan.planKey }),
      })

      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        alert('Erro ao criar sessao de pagamento. Tente novamente.')
      }
    } catch (error) {
      alert('Erro ao processar pagamento.')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Planos e Precos</h1>
          <p className="text-xl text-gray-600">Escolha o plano ideal para sua preparacao</p>
          <div className="mt-4 inline-block bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
            Modo Teste - Use cartao 4242 4242 4242 4242
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {PLANS.map((plan) => (
            <div
              key={plan.planKey}
              className={"bg-white rounded-2xl shadow-lg p-8 relative " + (plan.popular ? 'ring-2 ring-indigo-500 scale-105' : '')}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Mais Popular
                </div>
              )}

              <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
              <div className="flex items-baseline mb-6">
                <span className="text-4xl font-bold text-indigo-600">R$ {plan.price.toFixed(2).replace('.', ',')}</span>
                <span className="text-gray-500 ml-1">/mes</span>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-600">
                    <span className="text-green-500 font-bold">v</span>
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe(plan)}
                disabled={loading === plan.planKey}
                className={"w-full py-3 px-6 rounded-xl font-semibold transition " +
                  (plan.popular
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                    : 'border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50')}
              >
                {loading === plan.planKey ? 'Processando...' : 'Assinar ' + plan.name}
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
