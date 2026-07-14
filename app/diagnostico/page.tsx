import Link from 'next/link';
import { EXAM_LABELS, EXAM_DESCRIPTIONS } from '@/lib/growth/areas';
import type { ExamKind } from '@/lib/growth/scoring';

export const metadata = {
  title: 'Diagnostico de Lacunas Gratuito | Tirei10',
  description: 'Descubra em 5 minutos quais materias precisam de mais atencao no seu estudo para ENEM, OAB, CPA ou concursos.',
};

const EXAM_ICONS: Record<ExamKind, string> = {
  enem: '\uD83D\uDCD8',
  oab: '\u2696\uFE0F',
  cpa: '\uD83D\uDCCA',
  concurso: '\uD83C\uDFDB\uFE0F',
};

const EXAMS: ExamKind[] = ['enem', 'oab', 'cpa', 'concurso'];

export default function DiagnosticoPage() {
  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 50%, #ddd6fe 100%)' }}>
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-4" style={{ background: 'rgba(109,40,217,0.1)', color: '#6d28d9' }}>
            Ferramenta gratuita Tirei10
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-4" style={{ color: '#1e1b4b' }}>
            Diagnostico de Lacunas
          </h1>
          <p className="text-gray-600 text-lg max-w-xl mx-auto">
            Responda 9 perguntas rapidas e descubra exatamente onde focar seus estudos. Leva menos de 5 minutos e e 100% gratuito.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {EXAMS.map((exam) => (
            <Link
              key={exam}
              href={'/diagnostico/quiz/' + exam}
              className="bg-white rounded-3xl shadow-xl p-6 hover:-translate-y-1 transition-all duration-300"
              style={{ border: '2px solid #ede9fe' }}
            >
              <div className="text-3xl mb-2">{EXAM_ICONS[exam]}</div>
              <h2 className="text-xl font-bold mb-1" style={{ color: '#1e1b4b' }}>{EXAM_LABELS[exam]}</h2>
              <p className="text-sm text-gray-500">{EXAM_DESCRIPTIONS[exam]}</p>
              <span className="inline-block mt-4 text-sm font-semibold" style={{ color: '#6d28d9' }}>Comecar diagnostico -&gt;</span>
            </Link>
          ))}
        </div>

        <p className="text-center text-xs text-gray-400 mt-10">
          Uma ferramenta gratuita do <a href="https://www.tirei10.com.br" className="underline">Tirei10</a>, plataforma de estudos com IA adaptativa.
        </p>
      </div>
    </div>
  );
}
