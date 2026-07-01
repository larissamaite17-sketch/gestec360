import { useEffect, useMemo, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import "./ContasReceber.css";

const API = "/api";

function ContasReceber() {
  const [modalAberto, setModalAberto] = useState(false);
  const [pesquisa, setPesquisa] = useState("");
  const [situacaoFiltro, setSituacaoFiltro] = useState("Todos");
  const [receitas, setReceitas] = useState([]);

  const [novaReceita, setNovaReceita] = useState({
    cliente: "",
    descricao: "",
    categoria: "Vendas", // Definido padrão para nunca ir vazio
    valor: "",
    formaRecebimento: "PIX",
    vencimento: "",
    observacao: "",
    status: "Pendente"
  });

  useEffect(() => {
    carregarReceitas();
  }, []);

  async function carregarReceitas() {
    try {
      const empresaId = localStorage.getItem("empresaId");
      const resposta = await fetch(`${API}/contas-receber?empresa_id=${empresaId}`);
      const dados = await resposta.json();

      setReceitas(Array.isArray(dados) ? dados : []);
    } catch (erro) {
      console.log("Erro ao carregar contas a receber:", erro);
    }
  }

  // Função auxiliar para formatar a data ISO vinda do banco para DD/MM/AAAA
  function formatarData(dataString) {
    if (!dataString) return "-";
    try {
      const data = new Date(dataString);
      if (isNaN(data.getTime())) return dataString;
      return data.toLocaleDateString("pt-BR", { timeZone: "UTC" });
    } catch {
      return dataString;
    }
  }

  async function salvarReceita() {
    if (
      !novaReceita.cliente ||
      !novaReceita.descricao ||
      !novaReceita.valor
    ) {
      alert("Preencha os campos obrigatórios.");
      return;
    }

    try {
      const empresaId = localStorage.getItem("empresaId");
      
      // Converte a string mascarada formatada (ex: 45,00) corretamente em número (45)
      const valorLimpo = String(novaReceita.valor)
        .replace(/\./g, "")
        .replace(",", ".");
      const valorNumero = parseFloat(valorLimpo);

      const resposta = await fetch(`${API}/contas-receber`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...novaReceita,
          empresa_id: empresaId,
          valor: valorNumero
        })
      });

      if (!resposta.ok) {
        alert("Erro ao salvar receita.");
        return;
      }

      await carregarReceitas();
      setModalAberto(false);

      setNovaReceita({
        cliente: "",
        descricao: "",
        categoria: "Vendas",
        valor: "",
        formaRecebimento: "PIX",
        vencimento: "",
        observacao: "",
        status: "Pendente"
      });
    } catch (erro) {
      console.log("Erro ao salvar receita:", erro);
      alert("Erro ao salvar receita.");
    }
  }

  async function receberConta(id) {
    try {
      const empresaId = localStorage.getItem("empresaId");
      const resposta = await fetch(
        `${API}/contas-receber/${id}/receber`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ empresa_id: empresaId })
        }
      );

      if (!resposta.ok) {
        alert("Erro ao receber conta.");
        return;
      }

      await carregarReceitas();
    } catch (erro) {
      console.log("Erro ao receber conta:", erro);
      alert("Erro ao receber conta.");
    }
  }

  const listaFiltrada = useMemo(() => {
    return receitas.filter(item => {
      const passouPesquisa =
        String(item.categoria || "").toLowerCase().includes(pesquisa.toLowerCase()) ||
        String(item.descricao || "").toLowerCase().includes(pesquisa.toLowerCase());

      const passouSituacao =
        situacaoFiltro === "Todos" || item.status === situacaoFiltro;

      return passouPesquisa && passouSituacao;
    });
  }, [receitas, pesquisa, situacaoFiltro]);

  return (
    <MainLayout>
      <div className="receber-page">
        <div className="receber-header">
          <div>
            <h1>Contas a Receber</h1>
            <p>Gerencie todas as receitas da empresa.</p>
          </div>

          <button
            className="btn-nova-receita"
            onClick={() => setModalAberto(true)}
          >
            + Novo Recebimento
          </button>
        </div>

        <div className="cards-receber">
          <div className="card-receber">
            <small>Total a Receber</small>
            <h2>
              {receitas
                .reduce((t, i) => t + Number(i.valor || 0), 0)
                .toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL"
                })}
            </h2>
          </div>

          <div className="card-receber">
            <small>Pendente</small>
            <h2>
              {receitas
                .filter(i => i.status === "Pendente")
                .reduce((t, i) => t + Number(i.valor || 0), 0)
                .toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL"
                })}
            </h2>
          </div>

          <div className="card-receber">
            <small>Recebido</small>
            <h2>
              {receitas
                .filter(i => i.status === "Pago" || i.status === "Recebido")
                .reduce((t, i) => t + Number(i.valor || 0), 0)
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
              <option value="Pago">Recebido</option>
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
                  <td colSpan="6">Nenhum recebimento cadastrado.</td>
                </tr>
              ) : (
                listaFiltrada.map(item => (
                  <tr key={item.id}>
                    <td>{item.categoria || "Outros"}</td>
                    <td>{item.descricao}</td>
                    <td>{formatarData(item.vencimento)}</td>
                    <td>
                      {Number(item.valor || 0).toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL"
                      })}
                    </td>
                    <td>
                      <span className={(item.status === "Pago" || item.status === "Recebido") ? "status recebido" : "status pendente"}>
                        {(item.status === "Pago" || item.status === "Recebido") ? "Recebido" : "Pendente"}
                      </span>
                    </td>
                    <td>
                      {item.status === "Pendente" && (
                        <button
                          className="btn-receber"
                          onClick={() => receberConta(item.id)}
                        >
                          ✓ Confirmar Recebimento
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
                <h2>Novo Lançamento a Receber</h2>
                <button
                  className="fechar-modal"
                  onClick={() => setModalAberto(false)}
                >
                  ✕
                </button>
              </div>

              <input
                placeholder="Cliente *"
                value={novaReceita.cliente}
                onChange={(e) => setNovaReceita({
                  ...novaReceita,
                  cliente: e.target.value
                })}
              />

              <input
                placeholder="Descrição *"
                value={novaReceita.descricao}
                onChange={(e) => setNovaReceita({
                  ...novaReceita,
                  descricao: e.target.value
                })}
              />

              <select
                value={novaReceita.categoria}
                onChange={(e) => setNovaReceita({
                  ...novaReceita,
                  categoria: e.target.value
                })}
              >
                <option value="Vendas">Vendas</option>
                <option value="Serviços">Serviços</option>
                <option value="Rendimentos">Rendimentos</option>
                <option value="Outros">Outros</option>
              </select>

              <input
                placeholder="Valor *"
                value={novaReceita.valor}
                onChange={(e) => {
                  let valor = e.target.value.replace(/\D/g, "");
                  valor = (Number(valor) / 100).toLocaleString("pt-BR", {
                    minimumFractionDigits: 2
                  });
                  setNovaReceita({
                    ...novaReceita,
                    valor
                  });
                }}
              />

              <select
                value={novaReceita.formaRecebimento}
                onChange={(e) => setNovaReceita({
                  ...novaReceita,
                  formaRecebimento: e.target.value
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
                value={novaReceita.vencimento}
                onChange={(e) => setNovaReceita({
                  ...novaReceita,
                  vencimento: e.target.value
                })}
              />

              <textarea
                placeholder="Observação"
                value={novaReceita.observacao}
                onChange={(e) => setNovaReceita({
                  ...novaReceita,
                  observacao: e.target.value
                })}
              />

              <div className="modal-buttons">
                <button
                  className="cancelar"
                  type="button"
                  onClick={() => setModalAberto(false)}
                >
                  Cancelar
                </button>
                <button
                  className="salvar"
                  type="button"
                  onClick={salvarReceita}
                >
                  Salvar Lançamento
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default ContasReceber;