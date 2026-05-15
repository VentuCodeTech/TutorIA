'use client'
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import Sidebar from '@/components/Sidebar';
import Chatbot from '@/components/Chatbot';

interface Question {
    id: string;
    text: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
    subject: string;
    difficulty: string;
}

interface SimuladoConfig {
    title: string;
    questions: number;
    timeMinutes: number;
    difficulty: string;
    area: string;
    color: string;
    tag: string;
}

export default function SimuladosPage() {
    const router = useRouter()
    const [userId, setUserId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeSimulado, setActiveSimulado] = useState<SimuladoConfig | null>(null);
    const [simQuestions, setSimQuestions] = useState<Question[]>([]);
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [answers, setAnswers] = useState<{correct: boolean}[]>([]);
    const [timeLeft, setTimeLeft] = useState(0);
    const [simFinished, setSimFinished] = useState(false);
    const [generatingQuestions, setGeneratingQuestions] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const [stats, setStats] = useState({ done: 0, bestNote: 0, totalTime: 0, approved: 0 });
    const supabase = createClient();

  useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
                if (!session) { window.location.href = '/login'; return; }
                setUserId(session.user.id);
                loadStats(session.user.id);
                setLoading(false);
        });
        return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const loadStats = async (uid: string) => {
        const { data } = await supabase
          .from('simulado_results')
          .select('score, time_spent, total_questions')
          .eq('user_id', uid);
        if (data && data.length > 0) {
                const best = Math.max(...data.map(d => Math.round((d.score / d.total_questions) * 100)));
                const total = data.reduce((acc, d) => acc + (d.time_spent || 0), 0);
                const approved = data.filter(d => (d.score / d.total_questions) >= 0.6).length;
                setStats({ done: data.length, bestNote: best, totalTime: Math.round(total / 60), approved });
        }
  };

  const simuladosList: SimuladoConfig[] = [
    { title: 'ENEM 2024 - Simulado Completo', questions: 10, timeMinutes: 20, difficulty: 'Difícil', area: 'Todas', color: 'indigo', tag: 'ENEM 2024' },
    { title: 'Concurso Federal - Nível Médio', questions: 10, timeMinutes: 20, difficulty: 'Médio', area: 'Todas', color: 'green', tag: 'Concurso Federal' },
    { title: 'OAB - Primeira Fase', questions: 10, timeMinutes: 20, difficulty: 'Difícil', area: 'Direito Constitucional', color: 'purple', tag: 'OAB' },
    { title: 'CPA-20 - Módulo Renda Fixa', questions: 10, timeMinutes: 15, difficulty: 'Médio', area: 'CPA-20', color: 'orange', tag: 'CPA-20' },
    { title: 'Concurso Estadual - Analista', questions: 10, timeMinutes: 20, difficulty: 'Difícil', area: 'Todas', color: 'blue', tag: 'Concurso Estadual' },
    { title: 'Revisão Rápida - Raciocínio', questions: 5, timeMinutes: 10, difficulty: 'Fácil', area: 'Matemática', color: 'red', tag: 'Revisão Rápida' },
      ];

  const colorMap: Record<string, string> = {
        indigo: 'bg-indigo-50 border-indigo-200 text-indigo-700',
        green: 'bg-green-50 border-green-200 text-green-700',
        purple: 'bg-purple-50 border-purple-200 text-purple-700',
        orange: 'bg-orange-50 border-orange-200 text-orange-700',
        blue: 'bg-blue-50 border-blue-200 text-blue-700',
        red: 'bg-red-50 border-red-200 text-red-700',
  };

  const diffColors: Record<string, string> = {
        'Fácil': 'bg-green-100 text-green-700',
        'Médio': 'bg-yellow-100 text-yellow-700',
        'Difícil': 'bg-red-100 text-red-700',
  };

  const startSimulado = async (sim: SimuladoConfig) => {
        setGeneratingQuestions(true);
        setActiveSimulado(sim);
        setCurrentQIndex(0);
        setAnswers([]);
        setSelectedAnswer(null);
        setShowResult(false);
        setSimFinished(false);

        const questions: Question[] = [];
        const usedTexts = new Set<string>();

        for (let i = 0; i < sim.questions; i++) {
                try {
                          const res = await fetch('/api/generate-question', {
                                      method: 'POST',
                                      headers: { 'Content-Type': 'application/json' },
                                      body: JSON.stringify({ area: sim.area, difficulty: sim.difficulty, excludeTexts: Array.from(usedTexts) })
                          });
                          const data = await res.json();
                          if (data.question) {
                                      usedTexts.add(data.question.text);
                                      questions.push(data.question);
                          }
                } catch (e) {
                          console.error('Error fetching question', e);
                }
        }

        setSimQuestions(questions);
        setTimeLeft(sim.timeMinutes * 60);
        setGeneratingQuestions(false);

        timerRef.current = setInterval(() => {
                setTimeLeft(prev => {
                          if (prev <= 1) {
                                      if (timerRef.current) clearInterval(timerRef.current);
                                      finishSimulado(questions, []);
                                      return 0;
                          }
                          return prev - 1;
                });
        }, 1000);
  };

  const handleAnswer = () => {
        if (selectedAnswer === null) return;
        const q = simQuestions[currentQIndex];
        const correct = selectedAnswer === q.correctAnswer;
        const newAnswers = [...answers, { correct }];
        setAnswers(newAnswers);
        setShowResult(true);

        if (currentQIndex + 1 >= simQuestions.length) {
                if (timerRef.current) clearInterval(timerRef.current);
                setTimeout(() => finishSimulado(simQuestions, newAnswers), 1500);
        }
  };

  const nextQuestion = () => {
        setSelectedAnswer(null);
        setShowResult(false);
        setCurrentQIndex(prev => prev + 1);
  };

  const finishSimulado = async (questions: Question[], finalAnswers: {correct: boolean}[]) => {
        setSimFinished(true);
        if (userId && activeSimulado && finalAnswers.length > 0) {
                const score = finalAnswers.filter(a => a.correct).length;
                const timeSpent = (activeSimulado.timeMinutes * 60) - timeLeft;
                await supabase.from('simulado_results').insert({
                          user_id: userId,
                          simulado_name: activeSimulado.title,
                          score,
                          total_questions: questions.length,
                          time_spent: timeSpent,
                          difficulty: activeSimulado.difficulty,
                }).then(() => loadStats(userId));
        }
  };

  const formatTime = (secs: number) => {
        const m = Math.floor(secs / 60).toString().padStart(2, '0');
        const s = (secs % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
  };

  if (loading) {
        return <div className="min-h-screen flex items-center justify-center"><div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>div></div>div>;
  }
  
    if (generatingQuestions) {
          return (
                  <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50">
                          <Sidebar />
                          <main className="ml-64 p-8 flex items-center justify-center" style={{minHeight: '100vh'}}>
                                    <div className="text-center">
                                                <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>div>
                                                <h2 className="text-2xl font-bold text-gray-800 mb-2">Gerando Simulado...</h2>h2>
                                                <p className="text-gray-500">Preparando {activeSimulado?.questions} questões exclusivas para você</p>p>
                                    </div>div>
                          </main>main>
                  </div>div>
                );
    }
  
    if (activeSimulado && simFinished) {
          const score = answers.filter(a => a.correct).length;
          const pct = simQuestions.length > 0 ? Math.round((score / simQuestions.length) * 100) : 0;
          const approved = pct >= 60;
          return (
                  <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50">
                          <Sidebar />
                          <main className="ml-64 p-8">
                                    <div className="max-w-2xl mx-auto bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
                                                <div className="text-6xl mb-4">{approved ? '🏆' : '📚'}</div>div>
                                                <h2 className="text-3xl font-bold text-gray-800 mb-2">Simulado Concluído!</h2>h2>
                                                <p className="text-gray-500 mb-6">{activeSimulado.title}</p>p>
                                                <div className="grid grid-cols-3 gap-4 mb-8">
                                                              <div className="bg-indigo-50 rounded-xl p-4">
                                                                              <div className="text-3xl font-bold text-indigo-600">{pct}%</div>div>
                                                                              <div className="text-xs text-gray-500">Nota Final</div>div>
                                                              </div>div>
                                                              <div className="bg-green-50 rounded-xl p-4">
                                                                              <div className="text-3xl font-bold text-green-600">{score}/{simQuestions.length}</div>div>
                                                                              <div className="text-xs text-gray-500">Acertos</div>div>
                                                              </div>div>
                                                              <div className={`${approved ? 'bg-green-50' : 'bg-red-50'} rounded-xl p-4`}>
                                                                              <div className={`text-xl font-bold ${approved ? 'text-green-600' : 'text-red-500'}`}>
                                                                                {approved ? '✅ Aprovado' : '❌ Reprovado'}
                                                                              </div>div>
                                                                              <div className="text-xs text-gray-500">Resultado</div>div>
                                                              </div>div>
                                                </div>div>
                                                <div className="flex gap-4 justify-center">
                                                              <button
                                                                                onClick={() => { setActiveSimulado(null); setSimFinished(false); }}
                                                                                className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                                                                              >
                                                                              ← Voltar aos Simulados
                                                              </button>button>
                                                              <button
                                                                                onClick={() => startSimulado(activeSimulado)}
                                                                                className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors"
                                                                              >
                                                                              🔄 Refazer Simulado
                                                              </button>button>
                                                </div>div>
                                    </div>div>
                          </main>main>
                  </div>div>
                );
    }
  
    if (activeSimulado && simQuestions.length > 0) {
          const currentQ = simQuestions[currentQIndex];
          const progress = Math.round(((currentQIndex) / simQuestions.length) * 100);
          return (
                  <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50">
                          <Sidebar />
                          <main className="ml-64 p-8">
                                    <div className="max-w-3xl mx-auto">
                                                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4 flex items-center justify-between">
                                                              <div>
                                                                              <h2 className="font-bold text-gray-800">{activeSimulado.title}</h2>h2>
                                                                              <p className="text-sm text-gray-500">Questão {currentQIndex + 1} de {simQuestions.length}</p>p>
                                                              </div>div>
                                                              <div className="flex items-center gap-4">
                                                                              <div className={`text-xl font-bold font-mono ${timeLeft < 120 ? 'text-red-500' : 'text-gray-700'}`}>
                                                                                                ⏱ {formatTime(timeLeft)}
                                                                              </div>div>
                                                                              <button
                                                                                                  onClick={() => { if (timerRef.current) clearInterval(timerRef.current); finishSimulado(simQuestions, answers); }}
                                                                                                  className="text-sm text-red-500 hover:text-red-700 border border-red-200 px-3 py-1 rounded-lg"
                                                                                                >
                                                                                                Encerrar
                                                                              </button>button>
                                                              </div>div>
                                                </div>div>
                                    
                                                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                                                              <div className="bg-indigo-500 h-2 rounded-full transition-all" style={{width: `${progress}%`}}></div>div>
                                                </div>div>
                                    
                                                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                                              <div className="flex gap-2 mb-4">
                                                                              <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded-full">{currentQ.subject}</span>span>
                                                                              <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">{currentQ.difficulty}</span>span>
                                                              </div>div>
                                                              <p className="text-gray-800 font-medium mb-6 text-lg leading-relaxed">{currentQ.text}</p>p>
                                                              <div className="space-y-3 mb-6">
                                                                {currentQ.options.map((opt, idx) => {
                                      let cls = 'w-full text-left p-4 rounded-xl border-2 transition-all ';
                                      if (showResult) {
                                                            if (idx === currentQ.correctAnswer) cls += 'border-green-500 bg-green-50 text-green-700';
                                                            else if (idx === selectedAnswer) cls += 'border-red-500 bg-red-50 text-red-700';
                                                            else cls += 'border-gray-200 text-gray-400';
                                      } else {
                                                            cls += idx === selectedAnswer
                                                                                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                                                                                    : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 text-gray-700';
                                      }
                                      return (
                                                            <button key={idx} className={cls} onClick={() => !showResult && setSelectedAnswer(idx)}>
                                                                                  <span className="font-semibold mr-2">{String.fromCharCode(65 + idx)}.</span>span> {opt}
                                                            </button>button>
                                                          );
                  })}
                                                              </div>div>
                                                
                                                  {showResult && (
                                    <div className={`p-4 rounded-xl mb-4 ${answers[answers.length - 1]?.correct ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                                                      <p className="font-semibold mb-1">{answers[answers.length - 1]?.correct ? '✅ Correto!' : '❌ Incorreto'}</p>p>
                                                      <p className="text-sm text-gray-600">{currentQ.explanation}</p>p>
                                    </div>div>
                                                              )}
                                                
                                                  {!showResult ? (
                                    <button
                                                        onClick={handleAnswer}
                                                        disabled={selectedAnswer === null}
                                                        className="w-full bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                      >
                                                      Confirmar Resposta
                                    </button>button>
                                  ) : currentQIndex + 1 < simQuestions.length ? (
                                    <button
                                                        onClick={nextQuestion}
                                                        className="w-full bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors"
                                                      >
                                                      Próxima Questão →
                                    </button>button>
                                  ) : null}
                                                </div>div>
                                    </div>div>
                          </main>main>
                  </div>div>
                );
    }
  
    return (
          <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50">
                <Sidebar />
                <main className="ml-64 p-8">
                        <div className="mb-8 flex items-center justify-between">
                                  <div>
                                              <h1 className="text-3xl font-bold text-gray-800">🎯 Simulados</h1>h1>
                                              <p className="text-gray-500 mt-1">Simule provas completas cronometradas</p>p>
                                  </div>div>
                        </div>div>
                
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                          {[
            { label: 'Simulados Feitos', value: stats.done.toString(), icon: '📋' },
            { label: 'Melhor Nota', value: stats.done > 0 ? `${stats.bestNote}%` : '-', icon: '⭐' },
            { label: 'Tempo Total', value: stats.done > 0 ? `${stats.totalTime}min` : '0min', icon: '⏱️' },
            { label: 'Aprovações', value: stats.approved.toString(), icon: '✅' },
                      ].map((stat, i) => (
                                    <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
                                                  <span className="text-2xl">{stat.icon}</span>span>
                                                  <div>
                                                                  <p className="text-xl font-bold text-gray-800">{stat.value}</p>p>
                                                                  <p className="text-xs text-gray-500">{stat.label}</p>p>
                                                  </div>div>
                                    </div>div>
                                  ))}
                        </div>div>
                
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
                          {simuladosList.map((sim, i) => (
                        <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all">
                                      <div className={`inline-block px-2 py-1 rounded-lg text-xs font-medium border mb-3 ${colorMap[sim.color]}`}>
                                        {sim.tag}
                                      </div>div>
                                      <h3 className="font-bold text-gray-800 mb-3 leading-tight">{sim.title}</h3>h3>
                                      <div className="space-y-2 mb-4">
                                                      <div className="flex items-center gap-2 text-sm text-gray-500">
                                                                        <span>📝</span>span><span>{sim.questions} questões</span>span>
                                                      </div>div>
                                                      <div className="flex items-center gap-2 text-sm text-gray-500">
                                                                        <span>⏱️</span>span><span>{sim.timeMinutes} min</span>span>
                                                      </div>div>
                                                      <div className="flex items-center gap-2 text-sm">
                                                                        <span>🎯</span>span><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${diffColors[sim.difficulty]}`}>{sim.difficulty}</span>span>
                                                      </div>div>
                                      </div>div>
                                      <button
                                                        onClick={() => startSimulado(sim)}
                                                        className="w-full bg-indigo-600 text-white py-2 rounded-xl font-medium hover:bg-indigo-700 transition-colors text-sm"
                                                      >
                                                      Iniciar Simulado →
                                      </button>button>
                        </div>div>
                      ))}
                        </div>div>
                
                        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white">
                                  <h2 className="text-xl font-bold mb-2">🤖 Simulado Inteligente com IA</h2>h2>
                                  <p className="text-indigo-100 mb-4">Nossa IA cria um simulado personalizado com base no seu histórico de erros e no seu nível atual.</p>p>
                                  <button
                                                onClick={() => startSimulado({ title: 'Simulado Adaptativo IA', questions: 10, timeMinutes: 20, difficulty: 'Todas', area: 'Todas', color: 'indigo', tag: 'IA Adaptativo' })}
                                                className="bg-white text-indigo-600 px-5 py-2 rounded-xl font-semibold hover:bg-indigo-50 transition-colors"
                                              >
                                              Criar Simulado Adaptativo
                                  </button>button>
                        </div>div>
                        <Chatbot />
                </main>main>
          </div>div>
        );
}</div>
