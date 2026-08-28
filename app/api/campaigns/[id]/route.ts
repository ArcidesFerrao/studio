import { NextRequest } from "next/server";
import { ok, withErrorHandling } from "@/lib/api-response";
import { requireStaff } from "@/lib/permissions";
import { campaignService } from "@/lib/services/simple-services";
import { campaignUpdateSchema } from "@/lib/validators";

export const GET = withErrorHandling(async (_req: NextRequest, { params }: { params: { id: string } }) => {
  await requireStaff();
  const campaign = await campaignService.get(params.id);
  return ok(campaign);
});

export const PATCH = withErrorHandling(async (req: NextRequest, { params }: { params: { id: string } }) => {
  await requireStaff();
  const body = campaignUpdateSchema.parse(await req.json());
  const campaign = await campaignService.update(params.id, body);
  return ok(campaign);
});

export const DELETE = withErrorHandling(async (_req: NextRequest, { params }: { params: { id: string } }) => {
  await requireStaff();
  await campaignService.remove(params.id);
  return ok({ deleted: true });
});
