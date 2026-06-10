import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

const SYSTEM_PROMPT = `Você é o Tirei10, um assistente de estudos inteligente e especializado.
Você ajuda estudantes a se prepararem para ENEM, OAB, Concursos Públicos e CPA-20.
Responda sempre em português brasileiro de forma clara, didática e motivadora.
Quando explicar conceitos, use exemplos práticos e relevantes.
Mantenha um tom amigável, encorajador e profissional.`;

export async function POST(request: NextRequest) {
      try {
              const { messages, planId } = await request.json();

        if (!messages || !Array.isArray(messages)) {
                  return NextResponse.json(
                      { error: 'Messages array is required' },
                      { status: 400 }
                            );
        }

        // Determine model and max_tokens based on plan
        // planId can be passed from client (assistente page) or default to haiku
        const effectivePlan = planId || 'free';

        const model = effectivePlan === 'advanced_pro'
                ? 'claude-sonnet-4-5'
                  : 'claude-haiku-4-5';

        const maxTokens = effectivePlan === 'advanced_pro' ? 2000
                  : effectivePlan === 'student' ? 1200
                  : effectivePlan === 'standard' ? 600
                  : 300;

        // Use prompt caching for paid plans
        const useCaching = effectivePlan !== 'free';

        const systemContent = useCaching
                ? [{ type: 'text' as const, text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' as const } }]
                  : SYSTEM_PROMPT;

        const claudeMessages = messages.map((msg: { role: string; content: string }) => ({
                  role: msg.role as 'user' | 'assistant',
                  content: msg.content,
        }));

        const response = await client.messages.create({
                  model,
                  max_tokens: maxTokens,
                  system: systemContent as any,
                  messages: claudeMessages,
        });

        const text = response.content[0].type === 'text' ? response.content[0].text : '';

        return NextResponse.json({ message: text });

      } catch (error: unknown) {
              console.error('Chatbot API error:', error);
              const errMsg = (error as Error).message || '';

        if (errMsg.includes('overloaded') || errMsg.includes('529')) {
                  return NextResponse.json({
                              message: 'O assistente está temporariamente sobrecarregado. Por favor, aguarde 1-2 minutos e tente novamente. 🙏',
                  });
        }

        if (errMsg.includes('rate_limit') || errMsg.includes('429')) {
                  return NextResponse.json({
                              message: 'Limite de requisições atingido. Por favor, aguarde alguns instantes e tente novamente.',
                  });
        }

        return NextResponse.json({
                  message: 'Ocorreu um erro inesperado. Por favor, tente novamente.',
        });
      }
}
