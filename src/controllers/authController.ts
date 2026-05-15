import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../config/database";
import { RowDataPacket, ResultSetHeader } from "mysql2";

interface UserRow extends RowDataPacket {
  id: number;
  name: string;
  email: string;
  password: string;
}

export async function register(req: Request, res: Response): Promise<void> {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ message: "Nome, email e senha são obrigatórios." });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ message: "A senha deve ter no mínimo 6 caracteres." });
      return;
    }

    const [existing] = await pool.query<UserRow[]>(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (existing.length > 0) {
      res.status(409).json({ message: "E-mail já cadastrado." });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query<ResultSetHeader>(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );

    const token = jwt.sign(
      { id: result.insertId },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "Usuário cadastrado com sucesso.",
      token,
      user: { id: result.insertId, name, email },
    });
  } catch (error) {
    console.error("Erro ao registrar usuário:", error);
    res.status(500).json({ message: "Erro interno do servidor." });
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "E-mail e senha são obrigatórios." });
      return;
    }

    const [users] = await pool.query<UserRow[]>(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (users.length === 0) {
      res.status(401).json({ message: "Credenciais inválidas." });
      return;
    }

    const user = users[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      res.status(401).json({ message: "Credenciais inválidas." });
      return;
    }

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login realizado com sucesso.",
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    res.status(500).json({ message: "Erro interno do servidor." });
  }
}

export async function me(req: Request & { userId?: number }, res: Response): Promise<void> {
  try {
    const [users] = await pool.query<UserRow[]>(
      "SELECT id, name, email, created_at FROM users WHERE id = ?",
      [req.userId]
    );

    if (users.length === 0) {
      res.status(404).json({ message: "Usuário não encontrado." });
      return;
    }

    res.json({ user: users[0] });
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    res.status(500).json({ message: "Erro interno do servidor." });
  }
}
