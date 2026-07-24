// src/controllers/clientController.js
import { prisma } from "../lib/prisma.js";

/**
 * Every function here scopes queries with `userId: req.user.id` (set by
 * requireAuth) so one user can never see or modify another user's clients.
 */

// GET /api/clients
export async function getClients(req, res) {
  try {
    const clients = await prisma.client.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json(clients);
  } catch (error) {
    console.error("Get clients error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch clients." });
  }
}

// GET /api/clients/:id
export async function getClientById(req, res) {
  try {
    const client = await prisma.client.findFirst({
      where: { id: req.params.id, userId: req.user.id },
    });
    if (!client) {
      return res.status(404).json({ success: false, message: "Client not found." });
    }
    res.status(200).json(client);
  } catch (error) {
    console.error("Get client error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch client." });
  }
}

// POST /api/clients
export async function createClient(req, res) {
  const { name, email, status, avatarColor } = req.body;

  if (!name) {
    return res.status(400).json({ success: false, message: "Client name is required." });
  }

  try {
    const client = await prisma.client.create({
      data: {
        userId: req.user.id,
        name,
        email: email || null,
        status: status || "ACTIVE",
        avatarColor: avatarColor || "#8B5CF6",
      },
    });
    res.status(201).json(client);
  } catch (error) {
    console.error("Create client error:", error);
    res.status(500).json({ success: false, message: "Failed to create client." });
  }
}

// PUT /api/clients/:id
export async function updateClient(req, res) {
  const { name, email, status, avatarColor } = req.body;

  try {
    const existing = await prisma.client.findFirst({
      where: { id: req.params.id, userId: req.user.id },
    });
    if (!existing) {
      return res.status(404).json({ success: false, message: "Client not found." });
    }

    const client = await prisma.client.update({
      where: { id: req.params.id },
      data: {
        name: name ?? existing.name,
        email: email ?? existing.email,
        status: status ?? existing.status,
        avatarColor: avatarColor ?? existing.avatarColor,
      },
    });
    res.status(200).json(client);
  } catch (error) {
    console.error("Update client error:", error);
    res.status(500).json({ success: false, message: "Failed to update client." });
  }
}

// DELETE /api/clients/:id
export async function deleteClient(req, res) {
  try {
    const existing = await prisma.client.findFirst({
      where: { id: req.params.id, userId: req.user.id },
    });
    if (!existing) {
      return res.status(404).json({ success: false, message: "Client not found." });
    }

    // Deleting a client cascades to its Projects (per schema's onDelete: Cascade),
    // which in turn cascades to those projects' Documents/Invoices/Proposals.
    await prisma.client.delete({ where: { id: req.params.id } });
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Delete client error:", error);
    res.status(500).json({ success: false, message: "Failed to delete client." });
  }
}