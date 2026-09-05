"use client";

import { DataTable, type Column } from "../_components/DataTable";
import { formatDateTime } from "../_components/ui";
import { usePaginatedList } from "../_components/usePaginatedList";

interface Activity {
  id: string;
  type: string;
  description: string;
  entityType: string;
  createdAt: string;
}

const columns: Column<Activity>[] = [
  { key: "description", label: "Evento", render: (r) => r.description },
  { key: "entityType", label: "Entidade", render: (r) => r.entityType },
  { key: "type", label: "Tipo", render: (r) => r.type, mono: true },
  { key: "createdAt", label: "Quando", render: (r) => formatDateTime(r.createdAt), mono: true },
];

export default function ActivitiesPage() {
  const { items, page, pagination, setPage, loading } = usePaginatedList<Activity>("/api/shared/activities");

  return (
    <div className="ws-content">
      <div style={{ marginBottom: "1rem" }}>
        <h1 className="ws-topbar-title">Atividade</h1>
        <p className="ws-topbar-desc">Histórico completo de eventos de negócio, entre todos os módulos.</p>
      </div>
      <DataTable<Activity>
        columns={columns}
        rows={items}
        loading={loading}
        emptyLabel="Ainda sem atividade registada."
        page={page}
        totalPages={pagination.totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}
