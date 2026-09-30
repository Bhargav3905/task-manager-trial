import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware.js";
import { createTaskSchema, updateTaskSchema } from "../schemas/task.schema.js";
import {
  createTask,
  deleteTask,
  getUserTasks,
  updateTask,
} from "../services/task.service.js";

export async function create(req: AuthRequest, res: Response) {
  const data = createTaskSchema.parse(req.body);

  const task = await createTask(data, req.user!.userId);

  res.status(201).json({
    success: true,
    data: task,
  });
}

export async function getAll(req: AuthRequest, res: Response) {
  const tasks = await getUserTasks(req.user!.userId);

  res.json({
    success: true,
    data: tasks,
  });
}

export async function update(req: AuthRequest, res: Response) {
  const taskId = Number(req.params.id);

  const data = updateTaskSchema.parse(req.body);

  const task = await updateTask(taskId, req.user!.userId, data);
  if (!task) {
    return res.status(404).json({
      success: false,
      message: "Task not found",
    });
  }

  res.json({
    success: true,
    data: task,
  });
}

export async function remove(req: AuthRequest, res: Response) {
  const taskId = Number(req.params.id);

  const task = await deleteTask(taskId, req.user!.userId);
  if (!task) {
    return res.status(404).json({
      success: false,
      message: "Task not found",
    });
  }

  res.json({
    success: true,
    message: "Task deleted successfully",
  });
}
