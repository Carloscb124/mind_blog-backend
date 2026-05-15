import { Router } from "express";
import {
  listArticles,
  getArticle,
  createArticle,
  updateArticle,
  deleteArticle,
} from "../controllers/articleController";
import { authMiddleware } from "../middlewares/auth";
import { upload } from "../middlewares/upload";

const router = Router();

// Rotas públicas
router.get("/", listArticles);
router.get("/:id", getArticle);

// Rotas protegidas
router.post("/", authMiddleware, upload.single("banner"), createArticle);
router.put("/:id", authMiddleware, upload.single("banner"), updateArticle);
router.delete("/:id", authMiddleware, deleteArticle);

export default router;
