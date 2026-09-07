import { z } from "zod";
import { prisma, withTransaction } from "@/app/lib/db";
import { publishEvent } from "@/app/lib/events/publisher";
import type { Prisma } from "@prisma/client";
import type { EventActor } from "@/app/lib/permissions";

/**
 * Mantidos em sincronia manual com os enums DevelopmentEventSource /
 * DevelopmentEventType do prisma/schema.prisma. Se adicionares um valor lá,
 * adiciona aqui também.
 */
const SOURCES = [
  "GIT",
  "GITHUB",
  "IDE",
  "TERMINAL",
  "WEBSTUDIO_PLANNER",
  "CI_CD",
  "DEPLOYMENT",
  "MANUAL",
] as const;

const EVENT_TYPES = [
  "COMMIT",
  "BRANCH_CREATED",
  "BRANCH_SWITCHED",
  "PR_CREATED",
  "PR_MERGED",
  "DEPLOYMENT",
  "BUILD_STARTED",
  "BUILD_FAILED",
  "BUILD_SUCCEEDED",
  "TASK_STARTED",
  "TASK_COMPLETED",
  "BLOCKER_RAISED",
  "BLOCKER_RESOLVED",
  "INTERRUPTION",
  "DECISION_LOGGED",
  "FOCUS_ACTIVITY",
  "MANUAL_ACTIVITY",
] as const;

export const developmentEventSchema = z.object({
  source: z.enum(SOURCES),
  eventType: z.enum(EVENT_TYPES),
  projectId: z.string().optional(),
  taskId: z.string().optional(),
  externalId: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
  timestamp: z.coerce.date().optional(),
});

export type DevelopmentEventInput = z.infer<typeof developmentEventSchema>;

// Tipos de evento que representam evidência de atividade de desenvolvimento
// -> geram um DevelopmentLog. DECISION_LOGGED fica de fora (tem endpoint e
// tabela próprios, development-decisions); INTERRUPTION e FOCUS_ACTIVITY
// ficam de fora (entram no Focus Inference Engine, fase seguinte do W3).
const LOG_EVENT_TYPES = new Set<(typeof EVENT_TYPES)[number]>([
  "COMMIT",
  "BRANCH_CREATED",
  "BRANCH_SWITCHED",
  "PR_CREATED",
  "PR_MERGED",
  "DEPLOYMENT",
  "BUILD_STARTED",
  "BUILD_FAILED",
  "BUILD_SUCCEEDED",
  "TASK_STARTED",
  "TASK_COMPLETED",
  "BLOCKER_RAISED",
  "BLOCKER_RESOLVED",
  "MANUAL_ACTIVITY",
]);

// Subconjunto "digno de nota" para efeitos do feed humano (activities) — o
// resto só entra no outbox (sinal cru para o Labs), sem poluir o dashboard.
const NOTEWORTHY_EVENT_TYPES = new Set<(typeof EVENT_TYPES)[number]>([
  "PR_MERGED",
  "DEPLOYMENT",
  "TASK_COMPLETED",
  "BLOCKER_RAISED",
  "BLOCKER_RESOLVED",
  "BUILD_FAILED",
]);

const EVENT_LABELS: Record<(typeof EVENT_TYPES)[number], string> = {
  COMMIT: "Commit registado",
  BRANCH_CREATED: "Branch criado",
  BRANCH_SWITCHED: "Branch alterado",
  PR_CREATED: "Pull Request criado",
  PR_MERGED: "Pull Request integrado",
  DEPLOYMENT: "Deploy realizado",
  BUILD_STARTED: "Build iniciado",
  BUILD_FAILED: "Build falhou",
  BUILD_SUCCEEDED: "Build concluído com sucesso",
  TASK_STARTED: "Tarefa iniciada",
  TASK_COMPLETED: "Tarefa concluída",
  BLOCKER_RAISED: "Bloqueio reportado",
  BLOCKER_RESOLVED: "Bloqueio resolvido",
  INTERRUPTION: "Interrupção registada",
  DECISION_LOGGED: "Decisão técnica registada",
  FOCUS_ACTIVITY: "Atividade de foco",
  MANUAL_ACTIVITY: "Atividade registada manualmente",
};

function confidenceFor(
  source: (typeof SOURCES)[number],
  eventType: (typeof EVENT_TYPES)[number]
): number {
  if (source === "MANUAL") return 0.6;
  if (eventType === "MANUAL_ACTIVITY") return 0.6;
  return 1.0;
}

export const developmentEventService = {
  async ingest(input: DevelopmentEventInput, actor: EventActor) {
    return withTransaction(async (tx) => {
      const event = await tx.developmentEvent.create({
        data: {
          source: input.source,
          eventType: input.eventType,
          userId: actor.userId,
          projectId: input.projectId,
          taskId: input.taskId,
          externalId: input.externalId,
          metadata: input.metadata as Prisma.InputJsonValue | undefined,
          timestamp: input.timestamp ?? new Date(),
        },
      });

      let log = null;
      if (LOG_EVENT_TYPES.has(input.eventType)) {
        log = await tx.developmentLog.create({
          data: {
            userId: actor.userId,
            projectId: input.projectId,
            taskId: input.taskId,
            sourceEventId: event.id,
            activityType: input.eventType,
            description: EVENT_LABELS[input.eventType],
            confidence: confidenceFor(input.source, input.eventType),
            timestamp: event.timestamp,
            metadata: input.metadata as Prisma.InputJsonValue | undefined,
          },
        });
      }

      await publishEvent(
        "development_event.created",
        {
          entityType: "DevelopmentEvent",
          entityId: event.id,
          description: EVENT_LABELS[input.eventType],
          userId: actor.userId,
          metadata: {
            source: input.source,
            eventType: input.eventType,
            projectId: input.projectId,
            taskId: input.taskId,
          },
          skipActivity: !NOTEWORTHY_EVENT_TYPES.has(input.eventType),
        },
        tx
      );

      return { event, log };
    });
  },

  async list(params: { skip: number; take: number }) {
    const [items, total] = await Promise.all([
      prisma.developmentEvent.findMany({
        skip: params.skip,
        take: params.take,
        orderBy: { timestamp: "desc" },
      }),
      prisma.developmentEvent.count(),
    ]);
    return { items, total };
  },
};
