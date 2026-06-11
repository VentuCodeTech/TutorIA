'use client'
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import Sidebar from '@/components/Sidebar';
import Chatbot from '@/components/Chatbot';
import { useUserPlan } from '@/lib/useUserPlan';

interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  subject: string;
  difficulty: string;
  source?: string;
}

interface SimuladoConfig {
  id: string;
  title: string;
  vestibular: string;
  questions: number;
  timeMinutes: number;
  difficulty: string;
  areas: string[];
  areaOrder: { area: string; count: number }[];
  color: string;
  tag: string;
  description: string;
  icon: string;
  institution: string;
}

const vestibularSimulados: SimuladoConfig[] = [
  {
    id: 'enem_completo',
    title: 'ENEM - Simulado Dia 1',
    vestibular: 'ENEM',
    questions: 45,
    timeMinutes: 330,
    difficulty: 'Médio',
    areas: ['Linguagens', 'Ciências Humanas', 'Redacao'],
    areaOrder: [
      { area: 'Portugues', count: 13 },
      { area: 'Ingles', count: 5 },
      { area: 'Espanhol', count: 2 },
      { area: 'Historia', count: 12 },
      { area: 'Geografia', count: 8 },
      { area: 'Redacao', count: 5 },
    ],
    color: 'blue',
    tag: 'ENEM',
    description: 'Baseado no modelo ENEM: Linguagens, Ciências Humanas e Redação',
    icon: '🎓',
    institution: 'MEC/INEP'
  },
  {
    id: 'enem_dia2',
    title: 'ENEM - Simulado Dia 2',
    vestibular: 'ENEM',
    questions: 45,
    timeMinutes: 330,
    difficulty: 'Médio',
    areas: ['Ciências da Natureza', 'Matemática'],
    areaOrder: [
      { area: 'Biologia', count: 10 },
      { area: 'Fisica', count: 10 },
      { area: 'Quimica', count: 10 },
      { area: 'Matematica', count: 15 },
    ],
    color: 'indigo',
    tag: 'ENEM',
    description: 'Baseado no modelo ENEM: Ciências da Natureza e Matemática',
    icon: '🎓',
    institution: 'MEC/INEP'
  },
  {
    id: 'fuvest_fase1',
    title: 'FUVEST - 1ª Fase',
    vestibular: 'FUVEST',
    questions: 45,
    timeMinutes: 360,
    difficulty: 'Difícil',
    areas: ['Português', 'Matemática', 'Ciências', 'Humanidades'],
    areaOrder: [
      { area: 'Portugues', count: 12 },
      { area: 'Historia', count: 8 },
      { area: 'Geografia', count: 5 },
      { area: 'Biologia', count: 6 },
      { area: 'Quimica', count: 6 },
      { area: 'Fisica', count: 5 },
      { area: 'Matematica', count: 3 },
    ],
    color: 'purple',
    tag: 'FUVEST',
    description: 'Simulado baseado na primeira fase da FUVEST (USP)',
    icon: '🏛️',
    institution: 'USP'
  },
  {
    id: 'oab_primeira',
    title: 'OAB - 1ª Fase',
    vestibular: 'OAB',
    questions: 40,
    timeMinutes: 300,
    difficulty: 'Difícil',
    areas: ['Direito Constitucional', 'Direito Civil', 'Direito Penal', 'Direito Processual'],
    areaOrder: [
      { area: 'Direito Constitucional', count: 12 },
      { area: 'Direito Civil', count: 10 },
      { area: 'Direito Penal', count: 8 },
      { area: 'Direito Trabalhista', count: 6 },
      { area: 'Portugues', count: 4 },
    ],
    color: 'green',
    tag: 'OAB',
    description: 'Simulado baseado no Exame da OAB - 1ª Fase',
    icon: '⚖️',
    institution: 'OAB/FGV'
  },
  {
    id: 'concurso_federal',
    title: 'Concurso Federal - Nível Médio',
    vestibular: 'Concurso Federal',
    questions: 50,
    timeMinutes: 300,
    difficulty: 'Médio',
    areas: ['Língua Portuguesa', 'Matemática', 'Raciocínio Lógico', 'Atualidades'],
    areaOrder: [
      { area: 'Portugues', count: 15 },
      { area: 'Matematica', count: 15 },
      { area: 'Historia', count: 10 },
      { area: 'Geografia', count: 10 },
    ],
    color: 'orange',
    tag: 'Concursos',
    description: 'Perfil INSS, Receita Federal, CGU e outros federais',
    icon: '🏛️',
    institution: 'CESPE/CEBRASPE'
  },
  {
    id: 'unicamp',
    title: 'UNICAMP - Vestibular',
    vestibular: 'UNICAMP',
    questions: 45,
    timeMinutes: 360,
    difficulty: 'Difícil',
    areas: ['Português', 'Matemática', 'Ciências', 'Humanidades'],
    areaOrder: [
      { area: 'Portugues', count: 12 },
      { area: 'Historia', count: 8 },
      { area: 'Matematica', count: 10 },
      { area: 'Biologia', count: 5 },
      { area: 'Quimica', count: 5 },
      { area: 'Fisica', count: 5 },
    ],
    color: 'teal',
    tag: 'UNICAMP',
    description: 'Simulado no estilo do vestibular da UNICAMP',
    icon: '🔬',
    institution: 'UNICAMP'
  },
  {
    id: 'cpa20',
    title: 'CPA-20 - Certificação ANBIMA',
    vestibular: 'CPA-20',
    questions: 30,
    timeMinutes: 120,
    difficulty: 'Médio',
    areas: ['Investimentos', 'Mercado Financeiro'],
    areaOrder: [
      { area: 'Investimentos', count: 15 },
      { area: 'Matematica Financeira', count: 10 },
      { area: 'Financas Pessoais', count: 5 },
    ],
    color: 'yellow',
    tag: 'Finanças',
    description: 'Simulado baseado na certificação CPA-20 ANBIMA',
    icon: '💰',
    institution: 'ANBIMA'
  },
  {
    id: 'medicina',
    title: 'Vestibular de Medicina',
    vestibular: 'Medicina',
    questions: 45,
    timeMinutes: 360,
    difficulty: 'Difícil',
    areas: ['Biologia', 'Química', 'Física', 'Matemática', 'Português'],
    areaOrder: [
      { area: 'Biologia', count: 15 },
      { area: 'Quimica', count: 12 },
      { area: 'Fisica', count: 10 },
      { area: 'Matematica', count: 5 },
      { area: 'Portugues', count: 3 },
    ],
    color: 'red',
    tag: 'Medicina',
    description: 'Simulado para vestibulares de medicina (FAMERP, Santa Casa, etc.)',
    icon: '🏥',
    institution: 'FAMERP/SANTA CASA'
  },
  {
    id: 'carreiras_militares',
    title: 'Carreiras Militares - EsMCEx/ESPCEX/AFA',
    vestibular: 'Carreiras Militares',
    questions: 50,
    timeMinutes: 300,
    difficulty: 'Difícil',
    areas: ['Matemática', 'Física', 'Química', 'Português', 'História', 'Geografia'],
    areaOrder: [
      { area: 'Matematica', count: 15 },
      { area: 'Fisica', count: 10 },
      { area: 'Quimica', count: 8 },
      { area: 'Portugues', count: 10 },
      { area: 'Historia', count: 4 },
      { area: 'Geografia', count: 3 },
    ],
    color: 'military',
    tag: 'Militares',
    description: 'Simulado baseado em provas reais das Carreiras Militares (EsMCEx, ESPCEX, AFA, EFOMM)',
    icon: '⭐',
    institution: 'EsMCEx/ESPCEX/AFA/EFOMM'
  },
];

const colorMap: Record<string, {bg: string, border: string, text: string, badge: string}> = {
  blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', badge: 'bg-blue-100 text-blue-700' },
  indigo: { bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-700', badge: 'bg-indigo-100 text-indigo-700' },
  purple: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', badge: 'bg-purple-100 text-purple-700' },
  green: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', badge: 'bg-green-100 text-green-700' },
  orange: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', badge: 'bg-orange-100 text-orange-700' },
  teal: { bg: 'bg-teal-50', border: 'border-teal-200', text: 'text-teal-700', badge: 'bg-teal-100 text-teal-700' },
  yellow: { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700', badge: 'bg-yellow-100 text-yellow-700' },
  red: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', badge: 'bg-red-100 text-red-700' },
  military: { bg: 'bg-slate-50', border: 'border-slate-300', text: 'text-slate-700', badge: 'bg-slate-200 text-slate-700' },
};

export default function SimuladosPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSimulado, setActiveSimulado] = useState<SimuladoConfig | null>(null);
  const [simQuestions, setSimQuestions] = useState<Question[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState<{correct: boolean; questionId: string}[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [simFinished, setSimFinished] = useState(false);
  const [generatingQuestions, setGeneratingQuestions] = useState(false);
  const [generateProgress, setGenerateProgress] = useState(0);
  const [stats, setStats] = useState({ done: 0, bestNote: 0, totalTime: 0, approved: 0 });
  const [vestibularPref, setVestibularPref] = useState<string | null>(null);
  const [filteredSimulados, setFilteredSimulados] = useState<SimuladoConfig[]>(vestibularSimulados);
  const [filterActive, setFilterActive] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const supabase = createClient();
const { features } = useUserPlan();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { window.location.href = '/login'; return; }
      setUserId(session.user.id);
      loadStats(session.user.id);
      loadVestibularPref(session.user.id);
      setLoading(false);
    });
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const loadVestibularPref = async (uid: string) => {
    try {
      const { data } = await supabase.from('user_preferences').select('vestibular').eq('user_id', uid).single();
      if (data?.vestibular) {
        setVestibularPref(data.vestibular);
        const filtered = vestibularSimulados.filter(s =>
          s.vestibular.toLowerCase().includes(data.vestibular.toLowerCase()) ||
          data.vestibular.toLowerCase().includes(s.vestibular.toLowerCase())
        );
        if (filtered.length > 0) { setFilteredSimulados(filtered); setFilterActive(true); }
      }
    } catch {}
  };

  const loadStats = async (uid: string) => {
    const { data } = await supabase.from('simulado_results').select('score, time_spent, total_questions').eq('user_id', uid);
    if (data && data.length > 0) {
      const best = Math.max(...data.map(d => Math.round((d.score / d.total_questions) * 100)));
      const total = data.reduce((acc, d) => acc + (d.time_spent || 0), 0);
      const approved = data.filter(d => (d.score / d.total_questions) >= 0.6).length;
      setStats({ done: data.length, bestNote: best, totalTime: Math.round(total / 60), approved });
    }
  };

  const startSimulado = async (sim: SimuladoConfig) => {
    setGeneratingQuestions(true);
    setActiveSimulado(sim);
    setCurrentQIndex(0);
    setAnswers([]);
    setSelectedAnswer(null);
    setShowResult(false);
    setSimFinished(false);
    setGenerateProgress(0);

    const questions: Question[] = [];
    const usedTexts = new Set<string>();

    const areaSequence: string[] = [];
    const order = sim.areaOrder && sim.areaOrder.length > 0 ? sim.areaOrder : sim.areas.map((a) => ({ area: a, count: Math.ceil(sim.questions / sim.areas.length) }));

    for (const entry of order) {
      for (let j = 0; j < entry.count && areaSequence.length < sim.questions; j++) {
        areaSequence.push(entry.area);
      }
    }
    while (areaSequence.length < sim.questions) {
      areaSequence.push(order[0]?.area || sim.areas[0]);
    }

    for (let i = 0; i < Math.min(sim.questions, areaSequence.length); i++) {
      try {
        const area = areaSequence[i];
        const res = await fetch('/api/generate-question', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            area,
            difficulty: sim.difficulty,
            excludeTexts: Array.from(usedTexts),
            vestibular: sim.vestibular,
            context: `Questão ${i+1} no estilo ${sim.vestibular} - ${sim.institution} - materia: ${area}`
          })
        });
        const data = await res.json();
        if (data.question) {
          usedTexts.add(data.question.text);
          questions.push({ ...data.question, source: sim.institution });
        }
        setGenerateProgress(Math.round(((i + 1) / sim.questions) * 100));
      } catch (e) {
        console.error('Error fetching question', e);
      }
    }

    if (questions.length === 0) {
      setGeneratingQuestions(false); setActiveSimulado(null); return;
    }

    setSimQuestions(questions);
    setTimeLeft(sim.timeMinutes * 60);
    setGeneratingQuestions(false);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { if (timerRef.current) clearInterval(timerRef.current); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    if (timeLeft === 0 && activeSimulado && !simFinished && simQuestions.length > 0) {
      finishSimulado(simQuestions, answers);
    }
  }, [timeLeft]);

  const handleAnswer = () => {
    if (selectedAnswer === null) return;
    const q = simQuestions[currentQIndex];
    const correct = selectedAnswer === q.correctAnswer;
    const newAnswers = [...answers, { correct, questionId: q.id }];
    setAnswers(newAnswers);
    setShowResult(true);
    if (currentQIndex + 1 >= simQuestions.length) {
      if (timerRef.current) clearInterval(timerRef.current);
      setTimeout(() => finishSimulado(simQuestions, newAnswers), 1500);
    }
  };

  const nextQuestion = () => { setSelectedAnswer(null); setShowResult(false); setCurrentQIndex(prev => prev + 1); };

  const finishSimulado = async (questions: Question[], finalAnswers: {correct: boolean; questionId: string}[]) => {
    setSimFinished(true);
    if (timerRef.current) clearInterval(timerRef.current);
    if (userId && activeSimulado && finalAnswers.length > 0) {
      const score = finalAnswers.filter(a => a.correct).length;
      const timeSpent = (activeSimulado.timeMinutes * 60) - timeLeft;
      await supabase.from('simulado_results').insert({
        user_id: userId, simulado_name: activeSimulado.title, score,
        total_questions: questions.length, time_spent: Math.max(timeSpent, 0), difficulty: activeSimulado.difficulty,
      });
      loadStats(userId);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div></div>;

  if (generatingQuestions && activeSimulado) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 flex">
        <Sidebar />
        <main className="flex-1 ml-64 p-8 flex items-center justify-center">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-4">{activeSimulado.icon}</div>
            <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Gerando Simulado...</h2>
            <p className="text-gray-500 mb-4">{activeSimulado.title}</p>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
              <div className="bg-indigo-600 h-3 rounded-full transition-all duration-300" style={{width: `${generateProgress}%`}}></div>
            </div>
            <p className="text-sm text-gray-400">{generateProgress}% concluído - Gerando questões na ordem correta da prova</p>
          </div>
        </main>
      </div>
    );
  }

  if (activeSimulado && simFinished) {
    const score = answers.filter(a => a.correct).length;
    const pct = simQuestions.length > 0 ? Math.round((score / simQuestions.length) * 100) : 0;
    const approved = pct >= 60;
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 flex">
        <Sidebar />
        <main className="flex-1 ml-64 p-8">
          <div className="max-w-2xl mx-auto bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
            <div className="text-6xl mb-4">{approved ? '🏆' : '📚'}</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Simulado Concluído!</h2>
            <p className="text-gray-500 mb-6">{activeSimulado.title}</p>
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-indigo-50 rounded-xl p-4"><div className="text-3xl font-bold text-indigo-600">{pct}%</div><div className="text-xs text-gray-500">Nota Final</div></div>
              <div className="bg-green-50 rounded-xl p-4"><div className="text-3xl font-bold text-green-600">{score}/{simQuestions.length}</div><div className="text-xs text-gray-500">Acertos</div></div>
              <div className={`${approved ? 'bg-green-50' : 'bg-red-50'} rounded-xl p-4`}><div className={`text-xl font-bold ${approved ? 'text-green-600' : 'text-red-500'}`}>{approved ? '✅ Aprovado' : '❌ Reprovado'}</div><div className="text-xs text-gray-500">Resultado</div></div>
            </div>
            <div className="flex gap-4 justify-center flex-wrap">
              <button onClick={() => { setActiveSimulado(null); setSimFinished(false); }} className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors">← Voltar</button>
              <button onClick={() => startSimulado(activeSimulado)} className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors">🔄 Novo Simulado</button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (activeSimulado && simQuestions.length > 0 && !simFinished) {
    const currentQ = simQuestions[currentQIndex];
    const progress = Math.round((currentQIndex / simQuestions.length) * 100);
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 flex">
        <Sidebar />
        <main className="flex-1 ml-64 p-8">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4 flex items-center justify-between">
              <div>
                <h2 className="font-bold text-gray-800">{activeSimulado.icon} {activeSimulado.title}</h2>
                <p className="text-sm text-gray-500">Questão {currentQIndex + 1} de {simQuestions.length} • {currentQ.subject}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className={`text-xl font-bold font-mono ${timeLeft < 120 ? 'text-red-500 animate-pulse' : 'text-gray-700'}`}>⏱ {formatTime(timeLeft)}</div>
                <button onClick={() => { if (timerRef.current) clearInterval(timerRef.current); finishSimulado(simQuestions, answers); }} className="text-sm text-red-500 hover:text-red-700 border border-red-200 px-3 py-1 rounded-lg">Encerrar</button>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4"><div className="bg-indigo-500 h-2 rounded-full transition-all" style={{width: `${progress}%`}}></div></div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex gap-2 mb-4 flex-wrap">
                <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded-full">{currentQ.subject}</span>
                <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">{currentQ.difficulty}</span>
                {currentQ.source && <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full">📚 {currentQ.source}</span>}
              </div>
              <p className="text-gray-800 font-medium mb-6 text-lg leading-relaxed">{currentQ.text}</p>
              <div className="space-y-3 mb-6">
                {currentQ.options.map((opt, idx) => {
                  let cls = 'w-full text-left p-4 rounded-xl border-2 transition-all ';
                  if (showResult) {
                    if (idx === currentQ.correctAnswer) cls += 'border-green-500 bg-green-50 text-green-700';
                    else if (idx === selectedAnswer) cls += 'border-red-500 bg-red-50 text-red-700';
                    else cls += 'border-gray-200 text-gray-400';
                  } else {
                    cls += idx === selectedAnswer ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 text-gray-700';
                  }
                  return <button key={idx} className={cls} onClick={() => !showResult && setSelectedAnswer(idx)}><span className="font-semibold mr-2">{String.fromCharCode(65+idx)}.</span>{opt}</button>;
                })}
              </div>
              {showResult && (
                <div className={`p-4 rounded-xl mb-4 ${answers[answers.length-1]?.correct ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                  <p className="font-semibold mb-1">{answers[answers.length-1]?.correct ? '✅ Correto!' : '❌ Incorreto'}</p>
                  <p className="text-sm text-gray-600">{currentQ.explanation}</p>
                </div>
              )}
              {!showResult ? (
                <button onClick={handleAnswer} disabled={selectedAnswer === null} className="w-full bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">Confirmar Resposta</button>
              ) : currentQIndex + 1 < simQuestions.length ? (
                <button onClick={nextQuestion} className="w-full bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors">Próxima Questão →</button>
              ) : null}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 flex">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">🎯 Simulados</h1>
            <p className="text-gray-500 mt-1">Provas completas com questões na ordem real de cada vestibular e concurso</p>
            {vestibularPref && filterActive && (
              <p className="text-indigo-600 text-sm mt-1">📌 Filtrando por: <strong>{vestibularPref}</strong><button onClick={() => { setFilteredSimulados(vestibularSimulados); setFilterActive(false); }} className="ml-2 text-gray-400 hover:text-gray-600 text-xs underline">Ver todos</button></p>
            )}
          </div>
          <div className="flex gap-2 flex-wrap">
            {!filterActive && vestibularPref && (
              <button onClick={() => { const f = vestibularSimulados.filter(s => s.vestibular.toLowerCase().includes(vestibularPref.toLowerCase())); if(f.length>0){setFilteredSimulados(f);setFilterActive(true);} }} className="text-sm bg-indigo-50 text-indigo-600 border border-indigo-200 px-4 py-2 rounded-xl hover:bg-indigo-100 transition">🎯 Filtrar por {vestibularPref}</button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[{label:'Simulados Feitos',value:stats.done.toString(),icon:'📋'},{label:'Melhor Nota',value:stats.done>0?`${stats.bestNote}%`:'-',icon:'⭐'},{label:'Tempo Total',value:`${stats.totalTime}min`,icon:'⏱️'},{label:'Aprovações',value:stats.approved.toString(),icon:'✅'}].map((stat,i)=>(
            <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
              <span className="text-2xl">{stat.icon}</span><div><p className="text-xl font-bold text-gray-800">{stat.value}</p><p className="text-xs text-gray-500">{stat.label}</p></div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
          {filteredSimulados.map((sim) => {
            const colors = colorMap[sim.color] || colorMap.indigo;
            return (
              <div key={sim.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all flex flex-col">
                <div className="flex items-start justify-between mb-3">
                  <div className={`inline-block px-2 py-1 rounded-lg text-xs font-medium border ${colors.bg} ${colors.border} ${colors.text}`}>{sim.icon} {sim.tag}</div>
                  <span className="text-xs text-gray-400">{sim.institution}</span>
                </div>
                <h3 className="font-bold text-gray-800 mb-2 leading-tight">{sim.title}</h3>
                <p className="text-xs text-gray-500 mb-3 flex-1">{sim.description}</p>
                <div className="space-y-1.5 mb-3">
                  <div className="flex items-center gap-2 text-sm text-gray-500"><span>📝</span><span>{sim.questions} questões</span></div>
                  <div className="flex items-center gap-2 text-sm text-gray-500"><span>⏱️</span><span>{sim.timeMinutes} min</span></div>
                  <div className="flex items-center gap-2 text-sm text-gray-500"><span>📚</span><span className="truncate">{sim.areaOrder.slice(0,2).map(a=>a.area).join(', ')}{sim.areaOrder.length>2?'...':''}</span></div>
                </div>
                <button onClick={()=>{if(!features.unlimitedSimulados){router.push('/dashboard/planos');return;}startSimulado(sim);}} className="w-full bg-indigo-600 text-white py-2.5 rounded-xl font-medium hover:bg-indigo-700 transition-colors text-sm">Iniciar Simulado →</button>
              </div>
            );
          })}
        </div>

        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white">
          <h2 className="text-xl font-bold mb-2">🤖 Simulado Adaptativo com IA</h2>
          <p className="text-indigo-100 mb-4">Nossa IA cria um simulado 100% personalizado baseado no seu histórico e vestibular escolhido.</p>
          <button onClick={()=>{if(!features.aiPersonalizedSimulados){router.push('/dashboard/planos');return;}const pref=vestibularPref||'ENEM';const match=vestibularSimulados.find(s=>s.vestibular.toLowerCase().includes(pref.toLowerCase()))||vestibularSimulados[0];startSimulado({...match,id:`adaptativo_${Date.now()}`,title:`Simulado Adaptativo IA - ${pref}`,tag:'IA Adaptativo'});}} className="bg-white text-indigo-600 px-5 py-2 rounded-xl font-semibold hover:bg-indigo-50 transition-colors">Criar Simulado Adaptativo</button>
        </div>
        <Chatbot />
      </main>
    </div>
  );
      }
