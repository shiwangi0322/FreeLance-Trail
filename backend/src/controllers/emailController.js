// src/controllers/emailController.js
import PDFDocument from "pdfkit";
import { prisma } from "../lib/prisma.js";
import { generateInvoicePDF, generateProposalPDF } from "../services/pdfService.js";
import { sendMail } from "../services/emailService.js";

/**
 * Renders a PDFDocument fully in memory and resolves with the finished
 * Buffer, instead of piping it to an HTTP response like pdfController.js
 * does. Needed here because the PDF is going into an email attachment,
 * not directly to the browser — same generateInvoicePDF/generateProposalPDF
 * drawing functions from pdfService.js are reused either way, so the PDF
 * content itself stays perfectly consistent between the download and the
 * emailed copy.
 */
function renderPdfToBuffer(drawFn, data) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 50 });
    const chunks = [];

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    drawFn(doc, data);
    doc.end();
  });
}

/**
 * POST /api/email/invoice/:invoiceId
 * Loads the invoice (with items, project, client), verifies ownership,
 * generates the invoice PDF, and emails it to the client.
 */
export async function sendInvoiceEmail(req, res) {
  try {
    const invoice = await prisma.invoice.findFirst({
      where: { id: req.params.invoiceId, project: { userId: req.user.id } },
      include: {
        items: true,
        project: { include: { client: true } },
      },
    });

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found.",
      });
    }

    const client = invoice.project?.client;
    if (!client?.email) {
      return res.status(400).json({
        success: false,
        message: "This client has no email address on file.",
      });
    }

    const pdfBuffer = await renderPdfToBuffer(generateInvoicePDF, {
      invoice,
      items: invoice.items,
      project: invoice.project,
      client,
    });

    const html = `
      <p>Hi ${client.name},</p>
      <p>Please find attached invoice <strong>${invoice.number}</strong> for your project
      "<strong>${invoice.project?.title || "-"}</strong>". Let us know if you have any questions.</p>
      <p>Thank you for your business.</p>
    `;

    await sendMail({
      to: client.email,
      subject: `Invoice ${invoice.number} from Freedo`,
      html,
      attachment: { filename: `invoice-${invoice.number}.pdf`, content: pdfBuffer },
    });

    return res.status(200).json({
      success: true,
      message: "Email sent successfully.",
    });
  } catch (error) {
    console.error("Send invoice email error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send invoice email.",
    });
  }
}

/**
 * POST /api/email/proposal/:proposalId
 * Loads the proposal (with project, client), verifies ownership, generates
 * the proposal PDF, and emails it to the client.
 */
export async function sendProposalEmail(req, res) {
  try {
    const proposal = await prisma.proposal.findFirst({
      where: { id: req.params.proposalId, project: { userId: req.user.id } },
      include: {
        project: { include: { client: true } },
      },
    });

    if (!proposal) {
      return res.status(404).json({
        success: false,
        message: "Proposal not found.",
      });
    }

    const client = proposal.project?.client;
    if (!client?.email) {
      return res.status(400).json({
        success: false,
        message: "This client has no email address on file.",
      });
    }

    const pdfBuffer = await renderPdfToBuffer(generateProposalPDF, {
      proposal,
      project: proposal.project,
      client,
    });

    const projectTitle = proposal.project?.title || "your project";

    const html = `
      <p>Hi ${client.name},</p>
      <p>Please find attached our proposal for "<strong>${projectTitle}</strong>".
      We'd love to hear your thoughts and answer any questions you may have.</p>
      <p>Looking forward to working with you.</p>
    `;

    await sendMail({
      to: client.email,
      subject: `Proposal for ${projectTitle}`,
      html,
      attachment: { filename: `proposal-${proposal.id}.pdf`, content: pdfBuffer },
    });

    return res.status(200).json({
      success: true,
      message: "Email sent successfully.",
    });
  } catch (error) {
    console.error("Send proposal email error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send proposal email.",
    });
  }
}