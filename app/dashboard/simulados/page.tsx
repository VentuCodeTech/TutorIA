'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Sidebar from '@/components/Sidebar';
import Chatbot from '@/components/Chatbot';

export default function SimuladosPage() {
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

  const simuladosList = [
    { title: 'ENEM 2024 - Simulado Completo', questions: 180, time: '330 min', difficulty: 'Difícil', status: 'Disponível', color: 'indigo' },
    { title: 'Concurso Federal - Nível Médio', questions: 60, time: '120 min', difficulty: 'Médio', status: 'Disponível', color: 'green' },
    { title: 'OAB - Primeira Fase', questions: 80, time: '150 min', difficulty: 'Difícil', status: 'Disponível', color: 'purple' },
    { title: 'CPA-20 - Módulo Renda Fixa', questions: 40, time: '60 min', difficulty: 'Médio', status: 'Disponível', color: 'orange' },
    { title: 'Concurso Estadual - Analista', questions: 100, time: '180 min', difficulty: 'Difícil', status: 'Disponível', color: 'blue' },
    { title: 'Revisão Rápida - Raciocínio', questions: 20, time: '30 min', difficulty: 'Fácil', status: 'Disponível', color: 'red' },
  ];

  const colorMap: any = {
    indigo: 'bg-indigo-50 border-indigo-200 text-indigo-700',
    green: 'bg-green-50 border-green-200 text-green-700',
    purple: 'bg-purple-50 border-purple-200 text-purple-700',
    orange: 'bg-orange-50 border-orange-200 text-orange-700',
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    red: 'bg-red-50 border-red-200 text-red-700',
  };

  const diffColors: any = {
    'Fácil': 'bg-green-100 text-green-700',
    'Médio': 'bg-yellow-100 text-yellow-700',
    'Difícil': 'bg-red-100 text-red-700',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50">
      <Sidebar />
      <main className="ml-64 p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">🎯 Simulados</h1>
            <p className="text-gray-500 mt-1">Simule provas completas cronometradas</p>
          </div>
          <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transition-all text-sm">
            + Simulado Personalizado
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Simulados Feitos', value: '0', icon: '📋' },
            { label: 'Melhor Nota', value: '0', icon: '⭐' },
            { label: 'Tempo Total', value: '0h', icon: '⏱️' },
            { label: 'Provas Aprovado', value: '0', icon: '✅' },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
              <span className="text-2xl">{stat.icon}</span>
              <div>
                <p className="text-xl font-bold text-gray-800">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {simuladosList.map((sim, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all">
              <div className={`inline-block px-2 py-1 rounded-lg text-xs font-medium border mb-3 ${colorMap[sim.color]}`}>
                {sim.title.split(' - ')[0]}
              </div>
              <h3 className="font-bold text-gray-800 mb-3 leading-tight">{sim.title}</h3>
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>📝</span><span>{sim.questions} questões</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>⏱️</span><span>{sim.time}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span>🎯</span><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${diffColors[sim.difficulty]}`}>{sim.difficulty}</span>
                </div>
              </div>
              <button className="w-full bg-indigo-600 text-white py-2 rounded-xl font-medium hover:bg-indigo-700 transition-colors text-sm">
                Iniciar Simulado →
              </button>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white">
          <h2 className="text-xl font-bold mb-2">🤖 Simulado Inteligente com IA</h2>
          <p className="text-indigo-100 mb-4">Nossa IA cria um simulado personalizado com base no seu histórico de erros e no seu nível atual, maximizando sua evolução.</p>
          <button className="bg-white text-indigo-600 px-5 py-2 rounded-xl font-semibold hover:bg-indigo-50 transition-colors">
            Criar Simulado Adaptativo
          </button>
        </div>
        <Chatbot />
      </main>
    </div>
  );
}
