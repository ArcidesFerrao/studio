import { NextRequest } from "next/server";
import { ok, withErrorHandling } from "@/lib/api-response";
import { requireUser } from "@/lib/permissions";
import { notificationService } from "@/lib/services/simple-services";

export const POST = withErrorHandling(async (_req: NextRequest, { params }: { params: { id: string } }) => {
  const user = await requireUser();
  const notification = await notificationService.markRead(params.id, user.id);
  return ok(notification);
});
