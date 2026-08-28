import { NextRequest } from "next/server";
import { ok, withErrorHandling } from "@/lib/api-response";
import { requireUser } from "@/lib/permissions";
import { parsePagination, paginated } from "@/lib/pagination";
import { notificationService } from "@/lib/services/simple-services";

export const GET = withErrorHandling(async (req: NextRequest) => {
  const user = await requireUser();
  const { page, pageSize, skip, take } = parsePagination(req.url);
  const unreadOnly = new URL(req.url).searchParams.get("unread") === "true";
  const [items, total] = await notificationService.listForUser(user.id, { skip, take, unreadOnly });
  return ok(paginated(items, total, page, pageSize));
});
