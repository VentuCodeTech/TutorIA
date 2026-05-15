import Link from 'next/link';
import Chatbot from '@/components/Chatbot';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-indigo-600">
            TutorIA
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-gray-600 hover:text-indigo-600 font-medium transition-colors text-sm"
            >
              Login
            </Link>
            <Link
              href="/pricing"
              className="text-gray-600 hover:text-indigo-600 font-medium transition-colors text-sm"
            >
              Preços
            </Link>
            <Link
              href="/login"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Começar Grátis
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-24 pb-16">
        <section className="max-w-7xl mx-auto px-6 py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
            Powered by Gemini AI • 2.0 Flash
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6 leading-tight">
            Estude com{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              IA Adaptativa
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Prepare-se para ENEM, OAB, Concursos Públicos e CPA-20 com a inteligência artificial mais avançada do mercado.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/login"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl text-lg font-bold transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              Começar Gratuitamente →
            </Link>
            <Link
              href="/pricing"
              className="border-2 border-indigo-200 hover:border-indigo-400 text-indigo-700 px-8 py-4 rounded-2xl text-lg font-semibold transition-all duration-200 hover:bg-indigo-50"
            >
              Ver Planos
            </Link>
          </div>
        </section>

        {/* Features */}
        <section className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '🧠',
                title: 'IA Inteligente',
                desc: 'Assistente powered by Gemini AI que aprende com seu estilo de estudo e se adapta às suas necessidades.'
              },
              {
                icon: '📊',
                title: 'Progresso em Tempo Real',
                desc: 'Acompanhe sua evolução com métricas detalhadas, relatórios de desempenho e metas personalizadas.'
              },
              {
                icon: '🎯',
                title: 'Foco no Resultado',
                desc: 'Simulados, questões e planos de estudo otimizados para maximizar suas chances de aprovação.'
              }
            ].map((feature, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Stats */}
        <section className="max-w-7xl mx-auto px-6 py-12">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 md:p-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
              {[
                { number: '50K+', label: 'Alunos Ativos' },
                { number: '95%', label: 'Taxa de Aprovação' },
                { number: '1000+', label: 'Questões Diárias' },
                { number: '24/7', label: 'Disponível' }
              ].map((stat, i) => (
                <div key={i}>
                  <div className="text-3xl md:text-4xl font-extrabold mb-1">{stat.number}</div>
                  <div className="text-indigo-200 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">TutorIA</h2>
              <p className="text-gray-400 text-sm">Plataforma de Estudos com IA Adaptativa</p>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/pricing"
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Preços
              </Link>
              {/* Botão Login aprimorado com caixa transparente */}
              <Link
                href="/login"
                className="relative px-6 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 group"
              >
                <span className="absolute inset-0 rounded-xl border-2 border-white/30 group-hover:border-white/60 transition-all duration-300 bg-white/5 group-hover:bg-white/10 backdrop-blur-sm"></span>
                <span className="relative text-white group-hover:text-indigo-300 transition-colors">
                  Login
                </span>
              </Link>
              <Link
                href="/login"
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
              >
                Começar Grátis
              </Link>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-xs">
              © 2026 TutorIA - VentuCodeTech. Todos os direitos reservados.
            </p>
            <p className="text-gray-600 text-xs">
              Powered by Gemini AI (Google)
            </p>
          </div>
        </div>
      </footer>

      <Chatbot />
    </div>
  );
}
