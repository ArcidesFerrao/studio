import { NextRequest } from "next/server";
import { ok, withErrorHandling } from "@/app/lib/api-response";
import { requireStaff } from "@/app/lib/permissions";
import { parsePagination, paginated } from "@/app/lib/pagination";
import { activityService } from "@/app/lib/services/simple-services";

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
