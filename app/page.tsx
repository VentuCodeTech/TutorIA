'use client'
import Link from 'next/link';
import CookieConsent from '@/components/CookieConsent';
import { useEffect, useRef, useState } from 'react';

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
<span className="text-xs font-bold" style={{ color: '#7c3aed' }}>{bar.value}%</span>
<div className="w-full rounded-t-md transition-all duration-700 ease-out" style={{ height: anim ? bar.value + '%' : '0%', background: 'linear-gradient(to top, #7c3aed, #a855f7)', transitionDelay: (i * 80) + 'ms' }} />
<span className="text-xs" style={{ color: '#94a3b8' }}>{bar.label}</span>
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
<span style={{ color: '#374151' }} className="font-medium">{m.name}</span>
<span style={{ color: '#7c3aed' }} className="font-bold">{m.pct}%</span>
</div>
<div className="w-full rounded-full h-2" style={{ background: '#e9d5ff' }}>
<div className="h-2 rounded-full transition-all duration-1000 ease-out" style={{ width: anim ? m.pct + '%' : '0%', background: 'linear-gradient(90deg, #7c3aed, #a855f7)', transitionDelay: (i * 150) + 'ms' }} />
</div>
</div>
))}
</div>
);
  }

export default function Home() {
return (
<div className="min-h-screen" style={{ background: '#f8f7ff' }}>
<nav className="fixed top-0 left-0 right-0 z-40 bg-white border-b" style={{ borderColor: '#e9d5ff', boxShadow: '0 1px 12px rgba(124,58,237,0.08)' }}>
<div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between">
<Link href="/" className="flex items-center gap-2">
<img src="/tirei10-header-logo.png" alt="Tirei10" className="h-9 w-auto" />
</Link>
<div className="flex items-center gap-6">
<Link href="/login" className="font-medium transition-colors text-sm" style={{ color: '#6b7280' }}>Login</Link>
<Link href="/pricing" className="font-medium transition-colors text-sm" style={{ color: '#6b7280' }}>Preços</Link>
<Link href="/login" className="text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 shadow-md hover:-translate-y-0.5" style={{ background: 'linear-gradient(135deg, #7c3aed, #9333ea)' }}>Começar Grátis</Link>
</div>
</div>
</nav>
<main className="pt-20">
<section className="relative overflow-hidden" style={{ background: 'linear-gradient(160deg, #ffffff 0%, #faf5ff 50%, #f3e8ff 100%)' }}>
<div className="absolute inset-0 pointer-events-none overflow-hidden">
<div className="absolute top-16 left-8 w-80 h-80 rounded-full blur-3xl" style={{ background: 'radial-gradient(circle, rgba(196,181,253,0.4), transparent)' }} />
<div className="absolute top-8 right-8 w-64 h-64 rounded-full blur-3xl" style={{ background: 'radial-gradient(circle, rgba(167,139,250,0.3), transparent)' }} />
</div>
<div className="relative z-10 max-w-6xl mx-auto px-6 py-20 md:py-28 text-center">
<div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-10 border" style={{ background: 'rgba(124,58,237,0.06)', borderColor: 'rgba(124,58,237,0.2)', color: '#6d28d9' }}>
<span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#7c3aed' }}></span>
Powered by Gemini AI 2.0 Flash
</div>
<div className="flex justify-center mb-6">
<div className="relative inline-block">
<div className="absolute -inset-4 rounded-3xl blur-3xl opacity-20" style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }} />
<img src="/tirei10-logo.png" alt="Tirei10" className="relative h-24 md:h-32 w-auto" style={{ filter: 'drop-shadow(0 8px 32px rgba(124,58,237,0.25))' }} />
</div>
</div>
<p className="text-xs font-bold tracking-widest uppercase mb-6" style={{ color: '#7c3aed', letterSpacing: '0.2em' }}>Estude. Entenda. Acerte.</p>
<h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight" style={{ color: '#1e1b4b' }}>
A plataforma de estudos com{' '}
<span style={{ background: 'linear-gradient(135deg, #7c3aed, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Inteligência Artificial</span>
</h1>
<p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed" style={{ color: '#6b7280' }}>
Prepare-se para ENEM, OAB, Concursos Públicos e CPA-20 com IA que aprende com você e maximiza seus resultados.
</p>
<div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
<Link href="/login" className="inline-flex items-center justify-center text-white px-10 py-4 rounded-2xl text-base font-bold transition-all duration-300 shadow-lg hover:-translate-y-1" style={{ background: 'linear-gradient(135deg, #7c3aed, #9333ea)' }}>
Começar Gratuitamente
</Link>
<Link href="/pricing" className="inline-flex items-center justify-center px-10 py-4 rounded-2xl text-base font-semibold transition-all duration-300 border hover:-translate-y-0.5" style={{ borderColor: '#c4b5fd', color: '#7c3aed', background: 'rgba(167,139,250,0.07)' }}>
Ver Planos
</Link>
</div>
<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
{[
{ icon: '🎓', title: 'Conteúdo Claro', sub: 'Objetivo e direto ao ponto' },
{ icon: '🤖', title: 'IA Adaptativa', sub: 'Aprende com seu ritmo' },
{ icon: '🎯', title: 'Foco no Resultado', sub: 'Maximiza sua aprovação' },
].map((item, i) => (
<div key={i} className="flex items-center gap-3 p-4 rounded-xl border bg-white" style={{ borderColor: '#ede9fe', boxShadow: '0 2px 12px rgba(124,58,237,0.06)' }}>
<span className="text-2xl">{item.icon}</span>
<div className="text-left">
<p className="text-sm font-bold" style={{ color: '#1e1b4b' }}>{item.title}</p>
<p className="text-xs" style={{ color: '#9ca3af' }}>{item.sub}</p>
</div>
</div>
))}
</div>
</div>
</section>
<section style={{ background: 'linear-gradient(135deg, #5b21b6, #7c3aed, #9333ea)' }}>
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
<div className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#ddd6fe' }}>{stat.label}</div>
</div>
))}
</div>
</div>
</section>
<section className="py-20" style={{ background: '#ffffff' }}>
<div className="max-w-7xl mx-auto px-6">
<div className="text-center mb-14">
<span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4" style={{ background: '#f3e8ff', color: '#7c3aed' }}>Analytics em Tempo Real</span>
<h2 className="text-3xl md:text-4xl font-extrabold mb-3" style={{ color: '#1e1b4b' }}>Acompanhe cada passo da sua evolução</h2>
<p className="max-w-xl mx-auto" style={{ color: '#6b7280' }}>Dashboards com gráficos e insights personalizados pela IA</p>
</div>
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
<div className="rounded-2xl p-6 border hover:-translate-y-1 transition-all duration-300" style={{ background: '#fafafa', borderColor: '#ede9fe', boxShadow: '0 4px 20px rgba(124,58,237,0.06)' }}>
<div className="flex items-center justify-between mb-5">
<div><h3 className="font-bold text-sm" style={{ color: '#1e1b4b' }}>Evolução de Acertos</h3><p className="text-xs mt-0.5" style={{ color: '#9ca3af' }}>Últimos 6 meses</p></div>
<span className="text-xs px-2.5 py-1 rounded-full font-bold" style={{ background: '#dcfce7', color: '#16a34a' }}>+49%</span>
</div>
<BarChart />
</div>
<div className="rounded-2xl p-6 border hover:-translate-y-1 transition-all duration-300" style={{ background: '#fafafa', borderColor: '#ede9fe', boxShadow: '0 4px 20px rgba(124,58,237,0.06)' }}>
<div className="flex items-center justify-between mb-5">
<div><h3 className="font-bold text-sm" style={{ color: '#1e1b4b' }}>Progresso Mensal</h3><p className="text-xs mt-0.5" style={{ color: '#9ca3af' }}>Meta: 95%</p></div>
<span className="text-xs px-2.5 py-1 rounded-full font-bold" style={{ background: '#f3e8ff', color: '#7c3aed' }}>On track</span>
</div>
<div className="space-y-2">
{[20, 38, 55, 70, 82, 91, 95].map((v, i) => (
<div key={i} className="flex items-center gap-2">
<div className="text-xs w-7 font-medium" style={{ color: '#9ca3af' }}>{['Jan','Fev','Mar','Abr','Mai','Jun','Jul'][i]}</div>
<div className="flex-1 rounded-full h-1.5" style={{ background: '#ede9fe' }}><div className="h-1.5 rounded-full" style={{ width: v + '%', background: 'linear-gradient(90deg, #7c3aed, #a855f7)' }} /></div>
<div className="text-xs font-bold w-7 text-right" style={{ color: '#7c3aed' }}>{v}%</div>
</div>
))}
</div>
</div>
<div className="rounded-2xl p-6 border hover:-translate-y-1 transition-all duration-300" style={{ background: '#fafafa', borderColor: '#ede9fe', boxShadow: '0 4px 20px rgba(124,58,237,0.06)' }}>
<div className="mb-5"><h3 className="font-bold text-sm" style={{ color: '#1e1b4b' }}>Matérias em Destaque</h3><p className="text-xs mt-0.5" style={{ color: '#9ca3af' }}>Taxa de acerto por disciplina</p></div>
<MateriasChart />
</div>
</div>
</div>
</section>
<section className="py-20" style={{ background: '#faf5ff' }}>
<div className="max-w-7xl mx-auto px-6">
<div className="text-center mb-14">
<span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4" style={{ background: '#ede9fe', color: '#7c3aed' }}>Recursos</span>
<h2 className="text-3xl md:text-4xl font-extrabold mb-3" style={{ color: '#1e1b4b' }}>Tudo que você precisa para passar</h2>
<p style={{ color: '#6b7280' }}>Ferramentas inteligentes para maximizar sua aprovação</p>
</div>
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
{[
{ icon: '🎓', bg: '#f3e8ff', iconBg: '#7c3aed', title: 'IA Inteligente', desc: 'Assistente powered by Gemini AI que aprende com seu estilo de estudo e se adapta às suas necessidades.' },
{ icon: '📈', bg: '#ede9fe', iconBg: '#6d28d9', title: 'Progresso em Tempo Real', desc: 'Métricas detalhadas, relatórios e metas personalizadas geradas pela inteligência artificial.' },
{ icon: '🎯', bg: '#faf5ff', iconBg: '#9333ea', title: 'Foco no Resultado', desc: 'Simulados, questões e planos de estudo otimizados para maximizar suas chances de aprovação.' },
].map((feature, i) => (
<div key={i} className="rounded-2xl p-8 border hover:-translate-y-2 transition-all duration-300 group cursor-default" style={{ background: feature.bg, borderColor: '#e9d5ff', boxShadow: '0 2px 16px rgba(124,58,237,0.05)' }}>
<div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-5 shadow-sm" style={{ background: feature.iconBg }}>{feature.icon}</div>
<h3 className="text-lg font-bold mb-3" style={{ color: '#1e1b4b' }}>{feature.title}</h3>
<p className="text-sm leading-relaxed" style={{ color: '#6b7280' }}>{feature.desc}</p>
<div className="mt-6 h-0.5 rounded-full w-0 group-hover:w-full transition-all duration-500" style={{ background: 'linear-gradient(90deg, #7c3aed, #c084fc)' }} />
</div>
))}
</div>
</div>
</section>
<section className="py-16" style={{ background: '#ffffff' }}>
<div className="max-w-5xl mx-auto px-6">
<div className="text-center mb-10">
<span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4" style={{ background: '#f3e8ff', color: '#7c3aed' }}>Provas e Concursos</span>
<h2 className="text-2xl md:text-3xl font-extrabold mb-2" style={{ color: '#1e1b4b' }}>Para qual prova você está se preparando?</h2>
<p className="text-sm" style={{ color: '#9ca3af' }}>Conteúdo 100% alinhado com as bancas mais exigentes do Brasil</p>
</div>
<div className="flex flex-wrap justify-center gap-3">
{['ENEM', 'FUVEST', 'UNICAMP', 'OAB', 'CPA-20', 'Concursos Federais', 'Carreiras Militares', 'Vestibular Medicina'].map((exam, i) => (
<span key={i} className="font-semibold px-5 py-2.5 rounded-full text-sm transition-all cursor-default hover:-translate-y-0.5 duration-200 border" style={{ background: 'white', borderColor: '#ddd6fe', color: '#6d28d9', boxShadow: '0 2px 8px rgba(124,58,237,0.07)' }}>{exam}</span>
))}
</div>
</div>
</section>
<section className="py-20" style={{ background: 'linear-gradient(160deg, #faf5ff 0%, #f3e8ff 100%)' }}>
<div className="max-w-7xl mx-auto px-6">
<div className="text-center mb-14">
<span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4" style={{ background: '#ede9fe', color: '#7c3aed' }}>Como Funciona</span>
<h2 className="text-3xl md:text-4xl font-extrabold mb-3" style={{ color: '#1e1b4b' }}>Simples. Rápido. Eficaz.</h2>
<p style={{ color: '#6b7280' }}>Comece em minutos e sinta a diferença desde a primeira sessão</p>
</div>
<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
{[
{ step: '01', icon: '1️⃣', title: 'Crie sua conta', desc: 'Cadastre-se gratuitamente em segundos. Sem cartão de crédito necessário.' },
{ step: '02', icon: '2️⃣', title: 'A IA te conhece', desc: 'Nossa IA analisa seu nível e cria um plano de estudo personalizado.' },
{ step: '03', icon: '3️⃣', title: 'Tire 10', desc: 'Pratique com questões inteligentes e simulados com feedback instantâneo.' },
].map((item, i) => (
<div key={i} className="text-center">
<div className="rounded-2xl p-8 border bg-white hover:-translate-y-1 transition-all duration-200" style={{ borderColor: '#e9d5ff', boxShadow: '0 4px 24px rgba(124,58,237,0.07)' }}>
<div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl text-2xl mb-5 shadow-md" style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}>{item.icon}</div>
<div className="text-xs font-bold mb-2 tracking-widest uppercase" style={{ color: '#c4b5fd' }}>Passo {item.step}</div>
<h3 className="text-lg font-bold mb-2" style={{ color: '#1e1b4b' }}>{item.title}</h3>
<p className="text-sm leading-relaxed" style={{ color: '#6b7280' }}>{item.desc}</p>
</div>
</div>
))}
</div>
</div>
</section>
<section className="py-20" style={{ background: '#ffffff' }}>
<div className="max-w-4xl mx-auto px-6 text-center">
<div className="rounded-3xl p-12 md:p-16 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #5b21b6, #7c3aed, #9333ea)', boxShadow: '0 20px 60px rgba(109,40,217,0.3)' }}>
<div className="absolute top-0 right-0 w-72 h-72 rounded-full blur-3xl opacity-20 pointer-events-none" style={{ background: 'radial-gradient(circle, #c4b5fd, transparent)' }} />
<div className="relative z-10">
<div className="flex justify-center mb-6">
<img src="/tirei10-logo.png" alt="Tirei10" className="h-14 w-auto" style={{ filter: 'brightness(0) invert(1) opacity(0.9)' }} />
</div>
<h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">Comece agora e <span style={{ color: '#ddd6fe' }}>tire 10</span> na sua prova</h2>
<p className="text-lg mb-8 max-w-xl mx-auto" style={{ color: '#ede9fe' }}>Mais de 50 mil alunos já aprovados. Acesso gratuito, sem cartão de crédito.</p>
<div className="flex flex-col sm:flex-row gap-4 justify-center">
<Link href="/login" className="inline-flex items-center justify-center bg-white px-10 py-4 rounded-2xl text-base font-bold transition-all duration-200 shadow-xl hover:-translate-y-1" style={{ color: '#7c3aed' }}>Começar Gratuitamente</Link>
<Link href="/pricing" className="inline-flex items-center justify-center px-10 py-4 rounded-2xl text-base font-semibold transition-all duration-200 border hover:-translate-y-0.5" style={{ borderColor: 'rgba(255,255,255,0.35)', color: 'white', background: 'rgba(255,255,255,0.1)' }}>Ver Planos</Link>
</div>
</div>
</div>
</div>
</section>
</main>
<footer className="py-12 mt-8" style={{ background: '#0a0a0a', borderTop: '1px solid rgba(139,92,246,0.2)' }}>
<div className="max-w-7xl mx-auto px-6">
<div className="flex flex-col md:flex-row items-center justify-between gap-6">
<div><img src="/tirei10-logo-white.png" alt="Tirei10" className="h-8 w-auto mb-2" /><p className="text-sm" style={{ color: '#475569' }}>Plataforma de estudos com IA adaptativa</p></div>
<div className="flex flex-wrap justify-center gap-6 text-sm" style={{ color: '#475569' }}>
<Link href="/home" className="hover:text-purple-400 transition-colors">Home</Link>
<Link href="/politicas" className="hover:text-purple-400 transition-colors">Políticas</Link>
<Link href="/suporte" className="hover:text-purple-400 transition-colors">Suporte</Link>
<Link href="/pagamentos" className="hover:text-purple-400 transition-colors">Pagamentos</Link>
<Link href="/pricing" className="hover:text-purple-400 transition-colors">Planos</Link>
</div>
</div>
<div className="mt-8 pt-8 text-center text-sm" style={{ borderTop: '1px solid rgba(139,92,246,0.15)', color: '#334155' }}><p>© 2026 Tirei10. Todos os direitos reservados.</p></div>
</div>
</footer>
<CookieConsent />
</div>
);
}
