import { NextRequest } from "next/server";
import { ok, created, withErrorHandling } from "@/lib/api-response";
import { requireStaff } from "@/lib/permissions";
import { parsePagination, paginated } from "@/lib/pagination";
import { paymentService } from "@/lib/services/payment.service";
import { paymentSchema } from "@/lib/validators";

export const GET = withErrorHandling(async (req: NextRequest) => {
  await requireStaff();
  const { page, pageSize, skip, take } = parsePagination(req.url);
  const searchParams = new URL(req.url).searchParams;
  const [items, total] = await paymentService.list({
    skip,
    take,
    invoiceId: searchParams.get("invoiceId") ?? undefined,
    status: searchParams.get("status") ?? undefined,
  });
  return ok(paginated(items, total, page, pageSize));
});

export const POST = withErrorHandling(async (req: NextRequest) => {
  await requireStaff();
  const body = paymentSchema.parse(await req.json());
  const result = await paymentService.record(body);
  return created(result);
});
