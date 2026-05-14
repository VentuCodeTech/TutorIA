'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import Chatbot from '@/components/Chatbot'
import { createClient } from '@/lib/supabase/client'

export default function ProgressoPage() {
  const router = useRouter()
  const [stats, setStats] = useState({
    totalAnswered: 0,
    totalCorrect: 0,
    weeklyData: [] as {date: string, count: number}[],
    subjects: {} as Record<string, {answered: number, correct: number}>,
    streakDays: 0
  })
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { window.location.href = '/login'; return }
      loadProgress(session.user.id)
    })
  }, [])

  const loadProgress = async (uid: string) => {
    const { data } = await supabase
      .from('question_answers')
      .select('is_correct, subject, created_at')
      .eq('user_id', uid)
      .order('created_at', { ascending: true })
    
    if (data && data.length > 0) {
      const subjectMap: Record<string, {answered: number, correct: number}> = {}
      const dateMap: Record<string, number> = {}
      
      data.forEach(d => {
        const s = d.subject || 'Geral'
        if (!subjectMap[s]) subjectMap[s] = { answered: 0, correct: 0 }
        subjectMap[s].answered++
        if (d.is_correct) subjectMap[s].correct++
        
        if (d.created_at) {
          const date = d.created_at.split('T')[0]
          dateMap[date] = (dateMap[date] || 0) + 1
        }
      })
      
      const last7days = []
      for (let i = 6; i >= 0; i--) {
        const d = new Date()
        d.setDate(d.getDate() - i)
        const dateStr = d.toISOString().split('T')[0]
        last7days.push({ date: dateStr, count: dateMap[dateStr] || 0 })
      }
      
      setStats({
        totalAnswered: data.length,
        totalCorrect: data.filter(d => d.is_correct).length,
        weeklyData: last7days,
        subjects: subjectMap,
        streakDays: Object.keys(dateMap).length
      })
    }
    setLoading(false)
  }

  const accuracy = stats.totalAnswered > 0 
    ? Math.round((stats.totalCorrect / stats.totalAnswered) * 100) 
    : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50">
      <Sidebar />
      <main className="ml-64 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">📊 Meu Progresso</h1>
          <p className="text-gray-500 mt-1">Acompanhe sua evolução de estudos</p>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-500">Carregando seu progresso...</div>
        ) : stats.totalAnswered === 0 ? (
          <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
            <div className="text-6xl mb-4">📈</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Nenhum dado ainda</h3>
            <p className="text-gray-500 mb-6">Responda questões para ver seu progresso real aqui.</p>
            <button
              onClick={() => router.push('/dashboard/questoes')}
              className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors"
            >
              Começar a Estudar
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { icon: '✅', value: stats.totalAnswered, label: 'Total de Questões' },
                { icon: '🎯', value: stats.totalCorrect, label: 'Acertos' },
                { icon: '📊', value: accuracy + '%', label: 'Taxa de Acerto' },
                { icon: '📅', value: stats.streakDays, label: 'Dias Ativos' },
              ].map((s, i) => (
                <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-center">
                  <div className="text-3xl mb-2">{s.icon}</div>
                  <p className="text-2xl font-bold text-gray-800">{s.value}</p>
                  <p className="text-sm text-gray-500">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold text-gray-800 mb-4">📆 Atividade nos últimos 7 dias</h2>
                <div className="flex items-end gap-2 h-24">
                  {stats.weeklyData.map((day, i) => {
                    const max = Math.max(...stats.weeklyData.map(d => d.count), 1)
                    const height = (day.count / max) * 100
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <span className="text-xs text-gray-500">{day.count}</span>
                        <div 
                          className="w-full rounded-t-md bg-indigo-500 transition-all"
                          style={{ height: `${height}%`, minHeight: day.count > 0 ? '8px' : '2px' }}
                        ></div>
                        <span className="text-xs text-gray-400">
                          {new Date(day.date).toLocaleDateString('pt-BR', {weekday: 'short'}).slice(0,3)}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold text-gray-800 mb-4">📚 Por Matéria</h2>
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {Object.entries(stats.subjects).map(([subject, data], i) => {
                    const pct = Math.round((data.correct / data.answered) * 100)
                    return (
                      <div key={i}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-gray-700">{subject}</span>
                          <span className="text-sm text-gray-500">{pct}%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${pct >= 70 ? 'bg-green-500' : pct >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                            style={{ width: `${pct}%` }}
                          ></div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
              <button
                onClick={() => router.push('/dashboard/questoes')}
                className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors"
              >
                Continuar Estudando →
              </button>
            </div>
          </>
        )}
      </main>
      <Chatbot />
    </div>
  )
}
