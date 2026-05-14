'use client'

import { useState } from 'react'

const dadosSemana = [
  { dia: 'Seg', questoes: 12, acertos: 9, tempo: 45 },
  { dia: 'Ter', questoes: 18, acertos: 14, tempo: 60 },
  { dia: 'Qua', questoes: 8, acertos: 5, tempo: 30 },
  { dia: 'Qui', questoes: 22, acertos: 18, tempo: 75 },
  { dia: 'Sex', questoes: 15, acertos: 12, tempo: 50 },
  { dia: 'Sab', questoes: 25, acertos: 20, tempo: 90 },
  { dia: 'Dom', questoes: 10, acertos: 8, tempo: 35 },
]

const desempenhoPorMateria = [
  { materia: 'Matemática', acertos: 72, total: 100, cor: 'bg-blue-500' },
  { materia: 'Português', acertos: 85, total: 100, cor: 'bg-green-500' },
  { materia: 'História', acertos: 68, total: 100, cor: 'bg-yellow-500' },
  { materia: 'Física', acertos: 55, total: 100, cor: 'bg-red-500' },
  { materia: 'Química', acertos: 63, total: 100, cor: 'bg-purple-500' },
  { materia: 'Biologia', acertos: 78, total: 100, cor: 'bg-teal-500' },
]

const conquistas = [
  { icon: '🔥', nome: '7 Dias Seguidos', descricao: 'Estudou por 7 dias consecutivos', desbloqueada: true },
  { icon: '⭐', nome: 'Primeira Centena', descricao: 'Respondeu 100 questões', desbloqueada: true },
  { icon: '🎯', nome: 'Atirador de Elite', descricao: 'Taxa de acerto acima de 90%', desbloqueada: false },
  { icon: '📚', nome: 'Maratonista', descricao: 'Estudou por 30 dias consecutivos', desbloqueada: false },
  { icon: '🏆', nome: 'Top 100', descricao: 'Entrou no top 100 do ranking', desbloqueada: false },
  { icon: '💎', nome: 'Diamante', descricao: 'Completou 1000 questões', desbloqueada: false },
]

export default function DesempenhoPage() {
  const [periodoSelecionado, setPeriodoSelecionado] = useState('semana')

  const totalQuestoes = dadosSemana.reduce((sum, d) => sum + d.questoes, 0)
  const totalAcertos = dadosSemana.reduce((sum, d) => sum + d.acertos, 0)
  const taxaAcerto = Math.round((totalAcertos / totalQuestoes) * 100)
  const totalTempo = dadosSemana.reduce((sum, d) => sum + d.tempo, 0)

  const maxQuestoes = Math.max(...dadosSemana.map(d => d.questoes))

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">📈 Análise de Desempenho</h1>
        <p className="text-gray-500 mt-1">Acompanhe sua evolução nos estudos</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Questões na Semana', value: totalQuestoes, icon: '📝', cor: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Taxa de Acerto', value: `${taxaAcerto}%`, icon: '🎯', cor: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Minutos Estudados', value: totalTempo, icon: '⏱️', cor: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Sequência Atual', value: '7 dias', icon: '🔥', cor: 'text-orange-600', bg: 'bg-orange-50' },
        ].map((stat) => (
          <div key={stat.label} className={`${stat.bg} rounded-2xl p-5`}>
            <div className="text-3xl mb-2">{stat.icon}</div>
            <div className={`text-2xl font-bold ${stat.cor}`}>{stat.value}</div>
            <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Gráfico de questões por dia */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">📊 Questões por Dia (Semana)</h2>
          <div className="flex items-end gap-3 h-40">
            {dadosSemana.map((d) => (
              <div key={d.dia} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full relative" style={{ height: '120px' }}>
                  <div
                    className="w-full bg-indigo-100 rounded-t-lg absolute bottom-0"
                    style={{ height: `${(d.questoes / maxQuestoes) * 100}%` }}
                  >
                    <div
                      className="w-full bg-indigo-500 rounded-t-lg absolute bottom-0"
                      style={{ height: `${(d.acertos / d.questoes) * 100}%` }}
                    />
                  </div>
                </div>
                <span className="text-xs text-gray-500">{d.dia}</span>
                <span className="text-xs font-medium text-gray-700">{d.questoes}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-indigo-500 rounded inline-block"></span> Acertos</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-indigo-100 rounded inline-block"></span> Total</span>
          </div>
        </div>

        {/* Desempenho por matéria */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">📚 Desempenho por Matéria</h2>
          <div className="space-y-3">
            {desempenhoPorMateria.map((m) => (
              <div key={m.materia}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">{m.materia}</span>
                  <span className="text-sm font-semibold text-gray-900">{m.acertos}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className={`${m.cor} h-2 rounded-full transition-all`}
                    style={{ width: `${m.acertos}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Conquistas */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-900 mb-4">🏆 Conquistas</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {conquistas.map((c) => (
            <div
              key={c.nome}
              className={`text-center p-3 rounded-xl border ${
                c.desbloqueada
                  ? 'border-yellow-200 bg-yellow-50'
                  : 'border-gray-100 bg-gray-50 opacity-50'
              }`}
            >
              <div className="text-3xl mb-1">{c.icon}</div>
              <div className="text-xs font-semibold text-gray-900">{c.nome}</div>
              <div className="text-xs text-gray-500 mt-0.5">{c.descricao}</div>
              {c.desbloqueada && (
                <div className="text-xs text-yellow-600 mt-1 font-medium">✅ Desbloqueada</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
