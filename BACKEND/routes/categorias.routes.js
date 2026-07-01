import { Router } from "express";

import {
  listarCategorias,
  cadastrarCategoria
} from "../controllers/categorias.controller.js";

const router = Router();

router.get("/", listarCategorias);
router.post("/", cadastrarCategoria);

export default router;