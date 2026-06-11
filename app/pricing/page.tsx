'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const plans = [
  {
    name: 'Gratuito',
    price: 0,
    priceId: null,
    description: 'Comece sua jornada de estudos sem pagar nada',
    features: [
      '20 questões por dia',
      'Acesso às matérias básicas',
      'Dashboard básico',
      'Comunidade de estudantes',
    ],
    notIncluded: [
      
      'Assistente IA ilimitado',
      'Análise de desempenho avançada',
      'Plano de estudos personalizado',
    ],
    cta: 'Começar Grátis',
    popular: false,
    free: true,
    color: '#6b7280',
    bg: '#f9fafb',
    border: '#e5e7eb',
  },
  {
    name: 'Standard',
    price: 1990,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_STANDARD,
    description: 'Para estudantes que querem evoluir',
    features: [
      'Questões ilimitadas',
      'Todas as matérias',
      'Assistente IA (50 msgs/dia)',
      'Análise de desempenho completa',
      'Anotações sincronizadas',
    ],
    notIncluded: [
      'Plano de estudos personalizado',
    ],
    cta: 'Assinar Standard',
    popular: false,
    free: false,
    color: '#1d4ed8',
    bg: '#eff6ff',
    border: '#bfdbfe',
  },
  {
    name: 'Student',
    price: 4990,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_STUDENT,
    description: 'Para quem leva os estudos a sério',
    features: [
      'Tudo do plano Standard',
      'Simulados ilimitados',
      'Assistente IA ilimitado',
      'Redação corrigida por IA',
      'Acesso antecipado a novidades',
      'Relatórios semanais por e-mail',
      'Integração com Google Calendar',
      'Suporte via chat',
    ],
    notIncluded: [],
    cta: 'Assinar Student',
    popular: true,
    free: false,
    color: '#6d28d9',
    bg: '#f5f3ff',
    border: '#8b5cf6',
  },
  {
    name: 'Advanced Pro',
    price: 9990,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ADVANCED_PRO,
    description: 'Experiência completa de preparação',
    features: [
      'Tudo do plano Student',
      'Assistente IA sem limites',
      'Redações corrigidas ilimitadas',
      'Simulados personalizados por IA',
      'Plano de estudos adaptativo',
      'Relatórios detalhados de evolução',
      'Prioridade máxima no suporte',
      'Badge exclusivo de Elite',
    ],
    notIncluded: [],
    cta: '🚀 Assinar Advanced Pro',
    popular: false,
    free: false,
    color: '#d97706',
    bg: '#fffbeb',
    border: '#f59e0b',
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
      setError('Plano não disponível no momento.')
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
        throw new Error(data.error || 'Erro ao criar sessão de pagamento')
      }

      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error('URL de pagamento não encontrada')
      }
    } catch (err: unknown) {
      console.error('Checkout error:', err)
      setError(err instanceof Error ? err.message : 'Erro ao processar o pagamento. Tente novamente.')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(160deg, #ffffff 0%, #faf5ff 50%, #f3e8ff 100%)' }}>
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-white border-b" style={{ borderColor: '#e9d5ff', boxShadow: '0 1px 12px rgba(109,40,217,0.08)' }}>
        <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/tirei10-header-logo.png" alt="Tirei10" className="h-9 w-auto" />
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/login" className="font-medium transition-colors text-sm" style={{ color: '#6b7280' }}>Login</Link>
            <Link href="/login" className="text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 shadow-md" style={{ background: 'linear-gradient(135deg, #6d28d9, #9333ea)' }}>Começar Grátis</Link>
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Header */}
          <div className="text-center mb-14">
            <Link href="/" className="text-sm font-medium mb-4 inline-block hover:underline" style={{ color: '#6d28d9' }}>
              ← Voltar ao início
            </Link>
            <h1 className="text-4xl font-bold mb-4" style={{ color: '#1e1b4b' }}>Planos e Preços</h1>
            <p className="text-xl" style={{ color: '#6b7280' }}>Escolha o plano ideal para a sua preparação</p>
          </div>

          {/* Error message */}
          {error && (
            <div className="max-w-md mx-auto mb-8 px-4 py-3 rounded-lg text-center" style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626' }}>
              {error}
            </div>
          )}

          {/* Plans grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className="relative rounded-2xl shadow-lg p-6 flex flex-col"
                style={{
                  background: plan.bg,
                  border: plan.popular ? `2px solid ${plan.border}` : `1px solid ${plan.border}`,
                  transform: plan.popular ? 'scale(1.02)' : 'none',
                  boxShadow: plan.popular ? `0 8px 30px ${plan.color}30` : undefined,
                }}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="text-white text-sm font-semibold px-4 py-1 rounded-full" style={{ background: 'linear-gradient(135deg, #6d28d9, #9333ea)' }}>
                      ✨ Mais Popular
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <h2 className="text-xl font-bold mb-1" style={{ color: '#111827' }}>{plan.name}</h2>
                  <p className="text-sm mb-4" style={{ color: '#6b7280' }}>{plan.description}</p>
                  <div className="flex items-baseline gap-1">
                    {plan.free ? (
                      <span className="text-3xl font-bold" style={{ color: plan.color }}>Grátis</span>
                    ) : (
                      <>
                        <span className="text-sm" style={{ color: '#6b7280' }}>R$</span>
                        <span className="text-3xl font-bold" style={{ color: plan.color }}>{formatPrice(plan.price)}</span>
                        <span className="text-sm" style={{ color: '#6b7280' }}>/mês</span>
                      </>
                    )}
                  </div>
                </div>

                <ul className="space-y-2.5 flex-1 mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-green-500 font-bold mt-0.5 flex-shrink-0">✅</span>
                      <span className="text-sm" style={{ color: '#374151' }}>{feature}</span>
                    </li>
                  ))}
                  {plan.notIncluded.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="flex-shrink-0 mt-0.5" style={{ color: '#f87171' }}>❌</span>
                      <span className="text-sm" style={{ color: '#9ca3af' }}>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSubscribe(plan)}
                  disabled={loading === plan.name}
                  className="w-full py-3 px-4 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: plan.popular ? 'linear-gradient(135deg, #6d28d9, #9333ea)' : plan.free ? 'transparent' : plan.color,
                    color: plan.free ? plan.color : 'white',
                    border: plan.free ? `2px solid ${plan.color}` : 'none',
                  }}
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

          {/* Guarantee banner */}
          <div className="rounded-2xl p-8 text-white text-center" style={{ background: 'linear-gradient(135deg, #5b21b6, #7c3aed, #9333ea)' }}>
            <h3 className="text-2xl font-bold mb-2">🎓 Garanta seu futuro hoje!</h3>
            <p className="mb-4" style={{ color: '#ddd6fe' }}>Mais de 10.000 estudantes já aprovados com o Tirei10.</p>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <span>✅ Cancele quando quiser</span>
              <span>✅ Sem fidelidade</span>
              <span>✅ Garantia de 7 dias</span>
              <span>✅ Pagamento seguro via Stripe</span>
            </div>
          </div>

          <div className="mt-8 text-center text-sm" style={{ color: '#6b7280' }}>
            <p>Pagamento seguro via Stripe. Cancele a qualquer momento.</p>
            <p className="mt-1">Não cobramos taxa de cancelamento.</p>
          </div>
        </div>
      </main>

      <footer className="py-12 mt-8" style={{ background: '#0a0a0a', borderTop: '1px solid rgba(139,92,246,0.2)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <img src="/tirei10-logo-white.png" alt="Tirei10" className="h-8 w-auto mb-2" />
              <p className="text-sm" style={{ color: '#475569' }}>Plataforma de estudos com IA adaptativa</p>
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-sm" style={{ color: '#475569' }}>
              <Link href="/" className="hover:text-purple-400 transition-colors">Home</Link>
              <Link href="/politicas" className="hover:text-purple-400 transition-colors">Políticas</Link>
              <Link href="/suporte" className="hover:text-purple-400 transition-colors">Suporte</Link>
              <Link href="/pagamentos" className="hover:text-purple-400 transition-colors">Pagamentos</Link>
              <Link href="/pricing" className="hover:text-purple-400 transition-colors">Planos</Link>
            </div>
          </div>
          <div className="mt-8 pt-8 text-center text-sm" style={{ borderTop: '1px solid rgba(139,92,246,0.15)', color: '#334155' }}>
            <p>© 2026 Tirei10. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
    }
