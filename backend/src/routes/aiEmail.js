import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  generateEmailController,
  sendEmailController,
} from "../controllers/aiEmailController.js";

const router = Router();

router.use(requireAuth);

// Generate Email
router.post("/email/:projectId", generateEmailController);

// Send Email
router.post("/email/:projectId/send", sendEmailController);

export default router;