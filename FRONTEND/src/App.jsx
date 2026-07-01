import { Routes, Route } from 'react-router-dom'

import Login from './pages/login/Login'
import Dashboard from './pages/dashboard/Dashboard'
import NovaVenda from './pages/vendas/NovaVenda'
import HistoricoVendas from './pages/vendas/HistoricoVendas'
import Devolucao from './pages/vendas/Devolucao'
import CadastroProduto from "./pages/produtos/CadastroProduto";
import ListaProdutos from "./pages/produtos/ListaProdutos";
import GruposComplementos from "./pages/produtos/GruposComplementos";
import Complementos from "./pages/produtos/Complementos";
import ConfiguracoesEmpresa from "./pages/configuracoes/ConfiguracoesEmpresa";
import FluxoCaixa from "./pages/financeiro/FluxoCaixa";
import ContasReceber from "./pages/financeiro/ContasReceber";
import ContasPagar from "./pages/financeiro/ContasPagar";
import Clientes from "./pages/Clientes/Clientes";
import Usuarios from "./pages/configuracoes/Usuarios";
import Relatorios from "./pages/relatorios/Relatorios";
import AdminMaster from "./pages/master/AdminMaster";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/vendas/nova" element={<NovaVenda />} />
      <Route path="/vendas/historico" element={<HistoricoVendas />} />
      <Route path="/clientes" element={<Clientes />} />
      <Route path="/vendas/devolucao" element={<Devolucao />} />    
      <Route
  path="/produtos/cadastrar"
  element={<CadastroProduto />}
/>

<Route
  path="/produtos/lista"
  element={<ListaProdutos />}
/>

<Route
  path="/produtos/grupos"
  element={<GruposComplementos />}
/>

<Route
  path="/produtos/complementos"
  element={<Complementos />}
/>

<Route
path="/configuracoes/empresa"
element={<ConfiguracoesEmpresa/>}
/>

<Route
path="/financeiro/caixa"
element={<FluxoCaixa/>}
/>

<Route
path="/financeiro/receber"
element={<ContasReceber/>}
/>

<Route
path="/financeiro/pagar"
element={<ContasPagar/>}
/>


<Route
path="/configuracoes/usuarios"
element={<Usuarios/>}
/>
    
<Route
path="/relatorios"
element={<Relatorios/>}
/>

<Route
path="/master-gestec360"
element={<AdminMaster/>}
/>

    </Routes>


)
}

export default App