export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('plan, status')
    .eq('user_id', user.id)
    .single()

  const plan = subscription?.plan || 'gratuito'
  const planNames: Record<string, string> = {
    gratuito: 'Gratuito',
    basico: 'Standard',
    intermediario: 'Student',
    premium: 'Advanced Pro',
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-indigo-600">TutorIA</div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">{user.email}</span>
          <span className={"px-3 py-1 rounded-full text-sm font-medium " +
            (plan === 'gratuito' ? 'bg-gray-100 text-gray-600' : 'bg-indigo-100 text-indigo-700')}>
            {planNames[plan]}
          </span>
          <form action="/api/auth/signout" method="post">
            <button className="text-gray-600 hover:text-red-600 text-sm">Sair</button>
          </form>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {plan === 'gratuito' && (
          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 mb-8 flex justify-between items-center">
            <p className="text-indigo-700">Voce esta no plano gratuito. Faca upgrade para acesso ilimitado!</p>
            <Link href="/pricing" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 text-sm font-medium">
              Ver Planos
            </Link>
          </div>
        )}

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Bem-vindo ao TutorIA!</h1>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {[
            { title: 'Questoes Hoje', value: '0', icon: '📝' },
            { title: 'Taxa de Acerto', value: '0%', icon: '🎯' },
            { title: 'Sequencia', value: '0 dias', icon: '🔥' },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-gray-600 text-sm">{stat.title}</div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Iniciar Sessao de Estudos</h2>
            <div className="space-y-3">
              {['ENEM', 'OAB', 'Concursos Publicos', 'CPA-20'].map((exam) => (
                <button key={exam} className="w-full text-left px-4 py-3 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition text-indigo-700 font-medium">
                  {exam}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Seu Plano</h2>
            <div className="text-center">
              <div className="text-4xl mb-2">{plan === 'gratuito' ? '🎓' : '⭐'}</div>
              <div className="text-xl font-bold text-gray-900">{planNames[plan]}</div>
              {plan === 'gratuito' ? (
                <div className="mt-4">
                  <p className="text-gray-600 text-sm mb-4">20 questoes por dia</p>
                  <Link href="/pricing" className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition">
                    Fazer Upgrade
                  </Link>
                </div>
              ) : (
                <p className="text-green-600 mt-2 text-sm">Acesso completo ativo</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
