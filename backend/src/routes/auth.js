// src/routes/auth.js
import { Router } from "express";
import { register, login, getMe } from "../controllers/authController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// POST /api/auth/register
router.post("/register", register);

// POST /api/auth/login
router.post("/login", login);

// GET /api/auth/me — protected, needs a valid Bearer token
router.get("/me", requireAuth, getMe);

export default router;