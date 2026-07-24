// src/controllers/documentController.js

import { prisma } from "../lib/prisma.js";

/**
 * Every function scopes its query using req.user.id (set by requireAuth)
 * so a logged-in user can only ever access documents that belong to
 * projects they own.
 */

// POST /api/documents
export async function createDocument(req, res) {
  const { projectId, name, folder, sizeMB, fileUrl } = req.body;

  if (!projectId || !name) {
    return res.status(400).json({
      success: false,
      message: "projectId and name are required.",
    });
  }

  try {
    // Verify project belongs to logged-in user
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId: req.user.id,
      },
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    const document = await prisma.document.create({
      data: {
        projectId,
        name,
        folder: folder || "OTHER",
        sizeMB: sizeMB ?? 0,
        fileUrl: fileUrl || null,
      },
    });

    return res.status(201).json(document);
  } catch (error) {
    console.error("Create document error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create document.",
    });
  }
}

// GET /api/documents
export async function getDocuments(req, res) {
  try {
    const documents = await prisma.document.findMany({
      where: {
        project: {
          userId: req.user.id,
        },
      },
      include: {
        project: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json(documents);
  } catch (error) {
    console.error("Get documents error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch documents.",
    });
  }
}

// GET /api/documents/:id
export async function getDocumentById(req, res) {
  try {
    const document = await prisma.document.findFirst({
      where: {
        id: req.params.id,
        project: {
          userId: req.user.id,
        },
      },
      include: {
        project: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found.",
      });
    }

    return res.status(200).json(document);
  } catch (error) {
    console.error("Get document error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch document.",
    });
  }
}

// PUT /api/documents/:id
export async function updateDocument(req, res) {
  const { name, folder, sizeMB, fileUrl } = req.body;

  try {
    const existing = await prisma.document.findFirst({
      where: {
        id: req.params.id,
        project: {
          userId: req.user.id,
        },
      },
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Document not found.",
      });
    }

    const document = await prisma.document.update({
      where: {
        id: req.params.id,
      },
      data: {
        name: name ?? existing.name,
        folder: folder ?? existing.folder,
        sizeMB: sizeMB ?? existing.sizeMB,
        fileUrl: fileUrl ?? existing.fileUrl,
      },
    });

    return res.status(200).json(document);
  } catch (error) {
    console.error("Update document error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update document.",
    });
  }
}

// DELETE /api/documents/:id
export async function deleteDocument(req, res) {
  try {
    const existing = await prisma.document.findFirst({
      where: {
        id: req.params.id,
        project: {
          userId: req.user.id,
        },
      },
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Document not found.",
      });
    }

    await prisma.document.delete({
      where: {
        id: req.params.id,
      },
    });

    return res.status(200).json({
      message: "Document deleted successfully",
    });
  } catch (error) {
    console.error("Delete document error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete document.",
    });
  }
}