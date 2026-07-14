-- ============================================================
-- Tirei10 -- Migration 004: More exam categories + exam dates
-- (Fuvest, Unicamp, Unesp, EsPCEx, EFOMM, ESA)
-- Applied directly in the Supabase SQL Editor after 003_seed_exam_dates.sql
-- ============================================================

alter table public.exam_dates drop constraint if exists exam_dates_exam_check;
alter table public.exam_dates add constraint exam_dates_exam_check
  check (exam in ('enem', 'oab', 'cpa', 'concurso', 'vestibular', 'militar')); -- NOSONAR

insert into public.exam_dates (exam, title, description, event_type, event_date, source_url, official_source, year) values
('vestibular', 'Inicio das inscricoes - FUVEST 2027', 'Abertura do periodo de inscricao para o Vestibular FUVEST 2027 (USP).', 'inscricao_inicio', '2026-08-17', 'https://www.fuvest.br/vestibular-da-usp', 'FUVEST', 2027),
('vestibular', 'Fim das inscricoes - FUVEST 2027', 'Encerramento do periodo de inscricao e prazo final para pagamento da taxa.', 'inscricao_fim', '2026-10-09', 'https://www.fuvest.br/vestibular-da-usp', 'FUVEST', 2027),
('vestibular', 'Prova da 1a Fase - FUVEST 2027', 'Prova de Conhecimentos Gerais (1a fase) do Vestibular FUVEST 2027.', 'prova', '2026-11-01', 'https://www.fuvest.br/vestibular-da-usp', 'FUVEST', 2027),
('vestibular', 'Provas da 2a Fase - FUVEST 2027', 'Provas dissertativas de Portugues e Redacao (06/12) e Disciplinas Especificas (07/12).', 'prova', '2026-12-06', 'https://www.fuvest.br/vestibular-da-usp', 'FUVEST', 2027),
('vestibular', 'Inicio das inscricoes - Vestibular UNICAMP 2027', 'Abertura das inscricoes para o Vestibular Unicamp 2027.', 'inscricao_inicio', '2026-08-03', 'https://www.comvest.unicamp.br/ingresso-2027/vestibular-2027/', 'COMVEST/UNICAMP', 2027),
('vestibular', 'Fim das inscricoes - Vestibular UNICAMP 2027', 'Encerramento das inscricoes para o Vestibular Unicamp 2027.', 'inscricao_fim', '2026-08-31', 'https://www.comvest.unicamp.br/ingresso-2027/vestibular-2027/', 'COMVEST/UNICAMP', 2027),
('vestibular', 'Prova da 1a Fase - Vestibular UNICAMP 2027', 'Prova unica de Conhecimentos Gerais (1a fase).', 'prova', '2026-10-18', 'https://www.comvest.unicamp.br/ingresso-2027/vestibular-2027/', 'COMVEST/UNICAMP', 2027),
('vestibular', 'Prova da 2a Fase - Vestibular UNICAMP 2027', 'Provas dissertativas (2a fase), aplicadas em 29 e 30 de novembro.', 'prova', '2026-11-29', 'https://www.comvest.unicamp.br/ingresso-2027/vestibular-2027/', 'COMVEST/UNICAMP', 2027),
('vestibular', 'Resultado - Vestibular UNICAMP 2027', 'Divulgacao da primeira lista de aprovados e inicio da matricula online.', 'resultado', '2027-01-25', 'https://www.comvest.unicamp.br/ingresso-2027/vestibular-2027/', 'COMVEST/UNICAMP', 2027),
('vestibular', 'Inicio das inscricoes - Vestibular UNESP 2027', 'Abertura das inscricoes do Vestibular Unesp 2027.', 'inscricao_inicio', '2026-09-04', 'https://www.vunesp.com.br/VNSP2514', 'VUNESP/UNESP', 2027),
('vestibular', 'Fim das inscricoes - Vestibular UNESP 2027', 'Encerramento das inscricoes do Vestibular Unesp 2027.', 'inscricao_fim', '2026-10-20', 'https://www.vunesp.com.br/VNSP2514', 'VUNESP/UNESP', 2027),
('vestibular', 'Prova da 1a Fase - Vestibular UNESP 2027', 'Prova objetiva da 1a fase do Vestibular Unesp 2027.', 'prova', '2026-11-22', 'https://www.vunesp.com.br/VNSP2514', 'VUNESP/UNESP', 2027),
('vestibular', 'Prova da 2a Fase - Vestibular UNESP 2027', 'Provas dissertativas da 2a fase, aplicadas em 13 e 14 de dezembro.', 'prova', '2026-12-13', 'https://www.vunesp.com.br/VNSP2514', 'VUNESP/UNESP', 2027),
('militar', 'Prova - Concurso EsPCEx 2027', 'Provas do Concurso de Admissao a Escola Preparatoria de Cadetes do Exercito (EsPCEx), aplicadas em 12 e 13 de setembro.', 'prova', '2026-09-12', 'https://www.vunesp.com.br/EPCE2601', 'Exercito Brasileiro / EsPCEx', 2027),
('militar', 'Prova - Concurso EFOMM 2027', 'Prova objetiva do Processo Seletivo para a Escola de Formacao de Oficiais da Marinha Mercante (EFOMM), aplicada em 25 e 26 de julho.', 'prova', '2026-07-25', 'https://www.marinha.mil.br/ciaga/node', 'Marinha do Brasil / EFOMM', 2027),
('militar', 'Prova - Concurso ESA 2027', 'Prova objetiva do Concurso de Admissao aos Cursos de Formacao de Sargentos das Armas (ESA), do Exercito Brasileiro.', 'prova', '2026-07-26', 'https://www.gov.br/pt-br/servicos/ingressar-na-escola-de-sargentos-das-armas-esa', 'Exercito Brasileiro / ESA', 2027);
