import { Router } from "express";
import {
  listarContasPagar,
  cadastrarContaPagar,
  pagarConta
} from "../controllers/contasPagar.controller.js";

const router = Router();

router.get("/", listarContasPagar);
router.post("/", cadastrarContaPagar);
router.put("/:id/pagar", pagarConta);

export default router;