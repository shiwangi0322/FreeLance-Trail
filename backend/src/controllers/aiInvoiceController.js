// src/controllers/aiInvoiceController.js
import { generateAiInvoiceService } from "../services/aiInvoiceService.js";

/**
 * Controller to handle AI invoice generation requests.
 * Delegates business logic to aiInvoiceService.
 *
 * POST /api/ai/invoice/:projectId
 */
export async function generateAiInvoiceController(req, res) {
  const { projectId } = req.params;

  if (!projectId) {
    return res.status(400).json({
      success: false,
      message: "projectId parameter is required.",
    });
  }

  try {
    const result = await generateAiInvoiceService({
      projectId,
      userId: req.user.id,
    });

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Project or proposal not found.",
      });
    }

    return res.status(201).json({
      success: true,
      message: "Invoice generated successfully",
      invoice: result.invoice,
    });
  } catch (error) {
    console.error("AI Invoice Generation Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to generate AI invoice.",
    });
  }
}
