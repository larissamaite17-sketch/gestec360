import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./db.js";

// CONEXÃO COM BANCO
pool.connect()
  .then(() => console.log("🔥 Conectado ao banco de dados com sucesso!"))
  .catch((err) => console.error("❌ Erro ao conectar no banco:", err.message));

// ROTAS
import produtosRoutes from "./routes/produtos.routes.js";
import marcasRoutes from "./routes/marcas.routes.js";
import categoriasRoutes from "./routes/categorias.routes.js";
import gruposRoutes from "./routes/grupos.routes.js";
import complementosRoutes from "./routes/complementos.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import vendasRoutes from "./routes/vendas.routes.js";
import fluxoCaixaRoutes from "./routes/fluxoCaixa.routes.js";
import contasPagarRoutes from "./routes/contasPagar.routes.js";
import contasReceberRoutes from "./routes/contasReceber.routes.js";
import clientesRoutes from "./routes/clientes.routes.js";
import devolucoesRoutes from "./routes/devolucoes.routes.js";
import configuracoesRoutes from "./routes/configuracoes.routes.js";
import usuariosRoutes from "./routes/usuarios.routes.js";
import relatoriosRoutes from "./routes/relatorios.routes.js";
import loginRoutes from "./routes/login.routes.js";
import empresasRoutes from "./routes/empresas.routes.js";

dotenv.config();

const app = express();

// MIDDLEWARES
app.use(cors());
app.use(express.json());

// LOG DE REQUISIÇÕES
app.use((req, res, next) => {
  console.log(`📌 ${req.method} ${req.url}`);
  next();
});

// ===== ROTAS (SEM DUPLICIDADE) =====
app.use("/api/produtos", produtosRoutes);
app.use("/api/marcas", marcasRoutes);
app.use("/api/categorias", categoriasRoutes);
app.use("/api/grupos", gruposRoutes);
app.use("/api/complementos", complementosRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/vendas", vendasRoutes);
app.use("/api/fluxo-caixa", fluxoCaixaRoutes);
app.use("/api/contas-pagar", contasPagarRoutes);
app.use("/api/contas-receber", contasReceberRoutes);
app.use("/api/clientes", clientesRoutes);
app.use("/api/devolucoes", devolucoesRoutes);
app.use("/api/configuracoes", configuracoesRoutes);
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/empresas", empresasRoutes);
app.use("/api/relatorios", relatoriosRoutes);
app.use("/api/login", loginRoutes);

// ROTA DE TESTE
app.get("/api/abc123", (req, res) => {
  res.json({ mensagem: "FUNCIONOU" });
});

app.get("/api/teste-banco", async (req, res) => {
  try {
    const resultado = await pool.query("SELECT NOW()");
    res.json(resultado.rows[0]);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

app.get("/api", (req, res) => {
  res.json({ mensagem: "API Gestec360 funcionando!" });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});