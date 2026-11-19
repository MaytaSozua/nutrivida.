import "dotenv/config";
import express from "express";
import db from "./database.js";

const app = express();
const PORT = process.env.PORT || 3000;

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
      `SELECT id_categoria, nome, descricao, ativo
       FROM categoria
       ORDER BY nome`,
    );

    res.json(categorias);
  } catch (erro) {
    console.error("Erro ao consultar categorias:", erro);

    res.status(500).json({
      erro: "Não foi possível consultar as categorias.",
    });
  }
});

// Lista os doadores cadastrados no MySQL
app.get("/api/doadores", async (req, res) => {
  try {
    const [doadores] = await db.query(
      `SELECT
        id_doador,
        nome,
        cpf,
        telefone,
        rua,
        numero,
        bairro,
        cidade
       FROM doador
       ORDER BY nome`,
    );

    res.json(doadores);
  } catch (erro) {
    console.error("Erro ao consultar doadores:", erro);

    res.status(500).json({
      erro: "Não foi possível consultar os doadores.",
    });
  }
});

// Cadastra um novo doador
app.post("/api/doadores", async (req, res) => {
  try {
    const { nome, cpf, telefone, rua, numero, bairro, cidade } = req.body;

    if (!nome || !cpf || !telefone || !rua || !numero || !bairro || !cidade) {
      return res.status(400).json({
        erro: "Todos os campos do doador são obrigatórios.",
      });
    }

    const [resultado] = await db.query(
      `INSERT INTO doador
       (nome, cpf, telefone, rua, numero, bairro, cidade)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [nome, cpf, telefone, rua, numero, bairro, cidade],
    );

    res.status(201).json({
      mensagem: "Doador cadastrado com sucesso!",
      id_doador: resultado.insertId,
    });
  } catch (erro) {
    console.error("Erro ao cadastrar doador:", erro);

    if (erro.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        erro: "Já existe um doador cadastrado com esse CPF.",
      });
    }

    res.status(500).json({
      erro: "Não foi possível cadastrar o doador.",
    });
  }
});

// Edita os dados de um doador
app.put("/api/doadores/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        erro: "Identificador do doador inválido.",
      });
    }

    const { nome, cpf, telefone, rua, numero, bairro, cidade } = req.body;

    if (!nome || !cpf || !telefone || !rua || !numero || !bairro || !cidade) {
      return res.status(400).json({
        erro: "Todos os campos do doador são obrigatórios.",
      });
    }

    const [resultado] = await db.query(
      `UPDATE doador
       SET nome = ?,
           cpf = ?,
           telefone = ?,
           rua = ?,
           numero = ?,
           bairro = ?,
           cidade = ?
       WHERE id_doador = ?`,
      [nome, cpf, telefone, rua, numero, bairro, cidade, id],
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        erro: "Doador não encontrado.",
      });
    }

    res.json({
      mensagem: "Doador atualizado com sucesso!",
    });
  } catch (erro) {
    console.error("Erro ao editar doador:", erro);

    if (erro.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        erro: "Já existe outro doador cadastrado com esse CPF.",
      });
    }

    res.status(500).json({
      erro: "Não foi possível atualizar o doador.",
    });
  }
});

// Exclui um doador
app.delete("/api/doadores/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        erro: "Identificador do doador inválido.",
      });
    }

    const [resultado] = await db.query("DELETE FROM doador WHERE id_doador = ?", [id]);

    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        erro: "Doador não encontrado.",
      });
    }

    res.json({
      mensagem: "Doador excluído com sucesso!",
    });
  } catch (erro) {
    console.error("Erro ao excluir doador:", erro);

    if (erro.code === "ER_ROW_IS_REFERENCED_2") {
      return res.status(409).json({
        erro: "Não é possível excluir este doador porque existem doações vinculadas a ele.",
      });
    }

    res.status(500).json({
      erro: "Não foi possível excluir o doador.",
    });
  }
});

// Registra uma nova doação
app.post("/api/doacoes", async (req, res) => {
  try {
    const { id_doador, id_categoria, quantidade, data_doacao, descricao } = req.body;

    const idDoador = Number(id_doador);
    const idCategoria = Number(id_categoria);
    const qtd = Number(quantidade);

    if (
      !Number.isInteger(idDoador) ||
      idDoador <= 0 ||
      !Number.isInteger(idCategoria) ||
      idCategoria <= 0 ||
      !Number.isInteger(qtd) ||
      qtd <= 0 ||
      typeof data_doacao !== "string" ||
      !/^\d{4}-\d{2}-\d{2}$/.test(data_doacao) ||
      typeof descricao !== "string" ||
      !descricao.trim()
    ) {
      return res.status(400).json({
        erro: "Preencha todos os campos da doação corretamente.",
      });
    }

    const [resultado] = await db.query(
      `INSERT INTO doacao
       (id_doador, id_categoria, quantidade, data_doacao, descricao)
       VALUES (?, ?, ?, ?, ?)`,
      [idDoador, idCategoria, qtd, data_doacao, descricao.trim()],
    );

    res.status(201).json({
      mensagem: "Doação registrada com sucesso!",
      id_doacao: resultado.insertId,
    });
  } catch (erro) {
    console.error("Erro ao registrar doação:", erro);

    if (erro.code === "ER_NO_REFERENCED_ROW_2") {
      return res.status(400).json({
        erro: "O doador ou a categoria selecionada não existe.",
      });
    }

    res.status(500).json({
      erro: "Não foi possível registrar a doação.",
    });
  }
});

// Lista as doações cadastradas
app.get("/api/doacoes", async (req, res) => {
  try {
    const [doacoes] = await db.query(
      `SELECT
        doacao.id_doacao,
        doacao.id_doador,
        doador.nome AS nome_doador,
        doacao.id_categoria,
        categoria.nome AS nome_categoria,
        doacao.quantidade,
        doacao.data_doacao,
        doacao.descricao,
        doacao.status
       FROM doacao
       INNER JOIN doador
         ON doacao.id_doador = doador.id_doador
       INNER JOIN categoria
         ON doacao.id_categoria = categoria.id_categoria
       ORDER BY doacao.data_doacao DESC, doacao.id_doacao DESC`,
    );

    res.json(doacoes);
  } catch (erro) {
    console.error("Erro ao consultar doações:", erro);

    res.status(500).json({
      erro: "Não foi possível consultar as doações.",
    });
  }
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}`);
});
