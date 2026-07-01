import logoTrans from '../../assets/logotrans.png'
import './Login.css'
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { BarChart3, Rocket } from "lucide-react";

function Login() {
  const navigate = useNavigate();
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");

  const API = "/api";

  async function entrar(e) {
    e.preventDefault();

    try {
      const resposta = await fetch(`${API}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ login, senha })
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        alert(dados.erro);
        return;
      }

      localStorage.setItem("empresaId", dados.usuario.empresa_id);
      localStorage.setItem("tipoLogin", dados.tipo);

      navigate("/dashboard");
    } catch (erro) {
      console.error(erro);
      alert("Erro ao conectar ao servidor.");
    }
  }

  return (
    <main className="login-screen">
      <section className="login-brand">
        <div className="brand-light light-one"></div>
        <div className="brand-light light-two"></div>

        <div className="brand-text">
          <h2>
            Gestão completa. <br />
            Resultados reais. <br />
            <span>Visão 360°</span> do seu negócio.
          </h2>
          <p>
            Centralize vendas, clientes, produtos e financeiro em uma única
            plataforma inteligente.
          </p>
        </div>

        <div className="features">
          <div className="feature">
            <div className="feature-icon">
              <BarChart3 size={28} strokeWidth={2.2}/>
            </div>
            <div>
              <strong>Dashboard inteligente</strong>
              <p>Indicadores em tempo real.</p>
            </div>
          </div>

          <div className="feature">
            <div className="feature-icon">
              <Rocket size={28} strokeWidth={2.2}/>
            </div>
            <div>
              <strong>Crescimento com dados</strong>
              <p>Decisões com mais clareza.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="login-area">
        <div className="login-card">
          <img className="login-main-logo" src={logoTrans} alt="Gestec360" />

          <div className="login-title">
            <h2>Bem-vindo!</h2>
            <p>Acesse o painel da sua empresa.</p>
          </div>

          <form onSubmit={entrar}>
            <label>
              E-mail
              <input
                type="text"
                placeholder="Digite seu login ou e-mail"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
              />
            </label>

            <label>
              Senha
              <input
                type="password"
                placeholder="Digite sua senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
            </label>

            <div className="login-options">
              <a 
                href="https://wa.me/5517992136303?text=Olá! Esqueci minha senha do Gestec360 e preciso de suporte para recuperar o acesso." 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ color: '#2563eb', textDecoration: 'none', fontSize: '14px' }}
              >
                Esqueci minha senha
              </a>
            </div>

            <button type="submit"> Entrar </button>
          </form>
        </div>
      </section>
    </main>
  )
}

export default Login;