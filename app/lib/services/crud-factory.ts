import { publishEvent } from "@/app/lib/events/publisher";
import { AppError } from "@/app/lib/api-response";
import type { WebstudioEventType } from "@/app/lib/events/types";

type Delegate = {
  findMany: (args: any) => Promise<any[]>;
  count: (args: any) => Promise<number>;
  findUnique: (args: any) => Promise<any>;
  create: (args: any) => Promise<any>;
  update: (args: any) => Promise<any>;
  delete: (args: any) => Promise<any>;
};

interface CrudFactoryOptions {
  entityType: string;
  onCreateEvent?: WebstudioEventType;
  describe?: (record: any) => string;
  include?: Record<string, unknown>;
  orderBy?: Record<string, "asc" | "desc">;
}

/**
 * Gera operações CRUD padronizadas (list/get/create/update/delete) para um
 * model do Prisma. Usado pelos recursos que não têm regras de negócio
 * específicas além de "gravar e opcionalmente emitir um evento".
 * Recursos com fluxo próprio (Lead, Proposal, Invoice...) têm serviço dedicado.
 */
export function createCrudService(delegate: Delegate, options: CrudFactoryOptions) {
  return {
    async list(params: { skip: number; take: number; where?: Record<string, unknown> }) {
      const where = params.where ?? {};
      const [items, total] = await Promise.all([
        delegate.findMany({
          where,
          orderBy: options.orderBy ?? { createdAt: "desc" },
          skip: params.skip,
          take: params.take,
          include: options.include,
        }),
        delegate.count({ where }),
      ]);
      return { items, total };
    },

    async get(id: string) {
      const record = await delegate.findUnique({ where: { id }, include: options.include });
      if (!record) throw new AppError(`${options.entityType} não encontrado.`, 404);
      return record;
    },

    async create(data: Record<string, unknown>) {
      const created = await delegate.create({ data });
      if (options.onCreateEvent) {
        await publishEvent(options.onCreateEvent, {
          entityType: options.entityType,
          entityId: created.id,
          description: options.describe?.(created) ?? `${options.entityType} criado.`,
        });
      }
      return created;
    },

    async update(id: string, data: Record<string, unknown>) {
      await this.get(id);
      return delegate.update({ where: { id }, data });
    },

    async remove(id: string) {
      await this.get(id);
      return delegate.delete({ where: { id } });
    },
  };
}
