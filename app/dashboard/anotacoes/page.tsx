'use client'

import { useState, useEffect } from 'react'

interface Anotacao {
  id: string
  titulo: string
  conteudo: string
  materia: string
  dataCriacao: string
  dataAtualizacao: string
}

const materias = ['Matemática', 'Português', 'História', 'Física', 'Química', 'Biologia', 'Direito', 'Geografia', 'Inglês', 'Geral']

export default function AnotacoesPage() {
  const [anotacoes, setAnotacoes] = useState<Anotacao[]>([])
  const [anotacaoAtual, setAnotacaoAtual] = useState<Anotacao | null>(null)
  const [modoEdicao, setModoEdicao] = useState(false)
  const [titulo, setTitulo] = useState('')
  const [conteudo, setConteudo] = useState('')
  const [materia, setMateria] = useState('Geral')
  const [filtroMateria, setFiltroMateria] = useState('Todas')
  const [busca, setBusca] = useState('')

  useEffect(() => {
    const salvas = localStorage.getItem('tutoria_anotacoes')
    if (salvas) {
      setAnotacoes(JSON.parse(salvas))
    }
  }, [])

  const salvarAnotacoes = (novas: Anotacao[]) => {
    setAnotacoes(novas)
    localStorage.setItem('tutoria_anotacoes', JSON.stringify(novas))
  }

  const criarNova = () => {
    setAnotacaoAtual(null)
    setTitulo('')
    setConteudo('')
    setMateria('Geral')
    setModoEdicao(true)
  }

  const editarAnotacao = (anotacao: Anotacao) => {
    setAnotacaoAtual(anotacao)
    setTitulo(anotacao.titulo)
    setConteudo(anotacao.conteudo)
    setMateria(anotacao.materia)
    setModoEdicao(true)
  }

  const salvar = () => {
    if (!titulo.trim()) return
    const agora = new Date().toISOString()
    
    if (anotacaoAtual) {
      const atualizadas = anotacoes.map(a =>
        a.id === anotacaoAtual.id
          ? { ...a, titulo, conteudo, materia, dataAtualizacao: agora }
          : a
      )
      salvarAnotacoes(atualizadas)
    } else {
      const nova: Anotacao = {
        id: Date.now().toString(),
        titulo,
        conteudo,
        materia,
        dataCriacao: agora,
        dataAtualizacao: agora,
      }
      salvarAnotacoes([nova, ...anotacoes])
    }
    setModoEdicao(false)
  }

  const excluir = (id: string) => {
    if (confirm('Deseja excluir esta anotação?')) {
      salvarAnotacoes(anotacoes.filter(a => a.id !== id))
      if (modoEdicao && anotacaoAtual?.id === id) {
        setModoEdicao(false)
      }
    }
  }

  const anotacoesFiltradas = anotacoes.filter(a => {
    const passaFiltro = filtroMateria === 'Todas' || a.materia === filtroMateria
    const passaBusca = !busca || a.titulo.toLowerCase().includes(busca.toLowerCase()) || a.conteudo.toLowerCase().includes(busca.toLowerCase())
    return passaFiltro && passaBusca
  })

  return (
    <div className="p-8 h-full">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">📓 Anotações</h1>
          <p className="text-gray-500 mt-1">Suas anotações de estudo salvas por conta</p>
        </div>
        <button
          onClick={criarNova}
          className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-all flex items-center gap-2"
        >
          <span>+</span> Nova Anotação
        </button>
      </div>

      <div className="flex gap-6 h-[calc(100vh-220px)]">
        {/* Lista */}
        <div className="w-80 flex-shrink-0 flex flex-col">
          <div className="mb-3 space-y-2">
            <input
              type="text"
              placeholder="Buscar anotações..."
              value={busca}
              onChange={e => setBusca(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
            />
            <select
              value={filtroMateria}
              onChange={e => setFiltroMateria(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
            >
              <option>Todas</option>
              {materias.map(m => <option key={m}>{m}</option>)}
            </select>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2">
            {anotacoesFiltradas.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <p className="text-4xl mb-2">📝</p>
                <p className="text-sm">Nenhuma anotação encontrada</p>
              </div>
            ) : (
              anotacoesFiltradas.map(a => (
                <div
                  key={a.id}
                  onClick={() => editarAnotacao(a)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all hover:shadow-sm ${
                    anotacaoAtual?.id === a.id && modoEdicao
                      ? 'border-indigo-400 bg-indigo-50'
                      : 'border-gray-200 bg-white hover:border-indigo-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 text-sm truncate">{a.titulo}</p>
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{a.conteudo}</p>
                    </div>
                    <button
                      onClick={e => { e.stopPropagation(); excluir(a.id) }}
                      className="text-gray-300 hover:text-red-500 flex-shrink-0 text-lg leading-none"
                    >×</button>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full">{a.materia}</span>
                    <span className="text-xs text-gray-400">{new Date(a.dataAtualizacao).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Editor */}
        <div className="flex-1">
          {modoEdicao ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-6 h-full flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <input
                  type="text"
                  placeholder="Título da anotação..."
                  value={titulo}
                  onChange={e => setTitulo(e.target.value)}
                  className="flex-1 text-xl font-semibold border-0 outline-none text-gray-900 placeholder-gray-300"
                />
                <select
                  value={materia}
                  onChange={e => setMateria(e.target.value)}
                  className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm"
                >
                  {materias.map(m => <option key={m}>{m}</option>)}
                </select>
              </div>
              <textarea
                placeholder="Escreva sua anotação aqui..."
                value={conteudo}
                onChange={e => setConteudo(e.target.value)}
                className="flex-1 resize-none outline-none text-gray-700 text-sm leading-relaxed"
              />
              <div className="flex gap-3 mt-4 pt-4 border-t border-gray-100">
                <button
                  onClick={salvar}
                  disabled={!titulo.trim()}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-all disabled:opacity-50"
                >
                  Salvar
                </button>
                <button
                  onClick={() => setModoEdicao(false)}
                  className="px-6 py-2 border border-gray-200 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition-all"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <div className="text-center">
                <p className="text-5xl mb-4">📓</p>
                <p className="text-lg font-medium">Selecione uma anotação para editar</p>
                <p className="text-sm mt-2">ou crie uma nova clicando em "+ Nova Anotação"</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
