'use client';

import { useState } from 'react';
import { AREAS_BY_EXAM, EXAM_LABELS } from '@/lib/growth/areas';
import type { ExamKind } from '@/lib/growth/scoring';
import { generateSchedule, type ScheduleWeek } from '@/lib/growth/schedule-algo';
import LeadCaptureForm from '@/components/growth/LeadCaptureForm';

const EXAMS: ExamKind[] = ['enem', 'oab', 'cpa', 'concurso'];
const WEEKDAYS = [
  { value: 1, label: 'Seg' },
  { value: 2, label: 'Ter' },
  { value: 3, label: 'Qua' },
  { value: 4, label: 'Qui' },
  { value: 5, label: 'Sex' },
  { value: 6, label: 'Sab' },
  { value: 0, label: 'Dom' },
];

function defaultExamDate(): string {
  const d = new Date();
  d.setMonth(d.getMonth() + 2);
  return d.toISOString().slice(0, 10);
}

export default function CronogramaPage() {
  const [exam, setExam] = useState<ExamKind>('enem');
  const [examDate, setExamDate] = useState(defaultExamDate());
  const [hoursPerDay, setHoursPerDay] = useState(2);
  const [weakAreas, setWeakAreas] = useState<string[]>([]);
  const [studyDays, setStudyDays] = useState<number[]>([1, 2, 3, 4, 5]);
  const [weeks, setWeeks] = useState<ScheduleWeek[] | null>(null);

  const areas = AREAS_BY_EXAM[exam];

  const toggleWeak = (key: string) => {
    setWeakAreas((prev) => (prev.includes(key) ? prev.filter((a) => a !== key) : [...prev, key]));
  };

  const toggleDay = (value: number) => {
    setStudyDays((prev) => (prev.includes(value) ? prev.filter((d) => d !== value) : [...prev, value]));
  };

  const handleGenerate = () => {
    const strongAreas = areas.map((a) => a.shortLabel).filter((label) => !weakAreas.includes(label));
    const schedule = generateSchedule({
      examLabel: EXAM_LABELS[exam],
      examDate: new Date(examDate + 'T00:00:00'),
      hoursPerDay,
      weakAreas: weakAreas.length ? weakAreas : areas.map((a) => a.shortLabel),
      strongAreas,
      studyDays,
    });
    setWeeks(schedule);
  };

  const handleDownload = async () => {
    if (!weeks) return;
    const { exportSchedulePDF } = await import('@/lib/growth/pdf-gen');
    exportSchedulePDF(weeks, EXAM_LABELS[exam]);
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 50%, #ddd6fe 100%)' }}>
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-4" style={{ background: 'rgba(109,40,217,0.1)', color: '#6d28d9' }}>
            Ferramenta gratuita Tirei10
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-4" style={{ color: '#1e1b4b' }}>Gerador de Cronograma</h1>
          <p className="text-gray-600 text-lg">Monte um cronograma de estudos personalizado e baixe em PDF, gratis.</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8" style={{ border: '2px solid #ede9fe' }}>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Qual prova voce esta estudando?</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
            {EXAMS.map((e) => (
              <button
                key={e}
                onClick={() => { setExam(e); setWeakAreas([]); setWeeks(null); }}
                className={'py-2 rounded-xl text-sm font-semibold border-2 transition-all ' + (exam === e ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-gray-100 text-gray-600')}
              >
                {EXAM_LABELS[e]}
              </button>
            ))}
          </div>

          <label className="block text-sm font-semibold text-gray-700 mb-2">Data da prova</label>
          <input
            type="date"
            value={examDate}
            onChange={(e) => setExamDate(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm mb-6"
          />

          <label className="block text-sm font-semibold text-gray-700 mb-2">Horas de estudo por dia: {hoursPerDay}h</label>
          <input
            type="range"
            min={1}
            max={8}
            value={hoursPerDay}
            onChange={(e) => setHoursPerDay(Number(e.target.value))}
            className="w-full mb-6"
          />

          <label className="block text-sm font-semibold text-gray-700 mb-2">Materias que voce quer priorizar (pontos fracos)</label>
          <div className="flex flex-wrap gap-2 mb-6">
            {areas.map((area) => (
              <button
                key={area.key}
                onClick={() => toggleWeak(area.shortLabel)}
                className={'px-3 py-1.5 rounded-full text-xs font-medium border-2 transition-all ' + (weakAreas.includes(area.shortLabel) ? 'border-red-400 bg-red-50 text-red-600' : 'border-gray-100 text-gray-600')}
              >
                {area.shortLabel}
              </button>
            ))}
          </div>

          <label className="block text-sm font-semibold text-gray-700 mb-2">Dias da semana para estudar</label>
          <div className="flex flex-wrap gap-2 mb-8">
            {WEEKDAYS.map((day) => (
              <button
                key={day.value}
                onClick={() => toggleDay(day.value)}
                className={'w-12 py-2 rounded-xl text-xs font-semibold border-2 transition-all ' + (studyDays.includes(day.value) ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-gray-100 text-gray-500')}
              >
                {day.label}
              </button>
            ))}
          </div>

          <button
            onClick={handleGenerate}
            className="w-full py-4 rounded-2xl text-white font-bold text-lg shadow-lg"
            style={{ background: 'linear-gradient(135deg, #6d28d9, #9333ea)' }}
          >
            Gerar meu cronograma
          </button>
        </div>

        {weeks && (
          <div className="bg-white rounded-3xl shadow-xl p-8 mb-8" style={{ border: '2px solid #ede9fe' }}>
            <h2 className="text-xl font-bold mb-4" style={{ color: '#1e1b4b' }}>Seu cronograma esta pronto!</h2>
            <div className="grid gap-4 mb-6">
              {weeks.map((week) => (
                <div key={week.weekNumber} className="border border-gray-100 rounded-2xl p-4">
                  <p className="font-semibold text-sm mb-2" style={{ color: '#6d28d9' }}>
                    Semana {week.weekNumber}{week.isRevisionWeek ? ' - Revisao final' : ''}
                  </p>
                  <div className="grid gap-1 text-xs text-gray-600">
                    {week.days.map((day) => (
                      <p key={day.dayIndex}>
                        <span className="font-medium">{day.dayLabel}:</span> {day.blocks.map((b) => b.area + ' (' + b.minutes + 'min)').join(', ')}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={handleDownload}
              className="w-full py-3 rounded-xl font-semibold border-2 border-purple-500 text-purple-700 hover:bg-purple-50 transition-all"
            >
              Baixar PDF do cronograma
            </button>
          </div>
        )}

        {weeks && <LeadCaptureForm exam={exam} source="cronograma" />}

        <p className="text-center text-xs text-gray-400 mt-8">
          Uma ferramenta gratuita do <a href="https://www.tirei10.com.br" className="underline">Tirei10</a>.
        </p>
      </div>
    </div>
  );
}
