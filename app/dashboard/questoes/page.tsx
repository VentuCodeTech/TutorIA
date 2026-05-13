'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Sidebar from '@/components/Sidebar';
import Chatbot from '@/components/Chatbot';

const AREAS = ['Matemática', 'Português', 'Raciocínio Lógico', 'Direito Constitucional', 'Informática', 'Atualidades'];
const DIFICULDADES = ['Fácil', 'Médio', 'Difícil'];

export default function QuestoesPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedDiff, setSelectedDiff] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { window.location.href = '/login'; return; }
      setUser(session.user);
      setLoading(false);
    });
  }, []);

  const generateQuestion = () => {
    setCurrentQuestion({
      text: 'Qual é a capital do Brasil?',
      options: ['São Paulo', 'Rio de Janeiro', 'Brasília', 'Salvador'],
      correct: 'Brasília',
      explanation: 'Brasília é a capital federal do Brasil, inaugurada em 1960 pelo presidente Juscelino Kubitschek.',
      area: selectedArea || 'Geografia',
      dificuldade: selectedDiff || 'Fácil',
    });
    setSelectedAnswer('');
    setShowResult(false);
  };

  const checkAnswer = () => {
    if (selectedAnswer) setShowResult(true);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div></div>;
  }

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
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-800 mb-3">🎯 Filtros</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Área</label>
                  <select value={selectedArea} onChange={(e) => setSelectedArea(e.target.value)} className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500">
                    <option value="">Todas</option>
                    {AREAS.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Dificuldade</label>
                  <select value={selectedDiff} onChange={(e) => setSelectedDiff(e.target.value)} className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500">
                    <option value="">Todas</option>
                    {DIFICULDADES.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <button onClick={generateQuestion} className="w-full bg-indigo-600 text-white py-2 rounded-xl font-medium hover:bg-indigo-700 transition-colors text-sm">
                  Gerar Questão
                </button>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-800 mb-3">📊 Estatísticas</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Respondidas</span><span className="font-medium">0</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Acertos</span><span className="font-medium text-green-600">0</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Taxa de acerto</span><span className="font-medium">0%</span></div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            {!currentQuestion ? (
              <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
                <p className="text-6xl mb-4">📝</p>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Pronto para praticar?</h3>
                <p className="text-gray-500 mb-6">Selecione os filtros e clique em "Gerar Questão" para começar.</p>
                <button onClick={generateQuestion} className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors">
                  🚀 Começar Agora
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-lg">{currentQuestion.area}</span>
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-lg">{currentQuestion.dificuldade}</span>
                </div>
                <p className="text-lg font-medium text-gray-800 mb-6">{currentQuestion.text}</p>
                <div className="space-y-3 mb-6">
                  {currentQuestion.options.map((opt: string, i: number) => (
                    <button key={i} onClick={() => !showResult && setSelectedAnswer(opt)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                        showResult
                          ? opt === currentQuestion.correct ? 'border-green-500 bg-green-50 text-green-800' : opt === selectedAnswer && opt !== currentQuestion.correct ? 'border-red-400 bg-red-50 text-red-800' : 'border-gray-200 text-gray-600'
                          : selectedAnswer === opt ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/50'
                      }`}
                    >
                      <span className="font-medium mr-2">{String.fromCharCode(65+i)}.</span>{opt}
                    </button>
                  ))}
                </div>
                {showResult && (
                  <div className={`p-4 rounded-xl mb-4 ${selectedAnswer === currentQuestion.correct ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                    <p className="font-bold mb-1">{selectedAnswer === currentQuestion.correct ? '✅ Correto!' : '❌ Incorreto!'}</p>
                    <p className="text-sm text-gray-600">{currentQuestion.explanation}</p>
                  </div>
                )}
                <div className="flex gap-3">
                  {!showResult && <button onClick={checkAnswer} disabled={!selectedAnswer} className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">Confirmar Resposta</button>}
                  {showResult && <button onClick={generateQuestion} className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors">Próxima Questão →</button>}
                </div>
              </div>
            )}
          </div>
        </div>
        <Chatbot />
      </main>
    </div>
  );
}
