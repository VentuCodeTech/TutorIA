'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
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
}

export default function QuestoesPage() {
  const searchParams = useSearchParams()
  const [selectedArea, setSelectedArea] = useState(searchParams.get('area') || 'Todas')
  const [selectedDifficulty, setSelectedDifficulty] = useState('Todas')
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState({ answered: 0, correct: 0 })
  const [userId, setUserId] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { window.location.href = '/login'; return }
      setUserId(session.user.id)
      loadStats(session.user.id)
    })
  }, [])

  const loadStats = async (uid: string) => {
    const { data } = await supabase
      .from('question_answers')
      .select('is_correct')
      .eq('user_id', uid)
    if (data) {
      setStats({
        answered: data.length,
        correct: data.filter(d => d.is_correct).length
      })
    }
  }

  const generateQuestion = async () => {
    setLoading(true)
    setSelectedAnswer(null)
    setShowResult(false)
    try {
      const response = await fetch('/api/generate-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ area: selectedArea, difficulty: selectedDifficulty })
      })
      const data = await response.json()
      if (data.question) {
        setCurrentQuestion(data.question)
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
    }
  }

  const areas = ['Todas', 'Matemática', 'Português', 'História', 'Ciências', 'Física', 'Química', 'Biologia', 'Redação', 'Direito', 'Finanças', 'Geografia', 'Inglês', 'Espanhol']
  const difficulties = ['Todas', 'Fácil', 'Médio', 'Difícil']

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50">
      <Sidebar />
      <main className="ml-64 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">📝 Questões</h1>
          <p className="text-gray-500 mt-1">Pratique com questões adaptativas geradas por IA</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">🎯 Filtros</h2>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">ÁREA</label>
                <select
                  value={selectedArea}
                  onChange={(e) => setSelectedArea(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
                >
                  {areas.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">DIFICULDADE</label>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
                >
                  {difficulties.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <button
                onClick={generateQuestion}
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-2 rounded-xl font-medium hover:bg-indigo-700 transition-colors text-sm disabled:opacity-50"
              >
                {loading ? 'Gerando...' : 'Gerar Questão'}
              </button>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">📊 Estatísticas</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Respondidas</span>
                  <span className="text-sm font-semibold">{stats.answered}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Acertos</span>
                  <span className="text-sm font-semibold text-green-600">{stats.correct}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Taxa de acerto</span>
                  <span className="text-sm font-semibold">
                    {stats.answered > 0 ? Math.round((stats.correct / stats.answered) * 100) : 0}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            {!currentQuestion && !loading && (
              <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
                <div className="text-6xl mb-4">📋</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Pronto para praticar?</h3>
                <p className="text-gray-500 mb-6">Selecione os filtros e clique em "Gerar Questão" para começar.</p>
                <button
                  onClick={generateQuestion}
                  className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors"
                >
                  🚀 Começar Agora
                </button>
              </div>
            )}

            {loading && (
              <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
                <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-500">Gerando questão com IA...</p>
              </div>
            )}

            {currentQuestion && !loading && (
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <div className="flex gap-2 mb-6">
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                    {currentQuestion.subject}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    currentQuestion.difficulty === 'Fácil' ? 'bg-green-100 text-green-700' :
                    currentQuestion.difficulty === 'Médio' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {currentQuestion.difficulty}
                  </span>
                </div>

                <h3 className="text-xl font-semibold text-gray-800 mb-6">{currentQuestion.text}</h3>

                <div className="space-y-3 mb-6">
                  {currentQuestion.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => !showResult && setSelectedAnswer(index)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                        showResult
                          ? index === currentQuestion.correctAnswer
                            ? 'border-green-500 bg-green-50 text-green-800'
                            : index === selectedAnswer && !isCorrect
                              ? 'border-red-500 bg-red-50 text-red-800'
                              : 'border-gray-200 text-gray-600'
                          : selectedAnswer === index
                            ? 'border-indigo-500 bg-indigo-50 text-indigo-800'
                            : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50'
                      }`}
                    >
                      <span className="font-medium">{String.fromCharCode(65 + index)}.  </span>
                      {option}
                    </button>
                  ))}
                </div>

                {showResult && (
                  <div className={`p-4 rounded-xl mb-4 ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                    <p className={`font-semibold mb-1 ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                      {isCorrect ? '✅ Correto!' : '❌ Incorreto!'}
                    </p>
                    <p className="text-sm text-gray-600">{currentQuestion.explanation}</p>
                  </div>
                )}

                {!showResult ? (
                  <button
                    onClick={handleAnswer}
                    disabled={selectedAnswer === null}
                    className="w-full bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Confirmar Resposta
                  </button>
                ) : (
                  <button
                    onClick={generateQuestion}
                    className="w-full bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors"
                  >
                    Próxima Questão →
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
      <Chatbot />
    </div>
  )
}
