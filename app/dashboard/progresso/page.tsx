'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Sidebar from '@/components/Sidebar';
import Chatbot from '@/components/Chatbot';

export default function ProgressoPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { window.location.href = '/login'; return; }
      setUser(session.user);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  const areas = [
    { name: 'Matemática', progress: 45, color: 'bg-blue-500', total: 120, done: 54 },
    { name: 'Português', progress: 62, color: 'bg-green-500', total: 100, done: 62 },
    { name: 'Direito Constitucional', progress: 28, color: 'bg-purple-500', total: 150, done: 42 },
    { name: 'Raciocínio Lógico', progress: 71, color: 'bg-orange-500', total: 80, done: 57 },
    { name: 'Informática', progress: 33, color: 'bg-red-500', total: 60, done: 20 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50">
      <Sidebar />
      <main className="ml-64 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">📊 Progresso</h1>
          <p className="text-gray-500 mt-1">Acompanhe sua evolução em tempo real</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total de Questões', value: '0', icon: '📝', color: 'text-blue-600' },
            { label: 'Taxa de Acerto', value: '0%', icon: '🎯', color: 'text-green-600' },
            { label: 'Dias Estudando', value: '0', icon: '📅', color: 'text-purple-600' },
            { label: 'Ranking', value: '-', icon: '🏆', color: 'text-orange-600' },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{stat.icon}</span>
                <span className={`text-2xl font-bold ${stat.color}`}>{stat.value}</span>
              </div>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4">📈 Progresso por Área</h2>
            <div className="space-y-4">
              {areas.map((area, i) => (
                <div key={i}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-sm font-medium text-gray-700">{area.name}</span>
                    <span className="text-sm text-gray-500">{area.done}/{area.total} questões</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className={`${area.color} h-2 rounded-full transition-all`} style={{width: `${area.progress}%`}}></div>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-gray-400">{area.progress}% concluído</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4">🗓️ Atividade Recente</h2>
            <div className="space-y-3">
              {[
                { date: 'Hoje', action: 'Sessão de estudos iniciada', type: 'info' },
                { date: 'Ontem', action: 'Meta diária não atingida', type: 'warning' },
                { date: '3 dias atrás', action: '20 questões respondidas - 85% de acerto', type: 'success' },
                { date: '5 dias atrás', action: 'Plano de estudos atualizado pela IA', type: 'info' },
              ].map((activity, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50">
                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${activity.type === 'success' ? 'bg-green-500' : activity.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'}`}></div>
                  <div>
                    <p className="text-sm text-gray-800">{activity.action}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{activity.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4">🎖️ Conquistas</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { icon: '🔥', title: 'Primeira Questão', desc: 'Responda sua primeira questão', locked: true },
                { icon: '⚡', title: 'Sequência de 3', desc: 'Estude 3 dias seguidos', locked: true },
                { icon: '🎯', title: 'Mestre em Exatas', desc: '100 questões de matemática', locked: true },
                { icon: '👑', title: 'Top 100', desc: 'Entre no ranking nacional', locked: true },
              ].map((badge, i) => (
                <div key={i} className={`p-4 rounded-xl text-center ${badge.locked ? 'bg-gray-50 opacity-60' : 'bg-indigo-50'}`}>
                  <p className="text-3xl mb-2 grayscale">{badge.icon}</p>
                  <p className="font-medium text-sm text-gray-800">{badge.title}</p>
                  <p className="text-xs text-gray-500 mt-1">{badge.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <Chatbot />
      </main>
    </div>
  );
}
