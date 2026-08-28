import { NextRequest } from "next/server";
import { ok, withErrorHandling } from "@/lib/api-response";
import { requireStaff } from "@/lib/permissions";
import { expenseService } from "@/lib/services/simple-services";
import { expenseSchema } from "@/lib/validators";

export const GET = withErrorHandling(async (_req: NextRequest, { params }: { params: { id: string } }) => {
  await requireStaff();
  const expense = await expenseService.get(params.id);
  return ok(expense);
});

export const PATCH = withErrorHandling(async (req: NextRequest, { params }: { params: { id: string } }) => {
  await requireStaff();
  const body = expenseSchema.partial().parse(await req.json());
  const expense = await expenseService.update(params.id, body);
  return ok(expense);
});

export const DELETE = withErrorHandling(async (_req: NextRequest, { params }: { params: { id: string } }) => {
  await requireStaff();
  await expenseService.remove(params.id);
  return ok({ deleted: true });
});
