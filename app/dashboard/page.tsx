'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import Chatbot from '@/components/Chatbot'
import { createClient } from '@/lib/supabase/client'
import { useUserPlan } from '@/lib/useUserPlan'

const planColors: Record<string, { bg: string; text: string; border: string }> = {
  free: { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-300' },
  standard: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300' },
  student: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-300' },
  advanced_pro: { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-300' },
};

const planIcons: Record<string, string> = {
  free: '🆓',
  standard: '⭐',
  student: '🎓',
  advanced_pro: '💎',
};

export default function Dashboard() {
  const router = useRouter()
  const [userName, setUserName] = useState('Estudante')
  const [stats, setStats] = useState({
    streakDays: 0,
    questionsToday: 0,
    accuracy: 0,
    ranking: '-'
  })
  const [dailyProgress, setDailyProgress] = useState(0)
  const supabase = createClient()
  const { planId, planName, loading: planLoading } = useUserPlan()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        globalThis.location.href = '/login'
        return
      }
      const name = session.user.user_metadata?.full_name ?? session.user.email?.split('@')[0] ?? 'Estudante'
      setUserName(name)
      loadStats(session.user.id)
    })
  }, [])

  const loadStats = async (uid: string) => {
    const today = new Date().toISOString().split('T')[0]

    const { data: allAnswers } = await supabase
      .from('question_answers')
      .select('is_correct, created_at')
      .eq('user_id', uid)
      .order('created_at', { ascending: false })

    if (allAnswers && allAnswers.length > 0) {
      const todayAnswers = allAnswers.filter(a =>
        a.created_at?.startsWith(today)
      )
      const correct = allAnswers.filter(a => a.is_correct).length
      const accuracy = Math.round((correct / allAnswers.length) * 100)

      // Calculate streak days (consecutive days with at least 1 question answered)
      const seen: string[] = []
      const uniqueDays = allAnswers
        .filter(a => a.created_at)
        .map(a => a.created_at.split('T')[0])
        .filter(d => {
          if (seen.includes(d)) return false
          seen.push(d)
          return true
        })
        .sort((a, b) => a.localeCompare(b))
        .reverse()
      let streak = 0
      const nowDate = new Date()
      for (let i = 0; i < uniqueDays.length; i++) {
        const expectedDate = new Date(nowDate)
        expectedDate.setDate(nowDate.getDate() - i)
        const expectedStr = expectedDate.toISOString().split('T')[0]
        if (uniqueDays[i] === expectedStr) {
          streak++
        } else {
          break
        }
      }

      setStats(prev => ({
        ...prev,
        streakDays: streak,
        questionsToday: todayAnswers.length,
        accuracy
      }))
      setDailyProgress(Math.min((todayAnswers.length / 20) * 100, 100))
    }
  }

  const studyAreas = [
    { emoji: '🧮', subject: 'Matemática', path: '/dashboard/questoes?area=Matemática', color: 'blue' },
    { emoji: '📖', subject: 'Português', path: '/dashboard/questoes?area=Português', color: 'green' },
    { emoji: '🌍', subject: 'História', path: '/dashboard/questoes?area=História', color: 'orange' },
    { emoji: '🦌', subject: 'Ciências', path: '/dashboard/questoes?area=Ciências', color: 'teal' },
    { emoji: '⚛️', subject: 'Física', path: '/dashboard/questoes?area=Física', color: 'purple' },
    { emoji: '🧪', subject: 'Química', path: '/dashboard/questoes?area=Química', color: 'red' },
    { emoji: '🧬', subject: 'Biologia', path: '/dashboard/questoes?area=Biologia', color: 'emerald' },
    { emoji: '✍️', subject: 'Redação', path: '/dashboard/questoes?area=Redação', color: 'pink' },
    { emoji: '⚖️', subject: 'Direito Constitucional', path: '/dashboard/questoes?area=Direito Constitucional', color: 'indigo' },
    { emoji: '📜', subject: 'Direito Civil', path: '/dashboard/questoes?area=Direito Civil', color: 'indigo' },
    { emoji: '🔒', subject: 'Direito Penal', path: '/dashboard/questoes?area=Direito Penal', color: 'indigo' },
    { emoji: '👔', subject: 'Direito Trabalhista', path: '/dashboard/questoes?area=Direito Trabalhista', color: 'indigo' },
    { emoji: '💰', subject: 'Finanças Pessoais', path: '/dashboard/questoes?area=Finanças Pessoais', color: 'yellow' },
    { emoji: '📈', subject: 'Investimentos', path: '/dashboard/questoes?area=Investimentos', color: 'yellow' },
    { emoji: '🏦', subject: 'CPA ANBIMA', path: '/dashboard/questoes?area=CPA-20', color: 'yellow' },
    { emoji: '🗺️', subject: 'Geografia', path: '/dashboard/questoes?area=Geografia', color: 'cyan' },
    { emoji: '📚', subject: 'Inglês', path: '/dashboard/questoes?area=Inglês', color: 'blue' },
    { emoji: '🗣️', subject: 'Espanhol', path: '/dashboard/questoes?area=Espanhol', color: 'red' },
  ]

  const planColor = planColors[planId] ?? planColors.free;
  const planIcon = planIcons[planId] ?? '🆓';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50">
      <Sidebar />
      <main className="ml-64 p-8">
        <div className="mb-8 flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Olá, {userName}! 👋
            </h1>
            <p className="text-gray-500 mt-1">Vamos continuar seus estudos de hoje?</p>
          </div>
          {/* Plan Badge */}
          {!planLoading && (
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold border ${planColor.bg} ${planColor.text} ${planColor.border}`}>
                {planIcon} Plano {planName}
              </span>
              {planId === 'free' && (
                <a
                  href="/dashboard/planos"
                  className="text-xs text-indigo-600 hover:text-indigo-800 underline"
                >
                  Fazer upgrade →
                </a>
              )}
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: '📅', value: stats.streakDays, label: 'Dias Estudando', sub: 'dias consecutivos' },
            { icon: '✅', value: stats.questionsToday, label: 'Questões Hoje', sub: 'de 20 meta diária' },
            { icon: '🎯', value: stats.accuracy + '%', label: 'Taxa de Acerto', sub: 'geral' },
            { icon: '🏆', value: stats.ranking, label: 'Ranking', sub: 'posição geral' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-xl mb-3">
                {stat.icon}
              </div>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              <p className="text-sm font-medium text-gray-600 mt-0.5">{stat.label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{stat.sub}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Start Study Session */}
          <div className="lg:col-span-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white">
            <h2 className="text-lg font-bold mb-2">🚀 Começar Sessão de Estudos</h2>
            <p className="text-indigo-200 text-sm mb-4">Use a IA para criar um plano de estudo personalizado para você.</p>
            <button type="button"
              onClick={() => router.push('/dashboard/questoes')}
              className="bg-white text-indigo-600 px-6 py-2.5 rounded-xl font-semibold hover:bg-indigo-50 transition-colors text-sm"
            >
              Iniciar Agora
            </button>
          </div>

          {/* Daily Challenge */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-2">⚡ Desafio Diário</h2>
            <p className="text-gray-500 text-sm mb-4">Complete 20 questões hoje para manter sua sequência!</p>
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-gray-100 rounded-full h-2">
                <div
                  className="bg-indigo-600 h-2 rounded-full transition-all"
                  style={{ width: `${dailyProgress}%` }}
                ></div>
              </div>
              <span className="text-sm font-semibold text-gray-600">{stats.questionsToday}/20</span>
            </div>
          </div>
        </div>

        {/* Plan Features Summary */}
        {!planLoading && planId === 'free' && (
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-2xl p-6 mb-8">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <h3 className="font-bold text-indigo-900 mb-1">🔓 Desbloqueie mais recursos</h3>
                <p className="text-sm text-indigo-700 mb-2">
                  Você está no plano <strong>Gratuito</strong>. Faça upgrade para acessar o Assistente IA, simulados ilimitados, suporte via chat e muito mais!
                </p>
                <div className="flex gap-2 flex-wrap text-xs text-indigo-600">
                  <span className="bg-white rounded-lg px-2 py-1 border border-indigo-200">✨ Assistente IA</span>
                  <span className="bg-white rounded-lg px-2 py-1 border border-indigo-200">📊 Análise avançada</span>
                  <span className="bg-white rounded-lg px-2 py-1 border border-indigo-200">🎯 Simulados ilimitados</span>
                  <span className="bg-white rounded-lg px-2 py-1 border border-indigo-200">📅 Google Calendar</span>
                </div>
              </div>
              <a
                href="/dashboard/planos"
                className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-indigo-700 transition-colors text-sm whitespace-nowrap"
              >
                Ver Planos →
              </a>
            </div>
          </div>
        )}

        {/* Study Areas */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-5">📚 Áreas de Estudo</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {studyAreas.map((item) => (
              <button type="button"
                key={item.path}
                onClick={() => router.push(item.path)}
                className="flex flex-col items-center p-4 rounded-xl bg-gray-50 hover:bg-indigo-50 hover:border-indigo-200 border border-transparent transition-all group cursor-pointer"
              >
                <span className="text-2xl mb-2">{item.emoji}</span>
                <p className="text-xs font-medium text-gray-700 group-hover:text-indigo-700 text-center leading-tight">{item.subject}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 flex items-start gap-4">
          <div className="text-3xl">🎓</div>
          <div>
            <h3 className="font-semibold text-indigo-900 mb-1">Tirei10 está pronto para te ajudar!</h3>
            <p className="text-sm text-indigo-700">
              Clique no botão de chat no canto inferior direito para tirar qualquer dúvida com nossa IA.
              Disponível 24/7 para te ajudar com ENEM, OAB, Concursos e muito mais!
            </p>
          </div>
        </div>
      </main>
      <Chatbot />
    </div>
  )
}
