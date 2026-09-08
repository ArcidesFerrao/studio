import type { Prisma } from "@prisma/client";

/**
 * Focus Inference Engine — cruza sinais de múltiplas fontes (Git, IDE,
 * Terminal, Planner) para inferir períodos de foco (FocusSession) e
 * interrupções, em vez de depender só de commits (que sozinhos sub-
 * -representam tempo de leitura/planeamento).
 *
 * Heurística v1 (documentada para poder ser ajustada depois):
 * - Um evento "sinal de foco" (ver FOCUS_SIGNAL_TYPES) estende a sessão
 *   aberta do utilizador se o intervalo desde a última atividade for
 *   <= FOCUS_GAP_MS.
 * - Se o intervalo for maior, a sessão antiga é fechada, uma Interruption
 *   inferida (CONTEXT_SWITCH) cobre o buraco, e uma sessão nova começa.
 * - Um evento explícito INTERRUPTION trunca a sessão atual na hora exata
 *   e abre uma interrupção "em aberto" (endedAt null) até o próximo sinal
 *   de foco chegar, que a fecha antes de abrir uma sessão nova.
 * - `activityScore` é, por agora, uma contagem simples de eventos que
 *   alimentaram a sessão — não uma métrica de qualidade/intensidade.
 */

const FOCUS_GAP_MS = 20 * 60 * 1000; // 20 minutos

type EventType =
  | "COMMIT"
  | "BRANCH_CREATED"
  | "BRANCH_SWITCHED"
  | "PR_CREATED"
  | "PR_MERGED"
  | "DEPLOYMENT"
  | "BUILD_STARTED"
  | "BUILD_FAILED"
  | "BUILD_SUCCEEDED"
  | "TASK_STARTED"
  | "TASK_COMPLETED"
  | "BLOCKER_RAISED"
  | "BLOCKER_RESOLVED"
  | "INTERRUPTION"
  | "DECISION_LOGGED"
  | "FOCUS_ACTIVITY"
  | "MANUAL_ACTIVITY";

// Eventos que contam como "estou a trabalhar agora". Deploy/blocker/decision
// ficam de fora — são marcos/resultados, não evidência de foco contínuo.
const FOCUS_SIGNAL_TYPES = new Set<EventType>([
  "COMMIT",
  "BRANCH_CREATED",
  "BRANCH_SWITCHED",
  "PR_CREATED",
  "PR_MERGED",
  "BUILD_STARTED",
  "BUILD_SUCCEEDED",
  "BUILD_FAILED",
  "TASK_STARTED",
  "TASK_COMPLETED",
  "MANUAL_ACTIVITY",
  "FOCUS_ACTIVITY",
]);

const INTERRUPTION_SOURCES = [
  "NOTIFICATION",
  "MEETING",
  "CONTEXT_SWITCH",
  "MANUAL",
  "UNKNOWN",
] as const;
type InterruptionSourceValue = (typeof INTERRUPTION_SOURCES)[number];

function mapInterruptionSource(raw: unknown): InterruptionSourceValue {
  if (typeof raw === "string") {
    const upper = raw.toUpperCase();
    if ((INTERRUPTION_SOURCES as readonly string[]).includes(upper)) {
      return upper as InterruptionSourceValue;
    }
  }
  return "UNKNOWN";
}

export interface FocusInferenceInput {
  userId: string;
  eventId: string;
  eventType: EventType;
  timestamp: Date;
  projectId?: string | null;
  taskId?: string | null;
  metadata?: Record<string, unknown> | null;
}

/**
 * Fecha a interrupção em aberto (se existir) associada à última sessão do
 * utilizador, marcando o fim dela no momento em que um novo sinal de foco
 * chega.
 */
async function closeOpenInterruption(
  tx: Prisma.TransactionClient,
  focusSessionId: string,
  endedAt: Date
) {
  const open = await tx.interruption.findFirst({
    where: { focusSessionId, endedAt: null },
    orderBy: { startedAt: "desc" },
  });
  if (open) {
    await tx.interruption.update({
      where: { id: open.id },
      data: { endedAt },
    });
  }
}

async function startNewSession(
  tx: Prisma.TransactionClient,
  input: FocusInferenceInput
) {
  return tx.focusSession.create({
    data: {
      userId: input.userId,
      projectId: input.projectId,
      taskId: input.taskId,
      startedAt: input.timestamp,
      endedAt: input.timestamp,
      durationSecs: 0,
      activityScore: 1,
      confidence: 1.0,
      sourceEvents: [input.eventId],
      inferred: true,
    },
  });
}

/**
 * Trata um evento explícito de INTERRUPTION (ex: IDE detectou idle, Planner
 * detectou início de reunião). Não retorna uma FocusSession — só fecha/
 * -trunca a atual, se estiver dentro da janela de foco.
 */
async function handleExplicitInterruption(
  tx: Prisma.TransactionClient,
  input: FocusInferenceInput
) {
  const lastSession = await tx.focusSession.findFirst({
    where: { userId: input.userId },
    orderBy: { endedAt: "desc" },
  });

  if (!lastSession || !lastSession.endedAt) return { focusSession: null, interruption: null };

  const gapMs = input.timestamp.getTime() - lastSession.endedAt.getTime();
  const stillOpen = gapMs >= 0 && gapMs <= FOCUS_GAP_MS;
  if (!stillOpen) return { focusSession: null, interruption: null };

  // trunca a sessão atual no momento exato em que a interrupção começou
  await tx.focusSession.update({
    where: { id: lastSession.id },
    data: {
      endedAt: input.timestamp,
      durationSecs: Math.max(
        0,
        Math.round((input.timestamp.getTime() - lastSession.startedAt.getTime()) / 1000)
      ),
    },
  });

  const interruption = await tx.interruption.create({
    data: {
      focusSessionId: lastSession.id,
      source: mapInterruptionSource(input.metadata?.interruptionSource),
      reason: typeof input.metadata?.reason === "string" ? input.metadata.reason : null,
      startedAt: input.timestamp,
      endedAt: null, // fica em aberto até o próximo sinal de foco
    },
  });

  return { focusSession: null, interruption };
}

export async function inferFocus(
  tx: Prisma.TransactionClient,
  input: FocusInferenceInput
) {
  if (input.eventType === "INTERRUPTION") {
    return handleExplicitInterruption(tx, input);
  }

  if (!FOCUS_SIGNAL_TYPES.has(input.eventType)) {
    return { focusSession: null, interruption: null };
  }

  const lastSession = await tx.focusSession.findFirst({
    where: { userId: input.userId },
    orderBy: { endedAt: "desc" },
  });

  const gapMs = lastSession?.endedAt
    ? input.timestamp.getTime() - lastSession.endedAt.getTime()
    : Infinity;

  // Sessão ainda "quente" -> estender
  if (lastSession && gapMs >= 0 && gapMs <= FOCUS_GAP_MS) {
    // se havia uma interrupção em aberto (evento explícito anterior), fecha-a
    await closeOpenInterruption(tx, lastSession.id, input.timestamp);

    const durationSecs = Math.round(
      (input.timestamp.getTime() - lastSession.startedAt.getTime()) / 1000
    );
    const focusSession = await tx.focusSession.update({
      where: { id: lastSession.id },
      data: {
        endedAt: input.timestamp,
        durationSecs,
        activityScore: (lastSession.activityScore ?? 0) + 1,
        sourceEvents: { push: input.eventId },
        projectId: lastSession.projectId ?? input.projectId,
        taskId: lastSession.taskId ?? input.taskId,
      },
    });
    return { focusSession, interruption: null };
  }

  // Gap grande demais (ou primeira sessão do utilizador) -> fecha a antiga
  // com uma interrupção inferida e abre uma sessão nova.
  let interruption = null;
  if (lastSession?.endedAt && gapMs > FOCUS_GAP_MS) {
    interruption = await tx.interruption.create({
      data: {
        focusSessionId: lastSession.id,
        source: "CONTEXT_SWITCH",
        reason: `Sem atividade por ${Math.round(gapMs / 60000)} min`,
        startedAt: lastSession.endedAt,
        endedAt: input.timestamp,
      },
    });
  }

  const focusSession = await startNewSession(tx, input);
  return { focusSession, interruption };
}
