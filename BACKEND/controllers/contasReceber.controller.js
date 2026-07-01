import pool from "../db.js";

export async function listarContasReceber(req, res) {
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
      SELECT *
      FROM contas_receber
      WHERE empresa_id = $1
      ORDER BY vencimento DESC
    `, [empresa_id]);

    res.json(resultado.rows);
  } catch (erro) {
    console.error("Erro ao listar contas a receber:", erro);
    res.status(500).json({ erro: erro.message });
  }
}

export async function cadastrarContaReceber(req, res) {
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
    const { descricao, valor, vencimento } = req.body;

    const resultado = await pool.query(
      `
      INSERT INTO contas_receber (
        empresa_id,
        cliente_id,
        descricao,
        valor,
        vencimento,
        status
      )
      VALUES ($1,NULL,$2,$3,$4,'Pendente')
      RETURNING *
      `,
      [
        empresa_id,
        descricao,
        valor,
        vencimento || null
      ]
    );

    res.status(201).json(resultado.rows[0]);
  } catch (erro) {
    console.error("Erro ao cadastrar conta a receber:", erro);
    res.status(500).json({ erro: erro.message });
  }
}

export async function receberConta(req, res) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const { id } = req.params;
    const empresa_id =
  req.headers["x-empresa-id"] ||
  req.body.empresa_id ||
  req.query.empresa_id;

if (!empresa_id) {
  await client.query("ROLLBACK");
  return res.status(400).json({
    erro: "empresa_id não informado."
  });
}
    const conta = await client.query(
      `
      UPDATE contas_receber
      SET status = 'Recebido',
          data_pagamento = CURRENT_DATE
      WHERE id = $1 AND empresa_id = $2
      RETURNING *
      `,
      [id, empresa_id]
    );

    if (conta.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ erro: "Conta não encontrada." });
    }

    await client.query(
      `
      INSERT INTO fluxo_caixa (
        empresa_id,
        tipo,
        descricao,
        valor,
        data_movimento
      )
      VALUES ($1,'Entrada',$2,$3,NOW())
      `,
      [
        empresa_id,
        conta.rows[0].descricao,
        conta.rows[0].valor
      ]
    );

    await client.query("COMMIT");
    res.json(conta.rows[0]);
  } catch (erro) {
    await client.query("ROLLBACK");
    console.error("Erro ao receber conta:", erro);
    res.status(500).json({ erro: erro.message });
  } finally {
    client.release();
  }
}