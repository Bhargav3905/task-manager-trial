import api from "./api";
import type { Task } from "../types/task";
import type { TaskFormData } from "../schemas/task.schema";

export async function getTasks(): Promise<Task[]> {
  const response = await api.get("/tasks");
  return response.data.data;
}

export async function createTask(data: TaskFormData): Promise<Task> {
  const response = await api.post("/tasks", data);
  return response.data.data;
}

export async function updateTask(
  id: number,
  data: Partial<TaskFormData>,
): Promise<Task> {
  const response = await api.patch(`/tasks/${id}`, data);
  return response.data.data;
}

export async function deleteTask(id: number): Promise<void> {
  await api.delete(`/tasks/${id}`);
}
