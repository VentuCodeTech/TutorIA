import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { questionBank, normalizeStr, matchesArea } from '@/lib/questionBank';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

const ALL_AREAS = [
  'Matemática','Português','História','Física','Química','Biologia',
  'Geografia','Redação','Direito Constitucional','Direito Civil',
  'Direito Penal','Direito Trabalhista','Investimentos',
  'Matemática Financeira','Finanças Pessoais','Inglês','Espanhol'
];

/** Returns a random integer in [0, max) for non-security use (question shuffling). */
function randomIndex(max: number): number {
  // NOSONAR: Math.random is used here for non-security purposes (random question selection)
  return Math.floor(Math.random() * max); // NOSONAR
}

/** Selects a question from the bank based on area, difficulty and exclusions. */
function selectQuestionFromBank(effectiveArea: string, difficulty: string | undefined, excluded: string[]) {
  const pool = questionBank.filter(q => matchesArea(q.subject, effectiveArea));
  let filtered = pool.filter(q => !excluded.includes(q.text));
  if (filtered.length === 0) filtered = [...pool];
  if (difficulty && difficulty !== 'Todas') {
    const byDiff = filtered.filter(q => normalizeStr(q.difficulty) === normalizeStr(difficulty));
    if (byDiff.length > 0) filtered = byDiff;
  }
  if (filtered.length > 0) {
    return filtered[randomIndex(filtered.length)]; // NOSONAR
  }
  return null;
}

/** Parses an AI-generated JSON question from text. */
function parseAIQuestion(txt: string, effectiveArea: string) {
  const startIdx = txt.indexOf('{');
  const endIdx = txt.lastIndexOf('}');
  if (startIdx === -1 || endIdx === -1 || endIdx <= startIdx) return null;
  const jsonStr = txt.slice(startIdx, endIdx + 1);
  const q = JSON.parse(jsonStr);
  if (!q.text || q.options?.length !== 4 || typeof q.correctAnswer !== 'number') return null;
  q.subject = effectiveArea;
  q.vestibularSource = q.source || 'IA';
  q.id = 'ai_' + Date.now();
  return q;
}

export async function POST(request: NextRequest) {
  try {
    const { area, difficulty, excludeTexts } = await request.json();
    const excluded: string[] = excludeTexts || [];
    // NOSONAR: Math.random used for non-security random area selection
    const effectiveArea = area === 'Todas' ? ALL_AREAS[randomIndex(ALL_AREAS.length)] : area; // NOSONAR

    const bankQ = selectQuestionFromBank(effectiveArea, difficulty, excluded);
    if (bankQ) {
      return NextResponse.json({ question: { ...bankQ, subject: effectiveArea, vestibularSource: bankQ.source || '', id: 'bank_' + Date.now() } });
    }

    try {
      // NOSONAR: Math.random used for non-security seed generation
      const seed = randomIndex(999999); // NOSONAR
      const diff = difficulty === 'Todas' ? 'Medio' : difficulty;
      const prompt = 'Gere UMA questao de multipla escolha (A,B,C,D) EXCLUSIVAMENTE sobre "' + effectiveArea + '". Dificuldade: ' + diff + '. SEED: ' + seed + '. Inclua fonte tipo "(ENEM 2019 - adaptada)". JSON apenas: {"text":"?","options":["A","B","C","D"],"correctAnswer":0,"explanation":"...","subject":"' + effectiveArea + '","difficulty":"' + diff + '","source":"ENEM 2020 (adaptada)"}';
      const result = await anthropic.messages.create({ model: 'claude-haiku-4-5', max_tokens: 1000, messages: [{ role: 'user', content: prompt }] });
      const txt = result.content[0].type === 'text' ? result.content[0].text : '';
      const aiQ = parseAIQuestion(txt, effectiveArea);
      if (aiQ) return NextResponse.json({ question: aiQ });
    } catch (aiError) {
      console.error('AI question generation failed:', aiError);
    }

    // NOSONAR: Math.random used for non-security fallback question selection
    const fallback = questionBank[randomIndex(questionBank.length)]; // NOSONAR
    return NextResponse.json({ question: { ...fallback, subject: effectiveArea, vestibularSource: fallback.source || '', id: 'fallback_' + Date.now() } });
  } catch (error) {
    console.error('generate-question error:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
