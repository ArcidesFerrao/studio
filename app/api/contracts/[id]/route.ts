import { NextRequest } from "next/server";
import { ok, withErrorHandling } from "@/lib/api-response";
import { requireStaff } from "@/lib/permissions";
import { contractService } from "@/lib/services/contract.service";
import { contractUpdateSchema } from "@/lib/validators";

export const GET = withErrorHandling(async (_req: NextRequest, { params }: { params: { id: string } }) => {
  await requireStaff();
  const contract = await contractService.get(params.id);
  return ok(contract);
});

export const PATCH = withErrorHandling(async (req: NextRequest, { params }: { params: { id: string } }) => {
  await requireStaff();
  const body = contractUpdateSchema.parse(await req.json());
  const contract = await contractService.update(params.id, body);
  return ok(contract);
});
