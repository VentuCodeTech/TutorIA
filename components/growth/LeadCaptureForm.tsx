'use client';

import { useState } from 'react';

interface LeadCaptureFormProps {
  exam: string;
  source: 'diagnostico' | 'cronograma' | 'simulado';
  gapData?: Record<string, unknown>;
  onSuccess?: () => void;
}

export default function LeadCaptureForm({ exam, source, gapData, onSuccess }: LeadCaptureFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    setStatus('loading');
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, exam, source, gapData }),
      });
      if (!res.ok) throw new Error('Falha ao enviar');
      setStatus('done');
      onSuccess?.();
    } catch {
      setStatus('error');
    }
  };

  if (status === 'done') {
    return (
      <div className="bg-green-50 border border-green-100 rounded-2xl p-6 text-center">
        <p className="text-green-700 font-semibold">Recebido! Enviamos seu resultado completo para {email}.</p>
        <p className="text-green-600 text-sm mt-1">Nos proximos dias voce recebera dicas personalizadas por email.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h3 className="font-semibold text-gray-900 mb-1">Salve o seu resultado completo</h3>
      <p className="text-sm text-gray-500 mb-4">Enviamos por email um relatorio detalhado com um plano de acao para cada area.</p>
      <div className="grid gap-3 mb-4">
        <input
          type="text"
          required
          placeholder="Seu nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
        />
        <input
          type="email"
          required
          placeholder="Seu melhor email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
        />
      </div>
      {status === 'error' && (
        <p className="text-red-600 text-sm mb-3">Nao foi possivel enviar agora. Tente novamente.</p>
      )}
      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full py-3 rounded-xl text-white font-semibold transition-all disabled:opacity-60"
        style={{ background: 'linear-gradient(135deg, #6d28d9, #9333ea)' }}
      >
        {status === 'loading' ? 'Enviando...' : 'Quero receber meu resultado'}
      </button>
    </form>
  );
}
