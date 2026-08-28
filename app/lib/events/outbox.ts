import { prisma } from "@/lib/db";

/** Lê até `limit` eventos pendentes, mais antigos primeiro. */
export async function readPendingEvents(limit = 100) {
  return prisma.outbox.findMany({
    where: { status: "PENDING" },
    orderBy: { createdAt: "asc" },
    take: limit,
  });
}

/** Marca uma lista de eventos como processados (chamado pelo consumidor externo, ex. Evolure Intelligence). */
export async function markEventsProcessed(ids: string[]) {
  return prisma.outbox.updateMany({
    where: { id: { in: ids } },
    data: { status: "PROCESSED", processedAt: new Date() },
  });
}

/** Marca um evento como falhado e incrementa a contagem de tentativas. */
export async function markEventFailed(id: string) {
  return prisma.outbox.update({
    where: { id },
    data: { status: "FAILED", attempts: { increment: 1 } },
  });
}
