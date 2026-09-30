import pool from "../db/index.js";

interface CreateTaskData {
  title: string;
  description?: string;
  status?: string;
  priority?: string;
  dueDate?: string;
}

interface UpdateTaskData {
  title?: string;
  description?: string;
  status?: string;
  priority?: string;
  dueDate?: string;
}

export async function createTask(data: CreateTaskData, userId: number) {
  const result = await pool.query(
    `INSERT INTO tasks
      (title, description, status, priority, due_date, created_by)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [
      data.title,
      data.description ?? null,
      data.status ?? "todo",
      data.priority ?? "medium",
      data.dueDate ?? null,
      userId,
    ],
  );

  return result.rows[0];
}

export async function getUserTasks(userId: number) {
  const result = await pool.query(
    `SELECT
       id,
       title,
       description,
       status,
       priority,
       due_date,
       created_by,
       assigned_to,
       created_at,
       updated_at
     FROM tasks
     WHERE created_by = $1
     ORDER BY created_at DESC`,
    [userId],
  );

  return result.rows;
}

export async function updateTask(
  taskId: number,
  userId: number,
  data: UpdateTaskData,
) {
  const result = await pool.query(
    `UPDATE tasks
     SET
       title = COALESCE($1, title),
       description = COALESCE($2, description),
       status = COALESCE($3, status),
       priority = COALESCE($4, priority),
       due_date = COALESCE($5, due_date),
       updated_at = CURRENT_TIMESTAMP
     WHERE id = $6
       AND created_by = $7
     RETURNING *`,
    [
      data.title ?? null,
      data.description ?? null,
      data.status ?? null,
      data.priority ?? null,
      data.dueDate ?? null,
      taskId,
      userId,
    ],
  );

  return result.rows[0] ?? null;
}

export async function deleteTask(taskId: number, userId: number) {
  const result = await pool.query(
    `DELETE FROM tasks
     WHERE id = $1
       AND created_by = $2
     RETURNING *`,
    [taskId, userId],
  );

  return result.rows[0] ?? null;
}
