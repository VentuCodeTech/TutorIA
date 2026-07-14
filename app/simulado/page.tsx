'use client';

import { useState } from 'react';
import { getQuestionsForExam } from '@/lib/growth/questions';
import { EXAM_LABELS } from '@/lib/growth/areas';
import type { ExamKind } from '@/lib/growth/scoring';
import LeadCaptureForm from '@/components/growth/LeadCaptureForm';

const EXAMS: ExamKind[] = ['enem', 'oab', 'cpa', 'concurso'];

export default function SimuladoPage() {
  const [exam, setExam] = useState<ExamKind | null>(null);
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [explanation, setExplanation] = useState('');
  const [loadingExplanation, setLoadingExplanation] = useState(false);
  const [finished, setFinished] = useState(false);

  const questions = exam ? getQuestionsForExam(exam) : [];
  const question = questions[step];

  const startExam = (e: ExamKind) => {
    setExam(e);
    setStep(0);
    setSelected(null);
    setCorrectCount(0);
    setExplanation('');
    setFinished(false);
  };

  const handleAnswer = (index: number) => {
    if (selected !== null) return;
    setSelected(index);
    setExplanation('');
    if (index === question.correctOption) setCorrectCount((c) => c + 1);
  };

  const handleExplain = async () => {
    if (!question || selected === null) return;
    setLoadingExplanation(true);
    try {
      const res = await fetch('/api/explicacao', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: question.question,
          options: question.options,
          selectedOption: selected,
          correctOption: question.correctOption,
          hint: question.explanationHint,
        }),
      });
      const data = await res.json();
      setExplanation(data.explanation ?? 'Nao foi possivel gerar a explicacao agora.');
    } catch {
      setExplanation('Nao foi possivel gerar a explicacao agora.');
    } finally {
      setLoadingExplanation(false);
    }
  };

  const handleNext = () => {
    setSelected(null);
    setExplanation('');
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      setFinished(true);
    }
  };

  if (!exam) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 50%, #ddd6fe 100%)' }}>
        <div className="max-w-md w-full text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-4" style={{ background: 'rgba(109,40,217,0.1)', color: '#6d28d9' }}>
            Ferramenta gratuita Tirei10
          </div>
          <h1 className="text-3xl font-extrabold mb-6" style={{ color: '#1e1b4b' }}>Simulado Rapido com IA</h1>
          <div className="grid gap-3">
            {EXAMS.map((e) => (
              <button
                key={e}
                onClick={() => startExam(e)}
                className="bg-white rounded-2xl shadow-md p-4 font-semibold text-left px-6"
                style={{ border: '2px solid #ede9fe', color: '#1e1b4b' }}
              >
                {EXAM_LABELS[e]}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 50%, #ddd6fe 100%)' }}>
        <div className="max-w-md w-full">
          <div className="bg-white rounded-3xl shadow-xl p-8 text-center mb-6" style={{ border: '2px solid #ede9fe' }}>
            <h2 className="text-2xl font-extrabold mb-2" style={{ color: '#1e1b4b' }}>Resultado do simulado</h2>
            <p className="text-4xl font-extrabold mb-2" style={{ color: '#6d28d9' }}>{correctCount}/{questions.length}</p>
            <p className="text-gray-600">questoes corretas em {EXAM_LABELS[exam]}</p>
          </div>
          <LeadCaptureForm exam={exam} source="simulado" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8" style={{ background: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 50%, #ddd6fe 100%)' }}>
      <div className="max-w-xl w-full">
        <div className="flex justify-between text-sm mb-3" style={{ color: '#6d28d9' }}>
          <span className="font-semibold">{EXAM_LABELS[exam]} - Questao {step + 1} de {questions.length}</span>
          <span className="font-bold">Acertos: {correctCount}</span>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8" style={{ border: '2px solid #ede9fe' }}>
          <h2 className="text-xl font-bold mb-6" style={{ color: '#1e1b4b' }}>{question.question}</h2>
          <div className="grid gap-3 mb-6">
            {question.options.map((option, i) => {
              let stateClass = 'border-gray-100 hover:border-purple-200';
              if (selected !== null) {
                if (i === question.correctOption) stateClass = 'border-green-400 bg-green-50';
                else if (i === selected) stateClass = 'border-red-400 bg-red-50';
              }
              return (
                <button
                  key={option}
                  onClick={() => handleAnswer(i)}
                  disabled={selected !== null}
                  className={'text-left p-4 rounded-2xl border-2 transition-all duration-200 ' + stateClass}
                >
                  <span className="font-medium text-gray-700">{option}</span>
                </button>
              );
            })}
          </div>

          {selected !== null && selected !== question.correctOption && (
            <div className="mb-6">
              {!explanation && (
                <button
                  onClick={handleExplain}
                  disabled={loadingExplanation}
                  className="text-sm font-semibold underline"
                  style={{ color: '#6d28d9' }}
                >
                  {loadingExplanation ? 'Gerando explicacao...' : 'Ver explicacao com IA'}
                </button>
              )}
              {explanation && (
                <div className="bg-purple-50 rounded-2xl p-4 text-sm text-purple-800 mt-2">{explanation}</div>
              )}
            </div>
          )}

          <button
            onClick={handleNext}
            disabled={selected === null}
            className={'w-full py-4 rounded-2xl text-white font-bold text-lg transition-all ' + (selected !== null ? 'shadow-lg' : 'opacity-50 cursor-not-allowed')}
            style={{ background: selected !== null ? 'linear-gradient(135deg, #6d28d9, #9333ea)' : '#d1d5db' }}
          >
            {step < questions.length - 1 ? 'Proxima questao ->' : 'Ver resultado final'}
          </button>
        </div>
      </div>
    </div>
  );
}
