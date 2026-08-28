import { NextRequest } from "next/server";
import { ok, withErrorHandling } from "@/lib/api-response";
import { requireStaff } from "@/lib/permissions";
import { taskService } from "@/lib/services/task.service";
import { taskUpdateSchema } from "@/lib/validators";

export const GET = withErrorHandling(async (_req: NextRequest, { params }: { params: { id: string } }) => {
  await requireStaff();
  const task = await taskService.get(params.id);
  return ok(task);
});

export const PATCH = withErrorHandling(async (req: NextRequest, { params }: { params: { id: string } }) => {
  await requireStaff();
  const body = taskUpdateSchema.parse(await req.json());
  const task = await taskService.update(params.id, body);
  return ok(task);
});
