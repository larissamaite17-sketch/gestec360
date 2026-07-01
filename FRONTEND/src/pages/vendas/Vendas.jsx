import { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import { Search, Plus, Minus, Trash2, X } from "lucide-react";
import "./Vendas.css";

function Vendas() {
  const [produtos, setProdutos] = useState([]);
  const [busca, setBusca] = useState("");
  const [carrinho, setCarrinho] = useState([]);

  const [modalAberto, setModalAberto] = useState(false);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [selecionados, setSelecionados] = useState({});
  const [observacao, setObservacao] = useState("");
  const [erroModal, setErroModal] = useState("");

  useEffect(() => {
    const listaProdutos = JSON.parse(localStorage.getItem("produtos")) || [];
    setProdutos(listaProdutos);
  }, []);

  const produtosFiltrados = produtos.filter((produto) =>
    produto.nome?.toLowerCase().includes(busca.toLowerCase())
  );

  function formatarPreco(valor) {
    return Number(valor || 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

 function produtoTemComplementos(produto) {
  const config =
    produto.configComplementos ||
    produto.complementosConfig ||
    produto.gruposComplementos ||
    produto.complementosProduto ||
    [];

  if (Array.isArray(config)) {
    return config.length > 0;
  }

  if (typeof config === "object" && config !== null) {
    return Object.keys(config).length > 0;
  }

  return false;
}

function clicarProduto(produto) {
  const config =
    produto.configComplementos ||
    produto.complementosConfig ||
    produto.gruposComplementos ||
    produto.complementosProduto ||
    [];

  const configArray = Array.isArray(config)
    ? config
    : Object.values(config);

  if (configArray.length > 0) {
    setProdutoSelecionado({
      ...produto,
      configComplementos: configArray,
    });

    setSelecionados({});
    setObservacao("");
    setErroModal("");
    setModalAberto(true);
  } else {
    adicionarNoCarrinho(produto, [], "");
  }
}

  function pegarNomeGrupo(grupo) {
    return grupo.nomeGrupo || grupo.grupo || grupo.nome || "";
  }

  function pegarLimiteGrupo(grupo) {
    return Number(grupo.limite || grupo.maximo || grupo.quantidadeMaxima || 0);
  }

  function pegarMinimoGrupo(grupo) {
    return Number(grupo.minimo || grupo.min || 0);
  }

  function alternarComplemento(grupo, complemento) {
    setErroModal("");

    const nomeGrupo = pegarNomeGrupo(grupo);
    const limite = pegarLimiteGrupo(grupo);
    const grupoAtual = selecionados[nomeGrupo] || [];

    const jaSelecionado = grupoAtual.some(
      (item) => item.nome === complemento.nome
    );

    if (jaSelecionado) {
      setSelecionados({
        ...selecionados,
        [nomeGrupo]: grupoAtual.filter((item) => item.nome !== complemento.nome),
      });
      return;
    }

    if (limite > 0 && grupoAtual.length >= limite) {
      setErroModal(`Você só pode escolher até ${limite} item(ns) em ${nomeGrupo}.`);
      return;
    }

    setSelecionados({
      ...selecionados,
      [nomeGrupo]: [...grupoAtual, complemento],
    });
  }

  function calcularPrecoComplementos(complementos) {
    return complementos.reduce((total, item) => {
      return total + Number(item.preco || item.valor || 0);
    }, 0);
  }

  function adicionarNoCarrinho(produto, complementosEscolhidos, obs) {
    const precoProduto = Number(produto.preco || produto.valor || 0);
    const precoExtras = calcularPrecoComplementos(complementosEscolhidos);

    const itemCarrinho = {
      id: Date.now(),
      nome: produto.nome,
      preco: precoProduto,
      quantidade: 1,
      complementos: complementosEscolhidos,
      observacao: obs,
      totalUnitario: precoProduto + precoExtras,
    };

    setCarrinho((listaAtual) => [...listaAtual, itemCarrinho]);
  }

  function validarGrupos() {
    if (!produtoSelecionado?.configComplementos) return true;

    for (const grupo of produtoSelecionado.configComplementos) {
      const nomeGrupo = pegarNomeGrupo(grupo);
      const minimo = pegarMinimoGrupo(grupo);
      const escolhidos = selecionados[nomeGrupo] || [];

      if (minimo > 0 && escolhidos.length < minimo) {
        setErroModal(
          `Escolha pelo menos ${minimo} item(ns) em ${nomeGrupo}.`
        );
        return false;
      }
    }

    return true;
  }

  function confirmarComplementos() {
    if (!validarGrupos()) return;

    const todosComplementos = Object.values(selecionados).flat();

    adicionarNoCarrinho(produtoSelecionado, todosComplementos, observacao);

    setModalAberto(false);
    setProdutoSelecionado(null);
    setSelecionados({});
    setObservacao("");
    setErroModal("");
  }

  function aumentarQuantidade(id) {
    setCarrinho(
      carrinho.map((item) =>
        item.id === id
          ? { ...item, quantidade: item.quantidade + 1 }
          : item
      )
    );
  }

  function diminuirQuantidade(id) {
    setCarrinho(
      carrinho
        .map((item) =>
          item.id === id
            ? { ...item, quantidade: item.quantidade - 1 }
            : item
        )
        .filter((item) => item.quantidade > 0)
    );
  }

  function removerItem(id) {
    setCarrinho(carrinho.filter((item) => item.id !== id));
  }

  const totalCarrinho = carrinho.reduce((total, item) => {
    return total + item.totalUnitario * item.quantidade;
  }, 0);

  return (
    <MainLayout>
      <div className="vendas-page">
        <div className="vendas-header">
          <div>
            <h1>PDV / Vendas</h1>
            <p>Selecione os produtos e finalize a venda.</p>
          </div>
        </div>

        <div className="vendas-content">
          <div className="produtos-area">
            <div className="busca-produto">
              <Search size={20} />
              <input
                type="text"
                placeholder="Pesquisar produto..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
              />
            </div>

            <div className="produtos-grid">
              {produtosFiltrados.length === 0 ? (
                <div className="sem-produtos">Nenhum produto encontrado.</div>
              ) : (
                produtosFiltrados.map((produto, index) => (
                  <div
                    className="produto-card"
                    key={index}
                    onClick={() => clicarProduto(produto)}
                  >
                    <div className="produto-img">
                      {produto.imagem ? (
                        <img src={produto.imagem} alt={produto.nome} />
                      ) : (
                        <span>{produto.nome?.charAt(0)}</span>
                      )}
                    </div>

                    <h3>{produto.nome}</h3>

                    <strong>
                      {formatarPreco(produto.preco || produto.valor)}
                    </strong>

                    {produtoTemComplementos(produto) && (
                      <small>Possui complementos</small>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="carrinho-area">
            <h2>Carrinho</h2>

            <div className="carrinho-lista">
              {carrinho.length === 0 ? (
                <p className="carrinho-vazio">Nenhum produto adicionado.</p>
              ) : (
                carrinho.map((item) => (
                  <div className="carrinho-item" key={item.id}>
                    <div className="item-info">
                      <strong>{item.nome}</strong>

                      {item.complementos.length > 0 && (
                        <ul>
                          {item.complementos.map((comp, index) => (
                            <li key={index}>
                              + {comp.nome}
                              {Number(comp.preco || comp.valor || 0) > 0 &&
                                ` (${formatarPreco(comp.preco || comp.valor)})`}
                            </li>
                          ))}
                        </ul>
                      )}

                      {item.observacao && (
                        <p className="obs-item">Obs: {item.observacao}</p>
                      )}

                      <span>{formatarPreco(item.totalUnitario)}</span>
                    </div>

                    <div className="item-acoes">
                      <button onClick={() => diminuirQuantidade(item.id)}>
                        <Minus size={14} />
                      </button>

                      <span>{item.quantidade}</span>

                      <button onClick={() => aumentarQuantidade(item.id)}>
                        <Plus size={14} />
                      </button>

                      <button
                        className="remover"
                        onClick={() => removerItem(item.id)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="carrinho-total">
              <span>Total</span>
              <strong>{formatarPreco(totalCarrinho)}</strong>
            </div>

            <button className="finalizar-btn">Finalizar Venda</button>
          </div>
        </div>
      </div>

      {modalAberto && produtoSelecionado && (
        <div className="modal-overlay">
          <div className="modal-complementos">
            <div className="modal-topo">
              <div>
                <h2>{produtoSelecionado.nome}</h2>
                <p>Escolha os complementos do produto.</p>
              </div>

              <button onClick={() => setModalAberto(false)}>
                <X size={22} />
              </button>
            </div>

            {erroModal && <div className="erro-modal">{erroModal}</div>}

            <div className="grupos-modal">
              {produtoSelecionado.configComplementos.map((grupo, index) => {
                const nomeGrupo = pegarNomeGrupo(grupo);
                const limite = pegarLimiteGrupo(grupo);
                const minimo = pegarMinimoGrupo(grupo);
                const selecionadosGrupo = selecionados[nomeGrupo] || [];
                const complementosGrupo = grupo.complementos || [];

                return (
                  <div className="grupo-opcao" key={index}>
                    <div className="grupo-titulo">
                      <div>
                        <h3>{nomeGrupo}</h3>
                        {minimo > 0 && <small>Obrigatório: mínimo {minimo}</small>}
                      </div>

                      <span>
                        {selecionadosGrupo.length}/{limite || "∞"}
                      </span>
                    </div>

                    <div className="complementos-lista">
                      {complementosGrupo.map((comp, i) => {
                        const ativo = selecionadosGrupo.some(
                          (item) => item.nome === comp.nome
                        );

                        return (
                          <button
                            key={i}
                            className={ativo ? "comp ativo" : "comp"}
                            onClick={() => alternarComplemento(grupo, comp)}
                          >
                            <span>{comp.nome}</span>

                            {Number(comp.preco || comp.valor || 0) > 0 && (
                              <strong>
                                + {formatarPreco(comp.preco || comp.valor)}
                              </strong>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            <label className="label-obs">Observação</label>
            <textarea
              className="textarea-obs"
              placeholder="Ex: sem cebola, molho separado, pouco gelo..."
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
            />

            <button
              className="confirmar-complementos"
              onClick={confirmarComplementos}
            >
              Adicionar ao Carrinho
            </button>
          </div>
        </div>
      )}
    </MainLayout>
  );
}

export default Vendas;