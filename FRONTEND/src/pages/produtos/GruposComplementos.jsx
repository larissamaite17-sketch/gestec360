import { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import { Plus, Pencil, Trash2 } from "lucide-react";
import "./GruposComplementos.css";

const API = "/api";

function GruposComplementos() {
  const [grupos, setGrupos] = useState([]);
  const [modalNovo, setModalNovo] = useState(false);
  const [modalExcluir, setModalExcluir] = useState(false);

  const [novoGrupo, setNovoGrupo] = useState("");
  const [grupoSelecionado, setGrupoSelecionado] = useState(null);
  const [editando, setEditando] = useState(false);

  useEffect(() => {
    carregarGrupos();
  }, []);

  async function carregarGrupos() {
    try {
      const empresaId = localStorage.getItem("empresaId");
      const resposta = await fetch(`${API}/grupos?empresa_id=${empresaId}`, {
        headers: { "x-empresa-id": empresaId }
      });
      const dados = await resposta.json();
      setGrupos(dados);
    } catch (err) {
      console.log("Erro ao buscar grupos:", err);
    }
  }

  function abrirNovo() {
    setNovoGrupo("");
    setEditando(false);
    setGrupoSelecionado(null);
    setModalNovo(true);
  }

  function editarGrupo(grupo) {
    setNovoGrupo(grupo.nome);
    setGrupoSelecionado(grupo);
    setEditando(true);
    setModalNovo(true);
  }

  async function salvarGrupo() {
    const empresaId = localStorage.getItem("empresaId");
    if (!novoGrupo.trim()) {
      alert("Informe o nome do grupo.");
      return;
    }

    const url = editando
      ? `${API}/grupos/${grupoSelecionado.id}`
      : `${API}/grupos`;

    const metodo = editando ? "PUT" : "POST";

    try {
      const resposta = await fetch(url, {
  method: metodo,
  headers: {
    "Content-Type": "application/json",
    "x-empresa-id": empresaId
  },
  body: JSON.stringify({
    nome: novoGrupo.trim(),
    empresa_id: empresaId
  })
});

      if (!resposta.ok) {
        const erro = await resposta.json();
        alert(erro.erro || "Erro ao salvar grupo.");
        return;
      }

      setNovoGrupo("");
      setModalNovo(false);
      setEditando(false);
      setGrupoSelecionado(null);
      await carregarGrupos();
    } catch (err) {
      console.log("Erro ao salvar:", err);
      alert("Erro ao conectar com o servidor.");
    }
  }

  function abrirExcluir(grupo) {
    setGrupoSelecionado(grupo);
    setModalExcluir(true);
  }

  async function excluirGrupo() {
  if (!grupoSelecionado) return;

  const empresaId = localStorage.getItem("empresaId");

  try {
    const resposta = await fetch(
      `${API}/grupos/${grupoSelecionado.id}?empresa_id=${empresaId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-empresa-id": empresaId
        }
      }
    );

    if (!resposta.ok) {
      const erro = await resposta.json();
      alert(erro.erro || "Erro ao excluir grupo.");
      return;
    }

    setModalExcluir(false);
    setGrupoSelecionado(null);
    carregarGrupos();

  } catch (err) {
    console.log(err);
    alert("Erro ao conectar com o servidor.");
  }
}

  return (
    <MainLayout>
      <div className="grupo-page">
        <div className="grupo-header">
          <div>
            <h1>Grupos de Complementos</h1>
            <p>Organize os grupos utilizados pelos produtos.</p>
          </div>

          <button className="novo-grupo-btn" onClick={abrirNovo}>
            <Plus size={18} />
            Novo Grupo
          </button>
        </div>

        <div className="grupo-card">
          <table>
            <thead>
              <tr>
                <th>Grupo</th>
                <th width="140">Ações</th>
              </tr>
            </thead>

            <tbody>
              {grupos.length === 0 ? (
                <tr>
                  <td colSpan="2">Nenhum grupo cadastrado.</td>
                </tr>
              ) : (
                grupos.map((grupo) => (
                  <tr key={grupo.id}>
                    <td>{grupo.nome}</td>
                    <td>
                      <button
                        className="action-btn"
                        onClick={() => editarGrupo(grupo)}
                      >
                        <Pencil size={18} />
                      </button>

                      <button
                        className="action-btn delete"
                        onClick={() => abrirExcluir(grupo)}
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
            <form className="simple-modal" onSubmit={(e) => { e.preventDefault(); salvarGrupo(); }}>
              <h2>{editando ? "Editar Grupo" : "Novo Grupo"}</h2>

              <input
                value={novoGrupo}
                onChange={(e) => setNovoGrupo(e.target.value)}
                placeholder="Nome do grupo"
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
              <h2>Excluir Grupo</h2>

              <p>
                Deseja realmente excluir o grupo:
                <br />
                <br />
                <strong>{grupoSelecionado?.nome}</strong>?
              </p>

              <div className="modal-buttons">
                <button type="button" onClick={() => setModalExcluir(false)}>Cancelar</button>
                <button type="button" onClick={excluirGrupo}>Excluir</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default GruposComplementos;