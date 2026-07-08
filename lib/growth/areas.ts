// Central configuration of knowledge areas per exam type, shared by the
// Diagnostico de Lacunas tool (quiz + radar) and the Cronograma generator.
import type { ExamKind } from './scoring';

export interface AreaConfig {
  key: string;
  label: string;
  shortLabel: string;
}

export const EXAM_LABELS: Record<ExamKind, string> = {
  enem: 'ENEM',
  oab: 'OAB',
  cpa: 'CPA (ANBIMA)',
  concurso: 'Concurso Publico',
};

export const EXAM_DESCRIPTIONS: Record<ExamKind, string> = {
  enem: 'Linguagens, Matematica e Ciencias da Natureza',
  oab: 'Direito Constitucional, Civil e Penal',
  cpa: 'Mercado Financeiro, Investimentos e Etica',
  concurso: 'Portugues, Raciocinio Logico e Direito Administrativo',
};

export const AREAS_BY_EXAM: Record<ExamKind, AreaConfig[]> = {
  enem: [
    { key: 'linguagens', label: 'Linguagens e Codigos', shortLabel: 'Linguagens' },
    { key: 'matematica', label: 'Matematica', shortLabel: 'Matematica' },
    { key: 'ciencias_natureza', label: 'Ciencias da Natureza', shortLabel: 'Ciencias' },
  ],
  oab: [
    { key: 'constitucional', label: 'Direito Constitucional', shortLabel: 'Constitucional' },
    { key: 'civil', label: 'Direito Civil', shortLabel: 'Civil' },
    { key: 'penal', label: 'Direito Penal', shortLabel: 'Penal' },
  ],
  cpa: [
    { key: 'mercado_financeiro', label: 'Sistema Financeiro Nacional', shortLabel: 'Mercado' },
    { key: 'investimentos', label: 'Fundos e Produtos de Investimento', shortLabel: 'Investimentos' },
    { key: 'etica', label: 'Etica e Regulacao', shortLabel: 'Etica' },
  ],
  concurso: [
    { key: 'portugues', label: 'Lingua Portuguesa', shortLabel: 'Portugues' },
    { key: 'raciocinio_logico', label: 'Raciocinio Logico', shortLabel: 'Raciocinio' },
    { key: 'direito_administrativo', label: 'Direito Administrativo', shortLabel: 'Direito Adm.' },
  ],
};

export function getAreaLabel(exam: ExamKind, areaKey: string): string {
  const found = AREAS_BY_EXAM[exam]?.find((a) => a.key === areaKey);
  return found?.shortLabel ?? areaKey;
}
