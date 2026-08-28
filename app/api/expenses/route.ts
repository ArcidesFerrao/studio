import { NextRequest } from "next/server";
import { ok, created, withErrorHandling } from "@/lib/api-response";
import { requireStaff } from "@/lib/permissions";
import { parsePagination, paginated } from "@/lib/pagination";
import { expenseService } from "@/lib/services/simple-services";
import { expenseSchema } from "@/lib/validators";

export const GET = withErrorHandling(async (req: NextRequest) => {
  await requireStaff();
  const { page, pageSize, skip, take } = parsePagination(req.url);
  const searchParams = new URL(req.url).searchParams;
  const projectId = searchParams.get("projectId") ?? undefined;
  const { items, total } = await expenseService.list({
    skip,
    take,
    where: projectId ? { projectId } : undefined,
  });
  return ok(paginated(items, total, page, pageSize));
});

export const POST = withErrorHandling(async (req: NextRequest) => {
  const user = await requireStaff();
  const body = expenseSchema.parse(await req.json());
  const expense = await expenseService.create({ ...body, createdById: user.id });
  return created(expense);
});
