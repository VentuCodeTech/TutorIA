import { NextRequest, NextResponse } from 'next/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

// Processes the 7-day email sequence queued by app/api/leads/route.ts.
// Meant to run on a schedule (Vercel Cron, see vercel.json) a few times a
// day; each run sends every email whose send_at has passed and is not
// marked as sent yet.
const supabaseAdmin = createSupabaseClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const TEMPLATES: Record<string, { subject: string; html: (name: string) => string }> = {
  metodo: {
    subject: 'O metodo que esta eliminando candidatos',
    html: (name) => '<p>Ola ' + name + ',</p><p>Estudar mais nao e o mesmo que estudar melhor. A repeticao espacada e o metodo mais eficaz comprovado para reter conteudo a longo prazo.</p><p>Equipe Tirei10</p>',
  },
  case_sucesso: {
    subject: 'Como um aluno passou depois de 2 reprovacoes',
    html: (name) => '<p>Ola ' + name + ',</p><p>Muitos alunos que usam diagnostico e pratica direcionada relatam evolucao consistente em poucas semanas.</p><p>Equipe Tirei10</p>',
  },
  trial_convite: {
    subject: '14 dias gratis no Tirei10 - para voce',
    html: (name) => '<p>Ola ' + name + ',</p><p>Que tal experimentar o Tirei10 por 14 dias gratis, sem cartao de credito? Questoes adaptativas, simulados e assistente com IA.</p><p><a href="https://www.tirei10.com.br/pricing">Comecar agora</a></p><p>Equipe Tirei10</p>',
  },
  urgency: {
    subject: 'Ultimas horas: acesso com preco especial',
    html: (name) => '<p>Ola ' + name + ',</p><p>Esta e a ultima mensagem da nossa sequencia. Se voce ainda nao experimentou o Tirei10, esse e um otimo momento para comecar.</p><p><a href="https://www.tirei10.com.br/pricing">Ver planos</a></p><p>Equipe Tirei10</p>',
  },
};

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== 'Bearer ' + process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!resend) {
    return NextResponse.json({ error: 'RESEND_API_KEY nao configurada' }, { status: 500 });
  }

  const nowIso = new Date().toISOString();
  const { data: pending, error } = await supabaseAdmin
    .from('email_queue')
    .select('id, template, lead_id, leads ( name, email, converted )')
    .eq('sent', false)
    .lte('send_at', nowIso)
    .limit(100);

  if (error) {
    console.error('Erro ao buscar email_queue:', error);
    return NextResponse.json({ error: 'Erro ao buscar fila de emails' }, { status: 500 });
  }

  let sentCount = 0;
  for (const item of pending ?? []) {
    const lead = Array.isArray(item.leads) ? item.leads[0] : item.leads;
    const template = TEMPLATES[item.template];
    if (!lead || !template || lead.converted) {
      await supabaseAdmin.from('email_queue').update({ sent: true, sent_at: nowIso }).eq('id', item.id);
      continue;
    }

    try {
      await resend.emails.send({
        from: 'Tirei10 <noreply@tirei10.com.br>',
        to: lead.email,
        subject: template.subject,
        html: template.html(lead.name),
      });
      await supabaseAdmin.from('email_queue').update({ sent: true, sent_at: nowIso }).eq('id', item.id);
      sentCount += 1;
    } catch (sendError) {
      console.error('Erro ao enviar email da fila (id=' + item.id + '):', sendError);
    }
  }

  return NextResponse.json({ processed: pending?.length ?? 0, sent: sentCount });
}
