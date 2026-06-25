'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Sidebar from '@/components/Sidebar';
import Chatbot from '@/components/Chatbot';
import { useUserPlan } from '@/lib/useUserPlan';

export default function CalendarioPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [googleEmail, setGoogleEmail] = useState<string | null>(null);
  const { planName, features } = useUserPlan();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { globalThis.location.href = '/login'; return; }
      setUserId(session.user.id);

      // Check if user connected via Google OAuth (has Google provider)
      const providerToken = session.provider_token;
      const provider = session.user.app_metadata?.provider;
      if (provider === 'google' && providerToken) {
        setConnected(true);
        setGoogleEmail(session.user.email || null);
      }

      // Also check localStorage for connection state
      const storedConnection = localStorage.getItem('google_calendar_connected');
      if (storedConnection === 'true') {
        setConnected(true);
        setGoogleEmail(localStorage.getItem('google_calendar_email') || session.user.email || null);
      }

      setLoading(false);
    });
  }, []);

  const handleConnectGoogle = () => {
    // Redirect to Google OAuth with calendar scope
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const redirectUri = encodeURIComponent(globalThis.location.origin + '/api/auth/google-calendar/callback');
    const scope = encodeURIComponent(
      'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events'
    );
    const state = encodeURIComponent(JSON.stringify({ userId, returnUrl: '/dashboard/calendario' }));

    if (clientId) {
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&access_type=offline&prompt=consent&state=${state}`;
      globalThis.location.href = authUrl;
    } else {
      // Fallback: simulate connection for demo purposes
      localStorage.setItem('google_calendar_connected', 'true');
      supabase.auth.getUser().then(({ data: { user } }) => {
        const email = user?.email || '';
        localStorage.setItem('google_calendar_email', email);
        setGoogleEmail(email);
        setConnected(true);
      });
    }
  };

  const handleDisconnect = () => {
    localStorage.removeItem('google_calendar_connected');
    localStorage.removeItem('google_calendar_email');
    setConnected(false);
    setGoogleEmail(null);
  };

  const openGoogleCalendar = () => {
    globalThis.open('https://calendar.google.com', '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const canUseCalendar = features.googleCalendarIntegration;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 flex">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">ð Google Calendar</h1>
          <p className="text-gray-500 mt-1">Vincule sua conta Google e sincronize sua rotina de estudos com o Google Calendar</p>
        </div>

        {!canUseCalendar && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-6 flex items-start gap-4">
            <span className="text-3xl">ð</span>
            <div>
              <h3 className="font-bold text-amber-800 mb-1">Recurso exclusivo para planos Student e Advanced Pro</h3>
              <p className="text-amber-700 text-sm mb-3">
                A integraÃ§Ã£o com o Google Calendar estÃ¡ disponÃ­vel nos planos <strong>Student</strong> e <strong>Advanced Pro</strong>.
                Seu plano atual Ã© <strong>{planName}</strong>.
              </p>
              <a
                href="/dashboard/planos"
                className="inline-block bg-amber-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-amber-700 transition-colors"
              >
                Ver Planos â
              </a>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Connection Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                <span className="text-2xl">ð</span>
              </div>
              <div>
                <h2 className="font-bold text-gray-800">Google Calendar</h2>
                <p className="text-sm text-gray-500">Sincronize seus eventos de estudo</p>
              </div>
            </div>

            {connected ? (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-green-600 font-medium">Conectado</span>
                  {googleEmail && <span className="text-xs text-gray-400">({googleEmail})</span>}
                </div>
                <div className="flex gap-3 flex-wrap">
                  <button
                    onClick={openGoogleCalendar}
                    className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    Abrir Google Calendar â
                  </button>
                  <button
                    onClick={handleDisconnect}
                    className="border border-red-200 text-red-500 px-4 py-2 rounded-xl text-sm font-medium hover:bg-red-50 transition-colors"
                  >
                    Desconectar
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-500 mb-4">
                  Conecte sua conta Google para sincronizar automaticamente suas sessÃµes de estudo, simulados e metas diÃ¡rias com o Google Calendar.
                </p>
                <button
                  onClick={canUseCalendar ? handleConnectGoogle : undefined}
                  disabled={!canUseCalendar}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${canUseCalendar ? 'bg-white border-2 border-gray-200 text-gray-700 hover:border-blue-400 hover:bg-blue-50 cursor-pointer' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" className="flex-shrink-0">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Conectar com Google
                </button>
              </div>
            )}
          </div>

          {/* How it works */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="font-bold text-gray-800 mb-4">Como funciona</h2>
            <div className="space-y-4">
              {[
                { icon: 'ð', title: 'Vincule sua conta', desc: 'Conecte sua conta Google com um clique para autorizar a sincronizaÃ§Ã£o.' },
                { icon: 'ð', title: 'Crie sessÃµes de estudo', desc: 'Suas sessÃµes, simulados e metas diÃ¡rias sÃ£o adicionados automaticamente ao calendÃ¡rio.' },
                { icon: 'ð', title: 'Receba lembretes', desc: 'O Google Calendar envia notificaÃ§Ãµes para que vocÃª nunca perca uma sessÃ£o de estudos.' },
                { icon: 'ð', title: 'Acompanhe seu progresso', desc: 'Visualize sua rotina de estudos diretamente no Google Calendar.' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-xl flex-shrink-0">{item.icon}</span>
                  <div>
                    <p className="font-medium text-gray-800 text-sm">{item.title}</p>
                    <p className="text-xs text-gray-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
          <h2 className="font-bold text-gray-800 mb-4">AÃ§Ãµes RÃ¡pidas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: 'ð', label: 'Agendar SessÃ£o de Estudo', desc: 'Criar evento de estudo', href: 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Sess%C3%A3o+de+Estudos+-+Tirei10&details=Sess%C3%A3o+de+estudos+com+Tirei10' },
              { icon: 'ð¯', label: 'Agendar Simulado', desc: 'Marcar data de simulado', href: 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Simulado+-+Tirei10&details=Realizar+simulado+na+plataforma+Tirei10' },
              { icon: 'ð', label: 'Ver Minha Agenda', desc: 'Abrir Google Calendar', href: 'https://calendar.google.com' },
              { icon: 'â°', label: 'Lembrete de RevisÃ£o', desc: 'Criar lembrete de revisÃ£o', href: 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Revis%C3%A3o+-+Tirei10&details=Revis%C3%A3o+do+conte%C3%BAdo+estudado' },
            ].map((action, i) => (
              <a
                key={i}
                href={connected && canUseCalendar ? action.href : '#'}
                target={connected && canUseCalendar ? '_blank' : '_self'}
                rel="noopener noreferrer"
                onClick={!connected || !canUseCalendar ? (e) => e.preventDefault() : undefined}
                className={`flex flex-col items-center text-center p-4 rounded-xl border-2 transition-all ${connected && canUseCalendar ? 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 cursor-pointer' : 'border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed'}`}
              >
                <span className="text-2xl mb-2">{action.icon}</span>
                <p className="font-medium text-gray-800 text-sm">{action.label}</p>
                <p className="text-xs text-gray-400 mt-1">{action.desc}</p>
              </a>
            ))}
          </div>
          {!connected && canUseCalendar && (
            <p className="text-center text-sm text-gray-400 mt-4">Conecte sua conta Google para usar as aÃ§Ãµes rÃ¡pidas</p>
          )}
          {!canUseCalendar && (
            <p className="text-center text-sm text-amber-500 mt-4">FaÃ§a upgrade para o plano Student ou Advanced Pro para usar esta funcionalidade</p>
          )}
        </div>

        {/* Embed Google Calendar for connected users */}
        {connected && canUseCalendar && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="font-bold text-gray-800 mb-4">Sua Agenda</h2>
            <p className="text-sm text-gray-500 mb-4">
              Para visualizar seu Google Calendar aqui, clique em "Abrir Google Calendar" ou use as aÃ§Ãµes rÃ¡pidas acima.
              A incorporaÃ§Ã£o direta requer configuraÃ§Ã£o adicional no Google Calendar.
            </p>
            <button
              onClick={openGoogleCalendar}
              className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors"
            >
              Abrir meu Google Calendar â
            </button>
          </div>
        )}
      </main>
      <Chatbot />
    </div>
  );
}
