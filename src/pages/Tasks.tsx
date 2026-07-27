import { useState } from "react";
import { createTask } from "../services/taskService";

function Tasks() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      await createTask({
        title,
        description,
      });

      alert("Tarea creada correctamente");

      setTitle("");
      setDescription("");
    } catch (error) {
      console.error(error);
      
    }
  }

  return (
    <div>
      <h1>Mis tareas</h1>

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
    </div>
  );
}

export default Tasks;