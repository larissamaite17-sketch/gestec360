import pool from "../db.js";

export async function listarGrupos(req, res) {
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
      "SELECT * FROM grupos_complementos WHERE empresa_id = $1 AND ativo = true ORDER BY nome",
      [empresa_id]
    );

    res.json(resultado.rows);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
}

export async function cadastrarGrupo(req, res) {
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
    const { nome } = req.body;

    if (!nome) {
      return res.status(400).json({ erro: "Nome do grupo é obrigatório." });
    }

    const resultado = await pool.query(
      `
      INSERT INTO grupos_complementos
      (empresa_id, nome, ativo)
      VALUES
      ($1, $2, true)
      RETURNING *
      `,
      [empresa_id, nome]
    );

    res.status(201).json(resultado.rows[0]);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
}

export async function editarGrupo(req, res) {
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
    const { nome } = req.body;

    if (!nome) {
      return res.status(400).json({ erro: "Nome do grupo é obrigatório." });
    }

    const resultado = await pool.query(
      `
      UPDATE grupos_complementos
      SET nome = $1
      WHERE id = $2 AND empresa_id = $3
      RETURNING *
      `,
      [nome, id, empresa_id]
    );

    res.json(resultado.rows[0]);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
}

export async function excluirGrupo(req, res) {
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

    await pool.query(
      `
      UPDATE grupos_complementos
      SET ativo = false
      WHERE id = $1 AND empresa_id = $2
      `,
      [id, empresa_id]
    );

    res.json({ mensagem: "Grupo excluído com sucesso." });
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
}