import pool from "../db.js";
import bcrypt from "bcrypt";

export async function listarUsuarios(req, res) {
  try {
    const empresa_id =
  req.headers["x-empresa-id"] ||
  req.query.empresa_id ||
  req.body?.empresa_id;

if (!empresa_id) {
  return res.status(400).json({
    erro: "empresa_id não informado."
  });
}
    const resultado = await pool.query(
      `
      SELECT
        id,
        nome,
        login,
        email,
        tipo,
        status
      FROM usuarios
      WHERE empresa_id = $1
      ORDER BY nome
      `,
      [empresa_id]
    );

    res.json(resultado.rows);
  } catch (erro) {
    console.error("Erro ao listar usuários:", erro);
    res.status(500).json({ erro: erro.message });
  }
}

export async function cadastrarUsuario(req, res) {
  try {
   const empresa_id =
  req.headers["x-empresa-id"] ||
  req.body.empresa_id ||
  req.query.empresa_id;

if (!empresa_id) {
  return res.status(400).json({
    erro: "empresa_id não informado."
  });
}
    const { nome, login, email, senha, tipo } = req.body;

    if (!nome || !login || !senha) {
      return res.status(400).json({ erro: "Preencha os campos obrigatórios." });
    }

    const loginExiste = await pool.query(
      `
      SELECT id
      FROM usuarios
      WHERE empresa_id = $1 AND login = $2
      `,
      [empresa_id, login]
    );

    if (loginExiste.rows.length > 0) {
      return res.status(400).json({ erro: "Já existe um usuário com este login nesta empresa." });
    }

    if (email && email.trim() !== "") {
      const emailExiste = await pool.query(
        `
        SELECT id
        FROM usuarios
        WHERE empresa_id = $1 AND email = $2
        `,
        [empresa_id, email]
      );

      if (emailExiste.rows.length > 0) {
        return res.status(400).json({ erro: "Este e-mail já está cadastrado nesta empresa." });
      }
    }

    const senhaCriptografada = await bcrypt.hash(senha, 10);

    const resultado = await pool.query(
      `
      INSERT INTO usuarios
      (
        empresa_id,
        nome,
        login,
        email,
        senha,
        tipo,
        status
      )
      VALUES ($1, $2, $3, $4, $5, $6, 'Ativo')
      RETURNING id, nome, login, email, tipo, status
      `,
      [empresa_id, nome, login, email || null, senhaCriptografada, tipo || "Caixa"]
    );

    res.status(201).json(resultado.rows[0]);
  } catch (erro) {
    console.error("Erro ao cadastrar usuário:", erro);
    res.status(500).json({ erro: erro.message });
  }
}

export async function alterarStatusUsuario(req, res) {
  try {
    const empresa_id =
  req.headers["x-empresa-id"] ||
  req.body.empresa_id ||
  req.query.empresa_id;

if (!empresa_id) {
  return res.status(400).json({
    erro: "empresa_id não informado."
  });
}
    const { id } = req.params;

    const usuario = await pool.query(
      `
      SELECT status
      FROM usuarios
      WHERE id = $1 AND empresa_id = $2
      `,
      [id, empresa_id]
    );

    if (usuario.rows.length === 0) {
      return res.status(404).json({ erro: "Usuário não encontrado." });
    }

    const novoStatus = usuario.rows[0].status === "Ativo" ? "Inativo" : "Ativo";

    const resultado = await pool.query(
      `
      UPDATE usuarios
      SET status = $1
      WHERE id = $2 AND empresa_id = $3
      RETURNING id, nome, login, email, tipo, status
      `,
      [novoStatus, id, empresa_id]
    );

    res.json(resultado.rows[0]);
  } catch (erro) {
    console.error("Erro ao alterar status:", erro);
    res.status(500).json({ erro: erro.message });
  }
}

export async function excluirUsuario(req, res) {
  try {
  const empresa_id =
  req.headers["x-empresa-id"] ||
  req.query.empresa_id ||
  req.body?.empresa_id;

if (!empresa_id) {
  return res.status(400).json({
    erro: "empresa_id não informado."
  });
}
    const { id } = req.params;

    const resultado = await pool.query(
      `
      DELETE FROM usuarios
      WHERE id = $1 AND empresa_id = $2
      RETURNING id
      `,
      [id, empresa_id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({ erro: "Usuário não encontrado ou não pertence à sua empresa." });
    }

    res.json({ mensagem: "Usuário excluído com sucesso." });
  } catch (erro) {
    console.error("Erro ao excluir usuário:", erro);
    res.status(500).json({ erro: erro.message });
  }
}