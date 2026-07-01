import { Router } from "express";

import {
  relatorioVendas,
  relatorioFinanceiro,
  relatorioProdutos
} from "../controllers/relatorios.controller.js";

const router = Router();

router.get("/vendas", relatorioVendas);

router.get("/financeiro", relatorioFinanceiro);

router.get("/produtos", relatorioProdutos);

export default router;