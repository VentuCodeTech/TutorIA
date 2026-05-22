'use client'
import Link from 'next/link';
import CookieConsent from '@/components/CookieConsent';
import { useEffect, useRef, useState } from 'react';

function StatsSection() {
  const [counts, setCounts] = useState([0, 0, 0]);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setStarted(true); obs.disconnect(); }
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    const targets = [50000, 95, 1000];
    const duration = 2000;
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setCounts(targets.map(t => Math.floor(progress * t)));
      if (progress >= 1) clearInterval(interval);
    }, 50);
    return () => clearInterval(interval);
  }, [started]);

  return (
    <div ref={ref} className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
      <div>
        <div className="text-3xl md:text-4xl font-extrabold mb-1">{counts[0].toLocaleString('pt-BR')}+</div>
        <div className="text-indigo-200 text-sm">Alunos Ativos</div>
      </div>
      <div>
        <div className="text-3xl md:text-4xl font-extrabold mb-1">{counts[1]}%</div>
        <div className="text-indigo-200 text-sm">Taxa de Aprovação</div>
      </div>
      <div>
        <div className="text-3xl md:text-4xl font-extrabold mb-1">{counts[2].toLocaleString('pt-BR')}+</div>
        <div className="text-indigo-200 text-sm">Questões Diárias</div>
      </div>
      <div>
        <div className="text-3xl md:text-4xl font-extrabold mb-1">24/7</div>
        <div className="text-indigo-200 text-sm">Disponível</div>
      </div>
    </div>
  );
}

function BarChart() {
  const [anim, setAnim] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setAnim(true); obs.disconnect(); } }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  const bars = [
    { label: 'Jan', value: 42, color: 'bg-indigo-300' },
    { label: 'Fev', value: 58, color: 'bg-indigo-400' },
    { label: 'Mar', value: 71, color: 'bg-indigo-500' },
    { label: 'Abr', value: 65, color: 'bg-purple-400' },
    { label: 'Mai', value: 83, color: 'bg-purple-500' },
    { label: 'Jun', value: 91, color: 'bg-purple-600' },
  ];
  return (
    <div ref={ref} className="flex items-end gap-3 h-32 px-2">
      {bars.map((bar, i) => (
        <div key={i} className="flex flex-col items-center gap-1 flex-1">
          <span className="text-xs font-bold text-gray-600">{bar.value}%</span>
          <div
            className={"w-full rounded-t-lg " + bar.color + " transition-all duration-700 ease-out"}
            style={{ height: anim ? bar.value + "%" : "0%", transitionDelay: (i * 100) + "ms" }}
          />
          <span className="text-xs text-gray-400">{bar.label}</span>
        </div>
      ))}
    </div>
  );
}

function MateriasChart() {
  const materias = [
    { name: 'Matemática', pct: 92, color: 'bg-indigo-500' },
    { name: 'Português', pct: 85, color: 'bg-purple-500' },
    { name: 'Biologia', pct: 78, color: 'bg-green-500' },
    { name: 'História', pct: 70, color: 'bg-yellow-500' },
  ];
  return (
    <div className="space-y-3">
      {materias.map((m, i) => (
        <div key={i}>
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>{m.name}</span>
            <span className="font-medium">{m.pct}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div className={m.color + " h-2 rounded-full"} style={{ width: m.pct + "%" }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50">
      <nav className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/tirei10-logo.png" alt="Tirei10" className="h-9 w-auto" />
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors text-sm">Login</Link>
            <Link href="/pricing" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors text-sm">Preços</Link>
            <Link href="/login" className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow-md">Começar Grátis</Link>
          </div>
        </div>
      </nav>

      <main className="pt-20">
        <section className="max-w-7xl mx-auto px-6 py-16 text-center">
          <div className="flex justify-center mb-8">
            <img src="/tirei10-logo.png" alt="Tirei10" className="h-20 md:h-28 w-auto drop-shadow-lg" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 tracking-tight">
            Inteligência. <span className="text-indigo-600">Método.</span> <span className="text-purple-600">Resultado.</span>
          </h2>
          <p className="text-gray-500 text-base mb-8">A plataforma completa para quem quer <strong className="text-purple-600">tirar 10.</strong></p>

          <div className="flex flex-wrap justify-center gap-0 mb-10 max-w-3xl mx-auto border border-indigo-100 rounded-2xl overflow-hidden shadow-sm bg-white">
            <div className="flex items-center gap-3 px-6 py-4 flex-1 min-w-[180px] border-r border-indigo-50">
              <span className="text-2xl">🎓</span>
              <div className="text-left">
                <p className="text-sm font-semibold text-gray-800">Conteúdo claro</p>
                <p className="text-xs text-gray-400">e objetivo</p>
              </div>
            </div>
            <div className="flex items-center gap-3 px-6 py-4 flex-1 min-w-[180px] border-r border-indigo-50">
              <span className="text-2xl">📊</span>
              <div className="text-left">
                <p className="text-sm font-semibold text-gray-800">Tecnologia que</p>
                <p className="text-xs text-gray-400">personaliza sua jornada</p>
              </div>
            </div>
            <div className="flex items-center gap-3 px-6 py-4 flex-1 min-w-[180px]">
              <span className="text-2xl">🎯</span>
              <div className="text-left">
                <p className="text-sm font-semibold text-gray-800">Foco no que</p>
                <p className="text-xs text-gray-400">importa: acertar 10.</p>
              </div>
            </div>
          </div>

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
            <Link href="/login" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl text-lg font-bold transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5">
              Começar Gratuitamente →
            </Link>
            <Link href="/pricing" className="border-2 border-indigo-200 hover:border-indigo-400 text-indigo-700 px-8 py-4 rounded-2xl text-lg font-semibold transition-all duration-200 hover:bg-indigo-50">
              Ver Planos
            </Link>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Acompanhe sua evolução em tempo real</h2>
            <p className="text-gray-500">Gráficos de desempenho, métricas e insights personalizados pela IA</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-700 text-sm">📈 Evolução de Acertos</h3>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">+49%</span>
              </div>
              <BarChart />
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-700 text-sm">🎯 Progresso Geral</h3>
                <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full font-medium">95% meta</span>
              </div>
              <div className="space-y-2 mt-4">
                {[20, 38, 55, 70, 82, 91, 95].map((v, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="text-xs text-gray-400 w-6">{['Jan','Fev','Mar','Abr','Mai','Jun','Jul'][i]}</div>
                    <div className="flex-1 bg-gray-100 rounded-full h-2">
                      <div className="bg-indigo-500 h-2 rounded-full" style={{ width: v + "%" }} />
                    </div>
                    <div className="text-xs text-indigo-600 font-medium w-8">{v}%</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
              <h3 className="font-bold text-gray-700 text-sm mb-4">🏆 Matérias em Destaque</h3>
              <MateriasChart />
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: '🧠', title: 'IA Inteligente', desc: 'Assistente powered by Gemini AI que aprende com seu estilo de estudo e se adapta às suas necessidades.' },
              { icon: '📊', title: 'Progresso em Tempo Real', desc: 'Acompanhe sua evolução com métricas detalhadas, relatórios de desempenho e metas personalizadas.' },
              { icon: '🎯', title: 'Foco no Resultado', desc: 'Simulados, questões e planos de estudo otimizados para maximizar suas chances de aprovação.' }
            ].map((feature, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-all hover:-translate-y-1 duration-200">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Para qual prova você está se preparando?</h2>
            <p className="text-gray-500 text-sm">Conteúdo 100% alinhado com as bancas mais exigentes do Brasil</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {['ENEM', 'FUVEST', 'UNICAMP', 'OAB', 'CPA-20', 'Concursos Federais', 'Carreiras Militares', 'Vestibular Medicina'].map((exam, i) => (
              <span key={i} className="bg-white border border-indigo-100 text-indigo-700 font-semibold px-5 py-2.5 rounded-full text-sm shadow-sm hover:bg-indigo-50 hover:shadow-md transition-all cursor-default">
                {exam}
              </span>
            ))}
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 py-12">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 md:p-12">
            <StatsSection />
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 py-12 text-center">
          <div className="bg-white rounded-3xl p-10 shadow-md border border-gray-100">
            <img src="/tirei10-logo.png" alt="Tirei10" className="h-14 w-auto mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-800 mb-3">Comece agora e <span className="text-purple-600">tire 10</span> na sua prova</h2>
            <p className="text-gray-500 mb-6 max-w-xl mx-auto">Mais de 50 mil alunos já aprovados. Teste gratuitamente por 7 dias, sem precisar de cartão de crédito.</p>
            <Link href="/login" className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-10 py-4 rounded-2xl text-lg font-bold transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5">
              Começar Grátis →
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <img src="/tirei10-logo-white.png" alt="Tirei10" className="h-8 w-auto mb-2" />
              <p className="text-gray-400 text-sm">Plataforma de estudos com IA adaptativa</p>
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
              <Link href="/home" className="hover:text-white transition-colors">Home</Link>
              <Link href="/politicas" className="hover:text-white transition-colors">Políticas</Link>
              <Link href="/suporte" className="hover:text-white transition-colors">Suporte</Link>
              <Link href="/pagamentos" className="hover:text-white transition-colors">Pagamentos</Link>
              <Link href="/pricing" className="hover:text-white transition-colors">Planos</Link>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-sm">
            <p>© 2026 Tirei10. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
      <CookieConsent />
    </div>
  );
            }
