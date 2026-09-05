"use client";

import { CrudPage } from "../_components/CrudPage";
import { type Column } from "../_components/DataTable";
import { type FormFieldConfig } from "../_components/CrudForm";
import { formatMoney, StatusPill } from "../_components/ui";

interface ServiceItem {
  id: string;
  name: string;
  description: string | null;
  basePrice: string;
  unit: string;
  active: boolean;
}

const columns: Column<ServiceItem>[] = [
  { key: "name", label: "Serviço", render: (r) => <strong>{r.name}</strong> },
  { key: "basePrice", label: "Preço base", render: (r) => formatMoney(r.basePrice), mono: true },
  { key: "unit", label: "Unidade", render: (r) => r.unit },
  { key: "active", label: "Estado", render: (r) => <StatusPill value={r.active ? "ACTIVE" : "CANCELLED"} /> },
];

const fields: FormFieldConfig[] = [
  { name: "name", label: "Nome", type: "text", required: true },
  { name: "description", label: "Descrição", type: "textarea" },
  { name: "basePrice", label: "Preço base (MZN)", type: "number", required: true },
  { name: "unit", label: "Unidade", type: "select", options: [
    { value: "projeto", label: "Projeto" },
    { value: "hora", label: "Hora" },
    { value: "mês", label: "Mês" },
  ] },
  { name: "active", label: "Ativo no catálogo público", type: "checkbox" },
];

export default function ServicesPage() {
  return (
    <div className="ws-content">
      <CrudPage<ServiceItem>
        title="Catálogo de serviços"
        description="Serviços oferecidos — exibidos publicamente na landing page (apenas os ativos)."
        endpoint="/api/services"
        columns={columns}
        fields={fields}
        createLabel="+ Novo serviço"
        emptyLabel="Ainda sem serviços no catálogo."
      />
    </div>
  );
}
