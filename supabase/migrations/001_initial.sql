-- ============================================================
-- Tirei10 — Database Schema v1
-- Run this in the Supabase SQL Editor
-- ============================================================

-- Enable extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pg_trgm";

-- ============================================================
-- PROFILES
-- ============================================================
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text,
  full_name text,
  avatar_url text,
  phone text,
  bio text,
  target_exams text[] default '{}',
  study_hours_per_day int default 2,
  knowledge_level text default 'iniciante' check (knowledge_level in ('iniciante', 'intermediario', 'avancado')),
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- ============================================================
-- SUBSCRIPTIONS
-- ============================================================
create table public.subscriptions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null unique,
  stripe_customer_id text,
  stripe_subscription_id text,
    stripe_price_id text,
  plan text default 'gratuito' check (plan in ('gratuito', 'standard', 'student', 'advanced_pro')), -- NOSONAR
  status text default 'active' check (status in ('active', 'canceled', 'past_due', 'trialing')), -- NOSONAR
  current_period_start timestamptz,
  current_period_end timestamptz,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- ============================================================
-- QUESTIONS
-- ============================================================
create table public.questions (
  id uuid default uuid_generate_v4() primary key,
  subject text not null,
  topic text,
  difficulty int default 3 check (difficulty between 1 and 5),
  exam_type text,
  text text not null,
  options text[] not null,
  correct_option int not null check (correct_option between 0 and 4),
  explanation text,
  source text default 'manual' check (source in ('manual', 'ai_generated')), -- NOSONAR
  ai_model text,
  times_shown int default 0,
  times_correct int default 0,
  created_at timestamptz default now() not null
);

create index questions_subject_idx on public.questions(subject);
create index questions_exam_idx on public.questions(exam_type);
create index questions_difficulty_idx on public.questions(difficulty);

-- ============================================================
-- STUDY SESSIONS
-- ============================================================
create table public.study_sessions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  subject text,
  exam_type text,
  questions_answered int default 0,
  questions_correct int default 0,
  duration_seconds int,
  session_type text default 'questoes' check (session_type in ('questoes', 'simulado')),
  started_at timestamptz default now() not null,
  ended_at timestamptz
);

create index study_sessions_user_idx on public.study_sessions(user_id);
create index study_sessions_started_idx on public.study_sessions(started_at);

-- ============================================================
-- QUESTION ANSWERS
-- ============================================================
create table public.question_answers (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  question_id uuid references public.questions(id) on delete cascade not null,
  session_id uuid references public.study_sessions(id) on delete set null,
  selected_option int not null,
  is_correct boolean not null,
  time_taken_seconds int,
  answered_at timestamptz default now() not null
);

create index question_answers_user_idx on public.question_answers(user_id);
create index question_answers_date_idx on public.question_answers(answered_at);

-- ============================================================
-- AI EXPLAIN LOGS
-- ============================================================
create table public.ai_explain_logs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  question_id uuid references public.questions(id) on delete cascade not null,
  tokens_used int,
  created_at timestamptz default now() not null
);

create index ai_explain_user_date_idx on public.ai_explain_logs(user_id, created_at);

-- ============================================================
-- CHAT MESSAGES
-- ============================================================
create table public.chat_messages (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  tokens_used int,
  created_at timestamptz default now() not null
);

create index chat_messages_user_idx on public.chat_messages(user_id, created_at);

-- ============================================================
-- FORUM POSTS
-- ============================================================
create table public.forum_posts (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  content text not null,
  exam_tag text,
  subject_tag text,
  likes int default 0,
  replies_count int default 0,
  is_pinned boolean default false,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create index forum_posts_exam_idx on public.forum_posts(exam_tag);
create index forum_posts_date_idx on public.forum_posts(created_at desc);

-- ============================================================
-- FORUM REPLIES
-- ============================================================
create table public.forum_replies (
  id uuid default uuid_generate_v4() primary key,
  post_id uuid references public.forum_posts(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  content text not null,
  likes int default 0,
  is_accepted boolean default false,
  created_at timestamptz default now() not null
);

-- ============================================================
-- STUDY PLAN TASKS
-- ============================================================
create table public.study_plan_tasks (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  subject text,
  description text,
  scheduled_date date not null,
  estimated_minutes int default 30,
  is_completed boolean default false,
  completed_at timestamptz,
  created_at timestamptz default now() not null
);

create index study_tasks_user_date_idx on public.study_plan_tasks(user_id, scheduled_date);

-- ============================================================
-- FUNCTIONS
-- ============================================================

-- Auto-create profile on new user signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  insert into public.subscriptions (user_id, plan, status)
  values (new.id, 'gratuito', 'active');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at before update on public.profiles
  for each row execute procedure public.handle_updated_at();
create trigger subscriptions_updated_at before update on public.subscriptions
  for each row execute procedure public.handle_updated_at();
create trigger forum_posts_updated_at before update on public.forum_posts
  for each row execute procedure public.handle_updated_at();

create or replace function public.get_user_stats(p_user_id uuid)
returns table (
  questions_today bigint,
  questions_this_week bigint,
  correct_today bigint,
  correct_this_week bigint,
  study_streak_days int,
  total_study_hours numeric
) language plpgsql security definer as $$
declare
  v_streak int := 0;
  v_check_date date := current_date;
  v_has_answers boolean;
begin
  loop
    select exists(
      select 1 from public.question_answers
      where user_id = p_user_id
        and answered_at::date = v_check_date
    ) into v_has_answers;
    exit when not v_has_answers;
    v_streak := v_streak + 1;
    v_check_date := v_check_date - 1;
  end loop;

  return query
  select
    count(case when qa.answered_at::date = current_date then 1 end) as questions_today,
    count(case when qa.answered_at >= date_trunc('week', current_date) then 1 end) as questions_this_week,
    count(case when qa.answered_at::date = current_date and qa.is_correct then 1 end) as correct_today,
    count(case when qa.answered_at >= date_trunc('week', current_date) and qa.is_correct then 1 end) as correct_this_week,
    v_streak as study_streak_days,
    round(coalesce(sum(ss.duration_seconds) filter (where ss.user_id = p_user_id), 0) / 3600.0, 1) as total_study_hours
  from public.question_answers qa
  left join public.study_sessions ss on ss.user_id = p_user_id
  where qa.user_id = p_user_id;
end;
$$;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table public.profiles enable row level security;
alter table public.subscriptions enable row level security;
alter table public.questions enable row level security;
alter table public.study_sessions enable row level security;
alter table public.question_answers enable row level security;
alter table public.ai_explain_logs enable row level security;
alter table public.chat_messages enable row level security;
alter table public.forum_posts enable row level security;
alter table public.forum_replies enable row level security;
alter table public.study_plan_tasks enable row level security;

create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can view own subscription" on public.subscriptions for select using (auth.uid() = user_id);
create policy "Authenticated users can read questions" on public.questions for select using (auth.role() = 'authenticated'); -- NOSONAR
create policy "Users own their study sessions" on public.study_sessions for all using (auth.uid() = user_id);
create policy "Users own their answers" on public.question_answers for all using (auth.uid() = user_id);
create policy "Users own their explain logs" on public.ai_explain_logs for all using (auth.uid() = user_id);
create policy "Users own their chat messages" on public.chat_messages for all using (auth.uid() = user_id);
create policy "Anyone can read forum posts" on public.forum_posts for select using (auth.role() = 'authenticated');
create policy "Users own their forum posts" on public.forum_posts for all using (auth.uid() = user_id);
create policy "Anyone can read replies" on public.forum_replies for select using (auth.role() = 'authenticated');
create policy "Users own their replies" on public.forum_replies for all using (auth.uid() = user_id);
create policy "Users own their study tasks" on public.study_plan_tasks for all using (auth.uid() = user_id);

-- ============================================================
-- SEED: Sample questions
-- ============================================================
insert into public.questions (subject, topic, difficulty, exam_type, text, options, correct_option, explanation, source)
values
  ('Matematica', 'Progressoes', 2, 'ENEM', 'Uma PA tem primeiro termo 3 e razao 4. Qual e o decimo termo?', array['35', '39', '43', '47', '51'], 1, 'an = a1 + (n-1)*r -> a10 = 3 + 9x4 = 39', 'manual'),
  ('Portugues', 'Ortografia', 2, 'ENEM', 'Qual alternativa esta completamente correta?', array['excecao, excessao', 'excecao, acepcao', 'excessao, concepcao', 'acepcao, excessao', 'excessao, percepcao'], 1, 'Correto: excecao e acepcao. Excessao nao existe.', 'manual'),
  ('Direito Constitucional', 'Direitos Fundamentais', 3, 'OAB', 'Segundo a CF/88, os direitos e garantias fundamentais tem aplicacao:', array['Imediata', 'Mediata', 'Depende de regulamentacao', 'Apenas para brasileiros', 'Condicional'], 0, 'Art. 5, par.1 da CF/88: as normas definidoras dos direitos e garantias fundamentais tem aplicacao imediata.', 'manual'),
  ('Matematica Financeira', 'Juros Compostos', 3, 'CPA-20', 'R$10.000 a 1% ao mes por 12 meses em juros compostos resulta em aproximadamente:', array['R$11.200', 'R$11.268', 'R$12.000', 'R$10.120', 'R$11.000'], 1, 'M = 10.000 x (1,01)^12 aprox 10.000 x 1,1268 aprox R$11.268', 'manual'),
  ('Raciocinio Logico', 'Proposicoes', 2, 'Concursos', 'Se todo A e B e todo B e C, entao:', array['Todo C e A', 'Todo A e C', 'Algum C nao e A', 'Nenhum A e C', 'Nenhum C e B'], 1, 'Silogismo hipotetico: se A subconjunto B e B subconjunto C, entao A subconjunto C, logo todo A e C.', 'manual');
