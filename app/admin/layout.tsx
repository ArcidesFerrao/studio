import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/lib/auth";
import { Sidebar } from "./Sidebar";
import Link from "next/link";
import "@/app/webstudio.css";
import "@/app/admin/admin.css";

export const metadata = {
  title: "Webstudio — Painel interno",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login?callbackUrl=/admin");
  }
  if (session.user.role !== "ADMIN" && session.user.role !== "STAFF") {
    redirect("/login?error=forbidden");
  }

  return (
    <div className="ws">
      <div className="ws-shell">
        <Sidebar
          footer={
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              <div style={{ fontSize: "0.8rem", color: "var(--ws-fg)" }}>
                {session.user.name}
              </div>
              <div style={{ fontSize: "0.68rem", color: "var(--ws-muted)" }}>
                {session.user.role === "ADMIN" ? "Administrador" : "Equipa"}
              </div>
              <Link
                href="/api/auth/signout"
                className="ws-btn-ghost ws-btn-sm"
                style={{ justifyContent: "center" }}
              >
                Sair
              </Link>
            </div>
          }
        />
        <main className="ws-main">{children}</main>
      </div>
    </div>
  );
}
