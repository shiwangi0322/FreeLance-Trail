// src/routes/clients.js
import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  getClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
} from "../controllers/clientController.js";

const router = Router();
router.use(requireAuth); // every route below requires a valid login

router.get("/", getClients);
router.get("/:id", getClientById);
router.post("/", createClient);
router.put("/:id", updateClient);
router.delete("/:id", deleteClient);

export default router;