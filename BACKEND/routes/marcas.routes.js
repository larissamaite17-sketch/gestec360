import { Router } from "express";
import {
  listarMarcas,
  cadastrarMarca
} from "../controllers/marcas.controller.js";

const router = Router();

router.get("/", listarMarcas);
router.post("/", cadastrarMarca); // <-- O Front-end envia um POST para cá!

export default router;