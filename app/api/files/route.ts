import { NextRequest } from "next/server";
import { ok, created, fail, withErrorHandling } from "@/lib/api-response";
import { requireStaff } from "@/lib/permissions";
import { parsePagination, paginated } from "@/lib/pagination";
import { fileService } from "@/lib/services/simple-services";
import { saveFile } from "@/lib/storage";

export const GET = withErrorHandling(async (req: NextRequest) => {
  await requireStaff();
  const { page, pageSize, skip, take } = parsePagination(req.url);
  const searchParams = new URL(req.url).searchParams;
  const [items, total] = await fileService.list({
    skip,
    take,
    entityType: searchParams.get("entityType") ?? undefined,
    entityId: searchParams.get("entityId") ?? undefined,
  });
  return ok(paginated(items, total, page, pageSize));
});

// multipart/form-data: file, entityType, entityId
export const POST = withErrorHandling(async (req: NextRequest) => {
  const user = await requireStaff();
  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const entityType = formData.get("entityType") as string | null;
  const entityId = formData.get("entityId") as string | null;

  if (!file || !entityType || !entityId) {
    return fail("Campos obrigatórios: file, entityType, entityId.", 422);
  }

  const { url, size, mimeType } = await saveFile(file);
  const record = await fileService.create({
    filename: file.name,
    url,
    mimeType,
    size,
    entityType,
    entityId,
    uploadedById: user.id,
  });
  return created(record);
});
