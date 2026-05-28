'use client';
import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Chatbot from '@/components/Chatbot';
import { createClient } from '@/lib/supabase/client';

interface SubjectStat {
        subject: string;
        correct: number;
        total: number;
}

interface DayData {
        day: string;
        questions: number;
        correct: number;
}

const COLORS: Record<string, string> = {
        'Matematica': 'bg-blue-500',
        'Portugues': 'bg-green-500',
        'Historia': 'bg-yellow-500',
        'Ciencias': 'bg-purple-500',
        'Fisica': 'bg-red-500',
        'Quimica': 'bg-orange-500',
        'Biologia': 'bg-teal-500',
        'Geografia': 'bg-indigo-500',
        'Redacao': 'bg-pink-500',
        'Ingles': 'bg-sky-500',
        'Espanhol': 'bg-rose-500',
};

function getSubjectColor(subject: string): string {
        const norm = subject.replace(/[^a-zA-Z]/g, '');
        for (const key of Object.keys(COLORS)) {
                  if (norm.toLowerCase().startsWith(key.toLowerCase().substring(0, 4))) {
                              return COLORS[key];
                  }
        }
        return 'bg-violet-500';
}

export default function DesempenhoPage() {
        const [loading, setLoading] = useState(true);
        const [period, setPeriod] = useState('semana');
        const [totalAnswered, setTotalAnswered] = useState(0);
        const [totalCorrect, setTotalCorrect] = useState(0);
        const [subjects, setSubjects] = useState<SubjectStat[]>([]);
        const [weeklyData, setWeeklyData] = useState<DayData[]>([]);
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

            const last7: DayData[] = [];
            const dateKeys: string[] = [];
            for (let i = 6; i >= 0; i--) {
                        const d = new Date();
                        d.setDate(d.getDate() - i);
                        dateKeys.push(d.toISOString().split('T')[0]);
                        last7.push({
                                      day: d.toLocaleDateString('pt-BR', { weekday: 'short' }).slice(0, 3),
                                      questions: 0,
                                      correct: 0,
                        });
            }

            if (data && data.length > 0) {
                        const subMap: Record<string, {c: number, t: number}> = {};
                        const dayMap: Record<string, {q: number, c: number}> = {};

              data.forEach((row: any) => {
                            const s = row.subject || 'Geral';
                            if (!subMap[s]) subMap[s] = { c: 0, t: 0 };
                            subMap[s].t++;
                            if (row.is_correct) subMap[s].c++;
                            if (row.created_at) {
                                            const dk = row.created_at.split('T')[0];
                                            if (!dayMap[dk]) dayMap[dk] = { q: 0, c: 0 };
                                            dayMap[dk].q++;
                                            if (row.is_correct) dayMap[dk].c++;
                            }
              });

              const subs = Object.entries(subMap).map(([s, v]) => ({
                            subject: s,
                            correct: v.c,
                            total: v.t,
              })).sort((a, b) => b.total - a.total);

              const weekly = last7.map((day, idx) => ({
                            ...day,
                            questions: dayMap[dateKeys[idx]]?.q || 0,
                            correct: dayMap[dateKeys[idx]]?.c || 0,
              }));

              setTotalAnswered(data.length);
                        setTotalCorrect(data.filter((r: any) => r.is_correct).length);
                        setSubjects(subs);
                        setWeeklyData(weekly);
            } else {
                        setWeeklyData(last7);
            }
            setLoading(false);
  };

  const overallRate = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;
        const best = subjects.length > 0 ? subjects.reduce((b, s) => (s.total > 0 && (s.correct / s.total) > (b.correct / b.total)) ? s : b, subjects[0]) : null;
        const worst = subjects.length > 0 ? subjects.reduce((w, s) => (s.total > 0 && (s.correct / s.total) < (w.correct / w.total)) ? s : w, subjects[0]) : null;
        const maxQ = Math.max(...weeklyData.map(d => d.questions), 1);

  if (loading) {
            return (
                        <div className="min-h-screen flex items-center justify-center">
                                <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      );
  }
      
        return (
                  <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50">
                        <Sidebar />
                        <main className="ml-64 p-8">
                                <div className="mb-8">
                                          <h1 className="text-3xl font-bold text-gray-800">Análise de Desempenho</h1>
                                          <p className="text-gray-500 mt-1">Acompanhe sua evolução e identifique pontos de melhoria</p>
                                </div>
                        
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                                          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                                                      <div className="text-3xl font-bold text-indigo-600">{overallRate}%</div>
                                                      <div className="text-sm text-gray-600 mt-1">Taxa de Acerto Geral</div>
                                                      <div className="text-xs text-gray-400 mt-1">{totalAnswered} questões respondidas</div>
                                          </div>
                                          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                                                      <div className="text-3xl font-bold text-green-600">{totalCorrect}</div>
                                                      <div className="text-sm text-gray-600 mt-1">Questões Corretas</div>
                                                      <div className="text-xs text-gray-400 mt-1">de {totalAnswered} tentadas</div>
                                          </div>
                                          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                                                      <div className="text-2xl font-bold text-yellow-500">Melhor</div>
                                                      <div className="text-sm font-medium text-gray-900 mt-1">{best ? best.subject : 'Sem dados'}</div>
                                                      <div className="text-xs text-green-600 mt-1">
                                                            {best && best.total > 0 ? Math.round((best.correct / best.total) * 100) + '% acerto' : 'Responda questoes'}
                                                      </div>
                                          </div>
                                          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                                                      <div className="text-2xl font-bold text-red-400">Atenção</div>
                                                      <div className="text-sm font-medium text-gray-900 mt-1">{worst && worst !== best ? worst.subject : 'Continue!'}</div>
                                                      <div className="text-xs text-red-600 mt-1">
                                                            {worst && worst !== best && worst.total > 0 ? Math.round((worst.correct / worst.total) * 100) + '% acerto' : 'Bom trabalho!'}
                                                      </div>
                                          </div>
                                </div>
                        
                              {totalAnswered === 0 ? (
                                  <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
                                              <div className="text-6xl mb-4">📚</div>
                                              <h3 className="text-xl font-bold text-gray-800 mb-2">Nenhum dado ainda</h3>
                                              <p className="text-gray-500 mb-6">Comece a responder questoes para ver seu desempenho aqui!</p>
                                              <a href="/dashboard/questoes" className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors">
                                                            Ir para Questoes
                                              </a>
                                  </div>
                                ) : (
                                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                                              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                                            <h3 className="font-semibold text-gray-900 mb-4">Desempenho por Matéria</h3>
                                                            <div className="space-y-3">
                                                                  {subjects.map(s => {
                                                          const pct = s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0;
                                                          const color = getSubjectColor(s.subject);
                                                          return (
                                                                                    <div key={s.subject}>
                                                                                                          <div className="flex justify-between items-center mb-1">
                                                                                                                                  <span className="text-sm text-gray-700">{s.subject}</span>
                                                                                                                                  <div className="flex items-center gap-2">
                                                                                                                                                            <span className="text-xs text-gray-400">{s.correct}/{s.total}</span>
                                                                                                                                                            <span className="text-sm font-semibold text-gray-900">{pct}%</span>
                                                                                                                                        </div>
                                                                                                                </div>
                                                                                                          <div className="w-full bg-gray-100 rounded-full h-2">
                                                                                                                                  <div className={color + ' h-2 rounded-full transition-all'} style={{width: pct + '%'}}></div>
                                                                                                                </div>
                                                                                          </div>
                                                                                  );
                                  })}
                                                            </div>
                                              </div>
                                  
                                              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                                            <div className="flex justify-between items-center mb-4">
                                                                            <h3 className="font-semibold text-gray-900">Questões por Dia</h3>
                                                                            <select value={period} onChange={e => setPeriod(e.target.value)} className="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none">
                                                                                              <option value="semana">Esta semana</option>
                                                                                              <option value="mes">Este mes</option>
                                                                            </select>
                                                            </div>
                                                            <div className="flex items-end gap-2 h-48">
                                                                  {weeklyData.map((d, idx) => (
                                                          <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                                                                              <div className="w-full flex flex-col items-center justify-end h-36">
                                                                                    {d.questions > 0 ? (
                                                                                        <div className="w-full bg-indigo-100 rounded-t-lg relative flex flex-col justify-end" style={{height: Math.round((d.questions / maxQ) * 100) + '%'}}>
                                                                                                                  <div className="w-full bg-indigo-500 rounded-t-lg" style={{height: Math.round((d.correct / d.questions) * 100) + '%'}}></div>
                                                                                              </div>
                                                                                      ) : (
                                                                                        <div className="w-full bg-gray-100 rounded-t-lg" style={{height: '4px'}}></div>
                                                                                                    )}
                                                                              </div>
                                                                              <span className="text-xs text-gray-500">{d.day}</span>
                                                                              <span className="text-xs font-medium text-gray-700">{d.questions}</span>
                                                          </div>
                                                        ))}
                                                            </div>
                                                            <div className="flex gap-4 mt-3 text-xs text-gray-500">
                                                                            <div className="flex items-center gap-1"><div className="w-3 h-3 bg-indigo-500 rounded-sm"></div> Corretas</div>
                                                                            <div className="flex items-center gap-1"><div className="w-3 h-3 bg-indigo-100 rounded-sm"></div> Total</div>
                                                            </div>
                                              </div>
                                  </div>
                                )}
                        
                              {totalAnswered > 0 && (
                                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                              <h3 className="font-semibold text-gray-900 mb-4">Recomendacoes Personalizadas</h3>
                                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    {worst && worst.total > 0 && (
                                                        <div className="bg-red-50 rounded-xl p-4 border border-red-100">
                                                                          <div className="text-red-500 font-semibold text-sm mb-1">Prioridade Alta</div>
                                                                          <p className="text-sm text-gray-700 font-medium">{worst.subject}</p>
                                                                          <p className="text-xs text-gray-500 mt-1">Taxa de acerto: {Math.round((worst.correct / worst.total) * 100)}%. Dedique mais tempo!</p>
                                                        </div>
                                                            )}
                                                            <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-100">
                                                                            <div className="text-yellow-600 font-semibold text-sm mb-1">Atenção</div>
                                                                            <p className="text-sm text-gray-700 font-medium">Consistencia Diaria</p>
                                                                            <p className="text-xs text-gray-500 mt-1">Tente responder pelo menos 20 questoes por dia para manter o ritmo.</p>
                                                            </div>
                                                    {best && best.total > 0 && (
                                                        <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                                                                          <div className="text-green-600 font-semibold text-sm mb-1">Ponto Forte</div>
                                                                          <p className="text-sm text-gray-700 font-medium">{best.subject}</p>
                                                                          <p className="text-xs text-gray-500 mt-1">Excelente! {Math.round((best.correct / best.total) * 100)}% de acerto. Continue assim!</p>
                                                        </div>
                                                            )}
                                              </div>
                                  </div>
                                )}
                                <Chatbot />
                        </main>
                  </div>
                );
}
