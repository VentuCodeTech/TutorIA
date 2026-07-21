'use client'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Sidebar from '@/components/Sidebar'
import Chatbot from '@/components/Chatbot'

const vestibulares = [
  { id: 'enem', nome: 'ENEM', descricao: 'Exame Nacional do Ensino Médio', icon: '🎓', numQuestoes: '90 questões', tempo: '5h30 por dia', anos: '2009-2023' },
  { id: 'fuvest', nome: 'FUVEST', descricao: 'Fundação Universitária para o Vestibular - USP', icon: '🏛️', numQuestoes: '90 questões', tempo: '5 horas', anos: '1977-2023' },
  { id: 'unicamp', nome: 'UNICAMP', descricao: 'Vestibular da Unicamp', icon: '🔬', numQuestoes: '96 questões', tempo: '5 horas', anos: '1987-2023' },
  { id: 'unesp', nome: 'VUNESP/UNESP', descricao: 'Vestibular da Unesp', icon: '📐', numQuestoes: '90 questões', tempo: '5 horas', anos: '1988-2023' },
  { id: 'oab', nome: 'OAB', descricao: 'Exame da Ordem dos Advogados do Brasil', icon: '⚖️', numQuestoes: '80 questões', tempo: '5 horas', anos: '2010-2023' },
  { id: 'concurso_federal', nome: 'Concursos Federais', descricao: 'INSS, Receita Federal, CGU, etc.', icon: '🏛️', numQuestoes: '120 questões', tempo: '4-5 horas', anos: 'Provas reais CESPE' },
  { id: 'concurso_estadual', nome: 'Concursos Estaduais', descricao: 'Polícia Civil, Militar, TJ, MP, etc.', icon: '🚔', numQuestoes: '100 questões', tempo: '4 horas', anos: 'Provas reais Vunesp/FCC' },
  { id: 'militares', nome: 'Carreiras Militares', descricao: 'EsMCEx, ESPCEX, AFA, EFOMM', icon: '⭐', numQuestoes: '120 questões', tempo: '5 horas', anos: '2010-2023' },
  { id: 'medicina', nome: 'Medicina', descricao: 'Vestibulares específicos de medicina', icon: '🏥', numQuestoes: '90 questões', tempo: '4 horas', anos: 'FAMERP/Santa Casa' },
  { id: 'cpa20', nome: 'CPA ANBIMA', descricao: 'Certificação ANBIMA para mercado financeiro', icon: '💰', numQuestoes: '50 questões', tempo: '2h30', anos: 'ANBIMA' },
]

const materiasPorVestibular: Record<string, string[]> = {
  enem: ['Matemática e suas Tecnologias', 'Ciências da Natureza', 'Linguagens e Códigos', 'Ciências Humanas', 'Redação'],
  fuvest: ['Português', 'Matemática', 'Química', 'Física', 'Biologia', 'História', 'Geografia', 'Inglês', 'Redação'],
  unicamp: ['Português', 'Matemática', 'Ciências', 'Humanidades', 'Redação'],
  unesp: ['Português', 'Matemática', 'Química', 'Física', 'Biologia', 'História', 'Geografia', 'Inglês'],
  oab: ['Direito Civil', 'Direito Penal', 'Direito Processual Civil', 'Direito Constitucional', 'Direito do Trabalho', 'Direito Tributário', 'Ética Profissional'],
  concurso_federal: ['Língua Portuguesa', 'Matemática/Raciocínio Lógico', 'Direito Administrativo', 'Direito Constitucional', 'Atualidades', 'Informática'],
  concurso_estadual: ['Língua Portuguesa', 'Matemática', 'Direito Constitucional', 'Direito Administrativo', 'Legislação Específica'],
  militares: ['Matemática', 'Física', 'Química', 'Português', 'História', 'Geografia', 'Inglês'],
  medicina: ['Biologia', 'Química', 'Física', 'Matemática', 'Português', 'Redação'],
  cpa20: ['Mercado Financeiro', 'Fundos de Investimento', 'Renda Fixa', 'Renda Variável', 'Derivativos', 'Ética e Regulação'],
}

export default function VestibularPage() {
  const router = useRouter()
  const [selecionado, setSelecionado] = useState<string | null>(null)
  const [materiasSelecionadas, setMateriasSelecionadas] = useState<string[]>([])
  const [salvo, setSalvo] = useState(false)
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { globalThis.location.href = '/login'; return; }
      setUserId(session.user.id)
      loadPreference(session.user.id)
      setLoading(false)
    })
  }, [])

  const loadPreference = async (uid: string) => {
    try {
      const { data } = await supabase
        .from('user_preferences')
        .select('vestibular, materias')
        .eq('user_id', uid)
        .single()
      if (data) {
        setSelecionado(data.vestibular)
        setMateriasSelecionadas(data.materias || materiasPorVestibular[data.vestibular] || [])
      } else {
        // Try localStorage fallback
        const local = localStorage.getItem('vestibular_selecionado')
        if (local) {
          const parsed = JSON.parse(local)
          if (parsed.vestibular) {
            setSelecionado(parsed.vestibular)
            setMateriasSelecionadas(parsed.materias || materiasPorVestibular[parsed.vestibular] || [])
          }
        }
      }
    } catch {}
  }

  const handleSelecionar = (id: string) => {
    setSelecionado(id)
    setMateriasSelecionadas(materiasPorVestibular[id] || [])
    setSalvo(false)
  }

  const handleSalvar = async () => {
    if (!selecionado || !userId) return

    // Save to Supabase
    await supabase
      .from('user_preferences')
      .upsert({
        user_id: userId,
        vestibular: selecionado,
        materias: materiasSelecionadas,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' })

    // Also save to localStorage for quick access
    localStorage.setItem('vestibular_selecionado', JSON.stringify({
      vestibular: selecionado,
      materias: materiasSelecionadas,
    }))

    setSalvo(true)
    setTimeout(() => setSalvo(false), 3000)
  }

  const vestibularAtual = vestibulares.find(v => v.id === selecionado)

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div></div>
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">🎯 Seletor de Vestibular/Concurso</h1>
          <p className="text-gray-500 mt-2">Escolha seu objetivo e personalize seus estudos — simulados e questões serão gerados com base na sua escolha</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
          {vestibulares.map((v) => (
            <button type="button"
              key={v.id}
              onClick={() => handleSelecionar(v.id)}
              className={`p-4 rounded-2xl border-2 text-left transition-all hover:shadow-md ${
                selecionado === v.id
                  ? 'border-indigo-500 bg-indigo-50 shadow-md'
                  : 'border-gray-200 bg-white hover:border-indigo-300'
              }`}
            >
              <div className="text-3xl mb-2">{v.icon}</div>
              <div className="font-semibold text-gray-900 text-sm">{v.nome}</div>
              <div className="text-xs text-gray-500 mt-1">{v.descricao}</div>
              {selecionado === v.id && (
                <div className="mt-2 text-xs text-indigo-600 font-medium">✓ Selecionado</div>
              )}
            </button>
          ))}
        </div>

        {selecionado && vestibularAtual && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
            <div className="flex items-start justify-between flex-wrap gap-4 mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-1">
                  {vestibularAtual.icon} {vestibularAtual.nome}
                </h2>
                <p className="text-gray-500 text-sm">{vestibularAtual.descricao}</p>
              </div>
              <div className="flex gap-4 text-sm text-gray-500">
                <div className="bg-indigo-50 px-3 py-2 rounded-xl text-center">
                  <div className="font-semibold text-indigo-700">{vestibularAtual.numQuestoes}</div>
                  <div className="text-xs">na prova real</div>
                </div>
                <div className="bg-indigo-50 px-3 py-2 rounded-xl text-center">
                  <div className="font-semibold text-indigo-700">{vestibularAtual.tempo}</div>
                  <div className="text-xs">duração</div>
                </div>
              </div>
            </div>

            <h3 className="font-semibold text-gray-700 mb-3">📚 Matérias cobradas:</h3>
            <div className="flex flex-wrap gap-2 mb-6">
              {(materiasPorVestibular[selecionado] || []).map((materia) => (
                <span key={materia} className="px-3 py-1.5 rounded-lg text-sm font-medium bg-indigo-100 text-indigo-700">
                  {materia}
                </span>
              ))}
            </div>

            <div className="bg-indigo-50 rounded-xl p-4 mb-6">
              <p className="text-sm text-indigo-700">
                <strong>✨ Ao salvar:</strong> Suas questões e simulados serão personalizados para o {vestibularAtual.nome},
                com questões no estilo e nível de dificuldade da prova real.
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <button type="button"
                onClick={handleSalvar}
                className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-all"
              >
                💾 Salvar Preferência
              </button>
              <button type="button"
                onClick={() => router.push('/dashboard/simulados')}
                className="px-6 py-2.5 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-all"
              >
                🎯 Ir para Simulados
              </button>
              <button type="button"
                onClick={() => router.push(`/dashboard/questoes?vestibular=${selecionado}`)}
                className="px-6 py-2.5 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-all"
              >
                ❓ Praticar Questões
              </button>
              {salvo && <span className="text-green-600 font-medium">✅ Salvo com sucesso!</span>}
            </div>
          </div>
        )}

        {!selecionado && (
          <div className="text-center py-12 text-gray-400">
            <div className="text-5xl mb-4">🎯</div>
            <p className="text-lg">Selecione um vestibular ou concurso para personalizar seus estudos</p>
            <p className="text-sm mt-2">Questões e simulados serão gerados baseados na prova real do seu objetivo</p>
          </div>
        )}
      </main>
      <Chatbot />
    </div>
  )
}
