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
router.put("/:id", atualizarProduto);      // <-- Adicione esta linha para o editar
router.delete("/:id", excluirProduto);   // <-- Adicione esta linha para o excluir

export default router;