import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { UsersClient } from "./UsersClient";

export default async function UsersPage() {
  const session = await getServerSession(authOptions);
  const isAdmin = session?.user.role === "ADMIN";

  if (!isAdmin) {
    return (
      <div className="ws-content">
        <div
          className="ws-card-block"
          style={{ padding: "2rem", textAlign: "center" }}
        >
          <p style={{ color: "var(--ws-muted)" }}>
            Só administradores podem gerir utilizadores.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="ws-content">
      <UsersClient />
    </div>
  );
}
