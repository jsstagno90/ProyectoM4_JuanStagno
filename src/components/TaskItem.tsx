import type { Task } from "../types/task";
import { useState } from "react";

interface TaskItemProps {
    task: Task;
    onDelete: (id: string) => void;
    onToggleCompleted: (id: string, completed: boolean) => void;
    onUpdate: (
        id: string,
        title: string,
        description: string
    ) => void;
}

function TaskItem({ task, onDelete, onToggleCompleted, onUpdate }: TaskItemProps) {

    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(task.title);
    const [description, setDescription] = useState(task.description);
    if (isEditing) {
        return (
            <div>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <br />

                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                <br />

                <button
                    onClick={() => {
                        onUpdate(task.id, title, description);
                        setIsEditing(false);
                    }}
                >
                    Guardar
                </button>

                <button onClick={() => setIsEditing(false)}>
                    Cancelar
                </button>

                <hr />
            </div>
        );
    }
    return (
        <div>
            <h3
                style={{
                    textDecoration: task.completed ? "line-through" : "none",
                }}
            >
                {task.title}
            </h3>

            <p>{task.description}</p>
            <button
                onClick={() =>
                    onToggleCompleted(task.id, task.completed)
                }
            >
                {task.completed ? "Pendiente" : "Completar"}
            </button>
            <button onClick={() => setIsEditing(true)}>
                Editar
            </button>
            <button onClick={() => onDelete(task.id)}>
                Eliminar
            </button>

            <hr />
        </div>
    );
}

export default TaskItem;