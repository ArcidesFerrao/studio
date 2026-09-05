import { NextRequest } from "next/server";
import { ok, withErrorHandling } from "@/app/lib/api-response";
import { requireStaff } from "@/app/lib/permissions";
import { apiKeyService } from "@/app/lib/services/simple-services";

export const DELETE = withErrorHandling(async (_req: NextRequest, { params }: { params: { id: string } }) => {
  const user = await requireStaff();
  const revoked = await apiKeyService.revoke(params.id, user.id);
  return ok(revoked);
});
