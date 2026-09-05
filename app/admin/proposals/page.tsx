"use client";

import { useEffect, useState } from "react";
import { DataTable, type Column } from "../_components/DataTable";
import { Modal } from "../_components/Modal";
import {
  Button,
  Field,
  Select,
  TextArea,
  TextInput,
  StatusPill,
  formatMoney,
  formatDate,
} from "../_components/ui";
import { usePaginatedList } from "../_components/usePaginatedList";
import { api, ApiError } from "@/app/lib/admin-client";

interface Proposal {
  id: string;
  title: string;
  totalAmount: string;
  status: string;
  validUntil: string | null;
  createdAt: string;
  client: { id: string; name: string };
}

interface ClientOption {
  id: string;
  name: string;
}

interface LineItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

const emptyItem: LineItem = { description: "", quantity: 1, unitPrice: 0 };

export default function ProposalsPage() {
  const { items, page, pagination, setPage, loading, reload } =
    usePaginatedList<Proposal>("/api/commercial/proposals");
  const [clients, setClients] = useState<ClientOption[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [clientId, setClientId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [validUntil, setValidUntil] = useState("");
  const [lineItems, setLineItems] = useState<LineItem[]>([{ ...emptyItem }]);

  useEffect(() => {
    if (modalOpen && clients.length === 0) {
      api
        .get<{ items: ClientOption[] }>("/api/shared/clients?pageSize=100")
        .then((r) => setClients(r.items))
        .catch(() => {});
    }
  }, [modalOpen, clients.length]);

  function resetForm() {
    setClientId("");
    setTitle("");
    setDescription("");
    setValidUntil("");
    setLineItems([{ ...emptyItem }]);
    setError(null);
  }

  const total = lineItems.reduce(
    (sum, item) => sum + (item.quantity || 0) * (item.unitPrice || 0),
    0,
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await api.post("/api/commercial/proposals", {
        clientId,
        title,
        description: description || undefined,
        validUntil: validUntil || undefined,
        items: lineItems.filter((i) => i.description),
      });
      setModalOpen(false);
      resetForm();
      reload();
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Não foi possível criar a proposta.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleSend(proposal: Proposal) {
    if (!confirm(`Marcar "${proposal.title}" como enviada ao cliente?`)) return;
    try {
      await api.post(`/api/proposals/${proposal.id}/send`);
      reload();
    } catch (err) {
      alert(err instanceof ApiError ? err.message : "Não foi possível enviar.");
    }
  }

  async function handleRespond(proposal: Proposal, accepted: boolean) {
    if (
      !confirm(
        `Registar resposta do cliente como "${accepted ? "aceite" : "rejeitada"}"?`,
      )
    )
      return;
    try {
      await api.post(`/api/proposals/${proposal.id}/respond`, { accepted });
      reload();
    } catch (err) {
      alert(
        err instanceof ApiError
          ? err.message
          : "Não foi possível registar a resposta.",
      );
    }
  }

  const columns: Column<Proposal>[] = [
    {
      key: "title",
      label: "Proposta",
      render: (r) => <strong>{r.title}</strong>,
    },
    { key: "client", label: "Cliente", render: (r) => r.client.name },
    {
      key: "totalAmount",
      label: "Valor",
      render: (r) => formatMoney(r.totalAmount),
      mono: true,
    },
    {
      key: "status",
      label: "Estado",
      render: (r) => <StatusPill value={r.status} />,
    },
    {
      key: "validUntil",
      label: "Válida até",
      render: (r) => formatDate(r.validUntil),
      mono: true,
    },
  ];

  return (
    <div className="ws-content">
      <div className="ws-flex-between" style={{ marginBottom: "1rem" }}>
        <div>
          <h1 className="ws-topbar-title">Propostas</h1>
          <p className="ws-topbar-desc">
            Ao aceitar, um contrato é gerado automaticamente.
          </p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setModalOpen(true);
          }}
        >
          + Nova proposta
        </Button>
      </div>

      <DataTable<Proposal>
        columns={columns}
        rows={items}
        loading={loading}
        emptyLabel="Ainda sem propostas."
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
            {row.status === "DRAFT" && (
              <Button variant="ghost" size="sm" onClick={() => handleSend(row)}>
                Enviar
              </Button>
            )}
            {row.status === "SENT" && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRespond(row, true)}
                >
                  Aceite
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleRespond(row, false)}
                >
                  Rejeitada
                </Button>
              </>
            )}
          </div>
        )}
      />

      {modalOpen && (
        <Modal
          title="Nova proposta"
          onClose={() => setModalOpen(false)}
          footer={
            <>
              <Button variant="ghost" onClick={() => setModalOpen(false)}>
                Cancelar
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={saving || !clientId || !title}
              >
                {saving ? "A guardar..." : "Guardar rascunho"}
              </Button>
            </>
          }
        >
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <Field label="Cliente" htmlFor="proposal-client">
              <Select
                id="proposal-client"
                value={clientId}
                required
                onChange={(e) => setClientId(e.target.value)}
              >
                <option value="">Selecionar...</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </Select>
            </Field>

            <Field label="Título" htmlFor="proposal-title">
              <TextInput
                id="proposal-title"
                value={title}
                required
                onChange={(e) => setTitle(e.target.value)}
              />
            </Field>

            <Field label="Descrição" htmlFor="proposal-desc">
              <TextArea
                id="proposal-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Field>

            <Field label="Válida até" htmlFor="proposal-valid">
              <TextInput
                id="proposal-valid"
                type="date"
                value={validUntil}
                onChange={(e) => setValidUntil(e.target.value)}
              />
            </Field>

            <div>
              <label
                className="ws-field-label"
                style={{ display: "block", marginBottom: "0.5rem" }}
              >
                Itens
              </label>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.6rem",
                }}
              >
                {lineItems.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      gap: "0.5rem",
                      alignItems: "center",
                    }}
                  >
                    <TextInput
                      placeholder="Descrição"
                      value={item.description}
                      onChange={(e) => {
                        const next = [...lineItems];
                        next[idx] = {
                          ...next[idx],
                          description: e.target.value,
                        };
                        setLineItems(next);
                      }}
                      style={{ flex: 3 }}
                    />
                    <TextInput
                      type="number"
                      placeholder="Qtd"
                      value={item.quantity}
                      min={0}
                      onChange={(e) => {
                        const next = [...lineItems];
                        next[idx] = {
                          ...next[idx],
                          quantity: e.target.valueAsNumber || 0,
                        };
                        setLineItems(next);
                      }}
                      style={{ flex: 1 }}
                    />
                    <TextInput
                      type="number"
                      placeholder="Preço unit."
                      value={item.unitPrice}
                      min={0}
                      onChange={(e) => {
                        const next = [...lineItems];
                        next[idx] = {
                          ...next[idx],
                          unitPrice: e.target.valueAsNumber || 0,
                        };
                        setLineItems(next);
                      }}
                      style={{ flex: 1 }}
                    />
                    <button
                      type="button"
                      className="ws-icon-btn"
                      onClick={() =>
                        setLineItems(lineItems.filter((_, i) => i !== idx))
                      }
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                style={{ marginTop: "0.6rem" }}
                onClick={() => setLineItems([...lineItems, { ...emptyItem }])}
              >
                + Adicionar item
              </Button>
            </div>

            <div
              className="ws-flex-between"
              style={{
                borderTop: "1px solid var(--ws-border)",
                paddingTop: "0.8rem",
              }}
            >
              <span style={{ fontSize: "0.85rem", color: "var(--ws-muted)" }}>
                Total
              </span>
              <span
                style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}
              >
                {formatMoney(total)}
              </span>
            </div>

            {error && <span className="ws-field-error">{error}</span>}
          </form>
        </Modal>
      )}
    </div>
  );
}
