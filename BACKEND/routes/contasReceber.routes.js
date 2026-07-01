import { Router } from "express";
import {
  listarContasReceber,
  cadastrarContaReceber,
  receberConta
} from "../controllers/contasReceber.controller.js";

const router = Router();

router.get("/", listarContasReceber);
router.post("/", cadastrarContaReceber);
router.put("/:id/receber", receberConta);

export default router;