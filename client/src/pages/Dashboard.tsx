import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";
import type { Task } from "../types/task";
import type { TaskFormData } from "../schemas/task.schema";

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
    } catch (error) {
      console.error("Failed to create task", error);
    }
  }

  async function handleDeleteTask(id: number) {
    try {
      await deleteTask(id);

      setTasks((current) => current.filter((task) => task.id !== id));
    } catch (error) {
      console.error("Failed to delete task", error);
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
    } catch (error) {
      console.error("Failed to update task", error);
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

          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>

        {/* Create Task */}
        <TaskForm onTaskCreated={handleCreateTask} />

        {/* Tasks */}
        <section>
          <h2 className="mb-4 text-xl font-semibold">My Tasks</h2>

          {loading ? (
            <p>Loading tasks...</p>
          ) : tasks.length === 0 ? (
            <p className="text-gray-500">
              No tasks yet. Create your first task.
            </p>
          ) : (
            <div className="space-y-4">
              {tasks.map((task) => (
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
