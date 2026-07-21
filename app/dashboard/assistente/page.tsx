'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import Sidebar from '@/components/Sidebar';
import { useUserPlan } from '@/lib/useUserPlan';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  attachment?: { name: string; type: 'image' | 'document'; preview?: string };
}

interface AttachedFile {
  name: string;
  type: 'image' | 'document';
  mimeType: string;
  // For images: base64 data URL; for docs: extracted text
  data: string;
  preview?: string; // thumbnail URL for images
  size: number;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const studySuggestions = [
  'Me explique logaritmos de forma simples',
  'Como funciona a célula eucariota?',
  'Quais são as principais causas da 2ª Guerra Mundial?',
  'Como resolver equações do 2º grau?',
  'Explique o processo de fotosíntese',
  'Dicas para redação do ENEM',
];

const supportSuggestions = [
  'Como faço upgrade do meu plano?',
  'Posso cancelar minha assinatura?',
  'Como funciona o plano Gratuito?',
  'Esqueci minha senha, o que faço?',
  'Meus dados de estudo ficam salvos?',
  'Como funciona a integração com Google Calendar?',
];

export default function AssistentePage() { // NOSONAR
  const { features, planId, planName, loading: planLoading } = useUserPlan();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Olá! Sou o Assistente IA do Tirei10. Estou aqui para te ajudar! 🎓\n\nPosso te ajudar com:\n• Explicações de matérias e conteúdos acadêmicos\n• Resolução de dúvidas de vestibulares e concursos\n• Correção e análise de redações (envie foto, PDF ou Word)\n• Resolução de questões a partir de imagens ou documentos\n• Dúvidas sobre a plataforma Tirei10 (planos, funcionalidades, conta)\n\nComo posso te ajudar hoje?',
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [todayMsgCount, setTodayMsgCount] = useState(0);
  const [userName, setUserName] = useState('Estudante');
  const [suggestionTab, setSuggestionTab] = useState<'study' | 'support'>('study');
  const [attachedFile, setAttachedFile] = useState<AttachedFile | null>(null);
  const [attachError, setAttachError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserName(user.user_metadata?.full_name?.split(' ')[0] || 'Estudante');
        const today = new Date().toISOString().split('T')[0];
        const key = `ai_msg_count_${user.id}_${today}`;
        const stored = Number.parseInt(localStorage.getItem(key) || '0', 10);
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

  // Process a File into AttachedFile
  const processFile = useCallback((file: File): Promise<AttachedFile> => {
    return new Promise((resolve, reject) => {
      if (file.size > MAX_FILE_SIZE) {
        reject(new Error(`Arquivo muito grande. Máximo: 10 MB. Seu arquivo: ${(file.size / 1024 / 1024).toFixed(1)} MB`));
        return;
      }

      const isImage = file.type.startsWith('image/');
      const isPdf = file.type === 'application/pdf';
      const isWord = file.type === 'application/msword' ||
        file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

      if (!isImage && !isPdf && !isWord) {
        reject(new Error('Formato não suportado. Use imagens (JPG, PNG, GIF, WEBP), PDF ou Word (DOC, DOCX).'));
        return;
      }

      const reader = new FileReader();

      if (isImage) {
        reader.onload = (e) => {
          const dataUrl = e.target?.result as string;
          resolve({
            name: file.name,
            type: 'image',
            mimeType: file.type,
            data: dataUrl,
            preview: dataUrl,
            size: file.size,
          });
        };
        reader.onerror = () => reject(new Error('Erro ao ler o arquivo.'));
        reader.readAsDataURL(file);
      } else {
        // PDF or Word — read as ArrayBuffer and convert to base64 // NOSONAR
        reader.onload = (e) => {
          const buffer = e.target?.result as ArrayBuffer;
          const bytes = new Uint8Array(buffer);
          let binary = '';
          bytes.forEach(b => binary += String.fromCodePoint(b)); // NOSONAR
          const base64 = btoa(binary);
          resolve({
            name: file.name,
            type: 'document',
            mimeType: file.type,
            data: base64,
            size: file.size,
          });
        };
        reader.onerror = () => reject(new Error('Erro ao ler o arquivo.'));
        reader.readAsArrayBuffer(file); // NOSONAR
      }
    });
  }, []);

  const handleFileSelect = useCallback(async (file: File) => {
    setAttachError(null);
    try {
      const processed = await processFile(file);
      setAttachedFile(processed);
    } catch (e: unknown) {
      setAttachError((e as Error).message);
    }
  }, [processFile]);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
    e.target.value = '';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  };

  const removeAttachment = () => {
    setAttachedFile(null);
    setAttachError(null);
  };

  const dailyLimit = features.aiDailyMessageLimit;
  const isLimitReached = dailyLimit === null ? false : todayMsgCount >= dailyLimit;
  const canSend = (input.trim() || attachedFile) && !loading && features.aiAssistantEnabled && !isLimitReached;

  const handleSend = async (message?: string) => {
    const text = message || input.trim();
    const hasAttachment = !!attachedFile;

    if (!text && !hasAttachment) return;
    if (loading) return;

    if (!features.aiAssistantEnabled) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(), role: 'assistant',
        content: '❌ O Assistente IA está disponível apenas nos planos pagos (Standard, Student ou Advanced Pro).\n\nFaça upgrade para desbloquear esse recurso! 🚀',
        timestamp: new Date(),
      }]);
      return;
    }

    if (isLimitReached) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(), role: 'assistant',
        content: `⚠️ Você atingiu o limite de ${dailyLimit} mensagens por dia do plano ${planName}.\n\nFaça upgrade para o plano Student ou Advanced Pro para mensagens ilimitadas! 🚀`,
        timestamp: new Date(),
      }]);
      return;
    }

    const displayText = text || (attachedFile ? `📎 ${attachedFile.name}` : '');
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: displayText,
      timestamp: new Date(),
      ...(attachedFile ? {
        attachment: {
          name: attachedFile.name,
          type: attachedFile.type,
          preview: attachedFile.preview,
        }
      } : {}),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    const fileToSend = attachedFile;
    setAttachedFile(null);
    setAttachError(null);
    setLoading(true);
    await incrementMsgCount();

    try {
      const payload: Record<string, unknown> = {
        messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.content })),
        planId,
      };

      if (fileToSend) {
        payload.attachment = {
          name: fileToSend.name,
          type: fileToSend.type,
          mimeType: fileToSend.mimeType,
          data: fileToSend.data,
          userText: text,
        };
      }

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.message || 'Desculpe, não consegui processar sua pergunta.',
          timestamp: new Date(),
        }]);
      } else {
        throw new Error('API error');
      }
    } catch {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Desculpe, ocorreu um erro ao processar sua pergunta. Por favor, tente novamente em alguns instantes.',
        timestamp: new Date(),
      }]);
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

  const currentSuggestions = suggestionTab === 'study' ? studySuggestions : supportSuggestions;

  const getTextareaPlaceholder = (): string => {
    if (!features.aiAssistantEnabled) {
      return 'Assistente IA disponível nos planos pagos';
    }
    if (isLimitReached) {
      return `Limite de ${dailyLimit} msgs/dia atingido`;
    }
    if (attachedFile) {
      return 'Adicione uma instrução (ex: "Corrija minha redação") ou envie direto...';
    }
    return 'Digite ou arraste um arquivo aqui... (Enter para enviar)';
  };
  const textareaPlaceholder = getTextareaPlaceholder();

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-64 flex flex-col h-screen">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 bg-white flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">🤖 Assistente IA</h1>
            <p className="text-gray-600 text-sm mt-1">Tire dúvidas, corrija redações e resolva questões com IA</p>
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

        {/* Plan lock banner */}
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

        {/* Messages area */}
        <div
          className={`flex-1 overflow-y-auto p-6 space-y-4 ${isDragging ? 'bg-indigo-50 border-2 border-dashed border-indigo-300' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {isDragging && (
            <div className="fixed inset-0 bg-indigo-500/10 flex items-center justify-center z-50 pointer-events-none">
              <div className="bg-white border-2 border-dashed border-indigo-400 rounded-2xl px-10 py-8 text-center shadow-xl">
                <span className="text-4xl">📎</span>
                <p className="text-indigo-600 font-semibold mt-2">Solte o arquivo aqui</p>
                <p className="text-xs text-gray-500 mt-1">Imagens, PDF ou Word</p>
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex gap-3 max-w-2xl ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-sm ${
                  msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white'
                }`}>
                  {msg.role === 'user' ? userName.charAt(0).toUpperCase() : '🤖'}
                </div>
                <div className={`rounded-2xl px-4 py-3 ${
                  msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-100 text-gray-800 shadow-sm'
                }`}>
                  {/* Attachment preview in message bubble */}
                  {msg.attachment && (
                    <div className={`mb-2 rounded-xl overflow-hidden ${msg.role === 'user' ? 'border border-indigo-400' : 'border border-gray-200'}`}>
                      {msg.attachment.type === 'image' && msg.attachment.preview ? (
                        <img src={msg.attachment.preview} alt={msg.attachment.name} className="max-w-xs max-h-48 object-contain bg-black/10" />
                      ) : (
                        <div className={`flex items-center gap-2 px-3 py-2 ${msg.role === 'user' ? 'bg-indigo-500/30' : 'bg-gray-50'}`}>
                          <span className="text-xl">{msg.attachment.type === 'image' ? '🖼️' : '📄'}</span>
                          <span className={`text-xs truncate max-w-[180px] ${msg.role === 'user' ? 'text-indigo-100' : 'text-gray-600'}`}>
                            {msg.attachment.name}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                  {msg.content && (
                    <p className="text-sm leading-relaxed whitespace-pre-line">{msg.content}</p>
                  )}
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
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-sm text-white">🤖</div>
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
              <div className="flex gap-2 mb-3">
                <button type="button" onClick={() => setSuggestionTab('study')} className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
                  suggestionTab === 'study' ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-200 text-gray-500 hover:border-indigo-300 hover:text-indigo-600'
                }`}>📚 Estudos</button>
                <button type="button" onClick={() => setSuggestionTab('support')} className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
                  suggestionTab === 'support' ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-200 text-gray-500 hover:border-indigo-300 hover:text-indigo-600'
                }`}>❓ Suporte</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {currentSuggestions.map((s) => (
                  <button type="button" key={s} onClick={() => handleSend(s)}
                    className="text-xs bg-white border border-gray-200 text-gray-600 px-3 py-2 rounded-full hover:border-indigo-300 hover:text-indigo-600 transition-colors">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="border-t border-gray-100 bg-white">

          {/* Error banner */}
          {attachError && (
            <div className="mx-4 mt-3 px-3 py-2 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
              <span className="text-xs text-red-600">⚠️ {attachError}</span>
              <button type="button" onClick={() => setAttachError(null)} className="text-red-400 hover:text-red-600 ml-2 text-sm font-bold">✕</button>
            </div>
          )}

          {/* Attachment preview strip */}
          {attachedFile && (
            <div className="mx-4 mt-3 flex items-center gap-3 px-3 py-2 bg-indigo-50 border border-indigo-200 rounded-xl">
              {attachedFile.type === 'image' && attachedFile.preview ? (
                <img src={attachedFile.preview} alt={attachedFile.name} className="w-12 h-12 object-cover rounded-lg border border-indigo-300 flex-shrink-0" />
              ) : (
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">{attachedFile.mimeType.includes('pdf') ? '📕' : '📝'}</span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-indigo-800 truncate">{attachedFile.name}</p>
                <p className="text-xs text-indigo-500 mt-0.5">{formatSize(attachedFile.size)} · {attachedFile.type === 'image' ? 'Imagem' : 'Documento'}</p>
              </div>
              <button type="button"
                onClick={removeAttachment}
                className="w-6 h-6 rounded-full bg-indigo-200 hover:bg-indigo-300 text-indigo-700 flex items-center justify-center text-xs font-bold flex-shrink-0 transition-colors"
                title="Remover anexo"
              >✕</button>
            </div>
          )}

          <div className="p-4">
            {isLimitReached && (
              <div className="mb-3 text-center text-xs text-amber-600 bg-amber-50 rounded-lg py-2 px-3">
                ⚠️ Limite diário de {dailyLimit} mensagens atingido. <a href="/dashboard/planos" className="underline font-medium">Fazer upgrade</a>
              </div>
            )}

            <div className="flex gap-2 items-end">
              {/* Attach button */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={handleFileInputChange}
                className="hidden"
              />
              <button type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={loading || !features.aiAssistantEnabled || isLimitReached}
                title="Anexar arquivo (imagem, PDF ou Word)"
                className={`flex-shrink-0 w-11 h-11 rounded-xl border flex items-center justify-center transition-colors ${
                  attachedFile
                    ? 'bg-indigo-100 border-indigo-300 text-indigo-600'
                    : 'bg-white border-gray-200 text-gray-400 hover:border-indigo-300 hover:text-indigo-500'
                } disabled:opacity-40 disabled:cursor-not-allowed`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/>
                </svg>
              </button>

              {/* Text area */}
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={textareaPlaceholder}
                className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none disabled:bg-gray-50 disabled:text-gray-400"
                rows={2}
                disabled={loading || !features.aiAssistantEnabled || isLimitReached}
              />

              {/* Send button */}
              <button type="button"
                onClick={() => handleSend()}
                disabled={!canSend}
                className="flex-shrink-0 w-11 h-11 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                </svg>
              </button>
            </div>

            <p className="text-xs text-gray-400 mt-2 text-center">
              Arraste arquivos para a conversa · Suporta imagens, PDF e Word (máx. 10 MB)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
