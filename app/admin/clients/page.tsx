"use client";

import { CrudPage } from "../_components/CrudPage";
import { type Column } from "../_components/DataTable";
import { type FormFieldConfig } from "../_components/CrudForm";

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
}

const columns: Column<Client>[] = [
  { key: "name", label: "Nome", render: (r) => <strong>{r.name}</strong> },
  { key: "email", label: "Email", render: (r) => r.email },
  { key: "phone", label: "Telefone", render: (r) => r.phone ?? "—" },
  { key: "company", label: "Empresa", render: (r) => r.company ?? "—" },
];

const fields: FormFieldConfig[] = [
  { name: "name", label: "Nome", type: "text", required: true },
  { name: "email", label: "Email", type: "email", required: true },
  { name: "phone", label: "Telefone", type: "text" },
  { name: "company", label: "Empresa", type: "text" },
  { name: "taxId", label: "NUIT", type: "text" },
  { name: "address", label: "Morada", type: "text" },
  { name: "notes", label: "Notas", type: "textarea" },
];

export default function ClientsPage() {
  return (
    <div className="ws-content">
      <CrudPage<Client>
        title="Clientes"
        description="Todos os clientes ativos e históricos."
        endpoint="/api/shared/clients"
        columns={columns}
        fields={fields}
        createLabel="+ Novo cliente"
        emptyLabel="Ainda sem clientes. Converte um lead ou cria um diretamente."
      />
    </div>
  );
}
