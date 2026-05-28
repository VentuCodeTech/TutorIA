'use client'
import Link from 'next/link';
import CookieConsent from '@/components/CookieConsent';
import { useEffect, useRef, useState } from 'react';

// Color palette
// Primary: #6D28D9 (Roxo Violeta)
// Title: #5B21B6 (Roxo Profundo)
// Background: #F5F3FF (Lavanda Claro)
// Text: #111827 (Cinza quase preto)
// Secondary: #0E7490 (Azul Ciano)
// Success: #22C55E (Verde)
// Alert: #F59E0B (Âmbar)
// White: #FFFFFF

function AnimatedCounter({ target, suffix = '', duration = 2000 }: { target: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
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
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress >= 1) clearInterval(interval);
    }, 16);
    return () => clearInterval(interval);
  }, [started, target, duration]);
  return <div ref={ref}>{count.toLocaleString('pt-BR')}{suffix}</div>;
}

function BarChart() {
  const [anim, setAnim] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setAnim(true); obs.disconnect(); }
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  const bars = [
    { label: 'Jan', value: 42 },
    { label: 'Fev', value: 58 },
    { label: 'Mar', value: 71 },
    { label: 'Abr', value: 65 },
    { label: 'Mai', value: 83 },
    { label: 'Jun', value: 91 },
  ];
  return (
    <div ref={ref} className="flex items-end gap-2 h-28 px-1">
      {bars.map((bar, i) => (
        <div key={i} className="flex flex-col items-center gap-1 flex-1">
          <span className="text-xs font-bold" style={{ color: '#6D28D9' }}>{bar.value}%</span>
          <div className="w-full rounded-t-md transition-all duration-700 ease-out" style={{ height: anim ? bar.value + '%' : '0%', background: 'linear-gradient(to top, #5B21B6, #9333ea)', transitionDelay: (i * 80) + 'ms' }} />
          <span className="text-xs" style={{ color: '#9ca3af' }}>{bar.label}</span>
        </div>
      ))}
    </div>
  );
}

function MateriasChart() {
  const [anim, setAnim] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setAnim(true); obs.disconnect(); }
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  const materias = [
    { name: 'Matemática', pct: 92 },
    { name: 'Português', pct: 85 },
    { name: 'Biologia', pct: 78 },
    { name: 'História', pct: 70 },
  ];
  return (
    <div ref={ref} className="space-y-4">
      {materias.map((m, i) => (
        <div key={i}>
          <div className="flex justify-between text-xs mb-1.5">
            <span style={{ color: '#111827' }} className="font-medium">{m.name}</span>
            <span style={{ color: '#6D28D9' }} className="font-bold">{m.pct}%</span>
          </div>
          <div className="w-full rounded-full h-2" style={{ background: '#E9D5FF' }}>
            <div className="h-2 rounded-full transition-all duration-1000 ease-out" style={{ width: anim ? m.pct + '%' : '0%', background: 'linear-gradient(90deg, #5B21B6, #9333ea)', transitionDelay: (i * 150) + 'ms' }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen" style={{ background: '#FFFFFF' }}>
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-white border-b" style={{ borderColor: '#E9D5FF', boxShadow: '0 1px 12px rgba(109,40,217,0.08)' }}>
        <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/tirei10-header-logo.png" alt="Tirei10" className="h-9 w-auto" />
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link href="#recursos" className="text-sm font-medium transition-colors hover:opacity-70" style={{ color: '#111827' }}>Recursos</Link>
            <Link href="#como-funciona" className="text-sm font-medium transition-colors hover:opacity-70" style={{ color: '#111827' }}>Como Funciona</Link>
            <Link href="/pricing" className="text-sm font-medium transition-colors hover:opacity-70" style={{ color: '#111827' }}>Preços</Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="font-medium transition-colors text-sm" style={{ color: '#6b7280' }}>Login</Link>
            <Link href="/login" className="text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 shadow-md hover:-translate-y-0.5" style={{ background: 'linear-gradient(135deg, #6D28D9, #9333ea)' }}>Começar Grátis</Link>
          </div>
        </div>
      </nav>

      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative overflow-hidden" style={{ background: 'linear-gradient(160deg, #FFFFFF 0%, #F5F3FF 50%, #EDE9FE 100%)' }}>
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-16 left-8 w-96 h-96 rounded-full blur-3xl" style={{ background: 'radial-gradient(circle, rgba(196,181,253,0.35), transparent)' }} />
            <div className="absolute top-8 right-8 w-72 h-72 rounded-full blur-3xl" style={{ background: 'radial-gradient(circle, rgba(167,139,250,0.25), transparent)' }} />
            <div className="absolute bottom-0 left-1/2 w-full h-40 blur-2xl opacity-30" style={{ background: 'radial-gradient(ellipse at center, #DDD6FE, transparent)' }} />
          </div>
          <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 md:py-32">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left side */}
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-8 border" style={{ background: 'rgba(109,40,217,0.06)', borderColor: 'rgba(109,40,217,0.2)', color: '#6D28D9' }}>
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#6D28D9' }}></span>
                  Powered by Gemini AI 2.0 Flash
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight" style={{ color: '#111827' }}>
                  Estude com{' '}
                  <span style={{ background: 'linear-gradient(135deg, #6D28D9, #0E7490)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                    Inteligência Artificial
                  </span>
                  {' '}e tire{' '}
                  <span style={{ color: '#6D28D9' }}>10</span>
                </h1>
                <p className="text-lg md:text-xl mb-8 leading-relaxed" style={{ color: '#6b7280' }}>
                  Prepare-se para ENEM, OAB, Concursos Públicos e CPA-20 com IA que aprende com você, adapta o conteúdo e maximiza sua aprovação.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 mb-10">
                  <Link href="/login" className="inline-flex items-center justify-center text-white px-8 py-4 rounded-2xl text-base font-bold transition-all duration-300 shadow-lg hover:-translate-y-1" style={{ background: 'linear-gradient(135deg, #6D28D9, #9333ea)' }}>
                    🚀 Começar Gratuitamente
                  </Link>
                  <Link href="/pricing" className="inline-flex items-center justify-center px-8 py-4 rounded-2xl text-base font-semibold transition-all duration-300 border hover:-translate-y-0.5" style={{ borderColor: '#C4B5FD', color: '#6D28D9', background: 'rgba(167,139,250,0.07)' }}>
                    Ver Planos →
                  </Link>
                </div>
                <div className="flex flex-wrap items-center gap-6 text-sm" style={{ color: '#6b7280' }}>
                  <div className="flex items-center gap-2">
                    <span style={{ color: '#22C55E' }}>✓</span> Sem cartão de crédito
                  </div>
                  <div className="flex items-center gap-2">
                    <span style={{ color: '#22C55E' }}>✓</span> Acesso imediato
                  </div>
                  <div className="flex items-center gap-2">
                    <span style={{ color: '#22C55E' }}>✓</span> Cancele quando quiser
                  </div>
                </div>
              </div>
              {/* Right side - App preview */}
              <div className="relative">
                <div className="relative mx-auto max-w-sm">
                  <div className="absolute -inset-4 rounded-3xl blur-2xl opacity-30" style={{ background: 'linear-gradient(135deg, #6D28D9, #0E7490)' }} />
                  <div className="relative bg-white rounded-2xl shadow-2xl p-6 border" style={{ border: '1px solid #E9D5FF' }}>
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #6D28D9, #9333ea)' }}>
                        <span className="text-white text-sm">🤖</span>
                      </div>
                      <div>
                        <div className="text-xs font-bold" style={{ color: '#111827' }}>Assistente IA Tirei10</div>
                        <div className="text-xs" style={{ color: '#22C55E' }}>● Online agora</div>
                      </div>
                    </div>
                    <div className="space-y-3 mb-4">
                      <div className="rounded-xl p-3 text-sm" style={{ background: '#F5F3FF', color: '#111827' }}>
                        Explique para mim a Lei de Newton de forma simples 🎯
                      </div>
                      <div className="rounded-xl p-3 text-sm" style={{ background: 'linear-gradient(135deg, #6D28D9, #9333ea)', color: 'white' }}>
                        Claro! A 1ª Lei de Newton diz que um corpo em repouso tende a permanecer em repouso, e um corpo em movimento tende a continuar em movimento...
                      </div>
                    </div>
                    <div className="rounded-xl p-3 text-center text-xs font-semibold" style={{ background: '#F0FDF4', color: '#22C55E', border: '1px solid #DCFCE7' }}>
                      ✅ Questão respondida com sucesso! +10 pontos
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section style={{ background: 'linear-gradient(135deg, #5B21B6, #6D28D9, #0E7490)' }}>
          <div className="max-w-5xl mx-auto px-6 py-14">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {[
                { label: 'Alunos Ativos', target: 50000, suffix: '+' },
                { label: 'Taxa de Aprovação', target: 95, suffix: '%' },
                { label: 'Questões Disponíveis', target: 1000, suffix: '+' },
                { label: 'Disponível', target: 24, suffix: '/7' },
              ].map((stat, i) => (
                <div key={i} className="p-4">
                  <div className="text-3xl md:text-4xl font-extrabold text-white mb-1">
                    <AnimatedCounter target={stat.target} suffix={stat.suffix} />
                  </div>
                  <div className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#DDD6FE' }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="recursos" className="py-24" style={{ background: '#FFFFFF' }}>
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4" style={{ background: '#F5F3FF', color: '#6D28D9' }}>Recursos</span>
              <h2 className="text-3xl md:text-4xl font-extrabold mb-4" style={{ color: '#111827' }}>Tudo que você precisa para passar</h2>
              <p className="max-w-xl mx-auto" style={{ color: '#6b7280' }}>Ferramentas inteligentes desenvolvidas para maximizar sua aprovação</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: '🤖', bg: '#F5F3FF', iconBg: '#6D28D9', title: 'IA Adaptativa', desc: 'Nosso assistente powered by Gemini AI aprende com seu estilo de estudo e adapta o conteúdo às suas necessidades específicas.' },
                { icon: '📊', bg: '#F0FDFF', iconBg: '#0E7490', title: 'Analytics em Tempo Real', desc: 'Acompanhe seu progresso com métricas detalhadas, relatórios personalizados e insights gerados por inteligência artificial.' },
                { icon: '🎯', bg: '#F0FDF4', iconBg: '#16a34a', title: 'Foco no Resultado', desc: 'Simulados cronometrados, questões adaptativas e planos de estudo otimizados para maximizar suas chances de aprovação.' },
              ].map((feature, i) => (
                <div key={i} className="rounded-2xl p-8 border hover:-translate-y-2 transition-all duration-300 group cursor-default" style={{ background: feature.bg, borderColor: '#E9D5FF', boxShadow: '0 2px 16px rgba(109,40,217,0.06)' }}>
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl mb-5 shadow-sm" style={{ background: feature.iconBg }}>{feature.icon}</div>
                  <h3 className="text-lg font-bold mb-3" style={{ color: '#111827' }}>{feature.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#6b7280' }}>{feature.desc}</p>
                  <div className="mt-6 h-0.5 rounded-full w-0 group-hover:w-full transition-all duration-500" style={{ background: 'linear-gradient(90deg, #6D28D9, #0E7490)' }} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Dashboard Preview / Analytics */}
        <section className="py-24" style={{ background: '#F5F3FF' }}>
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4" style={{ background: '#EDE9FE', color: '#6D28D9' }}>Analytics em Tempo Real</span>
              <h2 className="text-3xl md:text-4xl font-extrabold mb-4" style={{ color: '#111827' }}>Acompanhe cada passo da sua evolução</h2>
              <p className="max-w-xl mx-auto" style={{ color: '#6b7280' }}>Dashboards com gráficos e insights personalizados pela IA para guiar seus estudos</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-2xl p-6 border hover:-translate-y-1 transition-all duration-300" style={{ background: 'white', borderColor: '#EDE9FE', boxShadow: '0 4px 20px rgba(109,40,217,0.06)' }}>
                <div className="flex items-center justify-between mb-5">
                  <div><h3 className="font-bold text-sm" style={{ color: '#111827' }}>Evolução de Acertos</h3><p className="text-xs mt-0.5" style={{ color: '#9ca3af' }}>Últimos 6 meses</p></div>
                  <span className="text-xs px-2.5 py-1 rounded-full font-bold" style={{ background: '#DCFCE7', color: '#16a34a' }}>+49%</span>
                </div>
                <BarChart />
              </div>
              <div className="rounded-2xl p-6 border hover:-translate-y-1 transition-all duration-300" style={{ background: 'white', borderColor: '#EDE9FE', boxShadow: '0 4px 20px rgba(109,40,217,0.06)' }}>
                <div className="flex items-center justify-between mb-5">
                  <div><h3 className="font-bold text-sm" style={{ color: '#111827' }}>Progresso Mensal</h3><p className="text-xs mt-0.5" style={{ color: '#9ca3af' }}>Meta: 95%</p></div>
                  <span className="text-xs px-2.5 py-1 rounded-full font-bold" style={{ background: '#F5F3FF', color: '#6D28D9' }}>On track</span>
                </div>
                <div className="space-y-2">
                  {[20, 38, 55, 70, 82, 91, 95].map((v, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="text-xs w-7 font-medium" style={{ color: '#9ca3af' }}>{['Jan','Fev','Mar','Abr','Mai','Jun','Jul'][i]}</div>
                      <div className="flex-1 rounded-full h-1.5" style={{ background: '#EDE9FE' }}><div className="h-1.5 rounded-full" style={{ width: v + '%', background: 'linear-gradient(90deg, #6D28D9, #0E7490)' }} /></div>
                      <div className="text-xs font-bold w-7 text-right" style={{ color: '#6D28D9' }}>{v}%</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl p-6 border hover:-translate-y-1 transition-all duration-300" style={{ background: 'white', borderColor: '#EDE9FE', boxShadow: '0 4px 20px rgba(109,40,217,0.06)' }}>
                <div className="mb-5"><h3 className="font-bold text-sm" style={{ color: '#111827' }}>Matérias em Destaque</h3><p className="text-xs mt-0.5" style={{ color: '#9ca3af' }}>Taxa de acerto por disciplina</p></div>
                <MateriasChart />
              </div>
            </div>
          </div>
        </section>

        {/* Exams Section */}
        <section className="py-20" style={{ background: '#FFFFFF' }}>
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-12">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4" style={{ background: '#F5F3FF', color: '#6D28D9' }}>Provas e Concursos</span>
              <h2 className="text-2xl md:text-3xl font-extrabold mb-2" style={{ color: '#111827' }}>Para qual prova você está se preparando?</h2>
              <p className="text-sm" style={{ color: '#9ca3af' }}>Conteúdo 100% alinhado com as bancas mais exigentes do Brasil</p>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {['ENEM', 'FUVEST', 'UNICAMP', 'OAB', 'CPA-20', 'Concursos Federais', 'Carreiras Militares', 'Vestibular Medicina'].map((exam, i) => (
                <span key={i} className="font-semibold px-5 py-2.5 rounded-full text-sm transition-all cursor-default hover:-translate-y-0.5 duration-200 border" style={{ background: 'white', borderColor: '#DDD6FE', color: '#5B21B6', boxShadow: '0 2px 8px rgba(109,40,217,0.08)' }}>{exam}</span>
              ))}
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section id="como-funciona" className="py-24" style={{ background: 'linear-gradient(160deg, #F5F3FF 0%, #EDE9FE 100%)' }}>
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4" style={{ background: '#DDD6FE', color: '#5B21B6' }}>Como Funciona</span>
              <h2 className="text-3xl md:text-4xl font-extrabold mb-4" style={{ color: '#111827' }}>Simples. Rápido. Eficaz.</h2>
              <p style={{ color: '#6b7280' }}>Comece em minutos e sinta a diferença desde a primeira sessão de estudos</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { step: '01', icon: '📝', title: 'Crie sua conta', desc: 'Cadastre-se gratuitamente em segundos. Sem cartão de crédito necessário. Faça login com o Google em um clique.' },
                { step: '02', icon: '🤖', title: 'A IA te conhece', desc: 'Responda uma breve entrevista de perfil e nossa IA analisa seu nível, criando um plano de estudo completamente personalizado.' },
                { step: '03', icon: '🏆', title: 'Tire 10!', desc: 'Pratique com questões inteligentes e simulados cronometrados. Receba feedback instantâneo e alcance a aprovação!' },
              ].map((item, i) => (
                <div key={i} className="text-center">
                  <div className="rounded-2xl p-8 border bg-white hover:-translate-y-1 transition-all duration-200" style={{ borderColor: '#EDE9FE', boxShadow: '0 4px 24px rgba(109,40,217,0.07)' }}>
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl text-3xl mb-5 shadow-md" style={{ background: 'linear-gradient(135deg, #6D28D9, #0E7490)' }}>{item.icon}</div>
                    <div className="text-xs font-bold mb-2 tracking-widest uppercase" style={{ color: '#C4B5FD' }}>Passo {item.step}</div>
                    <h3 className="text-lg font-bold mb-3" style={{ color: '#111827' }}>{item.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: '#6b7280' }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials/Social proof */}
        <section className="py-20" style={{ background: '#FFFFFF' }}>
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4" style={{ background: '#F5F3FF', color: '#6D28D9' }}>Resultados Reais</span>
              <h2 className="text-3xl font-extrabold mb-4" style={{ color: '#111827' }}>Alunos que já transformaram seus resultados</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { name: 'Ana S.', role: 'Aprovada no ENEM', text: 'A IA adaptativa me ajudou a focar exatamente nas matérias que eu precisava. Melhorei 180 pontos na redação!', stars: 5, color: '#F5F3FF' },
                { name: 'Carlos M.', role: 'Aprovado em Concurso Federal', text: 'Os simulados do Tirei10 são incríveis. A análise pós-prova me mostrou exatamente onde estava errando.', stars: 5, color: '#F0FDFF' },
                { name: 'Bruna L.', role: 'Aprovada na OAB', text: 'Em 3 meses de uso consistente, minha taxa de acerto foi de 45% para 82%. O assistente IA é incrível!', stars: 5, color: '#F0FDF4' },
              ].map((t, i) => (
                <div key={i} className="rounded-2xl p-6 border" style={{ background: t.color, borderColor: '#EDE9FE' }}>
                  <div className="flex gap-1 mb-3">
                    {[...Array(t.stars)].map((_, s) => <span key={s} style={{ color: '#F59E0B' }}>★</span>)}
                  </div>
                  <p className="text-sm leading-relaxed mb-4" style={{ color: '#374151' }}>"{t.text}"</p>
                  <div>
                    <div className="font-bold text-sm" style={{ color: '#111827' }}>{t.name}</div>
                    <div className="text-xs" style={{ color: '#6D28D9' }}>{t.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24" style={{ background: '#FFFFFF' }}>
          <div className="max-w-4xl mx-auto px-6 text-center">
            <div className="rounded-3xl p-12 md:p-16 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #5B21B6, #6D28D9, #0E7490)', boxShadow: '0 20px 60px rgba(109,40,217,0.3)' }}>
              <div className="absolute top-0 right-0 w-72 h-72 rounded-full blur-3xl opacity-20 pointer-events-none" style={{ background: 'radial-gradient(circle, #C4B5FD, transparent)' }} />
              <div className="relative z-10">
                <div className="flex justify-center mb-6">
                  <img src="/tirei10-logo.png" alt="Tirei10" className="h-14 w-auto" style={{ filter: 'brightness(0) invert(1) opacity(0.9)' }} />
                </div>
                <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">Comece agora e <span style={{ color: '#DDD6FE' }}>tire 10</span> na sua prova</h2>
                <p className="text-lg mb-8 max-w-xl mx-auto" style={{ color: '#EDE9FE' }}>Mais de 50 mil alunos já aprovados. Acesso gratuito, sem cartão de crédito.</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/login" className="inline-flex items-center justify-center bg-white px-10 py-4 rounded-2xl text-base font-bold transition-all duration-200 shadow-xl hover:-translate-y-1" style={{ color: '#6D28D9' }}>Começar Gratuitamente 🚀</Link>
                  <Link href="/pricing" className="inline-flex items-center justify-center px-10 py-4 rounded-2xl text-base font-semibold transition-all duration-200 border hover:-translate-y-0.5" style={{ borderColor: 'rgba(255,255,255,0.35)', color: 'white', background: 'rgba(255,255,255,0.1)' }}>Ver Planos</Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12" style={{ background: '#0a0a0a', borderTop: '1px solid rgba(139,92,246,0.2)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
            <div className="col-span-1 md:col-span-2">
              <img src="/tirei10-logo-white.png" alt="Tirei10" className="h-8 w-auto mb-3" />
              <p className="text-sm max-w-xs" style={{ color: '#475569' }}>Plataforma de estudos com IA adaptativa para ENEM, OAB, Concursos Públicos e CPA-20.</p>
            </div>
            <div>
              <h4 className="text-sm font-bold mb-4" style={{ color: '#a78bfa' }}>Plataforma</h4>
              <div className="flex flex-col gap-2 text-sm" style={{ color: '#475569' }}>
                <Link href="/login" className="hover:text-purple-400 transition-colors">Acessar Plataforma</Link>
                <Link href="/pricing" className="hover:text-purple-400 transition-colors">Planos e Preços</Link>
                <Link href="/suporte" className="hover:text-purple-400 transition-colors">Central de Suporte</Link>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-bold mb-4" style={{ color: '#a78bfa' }}>Institucional</h4>
              <div className="flex flex-col gap-2 text-sm" style={{ color: '#475569' }}>
                <Link href="/politicas" className="hover:text-purple-400 transition-colors">Políticas da Comunidade</Link>
                <Link href="/pagamentos" className="hover:text-purple-400 transition-colors">Meios de Pagamento</Link>
              </div>
            </div>
          </div>
          <div className="pt-8 text-center text-sm" style={{ borderTop: '1px solid rgba(139,92,246,0.15)', color: '#334155' }}>
            <p>© 2026 Tirei10. Todos os direitos reservados</p>
          </div>
        </div>
      </footer>
      <CookieConsent />
    </div>
  );
          }
