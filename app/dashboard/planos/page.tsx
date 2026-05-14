'use client';
import Sidebar from '@/components/Sidebar';

const plans = [
  {
    id: 'free',
    name: 'Gratuito',
    price: 'R$ 0',
    period: '/mês',
    color: 'border-gray-200',
    badge: '',
    features: [
      '✅ 20 questões por dia',
      '✅ Acesso às matérias básicas',
      '✅ Dashboard básico',
      '✅ Comunidade de estudantes',
      '❌ Simulados ilimitados',
      '❌ Assistente IA ilimitado',
      '❌ Análise de desempenho avançada',
      '❌ Plano de estudos personalizado',
    ],
    cta: 'Plano Atual',
    active: true,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 'R$ 29,90',
    period: '/mês',
    color: 'border-indigo-500',
    badge: 'Mais Popular',
    features: [
      '✅ Questões ilimitadas',
      '✅ Todas as matérias',
      '✅ Simulados ilimitados',
      '✅ Assistente IA (100 msgs/dia)',
      '✅ Análise de desempenho completa',
      '✅ Plano de estudos personalizado',
      '✅ Anotações sincronizadas',
      '✅ Suporte prioritário',
    ],
    cta: 'Assinar Pro',
    active: false,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 'R$ 49,90',
    period: '/mês',
    color: 'border-purple-500',
    badge: 'Mais Completo',
    features: [
      '✅ Tudo do plano Pro',
      '✅ Assistente IA ilimitado',
      '✅ Mentoria em grupo semanal',
      '✅ Redação corrigida por IA',
      '✅ Acesso antecipado a novidades',
      '✅ Relatórios semanais por email',
      '✅ Integração com Google Calendar',
      '✅ Suporte 24/7 via chat',
    ],
    cta: 'Assinar Premium',
    active: false,
  },
];

const faqs = [
  { q: 'Posso cancelar a qualquer momento?', a: 'Sim! Você pode cancelar sua assinatura a qualquer momento, sem multas ou taxas adicionais.' },
  { q: 'Como funciona o pagamento?', a: 'Aceitamos cartão de crédito, débito, PIX e boleto bancário. O valor é cobrado mensalmente ou anualmente (com 20% de desconto).' },
  { q: 'Posso testar o plano Pro antes de pagar?', a: 'Sim! Oferecemos 7 dias de teste gratuito no plano Pro. Você só é cobrado após o período de teste.' },
];

export default function PlanosPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-64 p-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">💎 Planos e Preços</h1>
            <p className="text-gray-600">Escolha o plano ideal para seus objetivos de estudo</p>
          </div>

          <div className="grid grid-cols-3 gap-6 mb-12">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`bg-white rounded-2xl border-2 ${plan.color} p-6 relative ${
                  plan.id === 'pro' ? 'shadow-lg scale-105' : 'shadow-sm'
                }`}
              >
                {plan.badge && (
                  <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-semibold text-white ${
                    plan.id === 'pro' ? 'bg-indigo-500' : 'bg-purple-500'
                  }`}>
                    {plan.badge}
                  </div>
                )}
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-500 text-sm">{plan.period}</span>
                  </div>
                </div>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="text-sm text-gray-700">{feature}</li>
                  ))}
                </ul>
                <button
                  className={`w-full py-3 rounded-xl font-semibold text-sm transition-colors ${
                    plan.active
                      ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                      : plan.id === 'pro'
                        ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                        : 'bg-purple-600 text-white hover:bg-purple-700'
                  }`}
                  disabled={plan.active}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">🎓 Economize com o plano anual</h2>
            <p className="text-indigo-100 mb-4">Assine anualmente e economize 20% em relação ao plano mensal!</p>
            <div className="flex justify-center gap-6">
              <div>
                <div className="text-2xl font-bold">Pro Anual</div>
                <div className="text-indigo-200 line-through text-sm">R$ 358,80/ano</div>
                <div className="text-3xl font-bold">R$ 287,00/ano</div>
              </div>
              <div className="w-px bg-white/30" />
              <div>
                <div className="text-2xl font-bold">Premium Anual</div>
                <div className="text-indigo-200 line-through text-sm">R$ 598,80/ano</div>
                <div className="text-3xl font-bold">R$ 479,00/ano</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6">❓ Perguntas Frequentes</h2>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div key={i} className="border-b border-gray-100 pb-4 last:border-0">
                  <h3 className="font-semibold text-gray-900 mb-1">{faq.q}</h3>
                  <p className="text-sm text-gray-600">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
