"use client";

import { useState } from "react";
import { DataTable, type Column } from "../_components/DataTable";
import { Modal } from "../_components/Modal";
import { CrudForm, type FormFieldConfig } from "../_components/CrudForm";
import { Button, StatusPill, formatDate } from "../_components/ui";
import { usePaginatedList } from "../_components/usePaginatedList";
import { api, ApiError } from "@/app/lib/admin-client";

interface Lead {
  id: string;
  name: string;
  email: string;
  company: string | null;
  source: string | null;
  status: string;
  clientId: string | null;
  createdAt: string;
  owner?: { name: string } | null;
}

const STATUS_OPTIONS = [
  { value: "NEW", label: "Novo" },
  { value: "CONTACTED", label: "Contactado" },
  { value: "QUALIFIED", label: "Qualificado" },
  { value: "PROPOSAL_SENT", label: "Proposta enviada" },
  { value: "WON", label: "Ganho" },
  { value: "LOST", label: "Perdido" },
];

const CREATE_FIELDS: FormFieldConfig[] = [
  { name: "name", label: "Nome", type: "text", required: true },
  { name: "email", label: "Email", type: "email", required: true },
  { name: "phone", label: "Telefone", type: "text" },
  { name: "company", label: "Empresa", type: "text" },
  {
    name: "source",
    label: "Origem",
    type: "text",
    placeholder: "site, indicação, campanha...",
  },
  { name: "message", label: "Mensagem", type: "textarea" },
];

const EDIT_FIELDS: FormFieldConfig[] = [
  ...CREATE_FIELDS,
  { name: "status", label: "Estado", type: "select", options: STATUS_OPTIONS },
];

export default function LeadsPage() {
  const { items, page, pagination, setPage, loading, reload } =
    usePaginatedList<Lead>("/api/commercial/leads");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Lead | null>(null);
  const [values, setValues] = useState<Record<string, any>>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function openCreate() {
    setEditing(null);
    setValues({});
    setError(null);
    setModalOpen(true);
  }

  function openEdit(lead: Lead) {
    setEditing(lead);
    setValues({ ...lead });
    setError(null);
    setModalOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      if (editing) {
        await api.patch(`/api/leads/${editing.id}`, values);
      } else {
        await api.post("/api/commercial/leads", values);
      }
      setModalOpen(false);
      reload();
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Não foi possível guardar.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleConvert(lead: Lead) {
    if (!confirm(`Converter "${lead.name}" em cliente?`)) return;
    try {
      await api.post(`/api/leads/${lead.id}/convert`);
      reload();
    } catch (err) {
      alert(
        err instanceof ApiError ? err.message : "Não foi possível converter.",
      );
    }
  }

  const columns: Column<Lead>[] = [
    { key: "name", label: "Nome", render: (r) => <strong>{r.name}</strong> },
    { key: "email", label: "Email", render: (r) => r.email },
    { key: "company", label: "Empresa", render: (r) => r.company ?? "—" },
    { key: "source", label: "Origem", render: (r) => r.source ?? "—" },
    {
      key: "status",
      label: "Estado",
      render: (r) => <StatusPill value={r.status} />,
    },
    {
      key: "createdAt",
      label: "Recebido",
      render: (r) => formatDate(r.createdAt),
      mono: true,
    },
  ];

  return (
    <div className="ws-content">
      <div className="ws-flex-between" style={{ marginBottom: "1rem" }}>
        <div>
          <h1 className="ws-topbar-title">Leads</h1>
          <p className="ws-topbar-desc">
            Pedidos de contacto e orçamento recebidos pelo site.
          </p>
        </div>
        <Button onClick={openCreate}>+ Novo lead</Button>
      </div>

      <DataTable<Lead>
        columns={columns}
        rows={items}
        loading={loading}
        emptyLabel="Ainda sem leads. Assim que o formulário do site receber um pedido, aparece aqui."
        page={page}
        totalPages={pagination.totalPages}
        onPageChange={setPage}
        actions={(row) => (
          <div
            style={{
              display: "flex",
              gap: "0.4rem",
              justifyContent: "flex-end",
            }}
          >
            {!row.clientId && row.status !== "LOST" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleConvert(row)}
              >
                Converter
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={() => openEdit(row)}>
              Editar
            </Button>
          </div>
        )}
      />

      {modalOpen && (
        <Modal
          title={editing ? "Editar lead" : "Novo lead"}
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
              fields={editing ? EDIT_FIELDS : CREATE_FIELDS}
              values={values}
              onChange={(name, value) =>
                setValues((prev) => ({ ...prev, [name]: value }))
              }
            />
            {error && <span className="ws-field-error">{error}</span>}
          </form>
        </Modal>
      )}
    </div>
  );
}
