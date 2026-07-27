import { useEffect, useState } from "react";
import { createTask, getTasks } from "../services/taskService";
import type { Task } from "../types/task";

function Tasks() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    async function loadTasks() {
      try {
        const data = await getTasks();
        setTasks(data);
      } catch (error) {
        console.error(error);
      }
    }

    loadTasks();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      await createTask({
        title,
        description,
      });
      const data = await getTasks();
      setTasks(data);

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
      <hr />

      <h2>Lista de tareas</h2>

      {tasks.map((task) => (
        <div key={task.id}>
          <h3>{task.title}</h3>
          <p>{task.description}</p>
          <hr />
        </div>
      ))}
    </div>
  );
}

export default Tasks;