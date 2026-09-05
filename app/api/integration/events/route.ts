import { NextRequest } from "next/server";
import { z } from "zod";
import { ok, unauthorized, withErrorHandling } from "@/app/lib/api-response";
import { readPendingEvents, markEventsProcessed } from "@/app/lib/events/outbox";
import { verifyApiKey } from "@/app/lib/api-key-auth";

/**
 * Rota consumida pelo WebstudioConnector do Evolure Intelligence, no mesmo
 * espírito do ContelaConnector: lê eventos pendentes do outbox e permite
 * confirmá-los como processados. Não usa sessão de utilizador — autentica
 * por API key (header Authorization: Bearer wsk_...).
 */
export const GET = withErrorHandling(async (req: NextRequest) => {
  const key = await verifyApiKey(req);
  if (!key) return unauthorized("API key inválida ou em falta.");

  const limit = Number(new URL(req.url).searchParams.get("limit") ?? 100);
  const events = await readPendingEvents(limit);
  return ok(events);
});

const ackSchema = z.object({ ids: z.array(z.string()).min(1) });

export const POST = withErrorHandling(async (req: NextRequest) => {
  const key = await verifyApiKey(req);
  if (!key) return unauthorized("API key inválida ou em falta.");

  const { ids } = ackSchema.parse(await req.json());
  const result = await markEventsProcessed(ids);
  return ok(result);
});
