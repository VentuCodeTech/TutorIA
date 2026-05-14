'use client';
import Sidebar from '@/components/Sidebar';

export default function PlanosPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">💎 Planos e Preços</h1>
            <p className="text-lg text-gray-600">Escolha o plano ideal para seus objetivos de estudo</p>
          </div>

          {/* Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">

            {/* Gratuito */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col">
              <h2 className="text-xl font-bold text-gray-900 mb-1">Gratuito</h2>
              <div className="flex items-end gap-1 mb-6">
                <span className="text-4xl font-bold text-gray-900">R$ 0</span>
                <span className="text-gray-500 mb-1">/mês</span>
              </div>
              <ul className="space-y-3 flex-1">
                {["20 questões por dia","Acesso às matérias básicas","Dashboard básico","Comunidade de estudantes"].map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="text-green-500">✅</span> {f}
                  </li>
                ))}
                {["Simulados ilimitados","Assistente IA ilimitado","Análise de desempenho avançada","Plano de estudos personalizado"].map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-400">
                    <span className="text-red-400">❌</span> {f}
                  </li>
                ))}
              </ul>
              <button className="mt-6 w-full py-3 rounded-xl border border-gray-300 text-gray-600 font-semibold hover:bg-gray-50 transition-colors">
                Plano Atual
              </button>
            </div>

            {/* Pro */}
            <div className="bg-white rounded-2xl border-2 border-indigo-500 p-6 flex flex-col relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-500 text-white text-xs font-bold px-4 py-1 rounded-full">
                Mais Popular
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Pro</h2>
              <div className="flex items-end gap-1 mb-6">
                <span className="text-4xl font-bold text-gray-900">R$ 29,90</span>
                <span className="text-gray-500 mb-1">/mês</span>
              </div>
              <ul className="space-y-3 flex-1">
                {["Questões ilimitadas","Todas as matérias","Simulados ilimitados","Assistente IA (100 msgs/dia)","Análise de desempenho completa","Plano de estudos personalizado","Anotações sincronizadas","Suporte prioritário"].map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="text-green-500">✅</span> {f}
                  </li>
                ))}
              </ul>
              <button className="mt-6 w-full py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors">
                Assinar Pro
              </button>
            </div>

            {/* Premium */}
            <div className="bg-white rounded-2xl border-2 border-purple-500 p-6 flex flex-col relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-500 text-white text-xs font-bold px-4 py-1 rounded-full">
                Mais Completo
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Premium</h2>
              <div className="flex items-end gap-1 mb-6">
                <span className="text-4xl font-bold text-gray-900">R$ 49,90</span>
                <span className="text-gray-500 mb-1">/mês</span>
              </div>
              <ul className="space-y-3 flex-1">
                {["Tudo do plano Pro","Assistente IA ilimitado","Mentoria em grupo semanal","Redação corrigida por IA","Acesso antecipado a novidades","Relatórios semanais por email","Integração com Google Calendar","Suporte 24/7 via chat"].map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="text-green-500">✅</span> {f}
                  </li>
                ))}
              </ul>
              <button className="mt-6 w-full py-3 rounded-xl bg-purple-600 text-white font-semibold hover:bg-purple-700 transition-colors">
                Assinar Premium
              </button>
            </div>

            {/* Advanced Pro */}
            <div className="bg-gradient-to-b from-yellow-50 to-orange-50 rounded-2xl border-2 border-yellow-400 p-6 flex flex-col relative shadow-lg">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap">
                🏆 Elite
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Advanced Pro</h2>
              <div className="flex items-end gap-1 mb-6">
                <span className="text-4xl font-bold text-gray-900">R$ 99,90</span>
                <span className="text-gray-500 mb-1">/mês</span>
              </div>
              <ul className="space-y-3 flex-1">
                {[
                  "Tudo do plano Premium",
                  "Assistente IA sem limites com GPT-4",
                  "Mentoria individual semanal",
                  "Redações corrigidas ilimitadas",
                  "Simulados personalizados por IA",
                  "Plano de estudos adaptativo",
                  "Acesso a professores especialistas",
                  "Relatórios detalhados de evolução",
                  "Prioridade máxima no suporte",
                  "Badge exclusivo de Elite"
                ].map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="text-yellow-500">⭐</span> {f}
                  </li>
                ))}
              </ul>
              <button className="mt-6 w-full py-3 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold hover:from-yellow-500 hover:to-orange-600 transition-all shadow-md">
                🚀 Assinar Advanced Pro
              </button>
            </div>

          </div>

          {/* FAQ / Comparison Banner */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-2">🎓 Garanta seu futuro hoje!</h3>
            <p className="text-indigo-100 mb-4">Mais de 10.000 estudantes já passaram no vestibular com o TutorIA. Comece agora e transforme seus estudos.</p>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <span>✅ Cancele quando quiser</span>
              <span>✅ Sem fidelidade</span>
              <span>✅ Garantia de 7 dias</span>
              <span>✅ Pagamento seguro</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
