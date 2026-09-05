"use client";

import { useEffect, useState } from "react";
import { DataTable, type Column } from "../_components/DataTable";
import { Modal } from "../_components/Modal";
import {
  Button,
  Field,
  Select,
  TextInput,
  StatusPill,
  formatMoney,
  formatDate,
} from "../_components/ui";
import { usePaginatedList } from "../_components/usePaginatedList";
import { api, ApiError } from "@/app/lib/admin-client";

interface Invoice {
  id: string;
  number: string;
  total: string;
  status: string;
  dueDate: string | null;
  client: { name: string };
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
const PAYMENT_METHODS = [
  { value: "BANK_TRANSFER", label: "Transferência bancária" },
  { value: "MPESA", label: "M-Pesa" },
  { value: "EMOLA", label: "e-Mola" },
  { value: "CARD", label: "Cartão" },
  { value: "CASH", label: "Numerário" },
  { value: "OTHER", label: "Outro" },
];

export default function InvoicesPage() {
  const { items, page, pagination, setPage, loading, reload } =
    usePaginatedList<Invoice>("/api/invoices");
  const [clients, setClients] = useState<ClientOption[]>([]);

  const [createOpen, setCreateOpen] = useState(false);
  const [clientId, setClientId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [lineItems, setLineItems] = useState<LineItem[]>([{ ...emptyItem }]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [payTarget, setPayTarget] = useState<Invoice | null>(null);
  const [payAmount, setPayAmount] = useState<number>(0);
  const [payMethod, setPayMethod] = useState("BANK_TRANSFER");
  const [payReference, setPayReference] = useState("");
  const [payError, setPayError] = useState<string | null>(null);
  const [paySaving, setPaySaving] = useState(false);

  useEffect(() => {
    if (createOpen && clients.length === 0) {
      api
        .get<{ items: ClientOption[] }>("/api/clients?pageSize=100")
        .then((r) => setClients(r.items))
        .catch(() => {});
    }
  }, [createOpen, clients.length]);

  const total = lineItems.reduce(
    (sum, item) => sum + (item.quantity || 0) * (item.unitPrice || 0),
    0,
  );

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await api.post("/api/invoices", {
        clientId,
        dueDate: dueDate || undefined,
        items: lineItems.filter((i) => i.description),
      });
      setCreateOpen(false);
      setClientId("");
      setDueDate("");
      setLineItems([{ ...emptyItem }]);
      reload();
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Não foi possível criar a fatura.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleSend(invoice: Invoice) {
    try {
      await api.post(`/api/invoices/${invoice.id}/send`);
      reload();
    } catch (err) {
      alert(
        err instanceof ApiError
          ? err.message
          : "Não foi possível marcar como enviada.",
      );
    }
  }

  function openPay(invoice: Invoice) {
    setPayTarget(invoice);
    setPayAmount(Number(invoice.total));
    setPayMethod("BANK_TRANSFER");
    setPayReference("");
    setPayError(null);
  }

  async function handleRecordPayment(e: React.FormEvent) {
    e.preventDefault();
    if (!payTarget) return;
    setPaySaving(true);
    setPayError(null);
    try {
      await api.post("/api/payments", {
        invoiceId: payTarget.id,
        amount: payAmount,
        method: payMethod,
        reference: payReference || undefined,
      });
      setPayTarget(null);
      reload();
    } catch (err) {
      setPayError(
        err instanceof ApiError
          ? err.message
          : "Não foi possível registar o pagamento.",
      );
    } finally {
      setPaySaving(false);
    }
  }

  const columns: Column<Invoice>[] = [
    { key: "number", label: "Nº", render: (r) => r.number, mono: true },
    { key: "client", label: "Cliente", render: (r) => r.client.name },
    {
      key: "total",
      label: "Total",
      render: (r) => formatMoney(r.total),
      mono: true,
    },
    {
      key: "status",
      label: "Estado",
      render: (r) => <StatusPill value={r.status} />,
    },
    {
      key: "dueDate",
      label: "Vencimento",
      render: (r) => formatDate(r.dueDate),
      mono: true,
    },
  ];

  return (
    <div className="ws-content">
      <div className="ws-flex-between" style={{ marginBottom: "1rem" }}>
        <div>
          <h1 className="ws-topbar-title">Faturas</h1>
          <p className="ws-topbar-desc">
            O estado atualiza automaticamente conforme os pagamentos registados.
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>+ Nova fatura</Button>
      </div>

      <DataTable<Invoice>
        columns={columns}
        rows={items}
        loading={loading}
        emptyLabel="Ainda sem faturas."
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
                Marcar enviada
              </Button>
            )}
            {row.status !== "PAID" && row.status !== "CANCELLED" && (
              <Button size="sm" onClick={() => openPay(row)}>
                Registar pagamento
              </Button>
            )}
          </div>
        )}
      />

      {createOpen && (
        <Modal
          title="Nova fatura"
          onClose={() => setCreateOpen(false)}
          footer={
            <>
              <Button variant="ghost" onClick={() => setCreateOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreate} disabled={saving || !clientId}>
                {saving ? "A guardar..." : "Guardar"}
              </Button>
            </>
          }
        >
          <form
            onSubmit={handleCreate}
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <Field label="Cliente" htmlFor="invoice-client">
              <Select
                id="invoice-client"
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

            <Field label="Vencimento" htmlFor="invoice-due">
              <TextInput
                id="invoice-due"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
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
                Subtotal
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

      {payTarget && (
        <Modal
          title={`Registar pagamento — ${payTarget.number}`}
          onClose={() => setPayTarget(null)}
          footer={
            <>
              <Button variant="ghost" onClick={() => setPayTarget(null)}>
                Cancelar
              </Button>
              <Button
                onClick={handleRecordPayment}
                disabled={paySaving || payAmount <= 0}
              >
                {paySaving ? "A registar..." : "Registar"}
              </Button>
            </>
          }
        >
          <form
            onSubmit={handleRecordPayment}
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <Field label="Valor (MZN)" htmlFor="pay-amount">
              <TextInput
                id="pay-amount"
                type="number"
                min={0}
                value={payAmount}
                onChange={(e) => setPayAmount(e.target.valueAsNumber || 0)}
              />
            </Field>
            <Field label="Método" htmlFor="pay-method">
              <Select
                id="pay-method"
                value={payMethod}
                onChange={(e) => setPayMethod(e.target.value)}
              >
                {PAYMENT_METHODS.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Referência (opcional)" htmlFor="pay-ref">
              <TextInput
                id="pay-ref"
                value={payReference}
                onChange={(e) => setPayReference(e.target.value)}
              />
            </Field>
            {payError && <span className="ws-field-error">{payError}</span>}
          </form>
        </Modal>
      )}
    </div>
  );
}
