import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../db/index.js";
import { jwtSecret } from "../utils/env.js";

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

function generateToken(userId: number, role: string) {
  if (!jwtSecret) {
    throw new Error("JWT secret is not configured");
  }

  return jwt.sign({ userId, role }, jwtSecret, { expiresIn: "1h" });
}

export async function registerUser(data: RegisterData) {
  const existingUser = await pool.query(
    "SELECT id FROM users WHERE email = $1",
    [data.email],
  );

  if (existingUser.rows.length > 0) {
    throw new Error("Email already registered");
  }

  const passwordHash = await bcrypt.hash(data.password, 10);

  const result = await pool.query(
    `INSERT INTO users (name, email, password_hash)
     VALUES ($1, $2, $3)
     RETURNING id, name, email, role, created_at`,
    [data.name, data.email, passwordHash],
  );

  const user = result.rows[0];
  const token = generateToken(user.id, user.role);
  return { user, token };
}

export async function loginUser(data: LoginData) {
  const result = await pool.query(
    `SELECT id, name, email, password_hash, role
     FROM users
     WHERE email = $1`,
    [data.email],
  );

  const user = result.rows[0];
  if (!user) {
    throw new Error("Invalid email or password");
  }

  const passwordMatch = await bcrypt.compare(data.password, user.password_hash);
  if (!passwordMatch) {
    throw new Error("Invalid email or password");
  }

  const token = generateToken(user.id, user.role);
  delete user.password_hash;
  return { user, token };
}
