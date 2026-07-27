import { useCallback, useEffect, useState } from "react";
import type { NewTask, Task } from "../types/task";
import {
  createTask as createTaskService,
  getTasks,
  deleteTask as deleteTaskService,
  toggleTaskCompleted as toggleTaskCompletedService,
  updateTask as updateTaskService,
} from "../services/taskService";
import { useAuth } from "./useAuth";

export function useTasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadTasks = useCallback(async () => {
    if (!user) {
      setTasks([]);
      return;
    }

    setLoading(true);
    try {
      const data = await getTasks();
      setTasks(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar las tareas.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void loadTasks();
  }, [loadTasks]);

  const refreshTasks = useCallback(async () => {
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (err) {
      console.error(err);
      setError("No se pudieron actualizar las tareas.");
    }
  }, []);

  const createTask = useCallback(
    async (newTask: NewTask) => {
      await createTaskService(newTask);
      await refreshTasks();
    },
    [refreshTasks]
  );

  const deleteTask = useCallback(
    async (id: string) => {
      await deleteTaskService(id);
      await refreshTasks();
    },
    [refreshTasks]
  );

  const toggleTaskCompleted = useCallback(
    async (id: string, completed: boolean) => {
      await toggleTaskCompletedService(id, completed);
      await refreshTasks();
    },
    [refreshTasks]
  );

  const updateTask = useCallback(
    async (id: string, updatedData: Partial<Task>) => {
      await updateTaskService(id, updatedData);
      await refreshTasks();
    },
    [refreshTasks]
  );

  return {
    tasks,
    loading,
    error,
    createTask,
    deleteTask,
    toggleTaskCompleted,
    updateTask,
    refreshTasks,
  };
}
