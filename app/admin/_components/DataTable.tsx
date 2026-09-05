"use client";

import { type ReactNode } from "react";
import { Button } from "./ui";

export interface Column<T> {
  key: string;
  label: string;
  render: (row: T) => ReactNode;
  mono?: boolean;
}

export function DataTable<T extends { id: string }>({
  columns,
  rows,
  loading,
  emptyLabel = "Nada por aqui ainda.",
  page,
  totalPages,
  onPageChange,
  actions,
}: {
  columns: Column<T>[];
  rows: T[];
  loading?: boolean;
  emptyLabel?: string;
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  actions?: (row: T) => ReactNode;
}) {
  return (
    <div className="ws-card-block">
      <div className="ws-table-wrap">
        <table className="ws-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key}>{col.label}</th>
              ))}
              {actions && <th style={{ textAlign: "right" }}>Ações</th>}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0)} className="ws-table-empty">
                  A carregar...
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0)} className="ws-table-empty">
                  {emptyLabel}
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id}>
                  {columns.map((col) => (
                    <td key={col.key} className={col.mono ? "ws-table-mono" : ""}>
                      {col.render(row)}
                    </td>
                  ))}
                  {actions && <td style={{ textAlign: "right" }}>{actions(row)}</td>}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {onPageChange && totalPages !== undefined && totalPages > 1 && (
        <div className="ws-flex-between" style={{ padding: "0.8rem 1rem", borderTop: "1px solid var(--ws-border)" }}>
          <span style={{ fontSize: "0.78rem", color: "var(--ws-muted)" }}>
            Página {page} de {totalPages}
          </span>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <Button variant="ghost" size="sm" disabled={page === 1} onClick={() => onPageChange((page ?? 1) - 1)}>
              Anterior
            </Button>
            <Button
              variant="ghost"
              size="sm"
              disabled={page === totalPages}
              onClick={() => onPageChange((page ?? 1) + 1)}
            >
              Seguinte
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
