import { prisma } from "@/app/lib/db";
import { publishEvent } from "@/app/lib/events/publisher";
import { AppError } from "@/app/lib/api-response";
import type { z } from "zod";
import type { contractSchema, contractUpdateSchema } from "@/app/lib/validators";

type ContractInput = z.infer<typeof contractSchema>;
type ContractUpdateInput = z.infer<typeof contractUpdateSchema>;

export const contractService = {
  list(params: { skip: number; take: number; status?: string; clientId?: string }) {
    const where = {
      ...(params.status ? { status: params.status as any } : {}),
      ...(params.clientId ? { clientId: params.clientId } : {}),
    };
    return Promise.all([
      prisma.contract.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: params.skip,
        take: params.take,
        include: { client: { select: { id: true, name: true } } },
      }),
      prisma.contract.count({ where }),
    ]);
  },

  get(id: string) {
    return prisma.contract.findUnique({
      where: { id },
      include: { client: true, proposal: true, projects: true },
    });
  },

  async create(input: ContractInput) {
    const contract = await prisma.$transaction(async (tx) => {
      const created = await tx.contract.create({ data: input });
      await publishEvent(
        "contract.created",
        {
          entityType: "Contract",
          entityId: created.id,
          description: `Contrato "${created.title}" criado.`,
          clientId: created.clientId,
        },
        tx
      );
      return created;
    });
    return contract;
  },

  async update(id: string, input: ContractUpdateInput) {
    const existing = await prisma.contract.findUnique({ where: { id } });
    if (!existing) throw new AppError("Contrato não encontrado.", 404);

    return prisma.$transaction(async (tx) => {
      const wasSigned = existing.status !== "SIGNED" && input.status === "SIGNED";
      const updated = await tx.contract.update({
        where: { id },
        data: {
          ...input,
          signedAt: wasSigned ? new Date() : existing.signedAt,
        },
      });
      if (wasSigned) {
        await publishEvent(
          "contract.signed",
          {
            entityType: "Contract",
            entityId: id,
            description: `Contrato "${updated.title}" assinado.`,
            clientId: updated.clientId,
          },
          tx
        );
      }
      return updated;
    });
  },
};
