import { Router } from "express";
import {
  listarProdutos,
  cadastrarProduto,
  atualizarProduto,
  excluirProduto
} from "../controllers/produtos.controller.js";

const router = Router();

router.get("/", listarProdutos);
router.post("/", cadastrarProduto);
router.put("/:id", atualizarProduto);
router.delete("/:id", excluirProduto);

export default router;