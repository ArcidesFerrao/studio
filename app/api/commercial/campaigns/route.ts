import { NextRequest } from "next/server";
import { ok, created, withErrorHandling } from "@/app/lib/api-response";
import { requireStaff } from "@/app/lib/permissions";
import { parsePagination, paginated } from "@/app/lib/pagination";
import { campaignService } from "@/app/lib/services/simple-services";
import { campaignSchema } from "@/app/lib/validators";

export const GET = withErrorHandling(async (req: NextRequest) => {
  await requireStaff();
  const { page, pageSize, skip, take } = parsePagination(req.url);
  const { items, total } = await campaignService.list({ skip, take });
  return ok(paginated(items, total, page, pageSize));
});

export const POST = withErrorHandling(async (req: NextRequest) => {
  await requireStaff();
  const body = campaignSchema.parse(await req.json());
  const campaign = await campaignService.create(body);
  return created(campaign);
});
