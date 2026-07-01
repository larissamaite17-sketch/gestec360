import { Router } from "express";

import {
  listarComplementos,
  cadastrarComplemento,
  editarComplemento,
  excluirComplemento
} from "../controllers/complementos.controller.js";

const router = Router();

router.get("/", listarComplementos);
router.post("/", cadastrarComplemento);
router.put("/:id", editarComplemento);
router.delete("/:id", excluirComplemento);

export default router;