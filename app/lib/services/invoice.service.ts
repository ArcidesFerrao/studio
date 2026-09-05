import { prisma } from "@/app/lib/db";
import { publishEvent } from "@/app/lib/events/publisher";
import { AppError } from "@/app/lib/api-response";
import type { z } from "zod";
import type { invoiceSchema } from "@/app/lib/validators";
import type { Prisma } from "@prisma/client";

type InvoiceInput = z.infer<typeof invoiceSchema>;

function calculateTotals(items: InvoiceInput["items"], tax = 0) {
  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  return { subtotal, tax, total: subtotal + tax };
}

async function nextInvoiceNumber() {
  const year = new Date().getFullYear();
  const count = await prisma.invoice.count({
    where: { number: { startsWith: `INV-${year}-` } },
  });
  return `INV-${year}-${String(count + 1).padStart(4, "0")}`;
}

export const invoiceService = {
  list(params: { skip: number; take: number; status?: string; clientId?: string }) {
    const where = {
      ...(params.status ? { status: params.status as any } : {}),
      ...(params.clientId ? { clientId: params.clientId } : {}),
    };
    return Promise.all([
      prisma.invoice.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: params.skip,
        take: params.take,
        include: { client: { select: { id: true, name: true } }, payments: true },
      }),
      prisma.invoice.count({ where }),
    ]);
  },

  get(id: string) {
    return prisma.invoice.findUnique({
      where: { id },
      include: { client: true, project: true, payments: true },
    });
  },

  async create(input: InvoiceInput) {
    const { subtotal, tax, total } = calculateTotals(input.items, input.tax ?? 0);
    const number = await nextInvoiceNumber();

    return prisma.$transaction(async (tx) => {
      const invoice = await tx.invoice.create({
        data: {
          number,
          clientId: input.clientId,
          projectId: input.projectId,
          items: input.items,
          subtotal,
          tax,
          total,
          status: "DRAFT",
          dueDate: input.dueDate,
        },
      });
      await publishEvent(
        "invoice.created",
        {
          entityType: "Invoice",
          entityId: invoice.id,
          description: `Fatura ${invoice.number} criada no valor de ${total}.`,
          clientId: invoice.clientId,
        },
        tx
      );
      return invoice;
    });
  },

  async markSent(id: string) {
    const invoice = await prisma.invoice.findUnique({ where: { id } });
    if (!invoice) throw new AppError("Fatura não encontrada.", 404);
    return prisma.invoice.update({ where: { id }, data: { status: "SENT" } });
  },

  /** Recalcula o estado da fatura com base no total já pago. Chamado pelo payment.service. */
  async recalculateStatus(id: string, tx: Prisma.TransactionClient = prisma) {
    const invoice = await tx.invoice.findUniqueOrThrow({
      where: { id },
      include: { payments: { where: { status: "COMPLETED" } } },
    });
    const paidAmount = invoice.payments.reduce((sum, p) => sum + Number(p.amount), 0);

    if (paidAmount >= Number(invoice.total) && invoice.status !== "PAID") {
      const updated = await tx.invoice.update({
        where: { id },
        data: { status: "PAID", paidAt: new Date() },
      });
      await publishEvent(
        "invoice.paid",
        {
          entityType: "Invoice",
          entityId: id,
          description: `Fatura ${updated.number} paga na totalidade.`,
          clientId: updated.clientId,
        },
        tx as any
      );
      return updated;
    }
    return invoice;
  },
};