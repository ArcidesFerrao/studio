"use client";

import { CrudPage } from "../_components/CrudPage";
import { type Column } from "../_components/DataTable";
import { type FormFieldConfig } from "../_components/CrudForm";
import { StatusPill, formatDate } from "../_components/ui";

interface Task {
  id: string;
  title: string;
  status: string;
  priority: string;
  dueDate: string | null;
  assignee: { name: string } | null;
}

const columns: Column<Task>[] = [
  { key: "title", label: "Tarefa", render: (r) => <strong>{r.title}</strong> },
  { key: "assignee", label: "Responsável", render: (r) => r.assignee?.name ?? "—" },
  { key: "priority", label: "Prioridade", render: (r) => <StatusPill value={r.priority} /> },
  { key: "status", label: "Estado", render: (r) => <StatusPill value={r.status} /> },
  { key: "dueDate", label: "Prazo", render: (r) => formatDate(r.dueDate), mono: true },
];

const fields: FormFieldConfig[] = [
  {
    name: "projectId",
    label: "Projeto",
    type: "select",
    required: true,
    optionsEndpoint: "/api/delivery/projects?pageSize=100",
    optionsMap: (p) => ({ value: p.id, label: p.name }),
  },
  { name: "title", label: "Título", type: "text", required: true },
  { name: "description", label: "Descrição", type: "textarea" },
  {
    name: "priority",
    label: "Prioridade",
    type: "select",
    options: [
      { value: "LOW", label: "Baixa" },
      { value: "MEDIUM", label: "Média" },
      { value: "HIGH", label: "Alta" },
      { value: "URGENT", label: "Urgente" },
    ],
  },
  {
    name: "assigneeId",
    label: "Responsável",
    type: "select",
    optionsEndpoint: "/api/shared/users?pageSize=100",
    optionsMap: (u) => ({ value: u.id, label: u.name }),
  },
  { name: "dueDate", label: "Prazo", type: "date" },
  {
    name: "status",
    label: "Estado",
    type: "select",
    options: [
      { value: "TODO", label: "A fazer" },
      { value: "IN_PROGRESS", label: "Em curso" },
      { value: "REVIEW", label: "Em revisão" },
      { value: "DONE", label: "Feito" },
    ],
  },
];

export default function TasksPage() {
  return (
    <div className="ws-content">
      <CrudPage<Task>
        title="Tarefas"
        description="Todas as tarefas, entre projetos. Para o quadro por projeto, abre o projeto."
        endpoint="/api/delivery/tasks"
        columns={columns}
        fields={fields}
        canDelete={false}
        createLabel="+ Nova tarefa"
        emptyLabel="Ainda sem tarefas."
      />
    </div>
  );
}
