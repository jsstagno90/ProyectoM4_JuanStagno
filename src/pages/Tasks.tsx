import "./Tasks.css";
import { useMemo, useState } from "react";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import { useTasks } from "../hooks/useTasks";
import type { Timestamp } from "firebase/firestore";


function Tasks() {
  const [query, setQuery] = useState("");
  const [sortOption, setSortOption] = useState("recent");
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

    const filtered = normalizedQuery
      ? tasks.filter((task) => {
        const title = task.title.toLowerCase();
        const description = task.description.toLowerCase();
        return title.includes(normalizedQuery) || description.includes(normalizedQuery);
      })
      : [...tasks];

    const getTime = (taskDate: Timestamp | Date | null | undefined) => {
      if (!taskDate) return 0;

      if (taskDate instanceof Date) {
        return taskDate.getTime();
      }

      return taskDate.toDate().getTime();
    };

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
  }, [query, sortOption, tasks]);

  return (
    <div className="tasks-page">
      <div className="task-form-card">
        <h1>📋 Nueva tarea</h1>

        <TaskForm onCreateTask={createTask} />
      </div>

      <div className="task-list-card">
        <div className="task-list-header">
          <div>
            <h2>📌 Mis tareas</h2>
            <p className="task-search-info">
              {filteredTasks.length} tarea{filteredTasks.length === 1 ? "" : "s"} encontrada{filteredTasks.length === 1 ? "" : "s"}
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
          tasks={tasks}
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
