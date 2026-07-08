'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getQuestionsForExam } from '@/lib/growth/questions';
import { calculateGaps, type QuizAnswer } from '@/lib/growth/scoring';
import { EXAM_LABELS } from '@/lib/growth/areas';
import type { ExamKind } from '@/lib/growth/scoring';

export default function DiagnosticoQuizPage() {
  const params = useParams<{ exam: string }>();
  const router = useRouter();
  const exam = params.exam as ExamKind;
  const questions = getQuestionsForExam(exam);

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [selected, setSelected] = useState<number | null>(null);

  if (!questions.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Prova nao encontrada. <a href="/diagnostico" className="underline">Voltar</a></p>
      </div>
    );
  }

  const question = questions[step];
  const progress = Math.round(((step + 1) / questions.length) * 100);

  const handleNext = () => {
    if (selected === null) return;
    const newAnswers = [
      ...answers,
      {
        questionId: question.id,
        area: question.area,
        selectedOption: selected,
        correctOption: question.correctOption,
        difficulty: question.difficulty,
      },
    ];
    setAnswers(newAnswers);
    setSelected(null);

    if (step < questions.length - 1) {
      setStep(step + 1);
      return;
    }

    const results = calculateGaps(newAnswers);
    try {
      sessionStorage.setItem('diagnostico_result', JSON.stringify({ exam, results }));
    } catch {
      /* sessionStorage unavailable, results will be recalculated as empty on the results page */
    }
    router.push('/diagnostico/resultado');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8" style={{ background: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 50%, #ddd6fe 100%)' }}>
      <div className="max-w-xl w-full">
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2" style={{ color: '#6d28d9' }}>
            <span className="font-semibold">{EXAM_LABELS[exam]} - Pergunta {step + 1} de {questions.length}</span>
            <span className="font-bold">{progress}%</span>
          </div>
          <div className="w-full h-3 rounded-full" style={{ background: '#ddd6fe' }}>
            <div className="h-3 rounded-full transition-all duration-500" style={{ width: progress + '%', background: 'linear-gradient(90deg, #6d28d9, #9333ea)' }} />
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8" style={{ border: '2px solid #ede9fe' }}>
          <h2 className="text-xl font-bold mb-6" style={{ color: '#1e1b4b' }}>{question.question}</h2>
          <div className="grid gap-3 mb-8">
            {question.options.map((option, i) => (
              <button
                key={option}
                onClick={() => setSelected(i)}
                className={'text-left p-4 rounded-2xl border-2 transition-all duration-200 ' + (selected === i ? 'border-purple-500 shadow-md' : 'border-gray-100 hover:border-purple-200')}
                style={{ background: selected === i ? '#f5f3ff' : 'white' }}
              >
                <span className="font-medium" style={{ color: selected === i ? '#6d28d9' : '#374151' }}>{option}</span>
              </button>
            ))}
          </div>
          <button
            onClick={handleNext}
            disabled={selected === null}
            className={'w-full py-4 rounded-2xl text-white font-bold text-lg transition-all ' + (selected !== null ? 'shadow-lg' : 'opacity-50 cursor-not-allowed')}
            style={{ background: selected !== null ? 'linear-gradient(135deg, #6d28d9, #9333ea)' : '#d1d5db' }}
          >
            {step < questions.length - 1 ? 'Proxima ->' : 'Ver meu resultado'}
          </button>
        </div>
      </div>
    </div>
  );
}
