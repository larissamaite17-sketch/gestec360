import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./db.js";
pool.connect()
  .then(() => console.log("🔥 Conectado ao banco de dados com sucesso!"))
  .catch((err) => console.error("❌ Erro ao conectar no banco:", err.message));
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
app.get("/abc123", (req, res) => {
  res.send("FUNCIONOU");
});

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

app.use("/produtos", produtosRoutes);
app.use("/marcas", marcasRoutes);
app.use("/categorias", categoriasRoutes);
app.use("/grupos", gruposRoutes);

app.use("/complementos", complementosRoutes);

app.use("/dashboard", dashboardRoutes);


app.use("/vendas", vendasRoutes);

app.use("/fluxo-caixa", fluxoCaixaRoutes);

app.use("/contas-pagar", contasPagarRoutes);
app.use("/contas-receber", contasReceberRoutes);
app.use("/clientes", clientesRoutes);
app.use("/devolucoes", devolucoesRoutes);
app.use("/configuracoes", configuracoesRoutes);
app.use("/produtos", produtosRoutes);
app.use("/clientes", clientesRoutes);
app.use("/usuarios", usuariosRoutes);
app.use("/empresas", empresasRoutes);
app.use("/relatorios", relatoriosRoutes);

app.use("/login", loginRoutes);


app.get("/", (req, res) => {
  res.send("API Gestec360 funcionando!");
});

app.get("/teste-banco", async (req, res) => {
  try {
    const resultado = await pool.query("SELECT NOW()");
    res.json(resultado.rows[0]);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});