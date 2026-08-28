import { NextRequest } from "next/server";
import { ok, withErrorHandling } from "@/lib/api-response";
import { requireAdmin } from "@/lib/permissions";
import { userService } from "@/lib/services/simple-services";
import { userUpdateSchema } from "@/lib/validators";

export const PATCH = withErrorHandling(async (req: NextRequest, { params }: { params: { id: string } }) => {
  await requireAdmin();
  const body = userUpdateSchema.parse(await req.json());
  const user = await userService.update(params.id, body);
  return ok(user);
});
