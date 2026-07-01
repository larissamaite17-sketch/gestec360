import { Router } from "express";
import { listarFluxoCaixa } from "../controllers/fluxoCaixa.controller.js";

const router = Router();

router.get("/", listarFluxoCaixa);

export default router;