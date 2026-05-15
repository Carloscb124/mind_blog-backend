import { Request, Response } from "express";
import pool from "../config/database";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import fs from "fs";
import path from "path";

interface ArticleRow extends RowDataPacket {
  id: number;
  title: string;
  content: string;
  banner_url: string | null;
  author_id: number;
  author_name: string;
  author_email: string;
  published_at: Date;
  updated_at: Date;
}

export async function listArticles(_req: Request, res: Response): Promise<void> {
  try {
    const [articles] = await pool.query<ArticleRow[]>(
      `SELECT 
        a.id, a.title, a.content, a.banner_url,
        a.author_id, u.name AS author_name, u.email AS author_email,
        a.published_at, a.updated_at
       FROM articles a
       INNER JOIN users u ON u.id = a.author_id
       ORDER BY a.published_at DESC`
    );

    res.json({ articles });
  } catch (error) {
    console.error("Erro ao listar artigos:", error);
    res.status(500).json({ message: "Erro interno do servidor." });
  }
}

export async function getArticle(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    const [articles] = await pool.query<ArticleRow[]>(
      `SELECT 
        a.id, a.title, a.content, a.banner_url,
        a.author_id, u.name AS author_name, u.email AS author_email,
        a.published_at, a.updated_at
       FROM articles a
       INNER JOIN users u ON u.id = a.author_id
       WHERE a.id = ?`,
      [id]
    );

    if (articles.length === 0) {
      res.status(404).json({ message: "Artigo não encontrado." });
      return;
    }

    res.json({ article: articles[0] });
  } catch (error) {
    console.error("Erro ao buscar artigo:", error);
    res.status(500).json({ message: "Erro interno do servidor." });
  }
}

export async function createArticle(
  req: Request & { userId?: number },
  res: Response
): Promise<void> {
  try {
    const { title, content } = req.body;
    const authorId = req.userId;

    if (!title || !content) {
      res.status(400).json({ message: "Título e conteúdo são obrigatórios." });
      return;
    }

    const bannerUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO articles (title, content, banner_url, author_id, published_at, updated_at)
       VALUES (?, ?, ?, ?, NOW(), NOW())`,
      [title, content, bannerUrl, authorId]
    );

    const [articles] = await pool.query<ArticleRow[]>(
      `SELECT a.id, a.title, a.content, a.banner_url,
        a.author_id, u.name AS author_name, u.email AS author_email,
        a.published_at, a.updated_at
       FROM articles a
       INNER JOIN users u ON u.id = a.author_id
       WHERE a.id = ?`,
      [result.insertId]
    );

    res.status(201).json({
      message: "Artigo criado com sucesso.",
      article: articles[0],
    });
  } catch (error) {
    console.error("Erro ao criar artigo:", error);
    res.status(500).json({ message: "Erro interno do servidor." });
  }
}

export async function updateArticle(
  req: Request & { userId?: number },
  res: Response
): Promise<void> {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    const userId = req.userId;

    // Verifica se o artigo existe e pertence ao usuário
    const [existing] = await pool.query<ArticleRow[]>(
      "SELECT * FROM articles WHERE id = ?",
      [id]
    );

    if (existing.length === 0) {
      res.status(404).json({ message: "Artigo não encontrado." });
      return;
    }

    if (existing[0].author_id !== userId) {
      res.status(403).json({ message: "Você não tem permissão para editar este artigo." });
      return;
    }

    // Se veio nova imagem, apaga a antiga
    let bannerUrl = existing[0].banner_url;
    if (req.file) {
      if (bannerUrl) {
        const oldPath = path.resolve(__dirname, "..", "..", bannerUrl.replace(/^\//, ""));
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      bannerUrl = `/uploads/${req.file.filename}`;
    }

    await pool.query(
      `UPDATE articles SET title = ?, content = ?, banner_url = ?, updated_at = NOW()
       WHERE id = ?`,
      [title || existing[0].title, content || existing[0].content, bannerUrl, id]
    );

    const [updated] = await pool.query<ArticleRow[]>(
      `SELECT a.id, a.title, a.content, a.banner_url,
        a.author_id, u.name AS author_name, u.email AS author_email,
        a.published_at, a.updated_at
       FROM articles a
       INNER JOIN users u ON u.id = a.author_id
       WHERE a.id = ?`,
      [id]
    );

    res.json({ message: "Artigo atualizado com sucesso.", article: updated[0] });
  } catch (error) {
    console.error("Erro ao atualizar artigo:", error);
    res.status(500).json({ message: "Erro interno do servidor." });
  }
}

export async function deleteArticle(
  req: Request & { userId?: number },
  res: Response
): Promise<void> {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const [existing] = await pool.query<ArticleRow[]>(
      "SELECT * FROM articles WHERE id = ?",
      [id]
    );

    if (existing.length === 0) {
      res.status(404).json({ message: "Artigo não encontrado." });
      return;
    }

    if (existing[0].author_id !== userId) {
      res.status(403).json({ message: "Você não tem permissão para deletar este artigo." });
      return;
    }

    // Remove imagem do disco se existir
    if (existing[0].banner_url) {
      const imagePath = path.resolve(
        __dirname, "..", "..",
        existing[0].banner_url.replace(/^\//, "")
      );
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }

    await pool.query("DELETE FROM articles WHERE id = ?", [id]);

    res.json({ message: "Artigo removido com sucesso." });
  } catch (error) {
    console.error("Erro ao deletar artigo:", error);
    res.status(500).json({ message: "Erro interno do servidor." });
  }
}
