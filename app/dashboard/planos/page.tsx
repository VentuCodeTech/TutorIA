'use client';
import { useState, useEffect, Suspense } from 'react';
import Sidebar from '@/components/Sidebar';
import { useSearchParams } from 'next/navigation';
import { useUserPlan } from '@/lib/useUserPlan';
import { createClient } from '@/lib/supabase/client';

function PlanosContent() {
const [loading, setLoading] = useState<string | null>(null);
const [syncingPlan, setSyncingPlan] = useState(false);
const searchParams = useSearchParams();
const success = searchParams.get('success');
const canceled = searchParams.get('canceled');
const successPlan = searchParams.get('plan');
const { planId } = useUserPlan();
const supabase = createClient();

const planLabels: Record<string, string> = {
standard: 'Standard',
student: 'Student',
advanced_pro: 'Advanced Pro',
};

// When redirected back from Stripe with success=true, update the subscription in DB
// This is a fallback in case the Stripe webhook hasn't fired yet
useEffect(() => {
if (success === 'true' && successPlan && successPlan !== 'undefined' && successPlan !== '') {
const validPlans = ['standard', 'student', 'advanced_pro'];
if (!validPlans.includes(successPlan)) return;

const syncSubscription = async () => {
setSyncingPlan(true);
try {
const { data: { user } } = await supabase.auth.getUser();
if (!user) return;

// Check current subscription status
const { data: existingSub } = await supabase
.from('subscriptions')
.select('plan, status')
.eq('user_id', user.id)
.maybeSingle();

// Only update if the current plan in DB doesn't match the purchased plan
// This handles the case where the webhook hasn't fired yet
if (!existingSub || existingSub.plan !== successPlan) {
await supabase.from('subscriptions').upsert({
user_id: user.id,
plan: successPlan,
status: 'active',
updated_at: new Date().toISOString(),
}, { onConflict: 'user_id' });
}
} catch (err) {
console.error('Error syncing subscription:', err);
} finally {
setSyncingPlan(false);
}
};

syncSubscription();
}
}, [success, successPlan, supabase]);

const currentPlanKey = planId === 'free' ? 'gratuito' : planId;
const isCurrentPlan = (key: string) => currentPlanKey === key;

async function handleCheckout(planKey: string) {
setLoading(planKey);
try {
const res = await fetch('/api/stripe/checkout', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ planId: planKey }),
});
const data = await res.json();
if (data.url) {
globalThis.location.href = data.url;
} else {
alert('Erro ao iniciar checkout: ' + (data.error || 'Tente novamente.'));
setLoading(null);
}
} catch (e) {
  console.error('Checkout error:', e);
alert('Erro de conexão. Tente novamente.');
setLoading(null);
}
}

return (
<div className="min-h-screen bg-gray-50">
<Sidebar />
<div className="ml-64 p-8">
<div className="max-w-6xl mx-auto">

{success && (
<div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
<span className="text-2xl">🎉</span>
<div>
<p className="font-semibold text-green-800">Assinatura ativada com sucesso!</p>
<p className="text-sm text-green-700">
Bem-vindo ao plano {planLabels[successPlan || ''] || successPlan}.
{syncingPlan && <span className="ml-2 text-green-600 text-xs">⏳ Sincronizando plano...</span>}
</p>
</div>
</div>
)}
{canceled && (
<div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-center gap-3">
<span className="text-2xl">ℹ️</span>
<p className="text-yellow-800">Checkout cancelado. Seu plano não foi alterado.</p>
</div>
)}

<div className="text-center mb-12">
<h1 className="text-4xl font-bold text-gray-900 mb-4">💎 Planos e Preços</h1>
<p className="text-lg text-gray-600">Escolha o plano ideal para seus objetivos de estudo</p>
</div>

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">

<div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col">
<h2 className="text-xl font-bold text-gray-900 mb-1">Gratuito</h2>
<div className="flex items-end gap-1 mb-6">
<span className="text-4xl font-bold text-gray-900">R$ 0</span>
<span className="text-gray-500 mb-1">/mês</span>
</div>
<ul className="space-y-3 flex-1">
{['20 questões por dia','Acesso às matérias básicas','Dashboard básico','Comunidade de estudantes'].map(f => (
<li key={f} className="flex items-center gap-2 text-sm text-gray-700"><span className="text-green-500">✅</span> {f}</li>
))}
{['Simulados ilimitados','Assistente IA ilimitado','Análise de desempenho avançada','Plano de estudos personalizado'].map(f => (
<li key={f} className="flex items-center gap-2 text-sm text-gray-400"><span className="text-red-400">❌</span> {f}</li>
))}
</ul>
<button type="button" className={`mt-6 w-full py-3 rounded-xl font-semibold transition-colors ${isCurrentPlan('gratuito') ? 'bg-green-100 border-2 border-green-500 text-green-700 cursor-default' : 'border border-gray-300 text-gray-600 hover:bg-gray-50'}`}>
{isCurrentPlan('gratuito') ? '✓ Plano Atual' : 'Plano Gratuito'}
</button>
</div>

<div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col">
<h2 className="text-xl font-bold text-gray-900 mb-1">Standard</h2>
<div className="flex items-end gap-1 mb-6">
<span className="text-4xl font-bold text-gray-900">R$ 19,90</span>
<span className="text-gray-500 mb-1">/mês</span>
</div>
<ul className="space-y-3 flex-1">
{['Questões ilimitadas','Todas as matérias','Assistente IA (50 msgs/dia)','Análise de desempenho completa','Anotações sincronizadas'].map(f => (
<li key={f} className="flex items-center gap-2 text-sm text-gray-700"><span className="text-green-500">✅</span> {f}</li>
))}
{['Plano de estudos personalizado'].map(f => (
<li key={f} className="flex items-center gap-2 text-sm text-gray-400"><span className="text-red-400">❌</span> {f}</li>
))}
</ul>
{isCurrentPlan('standard') ? (
<button type="button" className="mt-6 w-full py-3 rounded-xl bg-green-100 border-2 border-green-500 text-green-700 font-semibold cursor-default">✓ Plano Atual</button>
) : (
<button type="button" onClick={() => handleCheckout('standard')} disabled={loading === 'standard'} className="mt-6 w-full py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
{loading === 'standard' ? 'Aguarde...' : 'Assinar Standard'}
</button>
)}
</div>

<div className="bg-white rounded-2xl border-2 border-indigo-500 p-6 flex flex-col relative shadow-md">
<div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap">Mais Popular</div>
<h2 className="text-xl font-bold text-gray-900 mb-1">Student</h2>
<div className="flex items-end gap-1 mb-6">
<span className="text-4xl font-bold text-gray-900">R$ 49,90</span>
<span className="text-gray-500 mb-1">/mês</span>
</div>
<ul className="space-y-3 flex-1">
{['Tudo do plano Standard','Simulados ilimitados','Assistente IA ilimitado','Redação corrigida por IA','Acesso antecipado a novidades','Relatórios semanais por email','Integração com Google Calendar','Suporte via chat'].map(f => (
<li key={f} className="flex items-center gap-2 text-sm text-gray-700"><span className="text-green-500">✅</span> {f}</li>
))}
</ul>
{isCurrentPlan('student') ? (
<button type="button" className="mt-6 w-full py-3 rounded-xl bg-green-100 border-2 border-green-500 text-green-700 font-semibold cursor-default">✓ Plano Atual</button>
) : (
<button type="button" onClick={() => handleCheckout('student')} disabled={loading === 'student'} className="mt-6 w-full py-3 rounded-xl bg-purple-600 text-white font-semibold hover:bg-purple-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
{loading === 'student' ? 'Aguarde...' : 'Assinar Student'}
</button>
)}
</div>

<div className="bg-gradient-to-b from-yellow-50 to-orange-50 rounded-2xl border-2 border-yellow-400 p-6 flex flex-col relative shadow-lg">
<div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap">🏆 Elite</div>
<h2 className="text-xl font-bold text-gray-900 mb-1">Advanced Pro</h2>
<div className="flex items-end gap-1 mb-6">
<span className="text-4xl font-bold text-gray-900">R$ 99,90</span>
<span className="text-gray-500 mb-1">/mês</span>
</div>
<ul className="space-y-3 flex-1">
{['Tudo do plano Student','Assistente IA sem limites','Redações corrigidas ilimitadas','Simulados personalizados por IA','Plano de estudos adaptativo','Relatórios detalhados de evolução','Prioridade máxima no suporte','Badge exclusivo de Elite'].map(f => (
<li key={f} className="flex items-center gap-2 text-sm text-gray-700"><span className="text-yellow-500">⭐</span> {f}</li>
))}
</ul>
{isCurrentPlan('advanced_pro') ? (
<button type="button" className="mt-6 w-full py-3 rounded-xl bg-green-100 border-2 border-green-500 text-green-700 font-semibold cursor-default">✓ Plano Atual</button>
) : (
<button type="button" onClick={() => handleCheckout('advanced_pro')} disabled={loading === 'advanced_pro'} className="mt-6 w-full py-3 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold hover:from-yellow-500 hover:to-orange-600 transition-all shadow-md disabled:opacity-60 flex items-center justify-center gap-2">
{loading === 'advanced_pro' ? 'Aguarde...' : '🚀 Assinar Advanced Pro'}
</button>
)}
</div>

</div>

<div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white text-center">
<h3 className="text-2xl font-bold mb-2">🎓 Garanta seu futuro hoje!</h3>
<p className="text-indigo-100 mb-4">Mais de 10.000 estudantes já passaram no vestibular com o Tirei10.</p>
<div className="flex flex-wrap justify-center gap-6 text-sm">
<span>✅ Cancele quando quiser</span>
<span>✅ Sem fidelidade</span>
<span>✅ Garantia de 7 dias</span>
<span>✅ Pagamento seguro via Stripe</span>
</div>
</div>

</div>
</div>
</div>
);
}

export default function PlanosPage() {
return (
<Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div></div>}>
<PlanosContent />
</Suspense>
);
}
