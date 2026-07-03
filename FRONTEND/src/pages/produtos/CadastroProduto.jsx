import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import { Plus, Save, Package, Weight, Box } from "lucide-react";
import "./CadastroProduto.css";

const API = "/api";

function CadastroProduto() {
  const [searchParams] = useSearchParams();
  const idEditar = searchParams.get("id");

  const [identificacao, setIdentificacao] = useState("1");
  const [nome, setNome] = useState("");
  const [marca, setMarca] = useState("");
  const [categoria, setCategoria] = useState("");
  const [codigoBarras, setCodigoBarras] = useState("");
  const [precoCusto, setPrecoCusto] = useState("");
  const [precoVenda, setPrecoVenda] = useState("");
  const [estoqueInicial, setEstoqueInicial] = useState("");
  const [estoqueMinimo, setEstoqueMinimo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [tipoVenda, setTipoVenda] = useState("UNIDADE");
  const [unidadeEstoque, setUnidadeEstoque] = useState("UNIDADE");

  const [possuiComplementos, setPossuiComplementos] = useState(false);
  const [gruposSelecionados, setGruposSelecionados] = useState([]);

  const [marcas, setMarcas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [complementos, setComplementos] = useState([]);

  const [configComplementos, setConfigComplementos] = useState({});

  const [modalMarca, setModalMarca] = useState(false);
  const [modalCategoria, setModalCategoria] = useState(false);
  const [modalSucesso, setModalSucesso] = useState(false);

  const [novaMarca, setNovaMarca] = useState("");
  const [novaCategoria, setNovaCategoria] = useState("");

  useEffect(() => {
    if (tipoVenda === "PESO") {
      setUnidadeEstoque("KG");
    } else if (unidadeEstoque === "KG") {
      setUnidadeEstoque("UNIDADE");
    }
  }, [tipoVenda]);

  // ===== FUNÇÃO PARA CARREGAR DADOS AUXILIARES =====
  async function carregarDadosIniciais() {
    const empresaId = localStorage.getItem("empresaId");
    const query = `?empresa_id=${empresaId}`;

    try {
      const [marcasRes, categoriasRes, gruposRes, complementosRes] = await Promise.all([
        fetch(`${API}/marcas${query}`, { headers: { "x-empresa-id": empresaId } }),
        fetch(`${API}/categorias${query}`, { headers: { "x-empresa-id": empresaId } }),
        fetch(`${API}/grupos${query}`, { headers: { "x-empresa-id": empresaId } }),
        fetch(`${API}/complementos${query}`, { headers: { "x-empresa-id": empresaId } }),
      ]);

      const [marcas, categorias, grupos, complementos] = await Promise.all([
        marcasRes.json().catch(() => []),
        categoriasRes.json().catch(() => []),
        gruposRes.json().catch(() => []),
        complementosRes.json().catch(() => []),
      ]);

      console.log("📦 GRUPOS CARREGADOS:", grupos);
      console.log("📦 COMPLEMENTOS CARREGADOS:", complementos);

      setMarcas(Array.isArray(marcas) ? marcas.map((m) => m.nome) : []);
      setCategorias(Array.isArray(categorias) ? categorias.map((c) => c.nome) : []);
      setGrupos(Array.isArray(grupos) ? grupos : []);
      setComplementos(Array.isArray(complementos) ? complementos.filter(c => c.ativo !== false) : []);
    } catch (err) {
      console.log("Erro ao carregar dados:", err);
    }
  }

  // ===== USEEFFECT PRINCIPAL =====
  useEffect(() => {
    const empresaId = localStorage.getItem("empresaId");
    
    // CARREGA DADOS AUXILIARES
    carregarDadosIniciais();

    // CARREGA PRODUTO PARA EDIÇÃO
    if (idEditar) {
      fetch(`${API}/produtos?empresa_id=${empresaId}`, { 
        headers: { "x-empresa-id": empresaId } 
      })
        .then((r) => r.json())
        .then((produtos) => {
          if (!Array.isArray(produtos)) return;
          const produto = produtos.find(
            (item) => String(item.id) === String(idEditar)
          );
          if (produto) {
            // ===== DADOS BÁSICOS =====
            setIdentificacao(String(produto.identificacao));
            setNome(produto.nome);
            setMarca(produto.marca || "");
            setCategoria(produto.categoria || "");
            setCodigoBarras(produto.codigo_barras || "");
            setPrecoCusto(
              produto.preco_custo ? produto.preco_custo.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              }) : ""
            );
            setPrecoVenda(
              produto.preco_venda ? produto.preco_venda.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              }) : ""
            );
            setTipoVenda(produto.tipo_venda || "UNIDADE");
            setUnidadeEstoque(produto.unidade || "UNIDADE");
            setEstoqueInicial(produto.estoque || "");
            setEstoqueMinimo(produto.estoque_minimo || "");
            setDescricao(produto.descricao || "");

            // ===== COMPLEMENTOS =====
            const possuiComp = !!(produto.possui_complementos ?? 
                                  produto.possuiComplementos ?? 
                                  false);
            setPossuiComplementos(possuiComp);

    

            // CONFIG COMPLEMENTOS
            let configComp = produto.config_complementos ?? 
                             produto.configComplementos ?? 
                             {};

            // SE FOR STRING, CONVERTE
            if (typeof configComp === "string" && configComp.trim() !== "") {
              try {
                configComp = JSON.parse(configComp);
              } catch (e) {
                configComp = {};
              }
            }

            console.log("📦 CONFIG CARREGADA:", configComp);
            setConfigComplementos(configComp);
          }
        })
        .catch((err) => console.log("Erro ao buscar produto:", err));
    } else {
      // NOVO PRODUTO - BUSCA ÚLTIMO ID
      fetch(`${API}/produtos?empresa_id=${empresaId}`, { 
        headers: { "x-empresa-id": empresaId } 
      })
        .then((r) => r.json())
        .then((produtos) => {
          if (Array.isArray(produtos) && produtos.length > 0) {
            const maior = produtos.reduce((max, produto) => {
              const num = parseInt(produto.identificacao);
              return num > max ? num : max;
            }, 0);
            setIdentificacao(String(maior + 1));
          } else {
            setIdentificacao("1");
          }
        })
        .catch(() => setIdentificacao("1"));
    }
  }, [idEditar]);

  function formatarMoedaTexto(valor) {
    if (!valor) return "";
    const numero = String(valor).replace(/\D/g, "");
    if (!numero) return "";
    return (parseFloat(numero) / 100).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  function moedaParaNumero(valor) {
    if (!valor) return 0;
    const numero = String(valor).replace(/\D/g, "");
    return numero ? parseFloat(numero) / 100 : 0;
  }

  function formatarMoeda(e, setValor) {
    setValor(formatarMoedaTexto(e.target.value));
  }

  async function salvarMarca() {
    if (!novaMarca.trim()) return;
    const empresaId = localStorage.getItem("empresaId");

    await fetch(`${API}/marcas`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "x-empresa-id": empresaId
      },
      body: JSON.stringify({ nome: novaMarca.trim(), empresa_id: empresaId }),
    });

    const marcasAtualizadas = await fetch(`${API}/marcas?empresa_id=${empresaId}`, {
      headers: { "x-empresa-id": empresaId }
    }).then((r) => r.json()).catch(() => []);
    
    setMarcas(Array.isArray(marcasAtualizadas) ? marcasAtualizadas.map((m) => m.nome) : []);
    setMarca(novaMarca.trim());
    setNovaMarca("");
    setModalMarca(false);
  }

  async function salvarCategoria() {
    if (!novaCategoria.trim()) return;
    const empresaId = localStorage.getItem("empresaId");

    await fetch(`${API}/categorias`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "x-empresa-id": empresaId
      },
      body: JSON.stringify({ nome: novaCategoria.trim(), empresa_id: empresaId }),
    });

    const categoriasAtualizadas = await fetch(`${API}/categorias?empresa_id=${empresaId}`, {
      headers: { "x-empresa-id": empresaId }
    }).then((r) => r.json()).catch(() => []);
    
    setCategorias(Array.isArray(categoriasAtualizadas) ? categoriasAtualizadas.map((c) => c.nome) : []);
    setCategoria(novaCategoria.trim());
    setNovaCategoria("");
    setModalCategoria(false);
  }

  function alterarLimiteGrupo(grupo, limite) {
    setConfigComplementos((prev) => ({
      ...prev,
      [grupo]: { ...prev[grupo], limite: parseInt(limite) || 0 },
    }));
  }

  function alterarAtivoComplemento(grupo, complemento, ativo) {
    setConfigComplementos((prev) => ({
      ...prev,
      [grupo]: {
        ...prev[grupo],
        itens: {
          ...prev[grupo]?.itens,
          [complemento]: { ...prev[grupo]?.itens?.[complemento], ativo },
        },
      },
    }));
  }

  function alterarPrecoComplemento(grupo, complemento, valor) {
    const valorNumerico = moedaParaNumero(valor);
    setConfigComplementos((prev) => ({
      ...prev,
      [grupo]: {
        ...prev[grupo],
        itens: {
          ...prev[grupo]?.itens,
          [complemento]: { ...prev[grupo]?.itens?.[complemento], preco: valorNumerico },
        },
      },
    }));
  }

  function alternarGrupo(grupo) {
    if (gruposSelecionados.includes(grupo)) {
      setGruposSelecionados(
        gruposSelecionados.filter((item) => item !== grupo)
      );

      setConfigComplementos((prev) => {
        const novo = { ...prev };
        delete novo[grupo];
        return novo;
      });
      return;
    }

    const grupoInfo = grupos.find((g) => g.nome === grupo);
    const itens = {};

    complementos
      .filter((c) => Number(c.grupo_id) === Number(grupoInfo?.id))
      .forEach((c) => {
        itens[c.nome] = {
          ativo: false,
          preco: Number(c.preco || 0)
        };
      });

    setGruposSelecionados([...gruposSelecionados, grupo]);

    setConfigComplementos((prev) => ({
      ...prev,
      [grupo]: {
        limite: prev[grupo]?.limite || 1,
        itens
      }
    }));
  }

  function prepararConfigParaSalvar() {
    const configFinal = {};
    gruposSelecionados.forEach((grupo) => {
      const grupoInfo = grupos.find((g) => String(g.nome) === String(grupo));

      const complementosDoGrupo = complementos.filter(
        (item) => String(item.grupo_id) === String(grupoInfo?.id)
      );

      const configGrupoAtual = configComplementos[grupo] || { limite: 0, itens: {} };
      const itens = {};

      complementosDoGrupo.forEach((comp) => {
        const configItemAtual = configGrupoAtual.itens?.[comp.nome];
        itens[comp.nome] = {
          ativo: configItemAtual ? configItemAtual.ativo : true,
          preco: configItemAtual ? configItemAtual.preco : comp.preco,
        };
      });

      configFinal[grupo] = {
        limite: configGrupoAtual.limite || 0,
        itens,
      };
    });
    return configFinal;
  }

  async function salvarProduto() {
  if (!nome.trim() || !precoVenda) {
    alert("Nome e preço de venda são obrigatórios!");
    return;
  }

  const precoVendaNumero = moedaParaNumero(precoVenda);
  const empresaId = localStorage.getItem("empresaId");
  
  let identificacaoNumero;
  if (typeof identificacao === 'string') {
    identificacaoNumero = parseInt(identificacao.replace(/\D/g, ""), 10);
  } else {
    identificacaoNumero = parseInt(identificacao, 10);
  }

  if (!identificacaoNumero || isNaN(identificacaoNumero)) {
    alert("A identificação do produto precisa ser numérica.");
    return;
  }

  // ===== CONSTRÓI A CONFIG DE COMPLEMENTOS =====
  const configComplementosSalvar = {};
  
  if (possuiComplementos) {
    gruposSelecionados.forEach((grupoNome) => {
      const grupoInfo = grupos.find((g) => g.nome === grupoNome);
      
      if (grupoInfo) {
        const complementosDoGrupo = complementos.filter(
          (item) => Number(item.grupo_id) === Number(grupoInfo.id)
        );
        
        const itens = {};
        complementosDoGrupo.forEach((comp) => {
          const precoComplemento = Number(comp.preco || 0);
          
          itens[comp.nome] = {
            ativo: true,
            preco: precoComplemento
          };
        });
        
        const limite = Number(configComplementos[grupoNome]?.limite) || 1;
        
        configComplementosSalvar[grupoNome] = {
          limite: limite,
          itens: itens
        };
      }
    });
  }

 const produto = {
  empresa_id: Number(empresaId),
  identificacao: identificacaoNumero,
  nome: nome.trim(),
  marca: marca || null,
  categoria: categoria || null,
  codigo_barras: codigoBarras.trim() || null,
  preco_custo: moedaParaNumero(precoCusto),
  preco_venda: precoVendaNumero,
  preco_kg: tipoVenda === "PESO" ? precoVendaNumero : null,
  tipo_venda: tipoVenda,
  unidade: unidadeEstoque,
  estoque: parseFloat(estoqueInicial) || 0,
  estoque_minimo: parseFloat(estoqueMinimo) || 0,
  possui_complementos: possuiComplementos,
  config_complementos: possuiComplementos ? configComplementosSalvar : {}
};

  // ===== AQUI É ONDE COLOCO O CONSOLE.LOG =====
  console.log("🔍 PRODUTO A SALVAR:", JSON.stringify(produto, null, 2));
  // ============================================

  const url = idEditar ? `${API}/produtos/${idEditar}` : `${API}/produtos`;
  const method = idEditar ? "PUT" : "POST";

  try {
    const res = await fetch(url, {
      method,
      headers: { 
        "Content-Type": "application/json",
        "x-empresa-id": String(empresaId)
      },
      body: JSON.stringify(produto),
    });

    const responseText = await res.text();
    console.log("📦 RESPOSTA DO SERVIDOR:", responseText);

    if (res.ok) {
      setModalSucesso(true);
      alert("✅ Produto salvo com sucesso!");
    } else {
      alert("❌ Erro: " + responseText);
    }
  } catch (error) {
    console.error("❌ Erro:", error);
    alert("❌ Erro: " + error.message);
  }
}

  return (
    <MainLayout>
      <div className="product-page">
        <div className="product-card">
          <div className="section-title">
            <Package size={20} />
            Informações Gerais
          </div>

          <div className="product-grid">
            <div className="form-group">
              <label>Identificação</label>
              <input value={identificacao} disabled />
            </div>

            <div className="form-group grid-2">
              <label>Nome do Produto</label>
              <input
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: Coca-Cola 2L"
              />
            </div>

            <div className="form-group">
              <label>Marca</label>
              <div className="input-plus">
                <select value={marca} onChange={(e) => setMarca(e.target.value)}>
                  <option value="">Selecione</option>
                  {marcas.map((m, i) => (
                    <option key={i} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
                <button onClick={() => setModalMarca(true)}>
                  <Plus size={18} />
                </button>
              </div>
            </div>

            <div className="form-group">
              <label>Categoria</label>
              <div className="input-plus">
                <select
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                >
                  <option value="">Selecione</option>
                  {categorias.map((c, i) => (
                    <option key={i} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <button onClick={() => setModalCategoria(true)}>
                  <Plus size={18} />
                </button>
              </div>
            </div>

            <div className="form-group grid-2">
              <label>Código de Barras</label>
              <input
                value={codigoBarras}
                onChange={(e) => setCodigoBarras(e.target.value)}
                placeholder="Opcional"
              />
            </div>
          </div>

          <div className="form-group unidade-space">
            <label>Tipo de Venda</label>
            <div className="type-sale">
              <button
                className={`type-btn ${tipoVenda === "UNIDADE" ? "active-type" : ""}`}
                onClick={() => setTipoVenda("UNIDADE")}
              >
                Unidade
              </button>
              <button
                className={`type-btn ${tipoVenda === "PESO" ? "active-type" : ""}`}
                onClick={() => setTipoVenda("PESO")}
              >
                Peso
              </button>
            </div>
          </div>

          {tipoVenda === "UNIDADE" && (
            <div className="form-group unidade-space">
              <label>Unidade</label>
              <select
                value={unidadeEstoque}
                onChange={(e) => setUnidadeEstoque(e.target.value)}
              >
                <option value="UNIDADE">Unidade</option>
                <option value="KG">Kg</option>
                <option value="G">Grama</option>
                <option value="LITRO">Litro</option>
                <option value="ML">mL</option>
                <option value="CAIXA">Caixa</option>
                <option value="PACOTE">Pacote</option>
              </select>
            </div>
          )}

          <div className="section-title">
            <Weight size={20} />
            Preços
          </div>

          <div className="product-grid">
            <div className="form-group">
              <label>Preço de Custo</label>
              <input
                value={precoCusto}
                onChange={(e) => formatarMoeda(e, setPrecoCusto)}
                placeholder="R$ 0,00"
              />
            </div>

            <div className="form-group">
              <label>
                {tipoVenda === "PESO" ? "Preço por Kg (R$)" : "Preço de Venda (R$)"}
              </label>
              <input
                value={precoVenda}
                onChange={(e) => formatarMoeda(e, setPrecoVenda)}
                placeholder="R$ 0,00"
              />
              {tipoVenda === "PESO" && (
                <div className="peso-info">
                  O PDV calculará automaticamente o valor conforme o peso informado.
                </div>
              )}
            </div>
          </div>

          <div className="section-title">
            <Box size={20} />
            Estoque
          </div>

          <div className="product-grid">
            <div className="form-group">
              <label>Estoque Inicial ({unidadeEstoque})</label>
              <input
                type="number"
                value={estoqueInicial}
                onChange={(e) => setEstoqueInicial(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Estoque Mínimo ({unidadeEstoque})</label>
              <input
                type="number"
                value={estoqueMinimo}
                onChange={(e) => setEstoqueMinimo(e.target.value)}
              />
            </div>
          </div>

          <div className="section-title">Complementos</div>

          <div className="product-grid">
            <div className="checkbox-box">
              <input
                type="checkbox"
                checked={possuiComplementos}
                onChange={() => setPossuiComplementos(!possuiComplementos)}
              />
              <span>Possui Complementos</span>
            </div>

            {possuiComplementos && (
              <div className="form-group grid-2">
                <label>Grupos de Complementos</label>
                <div className="groups-checklist">
                  {grupos.map((g, i) => (
                    <label key={i} className="group-check">
                      <input
                        type="checkbox"
                        checked={gruposSelecionados.includes(g.nome)}
                        onChange={() => alternarGrupo(g.nome)}
                      />
                      <span>{g.nome}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {possuiComplementos &&
              gruposSelecionados.map((grupoName) => {
                const grupoInfo = grupos.find((g) => g.nome === grupoName);
                const list = complementos.filter(
                  item => Number(item.grupo_id) === Number(grupoInfo?.id)
                );

                return (
                  <div key={grupoName} className="grupo-config-card">
                    <div className="grupo-config-header">
                      <div>
                        <h3>{grupoName}</h3>
                        <p>Configure os complementos deste grupo.</p>
                      </div>
                      <div className="grupo-limit-box">
                        <label>Limite de escolhas</label>
                        <input
                          type="number"
                          min="0"
                          placeholder="Ex: 3"
                          value={configComplementos[grupoName]?.limite || ""}
                          onChange={(e) =>
                            alterarLimiteGrupo(grupoName, e.target.value)
                          }
                        />
                      </div>
                    </div>

                    <div className="complement-config-table">
                      <div className="complement-config-head">
                        <span>Complemento</span>
                        <span>Preço</span>
                      </div>

                      {list.map((comp, idx) => {
                        const itemConfig = configComplementos[grupoName]?.itens?.[comp.nome];
                        const isAtivo = itemConfig ? itemConfig.ativo : true;
                        const precoVal = itemConfig?.preco ?? comp.preco ?? 0;

                        return (
                          <div key={idx} className="complement-config-row">
                            <label className="comp-enable">
                              <input
                                type="checkbox"
                                checked={isAtivo}
                                onChange={(e) =>
                                  alterarAtivoComplemento(
                                    grupoName,
                                    comp.nome,
                                    e.target.checked
                                  )
                                }
                              />
                              <strong>{comp.nome}</strong>
                            </label>
                            <input
                              type="text"
                              value={formatarMoedaTexto(
                                String(Number(precoVal || 0) * 100)
                              )}
                              onChange={(e) =>
                                alterarPrecoComplemento(
                                  grupoName,
                                  comp.nome,
                                  e.target.value
                                )
                              }
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
          </div>

         

          <div className="save-product-area">
            <button className="save-product-btn" onClick={salvarProduto}>
              <Save size={18} />
              {idEditar ? "Atualizar Produto" : "Salvar Produto"}
            </button>
          </div>
        </div>

        {modalMarca && (
          <div className="modal-overlay">
            <div className="simple-modal">
              <h2>Nova Marca</h2>
              <input
                value={novaMarca}
                onChange={(e) => setNovaMarca(e.target.value)}
                placeholder="Nome da marca"
              />
              <div className="modal-buttons">
                <button onClick={() => setModalMarca(false)}>Cancelar</button>
                <button onClick={salvarMarca}>Salvar</button>
              </div>
            </div>
          </div>
        )}

        {modalCategoria && (
          <div className="modal-overlay">
            <div className="simple-modal">
              <h2>Nova Categoria</h2>
              <input
                value={novaCategoria}
                onChange={(e) => setNovaCategoria(e.target.value)}
                placeholder="Nome da categoria"
              />
              <div className="modal-buttons">
                <button onClick={() => setModalCategoria(false)}>Cancelar</button>
                <button onClick={salvarCategoria}>Salvar</button>
              </div>
            </div>
          </div>
        )}

        {modalSucesso && (
          <div className="modal-overlay">
            <div className="simple-modal">
              <h2>{idEditar ? "Produto atualizado!" : "Produto cadastrado!"}</h2>
              <p>O produto foi salvo com sucesso.</p>
              <div className="modal-buttons">
                <button onClick={() => setModalSucesso(false)}>Fechar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default CadastroProduto;