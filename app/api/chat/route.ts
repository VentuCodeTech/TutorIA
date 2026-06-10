import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@/lib/supabase/server';
import { getFeatures, getPlanIdFromSubscription } from '@/lib/planFeatures';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

const SYSTEM_PROMPT = `Você é o Tirei10, um assistente de estudos inteligente e especializado.
Você ajuda estudantes a se prepararem para ENEM, OAB, Concursos Públicos e CPA-20.
Responda sempre em português brasileiro de forma clara, didática e motivadora.
Quando explicar conceitos, use exemplos práticos e relevantes.
Mantenha um tom amigável, encorajador e profissional.`;

// Plan model routing
function getModelForPlan(planId: string): string {
    if (planId === 'advanced_pro') return 'claude-sonnet-4-5';
    return 'claude-haiku-4-5';
}

// Get max tokens per plan
function getMaxTokensForPlan(planId: string): number {
    switch (planId) {
      case 'advanced_pro': return 2000;
      case 'student': return 1200;
      case 'standard': return 600;
      default: return 300;
    }
}

// Get daily message limit per plan (null = token-based, not message-based)
function getDailyMsgLimit(planId: string): number | null {
    switch (planId) {
      case 'free': return 10;
      case 'standard': return 50;
      case 'student': return null; // token-based (500k tokens/day)
      case 'advanced_pro': return null; // token-based (1M tokens/day)
      default: return 10;
    }
}

export async function POST(request: NextRequest) {
    try {
          const { messages, planOverride } = await request.json();

      if (!messages || !Array.isArray(messages)) {
              return NextResponse.json(
                { error: 'Messages array is required' },
                { status: 400 }
                      );
      }

      // Get user plan from Supabase
      let planId = 'free';
          try {
                  const supabase = await createClient();
                  const { data: { user } } = await supabase.auth.getUser();
                  if (user) {
                            const { data: sub } = await supabase
                              .from('subscriptions')
                              .select('plan, status, stripe_price_id')
                              .eq('user_id', user.id)
                              .maybeSingle();

                    if (sub) {
                                // Try plan field first, fallback to price mapping
                              if (sub.plan && ['standard','student','advanced_pro'].includes(sub.plan) &&
                                                ['active','trialing'].includes(sub.status || '')) {
                                            planId = sub.plan;
                              } else if (sub.stripe_price_id) {
                                            planId = getPlanIdFromSubscription(sub.stripe_price_id, sub.status);
                              }
                    }
                  }
          } catch {
                  // If can't get plan, default to free
          }

      // Allow client-side plan override for testing (ignored in prod logic - server plan wins)
      const effectivePlan = planId;

      const features = getFeatures(effectivePlan as any);

      // Check if AI assistant is enabled for this plan
      if (!features.aiAssistantEnabled) {
              return NextResponse.json({
                        message: '❌ O Assistente IA está disponível apenas nos planos pagos (Standard, Student ou Advanced Pro). Faça upgrade para desbloquear esse recurso! 🚀',
              });
      }

      const model = getModelForPlan(effectivePlan);
          const maxTokens = getMaxTokensForPlan(effectivePlan);

      // Build messages for Claude API
      const claudeMessages = messages.map((msg: { role: string; content: string }) => ({
              role: msg.role as 'user' | 'assistant',
              content: msg.content,
      }));

      // Use prompt caching for standard/student/advanced_pro plans
      const useCaching = effectivePlan !== 'free';

      const systemContent = useCaching
            ? [{ type: 'text' as const, text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' as const } }]
              : SYSTEM_PROMPT;

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
