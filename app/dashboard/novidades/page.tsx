'use client';
import Sidebar from '@/components/Sidebar';

const novidades = [
  {
    id: 1,
    title: '🚀 TutorIA 2.0 - Nova Interface Lançada!',
    category: 'Atualização',
    date: '14 Mai 2026',
    description: 'Lançamos uma interface completamente redesenhada com Sidebar melhorado, novas páginas de Comunidade, Anotações, Desempenho e muito mais!',
    badge: 'Novo',
    badgeColor: 'bg-green-100 text-green-700',
  },
  {
    id: 2,
    title: '🤖 Assistente IA com Gemini 2.0 Flash',
    category: 'IA',
    date: '10 Mai 2026',
    description: 'Nosso Assistente IA agora utiliza o modelo Gemini 2.0 Flash, o mais avançado da Anthropic. Respostas mais precisas e contextuais para seus estudos!',
    badge: 'IA',
    badgeColor: 'bg-purple-100 text-purple-700',
  },
  {
    id: 3,
    title: '📊 Análise de Desempenho Avançada',
    category: 'Funcionalidade',
    date: '05 Mai 2026',
    description: 'Acompanhe seu progresso com gráficos detalhados por matéria, evolução semanal e comparação com a média dos usuários.',
    badge: 'Melhoria',
    badgeColor: 'bg-blue-100 text-blue-700',
  },
  {
    id: 4,
    title: '📒 Anotações com Armazenamento na Nuvem',
    category: 'Funcionalidade',
    date: '01 Mai 2026',
    description: 'Crie e organize suas anotações de estudo, com sincronização automática entre dispositivos.',
    badge: 'Novo',
    badgeColor: 'bg-green-100 text-green-700',
  },
  {
    id: 5,
    title: '🎓 Seletor de Vestibular/Concurso Expandido',
    category: 'Conteúdo',
    date: '25 Abr 2026',
    description: 'Adicionamos ESPM, OAB, Concursos Federais e Estaduais, Carreiras Militares e Medicina ao nosso seletor de vestibulares e concursos.',
    badge: 'Conteúdo',
    badgeColor: 'bg-yellow-100 text-yellow-700',
  },
  {
    id: 6,
    title: '👥 Comunidade de Estudantes',
    category: 'Social',
    date: '20 Abr 2026',
    description: 'Conecte-se com outros estudantes! Compartilhe dicas, tire dúvidas e celebre conquistas em nosso novo fórum de debates.',
    badge: 'Novo',
    badgeColor: 'bg-green-100 text-green-700',
  },
];

export default function NovidadesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-64 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">🔔 Novidades</h1>
            <p className="text-gray-600 mt-1">Fique por dentro de todas as atualizações e novos recursos do TutorIA</p>
          </div>

          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white mb-8">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">🚀</span>
              <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full font-medium">Mais Recente</span>
            </div>
            <h2 className="text-2xl font-bold mb-2">TutorIA 2.0 chegou!</h2>
            <p className="text-indigo-100">
              Nova interface, novos recursos, mesma missão: ajudar você a conquistar seus objetivos.
              Explore todas as novidades e aproveite ao máximo a plataforma!
            </p>
          </div>

          <div className="grid gap-4">
            {novidades.map((novidade) => (
              <div key={novidade.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`text-xs px-3 py-1 rounded-full font-medium ${novidade.badgeColor}`}>
                        {novidade.badge}
                      </span>
                      <span className="text-xs text-gray-400">{novidade.category}</span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-400">{novidade.date}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{novidade.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{novidade.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-indigo-50 rounded-2xl p-6 text-center">
            <p className="text-indigo-700 font-medium">💡 Tem uma sugestão para o TutorIA?</p>
            <p className="text-indigo-600 text-sm mt-1">Compartilhe suas ideias na Comunidade! Sua opinião é muito importante para nós.</p>
            <a href="/dashboard/comunidade" className="inline-block mt-4 bg-indigo-600 text-white px-6 py-2 rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors">
              Ir para Comunidade
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
