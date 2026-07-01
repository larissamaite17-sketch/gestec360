import logo from "../../../assets/logotrans.png";
import "../NovaVenda.css";

function ComprovanteTermico({ venda }) {
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
        <img src={logo} alt="Logo" />
        <strong>NOME DA LOJA</strong>
        <span>CNPJ: 00.000.000/0001-00</span>
        <span>Rua cadastrada, 123</span>
        <span>Telefone: (17) 99999-9999</span>
      </div>

      <div className="receipt-separator"></div>

      <h3>COMPROVANTE DE VENDA</h3>

      <div className="receipt-info">
        <div>
          <span>Pedido</span>
          <strong>#{String(venda.numero).padStart(6, "0")}</strong>
        </div>

        <div>
          <span>Data</span>
          <strong>{formatarData(venda.data)}</strong>
        </div>

        <div>
          <span>Tipo</span>
          <strong>{venda.tipoVenda}</strong>
        </div>

        <div>
          <span>Pagamento</span>
          <strong>{venda.formaPagamento}</strong>
        </div>

        {venda.formaPagamento !== "Dinheiro" && venda.tipoVenda !== "Balcão" && (
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

      {venda.tipoVenda === "Entrega" && (
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

        {venda.tipoVenda === "Entrega" && (
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

      {venda.formaPagamento === "Dinheiro" && (
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
        <strong>Obrigado pela preferência!</strong>
        <span>Volte sempre!</span>
      </div>
    </div>
  );
}

export default ComprovanteTermico;