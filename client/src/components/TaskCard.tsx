import type { Task } from "../types/task";
import { Button } from "@base-ui/react/button";

interface TaskCardProps {
  task: Task;
  onDelete: (id: number) => Promise<void>;
  onStatusChange: (id: number, status: Task["status"]) => Promise<void>;
}

export default function TaskCard({
  task,
  onDelete,
  onStatusChange,
}: TaskCardProps) {
  return (
    <div className="rounded-xl border p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-semibold">{task.title}</h3>

          {task.description && (
            <p className="mt-1 text-sm text-gray-500">{task.description}</p>
          )}
        </div>

        <span className="rounded-full border px-2 py-1 text-xs">
          {task.priority}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <select
          value={task.status}
          onChange={(e) =>
            onStatusChange(task.id, e.target.value as Task["status"])
          }
          className="rounded-md border p-2 text-sm"
        >
          <option value="todo">Todo</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        {task.due_date && (
          <span className="text-sm text-gray-500">Due: {task.due_date}</span>
        )}

        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(task.id)}
        >
          Delete
        </Button>
      </div>
    </div>
  );
}
