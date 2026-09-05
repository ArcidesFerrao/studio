"use client";

import { CrudPage } from "../_components/CrudPage";
import { type Column } from "../_components/DataTable";
import { type FormFieldConfig } from "../_components/CrudForm";
import { StatusPill, formatMoney, formatDate } from "../_components/ui";

interface Campaign {
  id: string;
  name: string;
  channel: string;
  budget: string | null;
  status: string;
  startDate: string | null;
  endDate: string | null;
}

const columns: Column<Campaign>[] = [
  { key: "name", label: "Campanha", render: (r) => <strong>{r.name}</strong> },
  { key: "channel", label: "Canal", render: (r) => r.channel },
  { key: "budget", label: "Orçamento", render: (r) => (r.budget ? formatMoney(r.budget) : "—"), mono: true },
  { key: "status", label: "Estado", render: (r) => <StatusPill value={r.status} /> },
  { key: "startDate", label: "Início", render: (r) => formatDate(r.startDate), mono: true },
];

const fields: FormFieldConfig[] = [
  { name: "name", label: "Nome", type: "text", required: true },
  { name: "channel", label: "Canal", type: "text", required: true, placeholder: "email, social, ads, referral..." },
  { name: "budget", label: "Orçamento (MZN)", type: "number" },
  { name: "startDate", label: "Início", type: "date" },
  { name: "endDate", label: "Fim", type: "date" },
  {
    name: "status",
    label: "Estado",
    type: "select",
    options: [
      { value: "PLANNED", label: "Planeada" },
      { value: "ACTIVE", label: "Ativa" },
      { value: "PAUSED", label: "Pausada" },
      { value: "COMPLETED", label: "Concluída" },
    ],
  },
];

export default function CampaignsPage() {
  return (
    <div className="ws-content">
      <CrudPage<Campaign>
        title="Marketing"
        description="Campanhas de aquisição — canais, orçamento e estado."
        endpoint="/api/commercial/campaigns"
        columns={columns}
        fields={fields}
        createLabel="+ Nova campanha"
        emptyLabel="Ainda sem campanhas."
      />
    </div>
  );
}
