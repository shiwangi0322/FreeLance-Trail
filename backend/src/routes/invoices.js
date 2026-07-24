// src/routes/invoices.js
// TODO: build out full CRUD (with InvoiceItem line items) once you're ready.
// src/routes/invoices.js

import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";

import {
  createInvoice,
  getInvoices,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
} from "../controllers/invoiceController.js";

const router = Router();

// Every route below requires authentication
router.use(requireAuth);

// CRUD Routes
router.post("/", createInvoice);
router.get("/", getInvoices);
router.get("/:id", getInvoiceById);
router.put("/:id", updateInvoice);
router.delete("/:id", deleteInvoice);

export default router;