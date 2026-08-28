import { NextRequest } from "next/server";
import { ok, withErrorHandling } from "@/lib/api-response";
import { requireStaff } from "@/lib/permissions";
import { parsePagination, paginated } from "@/lib/pagination";
import { activityService } from "@/lib/services/simple-services";

export const GET = withErrorHandling(async (req: NextRequest) => {
  await requireStaff();
  const { page, pageSize, skip, take } = parsePagination(req.url);
  const searchParams = new URL(req.url).searchParams;
  const [items, total] = await activityService.list({
    skip,
    take,
    entityType: searchParams.get("entityType") ?? undefined,
    entityId: searchParams.get("entityId") ?? undefined,
    clientId: searchParams.get("clientId") ?? undefined,
  });
  return ok(paginated(items, total, page, pageSize));
});
