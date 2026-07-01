import express from "express";
import {
  listarEmpresas,
  cadastrarEmpresa,
  alterarStatusEmpresa
} from "../controllers/empresas.controller.js";

const router = express.Router();

router.get("/", listarEmpresas);
router.post("/", cadastrarEmpresa);
router.put("/:id/status", alterarStatusEmpresa); // Rota para bloquear/liberar

export default router;