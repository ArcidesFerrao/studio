import { getServerSession } from "next-auth";
import { authOptions, type SessionUser } from "@/lib/auth";
import { AppError } from "@/lib/api-response";

/**
 * Recupera o utilizador autenticado dentro de um Route Handler.
 * Lança AppError(401) se não houver sessão.
 */
export async function requireUser(): Promise<SessionUser> {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    throw new AppError("Não autenticado.", 401);
  }
  return session.user as SessionUser;
}

/**
 * Garante que o utilizador autenticado tem um dos papéis indicados.
 * Uso: const user = await requireRole(["ADMIN", "STAFF"]);
 */
export async function requireRole(
  roles: Array<SessionUser["role"]>
): Promise<SessionUser> {
  const user = await requireUser();
  if (!roles.includes(user.role)) {
    throw new AppError("Sem permissão para esta ação.", 403);
  }
  return user;
}

/** Atalho: apenas ADMIN. */
export const requireAdmin = () => requireRole(["ADMIN"]);

/** Atalho: equipa interna (ADMIN ou STAFF) — usado na maioria das rotas de gestão. */
export const requireStaff = () => requireRole(["ADMIN", "STAFF"]);
