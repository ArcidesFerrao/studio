import { NextRequest } from "next/server";
import { ok, withErrorHandling } from "@/app/lib/api-response";
import { requireStaff } from "@/app/lib/permissions";
import { proposalService } from "@/app/lib/services/proposal.service";

export const POST = withErrorHandling(async (_req: NextRequest, { params }: { params: { id: string } }) => {
  await requireStaff();
  const proposal = await proposalService.send(params.id);
  return ok(proposal);
});
