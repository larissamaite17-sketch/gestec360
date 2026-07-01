import { useEffect, useMemo, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import "./Usuarios.css";

const API = "/api";

function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [pesquisa, setPesquisa] = useState("");
  const [modalAberto, setModalAberto] = useState(false);

  const [novoUsuario, setNovoUsuario] = useState({
    nome: "",
    login: "",
    senha: "",
    cargo: "",
    permissao: "Caixa",
    status: "Ativo"
  });

  useEffect(() => {
    carregarUsuarios();
  }, []);

  async function carregarUsuarios() {
    try {
      const empresaId = localStorage.getItem("empresaId");
      const resposta = await fetch(`${API}/usuarios?empresa_id=${empresaId}`);
      const dados = await resposta.json();

      setUsuarios(dados);
    } catch (erro) {
      console.log(erro);
    }
  }

  async function salvarUsuario() {
    if (!novoUsuario.nome || !novoUsuario.login || !novoUsuario.senha) {
      alert("Preencha nome, login e senha.");
      return;
    }

    try {
      const empresaId = localStorage.getItem("empresaId");
      const resposta = await fetch(`${API}/usuarios`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          empresa_id: empresaId,
          nome: novoUsuario.nome,
          login: novoUsuario.login,
          email: novoUsuario.login,
          senha: novoUsuario.senha,
          tipo: novoUsuario.permissao
        })
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        alert(dados.erro);
        return;
      }

      await carregarUsuarios();
      setModalAberto(false);

      setNovoUsuario({
        nome: "",
        login: "",
        senha: "",
        cargo: "",
        permissao: "Caixa",
        status: "Ativo"
      });

      alert("Usuário cadastrado com sucesso!");
    } catch (erro) {
      console.log(erro);
      alert("Erro ao cadastrar usuário.");
    }
  }

  async function alterarStatus(id) {
    try {
      const empresaId = localStorage.getItem("empresaId");
      await fetch(`${API}/usuarios/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ empresa_id: empresaId })
      });

      carregarUsuarios();
    } catch (erro) {
      console.log(erro);
    }
  }

  const usuariosFiltrados = useMemo(() => {
    return usuarios.filter(item =>
      item.nome.toLowerCase().includes(pesquisa.toLowerCase()) ||
      item.login.toLowerCase().includes(pesquisa.toLowerCase()) ||
      item.tipo.toLowerCase().includes(pesquisa.toLowerCase())
    );
  }, [usuarios, pesquisa]);

  return (
    <MainLayout>
      <div className="usuarios-page">
        <div className="usuarios-header">
          <div>
            <h1>Usuários e Permissões</h1>
            <p>Cadastre funcionários e defina o nível de acesso ao sistema.</p>
          </div>

          <button
            className="btn-novo-usuario"
            onClick={() => setModalAberto(true)}
          >
            + Novo Usuário
          </button>
        </div>

        <div className="usuarios-card">
          <div className="usuarios-filtros">
            <input
              placeholder="Pesquisar usuário..."
              value={pesquisa}
              onChange={(e) => setPesquisa(e.target.value)}
            />
          </div>

          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Login</th>
                <th>Cargo</th>
                <th>Permissão</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {usuariosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan="6">Nenhum usuário cadastrado.</td>
                </tr>
              ) : (
                usuariosFiltrados.map(usuario => (
                  <tr key={usuario.id}>
                    <td>{usuario.nome}</td>
                    <td>{usuario.login}</td>
                    <td>{usuario.cargo || "-"}</td>
                    <td>{usuario.tipo}</td>
                    <td>
                      <span className={usuario.status === "Ativo" ? "status ativo" : "status inativo"}>
                        {usuario.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn-status"
                        onClick={() => alterarStatus(usuario.id)}
                      >
                        {usuario.status === "Ativo" ? "Desativar" : "Ativar"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {modalAberto && (
          <div className="modal-bg">
            <div className="modal-usuario">
              <div className="modal-topo">
                <h2>Novo Usuário</h2>
                <button
                  className="fechar-modal"
                  onClick={() => setModalAberto(false)}
                >
                  ✕
                </button>
              </div>

              <input
                placeholder="Nome do funcionário *"
                value={novoUsuario.nome}
                onChange={(e) => setNovoUsuario({ ...novoUsuario, nome: e.target.value })}
              />

              <input
                placeholder="Login / E-mail *"
                value={novoUsuario.login}
                onChange={(e) => setNovoUsuario({ ...novoUsuario, login: e.target.value })}
              />

              <input
                type="password"
                placeholder="Senha *"
                value={novoUsuario.senha}
                onChange={(e) => setNovoUsuario({ ...novoUsuario, senha: e.target.value })}
              />

              <input
                placeholder="Cargo"
                value={novoUsuario.cargo}
                onChange={(e) => setNovoUsuario({ ...novoUsuario, cargo: e.target.value })}
              />

              <select
                value={novoUsuario.permissao}
                onChange={(e) =>
                  setNovoUsuario({
                    ...novoUsuario,
                    permissao: e.target.value
                  })
                }
              >
                <option>Administrador</option>
                <option>Gerente</option>
                <option>Caixa</option>
              </select>

              <div className="modal-buttons">
                <button
                  className="cancelar"
                  onClick={() => setModalAberto(false)}
                >
                  Cancelar
                </button>

                <button
                  className="salvar"
                  onClick={salvarUsuario}
                >
                  Salvar Usuário
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default Usuarios;