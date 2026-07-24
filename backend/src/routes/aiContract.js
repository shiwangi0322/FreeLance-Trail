// src/routes/aiContract.js
import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { generateAiContract } from "../controllers/aiContractController.js";

const router = Router();

// All AI contract routes require authentication
router.use(requireAuth);

/**
 * Route: POST /api/ai/contract/:projectId
 * Supporting /contract/:projectId and /:projectId paths
 */
router.post("/contract/:projectId", generateAiContract);
router.post("/:projectId", generateAiContract);

export default router;
