import { NextRequest } from "next/server";
import { ok, notFound, withErrorHandling } from "@/lib/api-response";
import { requireStaff } from "@/lib/permissions";
import { invoiceService } from "@/lib/services/invoice.service";

export const GET = withErrorHandling(async (_req: NextRequest, { params }: { params: { id: string } }) => {
  await requireStaff();
  const invoice = await invoiceService.get(params.id);
  if (!invoice) return notFound("Fatura");
  return ok(invoice);
});
