"use client";

import { useEffect, useState, use as usePromise } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Field,
  Select,
  TextInput,
  StatusPill,
  formatDate,
  formatMoney,
} from "../../_components/ui";
import { Modal } from "../../_components/Modal";
import { api, ApiError } from "@/app/lib/admin-client";

interface Task {
  id: string;
  title: string;
  status: string;
  priority: string;
  dueDate: string | null;
  assignee: { name: string } | null;
}

interface ProjectDetail {
  id: string;
  name: string;
  description: string | null;
  status: string;
  budget: string | null;
  dueDate: string | null;
  client: { id: string; name: string };
  owner: { name: string } | null;
  tasks: Task[];
  invoices: { id: string; number: string; total: string; status: string }[];
}

const STATUS_OPTIONS = [
  { value: "PLANNING", label: "Planeamento" },
  { value: "IN_PROGRESS", label: "Em curso" },
  { value: "ON_HOLD", label: "Em pausa" },
  { value: "COMPLETED", label: "Concluído" },
  { value: "CANCELLED", label: "Cancelado" },
];

const TASK_STATUS_OPTIONS = [
  { value: "TODO", label: "A fazer" },
  { value: "IN_PROGRESS", label: "Em curso" },
  { value: "REVIEW", label: "Em revisão" },
  { value: "DONE", label: "Feito" },
];

export default function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = usePromise(params);
  const router = useRouter();
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskPriority, setTaskPriority] = useState("MEDIUM");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      const data = await api.get<ProjectDetail>(`/api/projects/${id}`);
      setProject(data);
    } catch {
      router.push("/admin/projects");
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function handleStatusChange(status: string) {
    try {
      await api.patch(`/api/projects/${id}`, { status });
      load();
    } catch (err) {
      alert(
        err instanceof ApiError ? err.message : "Não foi possível atualizar.",
      );
    }
  }

  async function handleCreateTask(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await api.post("/api/delivery/tasks", {
        projectId: id,
        title: taskTitle,
        priority: taskPriority,
      });
      setTaskModalOpen(false);
      setTaskTitle("");
      setTaskPriority("MEDIUM");
      load();
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Não foi possível criar a tarefa.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleTaskStatus(taskId: string, status: string) {
    try {
      await api.patch(`/api/tasks/${taskId}`, { status });
      load();
    } catch (err) {
      alert(
        err instanceof ApiError
          ? err.message
          : "Não foi possível atualizar a tarefa.",
      );
    }
  }

  if (!project) {
    return (
      <div className="ws-content">
        <p style={{ color: "var(--ws-muted)" }}>A carregar...</p>
      </div>
    );
  }

  return (
    <div className="ws-content">
      <div className="ws-flex-between" style={{ marginBottom: "1rem" }}>
        <div>
          <h1 className="ws-topbar-title">{project.name}</h1>
          <p className="ws-topbar-desc">
            {project.client.name}{" "}
            {project.owner ? `· responsável: ${project.owner.name}` : ""}
          </p>
        </div>
        <Select
          value={project.status}
          onChange={(e) => handleStatusChange(e.target.value)}
          style={{ width: "auto" }}
        >
          {STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </Select>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: "1rem",
          marginBottom: "1.25rem",
        }}
      >
        <div className="ws-stat-card">
          <div className="ws-stat-val">
            {project.budget ? formatMoney(project.budget) : "—"}
          </div>
          <div className="ws-stat-lbl">Orçamento</div>
        </div>
        <div className="ws-stat-card">
          <div className="ws-stat-val">{formatDate(project.dueDate)}</div>
          <div className="ws-stat-lbl">Prazo</div>
        </div>
        <div className="ws-stat-card">
          <div className="ws-stat-val">
            {project.tasks.filter((t) => t.status === "DONE").length}/
            {project.tasks.length}
          </div>
          <div className="ws-stat-lbl">Tarefas concluídas</div>
        </div>
      </div>

      <div
        className="ws-card-block"
        style={{ padding: "1.25rem 1.4rem", marginBottom: "1.25rem" }}
      >
        <div className="ws-flex-between" style={{ marginBottom: "0.8rem" }}>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "1rem",
            }}
          >
            Tarefas
          </h2>
          <Button size="sm" onClick={() => setTaskModalOpen(true)}>
            + Nova tarefa
          </Button>
        </div>

        {project.tasks.length === 0 ? (
          <p style={{ color: "var(--ws-muted)", fontSize: "0.85rem" }}>
            Ainda sem tarefas.
          </p>
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
          >
            {project.tasks.map((task) => (
              <div
                key={task.id}
                className="ws-flex-between"
                style={{
                  padding: "0.6rem 0",
                  borderBottom: "1px solid var(--ws-border)",
                }}
              >
                <div>
                  <div style={{ fontSize: "0.88rem" }}>{task.title}</div>
                  <div
                    style={{ fontSize: "0.72rem", color: "var(--ws-muted)" }}
                  >
                    {task.assignee?.name ?? "Sem responsável"} ·{" "}
                    <StatusPill value={task.priority} />
                  </div>
                </div>
                <Select
                  value={task.status}
                  onChange={(e) => handleTaskStatus(task.id, e.target.value)}
                  style={{ width: "auto" }}
                >
                  {TASK_STATUS_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </Select>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="ws-card-block" style={{ padding: "1.25rem 1.4rem" }}>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: "1rem",
            marginBottom: "0.8rem",
          }}
        >
          Faturas
        </h2>
        {project.invoices.length === 0 ? (
          <p style={{ color: "var(--ws-muted)", fontSize: "0.85rem" }}>
            Ainda sem faturas para este projeto.
          </p>
        ) : (
          project.invoices.map((inv) => (
            <div
              key={inv.id}
              className="ws-flex-between"
              style={{ padding: "0.5rem 0" }}
            >
              <span style={{ fontSize: "0.85rem" }}>{inv.number}</span>
              <span
                style={{ display: "flex", gap: "0.6rem", alignItems: "center" }}
              >
                <span className="ws-table-mono">{formatMoney(inv.total)}</span>
                <StatusPill value={inv.status} />
              </span>
            </div>
          ))
        )}
      </div>

      {taskModalOpen && (
        <Modal
          title="Nova tarefa"
          onClose={() => setTaskModalOpen(false)}
          footer={
            <>
              <Button variant="ghost" onClick={() => setTaskModalOpen(false)}>
                Cancelar
              </Button>
              <Button
                onClick={handleCreateTask}
                disabled={saving || !taskTitle}
              >
                {saving ? "A guardar..." : "Guardar"}
              </Button>
            </>
          }
        >
          <form
            onSubmit={handleCreateTask}
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <Field label="Título" htmlFor="task-title">
              <TextInput
                id="task-title"
                value={taskTitle}
                required
                onChange={(e) => setTaskTitle(e.target.value)}
              />
            </Field>
            <Field label="Prioridade" htmlFor="task-priority">
              <Select
                id="task-priority"
                value={taskPriority}
                onChange={(e) => setTaskPriority(e.target.value)}
              >
                <option value="LOW">Baixa</option>
                <option value="MEDIUM">Média</option>
                <option value="HIGH">Alta</option>
                <option value="URGENT">Urgente</option>
              </Select>
            </Field>
            {error && <span className="ws-field-error">{error}</span>}
          </form>
        </Modal>
      )}
    </div>
  );
}
