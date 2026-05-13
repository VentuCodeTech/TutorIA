'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

const navItems = [
  { icon: '🏠', label: 'Dashboard', href: '/dashboard' },
  { icon: '📚', label: 'Meus Estudos', href: '/dashboard/estudos' },
  { icon: '📝', label: 'Questões', href: '/dashboard/questoes' },
  { icon: '📊', label: 'Progresso', href: '/dashboard/progresso' },
  { icon: '🎯', label: 'Simulados', href: '/dashboard/simulados' },
  { icon: '💰', label: 'Planos', href: '/pricing' },
];

export default function Sidebar() {
  const [user, setUser] = useState<any>(null);
  const pathname = usePathname();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setUser(session.user);
    });
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  const userName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'Usuário';
  const userAvatar = user?.user_metadata?.avatar_url;

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-100 shadow-sm flex flex-col">
      <div className="p-6 border-b border-gray-100">
        <Link href="/dashboard" className="text-2xl font-bold text-indigo-600">TutorIA</Link>
        <p className="text-xs text-gray-400 mt-0.5">Powered by Claude AI</p>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item, i) => (
          <Link
            key={i}
            href={item.href}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              pathname === item.href
                ? 'bg-indigo-50 text-indigo-600'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
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
              <span className="text-sm font-semibold text-indigo-600">
                {userName.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-800 truncate">{userName}</p>
            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-500 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Sair
        </button>
      </div>
    </aside>
  );
}
