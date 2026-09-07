import { NextRequest } from "next/server";
import { created, ok, withErrorHandling } from "@/app/lib/api-response";
import { requireStaffOrApiKey } from "@/app/lib/permissions";
import { parsePagination, paginated } from "@/app/lib/pagination";
import {
  developmentEventSchema,
  developmentEventService,
} from "@/app/lib/services/development-event.service";

/**
 * Endpoint único de ingestão de DevelopmentEvent — todas as fontes (Git,
 * IDE, Terminal, CI/CD, Planner, Manual) passam por aqui. Nunca escrever
 * diretamente em DevelopmentLog/FocusSession a partir de outro lugar; a
 * distribuição para essas tabelas acontece dentro do service, a partir
 * deste ponto de entrada único (ver INTELLIGENCE_DEVELOPMENT_INFRASTRUCTURE
 * v3, secção DevelopmentEvent).
 *
 * Autenticação dupla: API key (fontes automatizadas — GitHub, CI/CD) ou
 * sessão de staff (fontes manuais a partir da própria UI/CLI).
 */
export const POST = withErrorHandling(async (req: NextRequest) => {
  const actor = await requireStaffOrApiKey(req);
  const body = developmentEventSchema.parse(await req.json());
  const result = await developmentEventService.ingest(body, actor);
  return created(result);
});

export const GET = withErrorHandling(async (req: NextRequest) => {
  await requireStaffOrApiKey(req);
  const { page, pageSize, skip, take } = parsePagination(req.url);
  const { items, total } = await developmentEventService.list({ skip, take });
  return ok(paginated(items, total, page, pageSize));
});
