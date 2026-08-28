import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL ?? "admin@evolurelabs.com";
  const password = process.env.SEED_ADMIN_PASSWORD ?? "muda-isso-depois";

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log(`Utilizador admin já existe: ${email}`);
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.user.create({
    data: {
      name: "Administrador",
      email,
      passwordHash,
      role: "ADMIN",
    },
  });

  console.log(`Utilizador admin criado: ${email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
