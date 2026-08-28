import { NextRequest } from "next/server";
import { ok, withErrorHandling } from "@/lib/api-response";
import { requireStaff } from "@/lib/permissions";
import { apiKeyService } from "@/lib/services/simple-services";

export const DELETE = withErrorHandling(async (_req: NextRequest, { params }: { params: { id: string } }) => {
  const user = await requireStaff();
  const revoked = await apiKeyService.revoke(params.id, user.id);
  return ok(revoked);
});
