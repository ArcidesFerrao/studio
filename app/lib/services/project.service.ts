import { prisma } from "@/app/lib/db";
import { publishEvent } from "@/app/lib/events/publisher";
import { AppError } from "@/app/lib/api-response";
import type { z } from "zod";
import type { projectSchema, projectUpdateSchema } from "@/app/lib/validators";

type ProjectInput = z.infer<typeof projectSchema>;
type ProjectUpdateInput = z.infer<typeof projectUpdateSchema>;

export const projectService = {
  list(params: { skip: number; take: number; status?: string; clientId?: string }) {
    const where = {
      ...(params.status ? { status: params.status as any } : {}),
      ...(params.clientId ? { clientId: params.clientId } : {}),
    };
    return Promise.all([
      prisma.project.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: params.skip,
        take: params.take,
        include: {
          client: { select: { id: true, name: true } },
          owner: { select: { id: true, name: true } },
          _count: { select: { tasks: true } },
        },
      }),
      prisma.project.count({ where }),
    ]);
  },

  get(id: string) {
    return prisma.project.findUnique({
      where: { id },
      include: {
        client: true,
        contract: true,
        owner: true,
        tasks: { orderBy: { createdAt: "asc" } },
        invoices: true,
        expenses: true,
      },
    });
  },

  async create(input: ProjectInput) {
    return prisma.$transaction(async (tx) => {
      const project = await tx.project.create({ data: input });
      await publishEvent(
        "project.created",
        {
          entityType: "Project",
          entityId: project.id,
          description: `Projeto "${project.name}" criado.`,
          clientId: project.clientId,
        },
        tx
      );
      return project;
    });
  },

  async update(id: string, input: ProjectUpdateInput) {
    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing) throw new AppError("Projeto não encontrado.", 404);

    return prisma.$transaction(async (tx) => {
      const completing = existing.status !== "COMPLETED" && input.status === "COMPLETED";
      const updated = await tx.project.update({
        where: { id },
        data: {
          ...input,
          completedAt: completing ? new Date() : existing.completedAt,
        },
      });
      await publishEvent(
        completing ? "project.completed" : "project.updated",
        {
          entityType: "Project",
          entityId: id,
          description: completing
            ? `Projeto "${updated.name}" concluído.`
            : `Projeto "${updated.name}" atualizado.`,
          clientId: updated.clientId,
        },
        tx
      );
      return updated;
    });
  },
};
