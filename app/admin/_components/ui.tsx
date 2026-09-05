"use client";

import { type ReactNode, type SelectHTMLAttributes, type InputHTMLAttributes, type TextareaHTMLAttributes } from "react";

export function Button({
  children,
  variant = "primary",
  size = "md",
  ...rest
}: {
  children: ReactNode;
  variant?: "primary" | "ghost" | "danger";
  size?: "md" | "sm";
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const base = variant === "primary" ? "ws-btn" : variant === "ghost" ? "ws-btn-ghost" : "ws-btn-danger";
  const cls = `${base} ${size === "sm" ? "ws-btn-sm" : ""} ${rest.className ?? ""}`;
  return (
    <button {...rest} className={cls}>
      {children}
    </button>
  );
}

export function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="ws-field">
      <label htmlFor={htmlFor} className="ws-field-label">
        {label}
      </label>
      {children}
      {error && <span className="ws-field-error">{error}</span>}
    </div>
  );
}

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`ws-input ${props.className ?? ""}`} />;
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`ws-input ${props.className ?? ""}`} />;
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement> & { children: ReactNode }) {
  return <select {...props} className={`ws-input ${props.className ?? ""}`} />;
}

const PILL_MAP: Record<string, string> = {
  // genérico
  ACTIVE: "green",
  COMPLETED: "green",
  PAID: "green",
  WON: "green",
  ACCEPTED: "green",
  SIGNED: "green",
  DONE: "green",
  SENT: "amber",
  PROPOSAL_SENT: "amber",
  IN_PROGRESS: "amber",
  PENDING: "amber",
  PLANNED: "blue",
  DRAFT: "blue",
  NEW: "blue",
  TODO: "blue",
  CONTACTED: "blue",
  QUALIFIED: "purple",
  REVIEW: "purple",
  ON_HOLD: "purple",
  PAUSED: "purple",
  OVERDUE: "red",
  REJECTED: "red",
  CANCELLED: "red",
  LOST: "red",
  FAILED: "red",
  EXPIRED: "red",
  REFUNDED: "muted",
};

const LABEL_MAP: Record<string, string> = {
  NEW: "Novo",
  CONTACTED: "Contactado",
  QUALIFIED: "Qualificado",
  PROPOSAL_SENT: "Proposta enviada",
  WON: "Ganho",
  LOST: "Perdido",
  DRAFT: "Rascunho",
  SENT: "Enviada",
  ACCEPTED: "Aceite",
  REJECTED: "Rejeitada",
  EXPIRED: "Expirada",
  SIGNED: "Assinado",
  ACTIVE: "Ativo",
  COMPLETED: "Concluído",
  CANCELLED: "Cancelado",
  PLANNING: "Planeamento",
  IN_PROGRESS: "Em curso",
  ON_HOLD: "Em pausa",
  TODO: "A fazer",
  REVIEW: "Em revisão",
  DONE: "Feito",
  PAID: "Paga",
  OVERDUE: "Em atraso",
  PENDING: "Pendente",
  FAILED: "Falhou",
  REFUNDED: "Reembolsado",
  PLANNED: "Planeada",
  PAUSED: "Pausada",
  LOW: "Baixa",
  MEDIUM: "Média",
  HIGH: "Alta",
  URGENT: "Urgente",
  // categorias de despesa
  SOFTWARE: "Software",
  HOSTING: "Hosting",
  MARKETING: "Marketing",
  EQUIPMENT: "Equipamento",
  CONTRACTOR: "Prestador externo",
  TAXES: "Impostos",
  OTHER: "Outro",
  // métodos de pagamento
  BANK_TRANSFER: "Transferência",
  MPESA: "M-Pesa",
  EMOLA: "e-Mola",
  CARD: "Cartão",
  CASH: "Numerário",
};

export function StatusPill({ value }: { value: string }) {
  const color = PILL_MAP[value] ?? "muted";
  const label = LABEL_MAP[value] ?? value;
  return <span className={`ws-pill ws-pill-${color}`}>{label}</span>;
}

export function formatMoney(value: number | string) {
  const n = typeof value === "string" ? Number(value) : value;
  return new Intl.NumberFormat("pt-MZ", { style: "currency", currency: "MZN" }).format(n);
}

export function formatDate(value: string | Date | null | undefined) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("pt-PT", { day: "2-digit", month: "short", year: "numeric" }).format(
    new Date(value)
  );
}

export function formatDateTime(value: string | Date | null | undefined) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("pt-PT", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function timeAgo(value: string | Date) {
  const diffMs = Date.now() - new Date(value).getTime();
  const mins = Math.round(diffMs / 60000);
  if (mins < 1) return "agora";
  if (mins < 60) return `há ${mins} min`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `há ${hours}h`;
  const days = Math.round(hours / 24);
  return `há ${days}d`;
}
