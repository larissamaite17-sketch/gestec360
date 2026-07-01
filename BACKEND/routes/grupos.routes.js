import { Router } from "express";

import {
  listarGrupos,
  cadastrarGrupo,
  editarGrupo,
  excluirGrupo
} from "../controllers/grupos.controller.js";

const router = Router();

router.get("/", listarGrupos);
router.post("/", cadastrarGrupo);
router.put("/:id", editarGrupo);
router.delete("/:id", excluirGrupo);

export default router;