import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { questionBank, normalizeStr, matchesArea } from '@/lib/questionBank';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

const EXAM_SOURCES = 'ENEM (2005-2025), FUVEST (2005-2025), UNESP (2005-2025), UNICAMP (2005-2025), VUNESP (2005-2025), OAB (2006-2025), CPA-20 (2006-2025), CESPE/CEBRASPE, INSS, Concursos Federais, ESPCEX (2010-2025), AFA (2010-2025), EFOMM (2010-2025), ESA (2010-2025), EsFCEx, FN (2010-2025)';

// All available subject areas - used for random selection when area='Todas'
const ALL_AREAS = [
  'Matematica','Portugues','Historia','Fisica','Quimica','Biologia',
  'Geografia','Redacao','Direito Constitucional','Direito Civil',
  'Direito Penal','Direito Trabalhista','Investimentos',
  'Matematica Financeira','Financas Pessoais','Ingles','Espanhol'
];

export async function POST(request: NextRequest) {
  try {
    const { area, difficulty, excludeTexts, vestibular, context } = await request.json();
    const excluded: string[] = excludeTexts || [];

    // If area is "Todas", pick a RANDOM area server-side for genuine randomization
    const effectiveArea = area === 'Todas'
      ? ALL_AREAS[Math.floor(Math.random() * ALL_AREAS.length)]
      : area;

    // Try Claude AI first - primary source for unlimited unique questions
    try {
      const diffDisplay = difficulty === 'Todas' ? 'aleatória (Facil, Medio ou Dificil)' : difficulty;
      const excludeHint = excluded.length > 0
        ? `\n\nNAO repita estas questões já exibidas:\n${excluded.slice(-5).map((t,i) => `${i+1}. ${t.substring(0,80)}`).join('\n')}`
        : '';
      const vestibularCtx = vestibular ? ` Priorize estilo ${vestibular}.` : '';
      const contextHint = context ? ` Contexto: ${context}.` : '';
      const randomSeed = Math.floor(Math.random() * 999999);

      const prompt = `Você é um gerador especializado em questões de vestibular e concurso público brasileiro. Gere UMA questão ORIGINAL e INÉDITA de múltipla escolha (4 alternativas: A, B, C, D).

MATÉRIA OBRIGATÓRIA: "${effectiveArea}"
DIFICULDADE: ${diffDisplay}
FONTES: ${EXAM_SOURCES}
SEED ÚNICO: ${randomSeed}
${excludeHint}${vestibularCtx}${contextHint}

REGRA ABSOLUTA: A questão deve ser EXCLUSIVAMENTE sobre "${effectiveArea}".
- "Física" → apenas Física (mecânica, termodinâmica, eletricidade, óptica, ondas, física moderna)
- "Química" → apenas Química (orgânica, inorgânica, físico-química, bioquímica)
- "Direito Constitucional" → apenas Direito Constitucional (CF/88, direitos fundamentais, organização do Estado)
- "Inglês" → apenas língua inglesa (gramática, compreensão textual, vocabulário)
- NUNCA misture matérias. O campo "subject" deve ser EXATAMENTE "${effectiveArea}"

INSTRUÇÕES:
1. Questão NOVA e ORIGINAL, inspirada nos exames: ${EXAM_SOURCES}
2. Inclua fonte entre parênteses no enunciado: "(ENEM 2023 - adaptada)" ou "(FUVEST 2019 - adaptada)"
3. 4 alternativas plausíveis, apenas 1 correta
4. Explicação clara e didática
5. Nível adequado à dificuldade solicitada

Retorne APENAS JSON válido (sem markdown, sem \`\`\`json):
{"text":"enunciado completo?","options":["A","B","C","D"],"correctAnswer":0,"explanation":"explicação","subject":"${effectiveArea}","difficulty":"${difficulty === 'Todas' ? 'Medio' : difficulty}","source":"ENEM 2024 (adaptada)"}`;

      const claudeResult = await anthropic.messages.create({
        model: 'claude-haiku-4-5',
        max_tokens: 1200,
        messages: [{ role: 'user', content: prompt }],
      });

      const text = claudeResult.content[0].type === 'text' ? claudeResult.content[0].text : '';
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const q = JSON.parse(jsonMatch[0]);
        if (
          q.text && q.options && q.options.length === 4 &&
          typeof q.correctAnswer === 'number' && q.correctAnswer >= 0 && q.correctAnswer <= 3 &&
          !excluded.includes(q.text)
        ) {
          q.subject = effectiveArea; // Always force the correct subject
          q.id = `ai_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          return NextResponse.json({ question: q });
        }
      }
    } catch (aiError) {
      console.log('AI unavailable, using question bank:', aiError);
    }

    // Fallback: local question bank
    let pool = questionBank.filter(q => matchesArea(q.subject, effectiveArea));
    let filtered = pool.filter(q => !excluded.includes(q.text));
    if (filtered.length === 0) filtered = [...pool];
    if (filtered.length === 0) filtered = [...questionBank];

    if (difficulty && difficulty !== 'Todas') {
      const normDiff = normalizeStr(difficulty);
      const byDiff = filtered.filter(q => normalizeStr(q.difficulty) === normDiff);
      if (byDiff.length > 0) filtered = byDiff;
    }

    const randomQ = filtered[Math.floor(Math.random() * filtered.length)];
    return NextResponse.json({
      question: {
        ...randomQ,
        subject: effectiveArea,
        id: `bank_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      }
    });
  } catch (error) {
    console.error('Error generating question:', error);
    return NextResponse.json({ error: 'Failed to generate question' }, { status: 500 });
  }
}
