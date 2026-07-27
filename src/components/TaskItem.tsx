import type { Task } from "../types/task";

interface TaskItemProps {
  task: Task;
}

function TaskItem({ task }: TaskItemProps) {
  return (
    <div>
      <h3>{task.title}</h3>
      <p>{task.description}</p>
      <hr />
    </div>
  );
}

export default TaskItem;