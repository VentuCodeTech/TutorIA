-- ============================================================
-- Tirei10 — Forum Seed Data v2
-- Simulated posts and replies with Brazilian names, old timestamps
-- ============================================================

-- Temporary function to insert seed data bypassing RLS
CREATE OR REPLACE FUNCTION seed_forum_data()
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  -- Fake user IDs for seed data (will not match any real auth.users)
  u1  uuid := 'a0000001-0000-0000-0000-000000000001';
  u2  uuid := 'a0000001-0000-0000-0000-000000000002';
  u3  uuid := 'a0000001-0000-0000-0000-000000000003';
  u4  uuid := 'a0000001-0000-0000-0000-000000000004';
  u5  uuid := 'a0000001-0000-0000-0000-000000000005';
  u6  uuid := 'a0000001-0000-0000-0000-000000000006';
  u7  uuid := 'a0000001-0000-0000-0000-000000000007';
  u8  uuid := 'a0000001-0000-0000-0000-000000000008';
  u9  uuid := 'a0000001-0000-0000-0000-000000000009';
  u10 uuid := 'a0000001-0000-0000-0000-000000000010';
  u11 uuid := 'a0000001-0000-0000-0000-000000000011';
  u12 uuid := 'a0000001-0000-0000-0000-000000000012';
  u13 uuid := 'a0000001-0000-0000-0000-000000000013';
  u14 uuid := 'a0000001-0000-0000-0000-000000000014';
  u15 uuid := 'a0000001-0000-0000-0000-000000000015';
  -- Post IDs
  p1  uuid;  p2  uuid;  p3  uuid;  p4  uuid;  p5  uuid;
  p6  uuid;  p7  uuid;  p8  uuid;  p9  uuid;  p10 uuid;
  p11 uuid;  p12 uuid;  p13 uuid;  p14 uuid;  p15 uuid;
  p16 uuid;  p17 uuid;  p18 uuid;  p19 uuid;  p20 uuid;
  p21 uuid;  p22 uuid;
BEGIN
  -- Skip if already seeded
  IF EXISTS (SELECT 1 FROM public.forum_posts WHERE user_id = u1 LIMIT 1) THEN
    RETURN;
  END IF;

  -- Insert fake users into auth.users is not needed; we just insert posts
  -- The foreign key on forum_posts references auth.users, so we need to
  -- temporarily disable the FK or insert into profiles first.
  -- We use a trick: insert profiles with matching IDs (profiles has no FK to auth.users for insert)
  -- Actually forum_posts.user_id references auth.users(id) ON DELETE CASCADE
  -- We need to insert into auth.users first, or disable the FK temporarily.

  -- Disable FK check temporarily
  SET session_replication_role = replica;

  -- Insert seed posts
  INSERT INTO public.forum_posts (id, user_id, title, content, exam_tag, subject_tag, likes, replies_count, is_pinned, created_at, updated_at) VALUES
    (uuid_generate_v4(), u1,  'Gabriel Oliveira||Consegui 900 no ENEM!',
     'Pessoal, depois de 2 anos estudando consegui tirar 900 na redacao do ENEM! A dica principal e ler muito e praticar toda semana. Nao desistam!',
     'Conquistas', 'Conquistas', 47, 3, false, NOW() - INTERVAL '347 days', NOW() - INTERVAL '347 days'),
    (uuid_generate_v4(), u2,  'Ana Paula Ferreira||Duvida sobre logaritmos',
     'Alguem pode me explicar como resolver log na base 2 de 32? Sempre trave nessa parte de matematica no simulado.',
     'Duvidas', 'Duvidas', 18, 3, false, NOW() - INTERVAL '312 days', NOW() - INTERVAL '312 days'),
    (uuid_generate_v4(), u3,  'Carlos Eduardo Santos||Aprovado na OAB!',
     'Acabei de ver meu resultado e PASSEI na OAB! Muito feliz! Quem estiver estudando, foquem em direito constitucional e direito civil que caem bastante.',
     'OAB', 'OAB', 63, 3, false, NOW() - INTERVAL '298 days', NOW() - INTERVAL '298 days'),
    (uuid_generate_v4(), u4,  'Mariana Costa||Dicas para vestibular de medicina',
     'Quem mais esta no cursinho para medicina? Compartilhem suas estrategias de estudo. Estou fazendo 200 questoes por dia e estou exausta mas determinada!',
     'Vestibular', 'Vestibular', 29, 2, false, NOW() - INTERVAL '280 days', NOW() - INTERVAL '280 days'),
    (uuid_generate_v4(), u5,  'Lucas Rodrigues||Aprovado no concurso dos Correios',
     'Gente, passei no concurso dos Correios! Estudei por 8 meses usando essa plataforma. O Tirei10 ajudou muito na parte de raciocinio logico!',
     'Concursos', 'Concursos', 55, 3, false, NOW() - INTERVAL '265 days', NOW() - INTERVAL '265 days'),
    (uuid_generate_v4(), u6,  'Beatriz Almeida||Como memorizar historia para o ENEM',
     'Descobri um metodo incrivel: ao inves de decorar datas, conto historias conectando os eventos. Subiu 80 pontos em historia nas ultimas semanas!',
     'Dicas', 'Dicas', 72, 0, false, NOW() - INTERVAL '250 days', NOW() - INTERVAL '250 days'),
    (uuid_generate_v4(), u7,  'Felipe Nascimento||CPA-20 aprovado na primeira tentativa',
     'Passei na CPA-20! Estudei por 45 dias, focando em renda fixa e mercado de capitais. Quem quiser dicas so perguntar aqui no forum.',
     'CPA-20', 'CPA-20', 41, 3, false, NOW() - INTERVAL '235 days', NOW() - INTERVAL '235 days'),
    (uuid_generate_v4(), u8,  'Camila Pereira||Duvida sobre redacao argumentativa',
     'Como faco para construir um bom repertorio para redacao? Fico sem argumento na hora H. Alguma dica de leitura ou tecnica especifica?',
     'Duvidas', 'Duvidas', 22, 2, false, NOW() - INTERVAL '220 days', NOW() - INTERVAL '220 days'),
    (uuid_generate_v4(), u9,  'Thiago Mendes||Tirando 1000 em matematica no ENEM',
     'Consegui nota 1000 em matematica no ENEM do ano passado! O segredo e resolver muitas questoes antigas e entender o raciocinio, nao decorar formula.',
     'Conquistas', 'Conquistas', 88, 0, false, NOW() - INTERVAL '205 days', NOW() - INTERVAL '205 days'),
    (uuid_generate_v4(), u10, 'Isabela Lima||Estudo para concurso federal ANATEL',
     'Estou estudando para ANATEL. Alguem mais? Quais materias voces estao priorizando? Telecomunicacoes e direito administrativo sao as que mais me preocupam.',
     'Concursos', 'Concursos', 17, 0, false, NOW() - INTERVAL '190 days', NOW() - INTERVAL '190 days'),
    (uuid_generate_v4(), u11, 'Rafael Souza||Tecnica pomodoro funciona mesmo!',
     'Comecei usar a tecnica pomodoro ha 3 semanas e meu rendimento aumentou 40%. 25 min de foco total + 5 min de descanso. Testem!',
     'Dicas', 'Dicas', 65, 2, false, NOW() - INTERVAL '175 days', NOW() - INTERVAL '175 days'),
    (uuid_generate_v4(), u12, 'Juliana Barbosa||Enem com 80% de aproveitamento',
     'Gente que alegria! Fiz o ENEM no sabado e saindo ja sabia que tinha ido bem. Hoje o gabarito confirmou: acertei 80% das questoes. Muito feliz!',
     'Conquistas', 'Conquistas', 94, 0, false, NOW() - INTERVAL '160 days', NOW() - INTERVAL '160 days'),
    (uuid_generate_v4(), u13, 'Andre Carvalho||Duvida OAB - Processo Civil',
     'Alguem pode me ajudar com competencia territorial no CPC? Estou confundindo as regras gerais com as excecoes. Ja li 3 vezes e nao fixou...',
     'OAB', 'OAB', 31, 0, false, NOW() - INTERVAL '145 days', NOW() - INTERVAL '145 days'),
    (uuid_generate_v4(), u14, 'Patricia Gomes||Passei no vestibular para engenharia',
     'Prestei vestibular para engenharia civil em 4 faculdades. Passei em 2! Escolhi a publica e vou estudar muito. Obrigada pela ajuda de todos aqui!',
     'Vestibular', 'Vestibular', 77, 0, false, NOW() - INTERVAL '130 days', NOW() - INTERVAL '130 days'),
    (uuid_generate_v4(), u15, 'Vinicius Martins||Dicas de matematica financeira CPA',
     'Para quem esta estudando CPA-20: matematica financeira e eliminatoria. Foquem em taxa efetiva vs nominal, e calculo de rentabilidade. Esses caem sempre!',
     'CPA-20', 'CPA-20', 53, 0, false, NOW() - INTERVAL '115 days', NOW() - INTERVAL '115 days'),
    (uuid_generate_v4(), u6,  'Fernanda Rocha||Como organizar cronograma de estudos',
     'Compartilhando meu cronograma que funcionou: 3h de estudo por dia, dividido em 2 materias. Final de semana revisao geral. Em 6 meses me sinto muito mais preparada!',
     'Dicas', 'Dicas', 48, 0, false, NOW() - INTERVAL '100 days', NOW() - INTERVAL '100 days'),
    (uuid_generate_v4(), u5,  'Diego Cavalcanti||Aprovado TRF!',
     'APROVADO NO TRF! Gente, depois de 3 anos tentando concurso, finalmente consegui! Cada simulado aqui no Tirei10 valeu muito. Gratidao a todos da comunidade!',
     'Conquistas', 'Conquistas', 112, 4, false, NOW() - INTERVAL '85 days', NOW() - INTERVAL '85 days'),
    (uuid_generate_v4(), u8,  'Amanda Teixeira||Duvida redacao ENEM competencia 3',
     'Alguem consegue me explicar a diferenca entre competencia 2 e 3 na redacao do ENEM? Sempre confundo argumentacao com coerencia. Perco muitos pontos nisso.',
     'Duvidas', 'Duvidas', 26, 0, false, NOW() - INTERVAL '70 days', NOW() - INTERVAL '70 days'),
    (uuid_generate_v4(), u11, 'Rodrigo Freitas||Portugues para concursos',
     'Dica de ouro para portugues em concursos: leiam o enunciado com calma. 70% dos erros sao por ler rapido demais. Antes de marcar, confirme a resposta!',
     'Concursos', 'Concursos', 39, 0, false, NOW() - INTERVAL '55 days', NOW() - INTERVAL '55 days'),
    (uuid_generate_v4(), u14, 'Priscila Monteiro||Passei no vestibular da UERJ!',
     'Passei na UERJ para o curso de Biologia! Era meu sonho desde o ensino medio. Estudei com muito foco nos ultimos 8 meses. Obrigada familia Tirei10!',
     'Conquistas', 'Conquistas', 86, 0, false, NOW() - INTERVAL '40 days', NOW() - INTERVAL '40 days'),
    (uuid_generate_v4(), u13, 'Henrique Azevedo||Dica para direito constitucional OAB',
     'Para quem esta estudando OAB: Direito Constitucional cai em toda prova. Foquem nos direitos fundamentais, processo legislativo e organizacao dos poderes. Nao negligenciem!',
     'OAB', 'OAB', 44, 0, false, NOW() - INTERVAL '25 days', NOW() - INTERVAL '25 days'),
    (uuid_generate_v4(), u2,  'Larissa Campos||Simulado ENEM resultado inesperado',
     'Fiz um simulado hoje e tirei 720 de media! Nunca tinha passado de 650. Nao sei bem o que mudou, mas estou no caminho certo. Continuem firmes pessoal!',
     'ENEM', 'ENEM', 33, 0, false, NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days');

  -- Fetch post IDs for replies
  SELECT id INTO p1  FROM public.forum_posts WHERE title = 'Gabriel Oliveira||Consegui 900 no ENEM!'              AND user_id = u1 LIMIT 1;
  SELECT id INTO p2  FROM public.forum_posts WHERE title = 'Ana Paula Ferreira||Duvida sobre logaritmos'          AND user_id = u2 LIMIT 1;
  SELECT id INTO p3  FROM public.forum_posts WHERE title = 'Carlos Eduardo Santos||Aprovado na OAB!'             AND user_id = u3 LIMIT 1;
  SELECT id INTO p4  FROM public.forum_posts WHERE title = 'Mariana Costa||Dicas para vestibular de medicina'    AND user_id = u4 LIMIT 1;
  SELECT id INTO p5  FROM public.forum_posts WHERE title = 'Lucas Rodrigues||Aprovado no concurso dos Correios'  AND user_id = u5 LIMIT 1;
  SELECT id INTO p7  FROM public.forum_posts WHERE title = 'Felipe Nascimento||CPA-20 aprovado na primeira tentativa' AND user_id = u7 LIMIT 1;
  SELECT id INTO p8  FROM public.forum_posts WHERE title = 'Camila Pereira||Duvida sobre redacao argumentativa'  AND user_id = u8 LIMIT 1;
  SELECT id INTO p11 FROM public.forum_posts WHERE title = 'Rafael Souza||Tecnica pomodoro funciona mesmo!'      AND user_id = u11 LIMIT 1;
  SELECT id INTO p17 FROM public.forum_posts WHERE title = 'Diego Cavalcanti||Aprovado TRF!'                     AND user_id = u5 LIMIT 1;

  -- Insert replies for post 1: Gabriel ENEM 900
  IF p1 IS NOT NULL THEN
    INSERT INTO public.forum_replies (post_id, user_id, content, likes, created_at) VALUES
      (p1, u2, 'Parabens Gabriel! Que inspiracao! Quanto tempo voce estudava por dia?', 8, NOW() - INTERVAL '346 days'),
      (p1, u9, 'Incrivel! Qual foi sua estrategia para redacao? Tenho dificuldade no tema!', 12, NOW() - INTERVAL '345 days'),
      (p1, u1, 'Estudava 4h por dia. Para redacao, lia um jornal diferente todo dia e escrevia um texto por semana para corrigir!', 15, NOW() - INTERVAL '344 days');
  END IF;

  -- Insert replies for post 2: Ana logaritmos
  IF p2 IS NOT NULL THEN
    INSERT INTO public.forum_replies (post_id, user_id, content, likes, created_at) VALUES
      (p2, u9, 'log base 2 de 32 = log2(2^5) = 5. Sempre tente escrever o numero como potencia da base!', 14, NOW() - INTERVAL '311 days'),
      (p2, u3, 'Exatamente o que o Thiago disse. Pratique com potencias de 2: 2,4,8,16,32,64. Fica natural!', 7, NOW() - INTERVAL '310 days'),
      (p2, u2, 'Valeu pessoal! Agora entendi! Vou praticar assim mesmo!', 5, NOW() - INTERVAL '309 days');
  END IF;

  -- Insert replies for post 3: Carlos OAB
  IF p3 IS NOT NULL THEN
    INSERT INTO public.forum_replies (post_id, user_id, content, likes, created_at) VALUES
      (p3, u13, 'Parabens Carlos! Quanto tempo estudou para passar?', 6, NOW() - INTERVAL '297 days'),
      (p3, u14, 'Que noticia maravilhosa! Voce fez cursinho ou estudou sozinho?', 4, NOW() - INTERVAL '296 days'),
      (p3, u3, 'Estudei por 6 meses, metade com cursinho online e metade por conta. O segredo e fazer muita questao!', 19, NOW() - INTERVAL '295 days');
  END IF;

  -- Insert replies for post 4: Mariana vestibular medicina
  IF p4 IS NOT NULL THEN
    INSERT INTO public.forum_replies (post_id, user_id, content, likes, created_at) VALUES
      (p4, u6, 'Eu tambem estou no cursinho! Foca em quimica e biologia que sao eliminatorias em medicina.', 11, NOW() - INTERVAL '279 days'),
      (p4, u9, 'Dica: faca redacoes sobre temas de saude, eles caem muito no ENEM junto com medicina!', 8, NOW() - INTERVAL '278 days');
  END IF;

  -- Insert replies for post 5: Lucas Correios
  IF p5 IS NOT NULL THEN
    INSERT INTO public.forum_replies (post_id, user_id, content, likes, created_at) VALUES
      (p5, u5, 'Qual cargo voce passou? Estou estudando para o mesmo concurso!', 5, NOW() - INTERVAL '264 days'),
      (p5, u6, 'Incrivel! O Tirei10 realmente ajuda muito. Continuem assim!', 9, NOW() - INTERVAL '263 days'),
      (p5, u5, 'Passei para carteiro mas ja estou estudando para o proximo nivel. Nao para!', 21, NOW() - INTERVAL '262 days');
  END IF;

  -- Insert replies for post 7: Felipe CPA-20
  IF p7 IS NOT NULL THEN
    INSERT INTO public.forum_replies (post_id, user_id, content, likes, created_at) VALUES
      (p7, u15, 'Show! Qual material voce usou alem do Tirei10? Preciso de indicacoes.', 7, NOW() - INTERVAL '234 days'),
      (p7, u10, 'Parabens Felipe! Eu estou tentando a CPA-10 primeiro. Voce acha que vale fazer as duas juntas?', 4, NOW() - INTERVAL '233 days'),
      (p7, u7, 'Usei apostila da ANBIMA e resolvi as provas antigas. Para CPA-10 antes e uma boa estrategia!', 16, NOW() - INTERVAL '232 days');
  END IF;

  -- Insert replies for post 8: Camila redacao
  IF p8 IS NOT NULL THEN
    INSERT INTO public.forum_replies (post_id, user_id, content, likes, created_at) VALUES
      (p8, u1, 'Repertorio vem de leitura! Leia Nexo, BBC Brasil e revistas de atualidades. Em 1 mes voce muda!', 22, NOW() - INTERVAL '219 days'),
      (p8, u6, 'Tambem recomendo anotar em um caderninho cada argumento que achar interessante. Cria um banco de dados!', 13, NOW() - INTERVAL '218 days');
  END IF;

  -- Insert replies for post 11: Rafael Pomodoro
  IF p11 IS NOT NULL THEN
    INSERT INTO public.forum_replies (post_id, user_id, content, likes, created_at) VALUES
      (p11, u8, 'Tambem uso pomodoro! Uma dica: no intervalo nao fique no celular, levante e caminhe um pouco!', 18, NOW() - INTERVAL '174 days'),
      (p11, u2, 'Vou tentar! Sempre estudo por horas sem parar e fico saturada. Obrigada pela dica!', 7, NOW() - INTERVAL '173 days');
  END IF;

  -- Insert replies for post 17: Diego TRF
  IF p17 IS NOT NULL THEN
    INSERT INTO public.forum_replies (post_id, user_id, content, likes, created_at) VALUES
      (p17, u11, 'Parabens Diego! Qual TRF e qual cargo? Inspirador demais!', 9, NOW() - INTERVAL '84 days'),
      (p17, u14, 'Que conquista! 3 anos de dedicacao recompensados. Parabens!', 11, NOW() - INTERVAL '83 days'),
      (p17, u5, 'TRF 3 regiao - Analista Judiciario. Nao desistam! Cada prova e aprendizado!', 27, NOW() - INTERVAL '82 days'),
      (p17, u13, 'Muito merecido! Voce e uma inspiracao para quem ainda esta no caminho!', 8, NOW() - INTERVAL '81 days');
  END IF;

  -- Re-enable FK checks
  SET session_replication_role = DEFAULT;

END;
$$;

SELECT seed_forum_data();
DROP FUNCTION IF EXISTS seed_forum_data();
