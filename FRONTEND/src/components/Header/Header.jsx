import "./Header.css";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Bell, Search, LogOut } from "lucide-react"; // Removido ChevronDown e adicionado apenas o LogOut

function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const [pesquisa, setPesquisa] = useState("");

  const temNotificacao = false;

  const hoje = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const titulosPaginas = {
    "/dashboard": "Dashboard",
    "/vendas/nova": "Nova Venda",
    "/vendas/historico": "Histórico de Vendas",
    "/vendas/devolucao": "Devolução",
    "/financeiro": "Financeiro",
    "/clientes": "Clientes",
    "/produtos": "Produtos",
    "/relatorios": "Relatórios",
    "/configuracoes": "Configurações",
  };

  const handleLogout = () => {
    navigate("/");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Pesquisando por:", pesquisa);
  };

  return (
    <header className="header">
      <div>
        {location.pathname === "/dashboard" ? (
          <>
            <h1>Dashboard</h1>
            <p>{hoje}</p>
          </>
        ) : (
          <p className="header-date">{hoje}</p>
        )}
      </div>

      <div className="header-right">
        <div className="search">
          <input
            type="text"
            placeholder="Pesquisar..."
            value={pesquisa}
            onChange={(e) => setPesquisa(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch(e);
            }}
          />
          <Search size={18} className="search-icon" />
        </div>

        <button className="notification" type="button">
          <Bell size={20} />
          {temNotificacao && <span></span>}
        </button>

        {/* ALTERADO AQUI: Removida a caixa "Larissa (ADM)" e colocado o botão Sair direto */}
        <button
          className="logout-direct-btn"
          type="button"
          onClick={handleLogout}
          title="Sair do sistema"
        >
          <LogOut size={20} />
          <span>Sair</span>
        </button>
      </div>
    </header>
  );
}

export default Header;