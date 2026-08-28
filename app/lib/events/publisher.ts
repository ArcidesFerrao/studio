import { prisma } from "@/lib/db";
import type { Prisma } from "@prisma/client";
import type { WebstudioEventType } from "./types";

interface PublishOptions {
  entityType: string;
  entityId: string;
  description: string;
  userId?: string | null;
  clientId?: string | null;
  metadata?: Record<string, unknown>;
}

/**
 * Publica um evento de domínio.
 * - Grava em `outbox`: fila técnica que o futuro WebstudioConnector do
 *   Evolure Intelligence vai ler e marcar como PROCESSED (mesmo padrão do
 *   pipeline ingest -> promote -> analytics já usado para a Contela).
 * - Grava em `activities`: timeline legível para a equipa dentro do próprio
 *   Webstudio (feed de atividades no dashboard).
 *
 * Roda dentro de uma transação para nunca perder um evento por falha parcial.
 */
export async function publishEvent(
  type: WebstudioEventType,
  options: PublishOptions,
  tx: Prisma.TransactionClient | typeof prisma = prisma
) {
  const payload = {
    entityType: options.entityType,
    entityId: options.entityId,
    ...options.metadata,
  };

  await tx.outbox.create({
    data: {
      eventType: type,
      payload: payload as Prisma.InputJsonValue,
    },
  });

  await tx.activity.create({
    data: {
      type,
      description: options.description,
      entityType: options.entityType,
      entityId: options.entityId,
      userId: options.userId ?? null,
      clientId: options.clientId ?? null,
      metadata: (options.metadata ?? {}) as Prisma.InputJsonValue,
    },
  });
}
