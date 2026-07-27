import type { Task } from "../types/task";
import TaskItem from "./TaskItem";

interface TaskListProps {
    tasks: Task[];
    onDelete: (id: string) => void;
    onToggleCompleted: (
        id: string,
        completed: boolean
    ) => void;
    onUpdate: (
        id: string,
        title: string,
        description: string
    ) => void;
}

function TaskList({ tasks, onDelete, onToggleCompleted, onUpdate }: TaskListProps) {
    if (tasks.length === 0) {
        return <p>No hay tareas creadas.</p>;
    }

    return (
        <div>
            <h2>Lista de tareas</h2>

            {tasks.map((task) => (
                <TaskItem
                    key={task.id}
                    task={task}
                    onDelete={onDelete}
                    onToggleCompleted={onToggleCompleted}
                    onUpdate={onUpdate}
                />
            ))}
        </div>
    );
}

export default TaskList;