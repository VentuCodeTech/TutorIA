'use client'

import { useState } from 'react'

const topicos_iniciais = [
  {
    id: '1',
    autor: 'Ana Silva',
    avatar: 'A',
    titulo: 'Dicas para a redação do ENEM 2025',
    conteudo: 'Pessoal, estou compilando as principais dicas para a redação do ENEM. Quem tiver mais sugestões, por favor compartilhe!',
    materia: 'Redação',
    curtidas: 24,
    respostas: 8,
    data: '2025-05-10',
    tags: ['ENEM', 'Redação', 'Dicas'],
  },
  {
    id: '2',
    autor: 'Carlos Mendes',
    avatar: 'C',
    titulo: 'Como resolver questões de probabilidade rapidamente?',
    conteudo: 'Tenho muita dificuldade com probabilidade. Alguém tem um método visual ou mnemônico para facilitar?',
    materia: 'Matemática',
    curtidas: 15,
    respostas: 12,
    data: '2025-05-12',
    tags: ['Matemática', 'Probabilidade', 'Técnicas'],
  },
  {
    id: '3',
    autor: 'Beatriz Santos',
    avatar: 'B',
    titulo: 'Resumo de Revolução Industrial - compartilhando!',
    conteudo: 'Fiz um resumo completo sobre a Revolução Industrial com mapas mentais. Posso compartilhar com quem precisar!',
    materia: 'História',
    curtidas: 31,
    respostas: 5,
    data: '2025-05-13',
    tags: ['História', 'Revolução Industrial', 'Resumo'],
  },
  {
    id: '4',
    autor: 'Ricardo Lima',
    avatar: 'R',
    titulo: 'Grupo de estudos para FUVEST - quem topa?',
    conteudo: 'Buscando pessoas motivadas para formar grupo de estudos virtual para FUVEST 2026. Foco em exatas!',
    materia: 'Geral',
    curtidas: 18,
    respostas: 22,
    data: '2025-05-14',
    tags: ['FUVEST', 'Grupo de Estudos', 'Exatas'],
  },
]

const cores = ['bg-purple-100 text-purple-600', 'bg-blue-100 text-blue-600', 'bg-green-100 text-green-600', 'bg-yellow-100 text-yellow-600', 'bg-red-100 text-red-600']

export default function ComunidadePage() {
  const [topicos, setTopicos] = useState(topicos_iniciais)
  const [novoTopico, setNovoTopico] = useState(false)
  const [titulo, setTitulo] = useState('')
  const [conteudo, setConteudo] = useState('')
  const [materia, setMateria] = useState('Geral')
  const [topicosAbertos, setTopicosAbertos] = useState<string[]>([])
  const [respostasTexto, setRespostasTexto] = useState<Record<string, string>>({})

  const materias = ['Geral', 'Matemática', 'Português', 'História', 'Física', 'Química', 'Biologia', 'Direito', 'Redação']

  const publicar = () => {
    if (!titulo.trim() || !conteudo.trim()) return
    const novo = {
      id: Date.now().toString(),
      autor: 'Você',
      avatar: 'V',
      titulo,
      conteudo,
      materia,
      curtidas: 0,
      respostas: 0,
      data: new Date().toISOString().split('T')[0],
      tags: [materia],
    }
    setTopicos([novo, ...topicos])
    setTitulo('')
    setConteudo('')
    setNovoTopico(false)
  }

  const curtir = (id: string) => {
    setTopicos(prev => prev.map(t => t.id === id ? {...t, curtidas: t.curtidas + 1} : t))
  }

  const toggleTopico = (id: string) => {
    setTopicosAbertos(prev => prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id])
  }

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">💬 Comunidade</h1>
          <p className="text-gray-500 mt-1">Fórum de debates e troca de conhecimentos</p>
        </div>
        <button
          onClick={() => setNovoTopico(!novoTopico)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-all"
        >
          + Novo Tópico
        </button>
      </div>

      {novoTopico && (
        <div className="bg-white rounded-2xl border border-indigo-200 p-6 mb-6">
          <h3 className="font-semibold text-gray-900 mb-4">Criar novo tópico</h3>
          <input
            type="text"
            placeholder="Título do tópico..."
            value={titulo}
            onChange={e => setTitulo(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl mb-3 text-sm"
          />
          <div className="flex gap-3 mb-3">
            <select
              value={materia}
              onChange={e => setMateria(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-xl text-sm"
            >
              {materias.map(m => <option key={m}>{m}</option>)}
            </select>
          </div>
          <textarea
            placeholder="Descreva seu tópico, dúvida ou compartilhe conhecimento..."
            value={conteudo}
            onChange={e => setConteudo(e.target.value)}
            rows={4}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl mb-3 text-sm resize-none"
          />
          <div className="flex gap-3">
            <button onClick={publicar} className="px-5 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700">
              Publicar
            </button>
            <button onClick={() => setNovoTopico(false)} className="px-5 py-2 border border-gray-200 text-gray-600 rounded-xl text-sm hover:bg-gray-50">
              Cancelar
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {topicos.map((topico, idx) => (
          <div key={topico.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="p-5">
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm flex-shrink-0 ${cores[idx % cores.length]}`}>
                  {topico.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-gray-900">{topico.titulo}</h3>
                    <span className="text-xs text-gray-400 flex-shrink-0">{topico.data}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{topico.autor} • {topico.materia}</p>
                  <p className="text-sm text-gray-700 mt-2">{topico.conteudo}</p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {topico.tags.map(tag => (
                      <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">#{tag}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 mt-4 pt-3 border-t border-gray-100">
                <button
                  onClick={() => curtir(topico.id)}
                  className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-500 transition-colors"
                >
                  <span>❤️</span> <span>{topico.curtidas}</span>
                </button>
                <button
                  onClick={() => toggleTopico(topico.id)}
                  className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-indigo-600 transition-colors"
                >
                  <span>💬</span> <span>{topico.respostas} respostas</span>
                </button>
                <button className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-green-600 transition-colors">
                  <span>↗️</span> <span>Compartilhar</span>
                </button>
              </div>
            </div>

            {topicosAbertos.includes(topico.id) && (
              <div className="bg-gray-50 p-4 border-t border-gray-100">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold text-xs flex-shrink-0">V</div>
                  <div className="flex-1">
                    <textarea
                      placeholder="Escreva sua resposta..."
                      value={respostasTexto[topico.id] || ''}
                      onChange={e => setRespostasTexto(prev => ({...prev, [topico.id]: e.target.value}))}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm resize-none bg-white"
                    />
                    <button
                      onClick={() => {
                        if (respostasTexto[topico.id]?.trim()) {
                          setTopicos(prev => prev.map(t => t.id === topico.id ? {...t, respostas: t.respostas + 1} : t))
                          setRespostasTexto(prev => ({...prev, [topico.id]: ''}))
                        }
                      }}
                      className="mt-2 px-4 py-1.5 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700"
                    >
                      Responder
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
