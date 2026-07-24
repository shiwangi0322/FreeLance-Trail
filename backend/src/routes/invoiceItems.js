// src/routes/invoiceItems.js
import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  createInvoiceItem,
  getInvoiceItemsByInvoice,
  getInvoiceItemById,
  updateInvoiceItem,
  deleteInvoiceItem,
} from "../controllers/invoiceItemController.js";

const router = Router();

// Every route below requires a valid Bearer token — same pattern as
// clients.js, projects.js, documents.js, invoices.js.
router.use(requireAuth);

router.post("/", createInvoiceItem);
router.get("/item/:id", getInvoiceItemById);
router.get("/:invoiceId", getInvoiceItemsByInvoice);
router.put("/:id", updateInvoiceItem);
router.delete("/:id", deleteInvoiceItem);

export default router;