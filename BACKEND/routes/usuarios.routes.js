import { Router } from "express";

import {
  listarUsuarios,
  cadastrarUsuario,
  alterarStatusUsuario,
  excluirUsuario
} from "../controllers/usuarios.controller.js";

const router = Router();

router.get("/", listarUsuarios);

router.post("/", cadastrarUsuario);

router.put("/:id/status", alterarStatusUsuario);

router.delete("/:id", excluirUsuario);

export default router;