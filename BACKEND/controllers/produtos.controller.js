import pool from "../db.js";

export async function listarProdutos(req, res) {

  console.log("=================================");
  console.log("QUERY:", req.query);
  console.log("HEADER:", req.headers["x-empresa-id"]);
  console.log("EMPRESA:", req.query.empresa_id || req.headers["x-empresa-id"]);
  console.log("=================================");

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
      "SELECT * FROM produtos WHERE empresa_id = $1 ORDER BY id DESC",
      [empresa_id]
    );

    res.json(resultado.rows);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
}

export async function cadastrarProduto(req, res) {
  try {
   const empresa_id_correto =
  req.headers["x-empresa-id"] ||
  req.body.empresa_id ||
  req.query.empresa_id;

if (!empresa_id_correto) {
  return res.status(400).json({
    erro: "empresa_id não informado."
  });
}
    const {
      identificacao,
      nome,
      marca,
      categoria,
      codigo_barras,
      preco_custo,
      preco_venda,
      preco_kg,
      tipo_venda,
      unidade,
      estoque,
      estoque_minimo,
      imagem
    } = req.body;

    const resultado = await pool.query(
      `INSERT INTO produtos (
        empresa_id,
        identificacao,
        codigo_barras,
        nome,
        marca,
        categoria,
        unidade,
        tipo_venda,
        preco_custo,
        preco_venda,
        preco_kg,
        estoque,
        estoque_minimo,
        imagem
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14
      ) RETURNING *`,
      [
        empresa_id_correto,
        identificacao,
        codigo_barras,
        nome,
        marca,
        categoria,
        unidade,
        tipo_venda,
        preco_custo,
        preco_venda,
        preco_kg,
        estoque,
        estoque_minimo,
        imagem || null
      ]
    );

    res.status(201).json(resultado.rows[0]);
  } catch (erro) {
    console.error("Erro ao cadastrar produto:", erro);
    res.status(500).json({ erro: erro.message });
  }
}

export const atualizarProduto = async (req, res) => {
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
  const {
    identificacao,
    nome,
    marca,
    categoria,
    codigo_barras,
    preco_custo,
    preco_venda,
    preco_kg,
    tipo_venda,
    unidade,
    estoque,
    estoque_minimo
  } = req.body;

  try {
    const resultado = await pool.query(
      `
      UPDATE produtos
      SET
        identificacao = $1,
        nome = $2,
        marca = $3,
        categoria = $4,
        codigo_barras = $5,
        preco_custo = $6,
        preco_venda = $7,
        preco_kg = $8,
        tipo_venda = $9,
        unidade = $10,
        estoque = $11,
        estoque_minimo = $12
      WHERE id = $13 AND empresa_id = $14
      RETURNING *;
      `,
      [
        identificacao,
        nome,
        marca,
        categoria,
        codigo_barras,
        preco_custo,
        preco_venda,
        preco_kg,
        tipo_venda,
        unidade,
        estoque,
        estoque_minimo,
        id,
        empresa_id
      ]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({ erro: "Produto não encontrado." });
    }

    res.json(resultado.rows[0]);
  } catch (erro) {
    console.error("Erro ao atualizar produto:", erro);
    res.status(500).json({ erro: erro.message });
  }
};

export const excluirProduto = async (req, res) => {
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
  try {
    const resultado = await pool.query(
      "DELETE FROM produtos WHERE id = $1 AND empresa_id = $2 RETURNING *;", 
      [id, empresa_id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({ erro: "Produto não encontrado para exclusão." });
    }

    res.json({ mensagem: "Produto excluído com sucesso!" });
  } catch (erro) {
    console.error("Erro ao excluir produto:", erro.message);
    res.status(500).json({ erro: "Erro interno no servidor ao excluir produto." });
  }
};