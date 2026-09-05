"use client";

import { Button, StatusPill, timeAgo } from "../_components/ui";
import { usePaginatedList } from "../_components/usePaginatedList";
import { api } from "@/app/lib/admin-client";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  link: string | null;
  createdAt: string;
}

export default function NotificationsPage() {
  const { items, loading, reload } =
    usePaginatedList<Notification>("/api/shared/notifications");

  async function markRead(id: string) {
    try {
      await api.post(`/api/notifications/${id}/read`);
      reload();
    } catch {
      // silencioso
    }
  }

  return (
    <div className="ws-content">
      <div style={{ marginBottom: "1rem" }}>
        <h1 className="ws-topbar-title">Notificações</h1>
        <p className="ws-topbar-desc">
          As tuas notificações — atribuições de tarefas e alertas do sistema.
        </p>
      </div>

      <div className="ws-card-block">
        {loading ? (
          <p style={{ padding: "1.5rem", color: "var(--ws-muted)" }}>
            A carregar...
          </p>
        ) : items.length === 0 ? (
          <p style={{ padding: "1.5rem", color: "var(--ws-muted)" }}>
            Sem notificações.
          </p>
        ) : (
          items.map((n) => (
            <div
              key={n.id}
              className="ws-flex-between"
              style={{
                padding: "0.9rem 1.2rem",
                borderBottom: "1px solid var(--ws-border)",
              }}
            >
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <strong style={{ fontSize: "0.88rem" }}>{n.title}</strong>
                  {!n.read && <StatusPill value="NEW" />}
                </div>
                <div
                  style={{
                    fontSize: "0.82rem",
                    color: "var(--ws-muted)",
                    marginTop: "0.15rem",
                  }}
                >
                  {n.message}
                </div>
                <div
                  style={{
                    fontSize: "0.7rem",
                    color: "var(--ws-dim)",
                    marginTop: "0.25rem",
                  }}
                >
                  {timeAgo(n.createdAt)}
                </div>
              </div>
              {!n.read && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => markRead(n.id)}
                >
                  Marcar lida
                </Button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
