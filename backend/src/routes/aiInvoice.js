// src/routes/aiInvoice.js
import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { generateAiInvoiceController } from "../controllers/aiInvoiceController.js";

const router = Router();

// Require JWT authentication for AI Invoice route
router.use(requireAuth);

/**
 * Route: POST /api/ai/invoice/:projectId
 * Supporting /invoice/:projectId and /:projectId route mounts
 */
router.post("/invoice/:projectId", generateAiInvoiceController);
router.post("/:projectId", generateAiInvoiceController);

export default router;
