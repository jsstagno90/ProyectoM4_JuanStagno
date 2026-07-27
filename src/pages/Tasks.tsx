import { useEffect, useState } from "react";
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
  return (
    <div>
      <h1>Mis tareas</h1>

      <TaskForm onCreateTask={handleCreateTask} />

      <hr />

      <TaskList
        tasks={tasks}
        onDelete={handleDeleteTask}
        onToggleCompleted={handleToggleCompleted}
        onUpdate={handleUpdate}
      />
    </div>
  );

}



export default Tasks;