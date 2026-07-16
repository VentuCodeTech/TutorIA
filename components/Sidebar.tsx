'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useState, useEffect } from 'react';
import SettingsModal from './SettingsModal';

const navItems = [
  { icon: '🏠', label: 'Dashboard', href: '/dashboard' },
  { icon: '🎓', label: 'Vestibular/Concurso', href: '/dashboard/vestibular' },
  { icon: '📚', label: 'Meus Estudos', href: '/dashboard/estudos' },
  { icon: '📒', label: 'Anotações', href: '/dashboard/anotacoes' },
  { icon: '📊', label: 'Progresso', href: '/dashboard/progresso' },
  { icon: '📝', label: 'Questões', href: '/dashboard/questoes' },
  { icon: '🎯', label: 'Simulados', href: '/dashboard/simulados' },
  { icon: '🤖', label: 'Assistente IA', href: '/dashboard/assistente' },
  { icon: '📈', label: 'Desempenho', href: '/dashboard/desempenho' },
  { icon: '📅', label: 'Google Calendar', href: '/dashboard/calendario' },
  { icon: '👥', label: 'Comunidade', href: '/dashboard/comunidade' },
  { icon: '📅', label: 'Datas de Concursos', href: '/dashboard/concursos' },
  { icon: '🔔', label: 'Novidades', href: '/dashboard/novidades' },
  { icon: '💎', label: 'Planos', href: '/dashboard/planos' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const supabase = createClient();
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userAvatar, setUserAvatar] = useState('');
  const [collapsed, setCollapsed] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('sidebar_collapsed');
    if (stored === 'true') {
      setCollapsed(true);
      document.body.classList.add('sidebar-collapsed');
    }

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

  const toggleSidebar = () => {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem('sidebar_collapsed', String(next));
    if (next) {
      document.body.classList.add('sidebar-collapsed');
    } else {
      document.body.classList.remove('sidebar-collapsed');
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    globalThis.location.href = '/login';
  };

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={toggleSidebar}
        aria-label={collapsed ? 'Expandir menu' : 'Retrair menu'}
        className="fixed top-4 z-50 bg-white border border-gray-200 rounded-full w-8 h-8 flex items-center justify-center shadow-md hover:bg-indigo-50 hover:border-indigo-300 transition-all duration-300"
        style={{ left: collapsed ? '8px' : '248px' }}
      >
        <span className="text-gray-600 text-sm font-bold leading-none select-none">
          {collapsed ? '›' : '‹'}
        </span>
      </button>

      <aside
        className="fixed left-0 top-0 bottom-0 bg-white border-r border-gray-100 shadow-sm z-30 flex flex-col overflow-hidden transition-all duration-300"
        style={{ width: collapsed ? '0px' : '256px' }}
      >
        <div className="p-6 border-b border-gray-100 flex-shrink-0">
          <Link href="/dashboard">
            <img src="/tirei10-header-logo.png" alt="Tirei10" className="h-9 w-auto" />
            <p className="text-xs text-gray-400 whitespace-nowrap">Powered by Claude AI</p>
          </Link>
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== '/dashboard' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all mx-2 mb-1 whitespace-nowrap ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                }`}
              >
                <span className="text-base flex-shrink-0">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-3 mb-3">
            {userAvatar ? (
              <img src={userAvatar} alt="Avatar" className="w-9 h-9 rounded-full flex-shrink-0" />
            ) : (
              <div className="w-9 h-9 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-indigo-600 font-semibold text-sm">
                  {userName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">{userName}</p>
              <p className="text-xs text-gray-400 truncate">{userEmail}</p>
            </div>
            {/* Gear / Settings button */}
            <button
              onClick={() => setShowSettings(true)}
              title="Configurações"
              className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full text-xs text-gray-500 hover:text-red-500 transition-colors py-1"
          >
            Sair da conta
          </button>
        </div>
      </aside>

      {/* Settings Modal */}
      {showSettings && (
        <SettingsModal
          onClose={() => setShowSettings(false)}
          userName={userName}
          userEmail={userEmail}
          userAvatar={userAvatar}
          onAvatarChange={(url) => setUserAvatar(url)}
          onNameChange={(name) => setUserName(name)}
        />
      )}
    </>
  );
}
