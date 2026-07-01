import { useEffect, useState } from "react";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import "./ListaProdutos.css";

const API = "http://localhost:3001";

function ListaProdutos() {
  const navigate = useNavigate();

  const [produtos, setProdutos] = useState([]);
  const [pesquisa, setPesquisa] = useState("");
  const [modalExcluir, setModalExcluir] = useState(false);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);

  useEffect(() => {
    carregarProdutos();
  }, []);

  async function carregarProdutos() {
    try {
      const empresaId = localStorage.getItem("empresaId");
      const resposta = await fetch(`${API}/produtos?empresa_id=${empresaId}`, {
        headers: { "x-empresa-id": empresaId }
      });
      const dados = await resposta.json();
      setProdutos(Array.isArray(dados) ? dados : []);
    } catch (erro) {
      console.log("Erro ao carregar produtos:", erro);
      alert("Erro ao carregar produtos do banco de dados.");
    }
  }

  function abrirModalExcluir(produto) {
    setProdutoSelecionado(produto);
    setModalExcluir(true);
  }

 async function excluirProduto() {
    if (!produtoSelecionado) return;
    try {
      const empresaId = localStorage.getItem("empresaId");
      const resposta = await fetch(`${API}/produtos/${produtoSelecionado.id}`, {
        method: "DELETE",
        headers: { "x-empresa-id": empresaId }
      });

      if (resposta.ok) {
        setModalExcluir(false);
        setProdutoSelecionado(null);
        carregarProdutos();
      } else {
        alert("Erro ao excluir produto.");
      }
    } catch (erro) {
      console.log(erro);
    }
  }

  const produtosFiltrados = produtos.filter((produto) => {
    const termo = pesquisa.toLowerCase();
    return (
      (produto.nome && produto.nome.toLowerCase().includes(termo)) ||
      (produto.identificacao && String(produto.identificacao).includes(termo))
    );
  });

  return (
    <MainLayout>
      <div className="product-list-page">
        <div className="product-list-header">
          <div>
            <h1>Produtos</h1>
            <p>Gerencie o estoque e preços dos seus produtos.</p>
          </div>
          <button
            className="new-product-btn"
            onClick={() => navigate("/produtos/cadastrar")}
          >
            <Plus size={20} />
            Novo Produto
          </button>
        </div>

        <div className="search-card">
          <div className="search-box">
            <Search size={20} color="#64748b" />
            <input
              type="text"
              placeholder="Buscar por nome ou código..."
              value={pesquisa}
              onChange={(e) => setPesquisa(e.target.value)}
            />
          </div>
        </div>

        <div className="table-card">
          <table>
            <thead>
              <tr>
                <th>Código</th>
                <th>Nome</th>
                <th>Marca / Categoria</th>
                <th>Preço Venda</th>
                <th>Estoque</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {produtosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", color: "#64748b" }}>
                    Nenhum produto encontrado.
                  </td>
                </tr>
              ) : (
                produtosFiltrados.map((produto, index) => {
                  const codigoUrl = produto.id || produto.identificacao;

                  return (
                    <tr key={index}>
                      <td>#{produto.identificacao}</td>
                      <td>
                        <strong>{produto.nome}</strong>
                      </td>
                      <td>
                        <span className="badge-marca" style={{ marginRight: '8px', background: '#f1f5f9', padding: '4px 8px', borderRadius: '6px', fontSize: '12px' }}>
                          {produto.marca || produto.marca_nome || produto.nome_marca || "Sem Marca"}
                        </span>
                        <span className="badge-categoria" style={{ background: '#f1f5f9', padding: '4px 8px', borderRadius: '6px', fontSize: '12px' }}>
                          {produto.categoria || produto.categoria_nome || produto.nome_categoria || "Sem Cat."}
                        </span>
                      </td>
                      <td>
                        {/* Mapeado para o preco_venda com underline que vem do seu banco */}
                        {Number(produto.preco_venda || produto.precoVenda || 0).toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </td>
                      <td>
                        {produto.estoque || 0} {produto.unidade || "UN"}
                      </td>
                      <td>
                        <button
                          className="action-btn"
                          type="button"
                          onClick={() => navigate(`/produtos/cadastrar?id=${codigoUrl}`)}
                        >
                          <Pencil size={18} />
                        </button>

                        <button
                          className="action-btn delete"
                          type="button"
                          onClick={() => abrirModalExcluir(produto)}
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalExcluir && produtoSelecionado && (
        <div className="modal-overlay">
          <div className="simple-modal">
            <h2>Excluir Produto</h2>
            <p>
              Deseja realmente excluir <strong>{produtoSelecionado.nome}</strong>?
            </p>
            <div className="modal-buttons">
              <button type="button" onClick={() => setModalExcluir(false)}>Cancelar</button>
              <button type="button" onClick={excluirProduto}>Excluir</button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}

export default ListaProdutos;