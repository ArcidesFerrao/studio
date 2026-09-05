"use client";

import { DataTable, type Column } from "../_components/DataTable";
import { StatusPill, formatMoney, formatDateTime } from "../_components/ui";
import { usePaginatedList } from "../_components/usePaginatedList";

interface Payment {
  id: string;
  amount: string;
  method: string;
  status: string;
  paidAt: string | null;
  invoice: { number: string };
}

const columns: Column<Payment>[] = [
  { key: "invoice", label: "Fatura", render: (r) => r.invoice.number, mono: true },
  { key: "amount", label: "Valor", render: (r) => formatMoney(r.amount), mono: true },
  { key: "method", label: "Método", render: (r) => <StatusPill value={r.method} /> },
  { key: "status", label: "Estado", render: (r) => <StatusPill value={r.status} /> },
  { key: "paidAt", label: "Data", render: (r) => formatDateTime(r.paidAt), mono: true },
];

export default function PaymentsPage() {
  const { items, page, pagination, setPage, loading } = usePaginatedList<Payment>("/api/payments");

  return (
    <div className="ws-content">
      <div style={{ marginBottom: "1rem" }}>
        <h1 className="ws-topbar-title">Pagamentos</h1>
        <p className="ws-topbar-desc">Registados a partir de cada fatura. Histórico completo aqui.</p>
      </div>
      <DataTable<Payment>
        columns={columns}
        rows={items}
        loading={loading}
        emptyLabel="Ainda sem pagamentos registados."
        page={page}
        totalPages={pagination.totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}
