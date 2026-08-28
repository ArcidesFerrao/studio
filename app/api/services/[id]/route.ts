import { NextRequest } from "next/server";
import { ok, withErrorHandling } from "@/lib/api-response";
import { requireStaff } from "@/lib/permissions";
import { serviceCatalogService } from "@/lib/services/simple-services";
import { serviceUpdateSchema } from "@/lib/validators";

export const GET = withErrorHandling(async (_req: NextRequest, { params }: { params: { id: string } }) => {
  const service = await serviceCatalogService.get(params.id);
  return ok(service);
});

export const PATCH = withErrorHandling(async (req: NextRequest, { params }: { params: { id: string } }) => {
  await requireStaff();
  const body = serviceUpdateSchema.parse(await req.json());
  const service = await serviceCatalogService.update(params.id, body);
  return ok(service);
});

export const DELETE = withErrorHandling(async (_req: NextRequest, { params }: { params: { id: string } }) => {
  await requireStaff();
  await serviceCatalogService.remove(params.id);
  return ok({ deleted: true });
});
