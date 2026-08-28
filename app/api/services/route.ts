import { NextRequest } from "next/server";
import { ok, created, withErrorHandling } from "@/lib/api-response";
import { requireStaff } from "@/lib/permissions";
import { parsePagination, paginated } from "@/lib/pagination";
import { serviceCatalogService } from "@/lib/services/simple-services";
import { serviceSchema } from "@/lib/validators";

// GET é público: a landing page pode listar os serviços oferecidos.
export const GET = withErrorHandling(async (req: NextRequest) => {
  const { page, pageSize, skip, take } = parsePagination(req.url);
  const { items, total } = await serviceCatalogService.list({
    skip,
    take,
    where: { active: true },
  });
  return ok(paginated(items, total, page, pageSize));
});

export const POST = withErrorHandling(async (req: NextRequest) => {
  await requireStaff();
  const body = serviceSchema.parse(await req.json());
  const service = await serviceCatalogService.create(body);
  return created(service);
});
