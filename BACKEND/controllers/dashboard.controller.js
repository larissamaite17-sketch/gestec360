import pool from "../db.js";

export async function resumoDashboard(req, res) {
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
    const produtos = await pool.query(`
      SELECT
        COUNT(*) AS total_produtos,
        COALESCE(SUM(estoque),0) AS quantidade_estoque,
        COUNT(*) FILTER (
          WHERE estoque <= estoque_minimo
        ) AS estoque_baixo
      FROM produtos
      WHERE empresa_id = $1
    `, [empresa_id]);

    const produtosBaixo = await pool.query(`
      SELECT
        id,
        identificacao,
        nome,
        estoque,
        estoque_minimo,
        unidade
      FROM produtos
      WHERE empresa_id = $1
      AND estoque <= estoque_minimo
      ORDER BY estoque ASC
      LIMIT 5
    `, [empresa_id]);

    const vendas = await pool.query(`
      SELECT
        COUNT(*) AS total_vendas,
        COALESCE(SUM(total),0) AS faturamento
      FROM vendas
      WHERE empresa_id = $1
      AND status_venda <> 'Cancelada'
    `, [empresa_id]);

    const clientes = await pool.query(`
      SELECT COUNT(*) AS total_clientes
      FROM clientes
      WHERE empresa_id = $1
    `, [empresa_id]);

    res.json({
      totalProdutos: Number(produtos.rows[0].total_produtos),
      quantidadeEstoque: Number(produtos.rows[0].quantidade_estoque),
      quantidadeEstoqueBaixo: Number(produtos.rows[0].estoque_baixo),
      estoqueBaixo: produtosBaixo.rows,

      totalVendas: Number(vendas.rows[0].total_vendas),
      faturamento: Number(vendas.rows[0].faturamento),

      totalClientes: Number(clientes.rows[0].total_clientes)
    });

  } catch (erro) {
    console.error("Erro no dashboard:", erro);
    res.status(500).json({ erro: erro.message });
  }
}