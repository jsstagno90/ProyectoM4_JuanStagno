import "./TaskForm.css";
import { useState } from "react";
import type { NewTask } from "../types/task";

interface TaskFormProps {
  onCreateTask: (newTask: NewTask) => Promise<void>;
}

function TaskForm({ onCreateTask }: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    await onCreateTask({
      title,
      description,
    });

    setTitle("");
    setDescription("");
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div>
        <label>Título</label>

        <input
          className="task-input"
          type="text"
          placeholder="Ej: Estudiar React"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div>
        <label>Descripción</label>

        <textarea
          className="task-textarea"
          placeholder="Describe la tarea..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <button className="primary-btn" type="submit">
        Crear tarea
      </button>
    </form>
  );
}

export default TaskForm;  