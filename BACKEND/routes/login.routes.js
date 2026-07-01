import express from "express";
import { fazerLogin } from "../controllers/login.controller.js";

const router = express.Router();

router.post("/", fazerLogin);

export default router;