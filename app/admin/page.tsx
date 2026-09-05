"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/app/lib/admin-client";
import { formatMoney, timeAgo } from "./_components/ui";

interface DashboardData {
  funnel: {
    leads: number;
    proposals: number;
    contracts: number;
    projects: number;
  };
  invoicesOverdueCount: number;
  revenueThisMonth: number;
  recentActivities: { id: string; description: string; createdAt: string }[];
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    api
      .get<DashboardData>("/api/reporting/dashboard")
      .then(setData)
      .catch(() => {});
  }, []);

  return (
    <div>
      <div className="ws-topbar">
        <div>
          <div className="ws-topbar-title">Dashboard</div>
          <div className="ws-topbar-desc">
            Visão geral do pipeline comercial e operacional.
          </div>
        </div>
      </div>

      <div className="ws-content">
        {/* Funil — Lead → Proposta → Contrato → Projeto */}
        <div className="ws-funnel" style={{ marginBottom: "1.25rem" }}>
          <FunnelStage
            href="/admin/leads"
            label="Leads em aberto"
            value={data?.funnel.leads}
          />
          <FunnelStage
            href="/admin/proposals"
            label="Propostas enviadas"
            value={data?.funnel.proposals}
          />
          <FunnelStage
            href="/admin/contracts"
            label="Contratos ativos"
            value={data?.funnel.contracts}
          />
          <FunnelStage
            href="/admin/projects"
            label="Projetos em curso"
            value={data?.funnel.projects}
          />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1rem",
            marginBottom: "1.25rem",
          }}
        >
          <StatCard
            label="Receita este mês"
            value={data ? formatMoney(data.revenueThisMonth) : "—"}
          />
          <StatCard
            label="Faturas em atraso"
            value={data?.invoicesOverdueCount ?? "—"}
            accent={
              data && data.invoicesOverdueCount > 0
                ? "var(--ws-red)"
                : undefined
            }
            href="/admin/invoices"
          />
        </div>

        <div className="ws-card-block" style={{ padding: "1.25rem 1.4rem" }}>
          <div className="ws-flex-between" style={{ marginBottom: "0.5rem" }}>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "1rem",
              }}
            >
              Atividade recente
            </h2>
            <Link
              href="/admin/activities"
              className="ws-nav-link"
              style={{ fontSize: "0.78rem" }}
            >
              Ver tudo →
            </Link>
          </div>
          {!data ? (
            <p style={{ color: "var(--ws-muted)", fontSize: "0.85rem" }}>
              A carregar...
            </p>
          ) : data.recentActivities.length === 0 ? (
            <p style={{ color: "var(--ws-muted)", fontSize: "0.85rem" }}>
              Ainda sem atividade registada.
            </p>
          ) : (
            data.recentActivities.map((activity) => (
              <div key={activity.id} className="ws-feed-item">
                <span className="ws-feed-dot" />
                <div>
                  <div className="ws-feed-text">{activity.description}</div>
                  <div className="ws-feed-time">
                    {timeAgo(activity.createdAt)}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function FunnelStage({
  href,
  label,
  value,
}: {
  href: string;
  label: string;
  value?: number;
}) {
  return (
    <Link
      href={href}
      className="ws-funnel-stage"
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <div className="ws-funnel-num">{value ?? "–"}</div>
      <div className="ws-funnel-lbl">{label}</div>
    </Link>
  );
}

function StatCard({
  label,
  value,
  accent,
  href,
}: {
  label: string;
  value: string | number;
  accent?: string;
  href?: string;
}) {
  const content = (
    <div className="ws-stat-card">
      <div
        className="ws-stat-val"
        style={accent ? { color: accent } : undefined}
      >
        {value}
      </div>
      <div className="ws-stat-lbl">{label}</div>
    </div>
  );
  return href ? (
    <Link href={href} style={{ textDecoration: "none", color: "inherit" }}>
      {content}
    </Link>
  ) : (
    content
  );
}
