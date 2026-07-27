import { useEffect, useState } from "react";
import { createTask, getTasks } from "../services/taskService";

import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";

import type { NewTask, Task } from "../types/task";

function Tasks() {

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

  async function handleCreateTask(newTask: NewTask) {
    try {
      await createTask(newTask);

      const data = await getTasks();
      setTasks(data);

      alert("Tarea creada correctamente");
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div>
      <h1>Mis tareas</h1>

      <TaskForm onCreateTask={handleCreateTask} />

      <hr />

      <TaskList tasks={tasks} />
    </div>
  );
}

export default Tasks;