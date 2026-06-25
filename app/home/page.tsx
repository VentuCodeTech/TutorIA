import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-indigo-600">Tirei10</Link>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors text-sm">Login</Link>
            <Link href="/pricing" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors text-sm">Preços</Link>
            <Link href="/login" className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200">Começar Grátis</Link>
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
              Bem-vindo ao <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Tirei10</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              A plataforma de estudos com IA adaptativa mais completa do Brasil para ENEM, OAB, Concursos Públicos e CPA-20.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="bg-white rounded-2xl p-8 shadow-md border border-gray-100">
              <div className="text-4xl mb-4">🎓</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">O que é o Tirei10?</h2>
              <p className="text-gray-600 leading-relaxed">
                O Tirei10 é uma plataforma educacional que utiliza inteligência artificial (Claude AI) para criar uma experiência de estudo personalizada. 
                Oferecemos questões adaptativas, simulados completos, assistente de IA e análise detalhada de desempenho.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-md border border-gray-100">
              <div className="text-4xl mb-4">🚀</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">Para quem é?</h2>
              <p className="text-gray-600 leading-relaxed">
                Nossa plataforma é ideal para estudantes que se preparam para o ENEM, candidatos ao exame da OAB, 
                concurseiros de concursos federais e estaduais, e profissionais que buscam a certificação CPA-20 da ANBIMA.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-md border border-gray-100 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Nossas Funcionalidades</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { icon: '❓', title: 'Questões Adaptativas', desc: 'Banco com milhares de questões reais de vestibulares e concursos' },
                { icon: '📝', title: 'Simulados Completos', desc: 'Provas completas no formato real dos exames' },
                { icon: '🤖', title: 'Assistente IA', desc: 'Tire dúvidas a qualquer hora com nosso assistente powered by Claude AI' },
                { icon: '📊', title: 'Análise de Desempenho', desc: 'Acompanhe sua evolução com métricas detalhadas' },
                { icon: '📅', title: 'Plano de Estudos', desc: 'Crie planos de estudo personalizados com IA' },
                { icon: '📓', title: 'Anotações', desc: 'Organize suas anotações sincronizadas na nuvem' },
                { icon: '🏆', title: 'Comunidade', desc: 'Conecte-se com outros estudantes e compartilhe dicas' },
                { icon: '📈', title: 'Progresso Visual', desc: 'Visualize seu progresso por matéria e tema' },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <h3 className="font-semibold text-gray-800">{item.title}</h3>
                    <p className="text-sm text-gray-600">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-3">Pronto para começar?</h2>
            <p className="text-indigo-200 mb-6">Crie sua conta gratuitamente e comece a estudar hoje mesmo!</p>
            <Link href="/login" className="bg-white text-indigo-600 px-8 py-3 rounded-xl font-bold hover:bg-indigo-50 transition-colors inline-block">
              Criar Conta Grátis →
            </Link>
          </div>
        </div>
      </main>

      <footer className="bg-gray-900 text-white py-10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-gray-400 text-sm">© 2026 Tirei10. Todos os direitos reservados.</p>
          <div className="flex justify-center gap-6 mt-4 text-sm text-gray-400">
            <Link href="/home" className="hover:text-white transition-colors">Home</Link>
            <Link href="/politicas" className="hover:text-white transition-colors">Políticas da Comunidade</Link>
            <Link href="/suporte" className="hover:text-white transition-colors">Suporte</Link>
            <Link href="/pagamentos" className="hover:text-white transition-colors">Meios de Pagamento</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
