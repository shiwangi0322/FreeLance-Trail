import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";

import {
  getDashboardStats,
  getRecentProjects,
  getRecentInvoices,
  getRecentProposals,
} from "../controllers/dashboardController.js";

const router = Router();

router.use(requireAuth);

router.get("/stats", getDashboardStats);
router.get("/recent-projects", getRecentProjects);
router.get("/recent-invoices", getRecentInvoices);
router.get("/recent-proposals", getRecentProposals);

export default router;