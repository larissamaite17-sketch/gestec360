import { Router } from "express";

import {
  listarVendas,
  cadastrarVenda,
  atualizarStatusVenda
} from "../controllers/vendas.controller.js";

const router = Router();

router.get("/", listarVendas);
router.post("/", cadastrarVenda);
router.put("/:id/status", atualizarStatusVenda);

export default router;