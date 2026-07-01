import pool from "../db.js";

export async function listarVendas(req, res) {
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
    const vendas = await pool.query(`
      SELECT 
        v.*,
        c.nome AS cliente
      FROM vendas v
      LEFT JOIN clientes c
        ON c.id = v.cliente_id
      WHERE v.empresa_id = $1
      ORDER BY v.data_venda DESC
    `, [empresa_id]);

    for (const venda of vendas.rows) {
      const itens = await pool.query(
        `
        SELECT
          vi.*,
          p.nome
        FROM venda_itens vi
        JOIN produtos p
          ON p.id = vi.produto_id
        WHERE vi.venda_id = $1
        `,
        [venda.id]
      );

      venda.itens = itens.rows;
    }

    res.json(vendas.rows);
  } catch (erro) {
    console.error("Erro ao listar vendas:", erro);
    res.status(500).json({ erro: erro.message });
  }
}

export async function cadastrarVenda(req, res) {
  const client = await pool.connect();

  try {
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
    await client.query("BEGIN");

    const {
      numero,
      cliente: nomeCliente,
      tipoVenda,
      formaPagamento,
      statusPagamento,
      subtotal,
      desconto,
      taxaEntrega,
      total,
      valorRecebido,
      troco,
      observacao,
      cpfNota,
      itens
    } = req.body;

    let clienteId = null;

    if (nomeCliente && nomeCliente.trim()) {
      const clienteExistente = await client.query(
        `
        SELECT id
        FROM clientes
        WHERE empresa_id = $1
        AND LOWER(nome) = LOWER($2)
        LIMIT 1
        `,
        [empresa_id, nomeCliente.trim()]
      );

      if (clienteExistente.rows.length > 0) {
        clienteId = clienteExistente.rows[0].id;

        await client.query(
          `
          UPDATE clientes
          SET
            cpf = COALESCE($1, cpf),
            ultima_compra = CURRENT_DATE,
            quantidade_compras = COALESCE(quantidade_compras, 0) + 1,
            total_gasto = COALESCE(total_gasto, 0) + $2
          WHERE id = $3 AND empresa_id = $4
          `,
          [cpfNota || null, total, clienteId, empresa_id]
        );
      } else {
        const novoCliente = await client.query(
          `
          INSERT INTO clientes (
            empresa_id,
            nome,
            cpf,
            ultima_compra,
            quantidade_compras,
            total_gasto,
            ativo
          )
          VALUES ($1,$2,$3,CURRENT_DATE,1,$4,true)
          RETURNING id
          `,
          [empresa_id, nomeCliente.trim(), cpfNota || null, total]
        );

        clienteId = novoCliente.rows[0].id;
      }
    }

    const venda = await client.query(
      `
      INSERT INTO vendas (
        empresa_id,
        cliente_id,
        numero_pedido,
        data_venda,
        tipo_venda,
        forma_pagamento,
        status_pagamento,
        status_venda,
        cpf_nota,
        observacao,
        subtotal,
        desconto,
        taxa_entrega,
        total,
        valor_recebido,
        troco
      )
      VALUES (
        $1,$2,$3,NOW(),$4,$5,$6,'Concluída',$7,$8,$9,$10,$11,$12,$13,$14
      )
      RETURNING id;
      `,
      [
        empresa_id,
        clienteId,
        numero,
        tipoVenda,
        formaPagamento,
        statusPagamento,
        cpfNota,
        observacao,
        subtotal,
        desconto,
        taxaEntrega,
        total,
        valorRecebido,
        troco
      ]
    );

    const vendaId = venda.rows[0].id;

    if (statusPagamento === "Pago") {
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
        [empresa_id, `Venda #${numero}`, total]
      );
    }

    for (const item of itens || []) {
      await client.query(
        `
        INSERT INTO venda_itens (
          venda_id,
          produto_id,
          quantidade,
          valor_unitario,
          total
        )
        VALUES ($1,$2,$3,$4,$5)
        `,
        [
          vendaId,
          item.produtoId,
          item.quantidade,
          item.valor,
          item.valor * item.quantidade
        ]
      );

      await client.query(
        `
        UPDATE produtos
        SET estoque = estoque - $1
        WHERE id = $2 AND empresa_id = $3
        `,
        [item.quantidade, item.produtoId, empresa_id]
      );
    }

    await client.query("COMMIT");
    res.status(201).json({ sucesso: true });
  } catch (erro) {
    await client.query("ROLLBACK");
    console.error("Erro ao cadastrar venda:", erro);
    res.status(500).json({ erro: erro.message });
  } finally {
    client.release();
  }
}

export async function atualizarStatusVenda(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;
   const empresa_id =
  req.headers["x-empresa-id"] ||
  req.body.empresa_id ||
  req.query.empresa_id;

if (!empresa_id) {
  return res.status(400).json({
    erro: "empresa_id não informado."
  });
}
    if (!status) {
      return res.status(400).json({ erro: "Status é obrigatório." });
    }

    const resultado = await pool.query(
      `
      UPDATE vendas
      SET status_venda = $1
      WHERE id = $2 AND empresa_id = $3
      RETURNING *
      `,
      [status, id, empresa_id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({ erro: "Venda não encontrada." });
    }

    res.json(resultado.rows[0]);
  } catch (erro) {
    console.error("Erro ao atualizar status da venda:", erro);
    res.status(500).json({ erro: erro.message });
  }
}