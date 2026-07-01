import pool from "../db.js";

export async function listarFluxoCaixa(req, res) {
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
      SELECT
        id,
        empresa_id,
        tipo,
        descricao,
        valor,
        data_movimento
      FROM fluxo_caixa
      WHERE empresa_id = $1
      ORDER BY data_movimento DESC
    `, [empresa_id]);

    res.json(resultado.rows);
  } catch (erro) {
    console.error("Erro ao listar fluxo de caixa:", erro);
    res.status(500).json({ erro: erro.message });
  }
}