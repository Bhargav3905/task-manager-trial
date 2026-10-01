import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { taskSchema, type TaskFormData } from "../schemas/task.schema";
import { Button } from "@base-ui/react/button";

interface TaskFormProps {
  onTaskCreated: (task: TaskFormData) => Promise<void>;
}

export default function TaskForm({ onTaskCreated }: TaskFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      status: "todo",
      priority: "medium",
    },
  });

  async function onSubmit(data: TaskFormData) {
    await onTaskCreated(data);

    reset({
      title: "",
      description: "",
      status: "todo",
      priority: "medium",
      dueDate: "",
    });
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 rounded-xl border p-5"
    >
      <div>
        <h2 className="text-lg font-semibold">Create Task</h2>
      </div>

      <div>
        <input
          {...register("title")}
          placeholder="Task title"
          className="w-full rounded-md border p-2"
        />

        {errors.title && (
          <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>
        )}
      </div>

      <div>
        <textarea
          {...register("description")}
          placeholder="Description"
          rows={3}
          className="w-full rounded-md border p-2"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <select {...register("priority")} className="rounded-md border p-2">
          <option value="low">Low Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="high">High Priority</option>
        </select>

        <select {...register("status")} className="rounded-md border p-2">
          <option value="todo">Todo</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <input
          {...register("dueDate")}
          type="date"
          className="rounded-md border p-2"
        />
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Creating..." : "Add Task"}
      </Button>
    </form>
  );
}
