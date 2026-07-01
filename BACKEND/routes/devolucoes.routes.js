import { Router } from "express";

import {
  listarDevolucoes,
  cadastrarDevolucao
} from "../controllers/devolucoes.controller.js";

const router = Router();

router.get("/", listarDevolucoes);

router.post("/", cadastrarDevolucao);

export default router;