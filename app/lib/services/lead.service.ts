import { prisma } from "@/app/lib/db";
import { publishEvent } from "@/app/lib/events/publisher";
import { AppError } from "@/app/lib/api-response";
import type { z } from "zod";
import type { leadSchema, leadUpdateSchema } from "@/app/lib/validators";

type LeadInput = z.infer<typeof leadSchema>;
type LeadUpdateInput = z.infer<typeof leadUpdateSchema>;

export const leadService = {
  list(params: { skip: number; take: number; status?: string }) {
    return Promise.all([
      prisma.lead.findMany({
        where: params.status ? { status: params.status as any } : undefined,
        orderBy: { createdAt: "desc" },
        skip: params.skip,
        take: params.take,
        include: { owner: { select: { id: true, name: true } } },
      }),
      prisma.lead.count({
        where: params.status ? { status: params.status as any } : undefined,
      }),
    ]);
  },

  get(id: string) {
    return prisma.lead.findUnique({
      where: { id },
      include: { owner: true, client: true, proposals: true },
    });
  },

  /** Ponto de entrada público: formulário de contacto/orçamento do site institucional. */
  async createFromPublicForm(input: LeadInput) {
    const lead = await prisma.$transaction(async (tx) => {
      const created = await tx.lead.create({ data: { ...input } });
      await publishEvent(
        "lead.created",
        {
          entityType: "Lead",
          entityId: created.id,
          description: `Novo lead recebido: ${created.name} (${created.source ?? "origem desconhecida"})`,
          metadata: { source: created.source },
        },
        tx
      );
      return created;
    });
    return lead;
  },

  async update(id: string, input: LeadUpdateInput) {
    const existing = await prisma.lead.findUnique({ where: { id } });
    if (!existing) throw new AppError("Lead não encontrado.", 404);
    return prisma.lead.update({ where: { id }, data: input });
  },

  /** Converte um lead qualificado num Client, mantendo o vínculo histórico. */
  async convertToClient(leadId: string) {
    const lead = await prisma.lead.findUnique({ where: { id: leadId } });
    if (!lead) throw new AppError("Lead não encontrado.", 404);
    if (lead.clientId) throw new AppError("Este lead já foi convertido.", 409);

    return prisma.$transaction(async (tx) => {
      const client = await tx.client.upsert({
        where: { email: lead.email },
        update: {},
        create: {
          name: lead.name,
          email: lead.email,
          phone: lead.phone,
          company: lead.company,
        },
      });

      const updatedLead = await tx.lead.update({
        where: { id: leadId },
        data: { clientId: client.id, status: "WON" },
      });

      await publishEvent(
        "lead.converted",
        {
          entityType: "Client",
          entityId: client.id,
          description: `Lead ${lead.name} convertido em cliente.`,
          clientId: client.id,
        },
        tx
      );

      return { client, lead: updatedLead };
    });
  },

  delete(id: string) {
    return prisma.lead.delete({ where: { id } });
  },
};
