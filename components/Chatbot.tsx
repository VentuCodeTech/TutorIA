'use client'

import { useState, useRef, useEffect } from 'react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const FAQ_RESPONSES: Record<string, string> = {
  'plano': 'Temos 4 planos: Gratis (basico, 10 questoes/dia), Standard (R$19,90/mes - questoes ilimitadas), Student (R$49,90/mes - recursos avancados) e Advanced Pro (R$99,90/mes - experiencia completa com IA 24/7).',
  'preco': 'Nossos precos sao: Gratis (R$0), Standard (R$19,90/mes), Student (R$49,90/mes) e Advanced Pro (R$99,90/mes). Todos os planos pagos tem cancelamento gratuito a qualquer momento.',
  'cancelar': 'Voce pode cancelar sua assinatura a qualquer momento, sem taxa de cancelamento. Acesse as configuracoes da sua conta ou entre em contato conosco.',
  'pagamento': 'Aceitamos cartoes de credito e debito via Stripe. No modo teste, use o cartao 4242 4242 4242 4242 com qualquer data futura e CVV.',
  'google': 'Para fazer login com Google, clique no botao "Entrar com Google" na pagina de login. Voce sera redirecionado para autorizar o acesso.',
  'senha': 'Para redefinir sua senha, clique em "Esqueci minha senha" na pagina de login. Voce recebera um email com instrucoes.',
  'enem': 'Sim! Temos questoes e simulados especificos para ENEM, OAB, Concursos Publicos e CPA-20.',
  'ia': 'Nossa IA adapta as questoes ao seu nivel, gera explicacoes personalizadas e acompanha seu progresso de forma inteligente.',
  'suporte': 'Estou aqui para ajudar! Voce pode me perguntar sobre planos, pagamentos, funcionalidades ou qualquer duvida sobre o TutorIA.',
  'funcionalidade': 'O TutorIA oferece: questoes adaptativas por IA, explicacoes personalizadas, simulados cronometrados, historico de desempenho, planejamento de estudos e muito mais!',
}

function getBotResponse(message: string): string {
  const lowerMsg = message.toLowerCase()
  
  for (const [key, response] of Object.entries(FAQ_RESPONSES)) {
    if (lowerMsg.includes(key)) {
      return response
    }
  }
  
  if (lowerMsg.includes('ola') || lowerMsg.includes('oi') || lowerMsg.includes('bom dia') || lowerMsg.includes('boa tarde')) {
    return 'Ola! Bem-vindo ao TutorIA! Como posso ajudar voce hoje? Posso responder perguntas sobre planos, pagamentos, funcionalidades e muito mais.'
  }
  
  if (lowerMsg.includes('obrigad') || lowerMsg.includes('valeu')) {
    return 'De nada! Fico feliz em ajudar. Se tiver mais alguma duvida, estou aqui!'
  }
  
  return 'Entendi sua mensagem! Para assuntos mais complexos, nossa equipe de suporte pode ajudar. Posso responder perguntas sobre: planos e precos, pagamento, cancelamento, funcionalidades do app, login com Google, preparacao para ENEM/OAB/Concursos. O que voce gostaria de saber?'
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Ola! Sou o assistente do TutorIA. Como posso ajudar voce hoje?'
    }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim()) return

    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setIsTyping(true)

    // Simulate response delay
    setTimeout(() => {
      const response = getBotResponse(userMessage)
      setMessages(prev => [...prev, { role: 'assistant', content: response }])
      setIsTyping(false)
    }, 800)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat window */}
      {isOpen && (
        <div className="mb-4 bg-white rounded-2xl shadow-2xl border border-gray-100 w-80 sm:w-96 flex flex-col overflow-hidden" style={{ height: '480px' }}>
          {/* Header */}
          <div className="bg-indigo-600 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-white font-semibold text-sm">Suporte TutorIA</p>
                <p className="text-indigo-200 text-xs">Online agora</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && (
                  <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center mr-2 flex-shrink-0 mt-1">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
                <div
                  className={`max-w-xs px-3 py-2 rounded-2xl text-sm ${
                    msg.role === 'user'
                      ? 'bg-indigo-600 text-white rounded-tr-sm'
                      : 'bg-white text-gray-800 shadow-sm rounded-tl-sm'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="bg-white px-3 py-2 rounded-2xl shadow-sm rounded-tl-sm">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick questions */}
          <div className="px-3 py-2 bg-white border-t border-gray-100 flex gap-2 overflow-x-auto">
            {['Planos', 'Pagamento', 'Cancelar', 'ENEM'].map((q) => (
              <button
                key={q}
                onClick={() => { setInput(q); }}
                className="flex-shrink-0 text-xs bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full hover:bg-indigo-100 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="p-3 bg-white border-t border-gray-100 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Digite sua mensagem..."
              className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim()}
              className="bg-indigo-600 text-white p-2 rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-indigo-600 hover:bg-indigo-700 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110"
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
          </svg>
        )}
      </button>
    </div>
  )
}