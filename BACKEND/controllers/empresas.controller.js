import pool from "../db.js";
import bcrypt from "bcrypt";

export async function listarEmpresas(req, res) {
  try {
    const resultado = await pool.query(`
      SELECT
        id,
        nome,
        responsavel,
        telefone,
        email,
        login,
        status,
        criado_em
      FROM empresas
      ORDER BY nome
    `);
    res.json(resultado.rows);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: erro.message });
  }
}

export async function cadastrarEmpresa(req, res) {
  try {
    const { nome, responsavel, telefone, email, login, senha } = req.body;

    if (!nome || !responsavel || !login || !senha) {
      return res.status(400).json({ erro: "Preencha todos os campos obrigatórios." });
    }

    const existeLogin = await pool.query(
      `SELECT id FROM usuarios WHERE login = $1
UNION
SELECT id FROM empresas WHERE login = $1
LIMIT 1`,
      [login]
    );

    if (existeLogin.rows.length > 0) {
      return res.status(400).json({ erro: "Este login já está sendo utilizado." });
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    const empresa = await pool.query(
      `INSERT INTO empresas (nome, responsavel, telefone, email, login, senha, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'Ativo') RETURNING id`,
      [nome, responsavel, telefone, email, login, senhaHash]
    );

    const empresaId = empresa.rows[0].id;

    await pool.query(
      `INSERT INTO usuarios (empresa_id, nome, login, email, senha, tipo, status)
       VALUES ($1, $2, $3, $4, $5, 'Administrador', 'Ativo')`,
      [empresaId, responsavel, login, email, senhaHash]
    );

    res.status(201).json({ sucesso: true });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: erro.message });
  }
}

// NOVA FUNÇÃO: Bloquear / Liberar Empresa
export async function alterarStatusEmpresa(req, res) {
  try {
    const { id } = req.params;

    const buscaEmpresa = await pool.query(
      `SELECT status FROM empresas WHERE id = $1`,
      [id]
    );

    if (buscaEmpresa.rows.length === 0) {
      return res.status(404).json({ erro: "Empresa não encontrada." });
    }

    // Se estiver Ativo vira Bloqueado, se não, vira Ativo
    const novoStatus = buscaEmpresa.rows[0].status === "Ativo" ? "Bloqueado" : "Ativo";

    await pool.query(
      `UPDATE empresas SET status = $1 WHERE id = $2`,
      [novoStatus, id]
    );

    res.json({ sucesso: true, novoStatus });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: erro.message });
  }
}