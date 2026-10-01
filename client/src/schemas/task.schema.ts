import { z } from "zod";

export const taskSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(150, "Title must be under 150 characters"),

  description: z.string().optional(),

  status: z.enum(["todo", "in_progress", "completed"]),

  priority: z.enum(["low", "medium", "high"]),

  dueDate: z.string().optional(),
});

export type TaskFormData = z.infer<typeof taskSchema>;
