import { NextRequest } from "next/server";
import { ok, withErrorHandling } from "@/lib/api-response";
import { requireStaff } from "@/lib/permissions";
import { prisma } from "@/lib/db";
import { leadService } from "@/lib/services/lead.service";
import { leadUpdateSchema } from "@/lib/validators";

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
