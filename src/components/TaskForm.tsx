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
    <form onSubmit={handleSubmit}>
      <div>
        <label>Título</label>
        <br />
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <br />

      <div>
        <label>Descripción</label>
        <br />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <br />

      <button type="submit">Crear tarea</button>
    </form>
  );
}

export default TaskForm;