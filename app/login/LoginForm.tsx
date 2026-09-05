"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/admin";
  const forbidden = searchParams.get("error") === "forbidden";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const result = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (result?.error) {
      setError("Email ou palavra-passe incorretos.");
      return;
    }
    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
        <label htmlFor="email" className="ws-label" style={{ marginBottom: 0 }}>
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@evolurelabs.com"
          className="ws-input"
        />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
        <label htmlFor="password" className="ws-label" style={{ marginBottom: 0 }}>
          Palavra-passe
        </label>
        <input
          id="password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className="ws-input"
        />
      </div>

      {forbidden && (
        <p style={{ fontSize: "0.8rem", color: "var(--ws-amber)" }}>
          A tua conta não tem acesso ao painel interno.
        </p>
      )}
      {error && <p style={{ fontSize: "0.8rem", color: "var(--ws-red)" }}>{error}</p>}

      <button type="submit" disabled={loading} className="ws-btn" style={{ justifyContent: "center", width: "100%" }}>
        {loading ? "A entrar..." : "Entrar"}
      </button>
    </form>
  );
}
