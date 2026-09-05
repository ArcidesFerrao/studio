"use client";

import { CrudPage } from "../_components/CrudPage";
import { type Column } from "../_components/DataTable";
import { type FormFieldConfig } from "../_components/CrudForm";
import { StatusPill } from "../_components/ui";

interface AppUser {
  id: string;
  name: string;
  email: string;
  role: string;
  active: boolean;
}

const columns: Column<AppUser>[] = [
  { key: "name", label: "Nome", render: (r) => <strong>{r.name}</strong> },
  { key: "email", label: "Email", render: (r) => r.email },
  { key: "role", label: "Papel", render: (r) => (r.role === "ADMIN" ? "Administrador" : "Equipa") },
  { key: "active", label: "Estado", render: (r) => <StatusPill value={r.active ? "ACTIVE" : "CANCELLED"} /> },
];

const ROLE_OPTIONS = [
  { value: "STAFF", label: "Equipa" },
  { value: "ADMIN", label: "Administrador" },
];

const CREATE_FIELDS: FormFieldConfig[] = [
  { name: "name", label: "Nome", type: "text", required: true },
  { name: "email", label: "Email", type: "email", required: true },
  { name: "password", label: "Palavra-passe inicial", type: "text", required: true, helpText: "Mínimo 8 caracteres." },
  { name: "role", label: "Papel", type: "select", options: ROLE_OPTIONS },
];

const EDIT_FIELDS: FormFieldConfig[] = [
  { name: "name", label: "Nome", type: "text", required: true },
  { name: "role", label: "Papel", type: "select", options: ROLE_OPTIONS },
  { name: "active", label: "Conta ativa", type: "checkbox" },
];

export function UsersClient() {
  return (
    <CrudPage<AppUser>
      title="Utilizadores"
      description="Contas da equipa com acesso ao painel interno."
      endpoint="/api/shared/users"
      columns={columns}
      fields={CREATE_FIELDS}
      editFields={EDIT_FIELDS}
      canDelete={false}
      createLabel="+ Novo utilizador"
      emptyLabel="Ainda sem utilizadores além de ti."
    />
  );
}
