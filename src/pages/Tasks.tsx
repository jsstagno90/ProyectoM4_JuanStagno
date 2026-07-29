import "./Tasks.css";
import { useMemo, useState } from "react";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import { useTasks } from "../hooks/useTasks";
import { useAuth } from "../hooks/useAuth";
import type { Timestamp } from "firebase/firestore";
import {
  getActivitySummary,
  resetActivitySummary,
} from "../utils/activitySummary";

function Tasks() {
  const [query, setQuery] = useState("");
  const [sortOption, setSortOption] = useState("recent");
  const [summaryStatus, setSummaryStatus] = useState<string | null>(null);
  const [isSendingSummary, setIsSendingSummary] = useState(false);
  const { user } = useAuth();
  const {
    tasks,
    loading,
    error,
    createTask,
    deleteTask,
    toggleTaskCompleted,
    updateTask,
  } = useTasks();

  const filteredTasks = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    const getTime = (taskDate: Timestamp | Date | null | undefined) => {
      if (!taskDate) return 0;

      if (taskDate instanceof Date) {
        return taskDate.getTime();
      }

      return taskDate.toDate().getTime();
    };

    const scoredTasks = tasks.map((task) => {
      const title = task.title.toLowerCase();
      const description = task.description.toLowerCase();

      if (!normalizedQuery) {
        return { task, score: 0 };
      }

      const titleIndex = title.indexOf(normalizedQuery);
      const descriptionIndex = description.indexOf(normalizedQuery);
      const matchesTitle = titleIndex >= 0;
      const matchesDescription = descriptionIndex >= 0;

      let score = 0;

      if (matchesTitle) score += 100;
      if (matchesDescription) score += 20;
      if (matchesTitle && titleIndex === 0) score += 30;
      if (matchesDescription && descriptionIndex === 0) score += 10;

      return { task, score: matchesTitle || matchesDescription ? score : -1 };
    });

    const filtered = scoredTasks
      .filter(({ score }) => score >= 0)
      .sort((a, b) => {
        if (b.score !== a.score) {
          return b.score - a.score;
        }

        if (sortOption === "oldest") {
          return getTime(a.task.createdAt) - getTime(b.task.createdAt);
        }

        if (sortOption === "completed") {
          return Number(b.task.completed) - Number(a.task.completed) || getTime(b.task.createdAt) - getTime(a.task.createdAt);
        }

        if (sortOption === "pending") {
          return Number(a.task.completed) - Number(b.task.completed) || getTime(b.task.createdAt) - getTime(a.task.createdAt);
        }

        return getTime(b.task.createdAt) - getTime(a.task.createdAt);
      })
      .map(({ task }) => task);

    if (!normalizedQuery) {
      return filtered.sort((a, b) => {
        if (sortOption === "oldest") {
          return getTime(a.createdAt) - getTime(b.createdAt);
        }

        if (sortOption === "completed") {
          return Number(b.completed) - Number(a.completed) || getTime(b.createdAt) - getTime(a.createdAt);
        }

        if (sortOption === "pending") {
          return Number(a.completed) - Number(b.completed) || getTime(b.createdAt) - getTime(a.createdAt);
        }

        return getTime(b.createdAt) - getTime(a.createdAt);
      });
    }

    return filtered;
  }, [query, sortOption, tasks]);

  const handleSendSummary = async () => {
    if (!user?.email) {
      setSummaryStatus("No se encontró un correo del usuario autenticado.");
      return;
    }

    setIsSendingSummary(true);
    setSummaryStatus(null);

    try {
      const summary = getActivitySummary();
      const now = new Date();
      const formattedDate = now.toLocaleString("es-AR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

      const message = [
        "Resumen de actividad",
        "",
        "Desde el último resumen enviado:",
        `✅ Tareas creadas: ${summary.created}`,
        `✔️ Tareas completadas: ${summary.completed}`,
        `🗑️ Tareas eliminadas: ${summary.deleted}`,
        "",
        "Fecha del resumen:",
        formattedDate,
      ].join("\n");
      console.log("Enviando resumen a:", user.email);
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",

        },
        body: JSON.stringify({
          to: user.email,
          subject: "Resumen de actividad",
          message,
        }),

      });

      const data = await response.json();

      if (!response.ok || !data?.success) {
        throw new Error(data?.message || "No se pudo enviar el resumen.");
      }

      resetActivitySummary();
      setSummaryStatus("Resumen enviado correctamente.");
    } catch (error) {
      console.error(error);
      setSummaryStatus("No se pudo enviar el resumen.");
    } finally {
      setIsSendingSummary(false);
    }
  };

  return (
    <div className="tasks-page">
      <div className="task-form-card">
        <h1>📋 Nueva tarea</h1>

        <TaskForm onCreateTask={createTask} />
      </div>

      <div className="task-list-card">
        <div className="task-list-header">
          <div className="task-list-actions">
            <button
              className="primary-btn"
              type="button"
              onClick={handleSendSummary}
              disabled={isSendingSummary}
            >
              {isSendingSummary ? "Enviando..." : "📧 Resumen por correo"}
            </button>
            {summaryStatus && (
              <p className={summaryStatus.includes("correctamente") ? "task-success" : "task-error"}>
                {summaryStatus}
              </p>
            )}
          </div>
          <div>
            <h2>📌 Mis tareas</h2>
            <p className="task-search-info">
              {filteredTasks.length} tarea{filteredTasks.length === 1 ? "" : "s"} encontrada{filteredTasks.length === 1 ? "" : "s"} · {filteredTasks.filter((task) => !task.completed).length} pendiente{filteredTasks.filter((task) => !task.completed).length === 1 ? "" : "s"} · {filteredTasks.filter((task) => task.completed).length} completada{filteredTasks.filter((task) => task.completed).length === 1 ? "" : "s"}
            </p>
            {loading && <p>Cargando tareas...</p>}
            {error && <p className="task-error">{error}</p>}
          </div>

          <div className="task-list-controls">
            <input
              className="task-search"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por título o descripción..."
            />

            <select
              className="task-sort-select"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              aria-label="Ordenar tareas"
            >
              <option value="recent">Fecha más reciente</option>
              <option value="oldest">Fecha más antigua</option>
              <option value="completed">Completadas primero</option>
              <option value="pending">Pendientes primero</option>
            </select>
          </div>
        </div>

        <TaskList
          tasks={filteredTasks}
          onDelete={deleteTask}
          onToggleCompleted={toggleTaskCompleted}
          onUpdate={(id, title, description) =>
            updateTask(id, {
              title,
              description,
            })
          }
        />
      </div>
    </div>
  );
}

export default Tasks;
