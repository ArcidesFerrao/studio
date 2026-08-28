# Webstudio — Backend

Backend do Lab **Webstudio** (Evolure Labs), construído sobre a landing page
Next.js existente. Segue o mesmo stack e os mesmos padrões já usados no
Evolure Intelligence e no backend da Contela.

## Arquitetura

```
Lead → Proposta → Contrato → Projeto → Tarefa → Fatura → Pagamento
```

Cada transição de estado relevante (proposta enviada/aceite, contrato
assinado, projeto concluído, fatura paga...) grava um registo em duas
tabelas, dentro da mesma transação:

- **`outbox`** — fila técnica de eventos, consumida pelo futuro
  **WebstudioConnector** do Evolure Intelligence (mesmo padrão do
  ContelaConnector: `raw → staging → core`).
- **`activities`** — timeline legível para a equipa dentro do próprio
  Webstudio (feed de atividades no dashboard).

A schema `integration` (`prisma/views.sql`) expõe views SQL somente-leitura
(`customers`, `projects`, `revenue`, `invoices`, `payments`, `expenses`,
`leads`, `activities`) para o Evolure Intelligence consumir sem se acoplar
ao schema interno `operational`.

## Estrutura de pastas

Esta estrutura assume o layout **sem `src/`** do repositório atual do
Webstudio (`app/` e `lib/` diretamente na raiz, ao lado de `node_modules`,
`public`, `.env`).

```
prisma/
  schema.prisma        modelos da schema "operational"
  views.sql             views da schema "integration"
  seed.ts               cria o utilizador admin inicial

lib/
  db.ts                cliente Prisma singleton
  auth.ts               configuração do NextAuth
  permissions.ts        RBAC — requireUser / requireStaff / requireAdmin
  api-response.ts       respostas JSON e tratamento de erros padronizados
  api-key-auth.ts       verificação de API key (rota de integração)
  storage.ts             abstração de upload de ficheiros
  pagination.ts
  metaCAPI.ts            (já existente — Meta Conversions API, não tocado)
  pixel.ts                (já existente — Meta Pixel, não tocado)
  events/
    types.ts             tipos dos eventos de domínio
    publisher.ts          grava em outbox + activities
    outbox.ts              leitura/confirmação de eventos (consumo externo)
  validators/            schemas Zod por domínio
  services/
    lead.service.ts       lógica de negócio: leads
    proposal.service.ts   lógica de negócio: propostas (envio/resposta)
    contract.service.ts   lógica de negócio: contratos
    project.service.ts    lógica de negócio: projetos
    task.service.ts       lógica de negócio: tarefas
    invoice.service.ts    lógica de negócio: faturas
    payment.service.ts    lógica de negócio: pagamentos
    crud-factory.ts       fábrica de CRUD genérico
    simple-services.ts    clients, services, expenses, campaigns, files,
                            notifications, users, api-keys via CRUD factory

app/
  api/
    contact                (já existente — não tocado)
    meta-event              (já existente — não tocado)
    pixel-event              (já existente — não tocado)
    auth/[...nextauth]     login (NextAuth)
    leads                  POST público (formulário do site) + GET (staff)
    leads/[id]/convert     converte lead em cliente
    clients                CRUD
    services                catálogo (GET público, escrita staff)
    proposals               + /send + /respond
    contracts
    projects
    tasks
    invoices                + /send
    payments
    expenses
    campaigns
    activities              timeline (somente leitura)
    notifications           + /[id]/read
    files                    upload multipart
    users                    apenas admin
    api-keys                 chaves para integrações server-to-server
    audit-logs               apenas admin
    integration/events       consumido pelo WebstudioConnector (API key)
  layout.tsx              (já existente — não tocado)
  page.tsx                 (já existente — não tocado)
  webstudio.css             (já existente — não tocado)

middleware.ts             exige sessão em toda /api, exceto rotas públicas
types/next-auth.d.ts       tipos estendidos da sessão (id, role)
```

## Como integrar no repositório atual

1. Copia as pastas `prisma/`, `lib/` (o conteúdo novo — não sobrescreve
   `metaCAPI.ts` nem `pixel.ts`, que continuam onde estão), `app/api/` (as
   subpastas novas listadas acima — `contact`, `meta-event` e `pixel-event`
   ficam intactas), `middleware.ts` e `types/` para a raiz do repositório
   `web-studio`.
2. Junta as dependências de `package.json` (`next-auth`, `@prisma/client`,
   `bcryptjs`, `zod`, `prisma`, `tsx`, `@types/bcryptjs`) ao `package.json`
   já existente — mantém as tuas dependências atuais (Next, React, etc.).
3. No `.env` já existente, acrescenta as variáveis de `.env.example`
   (`DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `SEED_ADMIN_EMAIL`,
   `SEED_ADMIN_PASSWORD`).
4. Confirma no teu `tsconfig.json` que `"@/*"` aponta para `"./*"` (padrão
   quando não se usa `src/`) — os imports `@/lib/...` já foram escritos
   partindo desse pressuposto.
5. Corre:
   ```bash
   npm install
   npm run db:generate
   npm run db:migrate      # cria as tabelas da schema "operational"
   npm run db:views        # cria as views da schema "integration"
   npm run db:seed         # cria o utilizador admin inicial
   npm run dev
   ```
6. O formulário de contacto/orçamento da landing page (`components/Contact.tsx`
   / `ContactNew.tsx` / `FormLean.tsx`) passa a poder chamar `POST /api/leads`
   (sem autenticação) em vez de, ou além de, `app/api/contact` — se
   `app/api/contact` hoje só envia email, dá para manter os dois: o form
   chama `/api/leads` para persistir no CRM, e opcionalmente continuas a
   disparar o email por `contact` ou por um hook dentro do
   `lead.service.ts` (`createFromPublicForm`).

## Segurança (RBAC)

Três papéis: `ADMIN`, `STAFF`, `CLIENT`.
- `requireStaff()` — ADMIN ou STAFF, usado na maioria das rotas de gestão.
- `requireAdmin()` — apenas ADMIN, usado em users, api-keys, audit-logs.
- `requireUser()` — qualquer sessão válida, usado em notificações.

O papel `CLIENT` já existe no schema e no NextAuth, pronto para quando
quiseres abrir uma área de cliente (acompanhar proposta/projeto/fatura) —
hoje nenhuma rota está aberta a ele; basta adicionar `"CLIENT"` a
`requireRole([...])` nas rotas que quiseres expor.

## O que falta (próximas fases)

- Rate limiting / logging estruturado na camada de infraestrutura.
- Cache (ex. Redis) para leituras pesadas do dashboard.
- Integração real de email (proposta enviada, fatura enviada) — hoje o
  `send` só muda o estado; falta o provedor de email.
- Integração de pagamento (M-Pesa/e-Mola/cartão) — hoje `payment.record()`
  assume conciliação manual; quando o registo da empresa e o acesso à API
  de pagamentos estiverem disponíveis, plugar o webhook do provedor para
  chamar `paymentService.record()` automaticamente.
- Construir o `WebstudioConnector` no Evolure Intelligence, consumindo
  `GET /api/integration/events` e as views da schema `integration`.
- Testes automatizados dos serviços de negócio (transições de estado).
