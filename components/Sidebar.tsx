'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useState, useEffect } from 'react';

const navItems = [
  { icon: '🏠', label: 'Dashboard', href: '/dashboard' },
  { icon: '📚', label: 'Meus Estudos', href: '/dashboard/estudos' },
  { icon: '📝', label: 'Questões', href: '/dashboard/questoes' },
  { icon: '📊', label: 'Progresso', href: '/dashboard/progresso' },
  { icon: '🎯', label: 'Simulados', href: '/dashboard/simulados' },
  { icon: '💎', label: 'Planos', href: '/dashboard/planos' },
  { icon: '🎓', label: 'Vestibular/Concurso', href: '/dashboard/vestibular' },
  { icon: '📈', label: 'Desempenho', href: '/dashboard/desempenho' },
  { icon: '📒', label: 'Anotações', href: '/dashboard/anotacoes' },
  { icon: '👥', label: 'Comunidade', href: '/dashboard/comunidade' },
  { icon: '🔔', label: 'Novidades', href: '/dashboard/novidades' },
  { icon: '🤖', label: 'Assistente IA', href: '/dashboard/assistente' },
  ];

export default function Sidebar() {
    const pathname = usePathname();
    const supabase = createClient();
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userAvatar, setUserAvatar] = useState('');

  useEffect(() => {
        const getUser = async () => {
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                          setUserName(user.user_metadata?.full_name || user.email?.split('@')[0] || 'Estudante');
                          setUserEmail(user.email || '');
                          setUserAvatar(user.user_metadata?.avatar_url || '');
                }
        };
        getUser();
  }, []);

  const handleSignOut = async () => {
        await supabase.auth.signOut();
        window.location.href = '/login';
  };

  return (
        <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-100 shadow-sm z-30 flex flex-col">
              <div className="p-6 border-b border-gray-100">
                      <Link href="/dashboard">
                                <h1 className="text-2xl font-bold text-indigo-600">TutorIA</h1>
                                <p className="text-xs text-gray-400">Powered by Gemini AI</p>
                      </Link>
              </div>
              <nav className="flex-1 overflow-y-auto py-4">
                {navItems.map((item) => {
                    const isActive = pathname === item.href ||
                                  (item.href !== '/dashboard' && pathname.startsWith(item.href));
                    return (
                                  <Link
                                                  key={item.label}
                                                  href={item.href}
                                                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all mx-2 mb-1 ${
                                                                    isActive
                                                                      ? 'bg-indigo-50 text-indigo-700'
                                                                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                                                  }`}
                                                >
                                                <span className="text-base">{item.icon}</span>
                                    {item.label}
                                  </Link>
                                );
        })}
              </nav>
              <div className="p-4 border-t border-gray-100">
                      <div className="flex items-center gap-3 mb-3">
                        {userAvatar ? (
                      <img src={userAvatar} alt="Avatar" className="w-9 h-9 rounded-full" />
                    ) : (
                      <div className="w-9 h-9 bg-indigo-100 rounded-full flex items-center justify-center">
                                    <span className="text-indigo-600 font-semibold text-sm">
                                      {userName.charAt(0).toUpperCase()}
                                    </span>
                      </div>
                                )}
                                <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-gray-800 truncate">{userName}</p>
                                            <p className="text-xs text-gray-400 truncate">{userEmail}</p>
                                </div>
                      </div>
                      <button
                                  onClick={handleSignOut}
                                  className="w-full text-xs text-gray-500 hover:text-red-500 transition-colors py-1"
                                >
                                Sair da conta
                      </button>
              </div>
        </aside>
      );
}</aside>
