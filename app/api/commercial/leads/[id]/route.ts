import { NextRequest } from "next/server";
import { ok, withErrorHandling } from "@/app/lib/api-response";
import { requireStaff } from "@/app/lib/permissions";
import { prisma } from "@/app/lib/db";
import { leadService } from "@/app/lib/services/lead.service";
import { leadUpdateSchema } from "@/app/lib/validators";

export const GET = withErrorHandling(async (_req: NextRequest, { params }: { params: { id: string } }) => {
  await requireStaff();
  const lead = await leadService.get(params.id);
  return ok(lead);
});

export const PATCH = withErrorHandling(async (req: NextRequest, { params }: { params: { id: string } }) => {
  await requireStaff();
  const body = leadUpdateSchema.parse(await req.json());
  const lead = await leadService.update(params.id, body);
  return ok(lead);
});

export const DELETE = withErrorHandling(async (_req: NextRequest, { params }: { params: { id: string } }) => {
  await requireStaff();
  await prisma.lead.delete({ where: { id: params.id } });
  return ok({ deleted: true });
});
