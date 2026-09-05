import { NextRequest } from "next/server";
import { ok, created, withErrorHandling } from "@/app/lib/api-response";
import { requireStaff } from "@/app/lib/permissions";
import { parsePagination, paginated } from "@/app/lib/pagination";
import { leadService } from "@/app/lib/services/lead.service";
import { leadSchema } from "@/app/lib/validators";

export const GET = withErrorHandling(async (req: NextRequest) => {
  await requireStaff();
  const { page, pageSize, skip, take } = parsePagination(req.url);
  const status = new URL(req.url).searchParams.get("status") ?? undefined;
  const [items, total] = await leadService.list({ skip, take, status });
  return ok(paginated(items, total, page, pageSize));
});

/**
 * Rota PÚBLICA — usada pelo formulário de contacto/orçamento da landing page
 * do Webstudio. Não exige autenticação.
 */
export const POST = withErrorHandling(async (req: NextRequest) => {
  const body = leadSchema.parse(await req.json());
  const lead = await leadService.createFromPublicForm(body);
  return created({ id: lead.id, message: "Recebemos o seu pedido. Entraremos em contacto em breve." });
});
