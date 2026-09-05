"use client";

import { CrudPage } from "../_components/CrudPage";
import { type Column } from "../_components/DataTable";
import { type FormFieldConfig } from "../_components/CrudForm";
import { StatusPill, formatMoney, formatDate } from "../_components/ui";

interface Contract {
  id: string;
  title: string;
  value: string;
  status: string;
  startDate: string | null;
  endDate: string | null;
  client: { name: string };
}

const columns: Column<Contract>[] = [
  { key: "title", label: "Contrato", render: (r) => <strong>{r.title}</strong> },
  { key: "client", label: "Cliente", render: (r) => r.client?.name ?? "—" },
  { key: "value", label: "Valor", render: (r) => formatMoney(r.value), mono: true },
  { key: "status", label: "Estado", render: (r) => <StatusPill value={r.status} /> },
  { key: "startDate", label: "Início", render: (r) => formatDate(r.startDate), mono: true },
  { key: "endDate", label: "Fim", render: (r) => formatDate(r.endDate), mono: true },
];

const fields: FormFieldConfig[] = [
  {
    name: "clientId",
    label: "Cliente",
    type: "select",
    required: true,
    optionsEndpoint: "/api/shared/clients?pageSize=100",
    optionsMap: (c) => ({ value: c.id, label: c.name }),
  },
  { name: "title", label: "Título", type: "text", required: true },
  { name: "terms", label: "Termos", type: "textarea" },
  { name: "value", label: "Valor (MZN)", type: "number", required: true },
  { name: "startDate", label: "Data de início", type: "date" },
  { name: "endDate", label: "Data de fim", type: "date" },
  {
    name: "status",
    label: "Estado",
    type: "select",
    options: [
      { value: "DRAFT", label: "Rascunho" },
      { value: "SIGNED", label: "Assinado" },
      { value: "ACTIVE", label: "Ativo" },
      { value: "COMPLETED", label: "Concluído" },
      { value: "CANCELLED", label: "Cancelado" },
    ],
    helpText: "Marcar como 'Assinado' regista a data de assinatura automaticamente.",
  },
];

export default function ContractsPage() {
  return (
    <div className="ws-content">
      <CrudPage<Contract>
        title="Contratos"
        description="Gerados automaticamente ao aceitar uma proposta, ou criados diretamente."
        endpoint="/api/commercial/contracts"
        columns={columns}
        fields={fields}
        createLabel="+ Novo contrato"
        canDelete={false}
        emptyLabel="Ainda sem contratos."
      />
    </div>
  );
}
