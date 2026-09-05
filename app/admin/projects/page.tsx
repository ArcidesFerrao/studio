"use client";

import Link from "next/link";
import { useState } from "react";
import { DataTable, type Column } from "../_components/DataTable";
import { Modal } from "../_components/Modal";
import { CrudForm, type FormFieldConfig } from "../_components/CrudForm";
import { Button, StatusPill, formatDate } from "../_components/ui";
import { usePaginatedList } from "../_components/usePaginatedList";
import { api, ApiError } from "@/app/lib/admin-client";

interface Project {
  id: string;
  name: string;
  status: string;
  dueDate: string | null;
  client: { name: string };
  owner: { name: string } | null;
  _count?: { tasks: number };
}

const FIELDS: FormFieldConfig[] = [
  {
    name: "clientId",
    label: "Cliente",
    type: "select",
    required: true,
    optionsEndpoint: "/api/clients?pageSize=100",
    optionsMap: (c) => ({ value: c.id, label: c.name }),
  },
  {
    name: "contractId",
    label: "Contrato (opcional)",
    type: "select",
    optionsEndpoint: "/api/contracts?pageSize=100",
    optionsMap: (c) => ({ value: c.id, label: c.title }),
  },
  { name: "name", label: "Nome do projeto", type: "text", required: true },
  { name: "description", label: "Descrição", type: "textarea" },
  { name: "budget", label: "Orçamento (MZN)", type: "number" },
  { name: "startDate", label: "Início", type: "date" },
  { name: "dueDate", label: "Prazo", type: "date" },
  {
    name: "ownerId",
    label: "Responsável",
    type: "select",
    optionsEndpoint: "/api/users?pageSize=100",
    optionsMap: (u) => ({ value: u.id, label: u.name }),
  },
];

export default function ProjectsPage() {
  const { items, page, pagination, setPage, loading, reload } =
    usePaginatedList<Project>("/api/projects");
  const [modalOpen, setModalOpen] = useState(false);
  const [values, setValues] = useState<Record<string, any>>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await api.post("/api/projects", values);
      setModalOpen(false);
      setValues({});
      reload();
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Não foi possível criar o projeto.",
      );
    } finally {
      setSaving(false);
    }
  }

  const columns: Column<Project>[] = [
    {
      key: "name",
      label: "Projeto",
      render: (r) => (
        <Link
          href={`/admin/projects/${r.id}`}
          style={{ color: "var(--ws-fg)", fontWeight: 600 }}
        >
          {r.name}
        </Link>
      ),
    },
    { key: "client", label: "Cliente", render: (r) => r.client?.name ?? "—" },
    { key: "owner", label: "Responsável", render: (r) => r.owner?.name ?? "—" },
    {
      key: "tasks",
      label: "Tarefas",
      render: (r) => r._count?.tasks ?? 0,
      mono: true,
    },
    {
      key: "status",
      label: "Estado",
      render: (r) => <StatusPill value={r.status} />,
    },
    {
      key: "dueDate",
      label: "Prazo",
      render: (r) => formatDate(r.dueDate),
      mono: true,
    },
  ];

  return (
    <div className="ws-content">
      <div className="ws-flex-between" style={{ marginBottom: "1rem" }}>
        <div>
          <h1 className="ws-topbar-title">Projetos</h1>
          <p className="ws-topbar-desc">
            Clica num projeto para ver e gerir as tarefas.
          </p>
        </div>
        <Button onClick={() => setModalOpen(true)}>+ Novo projeto</Button>
      </div>

      <DataTable<Project>
        columns={columns}
        rows={items}
        loading={loading}
        emptyLabel="Ainda sem projetos."
        page={page}
        totalPages={pagination.totalPages}
        onPageChange={setPage}
      />

      {modalOpen && (
        <Modal
          title="Novo projeto"
          onClose={() => setModalOpen(false)}
          footer={
            <>
              <Button variant="ghost" onClick={() => setModalOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSubmit} disabled={saving}>
                {saving ? "A guardar..." : "Guardar"}
              </Button>
            </>
          }
        >
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <CrudForm
              fields={FIELDS}
              values={values}
              onChange={(name, value) =>
                setValues((p) => ({ ...p, [name]: value }))
              }
            />
            {error && <span className="ws-field-error">{error}</span>}
          </form>
        </Modal>
      )}
    </div>
  );
}
