import pool from "../db.js";

export async function relatorioVendas(req, res) {
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
        numero_pedido,
        data_venda,
        forma_pagamento,
        status_pagamento,
        status_venda,
        total,
        c.nome AS cliente
      FROM vendas v
      LEFT JOIN clientes c
      ON c.id = v.cliente_id
      WHERE v.empresa_id = $1
      ORDER BY data_venda DESC
    `, [empresa_id]);

    res.json(resultado.rows);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: erro.message });
  }
}

export async function relatorioFinanceiro(req, res) {
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
    const receitas = await pool.query(`
      SELECT
        data_venda AS data,
        'Receita' AS tipo,
        total AS valor,
        numero_pedido AS descricao
      FROM vendas
      WHERE empresa_id = $1
      AND status_pagamento = 'Pago'
      AND status_venda <> 'Cancelada'
    `, [empresa_id]);

    const despesas = await pool.query(`
      SELECT
        COALESCE(data_pagamento, vencimento) AS data,
        'Despesa' AS tipo,
        valor,
        descricao
      FROM contas_pagar
      WHERE empresa_id = $1
      AND status = 'Pago'
    `, [empresa_id]);

    res.json({
      receitas: receitas.rows,
      despesas: despesas.rows
    });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: erro.message });
  }
}

export async function relatorioProdutos(req, res) {
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
        p.id,
        p.nome,
        p.estoque,
        p.preco_venda,
        COALESCE(SUM(vi.quantidade), 0) AS quantidade_vendida,
        COALESCE(SUM(vi.total), 0) AS faturamento
      FROM produtos p
      LEFT JOIN venda_itens vi
        ON vi.produto_id = p.id
      LEFT JOIN vendas v
        ON v.id = vi.venda_id
        AND v.empresa_id = $1
        AND v.status_venda <> 'Cancelada'
      WHERE p.empresa_id = $1
      GROUP BY
        p.id,
        p.nome,
        p.estoque,
        p.preco_venda
      ORDER BY quantidade_vendida DESC
    `, [empresa_id]);

    res.json(resultado.rows);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: erro.message });
  }
}