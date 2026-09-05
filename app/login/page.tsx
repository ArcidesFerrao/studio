import { Suspense } from "react";
import "../webstudio.css";
import { LoginForm } from "./LoginForm";

export const metadata = { title: "Entrar — Webstudio" };

export default function LoginPage() {
  return (
    <div
      className="ws"
      style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem" }}
    >
      <div className="ws-card-block" style={{ width: "100%", maxWidth: 380, padding: "2rem 1.75rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1.6rem" }}>
          <span
            style={{
              width: 9,
              height: 9,
              borderRadius: "50%",
              background: "var(--ws-green)",
              boxShadow: "0 0 0 4px var(--ws-green-glow)",
            }}
          />
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.05rem" }}>Webstudio</span>
        </div>
        <h1 className="ws-section-title" style={{ fontSize: "1.4rem", marginBottom: "0.3rem" }}>
          Painel interno
        </h1>
        <p style={{ color: "var(--ws-muted)", fontSize: "0.85rem", marginBottom: "1.6rem" }}>
          Acesso restrito à equipa Evolure.
        </p>
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
