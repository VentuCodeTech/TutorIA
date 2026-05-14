'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'

interface SidebarProps {
  user?: {
    name: string
    email: string
    avatar?: string
  }
}

const navItems = [
  { href: '/dashboard', label: '🏠 Dashboard', exact: true },
  { href: '/dashboard/estudos', label: '📚 Meus Estudos' },
  { href: '/dashboard/vestibular', label: '🎯 Vestibular/Concurso' },
  { href: '/dashboard/questoes', label: '📝 Questões' },
  { href: '/dashboard/simulados', label: '📋 Simulados' },
  { href: '/dashboard/progresso', label: '📊 Progresso' },
  { href: '/dashboard/desempenho', label: '📈 Desempenho' },
  { href: '/dashboard/anotacoes', label: '📓 Anotações' },
  { href: '/dashboard/assistente', label: '🤖 Assistente IA' },
  { href: '/dashboard/comunidade', label: '💬 Comunidade' },
  { href: '/dashboard/novidades', label: '🆕 Novidades' },
  { href: '/dashboard/planos', label: '💰 Planos' },
]

export default function Sidebar({ user }: SidebarProps = {}) {
  const pathname = usePathname()

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-100">
        <h1 className="text-2xl font-bold text-indigo-600">TutorIA</h1>
        <p className="text-xs text-gray-400 mt-1">Powered by Claude AI</p>
      </div>

      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all mb-1 ${
                isActive
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-gray-100">
        {user && (
          <div className="flex items-center gap-3 mb-3">
            {user.avatar ? (
              <Image
                src={user.avatar}
                alt={user.name}
                width={36}
                height={36}
                className="rounded-full"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold text-sm">
                {user.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
            )}
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
              <p className="text-xs text-gray-400 truncate">{user.email}</p>
            </div>
          </div>
        )}
        <a
          href="/api/auth/signout"
          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Sair
        </a>
      </div>
    </aside>
  );
}
