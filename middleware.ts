import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Rotas que não exigem sessão de utilizador:
// - /api/auth/*                 -> NextAuth (login)
// - /api/integration/*          -> autentica por API key própria (verifyApiKey), não sessão
// - POST /api/commercial/leads  -> formulário público de contacto/orçamento do site
// - GET  /api/commercial/services -> catálogo de serviços exibido na landing page
const PUBLIC_PREFIXES = ["/api/auth", "/api/integration"];

function isPublicRoute(pathname: string, method: string) {
  if (PUBLIC_PREFIXES.some((p) => pathname.startsWith(p))) return true;
  if (pathname === "/api/commercial/leads" && method === "POST") return true;
  if (pathname === "/api/commercial/services" && method === "GET") return true;
  if (/^\/api\/commercial\/services\/[^/]+$/.test(pathname) && method === "GET") return true;
  return false;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (!pathname.startsWith("/api")) return NextResponse.next();
  if (isPublicRoute(pathname, req.method)) return NextResponse.next();

  // Verificação leve de presença de sessão aqui; o papel exato
  // (ADMIN/STAFF/CLIENT) continua a ser validado dentro de cada rota via
  // requireStaff/requireAdmin, que têm contexto do recurso.
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    return NextResponse.json(
      { success: false, error: "Não autenticado." },
      { status: 401 }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"],
};