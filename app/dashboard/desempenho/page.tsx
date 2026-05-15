'use client';
import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Chatbot from '@/components/Chatbot';
import { createClient } from '@/lib/supabase/client';

const subjectColors: Record<string, string> = {
      'Matematica': 'bg-blue-500',
      'Matematica': 'bg-blue-500',
      'Portugues': 'bg-green-500',
      'Historia': 'bg-yellow-500',
      'Ciencias': 'bg-purple-500',
      'Fisica': 'bg-red-500',
      'Quimica': 'bg-orange-500',
      'Biologia': 'bg-teal-500',
      'Geografia': 'bg-indigo-500',
      'Redacao': 'bg-pink-500',
      'Direito Constitucional': 'bg-violet-500',
      'Direito Civil': 'bg-violet-400',
      'Direito Penal': 'bg-violet-600',
      'Direito Trabalhista': 'bg-violet-700',
      'Financas Pessoais': 'bg-amber-500',
      'Investimentos': 'bg-amber-600',
      'CPA-20': 'bg-amber-700',
      'Ingles': 'bg-sky-500',
      'Espanhol': 'bg-rose-500',
};

function getColor(subject: string): string {
      const normalized = subject
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
      for (const key of Object.keys(subjectColors)) {
              if (normalized.includes(key) || key.includes(normalized)) {
                        return subjectColors[key];
              }
      }
      return 'bg-gray-500';
}

export default function DesempenhoPage() {
      const [loading, setLoading] = useState(true);
      const [period, setPeriod] = useState('semana');
      const [stats, setStats] = useState({
              totalAnswered: 0,
              totalCorrect: 0,
              subjects: [] as {subject: string, correct: number, total: number, color: string}[],
              weeklyData: [] as {day: string, questions: number, correct: number}[],
      });
      const supabase = createClient();

  useEffect(() => {
          supabase.auth.getSession().then(({ data: { session } }) => {
                    if (!session) { window.location.href = '/login'; return; }
                    loadData(session.user.id);
          });
  }, []);

  const loadData = async (uid: string) => {
          const { data } = await supabase
            .from('question_answers')
            .select('is_correct, subject, created_at')
            .eq('user_id', uid)
            .order('created_at', { ascending: true });

          const last7days = [];
          for (let i = 6; i >= 0; i--) {
                    const d = new Date();
                    d.setDate(d.getDate() - i);
                    last7days.push({
                                day: d.toLocaleDateString('pt-BR', { weekday: 'short' }).slice(0, 3),
                                questions: 0,
                                correct: 0,
                                dateStr: d.toISOString().split('T')[0],
                    });
          }

          if (data && data.length > 0) {
                    const subjectMap: Record<string, {correct: number, total: number}> = {};
                    const dateMap: Record<string, {questions: number, correct: number}> = {};

            data.forEach(d => {
                        const s = d.subject || 'Geral';
                        if (!subjectMap[s]) subjectMap[s] = { correct: 0, total: 0 };
                        subjectMap[s].total++;
                        if (d.is_correct) subjectMap[s].correct++;

                                 if (d.created_at) {
                                               const date = d.created_at.split('T')[0];
                                               if (!dateMap[date]) dateMap[date] = { questions: 0, correct: 0 };
                                               dateMap[date].questions++;
                                               if (d.is_correct) dateMap[date].correct++;
                                 }
            });

            const subjects = Object.entries(subjectMap).map(([subject, val]) => ({
                        subject,
                        correct: val.correct,
                        total: val.total,
                        color: getColor(subject),
            })).sort((a, b) => b.total - a.total);

            const weeklyWithData = last7days.map(day => ({
                        ...day,
                        questions: dateMap[day.dateStr]?.questions || 0,
                        correct: dateMap[day.dateStr]?.correct || 0,
            }));

            setStats({
                        totalAnswered: data.length,
                        totalCorrect: data.filter(d => d.is_correct).length,
                        subjects,
                        weeklyData: weeklyWithData,
            });
          } else {
                    setStats(prev => ({ ...prev, weeklyData: last7days }));
          }
          setLoading(false);
  };

  const overallRate = stats.totalAnswered > 0
        ? Math.round((stats.totalCorrect / stats.totalAnswered) * 100)
          : 0;

  const bestSubject = stats.subjects.length > 0
        ? stats.subjects.filter(s => s.total > 0).reduce((best, s) =>
                    (s.correct / s.total) > (best.correct / best.total) ? s : best,
                                                                 stats.subjects[0])
          : null;

  const worstSubject = stats.subjects.length > 0
        ? stats.subjects.filter(s => s.total > 0).reduce((worst, s) =>
                    (s.correct / s.total) < (worst.correct / worst.total) ? s : worst,
                                                                 stats.subjects[0])
          : null;

  const maxQ = Math.max(...stats.weeklyData.map(d => d.questions), 1);

  if (loading) {
          return (
                    <div className="min-h-screen flex items-center justify-center bg-gray-50">
                            <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>div>
                    </div>div>
                  );
  }
    
      return (
              <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50">
                    <Sidebar />
                    <main className="ml-64 p-8">
                            <div className="mb-8">
                                      <h1 className="text-3xl font-bold text-gray-800">📈 Análise de Desempenho</h1>h1>
                                      <p className="text-gray-500 mt-1">Acompanhe sua evolução e identifique pontos de melhoria</p>p>
                            </div>div>
                    
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                                      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                                                  <div className="text-3xl font-bold text-indigo-600">{overallRate}%</div>div>
                                                  <div className="text-sm text-gray-600 mt-1">Taxa de Acerto Geral</div>div>
                                                  <div className="text-xs text-gray-400 mt-1">{stats.totalAnswered} questões respondidas</div>div>
                                      </div>div>
                                      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                                                  <div className="text-3xl font-bold text-green-600">{stats.totalCorrect}</div>div>
                                                  <div className="text-sm text-gray-600 mt-1">Questões Corretas</div>div>
                                                  <div className="text-xs text-gray-400 mt-1">de {stats.totalAnswered} tentadas</div>div>
                                      </div>div>
                                      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                                                  <div className="text-3xl font-bold text-yellow-500">🏆</div>div>
                                                  <div className="text-sm font-medium text-gray-900 mt-1">{bestSubject?.subject || 'Sem dados'}</div>div>
                                                  <div className="text-xs text-green-600 mt-1">
                                                      {bestSubject ? `Melhor matéria (${Math.round((bestSubject.correct / bestSubject.total) * 100)}%)` : 'Responda questões para ver'}
                                                  </div>div>
                                      </div>div>
                                      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                                                  <div className="text-3xl font-bold text-red-400">⚠️</div>div>
                                                  <div className="text-sm font-medium text-gray-900 mt-1">{worstSubject?.subject || 'Sem dados'}</div>div>
                                                  <div className="text-xs text-red-600 mt-1">
                                                      {worstSubject && worstSubject !== bestSubject ? `Precisa de atenção (${Math.round((worstSubject.correct / worstSubject.total) * 100)}%)` : 'Continue estudando!'}
                                                  </div>div>
                                      </div>div>
                            </div>div>
                    
                        {stats.totalAnswered === 0 ? (
                            <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
                                        <div className="text-6xl mb-4">📚</div>div>
                                        <h3 className="text-xl font-bold text-gray-800 mb-2">Nenhum dado ainda</h3>h3>
                                        <p className="text-gray-500 mb-6">Comece a responder questões para ver seu desempenho aqui!</p>p>
                                        <a href="/dashboard/questoes" className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors">
                                                      Ir para Questões →
                                        </a>a>
                            </div>div>
                          ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                                      <h3 className="font-semibold text-gray-900 mb-4">📊 Desempenho por Matéria</h3>h3>
                                                      <div className="space-y-3">
                                                          {stats.subjects.map(s => {
                                                  const pct = s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0;
                                                  return (
                                                                          <div key={s.subject}>
                                                                                                <div className="flex justify-between items-center mb-1">
                                                                                                                        <span className="text-sm text-gray-700">{s.subject}</span>span>
                                                                                                                        <div className="flex items-center gap-2">
                                                                                                                                                  <span className="text-xs text-gray-400">{s.correct}/{s.total}</span>span>
                                                                                                                                                  <span className="text-sm font-semibold text-gray-900">{pct}%</span>span>
                                                                                                                            </div>div>
                                                                                                    </div>div>
                                                                                                <div className="w-full bg-gray-100 rounded-full h-2">
                                                                                                                        <div className={`${s.color} h-2 rounded-full transition-all`} style={{width: `${pct}%`}}></div>div>
                                                                                                    </div>div>
                                                                          </div>div>
                                                                        );
                            })}
                                                      </div>div>
                                        </div>div>
                            
                                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                                      <div className="flex justify-between items-center mb-4">
                                                                      <h3 className="font-semibold text-gray-900">📅 Questões por Dia</h3>h3>
                                                                      <select
                                                                                            value={period}
                                                                                            onChange={e => setPeriod(e.target.value)}
                                                                                            className="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none"
                                                                                          >
                                                                                        <option value="semana">Esta semana</option>option>
                                                                                        <option value="mes">Este mês</option>option>
                                                                      </select>select>
                                                      </div>div>
                                                      <div className="flex items-end gap-2 h-48">
                                                          {stats.weeklyData.map(d => (
                                                  <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                                                                      <div className="w-full flex flex-col items-center justify-end h-36">
                                                                          {d.questions > 0 ? (
                                                                              <div
                                                                                                            className="w-full bg-indigo-100 rounded-t-lg relative flex flex-col justify-end"
                                                                                                            style={{height: `${(d.questions / maxQ) * 100}%`}}
                                                                                                          >
                                                                                                        <div
                                                                                                                                        className="w-full bg-indigo-500 rounded-t-lg"
                                                                                                                                        style={{height: `${(d.correct / d.questions) * 100}%`}}
                                                                                                                                      ></div>div>
                                                                                  </div>div>
                                                                            ) : (
                                                                              <div className="w-full bg-gray-100 rounded-t-lg" style={{height: '4px'}}></div>div>
                                                                                            )}
                                                                      </div>div>
                                                                      <span className="text-xs text-gray-500">{d.day}</span>span>
                                                                      <span className="text-xs font-medium text-gray-700">{d.questions}</span>span>
                                                  </div>div>
                                                ))}
                                                      </div>div>
                                                      <div className="flex gap-4 mt-3 text-xs text-gray-500">
                                                                      <div className="flex items-center gap-1"><div className="w-3 h-3 bg-indigo-500 rounded-sm"></div>div> Corretas</div>div>
                                                                      <div className="flex items-center gap-1"><div className="w-3 h-3 bg-indigo-100 rounded-sm"></div>div> Total</div>div>
                                                      </div>div>
                                        </div>div>
                            </div>div>
                            )}
                    
                        {stats.totalAnswered > 0 && (
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                        <h3 className="font-semibold text-gray-900 mb-4">💡 Recomendações Personalizadas</h3>h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            {worstSubject && (
                                                <div className="bg-red-50 rounded-xl p-4 border border-red-100">
                                                                  <div className="text-red-500 font-semibold text-sm mb-1">⚠️ Prioridade Alta</div>div>
                                                                  <p className="text-sm text-gray-700 font-medium">{worstSubject.subject}</p>p>
                                                                  <p className="text-xs text-gray-500 mt-1">
                                                                                      Taxa de acerto: {Math.round((worstSubject.correct / worstSubject.total) * 100)}%. Dedique mais tempo!
                                                                  </p>p>
                                                </div>div>
                                                      )}
                                                      <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-100">
                                                                      <div className="text-yellow-600 font-semibold text-sm mb-1">📌 Atenção</div>div>
                                                                      <p className="text-sm text-gray-700 font-medium">Consistência Diária</p>p>
                                                                      <p className="text-xs text-gray-500 mt-1">
                                                                                        Tente responder pelo menos 20 questões por dia para manter o ritmo.
                                                                      </p>p>
                                                      </div>div>
                                            {bestSubject && (
                                                <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                                                                  <div className="text-green-600 font-semibold text-sm mb-1">✅ Ponto Forte</div>div>
                                                                  <p className="text-sm text-gray-700 font-medium">{bestSubject.subject}</p>p>
                                                                  <p className="text-xs text-gray-500 mt-1">
                                                                                      Excelente! {Math.round((bestSubject.correct / bestSubject.total) * 100)}% de acerto. Continue assim!
                                                                  </p>p>
                                                </div>div>
                                                      )}
                                        </div>div>
                            </div>div>
                            )}
                            <Chatbot />
                    </main>main>
              </div>div>
            );
}</div>
