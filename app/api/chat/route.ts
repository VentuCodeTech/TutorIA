import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Modelos a tentar em ordem (fallback)
const MODELS = ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-1.5-flash-8b'];

const SYSTEM_PROMPT = `Você é o TutorIA, um assistente de estudos inteligente e especializado.
Você ajuda estudantes a se prepararem para ENEM, OAB, Concursos Públicos e CPA-20.
Responda sempre em português brasileiro de forma clara, didática e motivadora.
Quando explicar conceitos, use exemplos práticos e relevantes.
Se o aluno tiver dúvidas sobre matemática, português, história, geografia, ciências, direito ou finanças, esteja pronto para ajudar.
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

    let lastError: Error | null = null;
    
    for (const modelName of MODELS) {
      try {
        const text = await tryModel(modelName, messages);
        return NextResponse.json({ message: text });
      } catch (err: unknown) {
        lastError = err as Error;
        const errMsg = (err as Error).message || '';
        
        // If rate limit, try next model
        if (errMsg.includes('429') || errMsg.includes('Too Many Requests') || errMsg.includes('quota')) {
          console.log(`Model ${modelName} rate limited, trying next...`);
          continue;
        }
        
        // If model not found, try next
        if (errMsg.includes('404') || errMsg.includes('not found')) {
          console.log(`Model ${modelName} not found, trying next...`);
          continue;
        }
        
        // Other error - rethrow
        throw err;
      }
    }

    // All models failed
    const errMsg = lastError?.message || '';
    if (errMsg.includes('429') || errMsg.includes('quota')) {
      return NextResponse.json({
        message: 'O assistente está temporariamente indisponível devido ao alto volume de uso. Por favor, aguarde alguns minutos e tente novamente. 🙏',
      });
    }

    console.error('All models failed:', lastError);
    return NextResponse.json(
      { error: 'Failed to get response from AI' },
      { status: 500 }
    );
  } catch (error) {
    console.error('Chatbot API error:', error);
    return NextResponse.json(
      { error: 'Failed to get response from AI' },
      { status: 500 }
    );
  }
}
