import { NextRequest } from "next/server";
import { ok, withErrorHandling } from "@/lib/api-response";
import { requireAdmin } from "@/lib/permissions";
import { parsePagination, paginated } from "@/lib/pagination";
import { auditLogService } from "@/lib/services/simple-services";

export const GET = withErrorHandling(async (req: NextRequest) => {
  await requireAdmin();
  const { page, pageSize, skip, take } = parsePagination(req.url);
  const searchParams = new URL(req.url).searchParams;
  const [items, total] = await auditLogService.list({
    skip,
    take,
    entityType: searchParams.get("entityType") ?? undefined,
    entityId: searchParams.get("entityId") ?? undefined,
  });
  return ok(paginated(items, total, page, pageSize));
});
