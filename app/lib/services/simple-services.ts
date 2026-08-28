import { prisma } from "@/lib/db";
import { publishEvent } from "@/lib/events/publisher";
import { AppError } from "@/lib/api-response";
import bcrypt from "bcryptjs";
import { createCrudService } from "./crud-factory";

export const clientService = createCrudService(prisma.client as any, {
  entityType: "Client",
  onCreateEvent: "client.created",
  describe: (c) => `Cliente "${c.name}" registado.`,
});

export const serviceCatalogService = createCrudService(prisma.service as any, {
  entityType: "Service",
});

export const expenseService = createCrudService(prisma.expense as any, {
  entityType: "Expense",
  onCreateEvent: "expense.created",
  describe: (e) => `Despesa "${e.description}" registada (${e.amount}).`,
  include: { project: { select: { id: true, name: true } } },
});

export const campaignService = createCrudService(prisma.campaign as any, {
  entityType: "Campaign",
  onCreateEvent: "campaign.created",
  describe: (c) => `Campanha "${c.name}" criada no canal ${c.channel}.`,
});

export const fileService = {
  list(params: { skip: number; take: number; entityType?: string; entityId?: string }) {
    const where = {
      ...(params.entityType ? { entityType: params.entityType } : {}),
      ...(params.entityId ? { entityId: params.entityId } : {}),
    };
    return Promise.all([
      prisma.fileAsset.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: params.skip,
        take: params.take,
      }),
      prisma.fileAsset.count({ where }),
    ]);
  },
  create(data: {
    filename: string;
    url: string;
    mimeType: string;
    size: number;
    entityType: string;
    entityId: string;
    uploadedById?: string;
  }) {
    return prisma.fileAsset.create({ data });
  },
  remove(id: string) {
    return prisma.fileAsset.delete({ where: { id } });
  },
};

export const notificationService = {
  listForUser(userId: string, params: { skip: number; take: number; unreadOnly?: boolean }) {
    const where = { userId, ...(params.unreadOnly ? { read: false } : {}) };
    return Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: params.skip,
        take: params.take,
      }),
      prisma.notification.count({ where }),
    ]);
  },
  async markRead(id: string, userId: string) {
    const notif = await prisma.notification.findUnique({ where: { id } });
    if (!notif) throw new AppError("Notificação não encontrada.", 404);
    if (notif.userId !== userId) throw new AppError("Sem permissão.", 403);
    return prisma.notification.update({ where: { id }, data: { read: true } });
  },
};

export const activityService = {
  list(params: { skip: number; take: number; entityType?: string; entityId?: string; clientId?: string }) {
    const where = {
      ...(params.entityType ? { entityType: params.entityType } : {}),
      ...(params.entityId ? { entityId: params.entityId } : {}),
      ...(params.clientId ? { clientId: params.clientId } : {}),
    };
    return Promise.all([
      prisma.activity.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: params.skip,
        take: params.take,
      }),
      prisma.activity.count({ where }),
    ]);
  },
};

export const auditLogService = {
  list(params: { skip: number; take: number; entityType?: string; entityId?: string }) {
    const where = {
      ...(params.entityType ? { entityType: params.entityType } : {}),
      ...(params.entityId ? { entityId: params.entityId } : {}),
    };
    return Promise.all([
      prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: params.skip,
        take: params.take,
        include: { actor: { select: { id: true, name: true } } },
      }),
      prisma.auditLog.count({ where }),
    ]);
  },
};

export const userService = {
  list(params: { skip: number; take: number }) {
    return Promise.all([
      prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        skip: params.skip,
        take: params.take,
        select: { id: true, name: true, email: true, role: true, active: true, createdAt: true },
      }),
      prisma.user.count(),
    ]);
  },
  async create(input: { name: string; email: string; password: string; role?: "ADMIN" | "STAFF" | "CLIENT" }) {
    const existing = await prisma.user.findUnique({ where: { email: input.email } });
    if (existing) throw new AppError("Já existe um utilizador com este email.", 409);
    const passwordHash = await bcrypt.hash(input.password, 12);
    return prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        passwordHash,
        role: input.role ?? "STAFF",
      },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });
  },
  update(id: string, data: { name?: string; role?: "ADMIN" | "STAFF" | "CLIENT"; active?: boolean }) {
    return prisma.user.update({ where: { id }, data });
  },
};

export const apiKeyService = {
  listForUser(userId: string) {
    return prisma.apiKey.findMany({
      where: { userId },
      select: {
        id: true,
        name: true,
        prefix: true,
        scopes: true,
        lastUsedAt: true,
        expiresAt: true,
        revoked: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
  },
  /** Gera uma nova chave; o valor em texto puro só é devolvido nesta chamada. */
  async create(userId: string, name: string, scopes: string[] = []) {
    const rawKey = `wsk_${crypto.randomUUID().replace(/-/g, "")}`;
    const prefix = rawKey.slice(0, 10);
    const keyHash = await bcrypt.hash(rawKey, 10);
    const apiKey = await prisma.apiKey.create({
      data: { name, prefix, keyHash, scopes, userId },
    });
    return { ...apiKey, rawKey };
  },
  async revoke(id: string, userId: string) {
    const key = await prisma.apiKey.findUnique({ where: { id } });
    if (!key) throw new AppError("Chave não encontrada.", 404);
    if (key.userId !== userId) throw new AppError("Sem permissão.", 403);
    return prisma.apiKey.update({ where: { id }, data: { revoked: true } });
  },
};
