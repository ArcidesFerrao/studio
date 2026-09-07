import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

const connectionString = process.env.DATABASE_URL || "";

if (!connectionString) {
  throw new Error("DATABASE_URL is not set in environment variables");
}

// Diagnóstico: confirma qual host/db está a ser usado, sem expor a password.
try {
  const u = new URL(connectionString);
  console.log(`[seed] a conectar em host=${u.hostname} db=${u.pathname}`);
} catch {
  console.log("[seed] DATABASE_URL presente mas não é uma URL válida");
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("[seed] main() iniciou");

  const email = process.env.SEED_ADMIN_EMAIL ?? "admin@evolurelabs.com";
  const password = process.env.SEED_ADMIN_PASSWORD ?? "admin";
  console.log(`[seed] email alvo: ${email}`);

  const existing = await prisma.user.findUnique({ where: { email } });
  console.log(`[seed] utilizador já existe? ${!!existing}`);
  if (existing) {
    console.log(`Utilizador admin já existe: ${email}`);
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const created = await prisma.user.create({
    data: {
      name: "Administrador",
      email,
      passwordHash,
      role: "ADMIN",
    },
  });
  console.log(`[seed] criado com id=${created.id}`);

  console.log(`Utilizador admin criado: ${email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });