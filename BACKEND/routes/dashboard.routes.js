import { Router } from "express";
import { resumoDashboard } from "../controllers/dashboard.controller.js";

const router = Router();

router.get("/", resumoDashboard);

export default router;