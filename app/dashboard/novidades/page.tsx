export default function NoviciadesPage() {
  const novidades = [
    {
      id: 1,
      data: '14 Mai 2025',
      titulo: '🆕 Novos Módulos de Questões Disponíveis!',
      descricao: 'Adicionamos mais de 500 novas questões comentadas para ENEM, FUVEST e concursos públicos. Confira na seção de Questões!',
      categoria: 'Conteúdo',
      categoriaColor: 'bg-blue-100 text-blue-700',
      novo: true,
    },
    {
      id: 2,
      data: '12 Mai 2025',
      titulo: '🤖 Assistente IA Aprimorado',
      descricao: 'Nosso assistente de IA agora conta com explicações mais detalhadas e pode criar planos de estudo personalizados baseados no seu desempenho.',
      categoria: 'IA',
      categoriaColor: 'bg-purple-100 text-purple-700',
      novo: true,
    },
    {
      id: 3,
      data: '10 Mai 2025',
      titulo: '📊 Nova Página de Desempenho',
      descricao: 'Visualize seu progresso com gráficos detalhados, análise por matéria e conquistas. Acesse pelo menu lateral!',
      categoria: 'Funcionalidade',
      categoriaColor: 'bg-green-100 text-green-700',
      novo: false,
    },
    {
      id: 4,
      data: '08 Mai 2025',
      titulo: '💬 Comunidade de Estudantes Lançada!',
      descricao: 'Agora você pode interagir com outros estudantes, compartilhar dicas, tirar dúvidas e participar de grupos de estudo no nosso fórum.',
      categoria: 'Social',
      categoriaColor: 'bg-yellow-100 text-yellow-700',
      novo: false,
    },
    {
      id: 5,
      data: '05 Mai 2025',
      titulo: '🎯 Seletor de Vestibular/Concurso',
      descricao: 'Personalize sua experiência selecionando o vestibular ou concurso que você está preparando. O sistema adapta o conteúdo para seu objetivo!',
      categoria: 'Personalização',
      categoriaColor: 'bg-indigo-100 text-indigo-700',
      novo: false,
    },
    {
      id: 6,
      data: '01 Mai 2025',
      titulo: '📓 Sistema de Anotações com Sincronização',
      descricao: 'Crie e organize suas anotações de estudo. Tudo é salvo automaticamente e sincronizado com sua conta.',
      categoria: 'Funcionalidade',
      categoriaColor: 'bg-green-100 text-green-700',
      novo: false,
    },
  ]

  const proximas = [
    { titulo: 'Flashcards Interativos', previsao: 'Jun 2025', icon: '🃏' },
    { titulo: 'Videoaulas Parceiras', previsao: 'Jul 2025', icon: '🎥' },
    { titulo: 'Modo Offline', previsao: 'Ago 2025', icon: '📴' },
    { titulo: 'App Mobile iOS/Android', previsao: 'Set 2025', icon: '📱' },
  ]

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">🆕 Novidades</h1>
        <p className="text-gray-500 mt-1">Últimas atualizações e melhorias da plataforma</p>
      </div>

      {/* Atualizações */}
      <div className="space-y-4 mb-10">
        {novidades.map((n) => (
          <div key={n.id} className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-sm transition-shadow">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${n.categoriaColor}`}>
                    {n.categoria}
                  </span>
                  {n.novo && (
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-red-100 text-red-600 animate-pulse">
                      NOVO
                    </span>
                  )}
                </div>
                <h3 className="font-semibold text-gray-900 text-lg">{n.titulo}</h3>
                <p className="text-gray-600 text-sm mt-1.5 leading-relaxed">{n.descricao}</p>
              </div>
              <span className="text-xs text-gray-400 flex-shrink-0 mt-1">{n.data}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Em breve */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100 p-6">
        <h2 className="font-semibold text-gray-900 mb-4">🚀 Em Breve</h2>
        <div className="grid grid-cols-2 gap-3">
          {proximas.map((p) => (
            <div key={p.titulo} className="bg-white/70 backdrop-blur rounded-xl p-4 border border-white">
              <div className="text-2xl mb-1">{p.icon}</div>
              <div className="font-medium text-gray-900 text-sm">{p.titulo}</div>
              <div className="text-xs text-indigo-600 mt-1">📅 Previsão: {p.previsao}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
