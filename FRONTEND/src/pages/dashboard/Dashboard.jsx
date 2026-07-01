import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TriangleAlert,
  DollarSign,
  TrendingUp,
  TrendingDown,
  ShoppingBag,
  Users,
  Package,
  ArrowUpRight,
  CircleDollarSign,
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import MainLayout from "../../layouts/MainLayout";
import RevenueChart from "../../components/Charts/RevenueChart";
import "./Dashboard.css";

const API = "/api";

function Dashboard() {
  const navigate = useNavigate();

  const [periodoFaturamento, setPeriodoFaturamento] = useState("30");
  const [periodoDespesa, setPeriodoDespesa] = useState("mes");

  const [dataInicialFat, setDataInicialFat] = useState("");
  const [dataFinalFat, setDataFinalFat] = useState("");

  const [dataInicialDesp, setDataInicialDesp] = useState("");
  const [dataFinalDesp, setDataFinalDesp] = useState("");

  const [vendas, setVendas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [contasPagar, setContasPagar] = useState([]);

  const [dashboardResumo, setDashboardResumo] = useState({
    totalProdutos: 0,
    quantidadeEstoque: 0,
    quantidadeEstoqueBaixo: 0,
    estoqueBaixo: [],
    totalVendas: 0,
    faturamento: 0,
    totalClientes: 0,
  });

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    try {
      const empresaId = localStorage.getItem("empresaId");
      const queryParam = `?empresa_id=${empresaId}`;

      const [
        dashboard,
        vendasBanco,
        clientesBanco,
        produtosBanco,
        contasBanco,
      ] = await Promise.all([
        fetch(`${API}/dashboard${queryParam}`, { headers: { "x-empresa-id": empresaId } }).then((r) => r.json()),
        fetch(`${API}/vendas${queryParam}`, { headers: { "x-empresa-id": empresaId } }).then((r) => r.json()),
        fetch(`${API}/clientes${queryParam}`, { headers: { "x-empresa-id": empresaId } }).then((r) => r.json()),
        fetch(`${API}/produtos${queryParam}`, { headers: { "x-empresa-id": empresaId } }).then((r) => r.json()),
        fetch(`${API}/contas-pagar${queryParam}`, { headers: { "x-empresa-id": empresaId } }).then((r) => r.json()),
      ]);

      setDashboardResumo(dashboard || {});
      setVendas(Array.isArray(vendasBanco) ? vendasBanco : []);
      setClientes(Array.isArray(clientesBanco) ? clientesBanco : []);
      setProdutos(Array.isArray(produtosBanco) ? produtosBanco : []);
      setContasPagar(Array.isArray(contasBanco) ? contasBanco : []);
    } catch (erro) {
      console.log("Erro ao carregar dashboard:", erro);
    }
  }

  function formatarMoeda(valor) {
    return Number(valor || 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  function obterDataLimpa(dataRef) {
    if (!dataRef) return "";
    if (typeof dataRef === "string" && dataRef.includes("/") && dataRef.length <= 10) return dataRef;
    try {
      const d = new Date(dataRef);
      if (isNaN(d.getTime())) return "";
      const dia = String(d.getDate()).padStart(2, "0");
      const mes = String(d.getMonth() + 1).padStart(2, "0");
      const ano = d.getFullYear();
      return `${dia}/${mes}/${ano}`;
    } catch (e) {
      return "";
    }
  }

  function converterParaNumero(valor) {
    if (valor === undefined || valor === null || valor === "") return 0;
    if (typeof valor === "number") return valor;
    
    let str = String(valor).trim();
    
    if (str.includes(",") && str.includes(".")) {
      str = str.replace(/\./g, "").replace(",", ".");
    } 
    else if (str.includes(",")) {
      str = str.replace(",", ".");
    }
    
    const n = parseFloat(str);
    return isNaN(n) ? 0 : n;
  }

  const faturamento = vendas
    .filter((venda) => {
      const status = String(venda.statusPagamento ?? venda.status_pagamento ?? venda.statuspagamento ?? venda.status ?? "").toLowerCase();
      return status !== "pendente";
    })
    .reduce((total, venda) => total + converterParaNumero(venda.total), 0);

  const despesas = contasPagar
    .filter((conta) => {
      const situacao = String(conta.situacao ?? conta.situacao_pagamento ?? conta.situacaopagamento ?? conta.status ?? conta.status_pagamento ?? "").toLowerCase();
      return situacao === "pago" || situacao === "quitado";
    })
    .reduce((total, conta) => total + converterParaNumero(conta.valor), 0);

  const lucro = faturamento - despesas;

  const totalVendas = vendas.length;
  const totalClientes = clientes.length;
  const totalProdutos = produtos.length;

  const estoqueBaixo = dashboardResumo.estoqueBaixo || [];
  const quantidadeEstoqueBaixo = dashboardResumo.quantidadeEstoqueBaixo || 0;

  const hojeBr = obterDataLimpa(new Date());
  const ontemObj = new Date();
  ontemObj.setDate(ontemObj.getDate() - 1);
  const ontemBr = obterDataLimpa(ontemObj);

  const vendasHoje = vendas.filter((venda) => obterDataLimpa(venda.data ?? venda.data_venda) === hojeBr);
  const vendasOntem = vendas.filter((venda) => obterDataLimpa(venda.data ?? venda.data_venda) === ontemBr);

  const faturamentoHoje = vendasHoje
    .filter((venda) => {
      const status = String(venda.statusPagamento ?? venda.status_pagamento ?? venda.statuspagamento ?? venda.status ?? "").toLowerCase();
      return status !== "pendente";
    })
    .reduce((total, venda) => total + converterParaNumero(venda.total), 0);

  const faturamentoOntem = vendasOntem
    .filter((venda) => {
      const status = String(venda.statusPagamento ?? venda.status_pagamento ?? venda.statuspagamento ?? venda.status ?? "").toLowerCase();
      return status !== "pendente";
    })
    .reduce((total, venda) => total + converterParaNumero(venda.total), 0);

  const percentualFaturamento =
    faturamentoOntem === 0
      ? (faturamentoHoje > 0 ? 100 : 0)
      : (((faturamentoHoje - faturamentoOntem) / faturamentoOntem) * 100).toFixed(0);

  const vendasRealizadasHoje = vendasHoje.length;
  const percentualVendas =
    vendasOntem.length === 0
      ? (vendasRealizadasHoje > 0 ? 100 : 0)
      : (((vendasRealizadasHoje - vendasOntem.length) / vendasOntem.length) * 100).toFixed(0);

  const clientesHoje = clientes.filter((cliente) => {
    const dataRef = cliente.ultimaCompra ?? cliente.ultima_compra ?? cliente.created_at ?? cliente.data_cadastro;
    return obterDataLimpa(dataRef) === hojeBr;
  }).length;

  const clientesOntem = clientes.filter((cliente) => {
    const dataRef = cliente.ultimaCompra ?? cliente.ultima_compra ?? cliente.created_at ?? cliente.data_cadastro;
    return obterDataLimpa(dataRef) === ontemBr;
  }).length;

  const percentualClientes =
    clientesOntem === 0
      ? (clientesHoje > 0 ? 100 : 0)
      : (((clientesHoje - clientesOntem) / clientesOntem) * 100).toFixed(0);

  const vendasFiltradas = vendas.filter((venda) => {
    const status = String(venda.statusPagamento ?? venda.status_pagamento ?? venda.statuspagamento ?? venda.status ?? "").toLowerCase();
    if (status === "pendente") return false;

    const dataRef = venda.data ?? venda.data_venda;
    if (!dataRef) return false;
    const dataVenda = new Date(dataRef);
    const hojeData = new Date();

    if (periodoFaturamento === "7") {
      const seteDiasAtras = new Date();
      seteDiasAtras.setDate(hojeData.getDate() - 7);
      return dataVenda >= seteDiasAtras;
    }
    if (periodoFaturamento === "15") {
      const quinzeDiasAtras = new Date();
      quinzeDiasAtras.setDate(hojeData.getDate() - 15);
      return dataVenda >= quinzeDiasAtras;
    }
    if (periodoFaturamento === "30") {
      const trintaDiasAtras = new Date();
      trintaDiasAtras.setDate(hojeData.getDate() - 30);
      return dataVenda >= trintaDiasAtras;
    }
    if (periodoFaturamento === "mes") {
      return (
        dataVenda.getMonth() === hojeData.getMonth() &&
        dataVenda.getFullYear() === hojeData.getFullYear()
      );
    }
    if (periodoFaturamento === "anterior") {
      const mesAnterior = hojeData.getMonth() - 1;
      const anoAnterior = mesAnterior === -1 ? hojeData.getFullYear() - 1 : hojeData.getFullYear();
      const mesAjustado = mesAnterior === -1 ? 11 : mesAnterior;
      return dataVenda.getMonth() === mesAjustado && dataVenda.getFullYear() === anoAnterior;
    }
    if (periodoFaturamento === "personalizado") {
      if (!dataInicialFat || !dataFinalFat) return true;
      const inicio = new Date(dataInicialFat);
      const fim = new Date(dataFinalFat);
      return dataVenda >= inicio && dataVenda <= fim;
    }
    return true;
  });

  const dadosGrafico = [];
  const faturamentoPorDia = {};

  vendasFiltradas.forEach((venda) => {
    const dataRef = venda.data ?? venda.data_venda;
    if (!dataRef) return;
    const dia = new Date(dataRef).getDate().toString().padStart(2, "0");
    const totalVenda = converterParaNumero(venda.total);
    faturamentoPorDia[dia] = (faturamentoPorDia[dia] || 0) + totalVenda;
  });

  Object.keys(faturamentoPorDia)
    .sort()
    .forEach((dia) => {
      dadosGrafico.push({
        name: `Dia ${dia}`,
        valor: faturamentoPorDia[dia],
      });
    });

  if (dadosGrafico.length === 0) {
    dadosGrafico.push({ name: "Sem vendas", valor: 0 });
  }

  const despesasPorCategoria = {};
  contasPagar
    .filter((conta) => {
      const situacao = String(conta.situacao ?? conta.situacao_pagamento ?? conta.situacaopagamento ?? conta.status ?? conta.status_pagamento ?? "").toLowerCase();
      return situacao === "pago" || situacao === "quitado";
    })
    .forEach((conta) => {
      const valor = converterParaNumero(conta.valor);
      const categoria = conta.categoria || "Geral";
      despesasPorCategoria[categoria] = (despesasPorCategoria[categoria] || 0) + valor;
    });

  const despesasCategoria = Object.keys(despesasPorCategoria).map((categoria) => [
    categoria,
    despesasPorCategoria[categoria],
  ]);

  const gerarCor = (texto) => {
    let hash = 0;
    const stringTexto = String(texto || "");
    for (let i = 0; i < stringTexto.length; i++) {
      hash = stringTexto.charCodeAt(i) + ((hash << 5) - hash);
    }
    const c = (hash & 0x00ffffff).toString(16).toUpperCase();
    return "#" + "00000".substring(0, 6 - c.length) + c;
  };

  let produtoMaisVendido = "-";
  const contadorProdutos = {};

  vendas.forEach((venda) => {
    const itens = venda.itens || [];
    itens.forEach((item) => {
      const nomeItem = item.nome || item.produto_nome;
      if (!nomeItem) return;
      const qtd = Number(item.quantidade || 0);
      contadorProdutos[nomeItem] = (contadorProdutos[nomeItem] || 0) + qtd;
    });
  });

  let maiorQuantidade = 0;
  Object.keys(contadorProdutos).forEach((nome) => {
    if (contadorProdutos[nome] > maiorQuantidade) {
      maiorQuantidade = contadorProdutos[nome];
      produtoMaisVendido = nome;
    }
  });

  return (
    <MainLayout>
      <section className="dashboard">
        {quantidadeEstoqueBaixo > 0 && (
          <div className="stock-alert-banner">
            <div className="stock-alert-info">
              <TriangleAlert size={24} className="alert-icon" />
              <div>
                <strong>⚠ Atenção!</strong>
                <span>
                  {quantidadeEstoqueBaixo === 1
                    ? `${estoqueBaixo[0]?.nome || "Um produto"} está abaixo do estoque mínimo.`
                    : `${quantidadeEstoqueBaixo} produtos estão abaixo do estoque mínimo.`}
                </span>
              </div>
            </div>
            <button onClick={() => navigate("/produtos/lista")}>Ver Produtos</button>
          </div>
        )}

        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-icon purple">
              <DollarSign size={22} />
            </div>
            <span>Faturamento</span>
            <strong>{formatarMoeda(faturamento)}</strong>
            <p className={Number(percentualFaturamento) >= 0 ? "positive" : "negative"}>
              {Number(percentualFaturamento) >= 0 ? (
                <TrendingUp size={20} strokeWidth={3.5} />
              ) : (
                <TrendingDown size={20} strokeWidth={3.5} />
              )}
              {Number(percentualFaturamento) >= 0 ? "+" : ""}
              {percentualFaturamento}% em relação a ontem
            </p>
          </div>

          <div className="metric-card">
            <div className="metric-icon green">
              <TrendingUp size={22} />
            </div>
            <span>Lucro</span>
            <strong>{formatarMoeda(lucro)}</strong>
            <p className="neutral">Receita - Despesas</p>
          </div>

          <div className="metric-card">
            <div className="metric-icon red">
              <TrendingDown size={22} />
            </div>
            <span>Despesas</span>
            <strong>{formatarMoeda(despesas)}</strong>
            <p className="neutral">Total pago</p>
          </div>

          <div className="metric-card">
            <div className="metric-icon blue">
              <ShoppingBag size={22} />
            </div>
            <span>Vendas</span>
            <strong>{totalVendas}</strong>
            <p className={Number(percentualVendas) >= 0 ? "positive" : "negative"}>
              {Number(percentualVendas) >= 0 ? (
                <TrendingUp size={20} strokeWidth={3.5} />
              ) : (
                <TrendingDown size={20} strokeWidth={3.5} />
              )}
              {Number(percentualVendas) >= 0 ? "+" : ""}
              {percentualVendas}% hoje
            </p>
          </div>

          <div className="metric-card">
            <div className="metric-icon orange">
              <Users size={22} />
            </div>
            <span>Clientes</span>
            <strong>{totalClientes}</strong>
            <p className={Number(percentualClientes) >= 0 ? "positive" : "negative"}>
              {Number(percentualClientes) >= 0 ? (
                <TrendingUp size={20} strokeWidth={3.5} />
              ) : (
                <TrendingDown size={20} strokeWidth={3.5} />
              )}
              {Number(percentualClientes) >= 0 ? "+" : ""}
              {percentualClientes}% hoje
            </p>
          </div>

          <div className="metric-card">
            <div className="metric-icon cyan">
              <Package size={22} />
            </div>
            <span>Produtos</span>
            <strong>{totalProdutos}</strong>
            <p className="negative">
              <TrendingDown size={20} strokeWidth={3.5} />
              {quantidadeEstoqueBaixo} estoque baixo
            </p>
          </div>
        </div>

        <div className="dashboard-row">
          <div className="panel chart-panel">
            <div className="panel-title">
              <div>
                <h2>Faturamento</h2>
                <strong>{formatarMoeda(faturamentoHoje)}</strong>
                <p>
                  {Number(percentualFaturamento) >= 0 ? "+" : ""}
                  {percentualFaturamento}% em relação a ontem
                </p>
              </div>

              <div className="filter-box">
                <select
                  className="date-filter"
                  value={periodoFaturamento}
                  onChange={(e) => setPeriodoFaturamento(e.target.value)}
                >
                  <option value="7">Últimos 7 dias</option>
                  <option value="15">Últimos 15 dias</option>
                  <option value="30">Últimos 30 dias</option>
                  <option value="mes">Este mês</option>
                  <option value="anterior">Mês passado</option>
                  <option value="personalizado">Personalizado</option>
                </select>

                {periodoFaturamento === "personalizado" && (
                  <div className="custom-date-filter">
                    <input
                      type="date"
                      value={dataInicialFat}
                      onChange={(e) => setDataInicialFat(e.target.value)}
                    />
                    <input
                      type="date"
                      value={dataFinalFat}
                      onChange={(e) => setDataFinalFat(e.target.value)}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="line-chart">
              <RevenueChart data={dadosGrafico} />
            </div>
          </div>

          <div className="panel summary-panel">
            <h2>Resumo do dia</h2>

            <div className="summary-item">
              <CircleDollarSign size={20} />
              <div>
                <strong>{formatarMoeda(faturamentoHoje)}</strong>
                <span>Faturamento hoje</span>
              </div>
              <ArrowUpRight size={18} />
            </div>

            <div className="summary-item">
              <ShoppingBag size={20} />
              <div>
                <strong>{vendasRealizadasHoje}</strong>
                <span>Vendas realizadas</span>
              </div>
              <ArrowUpRight size={18} />
            </div>

            <div className="summary-item">
              <Users size={20} />
              <div>
                <strong>{clientesHoje}</strong>
                <span>Novos clientes</span>
              </div>
              <ArrowUpRight size={18} />
            </div>

            <div className="summary-item">
              <Package size={20} />
              <div>
                <strong>{produtoMaisVendido}</strong>
                <span>Produto mais vendido</span>
              </div>
              <ArrowUpRight size={18} />
            </div>
          </div>
        </div>

        <div className="dashboard-row bottom">
          <div className="panel">
            <div className="panel-title">
              <h2>Últimas vendas</h2>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Produto</th>
                  <th>Pagamento</th>
                  <th>Valor</th>
                  <th>Data</th>
                </tr>
              </thead>
              <tbody>
                {vendas.slice(0, 3).map((venda) => (
                  <tr key={venda.id}>
                    <td>{venda.cliente || "Consumidor"}</td>
                    <td>{venda.itens ? venda.itens.map((i) => i.nome || i.produto_nome || "Item").join(", ") : "-"}</td>
                    <td>{venda.formaPagamento ?? venda.forma_ganho ?? venda.forma_pagamento ?? "Dinheiro"}</td>
                    <td>{formatarMoeda(venda.total)}</td>
                    <td>{obterDataLimpa(venda.data ?? venda.data_venda)}</td>
                  </tr>
                ))}
                {vendas.length === 0 && (
                  <tr>
                    <td colSpan="5" style={{ textAlign: "center", color: "#64748b" }}>Nenhuma venda realizada.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="panel">
            <div className="panel-title">
              <h2>Despesas por categoria</h2>

              <div className="filter-box">
                <select
                  className="date-filter"
                  value={periodoDespesa}
                  onChange={(e) => setPeriodoDespesa(e.target.value)}
                >
                  <option value="7">Últimos 7 dias</option>
                  <option value="15">Últimos 15 dias</option>
                  <option value="30">Últimos 30 dias</option>
                  <option value="mes">Este mês</option>
                  <option value="anterior">Mês passado</option>
                  <option value="personalizado">Personalizado</option>
                </select>

                {periodoDespesa === "personalizado" && (
                  <div className="custom-date-filter">
                    <input
                      type="date"
                      value={dataInicialDesp}
                      onChange={(e) => setDataInicialDesp(e.target.value)}
                    />
                    <input
                      type="date"
                      value={dataFinalDesp}
                      onChange={(e) => setDataFinalDesp(e.target.value)}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="donut-area">
              <div style={{ width: 220, height: 220, position: "relative" }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={despesasCategoria.length > 0 ? despesasCategoria.map(([categoria, valor]) => ({
                        name: categoria,
                        value: valor,
                      })) : [{ name: "Sem despesas", value: 1 }]}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={90}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {despesasCategoria.length > 0 ? despesasCategoria.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={gerarCor(despesasCategoria[index][0])} />
                      )) : <Cell fill="#cbd5e1" />}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>

                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    textAlign: "center",
                    fontWeight: "600",
                  }}
                >
                  <div>Total</div>
                  <div>{formatarMoeda(despesas)}</div>
                </div>
              </div>

              <div className="legend">
                {despesasCategoria.map(([categoria, valor], index) => (
                  <p key={index}>
                    <span className="dot" style={{ backgroundColor: gerarCor(categoria) }}></span>
                    {categoria}
                    <strong>{formatarMoeda(valor)}</strong>
                  </p>
                ))}
                {despesasCategoria.length === 0 && <p style={{ color: "#64748b" }}>Nenhuma despesa paga.</p>}
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}

export default Dashboard;