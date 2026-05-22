'use client';
import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import Sidebar from '@/components/Sidebar';
import { useUserPlan } from '@/lib/useUserPlan';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const suggestions = [
  'Me explique logaritmos de forma simples',
  'Como funciona a célula eucariota?',
  'Quais são as principais causas da 2ª Guerra Mundial?',
  'Como resolver equações do 2º grau?',
  'Explique o processo de fotossíntese',
  'Dicas para redação do ENEM',
];

export default function AssistentePage() {
  const { features, planId, planName, loading: planLoading } = useUserPlan();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Olá! Sou o Assistente IA do Tirei10. Estou aqui para te ajudar com seus estudos! 🎓\n\nPosso te ajudar com:\n• Explicações de matérias e conteúdos\n• Resolução de dúvidas específicas\n• Dicas de estudo e memorização\n• Preparação para vestibulares e concursos\n\nComo posso te ajudar hoje?',
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [todayMsgCount, setTodayMsgCount] = useState(0);
  const [userName, setUserName] = useState('Estudante');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserName(user.user_metadata?.full_name?.split(' ')[0] || 'Estudante');
        // Load today's message count from localStorage
        const today = new Date().toISOString().split('T')[0];
        const key = `ai_msg_count_${user.id}_${today}`;
        const stored = parseInt(localStorage.getItem(key) || '0', 10);
        setTodayMsgCount(stored);
      }
    };
    getUser();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const incrementMsgCount = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const today = new Date().toISOString().split('T')[0];
    const key = `ai_msg_count_${user.id}_${today}`;
    const newCount = todayMsgCount + 1;
    localStorage.setItem(key, String(newCount));
    setTodayMsgCount(newCount);
  };

  const dailyLimit = features.aiDailyMessageLimit;
  const isLimitReached = dailyLimit !== null && todayMsgCount >= dailyLimit;

  const handleSend = async (message?: string) => {
    const text = message || input.trim();
    if (!text || loading) return;

    if (!features.aiAssistantEnabled) {
      const upgradeMsg: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: '❌ O Assistente IA está disponível apenas nos planos pagos (Standard, Student ou Advanced Pro).\n\nFaça upgrade para desbloquear esse recurso! 🚀',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, upgradeMsg]);
      return;
    }

    if (isLimitReached) {
      const limitMsg: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `⚠️ Você atingiu o limite de ${dailyLimit} mensagens por dia do plano ${planName}.\n\nFaça upgrade para o plano Student ou Advanced Pro para mensagens ilimitadas! 🚀`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, limitMsg]);
      return;
    }

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    await incrementMsgCount();

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map(m => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const assistantMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.message || 'Desculpe, não consegui processar sua pergunta.',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, assistantMsg]);
      } else {
        throw new Error('API error');
      }
    } catch {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Desculpe, ocorreu um erro ao processar sua pergunta. Por favor, tente novamente em alguns instantes.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-64 flex flex-col h-screen">
        <div className="p-6 border-b border-gray-100 bg-white flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">🤖 Assistente IA</h1>
            <p className="text-gray-600 text-sm mt-1">Tire todas as suas dúvidas de estudo</p>
          </div>
          {!planLoading && (
            <div className="text-right">
              <span className="text-xs text-gray-400">Plano: <span className="font-semibold text-indigo-600">{planName}</span></span>
              {dailyLimit !== null && (
                <p className="text-xs text-gray-400 mt-0.5">
                  Mensagens hoje: <span className={todayMsgCount >= dailyLimit ? 'text-red-500 font-semibold' : 'text-gray-600'}>{todayMsgCount}/{dailyLimit}</span>
                </p>
              )}
            </div>
          )}
        </div>

        {!planLoading && !features.aiAssistantEnabled && (
          <div className="m-6 bg-indigo-50 border border-indigo-200 rounded-xl p-4 flex items-start gap-3">
            <span className="text-2xl">🔒</span>
            <div>
              <p className="font-semibold text-indigo-800">Assistente IA bloqueado</p>
              <p className="text-sm text-indigo-700 mt-1">
                O Assistente IA está disponível a partir do plano Standard.{' '}
                <a href="/dashboard/planos" className="underline font-medium hover:text-indigo-900">Fazer upgrade agora</a>
              </p>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-3 max-w-2xl ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-sm ${
                  msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white'
                }`}>
                  {msg.role === 'user' ? userName.charAt(0).toUpperCase() : '🤖'}
                </div>
                <div className={`rounded-2xl px-4 py-3 ${
                  msg.role === 'user'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white border border-gray-100 text-gray-800 shadow-sm'
                }`}>
                  <p className="text-sm leading-relaxed whitespace-pre-line">{msg.content}</p>
                  <p className={`text-xs mt-1 ${msg.role === 'user' ? 'text-indigo-200' : 'text-gray-400'}`}>
                    {msg.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-sm text-white">
                  🤖
                </div>
                <div className="bg-white border border-gray-100 rounded-2xl px-4 py-3 shadow-sm">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {messages.length === 1 && features.aiAssistantEnabled && (
            <div className="mt-4">
              <p className="text-xs text-gray-400 mb-3">💡 Sugestões de perguntas:</p>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(s)}
                    className="text-xs bg-white border border-gray-200 text-gray-600 px-3 py-2 rounded-full hover:border-indigo-300 hover:text-indigo-600 transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-gray-100 bg-white">
          {isLimitReached && (
            <div className="mb-3 text-center text-xs text-amber-600 bg-amber-50 rounded-lg py-2 px-3">
              ⚠️ Limite diário de {dailyLimit} mensagens atingido. <a href="/dashboard/planos" className="underline font-medium">Fazer upgrade</a>
            </div>
          )}
          <div className="flex gap-3">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                !features.aiAssistantEnabled
                  ? 'Assistente IA disponível nos planos pagos'
                  : isLimitReached
                  ? `Limite de ${dailyLimit} msgs/dia atingido`
                  : 'Digite sua dúvida de estudo... (Enter para enviar)'
              }
              className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none disabled:bg-gray-50 disabled:text-gray-400"
              rows={2}
              disabled={loading || !features.aiAssistantEnabled || isLimitReached}
            />
            <button
              onClick={() => handleSend()}
              disabled={loading || !input.trim() || !features.aiAssistantEnabled || isLimitReached}
              className="bg-indigo-600 text-white px-4 py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ➤
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-2 text-center">
            Respostas de IA podem conter imprecisões
          </p>
        </div>
      </div>
    </div>
  );
}
