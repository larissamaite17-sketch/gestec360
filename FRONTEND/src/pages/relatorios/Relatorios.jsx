import { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import "./Relatorios.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const API = "http://localhost:3001";

const empresaId = localStorage.getItem("empresaId");

function Relatorios() {

  const [aba, setAba] = useState("vendas");

  const [vendas, setVendas] = useState([]);
  const [financeiro, setFinanceiro] = useState({
    receitas: [],
    despesas: []
  });
  const [produtos, setProdutos] = useState([]);

  const [dataInicial, setDataInicial] = useState("");
  const [dataFinal, setDataFinal] = useState("");

  useEffect(() => {
    carregarRelatorio();
  }, [aba]);

  async function carregarRelatorio() {

    try {

      if (aba === "vendas") {

        const resposta = await fetch(`${API}/relatorios/vendas?empresa_id=${empresaId}`, { headers:{ "x-empresa-id": empresaId } });
        setVendas(await resposta.json());

      }

      if (aba === "financeiro") {

        const resposta = await fetch(`${API}/relatorios/financeiro?empresa_id=${empresaId}`, { headers:{ "x-empresa-id": empresaId } });
        setFinanceiro(await resposta.json());

      }

      if (aba === "produtos") {

        const resposta = await fetch(`${API}/relatorios/produtos?empresa_id=${empresaId}`, { headers:{ "x-empresa-id": empresaId } });
        setProdutos(await resposta.json());

      }

    } catch (erro) {

      console.log(erro);

    }

  }

  function exportarPDF() {

    const pdf = new jsPDF();

    pdf.setFontSize(18);
    pdf.text("Gestec360 - Relatório", 14, 18);

    if (aba === "vendas") {

      autoTable(pdf, {

        startY: 28,

        head: [[
          "Data",
          "Cliente",
          "Pagamento",
          "Total"
        ]],

        body: vendas.map(v => [

          new Date(v.data_venda).toLocaleDateString("pt-BR"),

          v.cliente || "-",

          v.forma_pagamento,

          Number(v.total).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
          })

        ])

      });

      pdf.save("relatorio-vendas.pdf");
      return;

    }

    if (aba === "financeiro") {

      autoTable(pdf, {

        startY: 28,

        head: [[
          "Data",
          "Descrição",
          "Tipo",
          "Valor"
        ]],

        body: [
          ...financeiro.receitas,
          ...financeiro.despesas
        ].map(item => [

          new Date(item.data).toLocaleDateString("pt-BR"),

          item.descricao,

          item.tipo,

          Number(item.valor).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
          })

        ])

      });

      pdf.save("relatorio-financeiro.pdf");
      return;

    }

    autoTable(pdf, {

      startY: 28,

      head: [[
        "Produto",
        "Qtd Vendida",
        "Faturamento"
      ]],

      body: produtos.map(produto => [

        produto.nome,

        produto.quantidade_vendida,

        Number(produto.faturamento).toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL"
        })

      ])

    });

    pdf.save("relatorio-produtos.pdf");

  }

  return (

      <MainLayout>

      <div className="relatorios-page">

        <div className="relatorios-header">

          <div>

            <h1>Relatórios</h1>

            <p>
              Visualize todas as informações do sistema em um único lugar.
            </p>

          </div>

        </div>

        <div className="abas">

          <button
            className={aba==="vendas"?"ativa":""}
            onClick={()=>setAba("vendas")}
          >
            Vendas
          </button>

          <button
            className={aba==="financeiro"?"ativa":""}
            onClick={()=>setAba("financeiro")}
          >
            Financeiro
          </button>

          <button
            className={aba==="produtos"?"ativa":""}
            onClick={()=>setAba("produtos")}
          >
            Produtos
          </button>

        </div>

        <div className="filtros">

          <input
            type="date"
            value={dataInicial}
            onChange={(e)=>setDataInicial(e.target.value)}
          />

          <input
            type="date"
            value={dataFinal}
            onChange={(e)=>setDataFinal(e.target.value)}
          />

          <button onClick={exportarPDF}>
            Exportar PDF
          </button>

        </div>

        <div className="relatorio-card">

          {aba==="vendas" && (

            <div className="relatorio-conteudo">

              <h2>Relatório de Vendas</h2>

              <table>

                <thead>

                  <tr>

                    <th>Data</th>

                    <th>Cliente</th>

                    <th>Pagamento</th>

                    <th>Total</th>

                  </tr>

                </thead>

                <tbody>

                  {vendas.length===0 ? (

                    <tr>

                      <td colSpan="4">
                        Nenhuma venda encontrada.
                      </td>

                    </tr>

                  ) : (

                    vendas.map((venda,index)=>(

                      <tr key={index}>

                        <td>
                          {new Date(venda.data_venda).toLocaleDateString("pt-BR")}
                        </td>

                        <td>
                          {venda.cliente || "-"}
                        </td>

                        <td>
                          {venda.forma_pagamento}
                        </td>

                        <td>
                          {Number(venda.total).toLocaleString("pt-BR",{
                            style:"currency",
                            currency:"BRL"
                          })}
                        </td>

                      </tr>

                    ))

                  )}

                </tbody>

              </table>

            </div>

          )}

          {aba==="financeiro" && (

            <div className="relatorio-conteudo">

              <h2>Relatório Financeiro</h2>

              <table>

                <thead>

                  <tr>

                    <th>Data</th>

                    <th>Descrição</th>

                    <th>Tipo</th>

                    <th>Valor</th>

                  </tr>

                </thead>

                <tbody>

                  {[

                    ...financeiro.receitas,
                    ...financeiro.despesas

                  ].length===0 ? (

                    <tr>

                      <td colSpan="4">

                        Nenhuma movimentação encontrada.

                      </td>

                    </tr>

                  ) : (

                    [

                      ...financeiro.receitas,
                      ...financeiro.despesas

                    ].map((item,index)=>(

                      <tr key={index}>

                        <td>
                          {new Date(item.data).toLocaleDateString("pt-BR")}
                        </td>

                        <td>
                          {item.descricao}
                        </td>

                        <td>
                          {item.tipo}
                        </td>

                        <td>
                          {Number(item.valor).toLocaleString("pt-BR",{
                            style:"currency",
                            currency:"BRL"
                          })}
                        </td>

                      </tr>

                    ))

                  )}

                </tbody>

              </table>

            </div>

          )}

                    {aba==="produtos" && (

            <div className="relatorio-conteudo">

              <h2>Produtos Mais Vendidos</h2>

              <table>

                <thead>

                  <tr>

                    <th>Produto</th>

                    <th>Quantidade</th>

                    <th>Faturamento</th>

                  </tr>

                </thead>

                <tbody>

                  {produtos.length===0 ? (

                    <tr>

                      <td colSpan="3">

                        Nenhum produto encontrado.

                      </td>

                    </tr>

                  ) : (

                    produtos.map(produto=>(

                      <tr key={produto.id}>

                        <td>{produto.nome}</td>

                        <td>{produto.quantidade_vendida}</td>

                        <td>
                          {Number(produto.faturamento).toLocaleString("pt-BR",{
                            style:"currency",
                            currency:"BRL"
                          })}
                        </td>

                      </tr>

                    ))

                  )}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>

    </MainLayout>

  );

}

export default Relatorios;