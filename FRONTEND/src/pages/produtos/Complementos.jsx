import { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import { Plus, Pencil, Trash2 } from "lucide-react";
import "./Complementos.css";

const API = "/api";

function Complementos() {
  const [complementos, setComplementos] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [modalNovo, setModalNovo] = useState(false);
  const [modalExcluir, setModalExcluir] = useState(false);

  const [nome, setNome] = useState("");
  const [grupoId, setGrupoId] = useState("");
  const [preco, setPreco] = useState("");
  const [editando, setEditando] = useState(false);
  const [complementoSelecionado, setComplementoSelecionado] = useState(null);

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    try {
      const empresaId = localStorage.getItem("empresaId");
      if (!empresaId) return;

      const gruposBanco = await fetch(`${API}/grupos?empresa_id=${empresaId}`, {
        headers: { "x-empresa-id": empresaId }
      }).then((r) => r.json());

      const complementosBanco = await fetch(`${API}/complementos?empresa_id=${empresaId}`, {
        headers: { "x-empresa-id": empresaId }
      }).then((r) => r.json());

      setGrupos(gruposBanco);
      setComplementos(Array.isArray(complementosBanco) ? complementosBanco : []);
    } catch (err) {
      console.log("Erro ao buscar dados:", err);
    }
  }

  function formatarMoedaTexto(valor) {
    const numero = String(valor).replace(/\D/g, "");
    if (!numero) return "";
    return (Number(numero) / 100).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  function moedaParaNumero(valor) {
    const numero = String(valor).replace(/\D/g, "");
    return Number(numero || 0) / 100;
  }

  function abrirNovo() {
    setNome("");
    setGrupoId("");
    setPreco("");
    setEditando(false);
    setComplementoSelecionado(null);
    setModalNovo(true);
  }

  function editarComplemento(item) {
    setNome(item.nome);
    setGrupoId(String(item.grupo_id));
    setPreco(formatarMoedaTexto(String(Number(item.preco || 0) * 100)));
    setComplementoSelecionado(item);
    setEditando(true);
    setModalNovo(true);
  }

  async function salvarComplemento() {

  const empresaId = localStorage.getItem("empresaId");

  if (!empresaId) {
    alert("Empresa não identificada.");
    return;
  }

  if (!nome.trim()) {
    alert("Informe o nome do complemento.");
    return;
  }

  if (!grupoId) {
    alert("Selecione um grupo.");
    return;
  }

  const url = editando
    ? `${API}/complementos/${complementoSelecionado.id}`
    : `${API}/complementos`;

  const metodo = editando ? "PUT" : "POST";

  try {

    const resposta = await fetch(url, {
      method: metodo,
      headers: {
  "Content-Type": "application/json",
  "x-empresa-id": empresaId
},
      body: JSON.stringify({
        nome: nome.trim(),
        grupo_id: Number(grupoId),
        preco: moedaParaNumero(preco),
        empresa_id: Number(empresaId)
      })
    });

    if (!resposta.ok) {
      const erro = await resposta.json();
      alert(erro.erro || "Erro ao salvar complemento.");
      return;
    }

    setNome("");
    setGrupoId("");
    setPreco("");
    setEditando(false);
    setComplementoSelecionado(null);
    setModalNovo(false);

    await carregarDados();

  } catch (err) {
    console.log(err);
    alert("Erro ao conectar com o servidor.");
  }
}

  function abrirExcluir(item) {
    setComplementoSelecionado(item);
    setModalExcluir(true);
  }

  async function excluirComplemento() {
    if (!complementoSelecionado) return;

    try {
      const resposta = await fetch(
        `${API}/complementos/${complementoSelecionado.id}`,
        {
          method: "DELETE",
headers: {
  "x-empresa-id": localStorage.getItem("empresaId")
},
        }
      );

      if (!resposta.ok) {
        const erro = await resposta.json();
        alert(erro.erro || "Erro ao excluir complemento.");
        return;
      }

      setModalExcluir(false);
      setComplementoSelecionado(null);
      await carregarDados();
    } catch (err) {
      console.log("Erro ao excluir:", err);
    }
  }

  return (
    <MainLayout>
      <div className="complemento-page">
        <div className="complemento-header">
          <div>
            <h1>Complementos</h1>
            <p>Cadastre os complementos utilizados pelos produtos.</p>
          </div>

          <button className="novo-complemento-btn" onClick={abrirNovo}>
            <Plus size={18} />
            Novo Complemento
          </button>
        </div>

        <div className="complemento-card">
          <table>
            <thead>
              <tr>
                <th>Complemento</th>
                <th>Grupo</th>
                <th>Preço</th>
                <th>Status</th>
                <th width="150">Ações</th>
              </tr>
            </thead>

            <tbody>
              {complementos.length === 0 ? (
                <tr>
                  <td colSpan="5">Nenhum complemento cadastrado.</td>
                </tr>
              ) : (
                complementos.map((item) => (
                  <tr key={item.id}>
                    <td>{item.nome}</td>
                    <td>{item.grupo}</td>
                    <td>
                      {Number(item.preco || 0).toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </td>
                    <td>
                      <span className="status-ativo">Ativo</span>
                    </td>
                    <td>
                      <button
                        className="action-btn"
                        onClick={() => editarComplemento(item)}
                      >
                        <Pencil size={18} />
                      </button>

                      <button
                        className="action-btn delete"
                        onClick={() => abrirExcluir(item)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {modalNovo && (
          <div className="modal-overlay">
            <form className="simple-modal" onSubmit={(e) => { e.preventDefault(); salvarComplemento(); }}>
              <h2>{editando ? "Editar Complemento" : "Novo Complemento"}</h2>

              <label>Nome</label>
              <input value={nome} onChange={(e) => setNome(e.target.value)} />

              <label>Grupo</label>
              <select
                value={grupoId}
                onChange={(e) => setGrupoId(e.target.value)}
              >
                <option value="">Selecione</option>
                {grupos.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.nome}
                  </option>
                ))}
              </select>

              <label>Preço</label>
              <input
                value={preco}
                onChange={(e) => setPreco(formatarMoedaTexto(e.target.value))}
                placeholder="R$ 0,00"
              />

              <div className="modal-buttons">
                <button type="button" onClick={() => setModalNovo(false)}>Cancelar</button>
                <button type="submit">Salvar</button>
              </div>
            </form>
          </div>
        )}

        {modalExcluir && (
          <div className="modal-overlay">
            <div className="simple-modal">
              <h2>Excluir Complemento</h2>

              <p>
                Deseja realmente excluir:
                <br />
                <br />
                <strong>{complementoSelecionado?.nome}</strong>?
              </p>

              <div className="modal-buttons">
                <button type="button" onClick={() => setModalExcluir(false)}>Cancelar</button>
                <button type="button" onClick={excluirComplemento}>Excluir</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default Complementos;