import { NextRequest, NextResponse } from 'next/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

// Service-role client: this route runs server-side only and needs to
// bypass RLS to insert leads captured by the public, auth-free growth
// tools (diagnostico, cronograma, simulado).
const supabaseAdmin = createSupabaseClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// 7-day email sequence. Day 0 (welcome email) is sent immediately below;
// the remaining steps are queued in email_queue and sent by a scheduled
// cron job (see app/api/cron/send-emails).
const EMAIL_SEQUENCE = [
  { template: 'metodo', daysFromNow: 2 },
  { template: 'case_sucesso', daysFromNow: 4 },
  { template: 'trial_convite', daysFromNow: 6 },
  { template: 'ultima_chance', daysFromNow: 9 },
];

function daysFromNow(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, exam, source, gapData } = body ?? {};

    if (!name || !email || !exam || !source) {
      return NextResponse.json(
        { error: 'Campos obrigatorios: name, email, exam, source' },
        { status: 400 }
      );
    }

    const { data: lead, error: leadError } = await supabaseAdmin
      .from('leads')
      .upsert(
        { name, email, exam, source, gap_data: gapData ?? null },
        { onConflict: 'email,source' }
      )
      .select()
      .single();

    if (leadError || !lead) {
      console.error('Erro ao salvar lead:', leadError);
      return NextResponse.json({ error: 'Nao foi possivel salvar o lead' }, { status: 500 });
    }

    if (resend) {
      try {
        await resend.emails.send({
          from: 'Tirei10 <noreply@tirei10.com.br>',
          to: email,
          subject: name + ', seu resultado no Tirei10 chegou',
          html: '<p>Ola ' + name + ',</p><p>Recebemos seu resultado e em breve enviaremos dicas personalizadas para ' + String(exam).toUpperCase() + '.</p><p>Equipe Tirei10</p>',
        });
      } catch (emailError) {
        console.error('Erro ao enviar email de boas-vindas:', emailError);
      }
    }

    const queueRows = EMAIL_SEQUENCE.map((step) => ({
      lead_id: lead.id,
      template: step.template,
      send_at: daysFromNow(step.daysFromNow),
    }));

    const { error: queueError } = await supabaseAdmin.from('email_queue').insert(queueRows);
    if (queueError) {
      console.error('Erro ao agendar sequencia de emails:', queueError);
    }

    return NextResponse.json({ success: true, leadId: lead.id });
  } catch (error) {
    console.error('Erro inesperado em /api/leads:', error);
    return NextResponse.json({ error: 'Erro inesperado' }, { status: 500 });
  }
}
