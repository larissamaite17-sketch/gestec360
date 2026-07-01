import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";


import {
  LayoutDashboard,
  ShoppingCart,
  Wallet,
  Users,
  Package,
  FileText,
  Settings,
  ChevronDown,
  ChevronRight,
  Receipt,
  RotateCcw,
  Plus,
  List,
  Layers,
  Puzzle,
  Building2,
  DollarSign,
TrendingUp,
TrendingDown,
} from "lucide-react";


import logo from "../../assets/logotrans2.png";
import "./Sidebar.css";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [openSales, setOpenSales] = useState(
    location.pathname.includes("/vendas")
  );

  const [openProducts, setOpenProducts] = useState(
  location.pathname.includes("/produtos")
);

const [openConfig, setOpenConfig] = useState(
  location.pathname.includes("/configuracoes")
);

const [openFinanceiro, setOpenFinanceiro] = useState(
  location.pathname.includes("/financeiro")
);

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <img src={logo} alt="Gestec360" />
      </div>

      <nav>

        <a
          className={location.pathname === "/dashboard" ? "active" : ""}
          onClick={() => navigate("/dashboard")}
        >
          <LayoutDashboard size={19} />
          <span>Dashboard</span>
        </a>

        <div className="menu-group">
          <button
            className={`menu-button ${
              location.pathname.includes("/vendas") ? "active" : ""
            }`}
            onClick={() => setOpenSales(!openSales)}
          >
            <div className="menu-left">
              <ShoppingCart size={19} />
              <span>Vendas</span>
            </div>

            {openSales ? (
              <ChevronDown size={18} />
            ) : (
              <ChevronRight size={18} />
            )}
          </button>

          {openSales && (
            <div className="submenu">

              <a
                className={`submenu-item ${
                  location.pathname === "/vendas/nova"
                    ? "active-submenu"
                    : ""
                }`}
                onClick={() => navigate("/vendas/nova")}
              >
                <ShoppingCart size={16} />
                <span>Nova Venda</span>
              </a>

              <a
                className={`submenu-item ${
                  location.pathname === "/vendas/historico"
                    ? "active-submenu"
                    : ""
                }`}
                onClick={() => navigate("/vendas/historico")}
              >
                <Receipt size={16} />
                <span>Histórico de Vendas</span>
              </a>

              <a
                className={`submenu-item ${
                  location.pathname === "/vendas/devolucao"
                    ? "active-submenu"
                    : ""
                }`}
                onClick={() => navigate("/vendas/devolucao")}
              >
                <RotateCcw size={16} />
                <span>Devolução</span>
              </a>

            </div>
          )}
        </div>

        <div className="menu-group">

<button
className={`menu-button ${
location.pathname.includes("/financeiro")
? "active"
: ""
}`}
onClick={()=>setOpenFinanceiro(!openFinanceiro)}
>

<div className="menu-left">

<Wallet size={19}/>

<span>Financeiro</span>

</div>

{openFinanceiro ?

<ChevronDown size={18}/>

:

<ChevronRight size={18}/>

}

</button>

{openFinanceiro && (

<div className="submenu">

<a
className={`submenu-item ${
location.pathname==="/financeiro/caixa"
? "active-submenu"
: ""
}`}
onClick={()=>navigate("/financeiro/caixa")}
>

<DollarSign size={16}/>

Fluxo de Caixa

</a>

<a
className={`submenu-item ${
location.pathname==="/financeiro/receber"
? "active-submenu"
: ""
}`}
onClick={()=>navigate("/financeiro/receber")}
>

<TrendingUp size={16}/>

Contas a Receber

</a>

<a
className={`submenu-item ${
location.pathname==="/financeiro/pagar"
? "active-submenu"
: ""
}`}
onClick={()=>navigate("/financeiro/pagar")}
>

<TrendingDown size={16}/>

Contas a Pagar

</a>

</div>

)}

</div>

       


        <div className="menu-group">
  <button
    className={`menu-button ${
      location.pathname.includes("/produtos") ? "active" : ""
    }`}
    onClick={() => setOpenProducts(!openProducts)}
  >
    <div className="menu-left">
      <Package size={19} />
      <span>Produtos</span>
    </div>

    {openProducts ? (
      <ChevronDown size={18} />
    ) : (
      <ChevronRight size={18} />
    )}
  </button>

  {openProducts && (
    <div className="submenu">

      <a
        className={`submenu-item ${
          location.pathname === "/produtos/cadastrar"
            ? "active-submenu"
            : ""
        }`}
        onClick={() => navigate("/produtos/cadastrar")}
      >
        <Plus size={16} />
        <span>Cadastrar Produto</span>
      </a>

      <a
        className={`submenu-item ${
          location.pathname === "/produtos/lista"
            ? "active-submenu"
            : ""
        }`}
        onClick={() => navigate("/produtos/lista")}
      >
        <List size={16} />
        <span>Lista de Produtos</span>
      </a>

      <a
        className={`submenu-item ${
          location.pathname === "/produtos/grupos"
            ? "active-submenu"
            : ""
        }`}
        onClick={() => navigate("/produtos/grupos")}
      >
        <Layers size={16} />
        <span>Grupos</span>
      </a>

      <a
        className={`submenu-item ${
          location.pathname === "/produtos/complementos"
            ? "active-submenu"
            : ""
        }`}
        onClick={() => navigate("/produtos/complementos")}
      >
        <Puzzle size={16} />
        <span>Complementos</span>
      </a>

    </div>
  )}
</div>

        <a
className={location.pathname==="/relatorios" ? "active" : ""}
onClick={()=>navigate("/relatorios")}
>

<FileText size={19}/>

<span>Relatórios</span>

</a>

        <div className="menu-group">

  <button
    className={`menu-button ${
      location.pathname.includes("/configuracoes")
        ? "active"
        : ""
    }`}
    onClick={() => setOpenConfig(!openConfig)}
  >

    <div className="menu-left">

      <Settings size={19}/>

      <span>Configurações</span>

    </div>

    {openConfig ? (
      <ChevronDown size={18}/>
    ) : (
      <ChevronRight size={18}/>
    )}

  </button>

  {openConfig && (

    <div className="submenu">

<a
className={`submenu-item ${
location.pathname==="/configuracoes/empresa"
? "active-submenu"
: ""
}`}
onClick={()=>navigate("/configuracoes/empresa")}
>

<Building2 size={16}/>

Empresa

</a>

<a
className={`submenu-item ${
location.pathname==="/configuracoes/usuarios"
? "active-submenu"
: ""
}`}
onClick={()=>navigate("/configuracoes/usuarios")}
>

<Users size={16}/>

Usuários

</a>

</div>

  )}

</div>

      </nav>
    </aside>
  );
}

export default Sidebar;