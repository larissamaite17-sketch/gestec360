import pool from "../db.js";

export async function buscarConfiguracoes(req, res) {
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
      FROM configuracoes
      WHERE empresa_id = $1
      LIMIT 1
    `, [empresa_id]);

    if (resultado.rows.length === 0) {
      return res.json(null);
    }

    res.json(resultado.rows[0]);

  } catch (erro) {
    console.error("Erro ao buscar configurações:", erro);
    res.status(500).json({ erro: erro.message });
  }
}

export async function salvarConfiguracoes(req, res) {
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
      nome_empresa,
      razao_social,
      telefone,
      whatsapp,
      email,
      endereco,
      cnpj,
      logo,
      rodape_comprovante
    } = req.body;

    const existe = await pool.query(`
      SELECT id
      FROM configuracoes
      WHERE empresa_id = $1
      LIMIT 1
    `, [empresa_id]);

    let resultado;

    if (existe.rows.length > 0) {
      resultado = await pool.query(
        `
        UPDATE configuracoes
        SET
          nome_empresa = $1,
          razao_social = $2,
          telefone = $3,
          whatsapp = $4,
          email = $5,
          endereco = $6,
          cnpj = $7,
          logo = $8,
          rodape_comprovante = $9
        WHERE empresa_id = $10
        RETURNING *
        `,
        [
          nome_empresa,
          razao_social,
          telefone,
          whatsapp,
          email,
          endereco,
          cnpj,
          logo,
          rodape_comprovante,
          empresa_id
        ]
      );
    } else {
      resultado = await pool.query(
        `
        INSERT INTO configuracoes
        (
          empresa_id,
          nome_empresa,
          razao_social,
          telefone,
          whatsapp,
          email,
          endereco,
          cnpj,
          logo,
          rodape_comprovante
        )
        VALUES
        (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10
        )
        RETURNING *
        `,
        [
          empresa_id,
          nome_empresa,
          razao_social,
          telefone,
          whatsapp,
          email,
          endereco,
          cnpj,
          logo,
          rodape_comprovante
        ]
      );
    }

    res.json(resultado.rows[0]);

  } catch (erro) {
    console.error("Erro ao salvar configurações:", erro);
    res.status(500).json({
      erro: erro.message
    });
  }
}