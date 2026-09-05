"use client";

import { CrudPage } from "../_components/CrudPage";
import { type Column } from "../_components/DataTable";
import { type FormFieldConfig } from "../_components/CrudForm";
import { formatMoney, formatDate, StatusPill } from "../_components/ui";

interface Expense {
  id: string;
  category: string;
  description: string;
  amount: string;
  date: string;
  project: { name: string } | null;
}

const CATEGORY_OPTIONS = [
  { value: "SOFTWARE", label: "Software" },
  { value: "HOSTING", label: "Hosting" },
  { value: "MARKETING", label: "Marketing" },
  { value: "EQUIPMENT", label: "Equipamento" },
  { value: "CONTRACTOR", label: "Prestador externo" },
  { value: "TAXES", label: "Impostos" },
  { value: "OTHER", label: "Outro" },
];

const columns: Column<Expense>[] = [
  { key: "description", label: "Descrição", render: (r) => <strong>{r.description}</strong> },
  { key: "category", label: "Categoria", render: (r) => <StatusPill value={r.category} /> },
  { key: "project", label: "Projeto", render: (r) => r.project?.name ?? "—" },
  { key: "amount", label: "Valor", render: (r) => formatMoney(r.amount), mono: true },
  { key: "date", label: "Data", render: (r) => formatDate(r.date), mono: true },
];

const fields: FormFieldConfig[] = [
  { name: "description", label: "Descrição", type: "text", required: true },
  { name: "category", label: "Categoria", type: "select", required: true, options: CATEGORY_OPTIONS },
  { name: "amount", label: "Valor (MZN)", type: "number", required: true },
  { name: "date", label: "Data", type: "date" },
  {
    name: "projectId",
    label: "Projeto (opcional)",
    type: "select",
    optionsEndpoint: "/api/projects?pageSize=100",
    optionsMap: (p) => ({ value: p.id, label: p.name }),
  },
];

export default function ExpensesPage() {
  return (
    <div className="ws-content">
      <CrudPage<Expense>
        title="Despesas"
        description="Custos operacionais — software, equipamento, prestadores externos."
        endpoint="/api/expenses"
        columns={columns}
        fields={fields}
        createLabel="+ Nova despesa"
        emptyLabel="Ainda sem despesas registadas."
      />
    </div>
  );
}
