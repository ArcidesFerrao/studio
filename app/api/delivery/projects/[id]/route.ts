import { NextRequest } from "next/server";
import { ok, withErrorHandling } from "@/app/lib/api-response";
import { requireStaff } from "@/app/lib/permissions";
import { projectService } from "@/app/lib/services/project.service";
import { projectUpdateSchema } from "@/app/lib/validators";

export const GET = withErrorHandling(async (_req: NextRequest, { params }: { params: { id: string } }) => {
  await requireStaff();
  const project = await projectService.get(params.id);
  return ok(project);
});

export const PATCH = withErrorHandling(async (req: NextRequest, { params }: { params: { id: string } }) => {
  await requireStaff();
  const body = projectUpdateSchema.parse(await req.json());
  const project = await projectService.update(params.id, body);
  return ok(project);
});
