import { NextRequest } from "next/server";
import { ok, withErrorHandling } from "@/lib/api-response";
import { requireStaff } from "@/lib/permissions";
import { clientService } from "@/lib/services/simple-services";
import { clientUpdateSchema } from "@/lib/validators";

export const GET = withErrorHandling(async (_req: NextRequest, { params }: { params: { id: string } }) => {
  await requireStaff();
  const client = await clientService.get(params.id);
  return ok(client);
});

export const PATCH = withErrorHandling(async (req: NextRequest, { params }: { params: { id: string } }) => {
  await requireStaff();
  const body = clientUpdateSchema.parse(await req.json());
  const client = await clientService.update(params.id, body);
  return ok(client);
});

export const DELETE = withErrorHandling(async (_req: NextRequest, { params }: { params: { id: string } }) => {
  await requireStaff();
  await clientService.remove(params.id);
  return ok({ deleted: true });
});
