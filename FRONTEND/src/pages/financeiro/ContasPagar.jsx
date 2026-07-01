import { useEffect, useMemo, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import "./ContasPagar.css";

function ContasPagar() {
  const [modalAberto, setModalAberto] = useState(false);
  const [pesquisa, setPesquisa] = useState("");
  const [situacaoFiltro, setSituacaoFiltro] = useState("Todos");
  const [despesas, setDespesas] = useState([]);

  const [novaDespesa, setNovaDespesa] = useState({
    fornecedor: "",
    descricao: "",
    categoria: "",
    valor: "",
    formaPagamento: "PIX",
    vencimento: "",
    observacao: "",
    status: "Pendente"
  });

  useEffect(() => {
    carregarDespesas();
  }, []);

  async function carregarDespesas() {
    try {
      const empresaId = localStorage.getItem("empresaId");
      const resposta = await fetch(`/api/contas-pagar?empresa_id=${empresaId}`);
      const dados = await resposta.json();

      setDespesas(dados);
    } catch (erro) {
      console.log("Erro ao carregar contas a pagar:", erro);
    }
  }

  async function salvarDespesa() {
    if (
      !novaDespesa.fornecedor ||
      !novaDespesa.descricao ||
      !novaDespesa.valor
    ) {
      alert("Preencha os campos obrigatórios.");
      return;
    }

    try {
      const empresaId = localStorage.getItem("empresaId");
      const valorNumero = Number(
        String(novaDespesa.valor)
          .replace(/\./g, "")
          .replace(",", ".")
      );

      const resposta = await fetch("/api/contas-pagar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...novaDespesa,
          empresa_id: empresaId,
          valor: valorNumero
        })
      });

      if (!resposta.ok) {
        alert("Erro ao salvar despesa.");
        return;
      }

      await carregarDespesas();
      setModalAberto(false);

      setNovaDespesa({
        fornecedor: "",
        descricao: "",
        categoria: "",
        valor: "",
        formaPagamento: "PIX",
        vencimento: "",
        observacao: "",
        status: "Pendente"
      });
    } catch (erro) {
      console.log("Erro ao salvar despesa:", erro);
      alert("Erro ao salvar despesa.");
    }
  }

  async function pagarConta(id) {
    try {
      const empresaId = localStorage.getItem("empresaId");
      const resposta = await fetch(
        `/api/contas-pagar/${id}/pagar`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ empresa_id: empresaId })
        }
      );

      if (!resposta.ok) {
        alert("Erro ao pagar conta.");
        return;
      }

      await carregarDespesas();
    } catch (erro) {
      console.log("Erro ao pagar conta:", erro);
      alert("Erro ao pagar conta.");
    }
  }

  const listaFiltrada = useMemo(() => {
    return despesas.filter(item => {
      const passouPesquisa =
        String(item.categoria || "").toLowerCase().includes(pesquisa.toLowerCase()) ||
        String(item.descricao || "").toLowerCase().includes(pesquisa.toLowerCase());

      const passouSituacao =
        situacaoFiltro === "Todos" || item.status === situacaoFiltro;

      return passouPesquisa && passouSituacao;
    });
  }, [despesas, pesquisa, situacaoFiltro]);

  return (
    <MainLayout>
      <div className="receber-page">
        <div className="receber-header">
          <div>
            <h1>Contas a Pagar</h1>
            <p>Gerencie todas as despesas da empresa.</p>
          </div>

          <button
            className="btn-nova-receita"
            onClick={() => setModalAberto(true)}
          >
            + Nova Despesa
          </button>
        </div>

        <div className="cards-receber">
          <div className="card-receber">
            <small>Total a Pagar</small>
            <h2>
              {despesas
                .reduce((t, i) => {
                  return t + Number(i.valor || 0);
                }, 0)
                .toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL"
                })}
            </h2>
          </div>

          <div className="card-receber">
            <small>Pendente</small>
            <h2>
              {despesas
                .filter(i => i.status === "Pendente")
                .reduce((t, i) => {
                  return t + Number(i.valor || 0);
                }, 0)
                .toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL"
                })}
            </h2>
          </div>

          <div className="card-receber">
            <small>Pago</small>
            <h2>
              {despesas
                .filter(i => i.status === "Pago")
                .reduce((t, i) => {
                  return t + Number(i.valor || 0);
                }, 0)
                .toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL"
                })}
            </h2>
          </div>
        </div>

        <div className="receber-lista">
          <div className="receber-filtros">
            <input
              placeholder="Pesquisar..."
              value={pesquisa}
              onChange={(e) => setPesquisa(e.target.value)}
            />
            <select
              value={situacaoFiltro}
              onChange={(e) => setSituacaoFiltro(e.target.value)}
            >
              <option>Todos</option>
              <option>Pendente</option>
              <option>Pago</option>
            </select>
          </div>

          <table>
            <thead>
              <tr>
                <th>Categoria</th>
                <th>Descrição</th>
                <th>Vencimento</th>
                <th>Valor</th>
                <th>Situação</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {listaFiltrada.length === 0 ? (
                <tr>
                  <td colSpan="6">Nenhuma despesa cadastrada.</td>
                </tr>
              ) : (
                listaFiltrada.map(item => (
                  <tr key={item.id}>
                    <td>{item.categoria || "-"}</td>
                    <td>{item.descricao}</td>
                    <td>{item.vencimento}</td>
                    <td>
                      {Number(item.valor).toLocaleString("pt-BR", {
  style: "currency",
  currency: "BRL"
})}
                    </td>
                    <td>
                      <span className={item.status === "Pago" ? "status recebido" : "status pendente"}>
                        {item.status === "Pago" ? "Pago" : "Pendente"}
                      </span>
                    </td>
                    <td>
                      {item.status === "Pendente" && (
                        <button
                          className="btn-receber"
                          onClick={() => pagarConta(item.id)}
                        >
                          ✓ Confirmar Pagamento
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {modalAberto && (
          <div className="modal-bg">
            <div className="modal-receber">
              <div className="modal-topo">
                <h2>Nova Despesa</h2>
                <button
                  className="fechar-modal"
                  onClick={() => setModalAberto(false)}
                >
                  ✕
                </button>
              </div>

              <input
                placeholder="Fornecedor *"
                value={novaDespesa.fornecedor}
                onChange={(e) => setNovaDespesa({
                  ...novaDespesa,
                  fornecedor: e.target.value
                })}
              />

              <input
                placeholder="Descrição *"
                value={novaDespesa.descricao}
                onChange={(e) => setNovaDespesa({
                  ...novaDespesa,
                  descricao: e.target.value
                })}
              />

              <select
                value={novaDespesa.categoria}
                onChange={(e) => setNovaDespesa({
                  ...novaDespesa,
                  categoria: e.target.value
                })}
              >
                <option value="">Categoria *</option>
                <option>Água</option>
                <option>Energia</option>
                <option>Internet</option>
                <option>Aluguel</option>
                <option>Salários</option>
                <option>Impostos</option>
                <option>Combustível</option>
                <option>Marketing</option>
                <option>Outros</option>
              </select>

              <input
                placeholder="Valor *"
                value={novaDespesa.valor}
                onChange={(e) => {
                  let valor = e.target.value.replace(/\D/g, "");
                  valor = (Number(valor) / 100).toLocaleString("pt-BR", {
                    minimumFractionDigits: 2
                  });
                  setNovaDespesa({
                    ...novaDespesa,
                    valor
                  });
                }}
              />

              <select
                value={novaDespesa.formaPagamento}
                onChange={(e) => setNovaDespesa({
                  ...novaDespesa,
                  formaPagamento: e.target.value
                })}
              >
                <option>PIX</option>
                <option>Dinheiro</option>
                <option>Cartão de Débito</option>
                <option>Cartão de Crédito</option>
                <option>Boleto</option>
                <option>Transferência</option>
              </select>

              <label>Data de Vencimento</label>
              <input
                type="date"
                value={novaDespesa.vencimento}
                onChange={(e) => setNovaDespesa({
                  ...novaDespesa,
                  vencimento: e.target.value
                })}
              />

              <textarea
                placeholder="Observação"
                value={novaDespesa.observacao}
                onChange={(e) => setNovaDespesa({
                  ...novaDespesa,
                  observacao: e.target.value
                })}
              />

              <div className="modal-buttons">
                <button
                  className="cancelar"
                  onClick={() => setModalAberto(false)}
                >
                  Cancelar
                </button>
                <button
                  className="salvar"
                  onClick={salvarDespesa}
                >
                  Salvar Despesa
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default ContasPagar;