// src/routes/documents.js

import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";

import {
  createDocument,
  getDocuments,
  getDocumentById,
  updateDocument,
  deleteDocument,
} from "../controllers/documentController.js";

const router = Router();

/**
 * Every route below requires a valid JWT.
 * The requireAuth middleware verifies the token
 * and attaches req.user to every request.
 */
router.use(requireAuth);

// Create a document
router.post("/", createDocument);

// Get all documents
router.get("/", getDocuments);

// Get document by ID
router.get("/:id", getDocumentById);

// Update document
router.put("/:id", updateDocument);

// Delete document
router.delete("/:id", deleteDocument);

export default router;