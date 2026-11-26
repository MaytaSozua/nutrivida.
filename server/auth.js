import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "./database.js";

const router = Router();

// Realiza o login do utilizador
router.post("/login", async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (typeof email !== "string" || !email.trim() || typeof senha !== "string" || !senha) {
      return res.status(400).json({
        erro: "Informe o e-mail e a senha.",
      });
    }

    // Busca o utilizador e sua senha criptografada
    const [usuarios] = await db.query(
      `SELECT
        id_usuario,
        nome,
        email,
        senha_hash,
        perfil
       FROM usuario
       WHERE email = ?`,
      [email.trim()],
    );

    const usuario = usuarios[0];

    // Compara a senha digitada com o hash armazenado
    const senhaConfere = usuario && (await bcrypt.compare(senha, usuario.senha_hash));

    if (!senhaConfere) {
      return res.status(401).json({
        erro: "E-mail ou senha inválidos.",
      });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET não configurado no arquivo .env.");
    }

    // Gera o token JWT
    const token = jwt.sign(
      {
        id: usuario.id_usuario,
        nome: usuario.nome,
        perfil: usuario.perfil,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "8h",
      },
    );

    return res.json({
      mensagem: "Login realizado com sucesso!",
      token,
      usuario: {
        nome: usuario.nome,
        email: usuario.email,
        perfil: usuario.perfil,
      },
    });
  } catch (erro) {
    console.error("Erro ao realizar login:", erro);

    return res.status(500).json({
      erro: "Não foi possível realizar o login.",
    });
  }
});

// Verifica se o token enviado é válido
export function autenticar(req, res, next) {
  const autorizacao = req.headers.authorization;

  if (!autorizacao || !autorizacao.startsWith("Bearer ")) {
    return res.status(401).json({
      erro: "Acesso não autorizado. Faça login.",
    });
  }

  const token = autorizacao.split(" ")[1];

  try {
    const dadosUsuario = jwt.verify(token, process.env.JWT_SECRET);

    req.usuario = dadosUsuario;

    return next();
  } catch (erro) {
    return res.status(401).json({
      erro: "Token inválido ou expirado. Faça login novamente.",
    });
  }
}

export default router;
