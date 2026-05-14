'use client'

import { useState, useRef, useEffect } from 'react'

interface Mensagem {
  id: string
  tipo: 'usuario' | 'assistente'
  conteudo: string
  timestamp: Date
}

const sugestoes = [
  'Me explique a Lei de Ohm com exemplos práticos',
  'Crie um plano de estudos para o ENEM em 3 meses',
  'Quais são as principais causas da Segunda Guerra Mundial?',
  'Me faça 5 questões de probabilidade com gabarito',
  'Explique a diferença entre funções orgânicas',
  'Dicas para melhorar minha redação argumentativa',
]

export default function AssistentePage() {
  const [mensagens, setMensagens] = useState<Mensagem[]>([
    {
      id: '0',
      tipo: 'assistente',
      conteudo: 'Olá! 👋 Sou o Assistente IA do TutorIA, powered by Claude. Estou aqui para te ajudar nos estudos!\n\nPosso:\n• Explicar conceitos de qualquer matéria\n• Criar planos de estudo personalizados\n• Gerar questões para praticar\n• Tirar dúvidas sobre vestibulares\n• Ajudar com redações\n\nComo posso te ajudar hoje?',
      timestamp: new Date(),
    }
  ])
  const [input, setInput] = useState('')
  const [carregando, setCarregando] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [mensagens])

  const enviar = async (texto?: string) => {
    const mensagemTexto = texto || input.trim()
    if (!mensagemTexto || carregando) return

    const novaMensagemUsuario: Mensagem = {
      id: Date.now().toString(),
      tipo: 'usuario',
      conteudo: mensagemTexto,
      timestamp: new Date(),
    }

    setMensagens(prev => [...prev, novaMensagemUsuario])
    setInput('')
    setCarregando(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: 'Você é o Assistente IA do TutorIA, uma plataforma de estudos para vestibulares e concursos brasileiros. Responda sempre em português brasileiro. Seja didático, use exemplos práticos e adapte a linguagem ao nível do estudante. Quando criar questões, inclua sempre o gabarito comentado.',
            },
            ...mensagens.filter(m => m.tipo !== 'assistente' || m.id !== '0').map(m => ({
              role: m.tipo === 'usuario' ? 'user' : 'assistant',
              content: m.conteudo,
            })),
            { role: 'user', content: mensagemTexto },
          ],
        }),
      })

      if (!response.ok) throw new Error('Erro na API')

      const data = await response.json()
      const conteudoResposta = data.content?.[0]?.text || data.choices?.[0]?.message?.content || 'Desculpe, não consegui processar sua mensagem. Tente novamente.'

      const novaMensagemIA: Mensagem = {
        id: (Date.now() + 1).toString(),
        tipo: 'assistente',
        conteudo: conteudoResposta,
        timestamp: new Date(),
      }
      setMensagens(prev => [...prev, novaMensagemIA])
    } catch (error) {
      const errMensagem: Mensagem = {
        id: (Date.now() + 1).toString(),
        tipo: 'assistente',
        conteudo: '❌ Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, verifique sua conexão e tente novamente.',
        timestamp: new Date(),
      }
      setMensagens(prev => [...prev, errMensagem])
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-0px)]">
      {/* Header */}
      <div className="px-8 py-5 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xl">
            🤖
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Assistente IA</h1>
            <p className="text-sm text-gray-500">Powered by Claude AI • Online</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-8 py-6 space-y-4">
        {mensagens.length === 1 && (
          <div className="mb-6">
            <p className="text-sm text-gray-500 mb-3">Sugestões de perguntas:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {sugestoes.map((s, i) => (
                <button
                  key={i}
                  onClick={() => enviar(s)}
                  className="text-left p-3 border border-gray-200 rounded-xl text-sm text-gray-700 hover:border-indigo-300 hover:bg-indigo-50 transition-all"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {mensagens.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.tipo === 'usuario' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.tipo === 'assistente' && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm flex-shrink-0 mt-1">
                🤖
              </div>
            )}
            <div
              className={`max-w-2xl px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                msg.tipo === 'usuario'
                  ? 'bg-indigo-600 text-white rounded-tr-sm'
                  : 'bg-white border border-gray-200 text-gray-800 rounded-tl-sm'
              }`}
            >
              {msg.conteudo}
            </div>
          </div>
        ))}

        {carregando && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm flex-shrink-0">
              🤖
            </div>
            <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl rounded-tl-sm">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-8 py-4 border-t border-gray-200 bg-white">
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Faça uma pergunta, peça um plano de estudos, questões para praticar..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && enviar()}
            disabled={carregando}
            className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-indigo-400 disabled:opacity-50"
          />
          <button
            onClick={() => enviar()}
            disabled={!input.trim() || carregando}
            className="px-5 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Enviar ↗
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-2 text-center">Powered by Claude AI • As respostas podem conter imprecisões. Sempre verifique com fontes confiáveis.</p>
      </div>
    </div>
  )
}
