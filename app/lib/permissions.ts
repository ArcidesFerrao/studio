import { getServerSession } from "next-auth";
import { authOptions, type SessionUser } from "@/app/lib/auth";
import { AppError } from "@/app/lib/api-response";
import { verifyApiKey } from "@/app/lib/api-key-auth";
import type { NextRequest } from "next/server";

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

export type EventActor =
  | { kind: "user"; userId: string }
  | { kind: "api_key"; userId: string; apiKeyId: string };

/**
 * Para rotas que tanto a UI (sessão de staff) quanto fontes automatizadas
 * (GitHub, CI/CD — via API key) podem chamar. Ex: ingestão de
 * DevelopmentEvent. Tenta API key primeiro (é o caso mais comum para essas
 * rotas); se não houver, cai para sessão de staff.
 */
export async function requireStaffOrApiKey(
  req: NextRequest
): Promise<EventActor> {
  const key = await verifyApiKey(req);
  if (key) return { kind: "api_key", userId: key.userId, apiKeyId: key.id };

  const user = await requireStaff();
  return { kind: "user", userId: user.id };
}
