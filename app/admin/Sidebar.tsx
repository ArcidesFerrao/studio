"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ReactNode } from "react";

interface NavItem {
  href: string;
  label: string;
}
interface NavGroup {
  label: string;
  items: NavItem[];
}

const GROUPS: NavGroup[] = [
  {
    label: "Pipeline",
    items: [
      { href: "/admin/leads", label: "Leads" },
      { href: "/admin/proposals", label: "Propostas" },
      { href: "/admin/contracts", label: "Contratos" },
      { href: "/admin/clients", label: "Clientes" },
    ],
  },
  {
    label: "Entrega",
    items: [
      { href: "/admin/projects", label: "Projetos" },
      { href: "/admin/tasks", label: "Tarefas" },
    ],
  },
  {
    label: "Financeiro",
    items: [
      { href: "/admin/invoices", label: "Faturas" },
      { href: "/admin/payments", label: "Pagamentos" },
      { href: "/admin/expenses", label: "Despesas" },
    ],
  },
  {
    label: "Crescimento",
    items: [
      { href: "/admin/campaigns", label: "Marketing" },
      { href: "/admin/services", label: "Catálogo de serviços" },
    ],
  },
  {
    label: "Sistema",
    items: [
      { href: "/admin/activities", label: "Atividade" },
      { href: "/admin/notifications", label: "Notificações" },
      { href: "/admin/users", label: "Utilizadores" },
    ],
  },
];

export function Sidebar({ footer }: { footer?: ReactNode }) {
  const pathname = usePathname();

  return (
    <aside className="ws-sidebar">
      <div className="ws-sidebar-brand">
        <span className="ws-sidebar-brand-mark" />
        <div>
          <div className="ws-sidebar-brand-text">Webstudio</div>
          <div className="ws-sidebar-brand-sub">Painel interno</div>
        </div>
      </div>

      <nav className="ws-sidebar-scroll">
        <div className="ws-sidebar-group">
          <div className="ws-sidebar-group-label">Visão geral</div>
          <Link href="/admin" className={`ws-sidebar-link ${pathname === "/admin" ? "active" : ""}`}>
            Dashboard
          </Link>
        </div>

        {GROUPS.map((group) => (
          <div key={group.label} className="ws-sidebar-group">
            <div className="ws-sidebar-group-label">{group.label}</div>
            {group.items.map((item) => {
              const active = pathname === item.href || pathname?.startsWith(item.href + "/");
              return (
                <Link key={item.href} href={item.href} className={`ws-sidebar-link ${active ? "active" : ""}`}>
                  {item.label}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {footer && <div className="ws-sidebar-foot">{footer}</div>}
    </aside>
  );
}
