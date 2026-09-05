-- ============================================================================
-- WEBSTUDIO — views da schema "integration"
-- Espelham o padrão já usado pela Contela: uma camada de leitura, plana e
-- estável, que o WebstudioConnector do Evolure Intelligence consome
-- (raw -> staging -> core...), sem acoplar o pipeline de analytics aos
-- schemas internos do Webstudio (shared / commercial / delivery / development).
--
-- Rodar depois de `prisma migrate deploy`:
--   psql $DATABASE_URL -f prisma/views.sql
-- ============================================================================

CREATE SCHEMA IF NOT EXISTS integration;

-- customers -------------------------------------------------------------
CREATE OR REPLACE VIEW integration.customers AS
SELECT
  c.id,
  c.name,
  c.email,
  c.company,
  c.created_at,
  c.updated_at
FROM shared.clients c;

-- leads -------------------------------------------------------------------
CREATE OR REPLACE VIEW integration.leads AS
SELECT
  l.id,
  l.name,
  l.email,
  l.source,
  l.status,
  l.client_id,
  l.created_at
FROM commercial.leads l;

-- projects ------------------------------------------------------------------
CREATE OR REPLACE VIEW integration.projects AS
SELECT
  p.id,
  p.client_id AS customer_id,
  p.name,
  p.status,
  p.budget,
  p.start_date,
  p.due_date,
  p.completed_at,
  p.created_at
FROM delivery.projects p;

-- revenue (faturas confirmadas, view analítica agregada por fatura) --------
CREATE OR REPLACE VIEW integration.revenue AS
SELECT
  i.id AS invoice_id,
  i.client_id AS customer_id,
  i.project_id,
  i.total AS amount,
  i.status,
  i.paid_at,
  i.created_at
FROM commercial.invoices i
WHERE i.status = 'PAID';

-- invoices ------------------------------------------------------------------
CREATE OR REPLACE VIEW integration.invoices AS
SELECT
  i.id,
  i.number,
  i.client_id AS customer_id,
  i.project_id,
  i.subtotal,
  i.tax,
  i.total,
  i.status,
  i.due_date,
  i.paid_at,
  i.created_at
FROM commercial.invoices i;

-- payments --------------------------------------------------------------
CREATE OR REPLACE VIEW integration.payments AS
SELECT
  pay.id,
  pay.invoice_id,
  inv.client_id AS customer_id,
  pay.amount,
  pay.method,
  pay.status,
  pay.paid_at,
  pay.created_at
FROM commercial.payments pay
JOIN commercial.invoices inv ON inv.id = pay.invoice_id;

-- expenses --------------------------------------------------------------
CREATE OR REPLACE VIEW integration.expenses AS
SELECT
  e.id,
  e.category,
  e.description,
  e.amount,
  e.date,
  e.project_id,
  e.created_at
FROM commercial.expenses e;

-- activities ------------------------------------------------------------
CREATE OR REPLACE VIEW integration.activities AS
SELECT
  a.id,
  a.type,
  a.entity_type,
  a.entity_id,
  a.client_id AS customer_id,
  a.created_at
FROM shared.activities a;

-- development_activity ---------------------------------------------------
-- NOVO: expõe a atividade de desenvolvimento (Development Lab) para o
-- Evolure Intelligence poder correlacionar foco/commits com entregas.
CREATE OR REPLACE VIEW integration.development_activity AS
SELECT
  da.id,
  da.user_id,
  da.date,
  da.event_count,
  da.focus_secs,
  da.created_at
FROM development.development_activity da;
