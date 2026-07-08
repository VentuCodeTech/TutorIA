import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

// Used by the free Simulado Rapido tool: only called when the visitor
// answers a question wrong and asks for an AI explanation, so cost stays
// near-zero (Haiku, short prompt, 1 call per wrong answer reviewed).
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

export async function POST(request: NextRequest) {
  try {
    const { question, options, selectedOption, correctOption, hint } = await request.json();

    if (!question || !Array.isArray(options)) {
      return NextResponse.json({ error: 'Dados invalidos' }, { status: 400 });
    }

    const prompt =
      'Questao: ' + question + '\n' +
      'Alternativa escolhida: ' + (options[selectedOption] ?? '') + '\n' +
      'Alternativa correta: ' + (options[correctOption] ?? '') + '\n' +
      (hint ? 'Dica de contexto: ' + hint + '\n' : '') +
      'Explique em ate 3 frases, em portugues simples e direto, por que a alternativa correta esta certa e qual o erro mais comum ao escolher a alternativa errada. Sem markdown, sem listas.';

    const result = await anthropic.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 300,
      messages: [{ role: 'user', content: prompt }],
    });

    const block = result.content[0];
    const explanation = block?.type === 'text' ? block.text : 'Nao foi possivel gerar a explicacao agora.';

    return NextResponse.json({ explanation });
  } catch (error) {
    console.error('Erro em /api/explicacao:', error);
    return NextResponse.json({ error: 'Nao foi possivel gerar a explicacao agora.' }, { status: 500 });
  }
}
