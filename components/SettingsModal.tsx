'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';

interface SettingsModalProps {
  onClose: () => void;
  userName: string;
  userEmail: string;
  userAvatar: string;
  onAvatarChange: (url: string) => void;
  onNameChange: (name: string) => void;
}

type Tab = 'perfil' | 'pagamentos' | 'aparencia';
type Theme = 'light' | 'gray' | 'dark';

export default function SettingsModal({
  onClose,
  userName,
  userEmail,
  userAvatar,
  onAvatarChange,
  onNameChange,
}: SettingsModalProps) {
  const supabase = createClient();
  const [activeTab, setActiveTab] = useState<Tab>('perfil');

  // --- Perfil ---
  const [editName, setEditName] = useState(userName);
  const [editAge, setEditAge] = useState('');
  const [avatarPreview, setAvatarPreview] = useState(userAvatar);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  // --- Pagamentos ---
  const [currentPlan, setCurrentPlan] = useState('');
  const [loadingPlan, setLoadingPlan] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);

  // --- Aparencia ---
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const loadProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profileData } = await supabase
        .from('profiles')
        .select('age')
        .eq('id', user.id)
        .single();
      if (profileData?.age) setEditAge(String(profileData.age));

      // Read plan from subscriptions table (same source as useUserPlan hook)
      const { data: subData } = await supabase
        .from('subscriptions')
        .select('plan, status')
        .eq('user_id', user.id)
        .maybeSingle();

      if (subData?.plan && ['active', 'trialing'].includes(subData.status || '')) {
        setCurrentPlan(subData.plan);
      } else {
        setCurrentPlan('free');
      }
      setLoadingPlan(false);
    };
    loadProfile();

    const saved = localStorage.getItem('tirei10_theme') as Theme | null;
    if (saved) {
      setTheme(saved);
      applyTheme(saved);
    }
  }, []);

  const applyTheme = (t: Theme) => {
    document.documentElement.classList.remove('theme-light', 'theme-gray', 'theme-dark', 'dark');
    if (t === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (t === 'gray') {
      document.documentElement.classList.add('theme-gray');
    }
  };

  const handleThemeChange = (t: Theme) => {
    setTheme(t);
    localStorage.setItem('tirei10_theme', t);
    applyTheme(t);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const url = ev.target?.result as string;
      setAvatarPreview(url);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    setProfileMsg('');
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Nao autenticado');

      await supabase.auth.updateUser({ data: { full_name: editName } });

      await supabase.from('profiles').upsert({
        id: user.id,
        full_name: editName,
        age: editAge ? parseInt(editAge) : null,
        updated_at: new Date().toISOString(),
      });

      onNameChange(editName);

      if (avatarPreview && avatarPreview.startsWith('data:')) {
        const blob = await (await fetch(avatarPreview)).blob();
        const ext = blob.type.split('/')[1] || 'jpg';
        const filePath = 'avatars/' + user.id + '/avatar.' + ext;
        const { error: upErr } = await supabase.storage.from('avatars').upload(filePath, blob, { upsert: true });
        if (!upErr) {
          const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(filePath);
          const publicUrl = urlData.publicUrl;
          await supabase.auth.updateUser({ data: { avatar_url: publicUrl } });
          await supabase.from('profiles').update({ avatar_url: publicUrl }).eq('id', user.id);
          onAvatarChange(publicUrl);
        }
      }

      setProfileMsg('Perfil salvo com sucesso!');
    } catch (err: any) {
      setProfileMsg('Erro ao salvar: ' + (err.message || 'tente novamente'));
    } finally {
      setSavingProfile(false);
    }
  };

  const handleManagePayment = async () => {
    setPortalLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch('/api/stripe/portal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + (session?.access_token || ''),
        },
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Erro ao acessar portal de pagamento. Tente novamente.');
      }
    } catch {
      alert('Erro ao conectar com Stripe.');
    } finally {
      setPortalLoading(false);
    }
  };

  const planLabel = (plan: string) => {
    const map: Record<string, string> = {
      free: 'Gratuito',
      standard: 'Standard',
      student: 'Student',
      advanced_pro: 'Advanced Pro',
      'advanced pro': 'Advanced Pro',
      basic: 'Basico',
      premium: 'Premium',
      enterprise: 'Empresarial',
    };
    return map[plan?.toLowerCase()] || plan || 'Gratuito';
  };

  const planColor = (plan: string) => {
    const lp = plan?.toLowerCase();
    if (lp === 'advanced_pro' || lp === 'advanced pro') return 'bg-amber-100 text-amber-700';
    if (lp === 'student') return 'bg-purple-100 text-purple-700';
    if (lp === 'standard') return 'bg-blue-100 text-blue-700';
    return 'bg-gray-100 text-gray-600';
  };

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'perfil', label: 'Perfil', icon: '👤' },
    { id: 'pagamentos', label: 'Pagamentos', icon: '💳' },
    { id: 'aparencia', label: 'Aparencia', icon: '🎨' },
  ];

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Configuracoes
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors text-xl leading-none"
          >
            X
          </button>
        </div>

        <div className="flex border-b border-gray-100">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={'flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-all border-b-2 ' + (
                activeTab === tab.id
                  ? 'border-indigo-500 text-indigo-600 bg-indigo-50/50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              )}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto">

          {activeTab === 'perfil' && (
            <div className="space-y-5">
              <div className="flex flex-col items-center gap-3">
                <div className="relative">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Avatar"
                      className="w-20 h-20 rounded-full object-cover border-2 border-indigo-200"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center border-2 border-indigo-200">
                      <span className="text-indigo-600 text-3xl font-bold">
                        {editName.charAt(0).toUpperCase() || '?'}
                      </span>
                    </div>
                  )}
                  <button
                    onClick={() => fileRef.current?.click()}
                    className="absolute bottom-0 right-0 w-7 h-7 bg-indigo-600 text-white rounded-full flex items-center justify-center hover:bg-indigo-700 transition-colors shadow"
                    title="Alterar foto"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
                <p className="text-xs text-gray-400">Clique no icone para alterar sua foto</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome completo</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent"
                  placeholder="Seu nome completo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                <input
                  type="email"
                  value={userEmail}
                  readOnly
                  className="w-full border border-gray-100 rounded-xl px-4 py-2.5 text-sm text-gray-400 bg-gray-50 cursor-not-allowed"
                />
                <p className="text-xs text-gray-400 mt-1">E-mail nao pode ser alterado</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Idade</label>
                <input
                  type="number"
                  min="10"
                  max="100"
                  value={editAge}
                  onChange={(e) => setEditAge(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent"
                  placeholder="Sua idade"
                />
              </div>

              {profileMsg && (
                <div className={'text-sm px-4 py-2 rounded-lg ' + (profileMsg.includes('sucesso') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600')}>
                  {profileMsg}
                </div>
              )}
              <button
                onClick={handleSaveProfile}
                disabled={savingProfile}
                className="w-full bg-indigo-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-60"
              >
                {savingProfile ? 'Salvando...' : 'Salvar Perfil'}
              </button>
            </div>
          )}

          {activeTab === 'pagamentos' && (
            <div className="space-y-5">
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <p className="text-xs text-gray-400 uppercase font-semibold tracking-wider mb-2">Plano Atual</p>
                {loadingPlan ? (
                  <div className="h-8 bg-gray-200 rounded animate-pulse w-24" />
                ) : (
                  <div className="flex items-center gap-3">
                    <span className={'text-sm font-bold px-3 py-1 rounded-full ' + planColor(currentPlan)}>
                      {planLabel(currentPlan)}
                    </span>
                    <a
                      href="/dashboard/planos"
                      className="text-xs text-indigo-600 hover:underline font-medium"
                    >
                      Ver todos os planos
                    </a>
                  </div>
                )}
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">💳</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-800">Gerenciar Pagamentos</h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Acesse o portal seguro do Stripe para ver faturas, alterar cartao ou cancelar assinatura.
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleManagePayment}
                  disabled={portalLoading}
                  className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-60"
                >
                  {portalLoading ? (
                    <span>Redirecionando...</span>
                  ) : (
                    <span>Gerenciar no Stripe</span>
                  )}
                </button>
              </div>

              {(!currentPlan || currentPlan === 'free') && (
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-xl p-4">
                  <p className="text-sm font-semibold text-indigo-800 mb-1">Quer mais recursos?</p>
                  <p className="text-xs text-indigo-600 mb-3">Faca upgrade para o plano Premium e desbloqueie questoes ilimitadas, simulados avancados e muito mais!</p>
                  <a
                    href="/dashboard/planos"
                    className="inline-flex items-center gap-1 bg-indigo-600 text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Ver Planos
                  </a>
                </div>
              )}
            </div>
          )}

          {activeTab === 'aparencia' && (
            <div className="space-y-5">
              <p className="text-sm text-gray-500">Escolha o tema visual da plataforma:</p>

              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => handleThemeChange('light')}
                  className={'group flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ' + (
                    theme === 'light'
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  )}
                >
                  <div className="w-full h-14 rounded-lg bg-white border border-gray-200 overflow-hidden relative shadow-sm">
                    <div className="absolute left-0 top-0 bottom-0 w-6 bg-gray-50 border-r border-gray-200" />
                    <div className="absolute left-8 top-2 right-2 h-2 bg-indigo-200 rounded" />
                    <div className="absolute left-8 top-6 right-2 h-1.5 bg-gray-200 rounded" />
                    <div className="absolute left-8 top-9 right-6 h-1.5 bg-gray-100 rounded" />
                  </div>
                  <span className="text-xs font-medium text-gray-700">Claro</span>
                  {theme === 'light' && (
                    <span className="text-xs text-indigo-600 font-semibold">Ativo</span>
                  )}
                </button>

                <button
                  onClick={() => handleThemeChange('gray')}
                  className={'group flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ' + (
                    theme === 'gray'
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  )}
                >
                  <div className="w-full h-14 rounded-lg bg-gray-200 border border-gray-300 overflow-hidden relative shadow-sm">
                    <div className="absolute left-0 top-0 bottom-0 w-6 bg-gray-300 border-r border-gray-400" />
                    <div className="absolute left-8 top-2 right-2 h-2 bg-indigo-300 rounded" />
                    <div className="absolute left-8 top-6 right-2 h-1.5 bg-gray-400 rounded" />
                    <div className="absolute left-8 top-9 right-6 h-1.5 bg-gray-300 rounded" />
                  </div>
                  <span className="text-xs font-medium text-gray-700">Cinza</span>
                  {theme === 'gray' && (
                    <span className="text-xs text-indigo-600 font-semibold">Ativo</span>
                  )}
                </button>

                <button
                  onClick={() => handleThemeChange('dark')}
                  className={'group flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ' + (
                    theme === 'dark'
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  )}
                >
                  <div className="w-full h-14 rounded-lg bg-gray-900 border border-gray-700 overflow-hidden relative shadow-sm">
                    <div className="absolute left-0 top-0 bottom-0 w-6 bg-gray-800 border-r border-gray-700" />
                    <div className="absolute left-8 top-2 right-2 h-2 bg-indigo-500 rounded" />
                    <div className="absolute left-8 top-6 right-2 h-1.5 bg-gray-600 rounded" />
                    <div className="absolute left-8 top-9 right-6 h-1.5 bg-gray-700 rounded" />
                  </div>
                  <span className="text-xs font-medium text-gray-700">Escuro</span>
                  {theme === 'dark' && (
                    <span className="text-xs text-indigo-600 font-semibold">Ativo</span>
                  )}
                </button>
              </div>

              <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4">
                <p className="text-xs text-yellow-700">
                  Os temas Cinza e Escuro ajustam as cores da interface. A preferencia e salva automaticamente no seu navegador.
                </p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
