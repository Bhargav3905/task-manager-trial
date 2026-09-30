import { Request, Response } from "express";
import { loginSchema, registerSchema } from "../schemas/auth.schema.js";
import { loginUser, registerUser } from "../services/auth.service.js";
import pool from "../db/index.js";
import { AuthRequest } from "../middleware/auth.middleware.js";

export async function register(req: Request, res: Response) {
  const data = registerSchema.parse(req.body);

  const result = await registerUser(data);

  res.status(201).json({
    success: true,
    data: result,
  });
}

export async function login(req: Request, res: Response) {
  const data = loginSchema.parse(req.body);
  const result = await loginUser(data);
  res.status(200).json({
    success: true,
    data: result,
  });
}

export async function getMe(req: AuthRequest, res: Response) {
  const result = await pool.query(
    `SELECT id, name, email, role, created_at
     FROM users
     WHERE id = $1`,
    [req.user!.userId],
  );

  if (result.rows.length === 0) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  res.json({
    success: true,
    data: result.rows[0],
  });
}
