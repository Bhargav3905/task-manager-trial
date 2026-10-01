import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";
import type { Task } from "../types/task";
import type { TaskFormData } from "../schemas/task.schema";
import toast from "react-hot-toast";

import {
  createTask,
  deleteTask,
  getTasks,
  updateTask,
} from "../services/task.service";

import TaskForm from "../components/TaskForm";
import TaskCard from "../components/TaskCard";
import { Button } from "@base-ui/react/button";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const filteredTasks = tasks.filter((task) => {
    const statusMatch = statusFilter === "all" || task.status === statusFilter;

    const priorityMatch =
      priorityFilter === "all" || task.priority === priorityFilter;

    return statusMatch && priorityMatch;
  });

  async function loadTasks() {
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (error) {
      console.error("Failed to load tasks", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTasks();
  }, []);

  async function handleCreateTask(data: TaskFormData) {
    try {
      const task = await createTask(data);
      setTasks((current) => [task, ...current]);
      toast.success("Task created");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create task");
    }
  }

  async function handleDeleteTask(id: number) {
    try {
      await deleteTask(id);
      setTasks((current) => current.filter((task) => task.id !== id));
      toast.success("Task deleted");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete task");
    }
  }

  async function handleStatusChange(id: number, status: Task["status"]) {
    try {
      const updatedTask = await updateTask(id, {
        status,
      });
      setTasks((current) =>
        current.map((task) => (task.id === id ? updatedTask : task)),
      );
      toast.success("Task updated");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update task");
    }
  }

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <div className="min-h-screen p-6">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-4">
          <div>
            <h1 className="text-2xl font-bold">Task Manager</h1>
            <p className="text-sm text-gray-500">Welcome, {user?.name}</p>
          </div>

          <Button className="rounded-md border px-4 py-2" onClick={handleLogout}>
            Logout
          </Button>
        </div>

        <TaskForm onTaskCreated={handleCreateTask} />

        <section>
          <div className="flex flex-wrap gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-md border p-2"
            >
              <option value="all">All Status</option>
              <option value="todo">Todo</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="rounded-md border p-2"
            >
              <option value="all">All Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <h2 className="mb-4 text-xl font-semibold">My Tasks</h2>

          {loading ? (
            <p>Loading tasks...</p>
          ) : tasks.length === 0 ? (
            <p className="text-gray-500">
              No tasks yet. Create your first task.
            </p>
          ) : (
            <div className="space-y-4">
              {filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onDelete={handleDeleteTask}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
