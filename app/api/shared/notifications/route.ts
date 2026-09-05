import { NextRequest } from "next/server";
import { ok, withErrorHandling } from "@/app/lib/api-response";
import { requireUser } from "@/app/lib/permissions";
import { parsePagination, paginated } from "@/app/lib/pagination";
import { notificationService } from "@/app/lib/services/simple-services";

export const GET = withErrorHandling(async (req: NextRequest) => {
  const user = await requireUser();
  const { page, pageSize, skip, take } = parsePagination(req.url);
  const unreadOnly = new URL(req.url).searchParams.get("unread") === "true";
  const [items, total] = await notificationService.listForUser(user.id, { skip, take, unreadOnly });
  return ok(paginated(items, total, page, pageSize));
});
