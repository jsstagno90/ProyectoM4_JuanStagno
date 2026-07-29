import { useCallback, useEffect, useState } from "react";
import { Timestamp } from "firebase/firestore";
import type { NewTask, Task } from "../types/task";
import {
  createTask as createTaskService,
  getTasks,
  deleteTask as deleteTaskService,
  toggleTaskCompleted as toggleTaskCompletedService,
  updateTask as updateTaskService,
} from "../services/taskService";
import { incrementActivitySummary } from "../utils/activitySummary";
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
      const optimisticTask: Task = {
        id: `temp-${Date.now()}`,
        title: newTask.title,
        description: newTask.description,
        completed: false,
        userId: user?.uid ?? "",
        createdAt: Timestamp.now(),
      };

      setTasks((prev) => [optimisticTask, ...prev]);

      try {
        await createTaskService(newTask);
        incrementActivitySummary("created");
        await refreshTasks();
      } catch (err) {
        setTasks((prev) => prev.filter((task) => task.id !== optimisticTask.id));
        throw err;
      }
    },
    [refreshTasks, user?.uid]
  );

  const deleteTask = useCallback(
    async (id: string) => {
      await deleteTaskService(id);
      incrementActivitySummary("deleted");
      await refreshTasks();
    },
    [refreshTasks]
  );

  const toggleTaskCompleted = useCallback(
    async (id: string, completed: boolean) => {
      await toggleTaskCompletedService(id, completed);
      if (!completed) {
        incrementActivitySummary("completed");
      }
      await refreshTasks();
    },
    [refreshTasks]
  );

  const updateTask = useCallback(
    async (id: string, updatedData: Partial<Task>) => {
      const previousTasks = [...tasks];

      setTasks((prev) =>
        prev.map((task) =>
          task.id === id ? { ...task, ...updatedData } : task
        )
      );

      try {
        await updateTaskService(id, updatedData);
        await refreshTasks();
      } catch (err) {
        setTasks(previousTasks);
        throw err;
      }
    },
    [refreshTasks, tasks]
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
