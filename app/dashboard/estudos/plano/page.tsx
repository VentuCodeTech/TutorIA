'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import Chatbot from '@/components/Chatbot'
import { createClient } from '@/lib/supabase/client'

const VESTIBULARES = [
  { id: 'enem', label: 'ENEM', emoji: '📚' },
  { id: 'fuvest', label: 'FUVEST', emoji: '🏛️' },
  { id: 'unicamp', label: 'UNICAMP', emoji: '🎓' },
  { id: 'oab', label: 'OAB', emoji: '⚖️' },
  { id: 'concurso_federal', label: 'Concurso Federal', emoji: '🏛️' },
  { id: 'concurso_estadual', label: 'Concurso Estadual', emoji: '📋' },
  { id: 'cpa20', label: 'CPA-20', emoji: '💰' },
  { id: 'militar', label: 'Concurso Militar', emoji: '🎖️' },
  { id: 'medicina', label: 'Medicina (Revalida)', emoji: '🏥' },
]

const PERGUNTAS: Record<string, { materia: string; pergunta: string; opcoes: string[] }[]> = {
  enem: [
    { materia: 'Matemática', pergunta: 'Como você se sente em relação a funções e equações?', opcoes: ['Tenho muita dificuldade', 'Entendo o básico', 'Domino bem', 'Sei muito bem'] },
    { materia: 'Português', pergunta: 'Qual sua habilidade em interpretação de textos?', opcoes: ['Preciso melhorar muito', 'Consigo entender textos simples', 'Interpreto bem a maioria', 'Excelente compreensão'] },
    { materia: 'Ciências Naturais', pergunta: 'Como está seu conhecimento em Biologia, Física e Química?', opcoes: ['Muito básico', 'Conheço o fundamental', 'Tenho boa base', 'Domino as três áreas'] },
    { materia: 'Ciências Humanas', pergunta: 'Qual seu nível em História, Geografia, Filosofia e Sociologia?', opcoes: ['Preciso estudar do zero', 'Conheço o básico', 'Tenho bom domínio', 'Excelente conhecimento'] },
    { materia: 'Redação', pergunta: 'Com que frequência você pratica redação dissertativa?', opcoes: ['Nunca pratiquei', 'Raramente', 'Ocasionalmente', 'Pratico regularmente'] },
  ],
  oab: [
    { materia: 'Direito Constitucional', pergunta: 'Qual seu nível em Direito Constitucional?', opcoes: ['Iniciante', 'Básico', 'Intermediário', 'Avançado'] },
    { materia: 'Direito Civil', pergunta: 'Como está seu conhecimento em Direito Civil?', opcoes: ['Preciso começar do zero', 'Conheço os conceitos básicos', 'Tenho boa compreensão', 'Domino muito bem'] },
    { materia: 'Direito Penal', pergunta: 'Qual seu nível em Direito Penal e Processual Penal?', opcoes: ['Iniciante', 'Básico', 'Intermediário', 'Avançado'] },
    { materia: 'Ética Profissional', pergunta: 'Como está seu conhecimento sobre o Estatuto da OAB?', opcoes: ['Nunca estudei', 'Li superficialmente', 'Estudei com profundidade', 'Domino completamente'] },
    { materia: 'Peças Jurídicas', pergunta: 'Com que frequência você treina peças jurídicas?', opcoes: ['Nunca treinei', 'Raramente', 'Ocasionalmente', 'Treino com frequência'] },
  ],
  cpa20: [
    { materia: 'Mercado Financeiro', pergunta: 'Qual seu conhecimento sobre mercado financeiro?', opcoes: ['Nenhum', 'Básico', 'Intermediário', 'Avançado'] },
    { materia: 'Fundos de Investimento', pergunta: 'Como você entende fundos de investimento?', opcoes: ['Nunca estudei', 'Conheço o básico', 'Tenho bom entendimento', 'Domino o assunto'] },
    { materia: 'Renda Fixa e Variável', pergunta: 'Qual seu nível em produtos de renda fixa e variável?', opcoes: ['Iniciante', 'Básico', 'Intermediário', 'Avançado'] },
    { materia: 'Compliance e Ética', pergunta: 'Como está seu conhecimento em compliance e ética?', opcoes: ['Preciso começar', 'Conheço superficialmente', 'Tenho bom domínio', 'Domino muito bem'] },
    { materia: 'Tributação', pergunta: 'Qual seu nível em tributação de investimentos?', opcoes: ['Nunca estudei', 'Conheço o básico', 'Entendo bem', 'Domino completamente'] },
  ],
  concurso_federal: [
    { materia: 'Português', pergunta: 'Qual seu nível em Língua Portuguesa para concursos?', opcoes: ['Iniciante', 'Básico', 'Intermediário', 'Avançado'] },
    { materia: 'Raciocínio Lógico', pergunta: 'Como está seu raciocínio lógico e matemático?', opcoes: ['Tenho muita dificuldade', 'Resolvo questões simples', 'Resolvo bem a maioria', 'Excelente performance'] },
    { materia: 'Direito Administrativo', pergunta: 'Qual seu conhecimento em Direito Administrativo?', opcoes: ['Nunca estudei', 'Conheço o básico', 'Tenho boa base', 'Domino o conteúdo'] },
    { materia: 'Conhecimentos Específicos', pergunta: 'Como está seu preparo na área específica do concurso?', opcoes: ['Começando agora', 'Conheço superficialmente', 'Tenho boa base', 'Muito preparado'] },
    { materia: 'Atualidades', pergunta: 'Com que frequência você acompanha notícias e atualidades?', opcoes: ['Raramente', 'Às vezes', 'Frequentemente', 'Diariamente'] },
  ],
}

const PERGUNTAS_PADRAO = [
  { materia: 'Matemática', pergunta: 'Como você se sente em relação à Matemática?', opcoes: ['Tenho muita dificuldade', 'Entendo o básico', 'Domino bem', 'Excelente desempenho'] },
  { materia: 'Português', pergunta: 'Qual sua habilidade em Língua Portuguesa?', opcoes: ['Preciso melhorar muito', 'Conheço o básico', 'Tenho boa base', 'Excelente habilidade'] },
  { materia: 'Ciências', pergunta: 'Como está seu conhecimento em Ciências?', opcoes: ['Muito básico', 'Conheço o fundamental', 'Tenho boa base', 'Domino as disciplinas'] },
  { materia: 'Humanidades', pergunta: 'Qual seu nível em História e Geografia?', opcoes: ['Preciso começar do zero', 'Conheço o básico', 'Tenho bom domínio', 'Excelente conhecimento'] },
  { materia: 'Dedicação', pergunta: 'Quantas horas por dia você consegue estudar?', opcoes: ['Menos de 1 hora', '1 a 2 horas', '3 a 4 horas', 'Mais de 4 horas'] },
]

function gerarRoteiro(vestibular: string, respostas: number[], perguntas: {materia:string;pergunta:string;opcoes:string[]}[]) {
  const materiasFracas: string[] = []
  const materiasFortes: string[] = []
  respostas.forEach((resp, i) => {
    const mat = perguntas[i]?.materia || ''
    if (resp <= 1) materiasFracas.push(mat)
    else materiasFortes.push(mat)
  })
  return { materiasFracas, materiasFortes, ordemEstudo: [...materiasFracas, ...materiasFortes.filter(m => !materiasFracas.includes(m))] }
}

export default function PlanoEstudosPage() {
  const router = useRouter()
  const supabase = createClient()
  const [etapa, setEtapa] = useState<'selecao'|'perguntas'|'resultado'>('selecao')
  const [vestibularSelecionado, setVestibularSelecionado] = useState('')
  const [perguntaAtual, setPerguntaAtual] = useState(0)
  const [respostas, setRespostas] = useState<number[]>([])
  const [resultado, setResultado] = useState<{materiasFracas:string[];materiasFortes:string[];ordemEstudo:string[]}|null>(null)
  const [loadingResult, setLoadingResult] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({data:{session}}) => {
      if (!session) window.location.href = '/login'
    })
  }, [])

  const perguntas = PERGUNTAS[vestibularSelecionado] || PERGUNTAS_PADRAO
  const vestibularLabel = VESTIBULARES.find(v => v.id === vestibularSelecionado)?.label || vestibularSelecionado

  const handleSelecionarVestibular = (id: string) => {
    setVestibularSelecionado(id); setEtapa('perguntas'); setPerguntaAtual(0); setRespostas([])
  }

  const handleResponder = (opcaoIndex: number) => {
    const novas = [...respostas, opcaoIndex]
    setRespostas(novas)
    if (perguntaAtual < perguntas.length - 1) {
      setPerguntaAtual(perguntaAtual + 1)
    } else {
      setLoadingResult(true)
      setTimeout(() => { setResultado(gerarRoteiro(vestibularSelecionado, novas, perguntas)); setEtapa('resultado'); setLoadingResult(false) }, 1500)
    }
  }

  const handleReiniciar = () => { setEtapa('selecao'); setVestibularSelecionado(''); setPerguntaAtual(0); setRespostas([]); setResultado(null) }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50">
      <Sidebar />
      <main className="ml-64 p-8">
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <button onClick={() => router.push('/dashboard/estudos')} className="hover:text-indigo-600 transition-colors">📚 Meus Estudos</button>
            <span>›</span>
            <span className="text-indigo-700 font-medium">🗺️ Plano de Estudos</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">🗺️ Plano de Estudos Personalizado</h1>
          <p className="text-gray-500 mt-1">Responda algumas perguntas para criarmos o melhor roteiro de estudos para você</p>
        </div>

        {etapa === 'selecao' && (
          <div className="max-w-4xl">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-2">🎯 Para qual vestibular/concurso você está se preparando?</h2>
              <p className="text-gray-500 text-sm mb-6">Selecione uma opção para personalizarmos as perguntas ao seu objetivo</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {VESTIBULARES.map(v => (
                  <button key={v.id} onClick={() => handleSelecionarVestibular(v.id)}
                    className="flex flex-col items-center gap-3 p-5 rounded-2xl border-2 border-gray-200 hover:border-indigo-400 hover:bg-indigo-50 transition-all text-center group">
                    <span className="text-4xl group-hover:scale-110 transition-transform">{v.emoji}</span>
                    <span className="text-sm font-semibold text-gray-700 group-hover:text-indigo-700">{v.label}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white">
              <h3 className="font-bold text-lg mb-2">💡 Como funciona?</h3>
              <p className="text-indigo-100 text-sm">Após selecionar seu objetivo, você responderá <strong>5 perguntas rápidas</strong> sobre seu nível em cada matéria. Com base nas suas respostas, montaremos um <strong>roteiro personalizado</strong> com a ordem ideal de estudo.</p>
            </div>
          </div>
        )}

        {etapa === 'perguntas' && !loadingResult && (
          <div className="max-w-2xl">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <span className="text-sm text-gray-500">Pergunta {perguntaAtual + 1} de {perguntas.length}</span>
                <span className="text-sm font-medium text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">{perguntas[perguntaAtual]?.materia}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
                <div className="bg-indigo-600 h-2 rounded-full transition-all duration-500" style={{width:`${(perguntaAtual/perguntas.length)*100}%`}}></div>
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-6">{perguntas[perguntaAtual]?.pergunta}</h2>
              <div className="space-y-3">
                {perguntas[perguntaAtual]?.opcoes.map((opcao, i) => (
                  <button key={i} onClick={() => handleResponder(i)}
                    className="w-full text-left p-4 rounded-xl border-2 border-gray-200 hover:border-indigo-400 hover:bg-indigo-50 transition-all group">
                    <div className="flex items-center gap-3">
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${i===0?'bg-red-100 text-red-600':i===1?'bg-yellow-100 text-yellow-600':i===2?'bg-blue-100 text-blue-600':'bg-green-100 text-green-600'}`}>{String.fromCharCode(65+i)}</span>
                      <span className="text-gray-700 group-hover:text-indigo-700 font-medium">{opcao}</span>
                    </div>
                  </button>
                ))}
              </div>
              <button onClick={handleReiniciar} className="mt-6 text-sm text-gray-400 hover:text-gray-600 transition-colors">← Voltar para seleção</button>
            </div>
          </div>
        )}

        {loadingResult && (
          <div className="max-w-2xl">
            <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
              <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">🤖 Analisando seu perfil...</h2>
              <p className="text-gray-500">Criando o roteiro de estudos personalizado para você</p>
            </div>
          </div>
        )}

        {etapa === 'resultado' && resultado && (
          <div className="max-w-4xl">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl">✅</div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Seu Roteiro de Estudos está pronto!</h2>
                  <p className="text-gray-500 text-sm">Preparado para: <strong>{vestibularLabel}</strong></p>
                </div>
              </div>
              {resultado.materiasFracas.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-bold text-gray-700 mb-3">⚠️ Áreas que precisam de mais atenção</h3>
                  <div className="flex flex-wrap gap-2">
                    {resultado.materiasFracas.map((m,i) => <span key={i} className="px-3 py-1.5 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm font-medium">📌 {m}</span>)}
                  </div>
                </div>
              )}
              {resultado.materiasFortes.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-bold text-gray-700 mb-3">💪 Suas áreas mais fortes</h3>
                  <div className="flex flex-wrap gap-2">
                    {resultado.materiasFortes.map((m,i) => <span key={i} className="px-3 py-1.5 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm font-medium">✅ {m}</span>)}
                  </div>
                </div>
              )}
              <div className="mb-6">
                <h3 className="font-bold text-gray-700 mb-4">🗺️ Ordem ideal de estudo</h3>
                <div className="space-y-3">
                  {resultado.ordemEstudo.map((materia, i) => {
                    const isFraca = resultado.materiasFracas.includes(materia)
                    return (
                      <div key={i} className={`flex items-center gap-4 p-4 rounded-xl border ${isFraca?'border-red-200 bg-red-50':'border-green-200 bg-green-50'}`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white flex-shrink-0 ${isFraca?'bg-red-500':'bg-green-500'}`}>{i+1}</div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800">{materia}</p>
                          <p className="text-xs text-gray-500">{isFraca?'🔥 Prioridade alta - foque nessa matéria primeiro':'✨ Mantenha e aprofunde seus conhecimentos'}</p>
                        </div>
                        <button onClick={() => router.push(`/dashboard/questoes?area=${encodeURIComponent(materia)}`)}
                          className={`text-sm font-medium px-4 py-2 rounded-lg ${isFraca?'bg-red-500 hover:bg-red-600':'bg-green-500 hover:bg-green-600'} text-white transition-colors`}>Estudar</button>
                      </div>
                    )
                  })}
                </div>
              </div>
              <div className="bg-indigo-50 rounded-xl p-5 border border-indigo-100">
                <h3 className="font-bold text-indigo-800 mb-2">💡 Dicas para seu sucesso</h3>
                <ul className="text-sm text-indigo-700 space-y-1">
                  <li>• Estude as matérias difíceis nas primeiras horas do dia</li>
                  <li>• Faça revisões semanais das matérias já estudadas para fixar o conteúdo</li>
                  <li>• Use a seção de Questões para praticar cada matéria após estudar</li>
                  <li>• Acompanhe seu progresso no Dashboard para ver sua evolução</li>
                </ul>
              </div>
            </div>
            <div className="flex gap-4">
              <button onClick={handleReiniciar} className="flex-1 py-3 rounded-xl border-2 border-gray-300 text-gray-600 font-semibold hover:bg-gray-50 transition-colors">🔄 Refazer Diagnóstico</button>
              <button onClick={() => router.push('/dashboard/questoes')} className="flex-1 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors">📝 Começar a Estudar</button>
            </div>
          </div>
        )}
      </main>
      <Chatbot />
    </div>
  )
}
