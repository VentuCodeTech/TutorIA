import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { area, difficulty } = await request.json();
    
    const areaText = area === 'Todas' ? 'qualquer área de estudo (Matemática, Português, História, Ciências, Física, Química, Biologia, Direito, Finanças, Geografia, Inglês, Espanhol)' : area;
    const diffText = difficulty === 'Todas' ? 'aleatória (Fácil, Médio ou Difícil)' : difficulty;
    
    const response = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: `Gere uma questão de múltipla escolha sobre ${areaText} com dificuldade ${diffText}.

Retorne APENAS um JSON válido no formato exato abaixo, sem texto adicional:
{
  "id": "q_${Date.now()}",
  "text": "Texto da questão aqui?",
  "options": ["Opção A", "Opção B", "Opção C", "Opção D"],
  "correctAnswer": 0,
  "explanation": "Explicação da resposta correta",
  "subject": "Nome da matéria",
  "difficulty": "Fácil"
}

IMPORTANTE: correctAnswer deve ser o índice (0-3) da resposta correta. Gere uma questão DIFERENTE a cada vez.`
      }]
    });

    const content = response.content[0];
    if (content.type !== 'text') {
      return NextResponse.json({ error: 'Invalid response' }, { status: 500 });
    }
    
    const jsonMatch = content.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: 'Could not parse question' }, { status: 500 });
    }
    
    const question = JSON.parse(jsonMatch[0]);
    question.id = `q_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return NextResponse.json({ question });
  } catch (error) {
    console.error('Error generating question:', error);
    return NextResponse.json({ error: 'Failed to generate question' }, { status: 500 });
  }
}
