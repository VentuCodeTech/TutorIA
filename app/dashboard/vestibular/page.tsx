'use client'
import { useRouter } from 'next/navigation'

import { useState } from 'react'
import Sidebar from '@/components/Sidebar'
import Chatbot from '@/components/Chatbot'

const vestibulares = [
  { id: 'enem', nome: 'ENEM', descricao: 'Exame Nacional do Ensino Medio', icon: '🎓' },
  { id: 'fuvest', nome: 'FUVEST', descricao: 'Fundacao Universitaria para o Vestibular - USP', icon: '🏛' },
  { id: 'unicamp', nome: 'UNICAMP', descricao: 'Vestibular da Unicamp', icon: '🔬' },
  { id: 'unesp', nome: 'VUNESP/UNESP', descricao: 'Vestibular da Unesp', icon: '📐' },
  { id: 'oab', nome: 'OAB', descricao: 'Exame da Ordem dos Advogados do Brasil', icon: '⚖' },
  { id: 'concurso_federal', nome: 'Concursos Federais', descricao: 'INSS, Receita Federal, CGU, etc.', icon: '🏛' },
  { id: 'concurso_estadual', nome: 'Concursos Estaduais', descricao: 'Policia Civil, Militar, TJ, MP, etc.', icon: '🚔' },
  { id: 'militares', nome: 'Carreiras Militares', descricao: 'EsMCEx, ESPCEX, AFA, EFOMM', icon: '⭐' },
  { id: 'medicina', nome: 'Medicina', descricao: 'Vestibulares especificos de medicina', icon: '🏥' },
]

const materiasPorVestibular: Record<string, string[]> = {
  enem: ['Matematica e suas Tecnologias', 'Ciencias da Natureza', 'Linguagens e Codigos', 'Ciencias Humanas', 'Redacao'],
  fuvest: ['Portugues', 'Matematica', 'Quimica', 'Fisica', 'Biologia', 'Historia', 'Geografia', 'Ingles', 'Redacao'],
  unicamp: ['Portugues', 'Matematica', 'Ciencias', 'Humanidades', 'Redacao'],
  unesp: ['Portugues', 'Matematica', 'Quimica', 'Fisica', 'Biologia', 'Historia', 'Geografia', 'Ingles'],
  oab: ['Direito Civil', 'Direito Penal', 'Direito Processual', 'Direito Constitucional', 'Direito do Trabalho', 'Etica Profissional'],
  concurso_federal: ['Lingua Portuguesa', 'Matematica/Raciocinio Logico', 'Direito Administrativo', 'Atualidades', 'Informatica'],
  concurso_estadual: ['Lingua Portuguesa', 'Matematica', 'Direito Constitucional', 'Direito Administrativo', 'Legislacao Especifica'],
  militares: ['Matematica', 'Fisica', 'Quimica', 'Portugues', 'Historia', 'Geografia', 'Ingles'],
  medicina: ['Biologia', 'Quimica', 'Fisica', 'Matematica', 'Portugues', 'Redacao'],
}

export default function VestibularPage() {
  const router = useRouter()
  const [selecionado, setSelecionado] = useState<string | null>(null)
  const [materiasSelecionadas, setMateriasSelecionadas] = useState<string[]>([])
  const [salvo, setSalvo] = useState(false)

  const handleSelecionar = (id: string) => {
    setSelecionado(id)
    setMateriasSelecionadas(materiasPorVestibular[id] || [])
    setSalvo(false)
  }

  const handleSalvar = () => {
    localStorage.setItem('vestibular_selecionado', JSON.stringify({
      vestibular: selecionado,
      materias: materiasSelecionadas,
    }))
    setSalvo(true)
    setTimeout(() => setSalvo(false), 3000)
  }

  const vestibularAtual = vestibulares.find(v => v.id === selecionado)

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">🎯 Seletor de Vestibular/Concurso</h1>
          <p className="text-gray-500 mt-2">Escolha seu objetivo e personalize seus estudos</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
          {vestibulares.map((v) => (
            <button
              key={v.id}
              onClick={() => handleSelecionar(v.id)}
              className={`p-4 rounded-2xl border-2 text-left transition-all hover:shadow-md ${
                selecionado === v.id
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-gray-200 bg-white hover:border-indigo-300'
              }`}
            >
              <div className="text-3xl mb-2">{v.icon}</div>
              <div className="font-semibold text-gray-900 text-sm">{v.nome}</div>
              <div className="text-xs text-gray-500 mt-1">{v.descricao}</div>
            </button>
          ))}
        </div>

        {selecionado && vestibularAtual && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-1">
              {vestibularAtual.icon} {vestibularAtual.nome}
            </h2>
            <p className="text-gray-500 mb-6">{vestibularAtual.descricao}</p>
            <h3 className="font-semibold text-gray-700 mb-3">Materias do Concurso:</h3>
            <div className="flex flex-wrap gap-2 mb-6">
              {(materiasPorVestibular[selecionado] || []).map((materia) => (
                <span key={materia} className="px-3 py-1.5 rounded-lg text-sm font-medium bg-indigo-100 text-indigo-700">
                  {materia}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleSalvar}
                className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-all"
              >
                Salvar Preferencias
              </button>
              {salvo && <span className="text-green-600 font-medium">Salvo com sucesso!</span>}
            </div>
          </div>
        )}

        {!selecionado && (
          <div className="text-center py-12 text-gray-400">
            <div className="text-5xl mb-4">🎯</div>
            <p className="text-lg">Selecione um vestibular ou concurso para personalizar seus estudos</p>
          </div>
        )}
      </main>
      <Chatbot />
    </div>
  )
}
