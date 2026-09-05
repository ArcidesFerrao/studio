import { prisma } from "@/app/lib/db";
import { publishEvent } from "@/app/lib/events/publisher";
import { AppError } from "@/app/lib/api-response";
import type { z } from "zod";
import type { taskSchema, taskUpdateSchema } from "@/app/lib/validators";

type TaskInput = z.infer<typeof taskSchema>;
type TaskUpdateInput = z.infer<typeof taskUpdateSchema>;

export const taskService = {
  list(params: { skip: number; take: number; projectId?: string; assigneeId?: string; status?: string }) {
    const where = {
      ...(params.projectId ? { projectId: params.projectId } : {}),
      ...(params.assigneeId ? { assigneeId: params.assigneeId } : {}),
      ...(params.status ? { status: params.status as any } : {}),
    };
    return Promise.all([
      prisma.task.findMany({
        where,
        orderBy: [{ priority: "desc" }, { createdAt: "asc" }],
        skip: params.skip,
        take: params.take,
        include: { assignee: { select: { id: true, name: true } } },
      }),
      prisma.task.count({ where }),
    ]);
  },

  get(id: string) {
    return prisma.task.findUnique({
      where: { id },
      include: { project: { select: { id: true, name: true, clientId: true } }, assignee: true },
    });
  },

  async create(input: TaskInput) {
    const project = await prisma.project.findUnique({ where: { id: input.projectId } });
    if (!project) throw new AppError("Projeto não encontrado.", 404);

    return prisma.$transaction(async (tx) => {
      const task = await tx.task.create({ data: input });

      if (task.assigneeId) {
        await tx.notification.create({
          data: {
            userId: task.assigneeId,
            type: "INFO",
            title: "Nova tarefa atribuída",
            message: `Foste atribuído à tarefa "${task.title}".`,
            link: `/projects/${task.projectId}/tasks/${task.id}`,
          },
        });
      }

      await publishEvent(
        "task.created",
        {
          entityType: "Task",
          entityId: task.id,
          description: `Tarefa "${task.title}" criada no projeto "${project.name}".`,
          clientId: project.clientId,
        },
        tx
      );
      return task;
    });
  },

  async update(id: string, input: TaskUpdateInput) {
    const existing = await prisma.task.findUnique({ where: { id }, include: { project: true } });
    if (!existing) throw new AppError("Tarefa não encontrada.", 404);

    return prisma.$transaction(async (tx) => {
      const completing = existing.status !== "DONE" && input.status === "DONE";
      const updated = await tx.task.update({
        where: { id },
        data: {
          ...input,
          completedAt: completing ? new Date() : existing.completedAt,
        },
      });
      if (completing) {
        await publishEvent(
          "task.completed",
          {
            entityType: "Task",
            entityId: id,
            description: `Tarefa "${updated.title}" concluída.`,
            clientId: existing.project.clientId,
          },
          tx
        );
      }
      return updated;
    });
  },
};
