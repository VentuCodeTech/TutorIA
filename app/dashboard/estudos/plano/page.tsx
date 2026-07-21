'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import Chatbot from '@/components/Chatbot'
import { createClient } from '@/lib/supabase/client'

import { useUserPlan } from '@/lib/useUserPlan'
const VESTIBULARES = [
  { id: 'enem', label: 'ENEM', emoji: '📚' },
  { id: 'fuvest', label: 'FUVEST', emoji: '🏛️' },
  { id: 'unicamp', label: 'UNICAMP', emoji: '🎓' },
  { id: 'oab', label: 'OAB', emoji: '⚖️' },
  { id: 'concurso_federal', label: 'Concurso Federal', emoji: '🏛️' },
  { id: 'concurso_estadual', label: 'Concurso Estadual', emoji: '📋' },
  { id: 'cpa20', label: 'CPA ANBIMA', emoji: '💰' },
  { id: 'militar', label: 'Concurso Militar', emoji: '🎖️' },
  { id: 'medicina', label: 'Medicina (Revalida)', emoji: '🏥' },
]

// Matérias específicas por vestibular/concurso
const MATERIAS_POR_VESTIBULAR: Record<string, string[]> = {
  enem: ['Matemática', 'Português', 'Biologia', 'Física', 'Química', 'História', 'Geografia', 'Redação', 'Inglês', 'Espanhol'],
  fuvest: ['Matemática', 'Português', 'Biologia', 'Física', 'Química', 'História', 'Geografia', 'Redação'],
  unicamp: ['Matemática', 'Português', 'Biologia', 'Física', 'Química', 'História', 'Geografia', 'Redação'],
  oab: ['Direito Constitucional', 'Direito Civil', 'Direito Penal', 'Direito Trabalhista', 'Ética Profissional', 'Peças Jurídicas', 'Português'],
  concurso_federal: ['Português', 'Matemática', 'Direito Administrativo', 'Direito Constitucional', 'Atualidades', 'História', 'Geografia'],
  concurso_estadual: ['Português', 'Matemática', 'Direito Administrativo', 'Direito Constitucional', 'Atualidades', 'História', 'Geografia'],
  cpa20: ['Investimentos', 'Matemática Financeira', 'Finanças Pessoais', 'Mercado Financeiro'],
  militar: ['Matemática', 'Física', 'Química', 'Português', 'História', 'Geografia', 'Biologia'],
  medicina: ['Biologia', 'Química', 'Física', 'Matemática', 'Português'],
}

const PERGUNTAS: Record<string, { materia: string; pergunta: string; opcoes: string[] }[]> = {
  enem: [
    { materia: 'Matemática', pergunta: 'Como você se sente em relação a funções e equações?', opcoes: ['Tenho muita dificuldade', 'Entendo o básico', 'Domino bem', 'Sei muito bem'] },
    { materia: 'Português', pergunta: 'Qual sua habilidade em interpretação de textos?', opcoes: ['Preciso melhorar muito', 'Consigo entender textos simples', 'Interpreto bem a maioria', 'Excelente compreensão'] },
    { materia: 'Biologia', pergunta: 'Como está seu conhecimento em Biologia?', opcoes: ['Muito básico', 'Conheço o fundamental', 'Tenho boa base', 'Domino a matéria'] },
    { materia: 'História', pergunta: 'Qual seu nível em História e Ciências Humanas?', opcoes: ['Preciso estudar do zero', 'Conheço o básico', 'Tenho bom domínio', 'Excelente conhecimento'] },
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
    { materia: 'Investimentos', pergunta: 'Como você entende fundos de investimento?', opcoes: ['Nunca estudei', 'Conheço o básico', 'Tenho bom entendimento', 'Domino o assunto'] },
    { materia: 'Matemática Financeira', pergunta: 'Qual seu nível em matemática financeira?', opcoes: ['Iniciante', 'Básico', 'Intermediário', 'Avançado'] },
    { materia: 'Finanças Pessoais', pergunta: 'Como está seu conhecimento em compliance e ética financeira?', opcoes: ['Preciso começar', 'Conheço superficialmente', 'Tenho bom domínio', 'Domino muito bem'] },
    { materia: 'Finanças Pessoais', pergunta: 'Qual seu nível em tributação de investimentos?', opcoes: ['Nunca estudei', 'Conheço o básico', 'Entendo bem', 'Domino completamente'] },
  ],
  concurso_federal: [
    { materia: 'Português', pergunta: 'Qual seu nível em Língua Portuguesa para concursos?', opcoes: ['Iniciante', 'Básico', 'Intermediário', 'Avançado'] },
    { materia: 'Matemática', pergunta: 'Como está seu raciocínio lógico e matemático?', opcoes: ['Tenho muita dificuldade', 'Resolvo questões simples', 'Resolvo bem a maioria', 'Excelente performance'] },
    { materia: 'Direito Administrativo', pergunta: 'Qual seu conhecimento em Direito Administrativo?', opcoes: ['Nunca estudei', 'Conheço o básico', 'Tenho boa base', 'Domino o conteúdo'] },
    { materia: 'Direito Constitucional', pergunta: 'Como está seu preparo em Direito Constitucional?', opcoes: ['Começando agora', 'Conheço superficialmente', 'Tenho boa base', 'Muito preparado'] },
    { materia: 'Atualidades', pergunta: 'Com que frequência você acompanha notícias e atualidades?', opcoes: ['Raramente', 'Às vezes', 'Frequentemente', 'Diariamente'] },
  ],
  militar: [
    { materia: 'Matemática', pergunta: 'Como está seu nível em Matemática?', opcoes: ['Tenho muita dificuldade', 'Entendo o básico', 'Domino bem', 'Excelente desempenho'] },
    { materia: 'Física', pergunta: 'Qual seu nível em Física?', opcoes: ['Iniciante', 'Básico', 'Intermediário', 'Avançado'] },
    { materia: 'Português', pergunta: 'Como está seu conhecimento em Língua Portuguesa?', opcoes: ['Preciso melhorar muito', 'Conheço o básico', 'Tenho boa base', 'Excelente habilidade'] },
    { materia: 'História', pergunta: 'Qual seu nível em História e Geografia?', opcoes: ['Preciso estudar do zero', 'Conheço o básico', 'Tenho bom domínio', 'Excelente conhecimento'] },
    { materia: 'Química', pergunta: 'Como está seu conhecimento em Química?', opcoes: ['Muito básico', 'Conheço o fundamental', 'Tenho boa base', 'Domino a matéria'] },
  ],
  medicina: [
    { materia: 'Biologia', pergunta: 'Qual seu nível em Biologia?', opcoes: ['Iniciante', 'Básico', 'Intermediário', 'Avançado'] },
    { materia: 'Química', pergunta: 'Como está seu conhecimento em Química?', opcoes: ['Tenho muita dificuldade', 'Entendo o básico', 'Domino bem', 'Excelente'] },
    { materia: 'Física', pergunta: 'Qual seu nível em Física?', opcoes: ['Preciso começar', 'Básico', 'Intermediário', 'Avançado'] },
    { materia: 'Matemática', pergunta: 'Como está seu nível em Matemática?', opcoes: ['Tenho dificuldade', 'Entendo o básico', 'Domino bem', 'Excelente'] },
    { materia: 'Português', pergunta: 'Qual sua habilidade em interpretação de textos?', opcoes: ['Preciso melhorar', 'Consigo entender', 'Interpreto bem', 'Excelente'] },
  ],
}

const PERGUNTAS_PADRAO = [
  { materia: 'Matemática', pergunta: 'Como você se sente em relação à Matemática?', opcoes: ['Tenho muita dificuldade', 'Entendo o básico', 'Domino bem', 'Excelente desempenho'] },
  { materia: 'Português', pergunta: 'Qual sua habilidade em Língua Portuguesa?', opcoes: ['Preciso melhorar muito', 'Conheço o básico', 'Tenho boa base', 'Excelente habilidade'] },
  { materia: 'Ciências', pergunta: 'Como está seu conhecimento em Ciências?', opcoes: ['Muito básico', 'Conheço o fundamental', 'Tenho boa base', 'Domino as disciplinas'] },
  { materia: 'História', pergunta: 'Qual seu nível em História e Geografia?', opcoes: ['Preciso começar do zero', 'Conheço o básico', 'Tenho bom domínio', 'Excelente conhecimento'] },
  { materia: 'Dedicação', pergunta: 'Quantas horas por dia você consegue estudar?', opcoes: ['Menos de 1 hora', '1 a 2 horas', '3 a 4 horas', 'Mais de 4 horas'] },
]
interface StudyPlan {
  id: string
  vestibular: string
  materias_fracas: string[]
  materias_fortes: string[]
  ordem_estudo: string[]
  updated_at: string
  diagnostico_score: Record<string, number>
}

interface PerformanceData {
  materia: string
  total: number
  corretas: number
  taxa: number
}

function gerarRoteiro(vestibular: string, respostas: number[], perguntas: {materia:string;pergunta:string;opcoes:string[]}[]) {
  const materiasFracas: string[] = []
  const materiasFortes: string[] = []
  const score: Record<string, number> = {}
  respostas.forEach((resp, i) => {
    const mat = perguntas[i]?.materia || ''
    score[mat] = resp
    if (resp <= 1) materiasFracas.push(mat)
    else materiasFortes.push(mat)
  })
  return { materiasFracas, materiasFortes, ordemEstudo: [...materiasFracas, ...materiasFortes.filter(m => !materiasFracas.includes(m))], score }
}

// Filter performance data to only include subjects relevant to the vestibular
function filterPerformanceByVestibular(performance: PerformanceData[], vestibular: string): PerformanceData[] {
  const allowedMaterias = MATERIAS_POR_VESTIBULAR[vestibular]
  if (!allowedMaterias) return performance
  return performance.filter(p => 
    allowedMaterias.some(m => 
      m.toLowerCase() === p.materia.toLowerCase() ||
      m.toLowerCase().includes(p.materia.toLowerCase()) ||
      p.materia.toLowerCase().includes(m.toLowerCase())
    )
  )
}

// Normalize subject names to match vestibular subjects
function normalizeSubject(subject: string, vestibular: string): string | null {
  const allowedMaterias = MATERIAS_POR_VESTIBULAR[vestibular]
  if (!allowedMaterias) return subject
  // Try exact match first
  const exact = allowedMaterias.find(m => m.toLowerCase() === subject.toLowerCase())
  if (exact) return exact
  // Try partial match
  const partial = allowedMaterias.find(m => 
    m.toLowerCase().includes(subject.toLowerCase()) || 
    subject.toLowerCase().includes(m.toLowerCase())
  )
  return partial || null
}

function mergeWithPerformance(
  materiasFracas: string[],
  materiasFortes: string[],
  performance: PerformanceData[],
  vestibular: string
): { materiasFracas: string[]; materiasFortes: string[]; ordemEstudo: string[] } {
  const allowedMaterias = MATERIAS_POR_VESTIBULAR[vestibular]
  
  // Filter existing plan subjects to only include allowed ones
  const filteredFracas = allowedMaterias ? materiasFracas.filter(m => 
    allowedMaterias.some(a => a.toLowerCase() === m.toLowerCase() || a.toLowerCase().includes(m.toLowerCase()) || m.toLowerCase().includes(a.toLowerCase()))
  ) : materiasFracas
  const filteredFortes = allowedMaterias ? materiasFortes.filter(m => 
    allowedMaterias.some(a => a.toLowerCase() === m.toLowerCase() || a.toLowerCase().includes(m.toLowerCase()) || m.toLowerCase().includes(a.toLowerCase()))
  ) : materiasFortes

  const updatedFracas = filteredFracas.slice()
  const updatedFortes = filteredFortes.slice()

  // Only process performance data for allowed subjects
  const filteredPerf = filterPerformanceByVestibular(performance, vestibular)

  filteredPerf.forEach(({ materia, taxa }) => {
    const norm = materia.trim()
    if (taxa < 50) {
      if (!updatedFracas.includes(norm)) updatedFracas.push(norm)
      const fi = updatedFortes.indexOf(norm)
      if (fi >= 0) updatedFortes.splice(fi, 1)
    } else if (taxa >= 70) {
      if (!updatedFortes.includes(norm)) updatedFortes.push(norm)
      const fi = updatedFracas.indexOf(norm)
      if (fi >= 0) updatedFracas.splice(fi, 1)
    }
  })

  const seen: string[] = []
  const allMaterias = updatedFracas.concat(updatedFortes).filter(m => {
    if (seen.includes(m)) return false
    seen.push(m)
    return true
  })
  const ordemEstudo = updatedFracas.concat(allMaterias.filter(m => !updatedFracas.includes(m)))
  return { materiasFracas: updatedFracas, materiasFortes: updatedFortes, ordemEstudo }
}

export default function PlanoEstudosPage() {
  const router = useRouter()
  const supabase = createClient()
  const [etapa, setEtapa] = useState<'loading'|'selecao'|'perguntas'|'resultado'>('loading')
  const [vestibularSelecionado, setVestibularSelecionado] = useState('')
  const [perguntaAtual, setPerguntaAtual] = useState(0)
  const [respostas, setRespostas] = useState<number[]>([])
  const [resultado, setResultado] = useState<{materiasFracas:string[];materiasFortes:string[];ordemEstudo:string[]}|null>(null)
  const [loadingResult, setLoadingResult] = useState(false)
  const [savedPlan, setSavedPlan] = useState<StudyPlan|null>(null)
  const [performance, setPerformance] = useState<PerformanceData[]>([])
  const [savingPlan, setSavingPlan] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<string|null>(null)
  const [hasPerformanceUpdates, setHasPerformanceUpdates] = useState(false)

  

const { features, loading: planLoading } = useUserPlan()

if (!planLoading && !features.customStudyPlan) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50">
      <Sidebar />
      <main className="ml-64 p-8">
        <div className="max-w-2xl bg-white rounded-2xl p-10 shadow-sm border border-gray-100 text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Recurso exclusivo dos planos Student e Advanced Pro</h2>
          <p className="text-gray-500 mb-6">O Plano de Estudos Personalizado esta disponivel a partir do plano Student. Faca upgrade para desbloquear um roteiro de estudos feito sob medida para voce.</p>
          <button onClick={() => router.push('/dashboard/planos')} className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors">Ver Planos</button>
        </div>
      </main>
      <Chatbot />
    </div>
  )
}
  
  const loadPlanAndPerformance = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession()
if (!session) {
  globalThis.location.href = '/login'
    return
  }

    const userId = session.user.id

    const [planResult, qaResult] = await Promise.all([
      supabase.from('study_plans').select('*').eq('user_id', userId).order('updated_at', { ascending: false }).limit(1).maybeSingle(),
      supabase.from('question_answers').select('subject, is_correct').eq('user_id', userId),
    ])

    const perfMap: Record<string, { total: number; corretas: number }> = {}

    if (qaResult.data) {
      qaResult.data.forEach((qa: any) => {
        const area = qa.subject
        if (area && area.trim() !== '' && area !== 'Teste') {
          if (!perfMap[area]) perfMap[area] = { total: 0, corretas: 0 }
          perfMap[area].total++
          if (qa.is_correct) perfMap[area].corretas++
        }
      })
    }

    const perfData: PerformanceData[] = Object.entries(perfMap)
      .filter(([, v]) => v.total >= 3)
      .map(([materia, v]) => ({ materia, total: v.total, corretas: v.corretas, taxa: Math.round((v.corretas / v.total) * 100) }))

    setPerformance(perfData)

    if (planResult.data) {
      const plan = planResult.data as StudyPlan
      setSavedPlan(plan)
      setLastUpdated(new Date(plan.updated_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }))

      if (perfData.length > 0) {
        const merged = mergeWithPerformance(plan.materias_fracas, plan.materias_fortes, perfData, plan.vestibular)
        const sortedMergedFracas = merged.materiasFracas.slice().sort((a, b) => a.localeCompare(b, 'pt-BR'))
        const sortedPlanFracas = plan.materias_fracas.slice().sort((a, b) => a.localeCompare(b, 'pt-BR'))
        const sortedMergedFortes = merged.materiasFortes.slice().sort((a, b) => a.localeCompare(b, 'pt-BR'))
        const sortedPlanFortes = plan.materias_fortes.slice().sort((a, b) => a.localeCompare(b, 'pt-BR'))
        const changed = JSON.stringify(sortedMergedFracas) !== JSON.stringify(sortedPlanFracas) ||
          JSON.stringify(sortedMergedFortes) !== JSON.stringify(sortedPlanFortes)
        setHasPerformanceUpdates(changed)
        setResultado({ materiasFracas: merged.materiasFracas, materiasFortes: merged.materiasFortes, ordemEstudo: merged.ordemEstudo })
      } else {
        // Even without performance data, filter existing plan subjects by vestibular
        const allowed = MATERIAS_POR_VESTIBULAR[plan.vestibular]
        if (allowed) {
          const filteredFracas = plan.materias_fracas.filter(m => allowed.some(a => a.toLowerCase() === m.toLowerCase() || a.toLowerCase().includes(m.toLowerCase()) || m.toLowerCase().includes(a.toLowerCase())))
          const filteredFortes = plan.materias_fortes.filter(m => allowed.some(a => a.toLowerCase() === m.toLowerCase() || a.toLowerCase().includes(m.toLowerCase()) || m.toLowerCase().includes(a.toLowerCase())))
          const seen: string[] = []
          const allM = filteredFracas.concat(filteredFortes).filter(m => { if (seen.includes(m)) return false; seen.push(m); return true; }) // NOSONAR
          const ordemEstudo = filteredFracas.concat(allM.filter(m => !filteredFracas.includes(m)))
          setResultado({ materiasFracas: filteredFracas, materiasFortes: filteredFortes, ordemEstudo })
        } else {
          setResultado({ materiasFracas: plan.materias_fracas, materiasFortes: plan.materias_fortes, ordemEstudo: plan.ordem_estudo })
        }
      }
      setVestibularSelecionado(plan.vestibular)
      setEtapa('resultado')
    } else {
      setEtapa('selecao')
    }
  }, [supabase])

  useEffect(() => {
    loadPlanAndPerformance()
  }, [loadPlanAndPerformance])

  const savePlan = async (
    vestibular: string,
    resps: number[],
    perguntas: {materia:string;pergunta:string;opcoes:string[]}[],
    roteiro: { materiasFracas: string[]; materiasFortes: string[]; ordemEstudo: string[]; score: Record<string, number> }
  ) => {
    setSavingPlan(true)
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return

    const payload = {
      user_id: session.user.id,
      vestibular,
      answers: resps,
      materias_fracas: roteiro.materiasFracas,
      materias_fortes: roteiro.materiasFortes,
      ordem_estudo: roteiro.ordemEstudo,
      perguntas,
      diagnostico_score: roteiro.score,
      updated_at: new Date().toISOString(),
    }

    const existingPlan = await supabase.from('study_plans').select('id').eq('user_id', session.user.id).eq('vestibular', vestibular).maybeSingle()

    let error
    if (existingPlan.data?.id) {
      const result = await supabase.from('study_plans').update(payload).eq('id', existingPlan.data.id)
      error = result.error
    } else {
      const result = await supabase.from('study_plans').insert(payload)
      error = result.error
    }

    if (!error) {
      setLastUpdated(new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }))
    }
    setSavingPlan(false)
  }

  const applyPerformanceUpdates = async () => {
    if (!savedPlan || !resultado) return
    setSavingPlan(true)
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return

    await supabase.from('study_plans').update({
      materias_fracas: resultado.materiasFracas,
      materias_fortes: resultado.materiasFortes,
      ordem_estudo: resultado.ordemEstudo,
      updated_at: new Date().toISOString(),
    }).eq('id', savedPlan.id)

    setHasPerformanceUpdates(false)
    setLastUpdated(new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }))
    setSavingPlan(false)
  }

  const perguntas = PERGUNTAS[vestibularSelecionado] || PERGUNTAS_PADRAO
  const vestibularLabel = VESTIBULARES.find(v => v.id === vestibularSelecionado)?.label || vestibularSelecionado

  // Filter performance to relevant subjects for the selected vestibular
  const filteredPerformance = filterPerformanceByVestibular(performance, vestibularSelecionado)

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
      setTimeout(async () => {
        const roteiro = gerarRoteiro(vestibularSelecionado, novas, perguntas)
        setResultado({ materiasFracas: roteiro.materiasFracas, materiasFortes: roteiro.materiasFortes, ordemEstudo: roteiro.ordemEstudo })
        setEtapa('resultado')
        setLoadingResult(false)
        await savePlan(vestibularSelecionado, novas, perguntas, roteiro)
      }, 1500)
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
          <p className="text-gray-500 mt-1">Seu roteiro de estudos baseado no seu perfil e desempenho real</p>
        </div>

        {etapa === 'loading' && (
          <div className="max-w-2xl">
            <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
              <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">Carregando seu plano...</h2>
              <p className="text-gray-500">Buscando seu perfil de estudos</p>
            </div>
          </div>
        )}

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
              <p className="text-indigo-100 text-sm">Você responderá <strong>5 perguntas rápidas</strong> sobre seu nível em cada matéria do vestibular escolhido. Com base nas suas respostas e no seu <strong>desempenho real</strong> nas questões, montaremos um <strong>roteiro personalizado</strong> que se atualiza automaticamente.</p>
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
                  <button key={opcao} onClick={() => handleResponder(i)}
                    className="w-full text-left p-4 rounded-xl border-2 border-gray-200 hover:border-indigo-400 hover:bg-indigo-50 transition-all group">
                    <div className="flex items-center gap-3">
                      {(() => {
                        const optionColors = ['bg-red-100 text-red-600', 'bg-yellow-100 text-yellow-600', 'bg-blue-100 text-blue-600', 'bg-green-100 text-green-600'];
                        const optionColor = optionColors[i] || 'bg-green-100 text-green-600';
                        return <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${optionColor}`}>{String.fromCodePoint(65+i)}</span>;
                      })()}
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
              <p className="text-gray-500">Criando e salvando seu roteiro de estudos personalizado</p>
            </div>
          </div>
        )}

        {etapa === 'resultado' && resultado && (
          <div className="max-w-4xl">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl">✅</div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">Seu Roteiro de Estudos</h2>
                    <p className="text-gray-500 text-sm">
                      Para: <strong>{vestibularLabel}</strong>
                      {lastUpdated && <span className="ml-2 text-gray-400">· Atualizado: {lastUpdated}</span>}
                      {savingPlan && <span className="ml-2 text-indigo-500 text-xs">💾 Salvando...</span>}
                    </p>
                  </div>
                </div>
                <button onClick={handleReiniciar} className="text-sm text-gray-500 hover:text-indigo-600 border border-gray-200 hover:border-indigo-300 px-3 py-1.5 rounded-lg transition-colors">
                  🔄 Refazer
                </button>
              </div>

              {hasPerformanceUpdates && (
                <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-amber-800 text-sm">📊 Atualização disponível!</p>
                    <p className="text-amber-700 text-xs mt-0.5">Seu desempenho real nas questões sugere ajustes no seu plano.</p>
                  </div>
                  <button onClick={applyPerformanceUpdates} disabled={savingPlan}
                    className="bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-50 whitespace-nowrap ml-4">
                    Aplicar
                  </button>
                </div>
              )}

              {filteredPerformance.length > 0 && (
                <div className="mb-6 bg-blue-50 border border-blue-100 rounded-xl p-4">
                  <h3 className="font-bold text-blue-800 text-sm mb-3">📈 Seu desempenho real nas questões</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {filteredPerformance.slice(0, 6).map((p) => (
                      <div key={p.materia} className="bg-white rounded-lg p-2.5 border border-blue-100">
                        <p className="text-xs text-gray-600 font-medium truncate">{p.materia}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                            {(() => {
                              let barColor = 'bg-red-500';
                              if (p.taxa >= 70) barColor = 'bg-green-500';
                              else if (p.taxa >= 40) barColor = 'bg-yellow-500';
                              return <div className={`h-1.5 rounded-full ${barColor}`} style={{width: `${p.taxa}%`}}></div>;
                            })()}
                          </div>
                          {(() => {
                            let textColor = 'text-red-600';
                            if (p.taxa >= 70) textColor = 'text-green-600';
                            else if (p.taxa >= 40) textColor = 'text-yellow-600';
                            return <span className={`text-xs font-bold ${textColor}`}>{p.taxa}%</span>;
                          })()}
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5">{p.corretas}/{p.total} questões</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {resultado.materiasFracas.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-bold text-gray-700 mb-3">⚠️ Áreas que precisam de mais atenção</h3>
                  <div className="flex flex-wrap gap-2">
                    {resultado.materiasFracas.map((m) => <span key={m} className="px-3 py-1.5 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm font-medium">📌 {m}</span>)}
                  </div>
                </div>
              )}
              {resultado.materiasFortes.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-bold text-gray-700 mb-3">💪 Suas áreas mais fortes</h3>
                  <div className="flex flex-wrap gap-2">
                    {resultado.materiasFortes.map((m) => <span key={m} className="px-3 py-1.5 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm font-medium">✅ {m}</span>)}
                  </div>
                </div>
              )}
              <div className="mb-6">
                <h3 className="font-bold text-gray-700 mb-4">🗺️ Ordem ideal de estudo</h3>
                <div className="space-y-3">
                  {resultado.ordemEstudo.map((materia, i) => { // NOSONAR
                    const isFraca = resultado.materiasFracas.includes(materia)
                    const perf = filteredPerformance.find(p => p.materia.toLowerCase() === materia.toLowerCase() || p.materia.toLowerCase().includes(materia.toLowerCase()) || materia.toLowerCase().includes(p.materia.toLowerCase()))
                    return (
                      <div key={materia} className={`flex items-center gap-4 p-4 rounded-xl border ${isFraca?'border-red-200 bg-red-50':'border-green-200 bg-green-50'}`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white flex-shrink-0 ${isFraca?'bg-red-500':'bg-green-500'}`}>{i+1}</div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800">{materia}</p>
                          <p className="text-xs text-gray-500">{isFraca?'🔥 Prioridade alta - foque nessa matéria primeiro':'✨ Mantenha e aprofunde seus conhecimentos'}</p>
                          {perf && <p className="text-xs text-blue-600 mt-0.5">📊 Taxa de acerto: {perf.taxa}% ({perf.corretas}/{perf.total} questões)</p>}
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
                  <li>• Seu plano é atualizado automaticamente com base no seu desempenho</li>
                </ul>
              </div>
            </div>
            <div className="flex gap-4">
              <button onClick={handleReiniciar} className="flex-1 py-3 rounded-xl border-2 border-gray-300 text-gray-600 font-semibold hover:bg-gray-50 transition-colors">🔄 Novo Diagnóstico</button>
              <button onClick={() => router.push('/dashboard/questoes')} className="flex-1 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors">📝 Começar a Estudar</button>
            </div>
          </div>
        )}
      </main>
      <Chatbot />
    </div>
  )
}
