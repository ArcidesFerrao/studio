import { NextRequest } from "next/server";
import { z } from "zod";
import { ok, withErrorHandling } from "@/app/lib/api-response";
import { requireStaff } from "@/app/lib/permissions";
import { proposalService } from "@/app/lib/services/proposal.service";

const respondSchema = z.object({ accepted: z.boolean() });

// Nota: hoje esta ação é registada pela equipa (ex.: cliente respondeu por
// email/WhatsApp). Numa fase seguinte pode virar um link público com token
// assinado, para o próprio cliente aceitar/rejeitar sem login.
export const POST = withErrorHandling(async (req: NextRequest, { params }: { params: { id: string } }) => {
  await requireStaff();
  const { accepted } = respondSchema.parse(await req.json());
  const result = await proposalService.respond(params.id, accepted);
  return ok(result);
});
