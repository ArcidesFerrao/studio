import { NextRequest } from "next/server";
import { ok, withErrorHandling } from "@/lib/api-response";
import { requireStaff } from "@/lib/permissions";
import { invoiceService } from "@/lib/services/invoice.service";

export const POST = withErrorHandling(async (_req: NextRequest, { params }: { params: { id: string } }) => {
  await requireStaff();
  const invoice = await invoiceService.markSent(params.id);
  return ok(invoice);
});
