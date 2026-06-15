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

export async function POST(request: NextRequest) {
  try {
    const { area, difficulty, excludeTexts } = await request.json();
    const excluded: string[] = excludeTexts || [];
    const effectiveArea = area === 'Todas' ? ALL_AREAS[Math.floor(Math.random() * ALL_AREAS.length)] : area;
    let pool = questionBank.filter(q => matchesArea(q.subject, effectiveArea));
    let filtered = pool.filter(q => !excluded.includes(q.text));
    if (filtered.length === 0) filtered = [...pool];
    if (difficulty && difficulty !== 'Todas') {
      const byDiff = filtered.filter(q => normalizeStr(q.difficulty) === normalizeStr(difficulty));
      if (byDiff.length > 0) filtered = byDiff;
    }
    if (filtered.length > 0) {
      const randomQ = filtered[Math.floor(Math.random() * filtered.length)];
      return NextResponse.json({ question: { ...randomQ, subject: effectiveArea, vestibularSource: randomQ.source || '', id: 'bank_' + Date.now() } });
    }
    try {
      const seed = Math.floor(Math.random() * 999999);
      const diff = difficulty === 'Todas' ? 'Medio' : difficulty;
      const prompt = 'Gere UMA questao de multipla escolha (A,B,C,D) EXCLUSIVAMENTE sobre "' + effectiveArea + '". Dificuldade: ' + diff + '. SEED: ' + seed + '. Inclua fonte tipo "(ENEM 2019 - adaptada)". JSON apenas: {"text":"?","options":["A","B","C","D"],"correctAnswer":0,"explanation":"...","subject":"' + effectiveArea + '","difficulty":"' + diff + '","source":"ENEM 2020 (adaptada)"}';
      const result = await anthropic.messages.create({ model: 'claude-haiku-4-5', max_tokens: 1000, messages: [{ role: 'user', content: prompt }] });
      const txt = result.content[0].type === 'text' ? result.content[0].text : '';
      const match = txt.match(/\{[\s\S]*\}/);
      if (match) {
        const q = JSON.parse(match[0]);
        if (q.text && q.options?.length === 4 && typeof q.correctAnswer === 'number') {
          q.subject = effectiveArea;
          q.vestibularSource = q.source || 'IA';
          q.id = 'ai_' + Date.now();
          return NextResponse.json({ question: q });
        }
      }
    } catch (e) { console.log('AI failed:', e); }
    const fallback = questionBank[Math.floor(Math.random() * questionBank.length)];
    return NextResponse.json({ question: { ...fallback, subject: effectiveArea, vestibularSource: fallback.source || '', id: 'fallback_' + Date.now() } });
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
