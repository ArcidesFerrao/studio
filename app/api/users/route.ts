import { NextRequest } from "next/server";
import { ok, created, withErrorHandling } from "@/lib/api-response";
import { requireAdmin } from "@/lib/permissions";
import { parsePagination, paginated } from "@/lib/pagination";
import { userService } from "@/lib/services/simple-services";
import { userSchema } from "@/lib/validators";

export const GET = withErrorHandling(async (req: NextRequest) => {
  await requireAdmin();
  const { page, pageSize, skip, take } = parsePagination(req.url);
  const [items, total] = await userService.list({ skip, take });
  return ok(paginated(items, total, page, pageSize));
});

export const POST = withErrorHandling(async (req: NextRequest) => {
  await requireAdmin();
  const body = userSchema.parse(await req.json());
  const user = await userService.create(body);
  return created(user);
});
