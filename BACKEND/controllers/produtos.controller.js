import pool from "../db.js";

// ===== LISTAR PRODUTOS =====
export const listarProdutos = async (req, res) => {
  try {
    const { empresa_id } = req.query;
    
    if (!empresa_id) {
      return res.status(400).json({ erro: "empresa_id é obrigatório" });
    }

    const query = `
      SELECT 
        id, empresa_id, identificacao, nome, marca, categoria, 
        codigo_barras, preco_custo, preco_venda, preco_kg, 
        tipo_venda, unidade, estoque, estoque_minimo,
        possui_complementos, config_complementos,
        ativo, imagem, criado_em
      FROM produtos 
      WHERE empresa_id = $1 
      ORDER BY id DESC
    `;

    const result = await pool.query(query, [empresa_id]);
    
    console.log("📦 PRODUTOS LISTADOS:", result.rows.length);
    
    res.json(result.rows);
  } catch (error) {
    console.error("❌ Erro ao listar produtos:", error);
    res.status(500).json({ erro: error.message });
  }
};

// ===== CADASTRAR PRODUTO =====
export const cadastrarProduto = async (req, res) => {
  try {
    const {
      empresa_id,
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
      possui_complementos,
      config_complementos
    } = req.body;

    console.log("📦 CADASTRANDO PRODUTO:", req.body);
    console.log("📦 possui_complementos:", possui_complementos);
    console.log("📦 config_complementos:", config_complementos);

    const query = `
      INSERT INTO produtos (
        empresa_id, identificacao, nome, marca, categoria, codigo_barras,
        preco_custo, preco_venda, preco_kg, tipo_venda, unidade,
        estoque, estoque_minimo,
        possui_complementos, config_complementos
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING *;
    `;

    const values = [
      empresa_id,
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
      estoque || 0,
      estoque_minimo || 0,
      possui_complementos || false,
      config_complementos || {}
    ];

    const result = await pool.query(query, values);
    
    console.log("✅ PRODUTO CRIADO:", result.rows[0]);
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("❌ Erro ao cadastrar produto:", error);
    res.status(500).json({ erro: error.message });
  }
};

// ===== ATUALIZAR PRODUTO =====
export const atualizarProduto = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      empresa_id,
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
      possui_complementos,
      config_complementos
    } = req.body;

    console.log("📦 ATUALIZANDO PRODUTO:", req.body);
    console.log("📦 possui_complementos:", possui_complementos);
    console.log("📦 config_complementos:", config_complementos);

    const query = `
      UPDATE produtos SET
        empresa_id = $1,
        identificacao = $2,
        nome = $3,
        marca = $4,
        categoria = $5,
        codigo_barras = $6,
        preco_custo = $7,
        preco_venda = $8,
        preco_kg = $9,
        tipo_venda = $10,
        unidade = $11,
        estoque = $12,
        estoque_minimo = $13,
        possui_complementos = $14,
        config_complementos = $15
      WHERE id = $16 AND empresa_id = $17
      RETURNING *;
    `;

    const values = [
      empresa_id,
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
      estoque || 0,
      estoque_minimo || 0,
      possui_complementos || false,
      config_complementos || {},
      id,
      empresa_id
    ];

    const result = await pool.query(query, values);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ erro: "Produto não encontrado" });
    }
    
    console.log("✅ PRODUTO ATUALIZADO:", result.rows[0]);
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error("❌ Erro ao atualizar produto:", error);
    res.status(500).json({ erro: error.message });
  }
};

// ===== EXCLUIR PRODUTO =====
export const excluirProduto = async (req, res) => {
  try {
    const { id } = req.params;
    const empresa_id = req.headers["x-empresa-id"] || req.query.empresa_id;

    if (!empresa_id) {
      return res.status(400).json({ erro: "empresa_id é obrigatório" });
    }

    const query = `DELETE FROM produtos WHERE id = $1 AND empresa_id = $2 RETURNING *`;
    const result = await pool.query(query, [id, empresa_id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ erro: "Produto não encontrado" });
    }

    res.json({ mensagem: "Produto excluído com sucesso" });
  } catch (error) {
    console.error("❌ Erro ao excluir produto:", error);
    res.status(500).json({ erro: error.message });
  }
};