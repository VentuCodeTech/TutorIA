-- ============================================================
-- Tirei10 -- Migration 003: Seed exam dates (Datas de Concursos e Editais)
--
-- Data sources are limited to official channels only:
-- - OAB: verified against https://examedeordem.oab.org.br/Calendario
--   (Coordenacao Nacional do Exame de Ordem Unificado), consulted on
--   2026-07-14. The OAB itself labels this an official but PROVISIONAL
--   calendar, subject to change -- re-check the source before relying on
--   it for hard deadlines.
-- - ENEM: verified against https://www.gov.br/inep/pt-br/areas-de-atuacao/avaliacao-e-exames-educacionais/enem/orientacoes
--   (INEP), consulted on 2026-07-14. Only the "Aplicacao" (test day) dates
--   are seeded -- registration for Enem 2026 had already closed before
--   this migration was updated, so it has no product value here.
-- - Nova CPA (ANBIMA): checked at https://anbimaedu.com.br/certificacao/cpa
--   on 2026-07-14. The CPA has NO fixed national exam date -- candidates
--   schedule it on demand, individually, at a test center of their choice,
--   any time after enrollment and payment. Because of this, no CPA "prova"
--   row is seeded here; a single fixed date would be incorrect and
--   misleading.
-- - General public tenders ("concurso") continue to be added manually by
--   the Tirei10 team as each edital is published, since there is no
--   unified official government API for this.
-- ============================================================

insert into public.exam_dates (exam, title, description, event_type, event_date, source_url, official_source, year)
values
('oab', '46 Exame de Ordem Unificado - Edital de Abertura', 'Publicacao do edital de abertura do 46 Exame de Ordem Unificado.', 'edital', '2026-01-26', 'https://examedeordem.oab.org.br/Calendario', 'OAB - Coordenacao Nacional do Exame de Ordem Unificado', 2026), -- NOSONAR
('oab', '46 Exame de Ordem Unificado - Inscricoes', 'Periodo de inscricao do 46 Exame de Ordem Unificado.', 'inscricao_inicio', '2026-02-02', 'https://examedeordem.oab.org.br/Calendario', 'OAB - Coordenacao Nacional do Exame de Ordem Unificado', 2026), -- NOSONAR
('oab', '46 Exame de Ordem Unificado - Fim das Inscricoes', 'Encerramento do periodo de inscricao do 46 Exame de Ordem Unificado.', 'inscricao_fim', '2026-02-09', 'https://examedeordem.oab.org.br/Calendario', 'OAB - Coordenacao Nacional do Exame de Ordem Unificado', 2026), -- NOSONAR
('oab', '46 Exame de Ordem Unificado - Prova Objetiva (1a fase)', 'Aplicacao da prova objetiva da 1a fase do 46 Exame de Ordem Unificado.', 'prova', '2026-05-03', 'https://examedeordem.oab.org.br/Calendario', 'OAB - Coordenacao Nacional do Exame de Ordem Unificado', 2026), -- NOSONAR
('oab', '46 Exame de Ordem Unificado - Prova Pratico-Profissional (2a fase)', 'Aplicacao da prova pratico-profissional da 2a fase do 46 Exame de Ordem Unificado.', 'prova', '2026-06-21', 'https://examedeordem.oab.org.br/Calendario', 'OAB - Coordenacao Nacional do Exame de Ordem Unificado', 2026), -- NOSONAR
('oab', '47 Exame de Ordem Unificado - Edital de Abertura', 'Publicacao do edital de abertura do 47 Exame de Ordem Unificado.', 'edital', '2026-05-25', 'https://examedeordem.oab.org.br/Calendario', 'OAB - Coordenacao Nacional do Exame de Ordem Unificado', 2026), -- NOSONAR
('oab', '47 Exame de Ordem Unificado - Inscricoes', 'Periodo de inscricao do 47 Exame de Ordem Unificado.', 'inscricao_inicio', '2026-06-01', 'https://examedeordem.oab.org.br/Calendario', 'OAB - Coordenacao Nacional do Exame de Ordem Unificado', 2026), -- NOSONAR
('oab', '47 Exame de Ordem Unificado - Fim das Inscricoes', 'Encerramento do periodo de inscricao do 47 Exame de Ordem Unificado.', 'inscricao_fim', '2026-06-08', 'https://examedeordem.oab.org.br/Calendario', 'OAB - Coordenacao Nacional do Exame de Ordem Unificado', 2026), -- NOSONAR
('oab', '47 Exame de Ordem Unificado - Prova Objetiva (1a fase)', 'Aplicacao da prova objetiva da 1a fase do 47 Exame de Ordem Unificado.', 'prova', '2026-09-06', 'https://examedeordem.oab.org.br/Calendario', 'OAB - Coordenacao Nacional do Exame de Ordem Unificado', 2026), -- NOSONAR
('oab', '47 Exame de Ordem Unificado - Prova Pratico-Profissional (2a fase)', 'Aplicacao da prova pratico-profissional da 2a fase do 47 Exame de Ordem Unificado.', 'prova', '2026-10-18', 'https://examedeordem.oab.org.br/Calendario', 'OAB - Coordenacao Nacional do Exame de Ordem Unificado', 2026), -- NOSONAR
('oab', '48 Exame de Ordem Unificado - Edital de Abertura', 'Publicacao do edital de abertura do 48 Exame de Ordem Unificado.', 'edital', '2026-09-21', 'https://examedeordem.oab.org.br/Calendario', 'OAB - Coordenacao Nacional do Exame de Ordem Unificado', 2026), -- NOSONAR
('oab', '48 Exame de Ordem Unificado - Inscricoes', 'Periodo de inscricao do 48 Exame de Ordem Unificado.', 'inscricao_inicio', '2026-09-28', 'https://examedeordem.oab.org.br/Calendario', 'OAB - Coordenacao Nacional do Exame de Ordem Unificado', 2026), -- NOSONAR
('oab', '48 Exame de Ordem Unificado - Fim das Inscricoes', 'Encerramento do periodo de inscricao do 48 Exame de Ordem Unificado.', 'inscricao_fim', '2026-10-05', 'https://examedeordem.oab.org.br/Calendario', 'OAB - Coordenacao Nacional do Exame de Ordem Unificado', 2026), -- NOSONAR
('oab', '48 Exame de Ordem Unificado - Prova Objetiva (1a fase)', 'Aplicacao da prova objetiva da 1a fase do 48 Exame de Ordem Unificado.', 'prova', '2027-01-10', 'https://examedeordem.oab.org.br/Calendario', 'OAB - Coordenacao Nacional do Exame de Ordem Unificado', 2027), -- NOSONAR
('oab', '48 Exame de Ordem Unificado - Prova Pratico-Profissional (2a fase)', 'Aplicacao da prova pratico-profissional da 2a fase do 48 Exame de Ordem Unificado.', 'prova', '2027-02-28', 'https://examedeordem.oab.org.br/Calendario', 'OAB - Coordenacao Nacional do Exame de Ordem Unificado', 2027), -- NOSONAR
('oab', '49 Exame de Ordem Unificado - Edital de Abertura', 'Publicacao do edital de abertura do 49 Exame de Ordem Unificado.', 'edital', '2027-01-22', 'https://examedeordem.oab.org.br/Calendario', 'OAB - Coordenacao Nacional do Exame de Ordem Unificado', 2027), -- NOSONAR
('oab', '49 Exame de Ordem Unificado - Inscricoes', 'Periodo de inscricao do 49 Exame de Ordem Unificado.', 'inscricao_inicio', '2027-01-29', 'https://examedeordem.oab.org.br/Calendario', 'OAB - Coordenacao Nacional do Exame de Ordem Unificado', 2027), -- NOSONAR
('oab', '49 Exame de Ordem Unificado - Fim das Inscricoes', 'Encerramento do periodo de inscricao do 49 Exame de Ordem Unificado.', 'inscricao_fim', '2027-02-05', 'https://examedeordem.oab.org.br/Calendario', 'OAB - Coordenacao Nacional do Exame de Ordem Unificado', 2027), -- NOSONAR
('oab', '49 Exame de Ordem Unificado - Prova Objetiva (1a fase)', 'Aplicacao da prova objetiva da 1a fase do 49 Exame de Ordem Unificado.', 'prova', '2027-05-09', 'https://examedeordem.oab.org.br/Calendario', 'OAB - Coordenacao Nacional do Exame de Ordem Unificado', 2027), -- NOSONAR
('oab', '49 Exame de Ordem Unificado - Prova Pratico-Profissional (2a fase)', 'Aplicacao da prova pratico-profissional da 2a fase do 49 Exame de Ordem Unificado.', 'prova', '2027-07-04', 'https://examedeordem.oab.org.br/Calendario', 'OAB - Coordenacao Nacional do Exame de Ordem Unificado', 2027), -- NOSONAR
('oab', '50 Exame de Ordem Unificado - Edital de Abertura', 'Publicacao do edital de abertura do 50 Exame de Ordem Unificado.', 'edital', '2027-05-31', 'https://examedeordem.oab.org.br/Calendario', 'OAB - Coordenacao Nacional do Exame de Ordem Unificado', 2027), -- NOSONAR
('oab', '50 Exame de Ordem Unificado - Inscricoes', 'Periodo de inscricao do 50 Exame de Ordem Unificado.', 'inscricao_inicio', '2027-06-07', 'https://examedeordem.oab.org.br/Calendario', 'OAB - Coordenacao Nacional do Exame de Ordem Unificado', 2027), -- NOSONAR
('oab', '50 Exame de Ordem Unificado - Fim das Inscricoes', 'Encerramento do periodo de inscricao do 50 Exame de Ordem Unificado.', 'inscricao_fim', '2027-06-14', 'https://examedeordem.oab.org.br/Calendario', 'OAB - Coordenacao Nacional do Exame de Ordem Unificado', 2027), -- NOSONAR
('oab', '50 Exame de Ordem Unificado - Prova Objetiva (1a fase)', 'Aplicacao da prova objetiva da 1a fase do 50 Exame de Ordem Unificado.', 'prova', '2027-09-12', 'https://examedeordem.oab.org.br/Calendario', 'OAB - Coordenacao Nacional do Exame de Ordem Unificado', 2027), -- NOSONAR
('oab', '50 Exame de Ordem Unificado - Prova Pratico-Profissional (2a fase)', 'Aplicacao da prova pratico-profissional da 2a fase do 50 Exame de Ordem Unificado.', 'prova', '2027-10-31', 'https://examedeordem.oab.org.br/Calendario', 'OAB - Coordenacao Nacional do Exame de Ordem Unificado', 2027), -- NOSONAR
('enem', 'ENEM 2026 - Aplicacao (1o dia)', 'Aplicacao das provas de Linguagens, Redacao e Ciencias Humanas do Enem 2026.', 'prova', '2026-11-08', 'https://www.gov.br/inep/pt-br/areas-de-atuacao/avaliacao-e-exames-educacionais/enem/orientacoes', 'INEP - Instituto Nacional de Estudos e Pesquisas Educacionais', 2026), -- NOSONAR
('enem', 'ENEM 2026 - Aplicacao (2o dia)', 'Aplicacao das provas de Ciencias da Natureza e Matematica do Enem 2026.', 'prova', '2026-11-15', 'https://www.gov.br/inep/pt-br/areas-de-atuacao/avaliacao-e-exames-educacionais/enem/orientacoes', 'INEP - Instituto Nacional de Estudos e Pesquisas Educacionais', 2026); -- NOSONAR
