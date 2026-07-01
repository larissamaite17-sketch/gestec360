import pool from "../db.js";

// LISTAR CATEGORIAS
export const listarCategorias = async (req, res) => {
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
      "SELECT * FROM categorias WHERE empresa_id = $1 ORDER BY nome ASC",
      [empresa_id]
    );
    res.json(resultado.rows);
  } catch (err) {
    console.error("Erro ao listar categorias:", err.message);
    res.status(500).json({ erro: "Erro interno ao listar categorias." });
  }
};

// CADASTRAR CATEGORIA
export const cadastrarCategoria = async (req, res) => {
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
    const { nome, categoria } = req.body;
    const nomeCategoria = nome || categoria;

    if (!nomeCategoria || !nomeCategoria.trim()) {
      return res.status(400).json({ erro: "O nome da categoria é obrigatório." });
    }

    const novaCategoria = await pool.query(
      "INSERT INTO categorias (nome, empresa_id) VALUES ($1, $2) RETURNING *",
      [nomeCategoria.trim(), empresa_id]
    );

    res.status(201).json(novaCategoria.rows[0]);
  } catch (err) {
    console.error("Erro ao cadastrar categoria:", err.message);
    res.status(500).json({ erro: "Erro ao salvar a categoria no banco de dados." });
  }
};