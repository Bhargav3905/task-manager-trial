import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(1).max(150),
  description: z.string().optional(),
  status: z.enum(["todo", "in_progress", "completed"]).optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  dueDate: z.string().optional(),
});

export const updateTaskSchema = createTaskSchema.partial();
