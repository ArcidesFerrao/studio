import { z } from "zod";

export const itemSchema = z.object({
  serviceId: z.string().optional(),
  description: z.string().min(1),
  quantity: z.number().positive(),
  unitPrice: z.number().nonnegative(),
});

export const clientSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  company: z.string().optional(),
  taxId: z.string().optional(),
  address: z.string().optional(),
  notes: z.string().optional(),
});
export const clientUpdateSchema = clientSchema.partial();

export const leadSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  company: z.string().optional(),
  source: z.string().optional(),
  message: z.string().optional(),
  ownerId: z.string().optional(),
});
export const leadUpdateSchema = leadSchema.partial().extend({
  status: z
    .enum(["NEW", "CONTACTED", "QUALIFIED", "PROPOSAL_SENT", "WON", "LOST"])
    .optional(),
});

export const serviceSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  basePrice: z.number().nonnegative(),
  unit: z.string().optional(),
  active: z.boolean().optional(),
});
export const serviceUpdateSchema = serviceSchema.partial();

export const proposalSchema = z.object({
  clientId: z.string(),
  leadId: z.string().optional(),
  title: z.string().min(2),
  description: z.string().optional(),
  items: z.array(itemSchema).min(1),
  validUntil: z.coerce.date().optional(),
});

export const contractSchema = z.object({
  clientId: z.string(),
  proposalId: z.string().optional(),
  title: z.string().min(2),
  terms: z.string().optional(),
  value: z.number().nonnegative(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
});
export const contractUpdateSchema = contractSchema.partial().extend({
  status: z.enum(["DRAFT", "SIGNED", "ACTIVE", "COMPLETED", "CANCELLED"]).optional(),
});

export const projectSchema = z.object({
  clientId: z.string(),
  contractId: z.string().optional(),
  name: z.string().min(2),
  description: z.string().optional(),
  budget: z.number().nonnegative().optional(),
  startDate: z.coerce.date().optional(),
  dueDate: z.coerce.date().optional(),
  ownerId: z.string().optional(),
});
export const projectUpdateSchema = projectSchema.partial().extend({
  status: z
    .enum(["PLANNING", "IN_PROGRESS", "ON_HOLD", "COMPLETED", "CANCELLED"])
    .optional(),
});

export const taskSchema = z.object({
  projectId: z.string(),
  title: z.string().min(2),
  description: z.string().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
  assigneeId: z.string().optional(),
  dueDate: z.coerce.date().optional(),
});
export const taskUpdateSchema = taskSchema.partial().extend({
  status: z.enum(["TODO", "IN_PROGRESS", "REVIEW", "DONE"]).optional(),
});

export const invoiceSchema = z.object({
  clientId: z.string(),
  projectId: z.string().optional(),
  items: z.array(itemSchema).min(1),
  tax: z.number().nonnegative().optional(),
  dueDate: z.coerce.date().optional(),
});

export const paymentSchema = z.object({
  invoiceId: z.string(),
  amount: z.number().positive(),
  method: z.enum(["BANK_TRANSFER", "MPESA", "EMOLA", "CARD", "CASH", "OTHER"]),
  reference: z.string().optional(),
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
  projectId: z.string().optional(),
});

export const campaignSchema = z.object({
  name: z.string().min(2),
  channel: z.string().min(2),
  budget: z.number().nonnegative().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
});
export const campaignUpdateSchema = campaignSchema.partial().extend({
  status: z.enum(["PLANNED", "ACTIVE", "PAUSED", "COMPLETED"]).optional(),
  metrics: z.record(z.any()).optional(),
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
