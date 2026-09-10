import { NextRequest } from "next/server";
import { created, ok, withErrorHandling } from "@/app/lib/api-response";
import { requireStaffOrApiKey } from "@/app/lib/permissions";
import { taskProposalSchema } from "@/app/lib/validators";
import { taskService } from "@/app/lib/services/task.service";
import { prisma } from "@/app/lib/db";

/**
 * W8 — recebe uma actions.task_proposals já ACCEPTED do lado do Labs
 * (actions/task_proposal_engine.py) e cria a Task real correspondente.
 * A Webstudio possui as Tasks; o Labs possui as Task Proposals — este é
 * o único ponto onde uma proposta vira trabalho de verdade.
 *
 * Sem projectId: uma proposta do Labs não está ligada a nenhum projeto de
 * cliente específico (ex: "contactar antigos clientes para reativar
 * propostas") — fica como tarefa solta, visível em /admin/tasks sem
 * projeto associado, até seres tu a decidir ligá-la a um projeto ou não.
 *
 * Idempotente por sourceProposalId (@unique no schema): se o Labs repetir
 * a chamada (retry de rede, por exemplo), devolve a task já criada em vez
 * de duplicar.
 */

const PRIORITY_MAP: Record<string, "LOW" | "MEDIUM" | "HIGH"> = {
  low: "LOW",
  medium: "MEDIUM",
  high: "HIGH",
};

export const POST = withErrorHandling(async (req: NextRequest) => {
  await requireStaffOrApiKey(req);
  const body = taskProposalSchema.parse(await req.json());

  const existing = await prisma.task.findUnique({
    where: { sourceProposalId: body.sourceProposalId },
  });
  if (existing) return ok(existing);

  const task = await taskService.create({
    title: body.title,
    description: body.description,
    priority: body.priority ? PRIORITY_MAP[body.priority] : undefined,
    source: "LABS_PROPOSAL",
    sourceProposalId: body.sourceProposalId,
  });

  return created(task);
});
