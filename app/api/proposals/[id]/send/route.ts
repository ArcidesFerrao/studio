import { NextRequest } from "next/server";
import { ok, withErrorHandling } from "@/lib/api-response";
import { requireStaff } from "@/lib/permissions";
import { proposalService } from "@/lib/services/proposal.service";

export const POST = withErrorHandling(async (_req: NextRequest, { params }: { params: { id: string } }) => {
  await requireStaff();
  const proposal = await proposalService.send(params.id);
  return ok(proposal);
});
