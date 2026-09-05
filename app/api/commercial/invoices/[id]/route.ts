import { NextRequest } from "next/server";
import { ok, notFound, withErrorHandling } from "@/app/lib/api-response";
import { requireStaff } from "@/app/lib/permissions";
import { invoiceService } from "@/app/lib/services/invoice.service";

export const GET = withErrorHandling(async (_req: NextRequest, { params }: { params: { id: string } }) => {
  await requireStaff();
  const invoice = await invoiceService.get(params.id);
  if (!invoice) return notFound("Fatura");
  return ok(invoice);
});
