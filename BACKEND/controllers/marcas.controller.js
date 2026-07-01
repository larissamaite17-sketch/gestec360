import pool from "../db.js";

// LISTAR MARCAS
export const listarMarcas = async (req, res) => {
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
      "SELECT * FROM marcas WHERE empresa_id = $1 ORDER BY nome ASC",
      [empresa_id]
    );
    res.json(resultado.rows);
  } catch (err) {
    console.error("Erro ao listar marcas:", err.message);
    res.status(500).json({ erro: "Erro interno ao listar marcas." });
  }
};

// CADASTRAR MARCA
export const cadastrarMarca = async (req, res) => {
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
    const { nome, marca } = req.body;
    const nomeMarca = nome || marca;

    if (!nomeMarca || !nomeMarca.trim()) {
      return res.status(400).json({ erro: "O nome da marca é obrigatório." });
    }

    const novaMarca = await pool.query(
      "INSERT INTO marcas (nome, empresa_id) VALUES ($1, $2) RETURNING *",
      [nomeMarca.trim(), empresa_id]
    );

    res.status(201).json(novaMarca.rows[0]);
  } catch (err) {
    console.error("Erro ao cadastrar marca:", err.message);
    res.status(500).json({ erro: "Erro ao salvar a marca no banco de dados." });
  }
};