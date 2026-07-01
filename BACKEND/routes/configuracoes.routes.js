import { Router } from "express";
import {
  buscarConfiguracoes,
  salvarConfiguracoes
} from "../controllers/configuracoes.controller.js";

const router = Router();

router.get("/", buscarConfiguracoes);
router.post("/", salvarConfiguracoes);

export default router;