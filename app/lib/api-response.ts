import { NextResponse, type NextRequest } from "next/server";
import { ZodError } from "zod";

export function ok<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function created<T>(data: T) {
  return ok(data, 201);
}

export function fail(message: string, status = 400, details?: unknown) {
  return NextResponse.json(
    { success: false, error: message, details },
    { status }
  );
}

export function notFound(entity = "Recurso") {
  return fail(`${entity} não encontrado.`, 404);
}

export function unauthorized(message = "Não autenticado.") {
  return fail(message, 401);
}

export function forbidden(message = "Sem permissão para esta ação.") {
  return fail(message, 403);
}

/** Envolve um handler de rota e converte erros conhecidos em respostas HTTP consistentes. */
export function withErrorHandling(
  handler: (req: NextRequest, ctx: any) => Promise<NextResponse>
) {
  return async (req: NextRequest, ctx: any) => {
    try {
      return await handler(req, ctx);
    } catch (err) {
      if (err instanceof ZodError) {
        return fail("Dados inválidos.", 422, err.flatten());
      }
      if (err instanceof AppError) {
        return fail(err.message, err.status, err.details);
      }
      console.error("[API_ERROR]", err);
      return fail("Erro interno do servidor.", 500);
    }
  };
}

export class AppError extends Error {
  status: number;
  details?: unknown;
  constructor(message: string, status = 400, details?: unknown) {
    super(message);
    this.status = status;
    this.details = details;
  }
}
