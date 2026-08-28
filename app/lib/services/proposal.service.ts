import { prisma } from "@/lib/db";
import { publishEvent } from "@/lib/events/publisher";
import { AppError } from "@/lib/api-response";
import type { z } from "zod";
import type { proposalSchema } from "@/lib/validators";

type ProposalInput = z.infer<typeof proposalSchema>;

function calculateTotal(items: ProposalInput["items"]) {
  return items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
}

export const proposalService = {
  list(params: { skip: number; take: number; status?: string; clientId?: string }) {
    const where = {
      ...(params.status ? { status: params.status as any } : {}),
      ...(params.clientId ? { clientId: params.clientId } : {}),
    };
    return Promise.all([
      prisma.proposal.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: params.skip,
        take: params.take,
        include: { client: { select: { id: true, name: true } } },
      }),
      prisma.proposal.count({ where }),
    ]);
  },

  get(id: string) {
    return prisma.proposal.findUnique({
      where: { id },
      include: { client: true, lead: true, contract: true, createdBy: true },
    });
  },

  async create(input: ProposalInput, createdById: string) {
    const totalAmount = calculateTotal(input.items);
    return prisma.$transaction(async (tx) => {
      const proposal = await tx.proposal.create({
        data: {
          clientId: input.clientId,
          leadId: input.leadId,
          title: input.title,
          description: input.description,
          items: input.items,
          totalAmount,
          validUntil: input.validUntil,
          createdById,
        },
      });
      await publishEvent(
        "proposal.created",
        {
          entityType: "Proposal",
          entityId: proposal.id,
          description: `Proposta "${proposal.title}" criada.`,
          clientId: proposal.clientId,
          userId: createdById,
        },
        tx
      );
      return proposal;
    });
  },

  async send(id: string) {
    const proposal = await prisma.proposal.findUnique({ where: { id } });
    if (!proposal) throw new AppError("Proposta não encontrada.", 404);
    if (proposal.status !== "DRAFT") {
      throw new AppError("Só é possível enviar propostas em rascunho.", 409);
    }

    return prisma.$transaction(async (tx) => {
      const updated = await tx.proposal.update({
        where: { id },
        data: { status: "SENT", sentAt: new Date() },
      });
      if (proposal.leadId) {
        await tx.lead.update({
          where: { id: proposal.leadId },
          data: { status: "PROPOSAL_SENT" },
        });
      }
      await publishEvent(
        "proposal.sent",
        {
          entityType: "Proposal",
          entityId: id,
          description: `Proposta "${proposal.title}" enviada ao cliente.`,
          clientId: proposal.clientId,
        },
        tx
      );
      return updated;
    });
  },

  async respond(id: string, accepted: boolean) {
    const proposal = await prisma.proposal.findUnique({ where: { id } });
    if (!proposal) throw new AppError("Proposta não encontrada.", 404);
    if (proposal.status !== "SENT") {
      throw new AppError("Só é possível responder a propostas enviadas.", 409);
    }

    return prisma.$transaction(async (tx) => {
      const updated = await tx.proposal.update({
        where: { id },
        data: {
          status: accepted ? "ACCEPTED" : "REJECTED",
          respondedAt: new Date(),
        },
      });

      let contract = null;
      if (accepted) {
        contract = await tx.contract.create({
          data: {
            clientId: proposal.clientId,
            proposalId: proposal.id,
            title: proposal.title,
            value: proposal.totalAmount,
            status: "DRAFT",
          },
        });
        await publishEvent(
          "contract.created",
          {
            entityType: "Contract",
            entityId: contract.id,
            description: `Contrato gerado automaticamente a partir da proposta "${proposal.title}".`,
            clientId: proposal.clientId,
          },
          tx
        );
      }

      await publishEvent(
        accepted ? "proposal.accepted" : "proposal.rejected",
        {
          entityType: "Proposal",
          entityId: id,
          description: `Proposta "${proposal.title}" ${accepted ? "aceite" : "rejeitada"} pelo cliente.`,
          clientId: proposal.clientId,
        },
        tx
      );

      return { proposal: updated, contract };
    });
  },
};
