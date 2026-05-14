'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import Chatbot from '@/components/Chatbot';

export default function Dashboard() {
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const userName = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'Estudante';
  const userAvatar = user.user_metadata?.avatar_url;

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-100 shadow-sm z-30 flex flex-col">
        <div className="p-6 border-b border-gray-100">
          <Link href="/dashboard" className="text-2xl font-bold text-indigo-600">TutorIA</Link>
          <p className="text-xs text-gray-400 mt-1">Powered by Claude AI</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {[
            { icon: '🏠', label: 'Dashboard', href: '/dashboard', active: true },
            { icon: '📚', label: 'Meus Estudos', href: '/dashboard/estudos', active: false },
            { icon: '📝', label: 'Questões', href: '/dashboard/questoes', active: false },
            { icon: '📊', label: 'Progresso', href: '/dashboard/progresso', active: false },
            { icon: '🎯', label: 'Simulados', href: '/dashboard/simulados', active: false },
            { icon: '💰', label: 'Planos', href: '/pricing', active: false },
              { icon: '🎯', label: 'Vestibular/Concurso', href: '/dashboard/vestibular', active: false },
              { icon: '📈', label: 'Desempenho', href: '/dashboard/desempenho', active: false },
              { icon: '📓', label: 'Anotações', href: '/dashboard/anotacoes', active: false },
              { icon: '🤖', label: 'Assistente IA', href: '/dashboard/assistente', active: false },
              { icon: '💬', label: 'Comunidade', href: '/dashboard/comunidade', active: false },
              { icon: '🆕', label: 'Novidades', href: '/dashboard/novidades', active: false },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                item.active
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            {userAvatar ? (
              <img src={userAvatar} alt="Avatar" className="w-9 h-9 rounded-full" />
            ) : (
              <div className="w-9 h-9 bg-indigo-100 rounded-full flex items-center justify-center">
                <span className="text-indigo-700 font-bold text-sm">
                  {userName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">{userName}</p>
              <p className="text-xs text-gray-400 truncate">{user.email}</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 text-xs text-gray-500 hover:text-red-600 py-2 px-3 rounded-lg hover:bg-red-50 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sair
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">
            Olá, {userName}! 👋
          </h1>
          <p className="text-gray-500 mt-1">Vamos continuar seus estudos de hoje?</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { icon: '📅', title: 'Dias Estudando', value: '0', sub: 'dias consecutivos', color: 'from-blue-500 to-blue-600' },
            { icon: '✅', title: 'Questões Hoje', value: '0', sub: 'de 20 meta diária', color: 'from-green-500 to-green-600' },
            { icon: '📈', title: 'Taxa de Acerto', value: '0%', sub: 'geral', color: 'from-purple-500 to-purple-600' },
            { icon: '🏆', title: 'Ranking', value: '-', sub: 'posição geral', color: 'from-orange-500 to-orange-600' },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center mb-4`}>
                <span className="text-lg">{stat.icon}</span>
              </div>
              <p className="text-3xl font-extrabold text-gray-800">{stat.value}</p>
              <p className="text-sm font-medium text-gray-600 mt-1">{stat.title}</p>
              <p className="text-xs text-gray-400 mt-0.5">{stat.sub}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white">
            <h2 className="text-lg font-bold mb-2">🚀 Começar Sessão de Estudos</h2>
            <p className="text-indigo-200 text-sm mb-4">
              Use a IA para criar um plano de estudo personalizado para você.
            </p>
            <button className="bg-white text-indigo-700 font-bold px-6 py-2.5 rounded-xl text-sm hover:bg-indigo-50 transition-colors">
              Iniciar Agora
            </button>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-2">⚡ Desafio Diário</h2>
            <p className="text-gray-500 text-sm mb-4">
              Complete 20 questões hoje para manter sua sequência!
            </p>
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-gray-100 rounded-full h-2">
                <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '0%' }}></div>
              </div>
              <span className="text-sm font-semibold text-gray-600">0/20</span>
            </div>
          </div>
        </div>

        {/* Subject Areas */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-4">📚 Áreas de Estudo</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { emoji: '🧮', subject: 'Matemática', progress: 0 },
              { emoji: '📖', subject: 'Português', progress: 0 },
              { emoji: '🌍', subject: 'História', progress: 0 },
              { emoji: '⚗️', subject: 'Ciências', progress: 0 },
              { emoji: '⚖️', subject: 'Direito', progress: 0 },
              { emoji: '💰', subject: 'Finanças', progress: 0 },
              { emoji: '🗺️', subject: 'Geografia', progress: 0 },
              { emoji: '🇬🇧', subject: 'Inglês', progress: 0 },
            ].map((item, i) => (
              <button
                key={i}
                className="flex flex-col items-center p-4 rounded-xl bg-gray-50 hover:bg-indigo-50 hover:border-indigo-200 border border-transparent transition-all group"
              >
                <span className="text-2xl mb-2">{item.emoji}</span>
                <p className="text-sm font-medium text-gray-700 group-hover:text-indigo-700">{item.subject}</p>
                <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
                  <div
                    className="bg-indigo-500 h-1 rounded-full"
                    style={{ width: `${item.progress}%` }}
                  ></div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* TutorIA Info Banner */}
        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 flex items-start gap-4">
          <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <span className="text-2xl">🎓</span>
          </div>
          <div>
            <h3 className="font-bold text-indigo-900 mb-1">TutorIA está pronto para te ajudar!</h3>
            <p className="text-indigo-700 text-sm">
              Clique no botão de chat no canto inferior direito para tirar qualquer dúvida com nossa IA powered by Claude Sonnet 4.6.
              Disponível 24/7 para te ajudar com ENEM, OAB, Concursos e muito mais!
            </p>
          </div>
        </div>
      </main>

      <Chatbot />
    </div>
  );
}
