import express from "express";
import cors  from "cors";
import path from "path";
import dotenv from "dotenv";

import authRoutes from "./routes/auth";
import articleRoutes from "./routes/articles";

dotenv.config();

const app = express()
const PORT = process.env.PORT || 3333;

// middlewares globais
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//servir imagens estáticas da pasta uploads
app.use("/uploads", express.static(path.resolve(__dirname, "..", "uploads")));

// rotas
app.use("/auth", authRoutes);
app.use("/articles", articleRoutes)

// Health check
app.get("/", (_req, res) =>{
    res.json({ message: "Mind Blog API está rodando!"});
});

app.listen(PORT, () => {
    console.log(`\n Server rodando em http:localhost:${PORT}`)
})