import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import type { NextRequest } from "next/server";

/**
 * Valida o header `Authorization: Bearer wsk_...` contra as api_keys
 * gravadas (comparação por hash, nunca em texto puro). Usa o prefixo para
 * localizar candidatas rapidamente e só então confirma com bcrypt.compare.
 */
export async function verifyApiKey(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return null;

  const rawKey = auth.slice("Bearer ".length);
  const prefix = rawKey.slice(0, 10);

  const candidates = await prisma.apiKey.findMany({
    where: { prefix, revoked: false },
  });

  for (const candidate of candidates) {
    if (candidate.expiresAt && candidate.expiresAt < new Date()) continue;
    const matches = await bcrypt.compare(rawKey, candidate.keyHash);
    if (matches) {
      await prisma.apiKey.update({
        where: { id: candidate.id },
        data: { lastUsedAt: new Date() },
      });
      return candidate;
    }
  }
  return null;
}
