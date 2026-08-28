import { NextRequest } from "next/server";
import { ok, withErrorHandling } from "@/lib/api-response";
import { requireStaff } from "@/lib/permissions";
import { leadService } from "@/lib/services/lead.service";

export const POST = withErrorHandling(async (_req: NextRequest, { params }: { params: { id: string } }) => {
  await requireStaff();
  const result = await leadService.convertToClient(params.id);
  return ok(result);
});
