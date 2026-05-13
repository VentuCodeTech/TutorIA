'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Sidebar from '@/components/Sidebar';
import Chatbot from '@/components/Chatbot';

export default function EstudosPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        window.location.href = '/login';
        return;
      }
      setUser(session.user);
      setLoading(false);
    });
  }, []);

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
          <h1 className="text-3xl font-bold text-gray-800">📚 Meus Estudos</h1>
          <p className="text-gray-500 mt-1">Gerencie seu plano de estudos personalizado</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-4">📖 Plano de Estudos</h2>
              <p className="text-gray-500 mb-4">Seu plano de estudos personalizado com IA para maximizar seu aprendizado.</p>
              <div className="space-y-3">
                {['Matemática - Álgebra', 'Português - Interpretação', 'Direito Constitucional', 'Raciocínio Lógico'].map((subject, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <span className="text-indigo-600 font-bold">{i+1}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{subject}</p>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                        <div className="bg-indigo-600 h-1.5 rounded-full" style={{width: '30%'}}></div>
                      </div>
                    </div>
                    <span className="text-sm text-gray-400">Em progresso</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-4">🤖 Sessão de IA</h2>
              <p className="text-gray-500 mb-4">Inicie uma sessão de estudos adaptativa com a IA. A IA irá criar questões personalizadas com base no seu nível.</p>
              <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all">
                🚀 Iniciar Sessão Adaptativa
              </button>
            </div>
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-800 mb-3">🎯 Meta Diária</h3>
              <div className="text-center py-4">
                <p className="text-4xl font-bold text-indigo-600">0/20</p>
                <p className="text-gray-500 text-sm mt-1">questões concluídas</p>
              </div>
              <button className="w-full bg-indigo-600 text-white py-2 rounded-xl font-medium hover:bg-indigo-700 transition-colors">
                Iniciar Estudo
              </button>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-800 mb-3">📅 Próximas Revisões</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Matemática</span>
                  <span className="text-indigo-600 font-medium">Hoje</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Português</span>
                  <span className="text-gray-400">Amanhã</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Direito</span>
                  <span className="text-gray-400">Em 3 dias</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Chatbot />
      </main>
    </div>
  );
}
