import { useEffect, useState } from "react";
import "./AdminMaster.css";

const API = "http://localhost:3001";

function AdminMaster() {
  const [empresas, setEmpresas] = useState([]);
  const [empresa, setEmpresa] = useState({
    nome: "",
    responsavel: "",
    telefone: "",
    email: "",
    login: "",
    senha: ""
  });

  useEffect(() => {
    carregarEmpresas();
  }, []);

  async function carregarEmpresas() {
    try {
      const resposta = await fetch(`${API}/empresas`);
      const dados = await resposta.json();
      setEmpresas(dados);
    } catch (erro) {
      console.log(erro);
    }
  }

  async function cadastrarEmpresa() {
    if (!empresa.nome || !empresa.responsavel || !empresa.login || !empresa.senha) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }

    try {
      const resposta = await fetch(`${API}/empresas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(empresa)
      });

      if (resposta.ok) {
        alert("Empresa cadastrada com sucesso!");
        setEmpresa({ nome: "", responsavel: "", telefone: "", email: "", login: "", senha: "" });
        carregarEmpresas();
      } else {
        const dados = await resposta.json();
        alert(dados.erro || "Erro ao cadastrar empresa.");
      }
    } catch (erro) {
      console.log(erro);
    }
  }

  async function alterarStatus(id) {
    try {
      const resposta = await fetch(`${API}/empresas/${id}/status`, {
        method: "PUT"
      });

      if (resposta.ok) {
        carregarEmpresas();
      } else {
        const dados = await resposta.json();
        alert(dados.erro || "Erro ao alterar status da empresa.");
      }
    } catch (erro) {
      console.error("Erro na requisição:", erro);
    }
  }

  return (
    <div className="master-page">
      <div className="master-card">
        <h1>Painel Master</h1>
        <p>Cadastro de empresas</p>

        <div className="form-grid">
          <input
            placeholder="Empresa"
            value={empresa.nome}
            onChange={(e) => setEmpresa({ ...empresa, nome: e.target.value })}
          />
          <input
            placeholder="Responsável"
            value={empresa.responsavel}
            onChange={(e) => setEmpresa({ ...empresa, responsavel: e.target.value })}
          />
          <input
            placeholder="Telefone"
            value={empresa.telefone}
            onChange={(e) => setEmpresa({ ...empresa, telefone: e.target.value })}
          />
          <input
            placeholder="E-mail"
            value={empresa.email}
            onChange={(e) => setEmpresa({ ...empresa, email: e.target.value })}
          />
          <input
            placeholder="Login"
            value={empresa.login}
            onChange={(e) => setEmpresa({ ...empresa, login: e.target.value })}
          />
          <input
            type="password"
            placeholder="Senha"
            value={empresa.senha}
            onChange={(e) => setEmpresa({ ...empresa, senha: e.target.value })}
          />
        </div>

        <button className="btn-cadastrar" onClick={cadastrarEmpresa}>
          Cadastrar Empresa
        </button>

        <hr />

        <h2>Empresas Cadastradas</h2>
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "15px" }}>
          <thead>
            <tr style={{ background: "#f1f5f9", textAlign: "left" }}>
              <th style={{ padding: "12px" }}>Empresa</th>
              <th style={{ padding: "12px" }}>Responsável</th>
              <th style={{ padding: "12px" }}>Login</th>
              <th style={{ padding: "12px" }}>Status</th>
              <th style={{ padding: "12px" }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {empresas.map((emp) => (
              <tr key={emp.id} style={{ borderBottom: "1px solid #e2e8f0" }}>
                <td style={{ padding: "12px" }}>{emp.nome}</td>
                <td style={{ padding: "12px" }}>{emp.responsavel}</td>
                <td style={{ padding: "12px" }}>{emp.login}</td>
                <td style={{ padding: "12px" }}>
                  <span style={{
                    padding: "4px 8px",
                    borderRadius: "4px",
                    fontSize: "12px",
                    fontWeight: "bold",
                    background: emp.status === "Ativo" ? "#dcfce7" : "#fee2e2",
                    color: emp.status === "Ativo" ? "#15803d" : "#b91c1c"
                  }}>
                    {emp.status}
                  </span>
                </td>
                <td style={{ padding: "12px" }}>
                  <button
                    onClick={() => alterarStatus(emp.id)}
                    style={{
                      padding: "6px 12px",
                      borderRadius: "6px",
                      border: "none",
                      cursor: "pointer",
                      color: "#fff",
                      fontWeight: "bold",
                      backgroundColor: emp.status === "Ativo" ? "#ef4444" : "#22c55e"
                    }}
                  >
                    {emp.status === "Ativo" ? "Bloquear" : "Liberar"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminMaster;