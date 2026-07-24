// src/controllers/invoiceItemController.js
import { prisma } from "../lib/prisma.js";

/**
 * Ownership chain: InvoiceItem -> Invoice -> Project -> User.
 * The InvoiceItem model has no direct userId, and the Invoice model has no
 * direct userId either — so every query here scopes ownership through the
 * nested relation: invoice.project.userId === req.user.id. Same pattern
 * used by documentController.js and invoiceController.js for one hop; this
 * one goes two hops deep since InvoiceItem sits one level further out.
 */

// Create a new invoice item, after confirming the target invoice belongs to a project owned by the logged-in user.
export async function createInvoiceItem(req, res) {
  const { invoiceId, name, description, qty, rate } = req.body;

  if (!invoiceId || !name) {
    return res.status(400).json({
      success: false,
      message: "invoiceId and name are both required.",
    });
  }

  try {
    // Confirm the invoice exists AND its project belongs to this user
    // before attaching a line item to it.
    const invoice = await prisma.invoice.findFirst({
      where: { id: invoiceId, project: { userId: req.user.id } },
    });

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found.",
      });
    }

    const invoiceItem = await prisma.invoiceItem.create({
      data: {
        invoiceId,
        name,
        description: description || null,
        qty: qty ?? 1,
        rate: rate ?? 0,
      },
    });

    return res.status(201).json(invoiceItem);
  } catch (error) {
    console.error("Create invoice item error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create invoice item.",
    });
  }
}

// Return all items belonging to a given invoice, oldest first, only if that invoice belongs to the logged-in user.
export async function getInvoiceItemsByInvoice(req, res) {
  try {
    const invoice = await prisma.invoice.findFirst({
      where: { id: req.params.invoiceId, project: { userId: req.user.id } },
    });

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found.",
      });
    }

    const invoiceItems = await prisma.invoiceItem.findMany({
      where: { invoiceId: req.params.invoiceId },
      orderBy: { createdAt: "asc" },
    });

    return res.status(200).json(invoiceItems);
  } catch (error) {
    console.error("Get invoice items error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch invoice items.",
    });
  }
}

// Return a single invoice item, only if its invoice's project belongs to the logged-in user.
export async function getInvoiceItemById(req, res) {
  try {
    const invoiceItem = await prisma.invoiceItem.findFirst({
      where: {
        id: req.params.id,
        invoice: { project: { userId: req.user.id } },
      },
    });

    if (!invoiceItem) {
      return res.status(404).json({
        success: false,
        message: "Invoice item not found.",
      });
    }

    return res.status(200).json(invoiceItem);
  } catch (error) {
    console.error("Get invoice item error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch invoice item.",
    });
  }
}

// Update only the provided fields on an invoice item owned (via invoice -> project) by the logged-in user.
export async function updateInvoiceItem(req, res) {
  const { name, description, qty, rate } = req.body;

  try {
    const existing = await prisma.invoiceItem.findFirst({
      where: {
        id: req.params.id,
        invoice: { project: { userId: req.user.id } },
      },
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Invoice item not found.",
      });
    }

    const invoiceItem = await prisma.invoiceItem.update({
      where: { id: req.params.id },
      data: {
        name: name ?? existing.name,
        description: description ?? existing.description,
        qty: qty ?? existing.qty,
        rate: rate ?? existing.rate,
      },
    });

    return res.status(200).json(invoiceItem);
  } catch (error) {
    console.error("Update invoice item error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update invoice item.",
    });
  }
}

// Delete an invoice item owned (via invoice -> project) by the logged-in user.
export async function deleteInvoiceItem(req, res) {
  try {
    const existing = await prisma.invoiceItem.findFirst({
      where: {
        id: req.params.id,
        invoice: { project: { userId: req.user.id } },
      },
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Invoice item not found.",
      });
    }

    await prisma.invoiceItem.delete({ where: { id: req.params.id } });

    return res.status(200).json({
      message: "Invoice item deleted successfully",
    });
  } catch (error) {
    console.error("Delete invoice item error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete invoice item.",
    });
  }
}