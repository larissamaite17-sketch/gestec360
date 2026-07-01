import { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import "./Devolucao.css";

const API = "/api";

const empresa_id = localStorage.getItem("empresaId");

function Devolucao() {
  const [vendas, setVendas] = useState([]);
  const [busca, setBusca] = useState("");

  const [modalDevolucao, setModalDevolucao] = useState(false);
  const [vendaSelecionada, setVendaSelecionada] = useState(null);
  const [produtoSelecionado, setProdutoSelecionado] = useState("");
  const [quantidade, setQuantidade] = useState(1);
  const [motivo, setMotivo] = useState("");

  useEffect(() => {
    carregarVendas();
  }, []);

  async function carregarVendas() {
    try {
      const resposta = await fetch(`${API}/vendas?empresa_id=${empresa_id}`,{
        headers:{
          "x-empresa-id":empresa_id
        }
      });
      const dados = await resposta.json();
      setVendas(dados);
    } catch (erro) {
      console.log(erro);
    }
  }

  function formatarMoeda(valor) {
    return Number(valor || 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  const vendasFiltradas = vendas.filter((venda) =>
    String(venda.numero_pedido).includes(busca)
  );

  async function confirmarDevolucao() {
    const produto = vendaSelecionada.itens.find(
      (item) => String(item.produto_id) === String(produtoSelecionado)
    );

    if (!produto) {
      alert("Selecione um produto.");
      return;
    }

    if (!motivo.trim()) {
      alert("Informe o motivo da devolução.");
      return;
    }

    const quantidadeNumero = Number(quantidade);

    if (quantidadeNumero < 1 || quantidadeNumero > Number(produto.quantidade)) {
      alert("Quantidade inválida.");
      return;
    }

    const valorUnitario = Number(produto.valor_unitario || 0);
    const valorDevolucao = valorUnitario * quantidadeNumero;

    try {
      const respostaDevolucao = await fetch(`${API}/devolucoes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-empresa-id": empresa_id,
        },
        body: JSON.stringify({
          empresa_id,
          venda_id: vendaSelecionada.id,
          numero_pedido: vendaSelecionada.numero_pedido,
          produto_id: produto.produto_id,
          produto_nome: produto.nome,
          quantidade: quantidadeNumero,
          valor: valorDevolucao,
          motivo,
        }),
      });

      if (!respostaDevolucao.ok) {
        const erro = await respostaDevolucao.json();
        alert(erro.erro || "Erro ao registrar devolução.");
        return;
      }

      const respostaStatus = await fetch(
        `${API}/vendas/${vendaSelecionada.id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-empresa-id": empresa_id,
          },
          body: JSON.stringify({
            empresa_id,
            status:
              quantidadeNumero === Number(produto.quantidade)
                ? "Devolvida"
                : "Devolução Parcial",
          }),
        }
      );

      if (!respostaStatus.ok) {
        const erro = await respostaStatus.json();
        alert(erro.erro || "Erro ao atualizar status da venda.");
        return;
      }

      await carregarVendas();

      setModalDevolucao(false);
      setVendaSelecionada(null);
      setProdutoSelecionado("");
      setQuantidade(1);
      setMotivo("");
    } catch (erro) {
      console.log(erro);
      alert("Erro ao conectar com o servidor.");
    }
  }

  return (
    <MainLayout>
      <div className="return-page">
        <div className="return-header">
          <h1>Devolução</h1>
          <p>Busque uma venda para registrar devolução</p>
        </div>

        <div className="return-card">
          <div className="return-search">
            <label>Buscar venda</label>
            <input
              type="text"
              placeholder="Digite o número do pedido..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>

          <table className="return-table">
            <thead>
              <tr>
                <th>Pedido</th>
                <th>Cliente</th>
                <th>Tipo</th>
                <th>Total</th>
                <th>Ação</th>
              </tr>
            </thead>

            <tbody>
              {vendasFiltradas.map((venda) => (
                <tr key={venda.id}>
                  <td>PDV-{String(venda.numero_pedido).padStart(3, "0")}</td>
                  <td>{venda.cliente || "-"}</td>
                  <td>{venda.tipo_venda}</td>
                  <td>{formatarMoeda(venda.total)}</td>
                  <td>
                    <button
                      className="return-btn"
                      onClick={() => {
                        setVendaSelecionada(venda);
                        setModalDevolucao(true);
                      }}
                    >
                      Registrar devolução
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {modalDevolucao && (
          <div className="return-modal-overlay">
            <div className="return-modal">
              <h2>Registrar devolução</h2>

              <p className="return-order">
                Pedido PDV-
                {String(vendaSelecionada?.numero_pedido).padStart(3, "0")}
              </p>

              <label>Produto</label>
              <select
                value={produtoSelecionado}
                onChange={(e) => setProdutoSelecionado(e.target.value)}
              >
                <option value="">Selecione o produto</option>

                {vendaSelecionada?.itens?.map((item) => (
                  <option key={item.produto_id} value={item.produto_id}>
                    {item.nome} ({item.quantidade}x)
                  </option>
                ))}
              </select>

              <label>Quantidade</label>
              <input
                type="number"
                min="1"
                value={quantidade}
                onChange={(e) => setQuantidade(e.target.value)}
              />

              <label>Motivo da devolução</label>
              <textarea
                placeholder="Ex: Cliente desistiu, produto errado..."
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
              />

              <div className="return-modal-actions">
                <button
                  className="cancel-btn"
                  onClick={() => {
                    setModalDevolucao(false);
                    setVendaSelecionada(null);
                    setProdutoSelecionado("");
                    setQuantidade(1);
                    setMotivo("");
                  }}
                >
                  Cancelar
                </button>

                <button className="confirm-btn" onClick={confirmarDevolucao}>
                  Confirmar devolução
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default Devolucao;