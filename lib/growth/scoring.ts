// Diagnostico de Lacunas - scoring engine
// Calculates a weighted score per knowledge area from quiz answers and
// classifies each area as critical / moderate / good, so the free
// diagnostic tool (diagnostico.tirei10.com.br) can show where the user
// should focus their study time.

export type ExamKind = 'enem' | 'oab' | 'cpa' | 'concurso';
export type Difficulty = 'facil' | 'medio' | 'dificil';
export type Priority = 'critical' | 'moderate' | 'good';

export interface QuizQuestion {
  id: string;
  exam: ExamKind;
  area: string;
  difficulty: Difficulty;
  question: string;
  options: string[];
  correctOption: number;
  explanationHint?: string;
}

export interface QuizAnswer {
  questionId: string;
  area: string;
  selectedOption: number;
  correctOption: number;
  difficulty: Difficulty;
}

export interface AreaResult {
  area: string;
  score: number;
  gap: number;
  priority: Priority;
  correctCount: number;
  totalCount: number;
}

const DIFFICULTY_WEIGHT: Record<Difficulty, number> = {
  facil: 1,
  medio: 1.5,
  dificil: 2,
};

export function calculateGaps(answers: QuizAnswer[]): Record<string, AreaResult> {
  const areas = Array.from(new Set(answers.map((a) => a.area)));
  const results: Record<string, AreaResult> = {};

  for (const area of areas) {
    const areaAnswers = answers.filter((a) => a.area === area);
    const totalWeight = areaAnswers.reduce((sum, a) => sum + DIFFICULTY_WEIGHT[a.difficulty], 0);
    const correctWeight = areaAnswers
      .filter((a) => a.selectedOption === a.correctOption)
      .reduce((sum, a) => sum + DIFFICULTY_WEIGHT[a.difficulty], 0);

    const score = totalWeight > 0 ? Math.round((correctWeight / totalWeight) * 100) : 0;
    const correctCount = areaAnswers.filter((a) => a.selectedOption === a.correctOption).length;

    let priority: Priority = 'good';
    if (score < 40) {
      priority = 'critical';
    } else if (score < 70) {
      priority = 'moderate';
    }

    results[area] = {
      area,
      score,
      gap: 100 - score,
      priority,
      correctCount,
      totalCount: areaAnswers.length,
    };
  }

  return results;
}

// Builds a compact, shareable query string with the score per area so a
// result page URL like diagnostico.tirei10.com.br/resultado?exam=enem&... can
// be shared in study groups without needing a database lookup.
export function encodeResultQuery(exam: ExamKind, results: Record<string, AreaResult>): string {
  const params = new URLSearchParams();
  params.set('exam', exam);
  for (const [area, result] of Object.entries(results)) {
    params.set(area.slice(0, 2), String(result.score));
  }
  return params.toString();
}
