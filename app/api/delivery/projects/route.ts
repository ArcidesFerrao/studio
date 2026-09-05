import { NextRequest } from "next/server";
import { ok, created, withErrorHandling } from "@/app/lib/api-response";
import { requireStaff } from "@/app/lib/permissions";
import { parsePagination, paginated } from "@/app/lib/pagination";
import { projectService } from "@/app/lib/services/project.service";
import { projectSchema } from "@/app/lib/validators";

export const GET = withErrorHandling(async (req: NextRequest) => {
  await requireStaff();
  const { page, pageSize, skip, take } = parsePagination(req.url);
  const searchParams = new URL(req.url).searchParams;
  const [items, total] = await projectService.list({
    skip,
    take,
    status: searchParams.get("status") ?? undefined,
    clientId: searchParams.get("clientId") ?? undefined,
  });
  return ok(paginated(items, total, page, pageSize));
});

export const POST = withErrorHandling(async (req: NextRequest) => {
  await requireStaff();
  const body = projectSchema.parse(await req.json());
  const project = await projectService.create(body);
  return created(project);
});
