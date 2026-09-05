"use client";

import { useState } from "react";
import { DataTable, type Column } from "./DataTable";
import { Modal } from "./Modal";
import { CrudForm, type FormFieldConfig } from "./CrudForm";
import { Button } from "./ui";
import { usePaginatedList } from "./usePaginatedList";
import { api, ApiError } from "@/app/lib/admin-client";

export function CrudPage<T extends { id: string }>({
  title,
  description,
  endpoint,
  columns,
  fields,
  editFields,
  emptyLabel,
  canCreate = true,
  canEdit = true,
  canDelete = true,
  createLabel = "+ Novo",
  extraToolbar,
  extraActions,
}: {
  title: string;
  description?: string;
  endpoint: string;
  columns: Column<T>[];
  fields: FormFieldConfig[];
  /** Campos usados no formulário de edição, se diferentes dos de criação (ex.: sem password). */
  editFields?: FormFieldConfig[];
  emptyLabel?: string;
  canCreate?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
  createLabel?: string;
  extraToolbar?: React.ReactNode;
  extraActions?: (row: T, reload: () => void) => React.ReactNode;
}) {
  const { items, page, pagination, setPage, loading, reload } =
    usePaginatedList<T>(endpoint);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<T | null>(null);
  const [values, setValues] = useState<Record<string, any>>({});
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  function openCreate() {
    setEditing(null);
    setValues({});
    setFormError(null);
    setModalOpen(true);
  }

  function openEdit(row: T) {
    setEditing(row);
    setValues({ ...row });
    setFormError(null);
    setModalOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFormError(null);
    try {
      if (editing) {
        await api.patch(`${endpoint}/${editing.id}`, values);
      } else {
        await api.post(endpoint, values);
      }
      setModalOpen(false);
      reload();
    } catch (err) {
      setFormError(
        err instanceof ApiError ? err.message : "Não foi possível guardar.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(row: T) {
    if (!confirm("Tens a certeza que queres remover este registo?")) return;
    try {
      await api.del(`${endpoint}/${row.id}`);
      reload();
    } catch (err) {
      alert(
        err instanceof ApiError ? err.message : "Não foi possível remover.",
      );
    }
  }

  return (
    <div>
      <div className="ws-flex-between" style={{ marginBottom: "1rem" }}>
        <div>
          <h1 className="ws-topbar-title">{title}</h1>
          {description && <p className="ws-topbar-desc">{description}</p>}
        </div>
        <div style={{ display: "flex", gap: "0.6rem" }}>
          {extraToolbar}
          {canCreate && <Button onClick={openCreate}>{createLabel}</Button>}
        </div>
      </div>

      <DataTable<T>
        columns={columns}
        rows={items}
        loading={loading}
        emptyLabel={emptyLabel}
        page={page}
        totalPages={pagination.totalPages}
        onPageChange={setPage}
        actions={
          canEdit || canDelete || extraActions
            ? (row) => (
                <div
                  style={{
                    display: "flex",
                    gap: "0.4rem",
                    justifyContent: "flex-end",
                  }}
                >
                  {extraActions?.(row, reload)}
                  {canEdit && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEdit(row)}
                    >
                      Editar
                    </Button>
                  )}
                  {canDelete && (
                    <button
                      className="ws-icon-btn"
                      title="Remover"
                      onClick={() => handleDelete(row)}
                    >
                      ✕
                    </button>
                  )}
                </div>
              )
            : undefined
        }
      />

      {modalOpen && (
        <Modal
          title={
            editing
              ? `Editar ${title.replace(/s$/, "")}`
              : createLabel.replace("+ ", "")
          }
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
              fields={editing ? (editFields ?? fields) : fields}
              values={values}
              onChange={(name, value) =>
                setValues((prev) => ({ ...prev, [name]: value }))
              }
            />
            {formError && <span className="ws-field-error">{formError}</span>}
          </form>
        </Modal>
      )}
    </div>
  );
}
