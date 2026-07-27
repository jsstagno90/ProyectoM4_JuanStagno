import "./Tasks.css";
import { useEffect, useMemo, useState } from "react";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";

import type { NewTask, Task } from "../types/task";
import {
  createTask,
  getTasks,
  deleteTask,
  toggleTaskCompleted,
  updateTask,
} from "../services/taskService";
import { useAuth } from "../hooks/useAuth";

function Tasks() {

  const [tasks, setTasks] = useState<Task[]>([]);
  const [query, setQuery] = useState("");
  const [sortOption, setSortOption] = useState("recent");
  const { user } = useAuth();

  console.log("Context user:", user);
  useEffect(() => {
    if (!user) {
      console.log("Todavía no hay usuario");
      return;
    }

    console.log("Usuario listo:", user.uid);

    async function loadTasks() {
      try {
        const data = await getTasks();
        setTasks(data);
      } catch (error) {
        console.error(error);
      }
    }

    loadTasks();
  }, [user]);

  async function handleCreateTask(newTask: NewTask) {
    try {
      await createTask(newTask);

      const data = await getTasks();
      setTasks(data);


    } catch (error) {
      console.error(error);
    }
  }


  async function handleDeleteTask(id: string) {
    try {
      await deleteTask(id);

      const data = await getTasks();
      setTasks(data);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleToggleCompleted(
    id: string,
    completed: boolean
  ) {
    try {
      await toggleTaskCompleted(id, completed);

      const data = await getTasks();
      setTasks(data);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleUpdate(
    id: string,
    title: string,
    description: string
  ) {
    try {
      await updateTask(id, {
        title,
        description,
      });

      const data = await getTasks();
      setTasks(data);
    } catch (error) {
      console.error(error);
    }
  }

  const filteredTasks = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    const filtered = normalizedQuery
      ? tasks.filter((task) => {
          const title = task.title.toLowerCase();
          const description = task.description.toLowerCase();
          return title.includes(normalizedQuery) || description.includes(normalizedQuery);
        })
      : [...tasks];

    const getTime = (taskDate: any) => {
      if (!taskDate) return 0;
      if (typeof taskDate.toDate === "function") {
        return taskDate.toDate().getTime();
      }
      return taskDate instanceof Date ? taskDate.getTime() : 0;
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

        <TaskForm onCreateTask={handleCreateTask} />
      </div>

      <div className="task-list-card">
        <div className="task-list-header">
          <div>
            <h2>📌 Mis tareas</h2>
            <p className="task-search-info">
              {filteredTasks.length} tarea{filteredTasks.length === 1 ? "" : "s"} encontrada{filteredTasks.length === 1 ? "" : "s"}
            </p>
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
          onDelete={handleDeleteTask}
          onToggleCompleted={handleToggleCompleted}
          onUpdate={handleUpdate}
        />
      </div>
    </div>
  );

}



export default Tasks;