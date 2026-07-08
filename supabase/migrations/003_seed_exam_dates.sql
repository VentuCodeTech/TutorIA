-- ============================================================
-- Tirei10 -- Migration 003: Seed exam dates (Datas de Concursos e Editais)
--
-- Data sources are limited to official channels only:
--   - OAB: verified against https://examedeordem.oab.org.br (Coordenacao
--     Nacional do Exame de Ordem Unificado), consulted on 2026-07-08.
--     The OAB itself labels this an official but PROVISIONAL calendar,
--     subject to change -- re-check the source before relying on it for
--     hard deadlines.
--   - ENEM (INEP) and ANBIMA (nova CPA) dates were NOT seeded here because
--     an exact, verified calendar could not be confirmed live at the time
--     this migration was written. Populate those rows once confirmed via
--     https://www.gov.br/inep (ENEM) and https://www.anbima.com.br (CPA)
--     instead of guessing dates -- wrong exam dates are worse than none.
-- ============================================================

insert into public.exam_dates (exam, title, description, event_type, event_date, source_url, official_source, year)
values
('oab', '46 Exame de Ordem Unificado - Edital de Abertura', 'Publicacao do edital de abertura do 46 Exame de Ordem Unificado.', 'edital', '2026-01-26', 'https://examedeordem.oab.org.br', 'OAB - Coordenacao Nacional do Exame de Ordem Unificado', 2026), -- NOSONAR
('oab', '46 Exame de Ordem Unificado - Inscricoes', 'Periodo de inscricao do 46 Exame de Ordem Unificado.', 'inscricao_inicio', '2026-02-02', 'https://examedeordem.oab.org.br', 'OAB - Coordenacao Nacional do Exame de Ordem Unificado', 2026), -- NOSONAR
('oab', '46 Exame de Ordem Unificado - Fim das Inscricoes', 'Encerramento do periodo de inscricao do 46 Exame de Ordem Unificado.', 'inscricao_fim', '2026-02-09', 'https://examedeordem.oab.org.br', 'OAB - Coordenacao Nacional do Exame de Ordem Unificado', 2026), -- NOSONAR
('oab', '46 Exame de Ordem Unificado - Prova Objetiva (1a fase)', 'Aplicacao da prova objetiva da 1a fase do 46 Exame de Ordem Unificado.', 'prova', '2026-05-03', 'https://examedeordem.oab.org.br', 'OAB - Coordenacao Nacional do Exame de Ordem Unificado', 2026), -- NOSONAR
('oab', '46 Exame de Ordem Unificado - Prova Pratico-Profissional (2a fase)', 'Aplicacao da prova pratico-profissional da 2a fase do 46 Exame de Ordem Unificado.', 'prova', '2026-06-21', 'https://examedeordem.oab.org.br', 'OAB - Coordenacao Nacional do Exame de Ordem Unificado', 2026), -- NOSONAR
('oab', '47 Exame de Ordem Unificado - Edital de Abertura', 'Publicacao do edital de abertura do 47 Exame de Ordem Unificado.', 'edital', '2026-05-25', 'https://examedeordem.oab.org.br', 'OAB - Coordenacao Nacional do Exame de Ordem Unificado', 2026), -- NOSONAR
('oab', '47 Exame de Ordem Unificado - Inscricoes', 'Periodo de inscricao do 47 Exame de Ordem Unificado.', 'inscricao_inicio', '2026-06-01', 'https://examedeordem.oab.org.br', 'OAB - Coordenacao Nacional do Exame de Ordem Unificado', 2026), -- NOSONAR
('oab', '47 Exame de Ordem Unificado - Fim das Inscricoes', 'Encerramento do periodo de inscricao do 47 Exame de Ordem Unificado.', 'inscricao_fim', '2026-06-08', 'https://examedeordem.oab.org.br', 'OAB - Coordenacao Nacional do Exame de Ordem Unificado', 2026), -- NOSONAR
('oab', '47 Exame de Ordem Unificado - Prova Objetiva (1a fase)', 'Aplicacao da prova objetiva da 1a fase do 47 Exame de Ordem Unificado.', 'prova', '2026-08-30', 'https://examedeordem.oab.org.br', 'OAB - Coordenacao Nacional do Exame de Ordem Unificado', 2026), -- NOSONAR
('oab', '47 Exame de Ordem Unificado - Prova Pratico-Profissional (2a fase)', 'Aplicacao da prova pratico-profissional da 2a fase do 47 Exame de Ordem Unificado.', 'prova', '2026-10-18', 'https://examedeordem.oab.org.br', 'OAB - Coordenacao Nacional do Exame de Ordem Unificado', 2026), -- NOSONAR
('oab', '48 Exame de Ordem Unificado - Edital de Abertura', 'Publicacao do edital de abertura do 48 Exame de Ordem Unificado.', 'edital', '2026-09-21', 'https://examedeordem.oab.org.br', 'OAB - Coordenacao Nacional do Exame de Ordem Unificado', 2026), -- NOSONAR
('oab', '48 Exame de Ordem Unificado - Inscricoes', 'Periodo de inscricao do 48 Exame de Ordem Unificado.', 'inscricao_inicio', '2026-09-28', 'https://examedeordem.oab.org.br', 'OAB - Coordenacao Nacional do Exame de Ordem Unificado', 2026), -- NOSONAR
('oab', '48 Exame de Ordem Unificado - Fim das Inscricoes', 'Encerramento do periodo de inscricao do 48 Exame de Ordem Unificado.', 'inscricao_fim', '2026-10-05', 'https://examedeordem.oab.org.br', 'OAB - Coordenacao Nacional do Exame de Ordem Unificado', 2026); -- NOSONAR
