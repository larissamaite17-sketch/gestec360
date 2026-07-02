import { useEffect, useMemo, useRef, useState } from "react";
import { Trash2, Plus, Minus, X } from "lucide-react";
import MainLayout from "../../layouts/MainLayout";
import "./NovaVenda.css";
import ComprovanteTermico from "./components/ComprovanteTermico";

function NovaVenda() {
  const [produtos, setProdutos] = useState([]);
  const [formaPagamento, setFormaPagamento] = useState("Dinheiro");
  const [valorRecebido, setValorRecebido] = useState("");
  const [modalComprovante, setModalComprovante] = useState(false);
  const [tipoVenda, setTipoVenda] = useState("Balcão");
  const [cliente, setCliente] = useState("");
  const [endereco, setEndereco] = useState("");
  const [taxaEntrega, setTaxaEntrega] = useState("");
  const [carrinho, setCarrinho] = useState([]);
  const [statusPagamento, setStatusPagamento] = useState("Pago");
  const [buscaProduto, setBuscaProduto] = useState("");
  const [modalProdutoNaoEncontrado, setModalProdutoNaoEncontrado] = useState(false);
  const [codigoNaoEncontrado, setCodigoNaoEncontrado] = useState("");
  const [observacao, setObservacao] = useState("");
  const [cpfNota, setCpfNota] = useState("");
  const [desconto, setDesconto] = useState("");
  const [modalExcluir, setModalExcluir] = useState(false);
  const [produtoExcluir, setProdutoExcluir] = useState(null);
  const [modalComplementos, setModalComplementos] = useState(false);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [complementosSelecionados, setComplementosSelecionados] = useState({});
  const [pesoProduto, setPesoProduto] = useState("");

  const inputProdutoRef = useRef(null);

  const [numeroPedido, setNumeroPedido] = useState(() => {
    const hoje = new Date().toISOString().split("T")[0];
    const controle = JSON.parse(localStorage.getItem("controlePedido")) || null;

    if (!controle || controle.data !== hoje) {
      localStorage.setItem("controlePedido", JSON.stringify({ data: hoje, numero: 1 }));
      return 1;
    }

    return controle.numero;
  });

  const [clientes, setClientes] = useState([]);
  const [dadosEmpresa, setDadosEmpresa] = useState(null);
  const empresa_id = localStorage.getItem("empresaId");

  async function carregarDadosEmpresa() {
    try {
      const resposta = await fetch(`/api/empresas/${empresa_id}`); 
      const dados = await resposta.json();
      setDadosEmpresa(dados);
    } catch (erro) {
      console.log("Erro ao carregar dados da empresa:", erro);
    }
  }

  useEffect(() => {
    carregarProdutos();
    carregarClientes();
    carregarDadosEmpresa();
  }, []);

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

  async function carregarProdutos() {
    try {
      const respostaProd = await fetch(
        `/api/produtos?empresa_id=${empresa_id}`
      );
      const listaProdutos = await respostaProd.json();

      const formatados = listaProdutos.map((produto) => {
        let configCrua = produto.config_complementos ?? produto.configcomplementos ?? produto.configComplementos ?? {};
        let configFormatada = {};

        if (typeof configCrua === "string" && configCrua.trim() !== "") {
          try { 
            configFormatada = JSON.parse(configCrua); 
          } catch (e) { 
            console.error("Erro ao converter configComplementos de string para objeto:", e);
            configFormatada = {}; 
          }
        } else if (typeof configCrua === "object" && configCrua !== null) {
          configFormatada = configCrua;
        }

        Object.keys(configFormatada).forEach((grupoNome) => {
          if (!configFormatada[grupoNome]?.itens) return;

          Object.keys(configFormatada[grupoNome].itens).forEach((itemNome) => {
            const item = configFormatada[grupoNome].itens[itemNome];

            if (typeof item !== "object") {
              configFormatada[grupoNome].itens[itemNome] = {
                ativo: true,
                preco: converterParaNumero(item)
              };
            } else {
              item.preco = converterParaNumero(item.preco);
              if (item.ativo === undefined) item.ativo = true;
            }
          });
        });

        return {
          ...produto,
          possuiComplementos: !!(produto.possui_complementos ?? produto.possuicomplementos ?? produto.possuiComplementos ?? false),
          configComplementos: configFormatada,
          id: produto.id,
          produtoId: produto.id,
          codigo: String(produto.identificacao || ""),
          codigoBarras: String(produto.codigo_barras || ""),
          nome: produto.nome,
          valor: converterParaNumero(produto.preco_venda || produto.preco),
          precoKg: Number(produto.preco_kg || 0),
          tipoVenda: produto.tipo_venda,
          unidade: produto.unidade,
          estoque: Number(produto.estoque || 0),
          estoqueMinimo: Number(produto.estoque_minimo || 0),
        };
      });

      setProdutos(formatados);
    } catch (erro) {
      console.log("Erro ao carregar produtos:", erro);
    }
  }

  async function carregarClientes() {
    try {
      const resposta = await fetch(
        `/api/clientes?empresa_id=${empresa_id}`
      );
      const dados = await resposta.json();
      setClientes(Array.isArray(dados) ? dados : []);
    } catch (erro) {
      console.log("Erro ao carregar clientes:", erro);
      setClientes([]);
    }
  }

  const sugestoesProdutos = useMemo(() => {
    const termo = buscaProduto.trim().toLowerCase();
    if (!termo || termo.length < 2) return [];

    return produtos
      .filter((produto) => {
        const codigo = String(produto.codigo || "").toLowerCase();
        const barras = String(produto.codigoBarras || "").toLowerCase();
        const nome = String(produto.nome || "").toLowerCase();

        return (
          nome.startsWith(termo) ||
          nome.includes(termo) ||
          codigo.startsWith(termo) ||
          barras.startsWith(termo)
        );
      })
      .slice(0, 8);
  }, [buscaProduto, produtos]);

  const subtotal = carrinho.reduce((total, item) => {
    return total + (converterParaNumero(item.valor) * Number(item.quantidade || 1));
  }, 0);

  const descontoNumero = converterParaNumero(desconto);
  const taxaEntregaNumero = tipoVenda === "Entrega" ? converterParaNumero(taxaEntrega) : 0;
  
  const total = Number((subtotal - descontoNumero + taxaEntregaNumero).toFixed(2));
  const valorRecebidoNumero = converterParaNumero(valorRecebido);
  const troco = formaPagamento === "Dinheiro" && valorRecebidoNumero > total ? valorRecebidoNumero - total : 0;

  function formatarMoeda(valor) {
    return Number(valor || 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  function produtoEhPeso(produto) {
    return produto?.tipoVenda === "PESO";
  }

  function produtoTemComplementos(produto) {
    if (!produto) return false;
    const config = produto.configComplementos || {};
    return Object.keys(config).length > 0;
  }

  function calcularValorPorPeso(produto, pesoDigitado) {
    const precoKg = Number(produto.precoKg || produto.valor || 0);
    let peso = String(pesoDigitado).replace(",", ".").trim();

    if (!peso) return 0;
    peso = Number(peso);
    if (isNaN(peso) || peso <= 0) return 0;

    if (peso > 10) {
      peso = peso / 1000;
    }

    return precoKg * peso;
  }

  async function finalizarVenda() {
    if (carrinho.length === 0) {
      alert("Adicione pelo menos um produto antes de finalizar a venda.");
      return;
    }

    if ((tipoVenda === "Balcão" || tipoVenda === "Retirada") && !cliente.trim()) {
      alert("Informe o nome do cliente.");
      return;
    }

    if (formaPagamento === "Dinheiro" && valorRecebidoNumero < total) {
      alert("O valor recebido é menor que o total da venda.");
      return;
    }

    const vendaFinalizada = {
      empresa_id,
      numero: numeroPedido,
      data: new Date().toISOString(),
      tipoVenda,
      cliente,
      endereco,
      observacao,
      cpfNota,
      itens: carrinho,
      subtotal,
      desconto: descontoNumero,
      taxaEntrega: taxaEntregaNumero,
      total,
      formaPagamento,
      statusPagamento: formaPagamento === "Dinheiro" || tipoVenda === "Balcão" ? "Pago" : statusPagamento,
      valorRecebido: valorRecebidoNumero,
      troco,
    };

    try {
      const resposta = await fetch("/api/vendas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(vendaFinalizada)
      });

      if (!resposta.ok) {
        throw new Error("Erro ao salvar venda.");
      }
    } catch (erro) {
      alert("Erro ao salvar venda.");
      console.log(erro);
      return;
    }

    setModalComprovante(true);
  }

  function novaVenda() {
    setCarrinho([]);
    setBuscaProduto("");
    setFormaPagamento("Dinheiro");
    setTipoVenda("Balcão");
    setValorRecebido("");
    setCliente("");
    setEndereco("");
    setObservacao("");
    setCpfNota("");
    setTaxaEntrega("");
    setStatusPagamento("Pago");
    setModalComprovante(false);

    setNumeroPedido((pedido) => {
      const novoNumero = pedido + 1;
      const hoje = new Date().toISOString().split("T")[0];
      localStorage.setItem("controlePedido", JSON.stringify({ data: hoje, numero: novoNumero }));
      return novoNumero;
    });

    setTimeout(() => inputProdutoRef.current?.focus(), 100);
  }

  function abrirModalProduto(produto) {
    setProdutoSelecionado({
      ...produto,
      configComplementos: produto.configComplementos || {}
    });
    setComplementosSelecionados({});
    setPesoProduto("");
    setModalComplementos(true);
    setBuscaProduto("");
  }

  function adicionarProduto(produto) {
    if (produtoEhPeso(produto) || produtoTemComplementos(produto)) {
      abrirModalProduto(produto);
      return;
    }
    adicionarDiretoCarrinho(produto, [], converterParaNumero(produto.valor), null);
  }

  function adicionarDiretoCarrinho(produto, complementos = [], valorBase = null, peso = null) {
    const valorProduto = converterParaNumero(valorBase ?? produto.valor);
    const valorComplementos = complementos.reduce((soma, item) => soma + converterParaNumero(item.preco), 0);
    const valorFinal = Number((valorProduto + valorComplementos).toFixed(2));

    setCarrinho(lista => [
      ...lista,
      {
        id: `${produto.id}-${Date.now()}`,
        produtoId: produto.id,
        nome: produto.nome,
        quantidade: 1,
        valor: valorFinal,
        valorBase: valorProduto,
        peso,
        complementos: [...complementos],
        tipoVenda: produto.tipoVenda
      }
    ]);

    setBuscaProduto("");
    setTimeout(() => {
      inputProdutoRef.current?.focus();
    }, 50);
  }

  function buscarProduto(codigo = buscaProduto) {
    const termo = String(codigo).trim();
    if (!termo) return;

    const termoLower = termo.toLowerCase();
    const produtoEncontrado = produtos.find((produto) => {
      return (
        String(produto.codigo || "") === termo ||
        String(produto.codigoBarras || "") === termo ||
        String(produto.nome || "").toLowerCase() === termoLower
      );
    });

    if (produtoEncontrado) {
      adicionarProduto(produtoEncontrado);
      return;
    }

    setCodigoNaoEncontrado(termo);
    setModalProdutoNaoEncontrado(true);
    setBuscaProduto("");
  }

  function buscarProdutoPorCodigo(e) {
    if (e.key === "Enter") {
      buscarProduto();
    }
  }

  function lidarBuscaProduto(valor) {
    setBuscaProduto(valor);
    const somenteNumeros = valor.replace(/\D/g, "");

    if (somenteNumeros.length >= 8) {
      const produtoPorBarras = produtos.find(
        (produto) => String(produto.codigoBarras || "") === somenteNumeros
      );
      if (produtoPorBarras) {
        setTimeout(() => adicionarProduto(produtoPorBarras), 80);
      }
    }
  }

  function formatarCPF(valor) {
    let cpf = valor.replace(/\D/g, "").slice(0, 11);
    cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
    cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
    cpf = cpf.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    return cpf;
  }

  function selecionarComplemento(grupo, nome, preco) {
    if (!grupo || group === "undefined") return;

    const atual = complementosSelecionados[grupo] || [];
    const existe = atual.some((item) => item.nome === nome);

    if (existe) {
      setComplementosSelecionados({
        ...complementosSelecionados,
        [grupo]: atual.filter((item) => item.nome !== nome),
      });
      return;
    }

    const grupoConfig = produtoSelecionado?.configComplementos?.[grupo];
    const limite = grupoConfig ? Number(grupoConfig.limite || 1) : 1;
    
    if (limite > 0 && atual.length >= limite) {
      alert(`Você só pode escolher até ${limite} complemento(s) em ${grupo}`);
      return;
    }

    setComplementosSelecionados({
      ...complementosSelecionados,
      [grupo]: [
        ...atual,
        {
          nome,
          preco: converterParaNumero(preco)
        }
      ]
    });
  }

  function confirmarComplementos() {
    const complementos = Object.values(complementosSelecionados).flat();

    if (produtoEhPeso(produtoSelecionado)) {
      const valorPeso = calcularValorPorPeso(produtoSelecionado, pesoProduto);
      if (valorPeso <= 0) {
        alert("Informe o peso do produto.");
        return;
      }
      adicionarDiretoCarrinho(produtoSelecionado, complementos, valorPeso, pesoProduto);
    } else {
      adicionarDiretoCarrinho(produtoSelecionado, complementos, converterParaNumero(produtoSelecionado.valor), null);
    }

    setModalComplementos(false);
    setProdutoSelecionado(null);
    setComplementosSelecionados({});
    setPesoProduto("");
  }

  function aumentarQuantidade(id) {
    setCarrinho(carrinho.map(p => p.id === id ? { ...p, quantidade: p.quantidade + 1 } : p));
  }

  function diminuirQuantidade(id) {
    setCarrinho(carrinho.map(p => p.id === id && p.quantidade > 1 ? { ...p, quantidade: p.quantidade - 1 } : p));
  }

  function confirmarExcluirProduto() {
    setCarrinho(carrinho.filter(p => p.id !== produtoExcluir.id));
    setModalExcluir(false);
    setProdutoExcluir(null);
  }

  function imprimirComprovante() {
    window.print();
  }

  return (
    <MainLayout>
      <div className="pdv-page">
        <div className="pdv-header">
          <div>
            <h1>Nova Venda</h1>
            <p>Realize vendas rápidas pelo PDV do Gestec360</p>
          </div>
          <div className="pdv-sale-number">Pedido #{String(numeroPedido).padStart(6, "0")}</div>
        </div>

        <div className="pdv-content">
          <section className="pdv-card">
            <div className="pdv-search-box search-wrapper">
              <label>Buscar produto</label>
              <input
                ref={inputProdutoRef}
                type="text"
                placeholder="Digite o código, nome ou passe o leitor..."
                value={buscaProduto}
                onChange={(e) => lidarBuscaProduto(e.target.value)}
                onKeyDown={buscarProdutoPorCodigo}
              />

              {sugestoesProdutos.length > 0 && (
                <div className="suggestions-box">
                  {sugestoesProdutos.map((produto) => (
                    <button
                      type="button"
                      key={produto.id}
                      onClick={() => adicionarProduto(produto)}
                    >
                      <span>
                        <strong>{produto.nome}</strong>
                        <small>
                          Código: {produto.codigo}
                          {produto.codigoBarras ? ` | Barras: ${produto.codigoBarras}` : ""}
                        </small>
                      </span>
                      <b>{formatarMoeda(produto.valor)}</b>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="pdv-cart">
              <h2>Carrinho</h2>

              {carrinho.length === 0 ? (
                <div className="pdv-empty">Nenhum produto adicionado.</div>
              ) : (
                <table className="cart-table">
                  <thead>
                    <tr>
                      <th>Qtd</th>
                      <th>Produto</th>
                      <th>Valor</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {carrinho.map((produto) => (
                      <tr key={produto.id}>
                        <td>
                          <div className="qty-control">
                            <button onClick={() => diminuirQuantidade(produto.id)}>
                              <Minus size={15} strokeWidth={3} />
                            </button>
                            <span>{produto.quantidade}</span>
                            <button onClick={() => aumentarQuantidade(produto.id)}>
                              <Plus size={15} strokeWidth={3} />
                            </button>
                          </div>
                        </td>
                        <td>
                          <strong>{produto.nome}</strong>
                          {produto.peso && <small className="cart-detail">Peso: {produto.peso}</small>}
                          {produto.complementos && produto.complementos.length > 0 && (
                            <div className="cart-complements">
                              {produto.complementos.map((comp, index) => (
                                <div key={index}>
                                  <small>
                                    + {comp.nome}
                                    {Number(comp.preco) > 0 && (
                                      <> ({formatarMoeda(comp.preco)})</>
                                    )}
                                  </small>
                                </div>
                              ))}
                            </div>
                          )}
                        </td>
                        <td>{formatarMoeda(produto.valor * produto.quantidade)}</td>
                        <td>
                          <button
                            className="delete-btn"
                            onClick={() => {
                              setProdutoExcluir(produto);
                              setModalExcluir(true);
                            }}
                          >
                            <Trash2 size={18} strokeWidth={2.3} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>

          <aside className="pdv-resume">
            <h2>Resumo do Pedido</h2>
            <div className="option-group">
              {["Balcão", "Retirada", "Entrega"].map((tipo) => (
                <button
                  key={tipo}
                  className={tipoVenda === tipo ? "option active" : "option"}
                  onClick={() => setTipoVenda(tipo)}
                >
                  {tipo}
                </button>
              ))}
            </div>

            <div className="delivery-box">
              <label>Nome do cliente</label>
              <input
                type="text"
                placeholder={
                  tipoVenda === "Balcão" || tipoVenda === "Retirada"
                    ? "Nome do cliente *"
                    : "Nome do cliente (opcional)"
                }
                value={cliente}
                onChange={(e) => setCliente(e.target.value)}
              />

              {cliente.trim() !== "" && (
                <div className="suggestions-box">
                  {clientes
                    .filter(c => String(c.nome || "").toLowerCase().includes(cliente.toLowerCase()))
                    .slice(0, 5)
                    .map((c, index) => (
                      <button
                        key={c.id || index}
                        type="button"
                        onClick={() => setCliente(c.nome)}
                      >
                        {c.nome}
                      </button>
                    ))}
                </div>
              )}
            </div>

            <div className="money-box cpf-box">
              <label>CPF na nota</label>
              <input
                type="text"
                placeholder="Opcional"
                value={cpfNota}
                onChange={(e) => setCpfNota(formatarCPF(e.target.value))}
              />
            </div>

            {tipoVenda === "Entrega" && (
              <div className="delivery-box">
                <label>Endereço</label>
                <input
                  type="text"
                  placeholder="Digite o endereço"
                  value={endereco}
                  onChange={(e) => setEndereco(e.target.value)}
                />
                <label>Taxa de entrega</label>
                <input
                  type="text"
                  placeholder="Ex: 5,00"
                  value={taxaEntrega}
                  onChange={(e) => setTaxaEntrega(e.target.value)}
                />
              </div>
            )}

            <div className="money-box discount-box">
              <label>Desconto</label>
              <input
                type="text"
                placeholder="Ex: 5,00"
                value={desconto}
                onChange={(e) => setDesconto(e.target.value)}
              />
            </div>

            <div className="observation-box">
              <label>Observação</label>
              <textarea
                placeholder="Ex: entregar nos fundos, sem gelo..."
                value={observacao}
                onChange={(e) => setObservacao(e.target.value)}
              />
            </div>

            <div className="payment-box">
              <label className="payment-title">Forma de pagamento</label>
              <div className="option-group payment">
                {["Dinheiro", "Pix", "Débito", "Crédito"].map((pagamento) => (
                  <button
                    key={pagamento}
                    className={formaPagamento === pagamento ? "option active" : "option"}
                    onClick={() => {
                      setFormaPagamento(pagamento);
                      setValorRecebido("");
                    }}
                  >
                    {pagamento}
                  </button>
                ))}
              </div>
            </div>

            {tipoVenda !== "Balcão" && formaPagamento !== "Dinheiro" && (
              <div className="payment-status">
                <label>Status do pagamento:</label>
                <div className="option-group status">
                  <button
                    className={statusPagamento === "Pago" ? "option active" : "option"}
                    onClick={() => setStatusPagamento("Pago")}
                  >
                    Pago
                  </button>
                  <button
                    className={statusPagamento === "Pendente" ? "option active" : "option"}
                    onClick={() => setStatusPagamento("Pendente")}
                  >
                    Pendente
                  </button>
                </div>
              </div>
            )}

            {formaPagamento === "Dinheiro" && (
              <div className="money-box">
                <input
                  type="text"
                  placeholder="Valor recebido"
                  value={valorRecebido}
                  onChange={(e) => setValorRecebido(e.target.value)}
                />
                <div className="change-box">
                  <span>Troco</span>
                  <strong>{formatarMoeda(troco)}</strong>
                </div>
              </div>
            )}

            <div className="resume-row">
              <span>Subtotal</span>
              <strong>{formatarMoeda(subtotal)}</strong>
            </div>

            <div className="resume-total">
              <span>Total</span>
              <strong>{formatarMoeda(total)}</strong>
            </div>

            <button className="finish-sale-btn" onClick={finalizarVenda}>
              Finalizar Venda
            </button>
          </aside>
        </div>

        {/* MODAL COMPLEMENTOS */}
        {modalComplementos && produtoSelecionado && (
          <div className="receipt-modal-overlay">
            <div className="receipt-modal complement-modal">
              <button className="close-modal-btn" onClick={() => setModalComplementos(false)}>
                <X size={24} strokeWidth={2.8} />
              </button>

              <h2>{produtoSelecionado.nome}</h2>
              <p>Informe os dados e escolha os complementos.</p>

              {produtoEhPeso(produtoSelecionado) && (
                <div className="weight-box">
                  <label>Peso do produto</label>
                  <input
                    type="text"
                    inputMode="decimal"
                    placeholder="Ex: 500 para gramas ou 0,500 para kg"
                    value={pesoProduto}
                    onChange={(e) => setPesoProduto(e.target.value)}
                  />
                  <span>
                    Valor calculated: {formatarMoeda(calcularValorPorPeso(produtoSelecionado, pesoProduto))}
                  </span>
                </div>
              )}

              {produtoTemComplementos(produtoSelecionado) && produtoSelecionado.configComplementos &&
                Object.entries(produtoSelecionado.configComplementos).map(([grupo, dados]) => (
                  <div key={grupo} className="complement-group-sale">
                    <div className="complement-group-title">
                      <h3 className="grupo-complemento-titulo">{grupo}</h3>
                      <p className="grupo-complemento-subtitulo">
                        Escolha até {dados.limite} opção{dados.limite > 1 ? "ões" : ""}
                      </p>
                    </div>

                    <div className="complement-options-sale">
                      {dados.itens && Object.entries(dados.itens).map(([nome, item]) => {
                        const itemObj = typeof item === "object" && item !== null ? item : { ativo: true, preco: Number(item || 0) };
                        const ativo = itemObj.ativo === undefined ? true : itemObj.ativo;
                        const preco = converterParaNumero(itemObj.preco);
                        if (!ativo) return null;

                        const marcado = complementosSelecionados[grupo]?.some((comp) => comp.nome === nome);

                        return (
                          <button
                            key={nome}
                            type="button"
                            className={marcado ? "complement-choice active" : "complement-choice"}
                            onClick={() => selecionarComplemento(grupo, nome, preco)}
                          >
                            <span>{nome}</span>
                            <strong>
                              {preco > 0 ? `+ ${formatarMoeda(preco)}` : "Grátis"}
                            </strong>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}

              <button className="finish-sale-btn" onClick={confirmarComplementos}>
                Adicionar ao carrinho
              </button>
            </div>
          </div>
        )}

        {/* MODAL PRODUTO NÃO ENCONTRADO */}
        {modalProdutoNaoEncontrado && (
          <div className="receipt-modal-overlay">
            <div className="receipt-modal">
              <button
                className="close-modal-btn"
                onClick={() => {
                  setModalProdutoNaoEncontrado(false);
                  setTimeout(() => inputProdutoRef.current?.focus(), 100);
                }}
              >
                <X size={24} strokeWidth={2.8} />
              </button>

              <div className="warning-icon">!</div>
              <h2>Produto não encontrado</h2>
              <p>Nenhum produto foi encontrado com o código:</p>
              <strong className="not-found-code">{codigoNaoEncontrado}</strong>

              <div className="modal-actions">
                <button
                  className="cancel-modal-btn"
                  onClick={() => {
                    setModalProdutoNaoEncontrado(false);
                    setTimeout(() => inputProdutoRef.current?.focus(), 100);
                  }}
                >
                  Fechar
                </button>
                <button
                  className="finish-sale-btn"
                  onClick={() => {
                    setModalProdutoNaoEncontrado(false);
                  }}
                >
                  Cadastrar Produto
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL EXCLUIR ITEM */}
        {modalExcluir && (
          <div className="receipt-modal-overlay">
            <div className="receipt-modal">
              <button className="close-modal-btn" onClick={() => setModalExcluir(false)}>
                <X size={24} strokeWidth={2.8} />
              </button>

              <div className="success-icon delete-icon">🗑</div>
              <h2>Remover produto</h2>
              <p>Deseja remover este produto do carrinho?</p>
              <strong className="remove-product-name">{produtoExcluir?.nome}</strong>

              <div className="modal-actions">
                <button className="cancel-modal-btn" onClick={() => setModalExcluir(false)}>Cancelar</button>
                <button className="finish-sale-btn delete-confirm-btn" onClick={confirmarExcluirProduto}>Remover</button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL COMPROVANTE TÉRMICO */}
        {modalComprovante && (
          <div className="receipt-modal-overlay">
            <div className="receipt-modal">
              <button className="close-modal-btn" onClick={() => setModalComprovante(false)}>
                <X size={24} strokeWidth={2.8} />
              </button>
              <div className="success-icon">✓</div>
              <h2>Venda finalizada!</h2>
              <p>Deseja imprimir o comprovante?</p>
              
              <ComprovanteTermico
                venda={{
                  numero: numeroPedido,
                  data: new Date().toISOString(),
                  tipoVenda,
                  cliente,
                  endereco,
                  observacao,
                  itens: carrinho,
                  subtotal,
                  desconto: descontoNumero,
                  taxaEntrega: taxaEntregaNumero,
                  total,
                  formaPagamento,
                  statusPagamento,
                  valorRecebido: valorRecebidoNumero,
                  troco,
                }}
                empresa={JSON.parse(localStorage.getItem("empresa")) || dadosEmpresa}
              />
              
              <div className="modal-actions">
                <button className="cancel-modal-btn" onClick={novaVenda}>Nova Venda</button>
                <button className="print-btn" onClick={imprimirComprovante}>Imprimir comprovante</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default NovaVenda;