// src/routes/aiProposal.js
import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { generateAiProposal } from "../controllers/aiProposalController.js";

const router = Router();

// All AI proposal endpoints require authentication
router.use(requireAuth);

/**
 * Route: POST /api/ai/proposal/:projectId
 * Supporting both /proposal/:projectId and /:projectId paths for flexibility based on router mount point.
 */
router.post("/proposal/:projectId", generateAiProposal);
router.post("/:projectId", generateAiProposal);

export default router;
