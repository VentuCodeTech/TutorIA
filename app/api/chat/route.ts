import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    const response = await client.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 1024,
      system: `Você é o TutorIA, um assistente de estudos inteligente e especializado. 
Você ajuda estudantes a se prepararem para ENEM, OAB, Concursos Públicos e CPA-20.
Responda sempre em português brasileiro de forma clara, didática e motivadora.
Quando explicar conceitos, use exemplos práticos e relevantes.
Se o aluno tiver dúvidas sobre matemática, português, história, geografia, ciências, direito ou finanças, esteja pronto para ajudar.
Mantenha um tom amigável, encorajador e profissional.`,
      messages: messages.map((msg: { role: string; content: string }) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      })),
    });

    const assistantMessage = response.content[0];
    if (assistantMessage.type !== 'text') {
      return NextResponse.json(
        { error: 'Unexpected response type' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: assistantMessage.text,
      usage: response.usage,
    });
  } catch (error) {
    console.error('Chatbot API error:', error);
    return NextResponse.json(
      { error: 'Failed to get response from AI' },
      { status: 500 }
    );
  }
}
