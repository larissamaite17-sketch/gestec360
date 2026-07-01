import pool from "../db.js";

export async function listarClientes(req, res) {
  try {

    const empresa_id =
      req.get("x-empresa-id") ||
      req.query.empresa_id ||
      req.body?.empresa_id;

    if (!empresa_id) {
      return res.json([]);
    }

    const resultado = await pool.query(
      `
      SELECT *
      FROM clientes
      WHERE empresa_id = $1
      ORDER BY nome ASC
      `,
      [empresa_id]
    );

    res.json(resultado.rows);

  } catch (erro) {
    console.error("Erro ao listar clientes:", erro);
    res.status(500).json({ erro: erro.message });
  }
}
export async function cadastrarCliente(req, res) {
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
      nome,
      cpf,
      telefone,
      email,
      endereco,
      cidade,
      estado,
      cep
    } = req.body;

    if (!nome || !nome.trim()) {
      return res.status(400).json({ erro: "Nome é obrigatório." });
    }

    const resultado = await pool.query(
      `
      INSERT INTO clientes (
        empresa_id,
        nome,
        cpf,
        telefone,
        email,
        endereco,
        cidade,
        estado,
        cep,
        quantidade_compras,
        total_gasto,
        ativo
      )
      VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,0,0,true
      )
      RETURNING *
      `,
      [
        empresa_id,
        nome.trim(),
        cpf || null,
        telefone || null,
        email || null,
        endereco || null,
        cidade || null,
        estado || null,
        cep || null
      ]
    );

    res.status(201).json(resultado.rows[0]);
  } catch (erro) {
    console.error("Erro ao cadastrar cliente:", erro);
    res.status(500).json({ erro: erro.message });
  }
}

export async function atualizarCliente(req, res) {
  try {
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
      nome,
      cpf,
      telefone,
      email,
      endereco,
      cidade,
      estado,
      cep
    } = req.body;

    const resultado = await pool.query(
      `
      UPDATE clientes
      SET
        nome = $1,
        cpf = $2,
        telefone = $3,
        email = $4,
        endereco = $5,
        cidade = $6,
        estado = $7,
        cep = $8
      WHERE id = $9 AND empresa_id = $10
      RETURNING *
      `,
      [
        nome,
        cpf || null,
        telefone || null,
        email || null,
        endereco || null,
        cidade || null,
        estado || null,
        cep || null,
        id,
        empresa_id
      ]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({ erro: "Cliente não encontrado ou não pertence a esta empresa." });
    }

    res.json(resultado.rows[0]);
  } catch (erro) {
    console.error("Erro ao atualizar cliente:", erro);
    res.status(500).json({ erro: erro.message });
  }
}

export async function excluirCliente(req, res) {
  try {
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
    const resultado = await pool.query(
      `
      UPDATE clientes
      SET ativo = false
      WHERE id = $1 AND empresa_id = $2
      RETURNING *
      `,
      [id, empresa_id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({ erro: "Cliente não encontrado." });
    }

    res.json({ mensagem: "Cliente excluído com sucesso." });
  } catch (erro) {
    console.error("Erro ao excluir cliente:", erro);
    res.status(500).json({ erro: erro.message });
  }
}