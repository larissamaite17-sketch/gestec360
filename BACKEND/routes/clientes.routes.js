import { Router } from "express";
import {
  listarClientes,
  cadastrarCliente,
  atualizarCliente,
  excluirCliente
} from "../controllers/clientes.controller.js";

const router = Router();

router.get("/", listarClientes);
router.post("/", cadastrarCliente);
router.put("/:id", atualizarCliente);
router.delete("/:id", excluirCliente);

export default router;