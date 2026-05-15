'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
      {
              id: '1',
              role: 'assistant',
              content: 'Olá! Sou o TutorIA, seu assistente de estudos inteligente! 🎓\n\nPosso te ajudar com:\n• ENEM, OAB, Concursos Públicos e CPA-20\n• Dúvidas de qualquer matéria\n• Dicas de estudo e revisão\n\nComo posso te ajudar hoje?',
              timestamp: new Date(),
      }
        ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
        scrollToBottom();
  }, [messages]);

  useEffect(() => {
        if (isOpen && inputRef.current) {
                inputRef.current.focus();
        }
  }, [isOpen]);

  const sendMessage = async () => {
        if (!inputMessage.trim() || isLoading) return;

        const userMessage: Message = {
                id: Date.now().toString(),
                role: 'user',
                content: inputMessage.trim(),
                timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        setIsLoading(true);

        try {
                const conversationHistory = [...messages, userMessage].map(msg => ({
                          role: msg.role,
                          content: msg.content,
                }));

          const response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ messages: conversationHistory }),
          });

          if (!response.ok) {
                    throw new Error('Failed to get response');
          }

          const data = await response.json();

          const assistantMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    role: 'assistant',
                    content: data.message,
                    timestamp: new Date(),
          };

          setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
                console.error('Error sending message:', error);
                const errorMessage: Message = {
                          id: (Date.now() + 1).toString(),
                          role: 'assistant',
                          content: 'Desculpe, tive um problema ao processar sua mensagem. Por favor, tente novamente.',
                          timestamp: new Date(),
                };
                setMessages(prev => [...prev, errorMessage]);
        } finally {
                setIsLoading(false);
        }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
        }
  };

  const formatMessage = (content: string) => {
        return content.split('\n').map((line, i) => (
                <span key={i}>
                  {line}
                  {i < content.split('\n').length - 1 && <br />}
                </span>
              ));
  };

  return (
        <div className="fixed bottom-6 right-6 z-50">
          {/* Chat Window */}
          {isOpen && (
                  <div className="mb-4 bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col"
                              style={{ width: '380px', height: '520px' }}>
                  
                    {/* Header */}
                            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-t-2xl p-4 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                                      <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                                                      <span className="text-white text-lg">🎓</span>
                                                      </div>
                                                      <div>
                                                                      <p className="text-white font-bold text-sm">TutorIA</p>
                                                                      <div className="flex items-center gap-1">
                                                                                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                                                                        <p className="text-indigo-200 text-xs">IA Online • Gemini</p>
                                                                      </div>
                                                      </div>
                                        </div>
                                        <button
                                                        onClick={() => setIsOpen(false)}
                                                        className="text-white/80 hover:text-white transition-colors w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center"
                                                      >
                                                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                      </svg>
                                        </button>
                            </div>
                  
                    {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                              {messages.map((message) => (
                                              <div
                                                                key={message.id}
                                                                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                                              >
                                                {message.role === 'assistant' && (
                                                                                  <div className="w-7 h-7 bg-indigo-100 rounded-full flex items-center justify-center mr-2 mt-1 flex-shrink-0">
                                                                                                      <span className="text-xs">🎓</span>
                                                                                    </div>
                                                              )}
                                                              <div
                                                                                  className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                                                                                                        message.role === 'user'
                                                                                                          ? 'bg-indigo-600 text-white rounded-br-sm'
                                                                                                          : 'bg-white text-gray-800 shadow-sm rounded-bl-sm border border-gray-100'
                                                                                    }`}
                                                                                >
                                                                {formatMessage(message.content)}
                                                                                <p className={`text-xs mt-1 ${message.role === 'user' ? 'text-indigo-200' : 'text-gray-400'}`}>
                                                                                  {message.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                                                                </p>
                                                              </div>
                                              </div>
                                            ))}
                              {isLoading && (
                                              <div className="flex justify-start">
                                                              <div className="w-7 h-7 bg-indigo-100 rounded-full flex items-center justify-center mr-2 mt-1">
                                                                                <span className="text-xs">🎓</span>
                                                              </div>
                                                              <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm border border-gray-100">
                                                                                <div className="flex gap-1">
                                                                                                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                                                                                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                                                                                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                                                                </div>
                                                              </div>
                                              </div>
                                        )}
                                        <div ref={messagesEndRef} />
                            </div>
                  
                    {/* Input */}
                            <div className="p-3 bg-white rounded-b-2xl border-t border-gray-100">
                                        <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2">
                                                      <input
                                                                        ref={inputRef}
                                                                        type="text"
                                                                        value={inputMessage}
                                                                        onChange={(e) => setInputMessage(e.target.value)}
                                                                        onKeyPress={handleKeyPress}
                                                                        placeholder="Pergunte qualquer coisa..."
                                                                        disabled={isLoading}
                                                                        className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none"
                                                                      />
                                                      <button
                                                                        onClick={sendMessage}
                                                                        disabled={!inputMessage.trim() || isLoading}
                                                                        className="w-8 h-8 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 rounded-lg flex items-center justify-center transition-colors flex-shrink-0"
                                                                      >
                                                                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                                                      </svg>
                                                      </button>
                                        </div>
                            </div>
                  </div>
              )}
        
          {/* Toggle Button */}
              <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="w-14 h-14 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
                      >
                {isOpen ? (
                                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                ) : (
                                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                  </svg>
                      )}
              </button>
        </div>
      );
}</div>
