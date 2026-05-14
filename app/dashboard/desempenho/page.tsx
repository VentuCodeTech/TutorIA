'use client';
import { useState } from 'react';
import Sidebar from '@/components/Sidebar';

const subjectData = [
  { subject: 'Matemática', correct: 72, total: 100, color: 'bg-blue-500', trend: '+5%' },
  { subject: 'Português', correct: 85, total: 100, color: 'bg-green-500', trend: '+3%' },
  { subject: 'História', correct: 68, total: 100, color: 'bg-yellow-500', trend: '-2%' },
  { subject: 'Ciências', correct: 79, total: 100, color: 'bg-purple-500', trend: '+8%' },
  { subject: 'Física', correct: 55, total: 100, color: 'bg-red-500', trend: '+1%' },
  { subject: 'Química', correct: 62, total: 100, color: 'bg-orange-500', trend: '+4%' },
  { subject: 'Biologia', correct: 88, total: 100, color: 'bg-teal-500', trend: '+6%' },
  { subject: 'Geografia', correct: 74, total: 100, color: 'bg-indigo-500', trend: '-1%' },
];

const weeklyData = [
  { day: 'Seg', questions: 18, correct: 14 },
  { day: 'Ter', questions: 22, correct: 18 },
  { day: 'Qua', questions: 15, correct: 11 },
  { day: 'Qui', questions: 25, correct: 21 },
  { day: 'Sex', questions: 20, correct: 17 },
  { day: 'Sáb', questions: 30, correct: 26 },
  { day: 'Dom', questions: 12, correct: 10 },
];

export default function DesempenhoPage() {
  const [period, setPeriod] = useState('semana');

  const totalCorrect = subjectData.reduce((sum, s) => sum + s.correct, 0);
  const totalQuestions = subjectData.reduce((sum, s) => sum + s.total, 0);
  const overallRate = Math.round((totalCorrect / totalQuestions) * 100);

  const bestSubject = subjectData.reduce((best, s) =>
    s.correct > best.correct ? s : best, subjectData[0]);
  const worstSubject = subjectData.reduce((worst, s) =>
    s.correct < worst.correct ? s : worst, subjectData[0]);

  const maxQuestions = Math.max(...weeklyData.map(d => d.questions));

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">📈 Análise de Desempenho</h1>
            <p className="text-gray-600 mt-1">Acompanhe sua evolução e identifique pontos de melhoria</p>
          </div>

          <div className="grid grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="text-3xl font-bold text-indigo-600">{overallRate}%</div>
              <div className="text-sm text-gray-600 mt-1">Taxa de Acerto Geral</div>
              <div className="text-xs text-green-600 mt-1">▲ +3.2% esta semana</div>
            </div>
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="text-3xl font-bold text-green-600">{totalCorrect}</div>
              <div className="text-sm text-gray-600 mt-1">Questões Corretas</div>
              <div className="text-xs text-gray-400 mt-1">de {totalQuestions} tentadas</div>
            </div>
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="text-3xl font-bold text-yellow-500">🏆</div>
              <div className="text-sm font-medium text-gray-900 mt-1">{bestSubject.subject}</div>
              <div className="text-xs text-green-600 mt-1">Melhor matéria ({bestSubject.correct}%)</div>
            </div>
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="text-3xl font-bold text-red-400">⚠️</div>
              <div className="text-sm font-medium text-gray-900 mt-1">{worstSubject.subject}</div>
              <div className="text-xs text-red-600 mt-1">Precisa de atenção ({worstSubject.correct}%)</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4">📊 Desempenho por Matéria</h3>
              <div className="space-y-3">
                {subjectData.map((item) => (
                  <div key={item.subject}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-700">{item.subject}</span>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs ${item.trend.startsWith('+') ? 'text-green-600' : 'text-red-500'}`}>
                          {item.trend}
                        </span>
                        <span className="text-sm font-semibold text-gray-900">{item.correct}%</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className={`${item.color} h-2 rounded-full transition-all`}
                        style={{ width: `${item.correct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-900">📅 Questões por Dia</h3>
                <select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  className="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none"
                >
                  <option value="semana">Esta semana</option>
                  <option value="mes">Este mês</option>
                </select>
              </div>
              <div className="flex items-end gap-2 h-48">
                {weeklyData.map((day) => (
                  <div key={day.day} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full flex flex-col items-center justify-end h-36">
                      <div
                        className="w-full bg-indigo-100 rounded-t-lg relative flex flex-col justify-end"
                        style={{ height: `${(day.questions / maxQuestions) * 100}%` }}
                      >
                        <div
                          className="w-full bg-indigo-500 rounded-t-lg"
                          style={{ height: `${(day.correct / day.questions) * 100}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">{day.day}</span>
                    <span className="text-xs font-medium text-gray-700">{day.questions}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-4 mt-3 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-indigo-500 rounded-sm" /> Corretas
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-indigo-100 rounded-sm" /> Total
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-4">💡 Recomendações Personalizadas</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-red-50 rounded-xl p-4 border border-red-100">
                <div className="text-red-500 font-semibold text-sm mb-1">⚠️ Prioridade Alta</div>
                <p className="text-sm text-gray-700 font-medium">{worstSubject.subject}</p>
                <p className="text-xs text-gray-500 mt-1">Taxa de acerto: {worstSubject.correct}%. Dedique mais tempo a esta matéria!</p>
              </div>
              <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-100">
                <div className="text-yellow-600 font-semibold text-sm mb-1">📌 Atenção</div>
                <p className="text-sm text-gray-700 font-medium">Consistência Diária</p>
                <p className="text-xs text-gray-500 mt-1">Tente responder pelo menos 20 questões por dia para manter o ritmo.</p>
              </div>
              <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                <div className="text-green-600 font-semibold text-sm mb-1">✅ Ponto Forte</div>
                <p className="text-sm text-gray-700 font-medium">{bestSubject.subject}</p>
                <p className="text-xs text-gray-500 mt-1">Excelente! {bestSubject.correct}% de acerto. Continue assim!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
