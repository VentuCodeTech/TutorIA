import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Modelos a tentar em ordem
const MODELS = ['gemini-2.0-flash', 'gemini-2.0-flash-lite', 'gemini-1.5-flash', 'gemini-1.5-flash-8b'];

const SYSTEM_PROMPT = `Você é o TutorIA, um assistente de estudos inteligente e especializado.
Você ajuda estudantes a se prepararem para ENEM, OAB, Concursos Públicos e CPA-20.
Responda sempre em português brasileiro de forma clara, didática e motivadora.
Quando explicar conceitos, use exemplos práticos e relevantes.
Mantenha um tom amigável, encorajador e profissional.`;

async function tryModel(modelName: string, messages: {role: string; content: string}[]): Promise<string> {
  const model = genAI.getGenerativeModel({
    model: modelName,
    systemInstruction: SYSTEM_PROMPT,
  });

  const rawHistory = messages.slice(0, -1).map((msg) => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }],
  }));

  const firstUserIdx = rawHistory.findIndex((h) => h.role === 'user');
  const history = firstUserIdx >= 0 ? rawHistory.slice(firstUserIdx) : [];

  const lastMessage = messages[messages.length - 1];
  const chat = model.startChat({ history });
  const result = await chat.sendMessage(lastMessage.content);
  return result.response.text();
}

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    let hadRateLimit = false;
    
    for (const modelName of MODELS) {
      try {
        const text = await tryModel(modelName, messages);
        return NextResponse.json({ message: text });
      } catch (err: unknown) {
        const errMsg = (err as Error).message || '';
        
        if (errMsg.includes('429') || errMsg.includes('Too Many Requests') || errMsg.includes('quota')) {
          hadRateLimit = true;
          console.log(`Model ${modelName} rate limited, trying next...`);
          continue;
        }
        
        if (errMsg.includes('404') || errMsg.includes('not found') || errMsg.includes('INVALID_ARGUMENT')) {
          console.log(`Model ${modelName} not available, trying next...`);
          continue;
        }
        
        // Unexpected error - log and continue
        console.error(`Model ${modelName} error:`, errMsg.substring(0, 200));
        continue;
      }
    }

    // All models failed - return friendly message
    if (hadRateLimit) {
      return NextResponse.json({
        message: 'O assistente está temporariamente sobrecarregado devido ao alto volume de uso. Por favor, aguarde 1-2 minutos e tente novamente. A API gratuita do Gemini tem limites de uso. 🙏',
      });
    }

    return NextResponse.json({
      message: 'Serviço de IA temporariamente indisponível. Por favor, tente novamente em instantes.',
    });
  } catch (error) {
    console.error('Chatbot API error:', error);
    return NextResponse.json({
      message: 'Ocorreu um erro inesperado. Por favor, tente novamente.',
    });
  }
}
