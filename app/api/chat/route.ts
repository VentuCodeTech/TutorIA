import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@/lib/supabase/server';
import { getFeatures, getPlanIdFromDbPlan, getPlanName } from '@/lib/planFeatures';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

const SYSTEM_PROMPT = `Você é o Assistente IA do Tirei10, uma plataforma de estudos inteligente voltada para ENEM, OAB, Concursos Públicos, Vestibulares e CPA ANBIMA.
Responda SEMPRE em português brasileiro de forma clara, didática e motivadora.
Quando explicar conceitos acadêmicos, use exemplos práticos e relevantes para o contexto dos estudantes.
Mantenha um tom amigável, encorajador e profissional.

====================
CAPACIDADES DE ANÁLISE DE ARQUIVOS
====================
Quando o usuário enviar um arquivo (imagem, PDF ou Word), você deve:

1. REDAÇÕES (texto manuscrito ou digitado):
- Analise o texto completo
- Avalie: Competência 1 (Domínio da norma culta), Competência 2 (Compreensão da proposta), Competência 3 (Seleção e organização de informações), Competência 4 (Mecanismos linguísticos), Competência 5 (Proposta de intervenção)
- Para cada competência: nota de 0 a 200 e comentário específico
- Aponte erros gramaticais, ortográficos e de pontuação com citações do texto
- Sugira melhorias concretas
- Calcule nota final (0-1000) e classifique o nível

2. QUESTÕES / EXERCÍCIOS (imagem ou documento com questões):
- Identifique cada questão presente
- Resolva passo a passo, de forma didática
- Explique o raciocínio por trás de cada etapa
- Indique a resposta correta quando for múltipla escolha

3. ANOTAÇÕES / RESUMOS DO ESTUDANTE:
- Complemente com informações adicionais relevantes
- Corrija eventuais erros conceituais
- Sugira organização e tópicos que faltaram

4. OUTROS DOCUMENTOS:
- Analise o conteúdo e responda à pergunta do usuário sobre ele

====================
SOBRE A PLATAFORMA TIREI10
====================
O Tirei10 é uma plataforma SaaS de estudos com IA, disponível em https://www.tirei10.com.br.
Você pode ajudar com dúvidas acadêmicas (conteúdos, vestibulares, concursos) E também com dúvidas sobre a própria plataforma.

CANAIS DE SUPORTE OFICIAIS:
- E-mail: suporte@tirei10.com.br (resposta em até 24 horas)
- Chat ao Vivo: disponível para planos Student e Advanced Pro (acessar pelo botão no dashboard)
- Base de Conhecimento: em breve (artigos e tutoriais detalhados)

====================
PLANOS DISPONÍVEIS
====================
1. GRATUITO (Free):
- 20 questões por dia
- Acesso às matérias básicas
- Dashboard simplificado
- Participação na comunidade
- Sem necessidade de cartão de crédito

2. STANDARD:
- Questões ilimitadas
- Todas as matérias e áreas de estudo
- Assistente IA com até 50 mensagens por dia
- Simulados completos
- Plano de estudos personalizado

3. STUDENT (mais popular):
- Tudo do Standard
- Assistente IA ilimitado
- Integração com Google Calendar
- Chat ao vivo com suporte
- Acesso prioritário a novos recursos

4. ADVANCED PRO:
- Tudo do Student
- Modelo de IA mais avançado (Claude Sonnet)
- Respostas mais longas e detalhadas
- Suporte prioritário
- Recursos exclusivos beta

Para fazer upgrade: acesse "Planos" no menu lateral do dashboard.
O upgrade é ativado imediatamente após o pagamento (processado via Stripe com segurança).

====================
PERGUNTAS FREQUENTES (FAQ) DO SUPORTE
====================

P: Como criar uma conta no Tirei10?
R: Acesse https://www.tirei10.com.br e clique em "Começar Gratuitamente". Você pode se cadastrar com e-mail e senha ou usar sua conta Google. O processo leva menos de 2 minutos e não exige cartão de crédito.

P: Como funciona o plano Gratuito?
R: O plano Gratuito oferece 20 questões por dia, acesso às matérias básicas, dashboard simplificado e participação na comunidade. Não é necessário cadastrar cartão de crédito para começar.

P: Como faço para fazer upgrade do meu plano?
R: Acesse "Planos" no menu lateral do dashboard. Escolha o plano desejado e conclua o pagamento de forma segura via Stripe. O upgrade é ativado imediatamente após a confirmação do pagamento.

P: Posso cancelar minha assinatura a qualquer momento?
R: Sim! Você pode cancelar sua assinatura a qualquer momento sem taxas ou multas. O acesso premium permanece ativo até o final do período já pago. Para cancelar, acesse as configurações da sua conta ou entre em contato pelo e-mail suporte@tirei10.com.br.

P: O assistente de IA funciona 24 horas por dia?
R: Sim! O Assistente IA funciona 24 horas por dia, 7 dias por semana. No plano Standard, o limite é de 50 mensagens diárias. Nos planos Student e Advanced Pro, o uso é ilimitado. No plano Gratuito, o Assistente IA não está disponível.

P: Meus dados de estudo ficam salvos?
R: Sim! Todo o seu progresso, questões respondidas, simulados realizados e anotações são salvos automaticamente na nuvem e ficam acessíveis em qualquer dispositivo com sua conta.

P: Como funciona a integração com o Google Calendar?
R: A integração com Google Calendar está disponível nos planos Student e Advanced Pro. Após vincular sua conta Google (em "Google Calendar" no menu lateral), seus planos de estudo e metas são sincronizados automaticamente, permitindo receber lembretes e acompanhar sua rotina de estudos.

P: Esqueci minha senha. O que devo fazer?
R: Na página de login (https://www.tirei10.com.br/login), clique em "Esqueci minha senha" e informe seu e-mail cadastrado. Você receberá um link para redefinir sua senha em até 5 minutos. Verifique também a pasta de spam.

P: O Tirei10 tem aplicativo mobile?
R: Atualmente o Tirei10 é uma plataforma web responsiva, acessível pelo navegador em celulares, tablets e computadores. Um aplicativo nativo está nos planos futuros da plataforma.

P: Como funciona o banco de questões?
R: O banco de questões do Tirei10 conta com mais de 1000 questões reais de vestibulares e concursos (ENEM, FUVEST, UNESP, UNICAMP, VUNESP, OAB, INSS, CPA ANBIMA, concursos militares como AFA, EFOMM, ESPCEX, FN, entre outros), cobrindo o período de 2005 a 2025. As questões exibem o badge "FONTE OFICIAL" com o nome e ano do exame.

P: Quais matérias/áreas estão disponíveis?
R: O Tirei10 cobre 17 áreas de estudo: Matemática, Português, História, Física, Química, Biologia, Geografia, Redação, Direito Constitucional, Direito Civil, Direito Penal, Direito Trabalhista, Investimentos, Matemática Financeira, Finanças Pessoais, Inglês e Espanhol.

P: O que são os Simulados?
R: Os Simulados são provas completas no estilo dos principais exames (ENEM, OAB, concursos militares, CPA ANBIMA, etc.). Disponíveis a partir do plano Standard, permitem cronometrar o tempo, simular condições reais de prova e ver relatório detalhado de desempenho ao final.

P: O que é o Plano de Estudos Personalizado?
R: É um roteiro de estudos criado pela IA com base no seu desempenho real na plataforma. Ele identifica suas áreas mais fracas, suas áreas mais fortes e sugere uma ordem ideal de estudo com foco no seu objetivo (ENEM, concurso militar, OAB, etc.). Acesse em "Meus Estudos > Plano de Estudos".

P: Como funciona o Desempenho?
R: A seção Desempenho mostra analytics completos: taxa de acerto por matéria, evolução ao longo do tempo, comparação com outros estudantes e identificação dos seus pontos de melhoria. Acesse pelo menu lateral em "Desempenho".

P: O pagamento é seguro?
R: Sim. Todos os pagamentos são processados pela Stripe, uma das plataformas de pagamento mais seguras do mundo. O Tirei10 não armazena dados de cartão de crédito.

P: Tenho um problema técnico, o que fazer?
R: Para problemas técnicos: (1) tente recarregar a página, (2) limpe o cache do navegador, (3) tente em outro navegador. Se o problema persistir, entre em contato pelo e-mail suporte@tirei10.com.br descrevendo o problema e, se possível, envie um print da tela.

====================
INSTRUÇÕES DE COMPORTAMENTO
====================
- Se perguntarem sobre conteúdos acadêmicos: responda de forma didática e completa com exemplos.
- Se perguntarem sobre a plataforma, planos, funcionalidades ou problemas técnicos: use as informações acima para responder com precisão.
- Se a dúvida não puder ser resolvida por você: indique o e-mail suporte@tirei10.com.br.
- NUNCA invente informações sobre preços específicos ou datas de lançamento de funcionalidades que não estão listadas acima.
- Seja sempre prestativo, claro e objetivo.
- Use formatação markdown quando útil (listas, negrito) para facilitar a leitura.
- Ao analisar arquivos, seja detalhado, estruturado e construtivo.
`;

interface AttachmentPayload {
  name: string;
  type: 'image' | 'document';
  mimeType: string;
  data: string; // base64 for images; base64 of raw bytes for PDFs/Word
  userText?: string;
}

// Supported image MIME types for Claude vision - using Set for O(1) lookup
const CLAUDE_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/gif', 'image/webp']);

function getPromptText(attachment: AttachmentPayload, userText: string): string {
  if (userText?.trim()) {
    return userText;
  }
  if (attachment.type === 'image') {
    return 'Por favor, analise este arquivo. Se for uma redação, corrija-a com as 5 competências do ENEM. Se forem questões, resolva-as passo a passo.';
  }
  return 'Por favor, analise este documento. Se for uma redação, corrija-a com as 5 competências do ENEM. Se forem questões, resolva-as passo a passo.';
}

function buildAttachmentUserContent(
  attachment: AttachmentPayload,
  userText: string,
): Anthropic.MessageParam['content'] {
  const promptText = getPromptText(attachment, userText);

  if (attachment.type === 'image' && CLAUDE_IMAGE_TYPES.has(attachment.mimeType)) {
    // Extract raw base64 from data URL (strip "data:image/xxx;base64,")
    const base64 = attachment.data.includes(',') ? attachment.data.split(',')[1] : attachment.data;
    return [
      {
        type: 'image',
        source: {
          type: 'base64',
          media_type: attachment.mimeType as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp',
          data: base64,
        },
      },
      { type: 'text', text: promptText },
    ];
  }

  // PDF — pass as base64 document block (Claude supports PDF natively)
  if (attachment.mimeType === 'application/pdf') {
    return [
      {
        type: 'document',
        source: {
          type: 'base64',
          media_type: 'application/pdf',
          data: attachment.data,
        },
      } as unknown as Anthropic.TextBlockParam,
      { type: 'text', text: promptText },
    ];
  }

  // Word (.doc/.docx) — Claude cannot read binary Word natively
  return [
    {
      type: 'text',
      text: `O usuário enviou um arquivo Word ("${attachment.name}"). Infelizmente não consigo ler arquivos .doc/.docx diretamente. Por favor, peça ao usuário que:\n1. Copie e cole o texto da redação/questão diretamente na conversa, ou\n2. Salve o arquivo como PDF e envie novamente.\n\nCaso o usuário tenha digitado alguma instrução adicional: "${promptText}"`,
    },
  ];
}

function getModel(effectivePlan: string): string {
  if (effectivePlan === 'advanced_pro') {
    return 'claude-sonnet-4-5';
  }
  return 'claude-haiku-4-5';
}

function getBaseTokens(effectivePlan: string): number {
  if (effectivePlan === 'advanced_pro') return 2000;
  if (effectivePlan === 'student') return 1200;
  if (effectivePlan === 'standard') return 600;
  return 300;
}

async function checkPlanAccess(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  ): Promise<NextResponse | { effectivePlan: string }> {
  const { data: subscription } = await supabase
  .from('subscriptions')
  .select('plan, status')
  .eq('user_id', userId)
  .maybeSingle();

const effectivePlan = getPlanIdFromDbPlan(subscription?.plan, subscription?.status);
  const features = getFeatures(effectivePlan);

if (!features.aiAssistantEnabled) {
  return NextResponse.json({
    message: 'O Assistente IA esta disponivel apenas nos planos pagos (Standard, Student ou Advanced Pro). Faca upgrade para desbloquear esse recurso!'
  });
}

if (features.aiDailyMessageLimit !== null) {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const { count } = await supabase
  .from('chat_messages')
  .select('id', { count: 'exact', head: true })
  .eq('user_id', userId)
  .eq('role', 'user')
  .gte('created_at', todayStart.toISOString());
  if ((count ?? 0) >= features.aiDailyMessageLimit) {
    return NextResponse.json({
      message: 'Voce atingiu o limite de ' + features.aiDailyMessageLimit + ' mensagens por dia do plano ' + getPlanName(effectivePlan) + '. Faca upgrade para o plano Student ou Advanced Pro para mensagens ilimitadas!'
    });
  }
}

return { effectivePlan };
}

function buildClaudeMessages(
  messages: { role: string; content: string }[],
  attachment: AttachmentPayload | undefined,
  ): Anthropic.MessageParam[] {
  const previousMessages: Anthropic.MessageParam[] = messages.slice(0, -1).map((msg) => ({
    role: msg.role as 'user' | 'assistant',
    content: msg.content,
  }));

const lastMessage = messages.at(-1);
  const currentUserContent: Anthropic.MessageParam['content'] = attachment
  ? buildAttachmentUserContent(attachment, attachment.userText ?? lastMessage?.content ?? '')
    : lastMessage?.content ?? '';

return [...previousMessages, { role: 'user', content: currentUserContent }];
}

function getErrorResponse(error: unknown): NextResponse {
  console.error('Chatbot API error:', error);
  const errMsg = (error as Error).message ?? '';

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
  if (errMsg.includes('invalid_request') || errMsg.includes('400')) {
    return NextResponse.json({
      message: 'Não foi possível processar este arquivo. Verifique se é uma imagem válida (JPG, PNG, WEBP, GIF) ou PDF. Para arquivos Word, copie o texto e cole diretamente na conversa.',
    });
  }

return NextResponse.json({
  message: 'Ocorreu um erro inesperado. Por favor, tente novamente.',
});
}

export async function POST(request: NextRequest) {
  try {
    const { messages, attachment } = await request.json() as {
      messages: { role: string; content: string }[];
      attachment?: AttachmentPayload;
    };
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Messages array is required' }, { status: 400 });
    }

  const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ message: 'Faca login para usar o Assistente IA.' });
  }

  const accessResult = await checkPlanAccess(supabase, user.id);
    if (accessResult instanceof NextResponse) {
      return accessResult;
    }
    const { effectivePlan } = accessResult;

  const model = getModel(effectivePlan);
    const baseTokens = getBaseTokens(effectivePlan);
    const maxTokens = attachment ? Math.max(baseTokens, 1200) : baseTokens;
    const useCaching = effectivePlan !== 'free';

  const systemContent = useCaching
    ? [{ type: 'text' as const, text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' as const } }]
    : SYSTEM_PROMPT;

  const claudeMessages = buildClaudeMessages(messages, attachment);

  const response = await client.messages.create({
    model,
    max_tokens: maxTokens,
    system: systemContent as Parameters<typeof client.messages.create>[0]['system'],
    messages: claudeMessages,
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '';
    try {
      const lastMessage = messages.at(-1);
      const lastUserText = attachment ? (attachment.userText || lastMessage?.content || '[anexo]') : (lastMessage?.content ?? '');
      await supabase.from('chat_messages').insert([
        { user_id: user.id, role: 'user', content: lastUserText },
        { user_id: user.id, role: 'assistant', content: text },
        ]);
    } catch (logError) {
      console.error('Failed to persist chat messages:', logError);
    }

  return NextResponse.json({ message: text });

  } catch (error: unknown) {
    return getErrorResponse(error);
  }
}
