// src/routes/email.js
import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { sendInvoiceEmail, sendProposalEmail } from "../controllers/emailController.js";

const router = Router();

router.use(requireAuth);

router.post("/invoice/:invoiceId", sendInvoiceEmail);
router.post("/proposal/:proposalId", sendProposalEmail);

export default router;