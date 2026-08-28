import { NextRequest } from "next/server";
import { ok, created, withErrorHandling } from "@/lib/api-response";
import { requireStaff } from "@/lib/permissions";
import { parsePagination, paginated } from "@/lib/pagination";
import { taskService } from "@/lib/services/task.service";
import { taskSchema } from "@/lib/validators";

export const GET = withErrorHandling(async (req: NextRequest) => {
  await requireStaff();
  const { page, pageSize, skip, take } = parsePagination(req.url);
  const searchParams = new URL(req.url).searchParams;
  const [items, total] = await taskService.list({
    skip,
    take,
    projectId: searchParams.get("projectId") ?? undefined,
    assigneeId: searchParams.get("assigneeId") ?? undefined,
    status: searchParams.get("status") ?? undefined,
  });
  return ok(paginated(items, total, page, pageSize));
});

export const POST = withErrorHandling(async (req: NextRequest) => {
  await requireStaff();
  const body = taskSchema.parse(await req.json());
  const task = await taskService.create(body);
  return created(task);
});
