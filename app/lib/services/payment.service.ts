import { prisma } from "@/lib/db";
import { publishEvent } from "@/lib/events/publisher";
import { AppError } from "@/lib/api-response";
import { invoiceService } from "./invoice.service";
import type { z } from "zod";
import type { paymentSchema } from "@/lib/validators";

type PaymentInput = z.infer<typeof paymentSchema>;

export const paymentService = {
  list(params: { skip: number; take: number; invoiceId?: string; status?: string }) {
    const where = {
      ...(params.invoiceId ? { invoiceId: params.invoiceId } : {}),
      ...(params.status ? { status: params.status as any } : {}),
    };
    return Promise.all([
      prisma.payment.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: params.skip,
        take: params.take,
        include: { invoice: { select: { id: true, number: true, clientId: true } } },
      }),
      prisma.payment.count({ where }),
    ]);
  },

  /** Regista um pagamento já confirmado (ex.: conciliação manual ou webhook de um provedor). */
  async record(input: PaymentInput) {
    const invoice = await prisma.invoice.findUnique({ where: { id: input.invoiceId } });
    if (!invoice) throw new AppError("Fatura não encontrada.", 404);
    if (invoice.status === "PAID") {
      throw new AppError("Esta fatura já está totalmente paga.", 409);
    }

    return prisma.$transaction(async (tx) => {
      const payment = await tx.payment.create({
        data: {
          invoiceId: input.invoiceId,
          amount: input.amount,
          method: input.method,
          reference: input.reference,
          status: "COMPLETED",
          paidAt: new Date(),
        },
      });

      await publishEvent(
        "payment.created",
        {
          entityType: "Payment",
          entityId: payment.id,
          description: `Pagamento de ${input.amount} registado para a fatura ${invoice.number}.`,
          clientId: invoice.clientId,
        },
        tx
      );

      const updatedInvoice = await invoiceService.recalculateStatus(input.invoiceId, tx);

      return { payment, invoice: updatedInvoice };
    });
  },
};
