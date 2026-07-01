import pool from "../db.js";

export const listarComplementos = async (req, res) => {
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
    const resultado = await pool.query(`
      SELECT c.*, g.nome AS grupo 
      FROM complementos c
      LEFT JOIN grupos g ON c.grupo_id = g.id
      WHERE c.empresa_id = $1
      ORDER BY c.nome ASC
    `, [empresa_id]);
    res.json(resultado.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erro no servidor");
  }
};

export const cadastrarComplemento = async (req, res) => {
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
    const { nome, grupo_id, preco } = req.body;

    const novo = await pool.query(
      "INSERT INTO complementos (nome, grupo_id, preco, empresa_id) VALUES ($1, $2, $3, $4) RETURNING *",
      [nome.trim(), grupo_id, preco, empresa_id]
    );
    res.status(201).json(novo.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ erro: "Erro ao salvar complemento" });
  }
};

export const editarComplemento = async (req, res) => {
  try {
    const { id } = req.params;
    const empresa_id =
  req.headers["x-empresa-id"] ||
  req.body.empresa_id ||
  req.query.empresa_id;

if (!empresa_id) {
  return res.status(400).json({
    erro: "empresa_id não informado."
  });
}
    const { nome, grupo_id, preco } = req.body;

    const atualizado = await pool.query(
      "UPDATE complementos SET nome = $1, grupo_id = $2, preco = $3 WHERE id = $4 AND empresa_id = $5 RETURNING *",
      [nome.trim(), grupo_id, preco, id, empresa_id]
    );
    res.json(atualizado.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ erro: "Erro ao editar complemento" });
  }
};

export const excluirComplemento = async (req, res) => {
  try {
    const { id } = req.params;
    const empresa_id =
  req.headers["x-empresa-id"] ||
  req.query.empresa_id ||
  req.body?.empresa_id;

if (!empresa_id) {
  return res.status(400).json({
    erro: "empresa_id não informado."
  });
}

    await pool.query("DELETE FROM complementos WHERE id = $1 AND empresa_id = $2", [id, empresa_id]);
    res.sendStatus(204);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ erro: "Erro ao eliminar complemento" });
  }
};