// src/controllers/invoiceController.js

import { prisma } from "../lib/prisma.js";

/**
 * Every function scopes its queries using req.user.id (set by requireAuth)
 * so a logged-in user can only ever access invoices that belong to
 * projects they own.
 */

// POST /api/invoices
export async function createInvoice(req, res) {
  const {
    projectId,
    number,
    status,
    issueDate,
    dueDate,
    taxRate,
    amountPaid,
    notes,
  } = req.body;

  if (!projectId || !number) {
    return res.status(400).json({
      success: false,
      message: "projectId and number are required.",
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

    const invoice = await prisma.invoice.create({
      data: {
        projectId,
        number,
        status: status || "DRAFT",
        issueDate: issueDate ? new Date(issueDate) : new Date(),
        dueDate: dueDate ? new Date(dueDate) : null,
        taxRate: taxRate ?? 18,
        amountPaid: amountPaid ?? 0,
        notes: notes || null,
      },
    });

    return res.status(201).json(invoice);
  } catch (error) {
    console.error("Create invoice error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create invoice.",
    });
  }
}

// GET /api/invoices
export async function getInvoices(req, res) {
  try {
    const invoices = await prisma.invoice.findMany({
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

    return res.status(200).json(invoices);
  } catch (error) {
    console.error("Get invoices error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch invoices.",
    });
  }
}

// GET /api/invoices/:id
export async function getInvoiceById(req, res) {
  try {
    const invoice = await prisma.invoice.findFirst({
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
        items: true,
      },
    });

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found.",
      });
    }

    return res.status(200).json(invoice);
  } catch (error) {
    console.error("Get invoice error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch invoice.",
    });
  }
}

// PUT /api/invoices/:id
export async function updateInvoice(req, res) {
  const {
    number,
    status,
    issueDate,
    dueDate,
    taxRate,
    amountPaid,
    notes,
  } = req.body;

  try {
    const existing = await prisma.invoice.findFirst({
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
        message: "Invoice not found.",
      });
    }

    const invoice = await prisma.invoice.update({
      where: {
        id: req.params.id,
      },
      data: {
        number: number ?? existing.number,
        status: status ?? existing.status,
        issueDate: issueDate ? new Date(issueDate) : existing.issueDate,
        dueDate: dueDate ? new Date(dueDate) : existing.dueDate,
        taxRate: taxRate ?? existing.taxRate,
        amountPaid: amountPaid ?? existing.amountPaid,
        notes: notes ?? existing.notes,
      },
    });

    return res.status(200).json(invoice);
  } catch (error) {
    console.error("Update invoice error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update invoice.",
    });
  }
}

// DELETE /api/invoices/:id
export async function deleteInvoice(req, res) {
  try {
    const existing = await prisma.invoice.findFirst({
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
        message: "Invoice not found.",
      });
    }

    await prisma.invoice.delete({
      where: {
        id: req.params.id,
      },
    });

    return res.status(200).json({
      message: "Invoice deleted successfully",
    });
  } catch (error) {
    console.error("Delete invoice error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete invoice.",
    });
  }
}