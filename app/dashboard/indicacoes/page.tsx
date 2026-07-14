'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Sidebar from '@/components/Sidebar';

type ReferralRow = {
  id: string;
  status: string;
  created_at: string;
  converted_at: string | null;
};

const statusLabels: Record<string, string> = {
  pending: 'Pendente',
  converted: 'Convertida',
  rewarded: 'Recompensada',
};

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  converted: 'bg-green-100 text-green-700',
  rewarded: 'bg-indigo-100 text-indigo-700',
};

export default function IndicacoesPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [referralCode, setReferralCode] = useState('');
  const [bonusDays, setBonusDays] = useState(0);
  const [referrals, setReferrals] = useState<ReferralRow[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        globalThis.location.href = '/login';
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('referral_code, referral_bonus_days')
        .eq('id', user.id)
        .single();

      setReferralCode(profile?.referral_code ?? '');
      setBonusDays(profile?.referral_bonus_days ?? 0);

      const { data: refs } = await supabase
        .from('referrals')
        .select('id, status, created_at, converted_at')
        .eq('referrer_id', user.id)
        .order('created_at', { ascending: false });

      setReferrals(refs ?? []);
      setLoading(false);
    };
    load();
  }, []);

  const referralLink = referralCode ? `https://www.tirei10.com.br/r/${referralCode}` : '';

  const handleCopy = async () => {
    if (!referralLink) return;
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard pode nao estar disponivel; o usuario ainda pode selecionar e copiar o texto manualmente.
    }
  };

  const total = referrals.length;
  const converted = referrals.filter((r) => r.status !== 'pending').length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-64 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Indique e Ganhe</h1>
            <p className="text-gray-600 mt-1">
              Compartilhe seu link e ganhe 30 dias do plano Estudante para cada amigo que se cadastrar atraves dele. Seu amigo tambem ganha 30 dias de bonus!
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
            <label htmlFor="referral-link-input" className="text-sm font-medium text-gray-700 mb-2 block">
              Seu link de indicacao
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                id="referral-link-input"
                readOnly
                value={referralLink}
                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700"
                onFocus={(e) => e.target.select()}
              />
              <button
                onClick={handleCopy}
                className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors whitespace-nowrap"
              >
                {copied ? 'Copiado!' : 'Copiar link'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 text-center">
              <p className="text-2xl font-bold text-gray-900">{total}</p>
              <p className="text-xs text-gray-500 mt-1">Indicacoes enviadas</p>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 text-center">
              <p className="text-2xl font-bold text-green-600">{converted}</p>
              <p className="text-xs text-gray-500 mt-1">Convertidas</p>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 text-center">
              <p className="text-2xl font-bold text-indigo-600">{bonusDays}</p>
              <p className="text-xs text-gray-500 mt-1">Dias de bonus ganhos</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Suas indicacoes</h2>
            {referrals.length === 0 ? (
              <p className="text-gray-500 text-sm">
                Voce ainda nao indicou ninguem. Compartilhe seu link acima para comecar a ganhar dias de bonus!
              </p>
            ) : (
              <div className="space-y-3">
                {referrals.map((r, idx) => (
                  <div key={r.id} className="flex items-center justify-between border border-gray-100 rounded-xl p-4">
                    <div>
                      <p className="text-sm font-medium text-gray-800">Indicacao #{referrals.length - idx}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(r.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusColors[r.status] ?? 'bg-gray-100 text-gray-700'}`}>
                      {statusLabels[r.status] ?? r.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-8 bg-indigo-50 rounded-2xl p-6 text-sm text-indigo-700">
            Como funciona: compartilhe seu link unico com amigos. Quando alguem se cadastra e completa o onboarding atraves dele, voce ganha 30 dias do plano Estudante e seu amigo tambem recebe 30 dias de bonus automaticamente.
          </div>
        </div>
      </div>
    </div>
  );
}
