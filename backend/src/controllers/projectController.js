// src/controllers/projectController.js
import { prisma } from "../lib/prisma.js";

// GET /api/projects
export async function getProjects(req, res) {
  try {
    const projects = await prisma.project.findMany({
      where: { userId: req.user.id },
      include: { client: { select: { id: true, name: true } } },
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json(projects);
  } catch (error) {
    console.error("Get projects error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch projects." });
  }
}

// GET /api/projects/:id
export async function getProjectById(req, res) {
  try {
    const project = await prisma.project.findFirst({
      where: { id: req.params.id, userId: req.user.id },
      include: { client: { select: { id: true, name: true } } },
    });
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found." });
    }
    res.status(200).json(project);
  } catch (error) {
    console.error("Get project error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch project." });
  }
}

// POST /api/projects
// NOTE: per schema, clientId is required — a project must belong to a client.
export async function createProject(req, res) {
  const { title, clientId, status, startDate, endDate, budget } = req.body;

  if (!title || !clientId) {
    return res.status(400).json({
      success: false,
      message: "Title and clientId are both required.",
    });
  }

  try {
    // Confirm the client belongs to this user before attaching a project to it —
    // otherwise a user could create a project under someone else's client id.
    const client = await prisma.client.findFirst({
      where: { id: clientId, userId: req.user.id },
    });
    if (!client) {
      return res.status(404).json({ success: false, message: "Client not found." });
    }

    const project = await prisma.project.create({
      data: {
        userId: req.user.id,
        clientId,
        title,
        status: status || "PLANNED",
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        budget: budget ?? 0,
      },
      include: { client: { select: { id: true, name: true } } },
    });
    res.status(201).json(project);
  } catch (error) {
    console.error("Create project error:", error);
    res.status(500).json({ success: false, message: "Failed to create project." });
  }
}

// PUT /api/projects/:id
export async function updateProject(req, res) {
  const { title, clientId, status, startDate, endDate, budget } = req.body;

  try {
    const existing = await prisma.project.findFirst({
      where: { id: req.params.id, userId: req.user.id },
    });
    if (!existing) {
      return res.status(404).json({ success: false, message: "Project not found." });
    }

    if (clientId && clientId !== existing.clientId) {
      const client = await prisma.client.findFirst({
        where: { id: clientId, userId: req.user.id },
      });
      if (!client) {
        return res.status(404).json({ success: false, message: "Client not found." });
      }
    }

    const project = await prisma.project.update({
      where: { id: req.params.id },
      data: {
        title: title ?? existing.title,
        clientId: clientId ?? existing.clientId,
        status: status ?? existing.status,
        startDate: startDate ? new Date(startDate) : existing.startDate,
        endDate: endDate ? new Date(endDate) : existing.endDate,
        budget: budget ?? existing.budget,
      },
      include: { client: { select: { id: true, name: true } } },
    });
    res.status(200).json(project);
  } catch (error) {
    console.error("Update project error:", error);
    res.status(500).json({ success: false, message: "Failed to update project." });
  }
}

// DELETE /api/projects/:id
export async function deleteProject(req, res) {
  try {
    const existing = await prisma.project.findFirst({
      where: { id: req.params.id, userId: req.user.id },
    });
    if (!existing) {
      return res.status(404).json({ success: false, message: "Project not found." });
    }

    // Cascades to this project's Documents/Invoices/Proposals per schema.
    await prisma.project.delete({ where: { id: req.params.id } });
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Delete project error:", error);
    res.status(500).json({ success: false, message: "Failed to delete project." });
  }
}