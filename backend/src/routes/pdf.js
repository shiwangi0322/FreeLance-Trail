// src/routes/pdf.js
import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  downloadInvoicePdfController,
  downloadProposalPdfController,
  downloadContractPdfController,
} from "../controllers/pdfController.js";

const router = Router();

router.use(requireAuth);

router.get("/invoice/:invoiceId", downloadInvoicePdfController);
router.get("/proposal/:proposalId", downloadProposalPdfController);
router.get("/contract/:documentId", downloadContractPdfController);

export default router;