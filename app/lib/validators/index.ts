import { z } from "zod";

// A UI (Select "Selecionar...", campos limpos) envia "" para dizer "sem
// valor" — sem isto, "" passaria a validação (é uma string válida) mas
// rebentava no Prisma como FK inválida (ex: projectId: "").
const nullableString = () =>
  z.preprocess((v) => (v === "" ? null : v), z.string().nullish());
const nullableDate = () =>
  z.preprocess((v) => (v === "" ? null : v), z.coerce.date().nullish());
const nullableNumber = () =>
  z.preprocess(
    (v) => (v === "" || (typeof v === "number" && Number.isNaN(v)) ? null : v),
    z.number().nonnegative().nullish()
  );

export const itemSchema = z.object({
  serviceId: nullableString(),
  description: z.string().min(1),
  quantity: z.number().positive(),
  unitPrice: z.number().nonnegative(),
});

export const clientSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: nullableString(),
  company: nullableString(),
  taxId: nullableString(),
  address: nullableString(),
  notes: nullableString(),
});
export const clientUpdateSchema = clientSchema.partial();

export const leadSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: nullableString(),
  company: nullableString(),
  source: nullableString(),
  message: nullableString(),
  ownerId: nullableString(),
});
export const leadUpdateSchema = leadSchema.partial().extend({
  status: z
    .enum(["NEW", "CONTACTED", "QUALIFIED", "PROPOSAL_SENT", "WON", "LOST"])
    .optional(),
});

export const serviceSchema = z.object({
  name: z.string().min(2),
  description: nullableString(),
  basePrice: z.number().nonnegative(),
  unit: nullableString(),
  active: z.boolean().optional(),
});
export const serviceUpdateSchema = serviceSchema.partial();

export const proposalSchema = z.object({
  clientId: z.string(),
  leadId: nullableString(),
  title: z.string().min(2),
  description: nullableString(),
  items: z.array(itemSchema).min(1),
  validUntil: nullableDate(),
});
export const proposalUpdateSchema = proposalSchema.partial().extend({
  status: z.enum(["DRAFT", "SENT", "ACCEPTED", "REJECTED", "EXPIRED"]).optional(),
});

export const contractSchema = z.object({
  clientId: z.string(),
  proposalId: nullableString(),
  title: z.string().min(2),
  terms: nullableString(),
  value: z.number().nonnegative(),
  startDate: nullableDate(),
  endDate: nullableDate(),
});
export const contractUpdateSchema = contractSchema.partial().extend({
  status: z.enum(["DRAFT", "SIGNED", "ACTIVE", "COMPLETED", "CANCELLED"]).optional(),
});

export const projectSchema = z.object({
  clientId: z.string(),
  contractId: nullableString(),
  name: z.string().min(2),
  description: nullableString(),
  budget: nullableNumber(),
  startDate: nullableDate(),
  dueDate: nullableDate(),
  ownerId: nullableString(),
});
export const projectUpdateSchema = projectSchema.partial().extend({
  status: z
    .enum(["PLANNING", "IN_PROGRESS", "ON_HOLD", "COMPLETED", "CANCELLED"])
    .optional(),
});

export const taskSchema = z.object({
  projectId: nullableString(), // opcional: tasks vindas de propostas do Labs (source=LABS_PROPOSAL) não têm projeto
  title: z.string().min(2),
  description: nullableString(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
  assigneeId: nullableString(),
  dueDate: nullableDate(),
});
export const taskUpdateSchema = taskSchema.partial().extend({
  status: z.enum(["TODO", "IN_PROGRESS", "REVIEW", "DONE"]).optional(),
});

// Payload que o Labs envia ao aceitar uma actions.task_proposals (W8/L4).
// Não é o mesmo shape do taskSchema normal — vem sem projectId/assigneeId,
// e sourceProposalId é o que garante idempotência (ver task-proposals/route.ts).
export const taskProposalSchema = z.object({
  title: z.string().min(2),
  description: nullableString(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  sourceProposalId: z.string().min(1),
});

export const invoiceSchema = z.object({
  clientId: z.string(),
  projectId: nullableString(),
  items: z.array(itemSchema).min(1),
  tax: z.number().nonnegative().optional(),
  dueDate: nullableDate(),
});
export const invoiceUpdateSchema = invoiceSchema.partial().extend({
  status: z.enum(["DRAFT", "SENT", "PAID", "OVERDUE", "CANCELLED"]).optional(),
});

export const paymentSchema = z.object({
  invoiceId: z.string(),
  amount: z.number().positive(),
  method: z.enum(["BANK_TRANSFER", "MPESA", "EMOLA", "CARD", "CASH", "OTHER"]),
  reference: nullableString(),
});

export const expenseSchema = z.object({
  category: z.enum([
    "SOFTWARE",
    "HOSTING",
    "MARKETING",
    "EQUIPMENT",
    "CONTRACTOR",
    "TAXES",
    "OTHER",
  ]),
  description: z.string().min(2),
  amount: z.number().positive(),
  date: z.coerce.date().optional(),
  projectId: nullableString(),
});

export const campaignSchema = z.object({
  name: z.string().min(2),
  channel: z.string().min(2),
  budget: nullableNumber(),
  startDate: nullableDate(),
  endDate: nullableDate(),
});
export const campaignUpdateSchema = campaignSchema.partial().extend({
  status: z.enum(["PLANNED", "ACTIVE", "PAUSED", "COMPLETED"]).optional(),
  metrics: z.record(z.string(), z.any()).optional(),
});

export const userSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(["ADMIN", "STAFF", "CLIENT"]).optional(),
});
export const userUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  role: z.enum(["ADMIN", "STAFF", "CLIENT"]).optional(),
  active: z.boolean().optional(),
});
