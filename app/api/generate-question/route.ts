import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { questionBank, normalizeStr, matchesArea } from '@/lib/questionBank';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

// Vestibulares e concursos para referenciar no prompt
const EXAM_SOURCES = 'ENEM (2005-2025), FUVEST (2005-2025), UNESP (2005-2025), UNICAMP (2005-2025), VUNESP (2005-2025), OAB (2006-2025), CPA-20 (2006-2025), CESPE/CEBRASPE, INSS, Concursos Federais, ESPCEX (2010-2025), AFA (2010-2025), EFOMM (2010-2025), ESA (2010-2025), EsFCEx, FN (2010-2025)';

export async function POST(request: NextRequest) {
  try {
    const { area, difficulty, excludeTexts, vestibular, context } = await request.json();
    const excluded: string[] = excludeTexts || [];

    // Try Claude AI first - primary source for unlimited unique questions
    try {
      const areaDisplay = area === 'Todas' ? 'qualquer matéria' : area;
      const diffDisplay = difficulty === 'Todas' ? 'aleatória (Facil, Medio ou Dificil)' : difficulty;
      const excludeHint = excluded.length > 0
        ? `\n\nNAO repita estas questoes (já foram geradas):\n${excluded.slice(-5).map((t,i) => `${i+1}. ${t.substring(0,80)}...`).join('\n')}`
        : '';
      const vestibularCtx = vestibular ? ` Priorize questões no estilo ${vestibular}.` : '';
      const contextHint = context ? ` Contexto adicional: ${context}.` : '';
      const randomSeed = Math.floor(Math.random() * 999999);

      const areaRule = area !== 'Todas'
        ? `REGRA ABSOLUTA DE ÁREA: Gere EXCLUSIVAMENTE questões de "${area}". Isso significa:\n- Se área = "Física", gere SOMENTE sobre Física (mecânica, termodinâmica, eletricidade, óptica, etc.)\n- Se área = "Direito Constitucional", gere SOMENTE sobre Direito Constitucional\n- Se área = "História", gere SOMENTE sobre História\n- NUNCA misture áreas. Uma questão de Matemática para Física ou de Português para História é INACEITÁVEL.\n- O campo "subject" deve ser EXATAMENTE "${area}"`
        : 'Escolha ALEATORIAMENTE uma matéria entre: Matemática, Português, História, Geografia, Física, Química, Biologia, Redação, Direito Constitucional, Direito Civil, Direito Penal, Direito Trabalhista, Investimentos, Matemática Financeira, Finanças Pessoais, Inglês, Espanhol.';

      const prompt = `Você é um gerador de questões de vestibular e concurso público brasileiro. Gere UMA questão ORIGINAL de múltipla escolha (4 alternativas: A, B, C, D).

ÁREA: ${areaDisplay}
DIFICULDADE: ${diffDisplay}
FONTES DE REFERÊNCIA: ${EXAM_SOURCES}
SEED (para garantir unicidade): ${randomSeed}

${areaRule}
${excludeHint}
${vestibularCtx}
${contextHint}

INSTRUÇÕES:
1. A questão deve ser NOVA e ORIGINAL, inspirada no estilo dos exames listados acima
2. Inclua o nome do exame e ano no enunciado entre parênteses, ex: "(ENEM 2019 - adaptada)"  
3. 4 alternativas plausíveis, apenas 1 correta
4. Explicação clara e didática da resposta correta
5. Nível adequado à dificuldade solicitada

Retorne APENAS JSON válido (sem markdown, sem \`\`\`):
{"text":"enunciado completo da questão?","options":["Alternativa A","Alternativa B","Alternativa C","Alternativa D"],"correctAnswer":0,"explanation":"explicação detalhada","subject":"${area === 'Todas' ? 'SUBSTITUA_PELA_MATERIA_ESCOLHIDA' : area}","difficulty":"${difficulty === 'Todas' ? 'Medio' : difficulty}","source":"ENEM 2024 (adaptada)"}`;

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
          !excluded.includes(q.text) &&
          (area === 'Todas' || matchesArea(q.subject || area, area))
        ) {
          if (area !== 'Todas' && !matchesArea(q.subject, area)) q.subject = area;
          q.id = `ai_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          return NextResponse.json({ question: q });
        }
      }
    } catch (aiError) {
      console.log('AI unavailable, using question bank:', aiError);
    }

    // Fallback: local question bank (massive static bank)
    let pool = area && area !== 'Todas'
      ? questionBank.filter(q => matchesArea(q.subject, area))
      : [...questionBank];

    // Filter excluded questions (deduplication)
    let filtered = pool.filter(q => !excluded.includes(q.text));
    if (filtered.length === 0) filtered = [...pool]; // reset if all exhausted
    if (filtered.length === 0) filtered = [...questionBank]; // last resort

    // Apply difficulty filter
    if (difficulty && difficulty !== 'Todas') {
      const normDiff = normalizeStr(difficulty);
      const byDiff = filtered.filter(q => normalizeStr(q.difficulty) === normDiff);
      if (byDiff.length > 0) filtered = byDiff;
    }

    const randomQ = filtered[Math.floor(Math.random() * filtered.length)];
    return NextResponse.json({
      question: {
        ...randomQ,
        subject: area !== 'Todas' ? area : randomQ.subject,
        id: `bank_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      }
    });
  } catch (error) {
    console.error('Error generating question:', error);
    return NextResponse.json({ error: 'Failed to generate question' }, { status: 500 });
  }
}
