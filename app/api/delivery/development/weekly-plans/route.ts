import { NextRequest } from "next/server";
import { ok, created, withErrorHandling } from "@/app/lib/api-response";
import { requireStaff } from "@/app/lib/permissions";
import { parsePagination, paginated } from "@/app/lib/pagination";

// TODO (W2/W3): ligar ao servico real de "weekly-plans" quando a
// logica de negocio for implementada.

export const GET = withErrorHandling(async (req: NextRequest) => {
  await requireStaff();
  const { page, pageSize } = parsePagination(req.url);
  // const { skip, take } = parsePagination(req.url);
  // const { items, total } = await service.list({ skip, take });
  return ok(paginated([], 0, page, pageSize));
});

export const POST = withErrorHandling(async (req: NextRequest) => {
  await requireStaff();
  // const body = schema.parse(await req.json());
  // const record = await service.create(body);
  void req;
  return created({ todo: "implementar em W2/W3" });
});
