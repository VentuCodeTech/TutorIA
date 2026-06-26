'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import Sidebar from '@/components/Sidebar'
import Chatbot from '@/components/Chatbot'
import { createClient } from '@/lib/supabase/client'

const subMenuItems = [
  { icon: '📋', label: 'Visão Geral', href: '/dashboard/estudos' },
  { icon: '🗺ï¸', label: 'Plano de Estudos', href: '/dashboard/estudos/plano' },
]

export default function EstudosPage() {
  const router = useRouter()
  const pathname = usePathname()
  const [stats, setStats] = useState({ answered: 0, correct: 0, subjects: {} as Record<string, {answered: number, correct: number}> })
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { globalThis.location.href = '/login'; return }
      loadStats(session.user.id)
    })
  }, [])

  const loadStats = async (uid: string) => {
    const { data } = await supabase
      .from('question_answers')
      .select('is_correct, subject')
      .eq('user_id', uid)
    if (data) {
      const subjectMap: Record<string, {answered: number, correct: number}> = {}
      data.forEach(d => {
        const s = d.subject || 'Geral'
        if (!subjectMap[s]) subjectMap[s] = { answered: 0, correct: 0 }
        subjectMap[s].answered++
        if (d.is_correct) subjectMap[s].correct++
      })
      setStats({ answered: data.length, correct: data.filter(d => d.is_correct).length, subjects: subjectMap })
    }
    setLoading(false)
  }

  const studyTopics = [
    { subject: 'Matemática', emoji: '🧮' },
    { subject: 'Português', emoji: '📖' },
    { subject: 'História', emoji: '🌍' },
    { subject: 'Física', emoji: 'âï¸' },
    { subject: 'Química', emoji: '🧪' },
    { subject: 'Biologia', emoji: '🧬' },
    { subject: 'Direito Constitucional', emoji: 'âï¸' },
    { subject: 'Finanças Pessoais', emoji: '💰' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50">
      <Sidebar />
      <main className="ml-64 p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">📚 Meus Estudos</h1>
          <p className="text-gray-500 mt-1">Gerencie seu plano de estudos personalizado</p>
        </div>

        {/* Sub Menu */}
        <div className="flex gap-2 mb-8 bg-white rounded-2xl p-2 shadow-sm border border-gray-100 w-fit">
          {subMenuItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'}`}>
                <span>{item.icon}</span>
                {item.label}
              </Link>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">📋 Progresso por Matéria</h2>
              {loading ? (
                <div className="text-center py-8 text-gray-500">Carregando...</div>
              ) : stats.answered === 0 ? ( // NOSONAR
                <div className="text-center py-8">
                  <div className="text-5xl mb-3">📝</div>
                  <p className="text-gray-500 mb-4">Você ainda não respondeu nenhuma questão.</p>
                  <button onClick={() => router.push('/dashboard/questoes')}
                    className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-indigo-700 transition-colors">
                    Começar a Estudar
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {Object.entries(stats.subjects).map(([subject, data]) => {
                    const pct = Math.round((data.correct / data.answered) * 100)
                    return (
                      <div key={subject} className="flex items-center gap-4 p-3 rounded-xl bg-gray-50">
                        <div className="flex-1">
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700">{subject}</span>
                            <span className="text-sm text-gray-500">{data.correct}/{data.answered} ({pct}%)</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${pct}%` }}></div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-4">🤖 Sessão de IA</h2>
              <p className="text-gray-500 text-sm mb-4">Use a inteligência artificial para estudar de forma personalizada e adaptativa.</p>
              <div className="grid grid-cols-2 gap-3">
                {studyTopics.map((topic) => (
                  <button key={topic.subject} onClick={() => router.push(`/dashboard/questoes?area=${encodeURIComponent(topic.subject)}`)}
                    className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all text-left">
                    <span className="text-2xl">{topic.emoji}</span>
                    <span className="text-sm font-medium text-gray-700">{topic.subject}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-800 mb-4">🎯 Meta Diária</h2>
              <p className="text-4xl font-bold text-indigo-600 mb-1">{stats.answered}</p>
              <p className="text-sm text-gray-500 mb-4">questões respondidas</p>
              <button onClick={() => router.push('/dashboard/questoes')}
                className="w-full bg-indigo-600 text-white py-2.5 rounded-xl font-medium hover:bg-indigo-700 transition-colors">
                Iniciar Estudo
              </button>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-800 mb-4">📈 Estatísticas</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total respondidas</span>
                  <span className="font-semibold">{stats.answered}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Acertos</span>
                  <span className="font-semibold text-green-600">{stats.correct}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Taxa de acerto</span>
                  <span className="font-semibold">{stats.answered > 0 ? Math.round((stats.correct / stats.answered) * 100) : 0}%</span>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-6 text-white">
              <h2 className="text-lg font-bold mb-2">🗺ï¸ Plano de Estudos</h2>
              <p className="text-indigo-100 text-sm mb-4">Faça um diagnóstico e receba um roteiro personalizado de estudos</p>
              <button onClick={() => router.push('/dashboard/estudos/plano')}
                className="w-full bg-white text-indigo-700 py-2.5 rounded-xl font-semibold hover:bg-indigo-50 transition-colors">
                Criar Meu Plano
              </button>
            </div>
          </div>
        </div>
      </main>
      <Chatbot />
    </div>
  )
}
