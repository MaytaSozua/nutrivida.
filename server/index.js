import "dotenv/config";
import express from "express";
import db from "./database.js";

const app = express();

app.use(express.json());

// Verifica se a API está funcionando
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    app: "NutriVida",
    hora: new Date().toISOString(),
  });
});

// Lista as categorias cadastradas no MySQL
app.get("/api/categorias", async (req, res) => {
  try {
    const [categorias] = await db.query(
      "SELECT id_categoria, nome, descricao, ativo FROM categoria ORDER BY nome",
    );

    res.json(categorias);
  } catch (erro) {
    console.error("Erro ao consultar categorias:", erro.message);

    res.status(500).json({
      erro: "Não foi possível consultar as categorias.",
    });
  }
});

const PORT = process.env.PORT || 3000;
// Cadastra um novo doador
app.post("/api/doadores", async (req, res) => {
  try {
    const { nome, tipo, telefone, email } = req.body;

    if (!nome || !nome.trim()) {
      return res.status(400).json({
        erro: "O nome do doador é obrigatório.",
      });
    }

    const [resultado] = await db.query(
      `INSERT INTO doador (nome, tipo, telefone, email)
       VALUES (?, ?, ?, ?)`,
      [nome.trim(), tipo || null, telefone || null, email || null],
    );

    res.status(201).json({
      mensagem: "Doador cadastrado com sucesso!",
      id_doador: resultado.insertId,
    });
  } catch (erro) {
    console.error("Erro ao cadastrar doador:", erro);

    res.status(500).json({
      erro: "Não foi possível cadastrar o doador.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}`);
});
