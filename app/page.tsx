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
                      <div className="text-3xl md:text-4xl font-extrabold mb-1">{counts[0].toLocaleString('pt-BR')}+</div>div>
                      <div className="text-purple-200 text-sm">Alunos Ativos</div>div>
              </div>div>
              <div>
                      <div className="text-3xl md:text-4xl font-extrabold mb-1">{counts[1]}%</div>div>
                      <div className="text-purple-200 text-sm">Taxa de Aprovação</div>div>
              </div>div>
              <div>
                      <div className="text-3xl md:text-4xl font-extrabold mb-1">{counts[2].toLocaleString('pt-BR')}+</div>div>
                      <div className="text-purple-200 text-sm">Questões Diárias</div>div>
              </div>div>
              <div>
                      <div className="text-3xl md:text-4xl font-extrabold mb-1">24/7</div>div>
                      <div className="text-purple-200 text-sm">Disponível</div>div>
              </div>div>
        </div>div>
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
      { label: 'Jan', value: 42, color: 'bg-purple-300' },
      { label: 'Fev', value: 58, color: 'bg-purple-400' },
      { label: 'Mar', value: 71, color: 'bg-purple-500' },
      { label: 'Abr', value: 65, color: 'bg-violet-400' },
      { label: 'Mai', value: 83, color: 'bg-violet-500' },
      { label: 'Jun', value: 91, color: 'bg-violet-600' },
        ];
    return (
          <div ref={ref} className="flex items-end gap-3 h-32 px-2">
            {bars.map((bar, i) => (
                    <div key={i} className="flex flex-col items-center gap-1 flex-1">
                              <span className="text-xs font-bold text-gray-500">{bar.value}%</span>span>
                              <div
                                            className={"w-full rounded-t-lg " + bar.color + " transition-all duration-700 ease-out"}
                                            style={{ height: anim ? bar.value + "%" : "0%", transitionDelay: (i * 100) + "ms" }}
                                          />
                              <span className="text-xs text-gray-400">{bar.label}</span>span>
                    </div>div>
                  ))}
          </div>div>
        );
}

function MateriasChart() {
    const materias = [
      { name: 'Matemática', pct: 92, color: 'bg-purple-500' },
      { name: 'Português', pct: 85, color: 'bg-violet-500' },
      { name: 'Biologia', pct: 78, color: 'bg-purple-400' },
      { name: 'História', pct: 70, color: 'bg-violet-400' },
        ];
    return (
          <div className="space-y-3">
            {materias.map((m, i) => (
                    <div key={i}>
                              <div className="flex justify-between text-xs text-gray-500 mb-1">
                                          <span>{m.name}</span>span>
                                          <span className="font-medium">{m.pct}%</span>span>
                              </div>div>
                              <div className="w-full bg-gray-100 rounded-full h-2">
                                          <div className={m.color + " h-2 rounded-full"} style={{ width: m.pct + "%" }} />
                              </div>div>
                    </div>div>
                  ))}
          </div>div>
        );
}

export default function Home() {
    return (
          <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #0f0f0f 0%, #1a0a2e 30%, #16213e 60%, #0f0f0f 100%)' }}>
            {/* Navbar */}
                <nav className="fixed top-0 left-0 right-0 z-40 backdrop-blur-md border-b" style={{ background: 'rgba(15,15,15,0.85)', borderColor: 'rgba(139,92,246,0.2)' }}>
                        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
                                  <Link href="/" className="flex items-center gap-2">
                                              <img src="/tirei10-header-logo.png" alt="Tirei10" className="h-9 w-auto" />
                                  </Link>Link>
                                  <div className="flex items-center gap-4">
                                              <Link href="/login" className="text-gray-300 hover:text-purple-400 font-medium transition-colors text-sm">Login</Link>Link>
                                              <Link href="/pricing" className="text-gray-300 hover:text-purple-400 font-medium transition-colors text-sm">Preços</Link>Link>
                                              <Link href="/login" className="text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 shadow-lg hover:shadow-purple-500/30 hover:-translate-y-0.5" style={{ background: 'linear-gradient(135deg, #7c3aed, #9333ea)' }}>Começar Grátis</Link>Link>
                                  </div>div>
                        </div>div>
                </nav>nav>
          
                <main className="pt-20">
                  {/* Hero Section */}
                        <section className="max-w-7xl mx-auto px-6 py-20 text-center relative">
                          {/* Background glow effects */}
                                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none" style={{ background: 'radial-gradient(circle, #7c3aed, transparent)' }} />
                                  <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full blur-3xl opacity-10 pointer-events-none" style={{ background: 'radial-gradient(circle, #a855f7, transparent)' }} />
                                  
                                  <div className="flex justify-center mb-10 relative z-10">
                                              <img src="/tirei10-logo.png" alt="Tirei10" className="h-24 md:h-32 w-auto drop-shadow-2xl" />
                                  </div>div>
                                  
                                  <h2 className="text-2xl md:text-3xl font-bold mb-3 tracking-tight relative z-10" style={{ color: '#e2e8f0' }}>
                                              Inteligência. <span style={{ color: '#a855f7' }}>Método.</span>span> <span style={{ color: '#c084fc' }}>Resultado.</span>span>
                                  </h2>h2>
                                  <p className="text-base mb-10 relative z-10" style={{ color: '#94a3b8' }}>
                                              A plataforma completa para quem quer <strong style={{ color: '#c084fc' }}>tirar 10.</strong>strong>
                                  </p>p>
                        
                          {/* Feature pills */}
                                  <div className="flex flex-wrap justify-center gap-0 mb-12 max-w-3xl mx-auto rounded-2xl overflow-hidden relative z-10" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(139,92,246,0.3)' }}>
                                              <div className="flex items-center gap-3 px-6 py-5 flex-1 min-w-[180px]" style={{ borderRight: '1px solid rgba(139,92,246,0.2)' }}>
                                                            <span className="text-2xl">🎓</span>span>
                                                            <div className="text-left">
                                                                            <p className="text-sm font-semibold" style={{ color: '#e2e8f0' }}>Conteúdo claro</p>p>
                                                                            <p className="text-xs" style={{ color: '#94a3b8' }}>e objetivo</p>p>
                                                            </div>div>
                                              </div>div>
                                              <div className="flex items-center gap-3 px-6 py-5 flex-1 min-w-[180px]" style={{ borderRight: '1px solid rgba(139,92,246,0.2)' }}>
                                                            <span className="text-2xl">📊</span>span>
                                                            <div className="text-left">
                                                                            <p className="text-sm font-semibold" style={{ color: '#e2e8f0' }}>Tecnologia que</p>p>
                                                                            <p className="text-xs" style={{ color: '#94a3b8' }}>personaliza sua jornada</p>p>
                                                            </div>div>
                                              </div>div>
                                              <div className="flex items-center gap-3 px-6 py-5 flex-1 min-w-[180px]">
                                                            <span className="text-2xl">🎯</span>span>
                                                            <div className="text-left">
                                                                            <p className="text-sm font-semibold" style={{ color: '#e2e8f0' }}>Foco no que</p>p>
                                                                            <p className="text-xs" style={{ color: '#94a3b8' }}>importa: acertar 10.</p>p>
                                                            </div>div>
                                              </div>div>
                                  </div>div>
                        
                                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-8 relative z-10" style={{ background: 'rgba(139,92,246,0.2)', border: '1px solid rgba(139,92,246,0.4)', color: '#c084fc' }}>
                                              <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#a855f7' }}></span>span>
                                              Powered by Gemini AI • 2.0 Flash
                                  </div>div>
                        
                                  <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight relative z-10" style={{ color: '#f8fafc' }}>
                                              Estude com{' '}
                                              <span style={{ background: 'linear-gradient(135deg, #a855f7, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                                                            IA Adaptativa
                                              </span>span>
                                  </h1>h1>
                                  <p className="text-xl mb-10 max-w-2xl mx-auto relative z-10" style={{ color: '#94a3b8' }}>
                                              Prepare-se para ENEM, OAB, Concursos Públicos e CPA-20 com a inteligência artificial mais avançada do mercado.
                                  </p>p>
                                  <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
                                              <Link href="/login" className="text-white px-10 py-4 rounded-2xl text-lg font-bold transition-all duration-200 shadow-2xl hover:-translate-y-1 hover:shadow-purple-500/40" style={{ background: 'linear-gradient(135deg, #7c3aed, #9333ea)' }}>
                                                            Começar Gratuitamente →
                                              </Link>Link>
                                              <Link href="/pricing" className="px-10 py-4 rounded-2xl text-lg font-semibold transition-all duration-200 hover:-translate-y-0.5" style={{ border: '2px solid rgba(168,85,247,0.5)', color: '#c084fc', background: 'rgba(139,92,246,0.1)' }}>
                                                            Ver Planos
                                              </Link>Link>
                                  </div>div>
                        </section>section>
                
                  {/* Stats Cards Section */}
                        <section className="max-w-7xl mx-auto px-6 py-12">
                                  <div className="text-center mb-12">
                                              <h2 className="text-3xl font-bold mb-3" style={{ color: '#f1f5f9' }}>Acompanhe sua evolução em tempo real</h2>h2>
                                              <p style={{ color: '#94a3b8' }}>Gráficos de desempenho, métricas e insights personalizados pela IA</p>p>
                                  </div>div>
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                              <div className="rounded-2xl p-6 transition-all hover:-translate-y-1 duration-200" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(139,92,246,0.25)', backdropFilter: 'blur(10px)' }}>
                                                            <div className="flex items-center justify-between mb-4">
                                                                            <h3 className="font-bold text-sm" style={{ color: '#cbd5e1' }}>📈 Evolução de Acertos</h3>h3>
                                                                            <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ background: 'rgba(34,197,94,0.15)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.3)' }}>+49%</span>span>
                                                            </div>div>
                                                            <BarChart />
                                              </div>div>
                                              <div className="rounded-2xl p-6 transition-all hover:-translate-y-1 duration-200" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(139,92,246,0.25)', backdropFilter: 'blur(10px)' }}>
                                                            <div className="flex items-center justify-between mb-4">
                                                                            <h3 className="font-bold text-sm" style={{ color: '#cbd5e1' }}>🎯 Progresso Geral</h3>h3>
                                                                            <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ background: 'rgba(139,92,246,0.2)', color: '#c084fc', border: '1px solid rgba(139,92,246,0.4)' }}>95% meta</span>span>
                                                            </div>div>
                                                            <div className="space-y-2 mt-4">
                                                              {[20, 38, 55, 70, 82, 91, 95].map((v, i) => (
                              <div key={i} className="flex items-center gap-2">
                                                  <div className="text-xs w-6" style={{ color: '#64748b' }}>{['Jan','Fev','Mar','Abr','Mai','Jun','Jul'][i]}</div>div>
                                                  <div className="flex-1 rounded-full h-2" style={{ background: 'rgba(255,255,255,0.1)' }}>
                                                                        <div className="h-2 rounded-full" style={{ width: v + "%", background: 'linear-gradient(90deg, #7c3aed, #a855f7)' }} />
                                                  </div>div>
                                                  <div className="text-xs font-medium w-8" style={{ color: '#c084fc' }}>{v}%</div>div>
                              </div>div>
                            ))}
                                                            </div>div>
                                              </div>div>
                                              <div className="rounded-2xl p-6 transition-all hover:-translate-y-1 duration-200" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(139,92,246,0.25)', backdropFilter: 'blur(10px)' }}>
                                                            <h3 className="font-bold text-sm mb-4" style={{ color: '#cbd5e1' }}>🏆 Matérias em Destaque</h3>h3>
                                                            <MateriasChart />
                                              </div>div>
                                  </div>div>
                        </section>section>
                
                  {/* Features Section */}
                        <section className="max-w-7xl mx-auto px-6 py-16">
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    {[
            { icon: '🧠', title: 'IA Inteligente', desc: 'Assistente powered by Gemini AI que aprende com seu estilo de estudo e se adapta às suas necessidades.' },
            { icon: '📊', title: 'Progresso em Tempo Real', desc: 'Acompanhe sua evolução com métricas detalhadas, relatórios de desempenho e metas personalizadas.' },
            { icon: '🎯', title: 'Foco no Resultado', desc: 'Simulados, questões e planos de estudo otimizados para maximizar suas chances de aprovação.' }
                        ].map((feature, i) => (
                                        <div key={i} className="rounded-2xl p-8 transition-all hover:-translate-y-2 duration-200 group" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(139,92,246,0.25)', backdropFilter: 'blur(10px)' }}>
                                                        <div className="text-4xl mb-5">{feature.icon}</div>div>
                                                        <h3 className="text-xl font-bold mb-3" style={{ color: '#f1f5f9' }}>{feature.title}</h3>h3>
                                                        <p className="leading-relaxed" style={{ color: '#94a3b8' }}>{feature.desc}</p>p>
                                                        <div className="mt-5 h-0.5 rounded-full w-0 group-hover:w-full transition-all duration-500" style={{ background: 'linear-gradient(90deg, #7c3aed, #c084fc)' }} />
                                        </div>div>
                                      ))}
                                  </div>div>
                        </section>section>
                
                  {/* Exams Section */}
                        <section className="max-w-7xl mx-auto px-6 py-12">
                                  <div className="text-center mb-10">
                                              <h2 className="text-2xl font-bold mb-2" style={{ color: '#f1f5f9' }}>Para qual prova você está se preparando?</h2>h2>
                                              <p className="text-sm" style={{ color: '#64748b' }}>Conteúdo 100% alinhado com as bancas mais exigentes do Brasil</p>p>
                                  </div>div>
                                  <div className="flex flex-wrap justify-center gap-3">
                                    {['ENEM', 'FUVEST', 'UNICAMP', 'OAB', 'CPA-20', 'Concursos Federais', 'Carreiras Militares', 'Vestibular Medicina'].map((exam, i) => (
                          <span key={i} className="font-semibold px-5 py-2.5 rounded-full text-sm transition-all cursor-default hover:-translate-y-0.5 duration-200" style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.35)', color: '#c084fc' }}>
                            {exam}
                          </span>span>
                        ))}
                                  </div>div>
                        </section>section>
                
                  {/* Stats Banner */}
                        <section className="max-w-7xl mx-auto px-6 py-12">
                                  <div className="rounded-3xl p-10 md:p-14" style={{ background: 'linear-gradient(135deg, #4c1d95, #7c3aed, #9333ea)', boxShadow: '0 20px 60px rgba(124,58,237,0.4)' }}>
                                              <StatsSection />
                                  </div>div>
                        </section>section>
                
                  {/* CTA Section */}
                        <section className="max-w-7xl mx-auto px-6 py-12 text-center">
                                  <div className="rounded-3xl p-12 relative overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(139,92,246,0.3)', backdropFilter: 'blur(20px)' }}>
                                              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full blur-3xl opacity-15 pointer-events-none" style={{ background: 'radial-gradient(circle, #7c3aed, transparent)' }} />
                                              <div className="relative z-10">
                                                            <img src="/tirei10-logo.png" alt="Tirei10" className="h-14 w-auto mx-auto mb-6" />
                                                            <h2 className="text-3xl font-bold mb-3" style={{ color: '#f8fafc' }}>Comece agora e <span style={{ color: '#c084fc' }}>tire 10</span>span> na sua prova</h2>h2>
                                                            <p className="mb-8 max-w-xl mx-auto" style={{ color: '#94a3b8' }}>Mais de 50 mil alunos já aprovados. Teste gratuitamente por 7 dias, sem precisar de cartão de crédito.</p>p>
                                                            <Link href="/login" className="inline-block text-white px-12 py-4 rounded-2xl text-lg font-bold transition-all duration-200 shadow-2xl hover:shadow-purple-500/40 hover:-translate-y-1" style={{ background: 'linear-gradient(135deg, #7c3aed, #9333ea)' }}>
                                                                            Começar Grátis →
                                                            </Link>Link>
                                              </div>div>
                                  </div>div>
                        </section>section>
                </main>main>
          
            {/* Footer */}
                <footer className="py-12 mt-8" style={{ background: '#0a0a0a', borderTop: '1px solid rgba(139,92,246,0.2)' }}>
                        <div className="max-w-7xl mx-auto px-6">
                                  <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                                              <div>
                                                            <img src="/tirei10-logo-white.png" alt="Tirei10" className="h-8 w-auto mb-2" />
                                                            <p className="text-sm" style={{ color: '#475569' }}>Plataforma de estudos com IA adaptativa</p>p>
                                              </div>div>
                                              <div className="flex flex-wrap justify-center gap-6 text-sm" style={{ color: '#475569' }}>
                                                            <Link href="/home" className="hover:text-purple-400 transition-colors">Home</Link>Link>
                                                            <Link href="/politicas" className="hover:text-purple-400 transition-colors">Políticas</Link>Link>
                                                            <Link href="/suporte" className="hover:text-purple-400 transition-colors">Suporte</Link>Link>
                                                            <Link href="/pagamentos" className="hover:text-purple-400 transition-colors">Pagamentos</Link>Link>
                                                            <Link href="/pricing" className="hover:text-purple-400 transition-colors">Planos</Link>Link>
                                              </div>div>
                                  </div>div>
                                  <div className="mt-8 pt-8 text-center text-sm" style={{ borderTop: '1px solid rgba(139,92,246,0.15)', color: '#334155' }}>
                                              <p>© 2026 Tirei10. Todos os direitos reservados.</p>p>
                                  </div>div>
                        </div>div>
                </footer>footer>
                <CookieConsent />
          </div>div>
        );
}</div>
