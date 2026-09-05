import { NextRequest } from "next/server";
import { ok, notFound, withErrorHandling } from "@/app/lib/api-response";
import { requireStaff } from "@/app/lib/permissions";
import { proposalService } from "@/app/lib/services/proposal.service";

export const GET = withErrorHandling(async (_req: NextRequest, { params }: { params: { id: string } }) => {
  await requireStaff();
  const proposal = await proposalService.get(params.id);
  if (!proposal) return notFound("Proposta");
  return ok(proposal);
});
