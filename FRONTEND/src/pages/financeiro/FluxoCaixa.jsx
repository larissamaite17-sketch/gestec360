import MainLayout from "../../layouts/MainLayout";
import "./FluxoCaixa.css";
import { useEffect, useMemo, useState } from "react";

function FluxoCaixa() {
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [pesquisa, setPesquisa] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState("Todos");
  const [dataInicial, setDataInicial] = useState("");
  const [dataFinal, setDataFinal] = useState("");

  useEffect(() => {
    async function carregarFluxoCaixa() {
      try {
        const empresaId = localStorage.getItem("empresaId");
        const resposta = await fetch(`/api/fluxo-caixa?empresa_id=${empresaId}`);
        const dados = await resposta.json();

        const listaFormatada = dados.map((item) => ({
          id: item.id,
          data: item.data_movimento,
          descricao: item.descricao,
          tipo: item.tipo,
          valor: Number(item.valor || 0),
        }));

        setMovimentacoes(listaFormatada);
      } catch (erro) {
        console.log("Erro ao carregar fluxo de caixa:", erro);
        setMovimentacoes([]);
      }
    }

    carregarFluxoCaixa();
  }, []);

  const entradas = useMemo(() => {
    return movimentacoes
      .filter(i => i.tipo === "Entrada")
      .reduce((t, i) => t + i.valor, 0);
  }, [movimentacoes]);

  const saidas = useMemo(() => {
    return movimentacoes
      .filter(i => i.tipo === "Saída")
      .reduce((t, i) => t + i.valor, 0);
  }, [movimentacoes]);

  const saldo = entradas - saidas;

  function moeda(v) {
    return v.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    });
  }

  const movimentacoesFiltradas = movimentacoes.filter(item => {
    const descricao = item.descricao.toLowerCase();
    const pesquisaLower = pesquisa.toLowerCase();
    const data = item.data.split("T")[0];

    const passouPesquisa = descricao.includes(pesquisaLower);
    const passouTipo = tipoFiltro === "Todos" || item.tipo === tipoFiltro.slice(0, -1);
    const passouDataInicial = !dataInicial || data >= dataInicial;
    const passouDataFinal = !dataFinal || data <= dataFinal;

    return passouPesquisa && passouTipo && passouDataInicial && passouDataFinal;
  });

  return (
    <MainLayout>
      <div className="caixa-page">
        <div className="caixa-header">
          <div>
            <h1>Fluxo de Caixa</h1>
            <p>Acompanhe entradas, saídas e saldo financeiro da empresa.</p>
          </div>
        </div>

        <div className="cards-caixa tres-cards">
          <div className="card-caixa entrada">
            <small>Entradas</small>
            <h2>{moeda(entradas)}</h2>
          </div>

          <div className="card-caixa saida">
            <small>Saídas</small>
            <h2>{moeda(saidas)}</h2>
          </div>

          <div className="card-caixa saldo">
            <small>Saldo Atual</small>
            <h2>{moeda(saldo)}</h2>
          </div>
        </div>

        <div className="movimentacoes">
          <div className="mov-header">
            <h2>Movimentações</h2>
          </div>

          <div className="filtros-caixa">
            <input
              type="text"
              placeholder="Pesquisar movimentação..."
              value={pesquisa}
              onChange={(e) => setPesquisa(e.target.value)}
            />
            <input
              type="date"
              value={dataInicial}
              onChange={(e) => setDataInicial(e.target.value)}
            />
            <input
              type="date"
              value={dataFinal}
              onChange={(e) => setDataFinal(e.target.value)}
            />
            <select
              value={tipoFiltro}
              onChange={(e) => setTipoFiltro(e.target.value)}
            >
              <option>Todos</option>
              <option>Entradas</option>
              <option>Saídas</option>
            </select>
          </div>

          <table>
            <thead>
              <tr>
                <th>Data</th>
                <th>Descrição</th>
                <th>Tipo</th>
                <th>Valor</th>
                <th>Saldo</th>
              </tr>
            </thead>
            <tbody>
              {movimentacoes.length === 0 ? (
                <tr>
                  <td colSpan="5">Nenhuma movimentação encontrada.</td>
                </tr>
              ) : (
                movimentacoesFiltradas.map((item, index) => (
                  <tr key={index}>
                    <td>{new Date(item.data).toLocaleDateString("pt-BR")}</td>
                    <td>{item.descricao}</td>
                    <td>{item.tipo}</td>
                    <td>{moeda(item.valor)}</td>
                    <td>
                      {item.tipo === "Entrada" ? (
                        <span style={{ color: "#16a34a" }}>+ {moeda(item.valor)}</span>
                      ) : (
                        <span style={{ color: "#dc2626" }}>- {moeda(item.valor)}</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </MainLayout>
  );
}

export default FluxoCaixa;