// src/routes/proposals.js

import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";

import {
  createProposal,
  getProposals,
  getProposalById,
  updateProposal,
  deleteProposal,
} from "../controllers/proposalController.js";

const router = Router();

// Every route below requires authentication
router.use(requireAuth);

// CRUD Routes
router.post("/", createProposal);
router.get("/", getProposals);
router.get("/:id", getProposalById);
router.put("/:id", updateProposal);
router.delete("/:id", deleteProposal);

export default router;