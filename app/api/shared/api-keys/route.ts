import { NextRequest } from "next/server";
import { z } from "zod";
import { ok, created, withErrorHandling } from "@/app/lib/api-response";
import { requireStaff } from "@/app/lib/permissions";
import { apiKeyService } from "@/app/lib/services/simple-services";

const createKeySchema = z.object({
  name: z.string().min(2),
  scopes: z.array(z.string()).optional(),
});

export const GET = withErrorHandling(async () => {
  const user = await requireStaff();
  const keys = await apiKeyService.listForUser(user.id);
  return ok(keys);
});

// A chave em texto puro (rawKey) só é devolvida nesta resposta — o
// utilizador deve guardá-la imediatamente, pois não fica mais acessível.
export const POST = withErrorHandling(async (req: NextRequest) => {
  const user = await requireStaff();
  const { name, scopes } = createKeySchema.parse(await req.json());
  const apiKey = await apiKeyService.create(user.id, name, scopes ?? []);
  return created(apiKey);
});
