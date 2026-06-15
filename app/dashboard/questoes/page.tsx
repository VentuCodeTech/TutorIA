'use client'

import { useState, useEffect, Suspense } from 'react'
import Sidebar from '@/components/Sidebar'
import Chatbot from '@/components/Chatbot'
import { createClient } from '@/lib/supabase/client'

interface Question {
  id: string
  text: string
  options: string[]
  correctAnswer: number
  explanation: string
  subject: string
  difficulty: string
  source?: string
  vestibularSource?: string
}

import { useUserPlan } from '@/lib/useUserPlan'

const AREA_URL_MAP: Record<string, string> = {
  'Matemática': 'Matemática',
  'Português': 'Português',
  'História': 'História',
  'Física': 'Física',
  'Química': 'Química',
  'Biologia': 'Biologia',
  'Redação': 'Redação',
  'Ciências': 'Ciências',
  'Inglês': 'Inglês',
  'Espanhol': 'Espanhol',
  'Finanças Pessoais': 'Finanças Pessoais',
  'Investimentos': 'Investimentos',
  'Geografia': 'Geografia',
  'CPA-20': 'CPA-20',
  'Direito Constitucional': 'Direito Constitucional',
  'Direito Civil': 'Direito Civil',
  'Direito Penal': 'Direito Penal',
  'Direito Trabalhista': 'Direito Trabalhista',
  'Matemática Financeira': 'Matemática Financeira',
}

function QuestoesContent() {
  const [selectedArea, setSelectedArea] = useState('Todas')
  const [selectedDifficulty, setSelectedDifficulty] = useState('Todas')
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState({ answered: 0, correct: 0 })
  const [userId, setUserId] = useState<string | null>(null)
  const [shownTexts, setShownTexts] = useState<string[]>([])
  const supabase = createClient()
  const { features, planName, planId, loading: planLoading } = useUserPlan()
  const [todayAnsweredCount, setTodayAnsweredCount] = useState(0)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const area = params.get('area')
      if (area) {
        const decoded = decodeURIComponent(area)
        const normalized = AREA_URL_MAP[decoded] || decoded
        setSelectedArea(normalized)
      }
    }
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { window.location.href = '/login'; return }
      setUserId(session.user.id)
      loadStats(session.user.id)
    })
  }, [])

  const loadStats = async (uid: string) => {
    const today = new Date().toISOString().split('T')[0]
    const { data } = await supabase
      .from('question_answers')
      .select('is_correct, created_at')
      .eq('user_id', uid)
    if (data) {
      setStats({
        answered: data.length,
        correct: data.filter(d => d.is_correct).length
      })
      const todayCount = data.filter(d => d.created_at && d.created_at.startsWith(today)).length
      setTodayAnsweredCount(todayCount)
    }
  }

  const generateQuestion = async (area?: string, difficulty?: string, exclude?: string[]) => {
    setLoading(true)
    setSelectedAnswer(null)
    setShowResult(false)
    const useArea = area !== undefined ? area : selectedArea
    const useDiff = difficulty !== undefined ? difficulty : selectedDifficulty
    const useExclude = exclude !== undefined ? exclude : shownTexts
    try {
      const response = await fetch('/api/generate-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ area: useArea, difficulty: useDiff, excludeTexts: useExclude })
      })
      const data = await response.json()
      if (data.question) {
        setCurrentQuestion(data.question)
        setShownTexts(prev => [...prev, data.question.text])
      }
    } catch (error) {
      console.error('Error generating question:', error)
    }
    setLoading(false)
  }

  const handleAnswer = async () => {
    if (selectedAnswer === null || !currentQuestion) return
    const correct = selectedAnswer === currentQuestion.correctAnswer
    setIsCorrect(correct)
    setShowResult(true)

    if (userId) {
      await supabase.from('question_answers').insert({
        user_id: userId,
        question_id: null,
        question_text: currentQuestion.text,
        selected_option: selectedAnswer,
        is_correct: correct,
        subject: currentQuestion.subject,
        difficulty: currentQuestion.difficulty
      })
      loadStats(userId)
      setTodayAnsweredCount(prev => prev + 1)
    }
  }

  const handleNextQuestion = () => {
    generateQuestion(selectedArea, selectedDifficulty, shownTexts)
  }

  const areas = ['Todas', 'Matemática', 'Português', 'História', 'Ciências', 'Física', 'Química', 'Biologia', 'Redação', 'Direito Constitucional', 'Direito Civil', 'Direito Penal', 'Direito Trabalhista', 'Finanças Pessoais', 'Investimentos', 'Matemática Financeira', 'CPA-20', 'Geografia', 'Inglês', 'Espanhol']
  const difficulties = ['Todas', 'Fácil', 'Médio', 'Difícil']

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50">
      <Sidebar />
      <main className="ml-64 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Questões</h1>
          <p className="text-gray-500 mt-1">Questões de ENEM, FUVEST, UNESP, UNICAMP, VUNESP, OAB, CPA-20 e concursos militares (2005-2025)</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Filtros</h2>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">AREA</label>
                <select
                  value={selectedArea}
                  onChange={(e) => { setSelectedArea(e.target.value); setShownTexts([]); }}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
                >
                  {areas.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">DIFICULDADE</label>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => { setSelectedDifficulty(e.target.value); setShownTexts([]); }}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
                >
                  {difficulties.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <button
                onClick={() => generateQuestion(selectedArea, selectedDifficulty, shownTexts)}
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 transition-all"
              >
                {loading ? 'Gerando...' : 'Gerar Questão'}
              </button>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Estatísticas</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Respondidas</span>
                  <span className="text-sm font-bold text-gray-800">{stats.answered}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Acertos</span>
                  <span className="text-sm font-bold text-green-600">{stats.correct}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Taxa de acerto</span>
                  <span className="text-sm font-bold text-gray-800">
                    {stats.answered > 0 ? Math.round((stats.correct / stats.answered) * 100) : 0}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            {!currentQuestion && !loading ? (
              <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center min-h-96">
                <div className="text-6xl mb-4">📋</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Pronto para praticar?</h3>
                <p className="text-gray-500 mb-6">Selecione os filtros e clique em Gerar Questão para começar.</p>
                <button
                  onClick={() => generateQuestion()}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transition-all"
                >
                  Começar Agora
                </button>
              </div>
            ) : loading ? (
              <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 flex flex-col items-center justify-center min-h-96">
                <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-gray-500">Buscando questão do banco...</p>
              </div>
            ) : currentQuestion && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                {(currentQuestion.vestibularSource || currentQuestion.source) && (
                  <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl flex items-center gap-2">
                    <span className="text-blue-600 text-lg">🎓</span>
                    <div>
                      <p className="text-xs font-semibold text-blue-500 uppercase tracking-wide">Fonte Oficial</p>
                      <p className="text-sm font-bold text-blue-800">{currentQuestion.vestibularSource || currentQuestion.source}</p>
                    </div>
                  </div>
                )}
                <div className="flex gap-2 mb-4">
                  <span className="bg-indigo-100 text-indigo-700 text-xs font-medium px-3 py-1 rounded-full">{currentQuestion.subject}</span>
                  <span className="bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1 rounded-full">{currentQuestion.difficulty}</span>
                </div>
                <p className="text-gray-800 font-medium mb-6 text-lg leading-relaxed">{currentQuestion.text}</p>
                <div className="space-y-3 mb-6">
                  {currentQuestion.options.map((opt, idx) => {
                    let cls = 'w-full text-left p-4 rounded-xl border-2 transition-all cursor-pointer ';
                    if (showResult) {
                      if (idx === currentQuestion.correctAnswer) cls += 'border-green-500 bg-green-50 text-green-700';
                      else if (idx === selectedAnswer) cls += 'border-red-500 bg-red-50 text-red-700';
                      else cls += 'border-gray-200 text-gray-400 cursor-not-allowed';
                    } else {
                      cls += idx === selectedAnswer
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                        : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 text-gray-700';
                    }
                    return (
                      <button
                        key={idx}
                        className={cls}
                        onClick={() => !showResult && setSelectedAnswer(idx)}
                        disabled={showResult}
                      >
                        <span className="font-semibold mr-2">{String.fromCharCode(65 + idx)}.</span> {opt}
                      </button>
                    );
                  })}
                </div>

                {showResult && (
                  <div className={`p-4 rounded-xl mb-4 ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                    <p className="font-semibold mb-1">{isCorrect ? 'Correto!' : 'Incorreto'}</p>
                    <p className="text-sm text-gray-600">{currentQuestion.explanation}</p>
                  </div>
                )}

                {!showResult ? (
                  <button
                    onClick={handleAnswer}
                    disabled={selectedAnswer === null}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    Confirmar Resposta
                  </button>
                ) : (
                  <button
                    onClick={handleNextQuestion}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transition-all"
                  >
                    Próxima Questão
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
        <Chatbot />
      </main>
    </div>
  )
}

export default function QuestoesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div></div>}>
      <QuestoesContent />
    </Suspense>
  )
}
