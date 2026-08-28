import { NextRequest } from "next/server";
import { ok, created, withErrorHandling } from "@/lib/api-response";
import { requireStaff } from "@/lib/permissions";
import { parsePagination, paginated } from "@/lib/pagination";
import { invoiceService } from "@/lib/services/invoice.service";
import { invoiceSchema } from "@/lib/validators";

export const GET = withErrorHandling(async (req: NextRequest) => {
  await requireStaff();
  const { page, pageSize, skip, take } = parsePagination(req.url);
  const searchParams = new URL(req.url).searchParams;
  const [items, total] = await invoiceService.list({
    skip,
    take,
    status: searchParams.get("status") ?? undefined,
    clientId: searchParams.get("clientId") ?? undefined,
  });
  return ok(paginated(items, total, page, pageSize));
});

export const POST = withErrorHandling(async (req: NextRequest) => {
  await requireStaff();
  const body = invoiceSchema.parse(await req.json());
  const invoice = await invoiceService.create(body);
  return created(invoice);
});
