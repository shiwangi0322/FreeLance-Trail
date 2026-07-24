// src/controllers/aiContractController.js
import { generateAiContractService } from "../services/aiContractService.js";

/**
 * Controller to handle AI contract generation request.
 * Delegates business logic to aiContractService and returns structured JSON response.
 *
 * POST /api/ai/contract/:projectId
 */
export async function generateAiContract(req, res) {
  const { projectId } = req.params;

  if (!projectId) {
    return res.status(400).json({
      success: false,
      message: "projectId parameter is required.",
    });
  }

  try {
    const result = await generateAiContractService({
      projectId,
      userId: req.user.id,
    });

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    return res.status(201).json({
      success: true,
      message: "Contract created successfully",
      contract: result.contractText,
      document: result.document,
    });
  } catch (error) {
    console.error("AI Contract Generation Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to generate AI contract.",
    });
  }
}
