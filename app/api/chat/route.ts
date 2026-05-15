import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: NextRequest) {
    try {
          const { messages } = await request.json();

      if (!messages || !Array.isArray(messages)) {
              return NextResponse.json(
                { error: 'Messages array is required' },
                { status: 400 }
                      );
      }

      const model = genAI.getGenerativeModel({
              model: 'gemini-1.5-flash',
              systemInstruction: `Você é o TutorIA, um assistente de estudos inteligente e especializado.
              Você ajuda estudantes a se prepararem para ENEM, OAB, Concursos Públicos e CPA-20.
              Responda sempre em português brasileiro de forma clara, didática e motivadora.
              Quando explicar conceitos, use exemplos práticos e relevantes.
              Se o aluno tiver dúvidas sobre matemática, português, história, geografia, ciências, direito ou finanças, esteja pronto para ajudar.
              Mantenha um tom amigável, encorajador e profissional.`,
      });

      // Convert messages to Gemini format
      const history = messages.slice(0, -1).map((msg: { role: string; content: string }) => ({
              role: msg.role === 'assistant' ? 'model' : 'user',
              parts: [{ text: msg.content }],
      }));

      const lastMessage = messages[messages.length - 1];

      const chat = model.startChat({ history });
          const result = await chat.sendMessage(lastMessage.content);
          const text = result.response.text();

      return NextResponse.json({
              message: text,
      });
    } catch (error) {
          console.error('Chatbot API error:', error);
          return NextResponse.json(
            { error: 'Failed to get response from AI' },
            { status: 500 }
                );
    }
}
