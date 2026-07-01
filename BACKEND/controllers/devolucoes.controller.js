import pool from "../db.js";

export async function listarDevolucoes(req, res) {
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
      SELECT *
      FROM devolucoes
      WHERE empresa_id = $1
      ORDER BY criado_em DESC
      `,
      [empresa_id]
    );

    res.json(resultado.rows);
  } catch (erro) {
    res.status(500).json({
      erro: erro.message
    });
  }
}

export async function cadastrarDevolucao(req, res) {
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
    const {
      venda_id,
      numero_pedido,
      produto_id,
      produto_nome,
      quantidade,
      valor,
      motivo
    } = req.body;

    const resultado = await pool.query(
      `
      INSERT INTO devolucoes
      (
        empresa_id,
        venda_id,
        numero_pedido,
        produto_id,
        produto_nome,
        quantidade,
        valor,
        motivo
      )
      VALUES
      (
        $1, $2, $3, $4, $5, $6, $7, $8
      )
      RETURNING *
      `,
      [
        empresa_id,
        venda_id,
        numero_pedido,
        produto_id,
        produto_nome,
        quantidade,
        valor,
        motivo
      ]
    );

    res.status(201).json(resultado.rows[0]);
  } catch (erro) {
    res.status(500).json({
      erro: erro.message
    });
  }
}