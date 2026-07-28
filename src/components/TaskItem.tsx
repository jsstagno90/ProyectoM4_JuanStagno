import "./TaskItem.css";
import type { Task } from "../types/task";
import { useEffect, useState } from "react";
import {
  FaCheck,
  FaEdit,
  FaTrash,
  FaSave,
  FaTimes,
  FaUndo,
} from "react-icons/fa";

interface TaskItemProps {
  task: Task;
  onDelete: (id: string) => void;
  onToggleCompleted: (id: string, completed: boolean) => void;
  onUpdate: (
    id: string,
    title: string,
    description: string
  ) => Promise<void>;
}

function TaskItem({
  task,
  onDelete,
  onToggleCompleted,
  onUpdate,
}: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [isEntering, setIsEntering] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setIsEntering(true);
    }, 20);

    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    setTitle(task.title);
    setDescription(task.description);
  }, [task.title, task.description]);

  const handleDelete = () => {
    if (isRemoving) return;
    setIsRemoving(true);
    window.setTimeout(() => {
      onDelete(task.id);
    }, 220);
  };

  const handleSave = async () => {
    if (!title.trim()) {
      setError("Por favor introduzca un título");
      return;
    }

    setError("");
    setIsSaving(true);

    try {
      await onUpdate(task.id, title.trim(), description.trim());
      setIsEditing(false);
    } catch {
      setError("No se pudo guardar la tarea. Inténtalo de nuevo.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isEditing) {
    return (
      <div className="task-card entering">
        <input
          className="task-input"
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (error) setError("");
          }}
        />

        {error && <p className="task-error">{error}</p>}

        <textarea
          className="task-textarea"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="task-actions">
          <div className="task-actions-left">
            <button
              className="task-btn save-btn"
              onClick={handleSave}
              disabled={isSaving || isRemoving}
            >
              <FaSave />
              Guardar
            </button>
          </div>

          <div className="task-actions-right">
            <button
              className="task-btn cancel-btn"
              onClick={() => setIsEditing(false)}
              disabled={isSaving || isRemoving}
            >
              <FaTimes />
              Cancelar
            </button>
          </div>
        </div>
        {isSaving && <p className="task-status-message">Guardando cambios...</p>}
      </div>
    );
  }

  const getFormattedDate = () => {
    if (!task.createdAt) return "Fecha desconocida";

    const date =
      typeof task.createdAt.toDate === "function"
        ? task.createdAt.toDate()
        : task.createdAt instanceof Date
        ? task.createdAt
        : null;

    if (!date) return "Fecha desconocida";

    return new Intl.DateTimeFormat("es-AR", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div className={`task-card${isEntering ? " entering" : ""}${isRemoving ? " removing" : ""}`}>
      <div className="task-card-header">
        <h3 className={task.completed ? "completed-title" : ""}>
          {task.title}
        </h3>
        <span className="task-card-date">{getFormattedDate()}</span>
      </div>

      <p>{task.description}</p>

      <div className="task-status-row">
        <span
          className={
            task.completed
              ? "completed-badge"
              : "pending-badge"
          }
        >
          {task.completed ? "Completada" : "Pendiente"}
        </span>
      </div>

      <div className="task-actions">
        <button
          className={`task-btn ${
            task.completed
              ? "pending-btn"
              : "complete-btn"
          }`}
          onClick={() =>
            onToggleCompleted(
              task.id,
              task.completed
            )
          }
          disabled={isRemoving}
        >
          {task.completed ? <FaUndo /> : <FaCheck />}
          {task.completed ? " Pendiente" : " Completar"}
        </button>

        <button
          className="task-btn edit-btn"
          onClick={() => setIsEditing(true)}
          disabled={isRemoving}
        >
          <FaEdit />
          Editar
        </button>

        <button
          className="task-btn delete-btn"
          onClick={handleDelete}
          disabled={isRemoving}
        >
          <FaTrash />
          Eliminar
        </button>
      </div>
    </div>
  );
}

export default TaskItem;