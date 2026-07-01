import { useEffect, useState } from "react";
import logoPadrao from "../../../assets/logotrans.png";
import "../NovaVenda.css";

function ComprovanteTermico({ venda, empresa }) {
 console.log("COMPROVANTE CARREGOU");

  function formatarMoeda(valor) {
    return Number(valor || 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  function formatarData(data) {
    if (!data) return "-";
    return new Date(data).toLocaleString("pt-BR");
  }

  return (
    <div className="thermal-receipt">
      <div className="receipt-store">
  <img
    src={empresa?.logo || logoPadrao}
    alt="Logo"
  />

  <strong>{empresa?.nome_empresa || empresa?.nomeFantasia || "Gestec360"}</strong>

  <span>CNPJ: {empresa?.cnpj || empresa?.documento || "-"}</span>

  <span>
    {empresa?.endereco?.rua || empresa?.rua || ""}
    {empresa?.endereco?.numero || empresa?.numero
      ? `, ${empresa?.endereco?.numero || empresa?.numero}`
      : ""}
  </span>

  <span>
    {empresa?.telefone || empresa?.whatsapp || "-"}
  </span>
</div>

      <div className="receipt-separator"></div>

      <h3>COMPROVANTE DE VENDA</h3>

      <div className="receipt-info">
        <div>
          <span>Pedido</span>
          <strong>#{String(venda.numero || venda.numero_pedido).padStart(6, "0")}</strong>
        </div>

        <div>
          <span>Data</span>
          <strong>{formatarData(venda.data || venda.data_venda)}</strong>
        </div>

        <div>
          <span>Tipo</span>
          <strong>{venda.tipoVenda || venda.tipo_venda}</strong>
        </div>

        <div>
          <span>Pagamento</span>
          <strong>{venda.formaPagamento || venda.forma_pagamento}</strong>
        </div>

        {(venda.formaPagamento || venda.forma_pagamento) !== "Dinheiro" && (venda.tipoVenda || venda.tipo_venda) !== "Balcão" && (
          <div className="receipt-status">
            <span>Status</span>
            <strong
              className={
                venda.statusPagamento === "Pago"
                  ? "status-paid"
                  : "status-pending"
              }
            >
              {venda.statusPagamento}
            </strong>
          </div>
        )}
      </div>

      {(venda.tipoVenda || venda.tipo_venda) === "Entrega" && (
        <>
          <div className="receipt-separator"></div>

          <div className="receipt-info">
            <div>
              <span>Cliente</span>
              <strong>{venda.cliente || "-"}</strong>
            </div>

            <div>
              <span>Endereço</span>
              <strong>{venda.endereco || "-"}</strong>
            </div>
          </div>
        </>
      )}

      {venda.observacao && (
        <>
          <div className="receipt-separator"></div>

          <div className="receipt-info">
            <div className="receipt-observation">
              <span>Observação</span>
              <strong>{venda.observacao}</strong>
            </div>
          </div>
        </>
      )}

      {venda.cpfNota && (
  <>
    <div className="receipt-separator"></div>

    <div className="receipt-info">
      <div>
        <span>CPF</span>
        <strong>{venda.cpfNota}</strong>
      </div>
    </div>
  </>
)}

      <div className="receipt-separator"></div>

      <div className="receipt-items">
        <strong>ITENS</strong>

        {venda.itens?.map((produto) => (
          <div key={produto.id}>
            <span>
              {produto.quantidade}x {produto.nome}
            </span>
            <span>{formatarMoeda(produto.valor * produto.quantidade)}</span>
          </div>
        ))}
      </div>

      <div className="receipt-separator"></div>

      <div className="receipt-values">
        <div>
          <span>Subtotal</span>
          <strong>{formatarMoeda(venda.subtotal)}</strong>
        </div>

        <div>
          <span>Desconto</span>
          <strong>{formatarMoeda(venda.desconto)}</strong>
        </div>

        {(venda.tipoVenda || venda.tipo_venda) === "Entrega" && (
          <div>
            <span>Entrega</span>
            <strong>{formatarMoeda(venda.taxaEntrega)}</strong>
          </div>
        )}

        <div className="receipt-total-line">
          <span>TOTAL</span>
          <strong>{formatarMoeda(venda.total)}</strong>
        </div>
      </div>

      {(venda.formaPagamento || venda.forma_pagamento) === "Dinheiro" && (
        <>
          <div className="receipt-separator"></div>

          <div className="receipt-values">
            <div>
              <span>Recebido</span>
              <strong>{formatarMoeda(venda.valorRecebido)}</strong>
            </div>

            <div>
              <span>Troco</span>
              <strong>{formatarMoeda(venda.troco)}</strong>
            </div>
          </div>
        </>
      )}

      <div className="receipt-footer">
        <strong>{empresa.rodape_comprovante || "Obrigado pela preferência!"}</strong>
      </div>
    </div>
  );
}

export default ComprovanteTermico;