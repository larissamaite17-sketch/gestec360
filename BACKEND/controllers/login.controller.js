import pool from "../db.js";
import bcrypt from "bcrypt";

export async function fazerLogin(req, res) {
  try {
    const { login, senha } = req.body;

    if (!login || !senha) {
      return res.status(400).json({ erro: "Informe o login e a senha." });
    }

    // ==========================\
    // LOGIN DA EMPRESA
    // ==========================\
    const empresa = await pool.query(
      `SELECT * FROM empresas WHERE login = $1 OR email = $1 LIMIT 1`,
      [login]
    );

    if (empresa.rows.length > 0) {
      const dadosEmpresa = empresa.rows[0];

      if (dadosEmpresa.status !== "Ativo") {
        return res.status(403).json({
          erro: "Seu acesso está bloqueado. Por favor, entre em contato com o suporte para regularizar."
        });
      }

      let senhaCorreta = false;
      if (dadosEmpresa.senha.startsWith("$2")) {
        senhaCorreta = await bcrypt.compare(senha, dadosEmpresa.senha);
      } else {
        senhaCorreta = senha === dadosEmpresa.senha;
      }

      if (!senhaCorreta) {
        return res.status(401).json({ erro: "Login ou senha inválidos." });
      }

      return res.json({
        sucesso: true,
        tipo: "empresa",
        usuario: {
          id: dadosEmpresa.id,
          empresa_id: dadosEmpresa.id,
          nome: dadosEmpresa.nome,
          login: dadosEmpresa.login,
          perfil: "Administrador"
        }
      });
    }

    // ==========================\
    // LOGIN DO FUNCIONÁRIO
    // ==========================\
    const usuario = await pool.query(
      `SELECT * FROM usuarios WHERE login = $1 OR email = $1 LIMIT 1`,
      [login]
    );

    if (usuario.rows.length > 0) {
      const dadosUsuario = usuario.rows[0];

      if (dadosUsuario.status !== "Ativo") {
        return res.status(403).json({
          erro: "Seu usuário está desativado/bloqueado. Por favor, entre em contato com o administrador."
        });
      }

      const senhaCorreta = await bcrypt.compare(senha, dadosUsuario.senha);

      if (!senhaCorreta) {
        return res.status(401).json({ erro: "Login ou senha inválidos." });
      }

      return res.json({
        sucesso: true,
        tipo: "usuario",
        usuario: {
          id: dadosUsuario.id,
          empresa_id: dadosUsuario.empresa_id,
          nome: dadosUsuario.nome,
          login: dadosUsuario.login,
          perfil: dadosUsuario.tipo
        }
      });
    }

    return res.status(401).json({ erro: "Login ou senha inválidos." });

  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: erro.message });
  }
}