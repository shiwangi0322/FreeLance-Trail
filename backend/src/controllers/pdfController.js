// src/controllers/pdfController.js
import { prisma } from "../lib/prisma.js";
import { renderPdfToBuffer } from "../services/pdfService.js";

/**
 * GET /api/pdf/invoice/:invoiceId
 * Loads the invoice with its items, project, and client, verifies
 * ownership via project.userId, generates the PDF, and streams it back.
 */
export async function downloadInvoicePdfController(req, res) {
  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id: req.params.invoiceId },
      include: {
        project: { include: { client: true } },
        items: true,
      },
    });

    if (!invoice || invoice.project?.userId !== req.user.id) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found.",
      });
    }

    let pdfBuffer;
    try {
      pdfBuffer = await renderPdfToBuffer("invoice", {
        invoice,
        items: invoice.items,
        project: invoice.project,
        client: invoice.project?.client,
      });
    } catch (pdfError) {
      console.error("Invoice PDF render error:", pdfError);
      return res.status(500).json({
        success: false,
        message: "Failed to generate PDF.",
      });
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="Invoice-${invoice.number}.pdf"`);
    return res.send(pdfBuffer);
  } catch (error) {
    console.error("Download invoice PDF error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to generate PDF.",
    });
  }
}

/**
 * GET /api/pdf/proposal/:proposalId
 * Loads the proposal with its project and client, verifies ownership via
 * project.userId, generates the PDF, and streams it back.
 */
export async function downloadProposalPdfController(req, res) {
  try {
    const proposal = await prisma.proposal.findUnique({
      where: { id: req.params.proposalId },
      include: {
        project: { include: { client: true } },
      },
    });

    if (!proposal || proposal.project?.userId !== req.user.id) {
      return res.status(404).json({
        success: false,
        message: "Proposal not found.",
      });
    }

    let pdfBuffer;
    try {
      pdfBuffer = await renderPdfToBuffer("proposal", {
        proposal,
        project: proposal.project,
        client: proposal.project?.client,
      });
    } catch (pdfError) {
      console.error("Proposal PDF render error:", pdfError);
      return res.status(500).json({
        success: false,
        message: "Failed to generate PDF.",
      });
    }

    const safeTitle = (proposal.project?.title || "Proposal").replace(/[^a-z0-9\- ]/gi, "");
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="Proposal-${safeTitle}.pdf"`);
    return res.send(pdfBuffer);
  } catch (error) {
    console.error("Download proposal PDF error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to generate PDF.",
    });
  }
}

/**
 * GET /api/pdf/contract/:documentId
 * Loads the Document row (where folder = "CONTRACTS") with its project and
 * client, verifies ownership via project.userId, generates the PDF, and
 * streams it back.
 *
 * NOTE: there is no separate Contract model — the generated contract TEXT
 * lives entirely inside document.fileUrl as one block, not as separate
 * scope/terms/paymentTerms/ownership/termination fields. Since pdfService.js
 * (generateContractPDF) expects those as distinct optional fields and can't
 * be modified, the full stored text is passed in as `scope` here (the main
 * body section), and the other sections fall back to pdfService's own
 * built-in default paragraphs. If you later want the contract split into
 * proper sections, that would need to happen at generation time (when the
 * contract text is first created and saved), not here at PDF-download time.
 */
export async function downloadContractPdfController(req, res) {
  try {
    const document = await prisma.document.findFirst({
      where: { id: req.params.documentId, folder: "CONTRACTS" },
      include: {
        project: { include: { client: true } },
      },
    });

    if (!document || document.project?.userId !== req.user.id) {
      return res.status(404).json({
        success: false,
        message: "Contract not found.",
      });
    }

    // Look up the freelancer's own name/email to show in the "Freelancer" block.
    const freelancer = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { name: true, email: true },
    });

    let pdfBuffer;
    try {
      pdfBuffer = await renderPdfToBuffer("contract", {
        contract: { scope: document.fileUrl },
        project: document.project,
        client: document.project?.client,
        freelancer,
      });
    } catch (pdfError) {
      console.error("Contract PDF render error:", pdfError);
      return res.status(500).json({
        success: false,
        message: "Failed to generate PDF.",
      });
    }

    const safeTitle = (document.project?.title || "Contract").replace(/[^a-z0-9\- ]/gi, "");
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="Contract-${safeTitle}.pdf"`);
    return res.send(pdfBuffer);
  } catch (error) {
    console.error("Download contract PDF error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to generate PDF.",
    });
  }
}