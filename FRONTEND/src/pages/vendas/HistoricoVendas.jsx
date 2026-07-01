import { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import "./HistoricoVendas.css";
import { Printer, XCircle } from "lucide-react";

import ComprovanteTermico from "./components/ComprovanteTermico";

const API = "/api";
const CANCELADAS_STORAGE_KEY = "vendasCanceladas";

function HistoricoVendas() {
  const [vendas, setVendas] = useState([]);
  const [dataFiltro, setDataFiltro] = useState("");
  const [vendaSelecionada, setVendaSelecionada] = useState(null);
  const [modalStatus, setModalStatus] = useState(false);
  const [vendaStatus, setVendaStatus] = useState(null);
  const [modalDevolucoes, setModalDevolucoes] = useState(false);
  const [devolucoesVenda, setDevolucoesVenda] = useState([]);
  const [modalCancelar, setModalCancelar] = useState(false);
  const [vendaCancelar, setVendaCancelar] = useState(null);
const empresa_id = localStorage.getItem("empresaId");


  useEffect(() => {
    carregarVendas();
  }, []);

  function getIdVenda(venda) {
    return String(
      venda?.id ||
      venda?.venda_id ||
      venda?.numero_pedido ||
      venda?.numero ||
      ""
    );
  }

  function getNumeroPedido(venda) {
    return venda?.numero_pedido || venda?.numero || venda?.id || "";
  }

  function getDataVenda(venda) {
    return venda?.data_venda || venda?.data || venda?.criado_em || "";
  }

  function getStatusVenda(venda) {
    return venda?.status_venda || venda?.statusVenda || venda?.situacao || "Concluída";
  }

  function getStatusPagamento(venda) {
    return venda?.status_pagamento || venda?.statusPagamento || "Pendente";
  }

  function lerCanceladasLocal() {
    try {
      const salvas = JSON.parse(localStorage.getItem(CANCELADAS_STORAGE_KEY)) || [];
      return Array.isArray(salvas) ? salvas.map(String) : [];
    } catch {
      return [];
    }
  }

  function salvarCanceladaLocal(idVenda) {
    const canceladas = lerCanceladasLocal();

    if (!canceladas.includes(String(idVenda))) {
      localStorage.setItem(
        CANCELADAS_STORAGE_KEY,
        JSON.stringify([...canceladas, String(idVenda)])
      );
    }
  }

  function aplicarCanceladasLocais(listaVendas) {
    const canceladas = lerCanceladasLocal();

    return listaVendas.map((venda) => {
      const idVenda = getIdVenda(venda);

      if (canceladas.includes(String(idVenda))) {
        return {
          ...venda,
          status_venda: "Cancelada",
          statusVenda: "Cancelada",
        };
      }

      return venda;
    });
  }

  async function carregarVendas() {
    try {
      const resposta = await fetch(
  `${API}/vendas?empresa_id=${empresa_id}`
);
      const dados = await resposta.json();
      const lista = Array.isArray(dados) ? dados : [];

      setVendas(aplicarCanceladasLocais(lista));
    } catch (erro) {
      console.log("Erro ao carregar vendas:", erro);
    }
  }

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

  function abrirModalStatus(venda) {
    setVendaStatus(venda);
    setModalStatus(true);
  }

  function confirmarStatusPago() {
    if (!vendaStatus) return;

    const idStatus = getIdVenda(vendaStatus);

    const novasVendas = vendas.map((venda) => {
      if (getIdVenda(venda) === idStatus) {
        return {
          ...venda,
          status_pagamento: "Pago",
          statusPagamento: "Pago",
        };
      }

      return venda;
    });

    setVendas(novasVendas);
    setModalStatus(false);
    setVendaStatus(null);
  }

  const vendasFiltradas = dataFiltro
    ? vendas.filter((venda) => String(getDataVenda(venda)).startsWith(dataFiltro))
    : vendas;

  function abrirDevolucoes(venda) {
    const devolucoesSalvas = JSON.parse(localStorage.getItem("devolucoes")) || [];

    const numeroPedido = getNumeroPedido(venda);
    const dataVenda = getDataVenda(venda);

    const devolucoesDoPedido = devolucoesSalvas.filter(
      (devolucao) =>
        String(devolucao.pedido) === String(numeroPedido) &&
        String(devolucao.dataVenda) === String(dataVenda)
    );

    setDevolucoesVenda(devolucoesDoPedido);
    setModalDevolucoes(true);
  }

  async function confirmarCancelamento() {
    if (!vendaCancelar) return;

    const idCancelar = getIdVenda(vendaCancelar);

    if (!idCancelar) {
      alert("Não encontrei o código dessa venda para cancelar.");
      return;
    }

    const vendasAtualizadas = vendas.map((venda) => {
      if (getIdVenda(venda) === idCancelar) {
        return {
          ...venda,
          status_venda: "Cancelada",
          statusVenda: "Cancelada",
        };
      }

      return venda;
    });

    setVendas(vendasAtualizadas);
    salvarCanceladaLocal(idCancelar);

    try {
      await fetch(`${API}/vendas/${idCancelar}/cancelar`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
  status_venda: "Cancelada",
  empresa_id
}),
      });
    } catch (erro) {
      console.log("Cancelamento salvo localmente. Backend ainda não confirmou:", erro);
    }

    setModalCancelar(false);
    setVendaCancelar(null);
  }

  return (
    <MainLayout>
      <div className="history-page">
        <div className="history-header">
          <div>
            <h1>Histórico de Vendas</h1>
            <p>Consulte as vendas realizadas no PDV</p>

            <div className="history-filters">
              <input
                type="date"
                value={dataFiltro}
                onChange={(e) => setDataFiltro(e.target.value)}
              />

              {dataFiltro && (
                <button onClick={() => setDataFiltro("")}>Limpar filtro</button>
              )}
            </div>
          </div>
        </div>

        <div className="history-card">
          {vendasFiltradas.length === 0 ? (
            <div className="history-empty">Nenhuma venda registrada ainda.</div>
          ) : (
            <table className="history-table">
              <thead>
                <tr>
                  <th>Pedido</th>
                  <th>Data</th>
                  <th>Cliente</th>
                  <th>Tipo</th>
                  <th>Pagamento</th>
                  <th>Status</th>
                  <th>Situação</th>
                  <th>Total</th>
                  <th>Ações</th>
                </tr>
              </thead>

              <tbody>
                {vendasFiltradas.map((venda) => {
                  const idVenda = getIdVenda(venda);
                  const numeroPedido = getNumeroPedido(venda);
                  const statusVenda = getStatusVenda(venda);
                  const statusPagamento = getStatusPagamento(venda);

                  return (
                    <tr key={idVenda}>
                      <td className="pedido-cell">
                        PDV-{String(numeroPedido).padStart(3, "0")}
                      </td>

                      <td>{formatarData(getDataVenda(venda))}</td>
                      <td>{venda.cliente || venda.nome_cliente || "-"}</td>
                      <td>{venda.tipo_venda || venda.tipoVenda || "-"}</td>
                      <td>{venda.forma_pagamento || venda.formaPagamento || "-"}</td>

                      <td>
                        {statusPagamento === "Pago" ? (
                          <span className="status-paid-badge">Pago</span>
                        ) : (
                          <button
                            className="status-pending-badge status-button"
                            onClick={() => abrirModalStatus(venda)}
                            title="Marcar como pago"
                          >
                            Pendente
                          </button>
                        )}
                      </td>

                      <td>
                        {statusVenda === "Cancelada" ? (
                          <span className="status-cancelled">Cancelada</span>
                        ) : statusVenda === "Devolvida" ? (
                          <button
                            className="status-returned status-situation-btn"
                            onClick={() => abrirDevolucoes(venda)}
                          >
                            Devolvida
                          </button>
                        ) : statusVenda === "Devolução Parcial" ? (
                          <button
                            className="status-partial status-situation-btn"
                            onClick={() => abrirDevolucoes(venda)}
                          >
                            Devolução Parcial
                          </button>
                        ) : (
                          <span className="status-completed">Concluída</span>
                        )}
                      </td>

                      <td>{formatarMoeda(venda.total)}</td>

                      <td>
                        <div className="history-actions">
                          <button
                            className="print-history-btn"
                            onClick={() => setVendaSelecionada(venda)}
                            title="Reimprimir comprovante"
                          >
                            <Printer size={18} />
                          </button>

                          {statusVenda !== "Cancelada" && (
                            <button
                              className="cancel-sale-btn"
                              title="Cancelar venda"
                              onClick={() => {
                                setVendaCancelar(venda);
                                setModalCancelar(true);
                              }}
                            >
                              <XCircle size={18} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {vendaSelecionada && (
          <div className="history-modal-overlay">
            <div className="history-modal">
              <h2>Reimprimir comprovante</h2>

             <ComprovanteTermico
  venda={vendaSelecionada}
  empresa={JSON.parse(localStorage.getItem("empresa"))}
/>
              <div className="history-modal-actions">
                <button onClick={() => setVendaSelecionada(null)}>Fechar</button>
                <button onClick={() => window.print()}>Imprimir</button>
              </div>
            </div>
          </div>
        )}

        {modalStatus && (
          <div className="history-modal-overlay">
            <div className="history-modal status-confirm-modal">
              <h2>Confirmar pagamento</h2>

              <p>
                Deseja marcar o pedido{" "}
                <strong>
                  PDV-{String(getNumeroPedido(vendaStatus)).padStart(3, "0")}
                </strong>{" "}
                como pago?
              </p>

              <div className="status-confirm-box">
                <span>Pagamento</span>
                <strong>
                  {vendaStatus?.forma_pagamento || vendaStatus?.formaPagamento || "-"}
                </strong>
              </div>

              <div className="status-confirm-box">
                <span>Total</span>
                <strong>{formatarMoeda(vendaStatus?.total)}</strong>
              </div>

              <div className="history-modal-actions">
                <button onClick={() => setModalStatus(false)}>Cancelar</button>
                <button onClick={confirmarStatusPago}>Confirmar pagamento</button>
              </div>
            </div>
          </div>
        )}

        {modalDevolucoes && (
          <div className="history-modal-overlay">
            <div className="history-modal">
              <h2>Detalhes da devolução</h2>

              {devolucoesVenda.length === 0 ? (
                <p>Nenhuma devolução encontrada para essa venda.</p>
              ) : (
                devolucoesVenda.map((devolucao, index) => (
                  <div className="return-detail-box" key={index}>
                    <div>
                      <span>Produto</span>
                      <strong>{devolucao.produto?.nome || "-"}</strong>
                    </div>

                    <div>
                      <span>Quantidade</span>
                      <strong>{devolucao.quantidade}</strong>
                    </div>

                    <div>
                      <span>Valor</span>
                      <strong>{formatarMoeda(devolucao.valor)}</strong>
                    </div>

                    <div className="return-reason">
                      <span>Motivo</span>
                      <strong>{devolucao.motivo}</strong>
                    </div>
                  </div>
                ))
              )}

              <div className="history-modal-actions">
                <button onClick={() => setModalDevolucoes(false)}>Fechar</button>
              </div>
            </div>
          </div>
        )}

        {modalCancelar && (
          <div className="history-modal-overlay">
            <div className="history-modal">
              <h2>Cancelar venda</h2>

              <p>
                Tem certeza que deseja cancelar o pedido{" "}
                <strong>
                  PDV-{String(getNumeroPedido(vendaCancelar)).padStart(3, "0")}
                </strong>
                ?
              </p>

              <div className="status-confirm-box">
                <span>Total</span>
                <strong>{formatarMoeda(vendaCancelar?.total)}</strong>
              </div>

              <div className="status-confirm-box">
                <span>Pagamento</span>
                <strong>
                  {vendaCancelar?.forma_pagamento || vendaCancelar?.formaPagamento || "-"}
                </strong>
              </div>

              <div className="history-modal-actions">
                <button
                  onClick={() => {
                    setModalCancelar(false);
                    setVendaCancelar(null);
                  }}
                >
                  Voltar
                </button>

                <button className="cancel-confirm-btn" onClick={confirmarCancelamento}>
                  Cancelar venda
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default HistoricoVendas;