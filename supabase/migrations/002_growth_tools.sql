-- ============================================================
-- Tirei10 -- Migration 002: Growth tools (leads, email sequence, referrals, exam dates)
-- Run this in the Supabase SQL Editor after 001_initial.sql
-- ============================================================

-- ============================================================
-- LEADS (captured by the free tools: diagnostico, cronograma, simulado)
-- ============================================================
create table public.leads (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  email text not null,
  exam text not null check (exam in ('enem', 'oab', 'cpa', 'concurso')), -- NOSONAR
source text not null check (source in ('diagnostico', 'cronograma', 'simulado')), -- NOSONAR
gap_data jsonb,
  sequence_day int default 0 not null,
  converted boolean default false not null,
  user_id uuid references auth.users(id) on delete set null,
  created_at timestamptz default now() not null,
  unique (email, source)
  );

create index leads_email_idx on public.leads(email);

-- ============================================================
-- EMAIL QUEUE (scheduled sends for the 7-day sequence)
-- ============================================================
create table public.email_queue (
  id uuid default uuid_generate_v4() primary key,
  lead_id uuid references public.leads(id) on delete cascade not null,
  template text not null,
  send_at timestamptz not null,
  sent boolean default false not null,
  sent_at timestamptz,
  created_at timestamptz default now() not null
  );

create index email_queue_pending_idx on public.email_queue(send_at) where sent = false; -- NOSONAR

-- ============================================================
-- REFERRALS
-- ============================================================
create table public.referrals (
  id uuid default uuid_generate_v4() primary key,
  referrer_id uuid references auth.users(id) on delete cascade not null,
  referee_id uuid references auth.users(id) on delete set null,
  referral_code text not null,
  status text default 'pending' check (status in ('pending', 'converted', 'rewarded')), -- NOSONAR
created_at timestamptz default now() not null,
  converted_at timestamptz
  );

create index referrals_referrer_idx on public.referrals(referrer_id);
create index referrals_code_idx on public.referrals(referral_code);

alter table public.profiles add column referral_code text unique;
alter table public.profiles add column referral_bonus_days int default 0 not null;

update public.profiles
set referral_code = substr(md5(random()::text || id::text), 1, 8)
where referral_code is null;

-- ============================================================
-- FUNCTION: apply_referral_reward
-- Grants 30 days of Student plan to both referrer and referee.
-- Called right after a new account is created through a /r/CODIGO link.
-- ============================================================
create or replace function public.apply_referral_reward(
  p_referral_code text,
  p_referee_id uuid
  ) returns void language plpgsql security definer as $$
declare
v_referrer_id uuid;
begin
select id into v_referrer_id from public.profiles where referral_code = p_referral_code;

if v_referrer_id is null or v_referrer_id = p_referee_id then
return;
end if;

if exists (select 1 from public.referrals where referee_id = p_referee_id) then
return;
end if;

update public.subscriptions
set plan = 'student',
current_period_end = greatest(coalesce(current_period_end, now()), now()) + interval '30 days'
where user_id = v_referrer_id;

update public.profiles
set referral_bonus_days = referral_bonus_days + 30
where id = v_referrer_id;

update public.subscriptions
set plan = 'student',
status = 'trialing',
current_period_start = now(),
current_period_end = now() + interval '30 days'
where user_id = p_referee_id and plan = 'gratuito';

insert into public.referrals (referrer_id, referee_id, referral_code, status, converted_at)
values (v_referrer_id, p_referee_id, p_referral_code, 'converted', now());
end;
$$;

-- ============================================================
-- ROW LEVEL SECURITY (leads, email queue, referrals)
-- ============================================================
alter table public.leads enable row level security;
alter table public.email_queue enable row level security;
alter table public.referrals enable row level security;

create policy "Service role manages leads" on public.leads for all using (auth.role() = 'service_role'); -- NOSONAR
create policy "Service role manages email queue" on public.email_queue for all using (auth.role() = 'service_role'); -- NOSONAR
create policy "Users view own referrals" on public.referrals for select using (auth.uid() = referrer_id);
create policy "Service role manages referrals" on public.referrals for all using (auth.role() = 'service_role'); -- NOSONAR

-- ============================================================
-- EXAM DATES (sidebar tab: Datas de Concursos e Editais)
-- Populated from official sources: INEP (ENEM), FGV/Cebraspe (Exame de
-- Ordem - OAB) and ANBIMA (certificacoes). General public tenders are
-- curated manually since there is no unified official government API.
-- ============================================================
create table public.exam_dates (
  id uuid default uuid_generate_v4() primary key,
  exam text not null check (exam in ('enem', 'oab', 'cpa', 'concurso')), -- NOSONAR
title text not null,
  description text,
  event_type text not null check (event_type in ('inscricao_inicio', 'inscricao_fim', 'prova', 'edital', 'resultado')), -- NOSONAR
event_date date not null,
  source_url text,
  official_source text not null,
  year int not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
  );

create index exam_dates_date_idx on public.exam_dates(event_date);
create index exam_dates_exam_idx on public.exam_dates(exam);

alter table public.exam_dates enable row level security;

create policy "Authenticated users read exam dates" on public.exam_dates for select using (auth.role() = 'authenticated'); -- NOSONAR
create policy "Service role manages exam dates" on public.exam_dates for all using (auth.role() = 'service_role'); -- NOSONAR
