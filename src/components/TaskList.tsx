import type { Task } from "../types/task";
import TaskItem from "./TaskItem";

interface TaskListProps {
    tasks: Task[];
}

function TaskList({ tasks }: TaskListProps) {
    if (tasks.length === 0) {
        return <p>No hay tareas creadas.</p>;
    }
    return (
        <div>
            <h2>Lista de tareas</h2>

            {tasks.map((task) => (
                <TaskItem key={task.id} task={task} />
            ))}
        </div>
    );
}

export default TaskList;