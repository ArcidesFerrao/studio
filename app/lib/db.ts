
import { PrismaClient, Prisma } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  prismaAuth: PrismaClient | undefined;
  pool: Pool | undefined;
}

const connectionString = process.env.DATABASE_URL || "";

if (!connectionString) {
  throw new Error("DATABASE_URL is not set in environment variables");
}

const pool = globalForPrisma.pool ?? new Pool({
  connectionString,
  max: 20,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 10_000,
});

const adapter = new PrismaPg(pool)

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  adapter,
  log: process.env.NODE_ENV !== "development" ? ["error", "warn"] : ["error"],
});

/**
 * Wrapper para prisma.$transaction com timeouts mais generosos que o
 * default do Prisma (maxWait 2s / timeout 5s), que se mostraram curtos
 * demais sob carga concorrente em dev (P2028 "Unable to start a
 * transaction in the given time"). Usar em vez de prisma.$transaction
 * diretamente em qualquer service que precise de transação interativa.
 */
export function withTransaction<T>(
  fn: (tx: Prisma.TransactionClient) => Promise<T>
) {
  return prisma.$transaction(fn, { maxWait: 10_000, timeout: 15_000 });
}

// export const dbAuth = globalForPrisma.prismaAuth ?? new PrismaClient({
//   log: process.env.NODE_ENV !== "development" ? ["error", "warn"] : ["error"],
// });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
  // globalForPrisma.prismaAuth = dbAuth;
  globalForPrisma.pool = pool;
}